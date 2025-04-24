var dernierLot = 0;
// var btnAction = '<button class="btnEnregistrerCadeau"><img src="./images/cadeau.png" /></button>';
// var btnConfirmation = '<button class="btnValiderCadeau"><img src="./images/valider.png" /></button> &nbsp; <button class="btnAnnulerCadeau"><img src="./images/annuler.png" /></button>';
var btnAction = '<img src="./images/cadeau.png" class="btnEnregistrerCadeau" /><img src="./images/rafraichir2.png" class="btnReprendreCadeau" />';
var btnConfirmation = '<img src="./images/valider.png" class="btnValiderCadeau" /> &nbsp; <img src="./images/annuler.png"  class="btnAnnulerCadeau"/>';

$(document).ready(function() {
	
	// setInterval(recupereGagnants, 2000);
	recupereGagnants(false);
	
	$('body').on('click', '.btnEnregistrerCadeau', function(e) {
		console.log('btnEnregistrerCadeau');
		$('.btnEnregistrerCadeau:not(.cadeauRemis)').show();
		$('.btnValiderCadeau').hide();
		$('.btnAnnulerCadeau').hide();
		
		$(this).parent().find('.btnValiderCadeau').show();
		$(this).parent().find('.btnAnnulerCadeau').show();
		$(this).hide();
	});
	
	$('body').on('click', '.btnValiderCadeau', function(e) {
		var idLot = $(this).parents('tr').data('idlot');
		var idTicket = $(this).parents('tr').data('idticket');
		// console.log('btnValiderCadeau', $(this).parents('tr'), idTicket, idLot);
		// console.log('-->', $(this).parents('tr').data, $(this).parents('tr').data('idlot'));
		
		$.ajax(
			{
				method: "POST",
				url: "ajax.php",
				data: {
					action:"remettreLot",
					gagnant:idTicket,
					lot:idLot,
				}
			}
		).done(function( ret ) {
			
			
		});
		
		$(this).parent().find('.btnEnregistrerCadeau').hide().addClass('cadeauRemis');
		$(this).parent().find('.btnValiderCadeau').hide();
		$(this).parent().find('.btnAnnulerCadeau').hide();
		$(this).parent().find('.btnReprendreCadeau').show();
		$(this).parents('tr').addClass('cadeauGagne');
	});
	
	$('body').on('click', '.btnAnnulerCadeau', function(e) {
		console.log('btnAnnulerCadeau');
		$(this).parent().find('.btnValiderCadeau').hide();
		$(this).parent().find('.btnAnnulerCadeau').hide();
		$(this).parent().find('.btnEnregistrerCadeau').show();
		$(this).hide();
	});
	
	$('body').on('click', '.btnReprendreCadeau', function(e) {
		var idLot = $(this).parents('tr').data('idlot');
		var idTicket = $(this).parents('tr').data('idticket');
		
		$.ajax(
			{
				method: "POST",
				url: "ajax.php",
				data: {
					action:"reprendreLot",
					gagnant:idTicket,
					lot:idLot,
				}
			}
		).done(function( ret ) {
			
			
		});
		
		$(this).parents('tr').removeClass('cadeauGagne');
		$(this).parent().find('.btnEnregistrerCadeau').removeClass('cadeauRemis')
		$(this).parent().find('.btnEnregistrerCadeau').show();
		$(this).hide();
	});
	
	$('body').on('click', '#btn-tirer', function(e) {
		window.opener.lancerTirage(false);
	});
	
	$('body').on('click', '#btn-retirer', function(e) {
		window.opener.lancerTirage(true);
	});
	
});

function afficherLot(lot) {
	$('#prochain-lot').html( lot );
}

function recupereGagnants(typeTirage) {
	//alert( "-" + typeTirage );
	
	$.ajax(
			{
				method: "POST",
				url: "ajax.php",
				data: {
					action:"getGagnants",
					dernier_lot:dernierLot,
					typeTirage:typeTirage
				}
			}
	).done(function( ret ) {
		
		if ( ret.length == 0 ) return;
		
		$($.parseJSON(ret)).each(function(i, elt) {
			console.log( elt );
			
			ajouterGagnant(elt, typeTirage);
			
			dernierLot = elt['ID_LOT'];
		});
		
		window.scrollTo(0, 999999999);
		
	});
}

function ajouterGagnant(elt, typeTirage) {
	// alert( "#" + typeTirage + "#" );
	
	if ( typeTirage == true ) {
		$('#gagnants tr').last().find('td').css('text-decoration', 'line-through');
		$('#gagnants tr').last().find('.gagnantAction img').css('display', 'none');
		$('#gagnants tr').last().find('.gagnantAction').css('text-decoration', 'none');
		$('#gagnants tr').last().find('.gagnantAction img').addClass('desactive');
	}
	
	var html = '';
	html = '<tr data-idticket="'+elt['ID_TICKET']+'" data-idlot="'+elt['ID_LOT']+'"><td class="gagnantTicket">('+elt['ID_TICKET']+') '+elt['NOM']+' '+elt['PRENOM'] +'</td><td class="gagnantLot">'+elt['libelle']+'</td><td class="gagnantAction">';
	
	html += btnAction + btnConfirmation;
	
	html += '</td></tr>';
	$('#gagnants tbody').append( html );
	
	if ( elt['REMIS'] == 0 ) {
		// console.log('pas remis');
	} else {
		console.log('remis');
		$('#gagnants tbody tr:last-child td').find('.btnReprendreCadeau').show();
		$('#gagnants tbody tr:last-child td').find('.btnEnregistrerCadeau').hide().addClass('cadeauRemis')
		$('#gagnants tbody tr:last-child td').find('.btnValiderCadeau').hide();
		$('#gagnants tbody tr:last-child td').find('.btnAnnulerCadeau').hide();
		$('#gagnants tbody tr:last-child').addClass('cadeauGagne');
	}
}
