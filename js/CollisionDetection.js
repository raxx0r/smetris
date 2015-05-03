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
					if (y >= board.height) {
						return false;
	            	}
					else if (board[y][x] !== 0 ) {
						return false;
					}
				 	//check if out of bounds height
				 	//check if outofbounds right, compensate
				 	//check if outofbounds left, compensate
				 }
			};
		};
		return true;		
	}

	function logShape(shape) {
		var shapeString = "";
		for (var row = 0; row < shape.length; row++) {
			for (var col = 0; col < shape[row].length; col++) {
				shapeString += shape[row][col];
			};
			shapeString += '\n';
		};
		console.log(shapeString);
	}

	function logPartOfBoard(copy) {
		var boardString = "";
		for (var row = 0; row < 3; row++) {
			for (var col = 0; col < 3; col++) {
				var x = (copy.x + col);
				var y = (copy.y + row);
				boardString += board[y][x];
			};
			boardString += '\n';
		};
		console.log(boardString);
	}

}