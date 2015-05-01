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
var collisionDetection = CollisionDetection({
	board: board
});

var renderer = Renderer({board: board, colors: colors});
var controls = Controls({
	piece: piece,
	collisionDetection:collisionDetection
});
controls.init();


setInterval(function() {
	if(piece.y > board.height) {
		piece = generateRandomPiece();
	}

	var canMoveDown = collisionDetection.canGoDown(piece);
	if (canMoveDown) {
		//piece.y++;
		//stichPieceToBoard;
	}
}, 500);


var renderToken = setInterval(function() {
	renderer.render(piece);
}, 50);


function generateRandomPiece () {
	var blocks = ['J', 'L', 'O', 'S', 'T', 'Z'];
	var random = Math.floor(Math.random() * blocks.length);
	return Piece({type: blocks[random]});
}