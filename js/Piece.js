function Piece(options) {
	//tetromino
	var types = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
	var type = options.type;
	var x = 0;
	var y = 0;
	
	var shape = [ [0, 1, 0], [1, 1, 1] ];
	return {
		x:x,
		y:y,
		type:type,
		shape:shape,
		rotate: rotate
	};

	function rotate() {
		console.log('rotate');
	}
}


//-#-
//###
//[[1, 1, 1, 1], [0, 0, 0, 0]] //I