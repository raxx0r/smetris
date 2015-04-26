function CollisionDetection(createOptions){
	var board = createOptions.board;
	return {
		checkCollision: checkCollision,
		canGoLeft: canGoLeft,
		canGoRight: canGoRight
	};

	function canGoLeft() {
		for (var row = 0; row < piece.shape.length; row++) {
			for (var col = 0; col < piece.shape[row].length; col++) {
				var can = (piece.x - 1 + col) * piece.shape[row][col] >= 0;
				if(!can) return false;
			};
		};
		return true;
		return (piece.x-1 >= 0);
	}


	function canGoRight() {
		for (var row = 0; row < piece.shape.length; row++) {
			for (var col = 0; col < piece.shape[row].length; col++) {
				var can = (piece.x + 1 + col) * piece.shape[row][col] < board.width;
				if(!can) return false;
			};
		};
		return true;
	}

	function checkCollision() {
		for (var row = 0; row < board.length; row++) {
			for (var col = 0; col < board[row].length; col++) {
				var hit = board[row][col] == 1 && piece.x == col && piece.y == row;
				if(hit) return true;
			};
		};
		return false;
	}
	
}