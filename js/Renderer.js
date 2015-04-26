function Renderer(options) {
	var board = options.board;
	var colors = options.colors;

	board.height = board.length;
	board.width = board[0].length;
	var context;
	var canvas;
	var size;
	var sizepadding = 1;
	square = {};
	init();
	return {
		init: init,
		render: render,
		fillSquare: fillSquare
	};

	function init() {
		canvas = document.getElementById('game-canvas');
		context = canvas.getContext('2d');
		calculateSquareSize();

	}

	function render(piece) {
		clear();
		renderBoard();
		renderMovingPiece(piece);
		//πrenderGhostPiece(piece);
	}

	function renderBoard() {
		for (var row = 0; row < board.length; row++) {
			for (var col = 0; col < board[row].length; col++) {
				if(board[row][col] !== 0) {
					renderSquare(col, row, board[row][col]);
				}
			};
		};
	}

	function renderMovingPiece(piece) {
		for (var row = 0; row < piece.shape.length; row++) {
			for (var col = 0; col < piece.shape[row].length; col++) {
				var x = piece.shape[row][col] * square.width * (piece.x + col);
				var y = piece.shape[row][col] * square.height * (piece.y + row);
				fillSquare(x, y, piece.type);
			};
		};
	}

	function renderGhostPiece(piece) {
		context.rect(piece.x, canvas.height - square.height, square.width, square.height);
		context.stroke();
	}

	function renderSquare(i, j, color) {
		//console.log(i,j)
		fillSquare(square.width * i, square.height * j, color);
	}

	function fillSquare(x, y, colorIndex) {
		if (colorIndex) {
			color = colors[colorIndex];
		}
		else {
			color = '#333';
		}
		context.fillStyle = color;
		context.fillRect(x*sizepadding, y*sizepadding, square.width, square.height);
	}

	function calculateSquareSize() {
		square.width = canvas.width / board.width;
		square.height = canvas.height / board.height;
	}
	
	function clear() {
		context.beginPath();
		context.clearRect ( 0 , 0 , canvas.width, canvas.height );
	}
}