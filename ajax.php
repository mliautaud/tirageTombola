<?php
	require_once 'connexion.php';
	
	global $db;
	
	switch ($_POST['action'] ?? 'rien') {
		case 'getTickets' :
			$results = $db->query('SELECT * FROM (SELECT * FROM tickets WHERE NOM != "") t LEFT JOIN lots l ON t.ID_TICKET = l.TICKET_GAGNANT WHERE l.ID_LOT IS NULL ORDER BY t.NUMERO');
			$rows = array();
			while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
				$rows[] = $row;
			}
			
			echo json_encode($rows, JSON_INVALID_UTF8_IGNORE);
			
			break;
		
		case 'getLots' :
			// $results = $db->query('SELECT * FROM lots l WHERE l.TICKET_GAGNANT IS NULL');
			$results = $db->query('SELECT * FROM lots l ORDER BY l.ORDRE');
			$rows = array();
			while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
				$rows[] = $row;
			}
			
			echo json_encode($rows, JSON_INVALID_UTF8_IGNORE);
			
			break;
		
		case 'gagnerLot' :
			$qui = $_POST['gagnant'];
			$quoi = $_POST['lot'];
			
			$sql = 'UPDATE lots SET TICKET_GAGNANT='.$qui.' WHERE ID_LOT='.$quoi;
			$db->query($sql);
			
			break;
		
		case 'getGagnants' :
			$dernierLot = $_POST['dernier_lot'];
			$typeTirage = $_POST['typeTirage'] ?? null;
			
			// $results = $db->query('SELECT * FROM lots l INNER JOIN tickets t ON l.TICKET_GAGNANT = t.ID_TICKET WHERE ID_LOT > '.$dernierLot.' ORDER BY ORDRE');
			if ( $dernierLot != 0 ) {
				if ( !empty($typeTirage) && $typeTirage === 'true' ) {
					$q = 'SELECT * FROM lots l INNER JOIN tickets t ON l.TICKET_GAGNANT = t.ID_TICKET WHERE l.ORDRE = ( SELECT r.ORDRE FROM lots r WHERE r.ID_LOT='.$dernierLot.') ORDER BY l.ORDRE';
					// var_dump( $q );
					$results = $db->query($q);
				} else {
					$q = 'SELECT * FROM lots l INNER JOIN tickets t ON l.TICKET_GAGNANT = t.ID_TICKET WHERE l.ORDRE > ( SELECT r.ORDRE FROM lots r WHERE r.ID_LOT='.$dernierLot.') ORDER BY l.ORDRE';
					$results = $db->query($q);
				}
			} else {
				$q = 'SELECT * FROM lots l INNER JOIN tickets t ON l.TICKET_GAGNANT = t.ID_TICKET ORDER BY l.ORDRE';
				$results = $db->query($q);
			}
			// echo 'SELECT * FROM lots l INNER JOIN tickets t ON l.TICKET_GAGNANT = t.ID_TICKET WHERE l.ORDRE > ( SELECT r.ORDRE FROM lots r WHERE r.ID_LOT='.$dernierLot.') ORDER BY l.ORDRE';
			$rows = array();
			while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
				$row['libelle'] = "(".$row['ID_LOT'].") ";
				if ( $row['DONATEUR'] != '' ) {
					$row['libelle'] .= $row['DONATEUR'].' - ';
				}
				$row['libelle'] .= $row['DESCRIPTION'];
				$row['query'] = $q;
				
				$rows[] = $row;
			}
			
			echo json_encode($rows, JSON_INVALID_UTF8_IGNORE);
			
			break;
		
		case 'getDernierLot' :
			
			$results = $db->query('SELECT * FROM lots WHERE ORDRE = (SELECT MAX(ORDRE) FROM lots WHERE TICKET_GAGNANT IS NOT NULL)');
			
			$rows = array();
			while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
				$rows = $row;
			}
			
			echo json_encode($rows, JSON_INVALID_UTF8_IGNORE);
			
			break;
		
		case 'remettreLot' :
			$quoi = $_POST['lot'];
			
			// logLot($quoi, 'remis');
			
			$sql = 'UPDATE lots SET REMIS=1 WHERE ID_LOT='.$quoi;
			// $sql = 'UPDATE lots SET COMMENTAIRE="REMIS" WHERE ID_LOT="'.$quoi.'"';
			// echo $sql;
			$db->query($sql);
			break;
		
		case 'reprendreLot' :
			// $qui = $_POST['gagnant'];
			$quoi = $_POST['lot'];
			
			// logLot($quoi, '');
			
			$sql = 'UPDATE lots SET REMIS="0" WHERE ID_LOT='.$quoi;
			$db->query($sql);
			break;
			
		default:
	}
	
	function logLot($lot, $comment) {
		$fichierLots = './lots.json';
		if ( file_exists($fichierLots) ) {
			$lots = file_get_contents($fichierLots);
			$lots = json_decode($lots);
		} else {
			$lots = array();
		}
		var_dump( $lots );
		
		$lots[$lot] = $comment;
		
		
		$c = file_put_contents($fichierLots, json_encode($lots) );
	}
	
	$db->close();