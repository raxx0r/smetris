var board = Board();
var colors = Colors();
var transform = Transform();
var collisionDetection = CollisionDetection({board: board});


var renderer = Renderer({board: board, colors: colors});
var controls = Controls({collisionDetection:collisionDetection});
controls.init();

var piece = Piece({type: 'T'});

setInterval(function() {
	if(piece.y > board.height) {
		piece = generateRandomPiece();
	}
	var canMoveDown = collisionDetection.canGoDown();
	if (canMoveDown) {
		piece.y++;
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