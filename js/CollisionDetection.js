var Piece = require('./Piece.js');

module.exports = function CollisionDetection(createOptions){
	var board = createOptions.board;
	return {
		check: check
	};

	function check(piece) {
		var shape = piece.shape;
		for (var row = 0; row < shape.length; row++) {
			for (var col = 0; col < shape[row].length; col++) {
				if (shape[row][col] !== 0) {
					var y = (piece.y + row);
					var x = (piece.x + col);
				
					var isBelowBottom = y >= board.height;
					if (isBelowBottom) return false;
	           
					var isSpaceTaken = board[y][x] !== 0;
					if (isSpaceTaken) return false;
				 }
			};
		};
		return true;		
	}
}
