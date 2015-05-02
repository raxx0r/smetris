var Board = require('./Board.js');
var Piece = require('./Piece.js');
var Colors = require('./Colors.js');
var transform = require('./Transform.js');
var CollisionDetection = require('./CollisionDetection.js');
var Controls = require('./Controls.js');
var Renderer = require('./Renderer.js');

var colors = Colors();
var board = Board();
var piece = new Piece({type: 'L'});
var blocks = ['J', 'L', 'O', 'S', 'T', 'Z'];
var collisionDetection = CollisionDetection({
	board: board
});
var check = collisionDetection.check;

var renderer = Renderer({board: board, colors: colors});
var controls = Controls({
	piece: piece,
	check:check
});
controls.init();


setInterval(function() {
	//if(piece.y > board.height) {
	//	piece = generateRandomPiece();
	//}

	if (check(piece.clone().goDown())) {
		piece.goDown();
	} 
	else {
		stitchPieceToBoard(piece);
		piece = generateRandomPiece();
		console.log(piece)
	}

}, 500);


var renderToken = setInterval(function() {
	renderer.render(piece);
}, 50);


function generateRandomPiece () {

	var random = Math.floor(Math.random() * blocks.length);
	var p = new Piece({type: blocks[random]});
	return p;
}

function stitchPieceToBoard(piece) {
	var shape = piece.shape;
	for (var row = 0; row < shape.length; row++) {
		for (var col = 0; col < shape[row].length; col++) {
			if(shape[row][col] !== 0) {
				var x = piece.x + col;
				var y = piece.y + row;
				var index = blocks.indexOf(piece.type);
				console.log(index)
					board[y][x] = index;
			}
		};
	};
}

