var randomColor = require('./helpers').randomColor
var clear = require('./helpers').clear

module.exports = function (opts) {
	var canvas = opts.canvas;
	var context = canvas.getContext('2d');



	function renderPiece(piece) {
		var square = {
			width: 20,
			height: 20
		}
		var color = randomColor();
		clear(canvas, context)
		for (var row = 0; row < piece.shape.length; row++) {
			for (var col = 0; col < piece.shape[row].length; col++) {
				var i = (piece.x + col);
				var j = (piece.y + row);

				if( piece.shape[row][col] !== 0 ) {
					var x = square.width * i
					var y = square.height * j
					var width = square.width;
					var height = square.height;
					context.fillStyle = "#000"
					context.fillRect(x, y, width, height);
					
				}
			};
		};
	}

	function renderBoard(board, config) {
		for (var row = 0; row < board.height(); row++) {
			for (var col = 0; col < board.width(); col++) {
				if (board(col)(row).isOccupied) {
					var pieceType = pieceTypes [ (board(col)(row).value - 1) ];
					var bg = colors[pieceType];
					config.piece.background = bg;
					config.piece.square = square;
					renderSquare(context, col, row, config.piece);
				}
				else {
					var bg;
					if (config.board.checkered) {
						var checked = config.board.checked;
						bg = even(row + col) ? checked.color1 : checked.color2;
					}
					else {
						bg = config.board.background;
					}
					config.board.background = bg;
					config.board.square = square;
					renderSquare(context, col, row, config.board);
				}
			};
		};
	}

	return {
		renderBoard: renderBoard,
		renderPiece: renderPiece,
	}

}