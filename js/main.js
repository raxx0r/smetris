var Board = require('./Board.js');
var Piece = require('./Piece.js');
var CollisionDetection = require('./CollisionDetection.js');
var Controls = require('./Controls.js');
var Renderer = require('./Renderer.js');

var pieceTypes = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

var board = Board();
var collisionDetection = CollisionDetection({
	board: board
});
var check = collisionDetection.check;
var renderer = Renderer({board: board});
var controls = Controls();
controls.init();

var piece = generateRandomPiece();

controls.on('right', function() {
	if (check(piece.clone().goRight())) {
		piece.goRight();
		renderer.render(piece, calculateGhostPiece());	
	}
})			
controls.on('left', function() {
	if (check(piece.clone().goLeft())) {
		piece.goLeft();
		renderer.render(piece, calculateGhostPiece());	
	}
});
controls.on('rotate', function() {
	wallKick(piece.rotate());
	renderer.render(piece, calculateGhostPiece());	
});
controls.on('down', function() {
	if (check(piece.clone().goDown())) {
		piece.goDown();
		renderer.render(piece, calculateGhostPiece());	
	}
});
controls.on('drop', function() {
	var newPiece = piece.clone();
	while(check(newPiece.clone().goDown())) {
		newPiece.goDown();
	}
	attachPieceToBoard(newPiece);
	removeLines();
	piece = generateRandomPiece();
	renderer.render(piece, calculateGhostPiece());	
});


var points = [40, 100, 300, 1200];
var score = 0;
$('#score').val(score);

renderer.render(piece, calculateGhostPiece());
setInterval(function() {
	renderer.render(piece, calculateGhostPiece());

	if (check(piece.clone().goDown())) {
		piece.goDown();
	} 
	else {
		//wait for user no input and specified seconds
		attachPieceToBoard(piece);
		removeLines();
		piece = generateRandomPiece();
	}

}, 500);

function generateRandomPiece () {
	var random = Math.floor(Math.random() * pieceTypes.length);
	var p = new Piece({
		type: pieceTypes[random],
		x: 3,
		y: 0 
	});
	return p;
}

function attachPieceToBoard(piece) {
	var shape = piece.shape;
	for (var row = 0; row < shape.length; row++) {
		for (var col = 0; col < shape[row].length; col++) {
			if(shape[row][col] !== 0) {
				var x = piece.x + col;
				var y = piece.y + row;
				var index = pieceTypes.indexOf(piece.type) + 1;
					board[y][x] = index;
			}
		};
	};
}

function wallKick(piece) {
	var shape = piece.shape;
	var xs =[];
	var ys =[];
	for (var row = 0; row < shape.length; row++) {
		for (var col = 0; col < shape[row].length; col++) {
			if(shape[row][col] !== 0) {
				xs.push(piece.x + col);
				ys.push(piece.y + row);
			}
		};
	};

	var outsideLeft = _.min(xs) < 0;
	if(outsideLeft) {
		piece.x -= _.min(xs);
	}
	var outsideRight = _.max(xs) > (board.width-1);
	if(outsideRight) {
		var diff = (_.max(xs) +1 - board.width);
		piece.x -= diff;
	}
	var outsideBottom = _.max(ys) > (board.height-1);
	if(outsideBottom) {
		var diff = (_.max(ys) +1 - board.height);
		piece.y -= diff;			
	}

	return piece;
}


function removeLines() {
	var fullLines = 0;
	for (var row = 0; row < board.length; row++) {
		var fullLine = (_.min(board[row]) !== 0);
		if(fullLine) {
			fullLines++;
			board.splice(row,1);
			board.unshift(emptyRow());
		}
	};
	 if(fullLines > 0){
	 	score += points[fullLines-1];
	 }
	 $('#score').html(score);
}

function emptyRow() {
	var row = [];
	for (var i = 0; i < board.width; i++) {
		row.push(0);
	};
	return row;
}

function calculateGhostPiece() {
	var ghostPiece = piece.clone();
	while(check(ghostPiece.clone().goDown())) {
		ghostPiece.goDown();
	}
	return ghostPiece;
}
