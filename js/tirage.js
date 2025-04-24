var jaune = '#e6c32f';
var marron = '#72524b';
var rouge = '#dc535e';
var orange = '#e68d5c';
var violet = '#9f498b';
var vert = '#46af7e';
var bleu = '#3d4d8a';
var bleuClair = '#d1ffff';

var panel = false;
var typeTirage = false;

var couleurs = new Array('jaune', 'marron', 'bleuClair', 'rouge', 'orange', 'violet', 'vert', 'bleu');
var lotEnCours = 0;
// var dernierLot = null;

var tickets = new Array();
tickets = [
			   // {'fillStyle' : 'orange', 'text' : '1'}, // EXEMPLES
			   // {'fillStyle' : 'rouge', 	'text' : '2'},
			   // {'fillStyle' : 'bleu', 	'text' : '3'},
			   // {'fillStyle' : 'marron', 'text' : '4'},
			   // {'fillStyle' : 'mauve', 	'text' : '5'},
			   // {'fillStyle' : 'jaune', 	'text' : '6'},
			   // {'fillStyle' : 'violet', 'text' : '7', 'textFillStyle' : 'white'},
			];

var lots = new Array();
lots = [
		// "1 : entrées au truc", // EXEMPLES
		// "2 : une coupe coiffeur",
		// "3 : entrés zoo",
		// "4 : stage poney",
		];

var roueTombola = null;
chargerRoue();

hljs.initHighlightingOnLoad();

$(document).ready(function() {
	
	// chargement des CSV
	// if(isFileAPIAvailable()) {
		// $('#tickets').bind('change', handleTickets);
		// $('#lots').bind('change', handleLots);
	// }
	
	// $('#icon-affiche-telephone').click(function(e) {
		// $('.gagnantTelephone').toggleClass('gagnantTelephoneVisible');
	// });
	
	// $('#parametres-bouton').click(function(e) {
		// afficherParametres()
	// });
	
	$.ajax(
			{
				method: "POST",
				url: "ajax.php",
				data: {
					action:"getLots"
				}
			}
		).done(function( ret ) {
			// lots = ret;
			lots = new Array();
			
			$($.parseJSON(ret)).each(function(i, elt) {
				// console.log( elt );
			
				// let d = elt;
				let lib = "";
				let arr = new Array();
				
				lib = "("+elt['ID_LOT']+") ";
				if ( elt['DONATEUR'] != "" ) {
					lib += elt['DONATEUR']+' - ';
				}
				lib += elt['DESCRIPTION'];
				
				arr['libelle'] = lib;
				arr['id_lot'] = elt['ID_LOT'];
				
				lots.push(arr);
			
			});
			
			// console.log( lots );
			
			if ( tickets.length > 0 && lots.length > 0 ) {
				// afficherParametres();
				chargerRoue();
				// lotEnCours = 0;
			}
		});
	
	$.ajax(
			{
				method: "POST",
				url: "ajax.php",
				data: {
					action:"getTickets"
				}
			}
		).done(function( ret ) {
			tickets = new Array();
			var jsonTickets = $.parseJSON(ret);
			// console.log('retour tickets');
			// console.log( jsonTickets );
			// console.log('-----------');
			
			var nbTickets = jsonTickets.length;
			var nbCouleurs = couleurs.length;
			var nbTicketsParCouleur = Math.ceil(nbTickets / nbCouleurs);
			
			// console.log( nbTickets );
			
			$(jsonTickets).each(function(i, elt) {
				// console.log( elt );
			
				let couleur = couleurs[Math.trunc(tickets.length / nbTicketsParCouleur)];
				let arr = new Array();
			
				arr['id_ticket'] = elt['ID_TICKET'];
				// arr['fillStyle'] = 'bleu';
				arr['fillStyle'] = couleur;
				arr['text'] = ""+elt['NUMERO']+"";
				arr['nom'] = elt['NOM'];
				arr['prenom'] = elt['PRENOM'];
				arr['telephone'] = elt['TELEPHONE'];
				
				tickets.push(arr);
			
			});
			// console.log( tickets );
			
			if ( tickets.length > 0 && lots.length > 0 ) {
				// afficherParametres();
				chargerRoue();
				// lotEnCours = 0;
			}
		});
	
	$.ajax(
			{
				method: "POST",
				url: "ajax.php",
				data: {
					action:"getDernierLot"
				}
			}
	).done(function( ret ) {
		console.log( "getDernierLot" );
		if ( ret.length == 0 ) return;
		
		ret = $.parseJSON(ret);
		console.log(ret);
		
		if ( !isNaN(ret['ORDRE']) ) {
			lotEnCours = ret['ORDRE'] - 1;
		} else {
			lotEnCours = -1;
		}
		
		console.log('Lot en cours @ dernier lot => '+lotEnCours);
		
		$.ajax(
				{
					method: "POST",
					url: "ajax.php",
					data: {
						action:"getGagnants",
						dernier_lot:0
					}
				}
		).done(function( ret ) {
			
			if ( ret.length == 0 ) return;
			
			// console.log( "getGagnants" );
			// console.log( $.parseJSON(ret) );
			$($.parseJSON(ret)).each(function(i, elt) {
				// console.log( elt );
				let qui = 'N°'+elt['NUMERO']+' - '+elt['NOM']+' '+elt['PRENOM'];
				let quoi = elt['libelle'];
				
				$('#gagnants tbody').append( '<tr><td class="ticketGagnant">'+qui+'</td><td class="lotGagnant">'+quoi+'</td></tr>' );
				
				// dernierLot = elt['ID_LOT'];
			});
			
		});
		
	});
	
	$('#panel').on('click', function(e) {
		panel = window.open("./panel.php", "panel", "width=800,height=600");
	});
	
	
	
});

