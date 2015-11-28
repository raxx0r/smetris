var Piece = require('./Piece.js');

module.exports = function CollisionDetection(createOptions){
	var createOptions = createOptions || {};
	var board = createOptions.board;
	return {
		check: check,
		isOutsideRight: isOutsideRight
	};

	function check(piece) {
		var shape = piece.shape;
		for (var row = 0; row < shape.length; row++) {
			for (var col = 0; col < shape[row].length; col++) {
				if (shape[row][col] !== 0) {
					var y = (piece.y + row);
					var x = (piece.x + col);
				
					var isBelowBottom = (y >= board.height());
					if (isBelowBottom) return false;
					if (board(x)(y).isOccupied) return false;
				 }
			};
		};
		return true;		
	}

	function isBelowBottom(board, piece) {}

	function isOutsideRight(board, piece) {
		var shape = piece.shape;
		console.log(piece.x, shape, board.width());
		return (piece.x + shape.length) > board.width()
		return true;
	}

}
