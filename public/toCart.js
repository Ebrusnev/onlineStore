$(function(){
	var checkout = $('#checkout')
	var nameLine = $('#name');

	$('.addToCart').on('click', function(e){
		e.preventDefault();
		var id = $(this).attr('data-id');
		$.ajax({
			type: 'POST',
			url: '/cart',
			data: {
				id: id
			},
			success: function(){
				console.log('Product ' + id + ' added to the cart');
			},
			error: function(){
				alert("Error adding to the cart");
			}
		})
	})
/*	$('.remove').on('click', function(e){
		e.preventDefault();
		var remId = $(this).attr('data-id');
		$.ajax({
			type: 'POST',
			url: '/remove',
			data: {id: remId},
			success: function(){
				console.log("Product " + remIdd + " removed from the cart");
			},
			error: function(){
				alert("Error removing Product");
			}
		})
	})*/

	nameLine.on('keyup keydown blur', function(e){
		if (nameLine.val().length>2 && (isNaN(nameLine.val()))) {
			checkout.removeAttr('disabled');
		}
		else{
			checkout.attr('disabled', 'disabled');
		}
	})


	$('.form-checkingOut').on("submit", function(e){
		e.preventDefault();
		$.ajax({
			type: 'POST',
			url: '/checkOut',
			data: {name: nameLine.val()}
		})
	})
})