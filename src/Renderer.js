var colorLuminance = require('./helpers.js').colorLuminance;
var config = require('./rendererConfig.js');

module.exports = function Renderer(options) {
	var canvas = options.canvas;
	var pieceTypes = require('./PieceTypesArray.js');
	var context;
	var canvas;
	var size;
	var square = options.squareSize;

	init();

	return {
		init: init,
		render: render,
		fillSquare: fillSquare,
		renderPiece: renderPiece
	};

	function init() {
		context = canvas.getContext('2d');
		// context.scale(2,2);
	}

	function render(data) {
		var piece = data.piece;
		var ghostPiece = data.ghostPiece;
		var board = data.board;

		//clear();
		renderBoard(board, config);
		renderPiece(context, ghostPiece, Object.assign(config.ghostPiece, {square: square}));
		renderPiece(context, piece, Object.assign(config.piece, {square: square, background: config.piece.colors[piece.type]}));
	}

	function renderBoard(board, config) {
		for (var row = 0; row < board.height(); row++) {
			for (var col = 0; col < board.width(); col++) {
				if (board(col)(row).isOccupied) {
					var pieceType = pieceTypes [ (board(col)(row).value - 1) ];
					var bg = config.piece.colors[pieceType];
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

	function renderPiece(context, piece, config) {
		for (var row = 0; row < piece.shape.length; row++) {
			for (var col = 0; col < piece.shape[row].length; col++) {
				var x = (piece.x + col);
				var y = (piece.y + row);

				if( piece.shape[row][col] !== 0 ) {
					renderSquare(context, x, y, config);
				}
				
			};
		};
	}

	function renderSquare(context, i, j, options) {
		var square = options.square;

		fillSquare(context,square.width * i, square.height * j, options);
	}

	function fillSquare(context, x, y, options) {
		var width = options.square.width;
		var height = options.square.height;
		context.fillStyle = options.background;
		context.fillRect(x, y, width, height);
		
		if(options.stroke) drawStroke(context,x,y,options);
	}

	function drawStroke(context,x,y,options) {
			var square = options.square;
			var color = colorLuminance(options.background, -0.1);
			var thickness = options.stroke.thickness || 2.5;

			context.strokeStyle = color;
			context.lineWidth = thickness;
			var x = x + thickness * 0.5;
			var y = y + thickness * 0.5;
			var width = square.width - thickness;
			var height = square.height - thickness;
			context.strokeRect(x, y, width, height);
	}
	
	function clear() {
		context.beginPath();
		context.clearRect ( 0 , 0 , canvas.width, canvas.height );
	}

	function even(number) {
		return ( number % 2 == 0 );
	}
}