function handleLots(event) {
	var fichiers = event.target.files;
	var fichier = fichiers[0];
	var fr = new FileReader();
	fr.readAsText(fichier);
	fr.onload = function(event){
		var csv = event.target.result;
		var data = $.csv.toArrays(csv);
		
		for ( var i=0 ; i<data.length ; i++ ) {
			let d = data[i];
			
			lots.push(d[0]);
		}
		
		lotEnCours = 0;
		
		if ( $('#tickets').val() != '' && $('#lots').val() != '' ) {
			afficherParametres();
		}
    }
}

function handleTickets(event) {
	var fichiers = event.target.files;
	var fichier = fichiers[0];
	var fr = new FileReader();
	fr.readAsText(fichier);
	fr.onload = function(event){
		var csv = event.target.result;
		var data = $.csv.toArrays(csv);
		console.log( data );
		for ( var i=0 ; i<data.length ; i++ ) {
			// entête
			if ( i==0 && isNaN(data[i][1]) ) continue;
			let d = data[i];
			let arr = new Array();
			
			arr['fillStyle'] = d[0];
			arr['text'] = d[1];
			arr['nom'] = d[2];
			arr['prenom'] = d[3];
			arr['telephone'] = d[4];
			
			// if ( d[0] == 'violet' || d[0] == 'bleu' || d[0] == 'marron' ) {
				arr['textFillStyle'] = 'transparent';
			// }
			
			tickets.push(arr);
			
		}
		
		chargerRoue();
		
		if ( $('#tickets').val() != '' && $('#lots').val() != '' ) {
			afficherParametres();
		}
		
    }
}


function supprimerGagnant(ticket) {
	var couleur = ticket.fillStyle;
	var numero = ticket.text;
	
	tickets = tickets.filter(function(value, index, arr) {
		return value.fillStyle != couleur || value.text != numero;
	});
	
}

function chargerRoue() {

	roueTombola = new Winwheel({
		'numSegments'   : tickets.length,   // Specify number of segments.
		'outerRadius'   : 405,  // Set radius to so wheel fits the background.
		'innerRadius'   : 240,  // Set inner radius to make wheel hollow.
		'textFontSize'  : 16,   // Set font size accordingly.
		'textMargin'    : 0,    // Take out default margin.
		'segments'      : tickets,      // Define segments including colour and text.
		'animation' :           // Define spin to stop animation.
		{
			'type'     : 'spinToStop',
			'duration' : 5,
			// 'duration' : 2,
			'spins'    : 10,
			// 'spins'    : 5,
			'callbackFinished' : alerteGagnant
		}
	});

}

// Vars used by the code in this page to do power controls.
// let wheelPower    = 0;
let wheelSpinning = false;

