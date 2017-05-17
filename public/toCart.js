$(function(){

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
})