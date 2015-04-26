var board = Board();
var colors = Colors();
var collisionDetection = CollisionDetection({board: board});

var renderer = Renderer({board: board, colors: colors});
var controls = Controls({collisionDetection:collisionDetection});
controls.init();

var piece = Piece({type: 'T'});
console.log(piece)

setInterval(function() {
	piece.y++;
	var res = collisionDetection.checkCollision();
}, 500);


var renderToken = setInterval(function() {
	renderer.render(piece);
}, 50);