function lotPrecedent() {
	if ( lotEnCours == 0 || lotEnCours == null ) {
		return;
	}
	lotEnCours--;
	
	afficherLot();
}

function lotSuivant() {
	if ( lotEnCours == null ) {
		lotEnCours = 0;
	} else {
	
		if ( lotEnCours == lots.length - 1) {
			document.getElementById('div-gagnant').style.display = "block";
			return;
		} else {
			lotEnCours++;
		}
		
	}
	
	afficherLot();
}

function afficherLot() {
	console.log('afficherLot', lotEnCours, lots);
	document.getElementById('lotEnCours').innerHTML = lots[lotEnCours]['libelle'];
	
	if ( panel !== false ) {
		panel.afficherLot( lots[lotEnCours]['libelle'] );
	}
	
}

// -------------------------------------------------------
// Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
// -------------------------------------------------------
function alerteGagnant(indicatedSegment) {
	// Do basic alert of the segment text. You would probably want to do something more interesting with this information.
	
	ajouterGagnant(indicatedSegment, lots[lotEnCours]);
	afficherGagnant(indicatedSegment, lots[lotEnCours]);
	supprimerGagnant(indicatedSegment);
	wheelSpinning = false;
	
	// if ( panel !== false ) {
		// panel.afficherLot( "" );
		// setTimeout(function() { panel.recupereGagnants(typeTirage);}, 1000);
	// }
}

// -------------------------------------------------------
// Function to handle the onClick on the power buttons.
// -------------------------------------------------------
function powerSelected(powerLevel) {
	// Ensure that power can't be changed while wheel is spinning.
	if (wheelSpinning == false) {
		// wheelPower = powerLevel;
	}
}

// -------------------------------------------------------
// Click handler for spin button.
// -------------------------------------------------------
function lancerTirage(reload) {
	
	typeTirage = reload;
	
	// Ensure that spinning can't be clicked again while already running.
	if (wheelSpinning == false) {
		
		chargerRoue();
		if ( lotEnCours == null ) {
			lotEnCours = 0;
		} else {
			
			if ( !reload ) {
			
				if ( lotEnCours == lots.length - 1) {
					document.getElementById('div-gagnant').style.display = "block";
					return;
				} else {
					lotEnCours++;
				}
			} else {
				$('#gagnants tr').last().css('text-decoration', 'line-through');
			}
		}
		
		afficherLot();
		
		// powerSelected(1);
		
		roueTombola.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
		roueTombola.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
		roueTombola.draw();                // Call draw to render changes to the wheel.
		
		roueTombola.animation.spins = 20;

		// Begin the spin animation by calling startAnimation on the wheel object.
		roueTombola.startAnimation();

		// Set to true so that power can't be changed and spin button re-enabled during
		// the current animation. The user will have to reset before spinning again.
		wheelSpinning = true;
	}
}

// -------------------------------------------------------
// Function for reset button.
// -------------------------------------------------------
function resetWheel() {
	roueTombola.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
	roueTombola.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
	roueTombola.draw();                // Call draw to render changes to the wheel.

	wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
}

function afficherGagnant(segment, quoi) {
	// console.log( segment );
	var qui = "N°" + segment.text;
	qui += " " + segment.nom + " " + segment.prenom;// + '<span class="gagnantTelephone">' + segment.telephone + "</span>";
	
	$('#gagnants tbody').append( '<tr><td class="ticketGagnant">'+qui+'</td><td class="lotGagnant">'+quoi['libelle']+'</td></tr>' );
	$('#tableGagnants tbody tr').last().addClass('animate__heartBeat');
	$('#gagnants tbody').scrollTop(99999);
	
}

function afficherParametres() {
	$('#parametres').toggle();
}

function ajouterGagnant(qui, quoi) {
	// console.log(qui['id_ticket']);
	// console.log(quoi['id_lot');
	console.log('ajoute gagnant : '+qui['id_ticket'] + "@"+quoi['id_lot']);
	
	$.ajax(
			{
				method: "POST",
				url: "ajax.php",
				data: {
					action:"gagnerLot",
					gagnant:qui['id_ticket'],
					lot:quoi['id_lot'],
				}
			}
	).done(function( ret ) {
		
		if ( panel !== false ) {
			panel.afficherLot( "" );
			panel.recupereGagnants(typeTirage);
		}
		
	});
	
}