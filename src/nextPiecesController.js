var $ = require('jquery');
var colors = require('./Colors.js');

module.exports = function (createOptions) {
	var game = createOptions.game;

	var canvas;
	var context;
	init();

	return {
		render: render
	}

	function init() {
		canvas = document.getElementById('next-pieces');
		context = canvas.getContext('2d');
	}

	function render(event) {
		var nextPieces = event.queue;
		clear();

		for (var i = 0; i < nextPieces.length; i++) {
			var piece = nextPieces[i];
			var color = colors[nextPieces[i].type];

			renderPiece(piece, {step: i});
		};
	}

	function renderPiece(piece, config) {
		var step = config.step;
		var tempRow = 0;
		for (var row = 0; row < piece.shape.length; row++) {
			if(emptyRow(piece.shape[row])) continue;
			tempRow++;

			for (var col = 0; col < piece.shape[row].length; col++) {

				var x = (piece.x + col);
				var y = (piece.y + tempRow);

				if( piece.shape[row][col] !== 0 ) {
					context.fillStyle = colors[piece.type];
					var thing = (piece.type == 'I') ? 25 : 50;
					context.fillRect( x * 18,  y * 18  + step * 50, 15, 15);
				}

			};
		};
	}

	function emptyRow(row) {
		var accumulator = 0;
		for (var i = 0; i < row.length; i++) {
			accumulator += row[i];
		};
		return (accumulator == 0);
	}

	function clear() {
		context.beginPath();
		context.clearRect ( 0 , 0 , canvas.width, canvas.height );
	}

}
