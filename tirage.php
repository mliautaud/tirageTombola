<?php
	require_once 'connexion.php';
?>	
<!DOCTYPE html>
<html lang="en-US">
	<head>
		<title>Tombola</title>
		<meta charset="utf-8">
		
		<!-- ------------------------------------------------------------------------------------------------------------------------------------------------- -->
		<script src='./js/Winwheel.js'></script>
		<script src='./js/TweenMax.min.js'></script>
		<script src="./js/jquery-3.6.3.min.js"></script>

		
		<script src="./js/jquery-csv.js"></script>
		<script src="./js/helpers.js"></script>
		<script src="./js/highlight.min.js"></script>

		<script src="./js/tirage.js"></script>

		<link rel="stylesheet" href="./css/screen.css">
		<link type="text/css" rel="stylesheet" href="./css/animate.min.css"></style>
		<!-- ------------------------------------------------------------------------------------------------------------------------------------------------- -->
	</head>
	<body style="margin-left:45px; margin-top:20px;">
	   <div style="width:100%; height:100%; position: absolute;">
			<table cellpadding="0" cellspacing="0" border="0" width="100%">
				<tr>
					<td style="vertical-align: top;">
						<div>
							
							<div class="texteEffet" style="cursor:pointer;" onclick="lancerTirage(false);">
								<div class="bg"> Lancer le tirage </div>
								<div class="fg"> Lancer le tirage </div>
							</div>
							
							
							<div style="height:50px; cursor:pointer; padding:5px; position:fixed; top:10px; left:5px;" onClick="javascript:lancerTirage(true);">
							  <img src="./images/reload.png" width="50" />
							</div>
							
							<div id="panel" style="cursor:pointer; padding:5px; position:fixed; top:15px; left:75px;"><img src="./images/panel.png" width="50" height="50"></div>
							
							<br>
							<br>
							
							<div style="">
								<!-- <div style="display: inline-block;">
									<img src="./images/cadeau.png" id="cadeau" width="75" height="75" />
								</div> -->
								<div id="lotEnCours"><br></div>
							</div>
							<br>
							
						</div>
						<div width="100%">
							<table id="gagnants" border="1" width="100%">
								<thead>
									<tr>
										<th width="500">Gagnant</th>
										<th width="460">Lot</th>
									</tr>
								</thead>
								<tbody>
								</tbody>
							</table>
						</div>
					</td>
					<td width="938" class="tombola-roue" align="center" valign="center">
						<canvas id="canvas" width="870" height="870">
							<p style="{color: white}" align="center">Sorry, your browser doesn't support canvas. Please try another.</p>
						</canvas>
					</td>
				</tr>
			</table>
			
		</div>
		
		<a href="https://github.com/mliautaud/tirageTombola" target="_blank" id="github">
			<svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" class="" >
				<path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
			</svg>
		</a>
		
		<div id="div-gagnant" onClick="javascript:this.style.display='none';">Fin du tirage au sort.<br>Merci à tous pour votre participation !!!</div>
		
		<!-- <img src="images/rouage.png" width="50" height="50" style="position:fixed; top:0px; left:0px; cursor:pointer;" id="parametres-bouton" /> -->
		<!--
		<div id="parametres">
			<table width="100%" cellspacing="0" cellpadding="0">
				<tr>
					<td colspan="2" align="center" id="parametres-titre">
						Paramètres
						<img id="icon-affiche-telephone" src="./images/vision.png" width="32" height="32" />
					</td>
				</tr>
				<tr>
					<td width="35%">
						<button onclick="lotPrecedent();"><< Lot précédent</button>
					</td>
					<td width="65%" style="text-align:right;">
						<button onclick="lotSuivant();">Lot suivant >></button>
					</td>
				</tr>
				<tr>
					<td>CSV Tickets :</td>
					<td>
						<input type="file" id="tickets" name="tickets[]" multiple />
					</td>
				</tr>
				<tr>
					<td>CSV Lots :</td>
					<td>
						<input type="file" id="lots" name="lots[]" multiple />
					</td>
				</tr>
			</table>
		
		</div>
		-->
	</body>
</html>