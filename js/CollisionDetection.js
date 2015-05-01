var Piece = require('./Piece.js');
var transform = require('./Transform.js');

module.exports = function CollisionDetection(createOptions){
	var board = createOptions.board;
	return {
		canGoLeft: canGoLeft,
		canGoRight: canGoRight,
		canGoDown: canGoDown,
		canRotate: canRotate
	};

	function canGoLeft(piece) {
		for (var row = 0; row < piece.shape.length; row++) {
			for (var col = 0; col < piece.shape[row].length; col++) {
				var x = piece.x + col - 1;
				var y = piece.y + row;
				var isInside = x * piece.shape[row][col] >= 0;
				var hitRestingPieces = ( (board[y][x] !== 0) && (piece.shape[row][col] !== 0) );
				if(hitRestingPieces || !isInside) return false;
			};
		};
		return true;
	}


	function canGoRight(piece) {
		for (var row = 0; row < piece.shape.length; row++) {
			for (var col = 0; col < piece.shape[row].length; col++) {
				var x = piece.x + col + 1;
				var y = piece.y + row;
				var isInside = x * piece.shape[row][col] < board.width;
				var hitRestingPieces = ( (board[y][x] !== 0) && (piece.shape[row][col] !== 0) );
				if(hitRestingPieces || !isInside) return false;
			};
		};
		return true;
	}

	function canGoDown(piece) {
		for (var row = 0; row < piece.shape.length; row++) {
			for (var col = 0; col < piece.shape[row].length; col++) {
				var x = (piece.x + col);
				var y = (piece.y + 1 + row);

				var hit = ( (board[y][x] !== 0) && (piece.shape[row][col] !== 0) );
				if(hit) {
					return false;
				}
			};
		};
		return true;
	}

	function canRotate(piece) {

		var copy = new Piece(piece);
		copy.rotate();
		var shape = copy.shape;
		logShape(shape);
		logPartOfBoard(copy);

		for (var row = 0; row < shape.length; row++) {
			for (var col = 0; col < shape[row].length; col++) {
				 if (shape[row][col] !== 0) {
					var x = (copy.x + col);
					var y = (copy.y + row);
				 	
				 	var hitRestingPieces = (board[y][x] !== 0 );
				 	console.log('hit', hitRestingPieces)
					if (hitRestingPieces) {
						return false;
					}
				 }
				//var hitRestingPieces = ( (board[y][x] !== 0) && (shape[col][row] !== 0) );

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