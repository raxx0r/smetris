var colorLuminance = require('./helpers.js').colorLuminance;
var config = require('./rendererConfig.js');

module.exports = function Renderer(options) {
	var board = options.board;
	var game = options.game;
	var pieceTypes = require('./PieceTypesArray.js');
	var context;
	var canvas;
	var size;
	square = {};
	init();
	game.on('boardUpdate', function (data) {
		render(data.piece, data.ghostPiece);
	})

	return {
		init: init,
		render: render,
		fillSquare: fillSquare
	};

	function init() {
		canvas = document.getElementById('game-canvas');
		context = canvas.getContext('2d');
		//context.scale(2,2);
		calculateSquareSize();
	}

	function render(piece, ghostPiece) {
		//clear();
		renderBoard(config);
		renderPiece(ghostPiece, config.ghostPiece);
		renderPiece(piece, config.piece);
	}

	function renderBoard(config) {
		for (var row = 0; row < board.height(); row++) {
			for (var col = 0; col < board.width(); col++) {
				if (board(col)(row).isOccupied) {
					var pieceType = pieceTypes [ (board(col)(row).value - 1) ];
					var bg = config.piece.colors[pieceType];
					config.piece.background = bg;
					renderSquare(col, row, config.piece);
				}
				else {
					var bg;
					if (config.board.checkered) {
						bg = even(row + col) ? config.board.checked.color1 : config.board.checked.color2;
					}
					else {
						bg = config.board.background;
					}
					config.board.background = bg;
					renderSquare(col, row, config.board);
				}
			};
		};
	}

	function renderPiece(piece, config) {
		for (var row = 0; row < piece.shape.length; row++) {
			for (var col = 0; col < piece.shape[row].length; col++) {
				var x = (piece.x + col);
				var y = (piece.y + row);

				if( piece.shape[row][col] !== 0 ) {
					if(config.movingPiece) {
						var bg = config.colors[piece.type];
						config.background = bg;
					}
					renderSquare(x, y, config);
				}
				
			};
		};
	}

	function renderSquare(i, j, options) {
		fillSquare(square.width * i, square.height * j, options);
	}

	function fillSquare(x, y, options) {
		var color = options.bg || options.background;
		context.fillStyle = color;
		context.fillRect(x, y, square.width, square.height);
		
		var stroke = ((options.stroke !== undefined) ? options.stroke : true);
		if(stroke) {
			var strokeColor = colorLuminance(color, -0.1);
			var strokeThickness = options.strokeThickness || 2.5;
			//drawStroke(x, y, {strokeColor, strokeThickness})
			context.strokeStyle = strokeColor;
			context.lineWidth = strokeThickness;
			var x = x + strokeThickness * 0.5;
			var y = y + strokeThickness * 0.5;
			var width = square.width - strokeThickness;
			var height = square.height - strokeThickness;
			context.strokeRect(x, y, width, height);
		}
	}

	function calculateSquareSize() {
		square.width = canvas.width / board.width();
		square.height = canvas.height / board.height();
	}
	
	function clear() {
		context.beginPath();
		context.clearRect ( 0 , 0 , canvas.width, canvas.height );
	}

	function even(number) {
		return ( number % 2 == 0 );
	}
}