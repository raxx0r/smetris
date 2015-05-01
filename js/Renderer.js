var colorLuminance = require('./helpers.js').colorLuminance;


module.exports = function Renderer(options) {
	var board = options.board;
	var colors = options.colors;
	var colorIndexes = ['J', 'L', 'O', 'S', 'T', 'Z'];
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
					var blockType = colorIndexes [ board[row][col] ];
					var bg = colors[blockType];
					var strokeColor = colorLuminance(bg, -0.1);
					var strokeThickness = 2.5;
					renderSquare(col, row, {
						bg: bg, 
						strokeColor: strokeColor,
						strokeThickness: strokeThickness
					});
				}
				else {
					var bg = '#eee';
					var bg2 = '#fff';
					if( (row+col) % 2 == 0 ){
						bg = bg2;
					}
					else{
						bg = bg;
					}
					renderSquare(col, row, {
						bg: bg,
						stroke: false
					});
				}
			};
		};
	}

	function renderMovingPiece(piece) {
		for (var row = 0; row < piece.shape.length; row++) {
			for (var col = 0; col < piece.shape[row].length; col++) {
				var x = (piece.x + col);
				var y = (piece.y + row);
				var bg = colors[piece.type];
				var strokeColor = colorLuminance(bg, -0.1);
				if( piece.shape[row][col] !== 0 ) {
					renderSquare(x, y, {
						bg: bg,
						strokeColor: strokeColor
					});
				}
				
			};
		};
	}

	function renderGhostPiece(piece) {
		context.rect(piece.x, canvas.height - square.height, square.width, square.height);
		context.stroke();
	}

	function renderSquare(i, j, options) {
		fillSquare(square.width * i, square.height * j, options);
	}

	function fillSquare(x, y, options) {
		var stroke = ((options.stroke !== undefined) ? options.stroke : true);
		var strokeColor = options.strokeColor || '#ccc';
		var strokeThickness = options.strokeThickness || 2.5;

		context.fillStyle = options.bg;
		context.fillRect(x*sizepadding, y*sizepadding, square.width, square.height);
		
		if(stroke) {
			context.strokeStyle = strokeColor;
			context.lineWidth = strokeThickness;
			context.strokeRect(x + strokeThickness * 0.5, y + strokeThickness * 0.5, square.width - strokeThickness, square.height - strokeThickness);
		}
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