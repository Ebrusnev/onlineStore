$(ducument).ready(function(){
	var button = $('#addToCart');

	button.on('click', function(e){
		e.preventDefault();
		$.ajax({
			type: 'POST',
			url: '/cart',
			data: ''
		})
	})
}