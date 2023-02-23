// Create new wheel object specifying the parameters at creation time.
var jaune = '#e6c32f';
var marron = '#72524b';
var rouge = '#dc535e';
var orange = '#e68d5c';
var violet = '#9f498b';
var vert = '#46af7e';
var bleu = '#3d4d8a';
var bleuClair = '#d1ffff';

var lotEnCours = null;

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
	if(isFileAPIAvailable()) {
		$('#tickets').bind('change', handleTickets);
		$('#lots').bind('change', handleLots);
	}
	
	$('#parametres-bouton').click(function(e) {
		afficherParametres()
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
		
		lotEnCours == 0;
		
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
			let d = data[i];
			let arr = new Array();
			
			arr['fillStyle'] = d[0];
			arr['text'] = d[1];
			
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
			'duration' : 10,
			'spins'    : 20,
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
	document.getElementById('lotEnCours').innerHTML = lots[lotEnCours];
}

// -------------------------------------------------------
// Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
// -------------------------------------------------------
function alerteGagnant(indicatedSegment) {
	// Do basic alert of the segment text. You would probably want to do something more interesting with this information.
	
	afficherGagnant(indicatedSegment.fillStyle+" n°"+indicatedSegment.text, lots[lotEnCours]);
	supprimerGagnant(indicatedSegment);
	wheelSpinning = false;
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

function afficherGagnant(qui, quoi) {
	
	var tr = document.createElement('tr');

	var td1 = document.createElement('td');
	var td2 = document.createElement('td');
	
	var text1 = document.createTextNode(qui);
	var text2 = document.createTextNode(quoi);
	
	td1.appendChild(text1);
	td2.appendChild(text2);
	tr.appendChild(td1);
	tr.appendChild(td2);

	// document.getElementById('gagnants').appendChild(tr);
	// console.log( tr );
	$('#gagnants tbody').append( '<tr><td width="350">'+qui+'</td><td>'+quoi+'</td></tr>' );
	$('#tableGagnants tbody tr').last().addClass('animate__heartBeat');
	$('#gagnants tbody').scrollTop(99999);
	
}

function afficherParametres() {
	$('#parametres').toggle();
}