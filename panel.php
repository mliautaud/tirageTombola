<!DOCTYPE html>
<html class="tablette">
	<head>
		<title>Tombola</title>
		<meta charset="utf-8">
		
		<!-- ------------------------------------------------------------------------------------------------------------------------------------------------- -->
		<script src="./js/jquery-3.6.3.min.js"></script>

		<script src="./js/gagnants.js"></script>

		<link rel="stylesheet" href="./css/panel.css">
		<link type="text/css" rel="stylesheet" href="./css/animate.min.css"></style>
		<!-- ------------------------------------------------------------------------------------------------------------------------------------------------- -->
	</head>
	<body class="tablette">
		<div id="panel">
			<table id="table-panel" class="tablette panel">
				<thead>
					<tr>
						<th>
							<img src="./images/lancer.png" id="btn-tirer" width="32" height="32" />
							<img src="./images/reload.png" id="btn-retirer" width="32" height="32" />
						</th>
						<th id="prochain-lot" colspan="2">
							prochain lot
						</th>
				</thead>
			</table>
		</div>
		<table id="gagnants" class="tablette">
			<thead>
				<!--<tr>
					<th>
						<img src="./images/lancer.png" id="btn-tirer" width="32" height="32" />
						<img src="./images/reload.png" id="btn-retirer" width="32" height="32" />
					</th>
					<th id="prochain-lot" colspan="2">
						
					</th>
				</tr>-->
				<tr>
					<th>Ticket</th>
					<th>Lot</th>
					<th width="250" align="right">&nbsp;</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
		
	</body>
</html>