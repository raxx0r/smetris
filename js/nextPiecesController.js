var $ = require('jquery');
var colors = require('./Colors.js');

module.exports = function (createOptions) {

	var nextPiecesGenerator = createOptions.nextPiecesGenerator;
	var canvas;
	var context;
	init();

	return {}

	function init() {
		canvas = document.getElementById('next-pieces');
		context = canvas.getContext('2d');
		
		nextPiecesGenerator.on('update', render);
	}

	function render() {
		clear();
		var nextPieces = nextPiecesGenerator.getNextPieces();
		for (var i = 0; i < nextPieces.length; i++) {
			var piece = nextPieces[i];
			var color = colors[nextPieces[i].type];

			renderPiece(piece, {step: i});
		};
	}

	function renderPiece(piece, config) {
		var step = config.step;
		for (var row = 0; row < piece.shape.length; row++) {
			for (var col = 0; col < piece.shape[row].length; col++) {
				var x = (piece.x + col);
				var y = (piece.y + row);

				if( piece.shape[row][col] !== 0 ) {
					context.fillStyle = colors[piece.type];
					context.fillRect( x * 21,  y * 21  + step * 70, 20, 20);
				}
				
			};
		};
	}

	function clear() {
		context.beginPath();
		context.clearRect ( 0 , 0 , canvas.width, canvas.height );
	}

}