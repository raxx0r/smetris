var Board = require('./Board.js');
var Piece = require('./Piece.js');
var Colors = require('./Colors.js');
var CollisionDetection = require('./CollisionDetection.js');
var Controls = require('./Controls.js');
var Renderer = require('./Renderer.js');

var blocks = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
var colors = Colors();
var board = Board();
var piece = generateRandomPiece();
var collisionDetection = CollisionDetection({
	board: board
});
var check = collisionDetection.check;

var renderer = Renderer({board: board, colors: colors});
var controls = Controls({
	piece: piece,
	check:check,
	board: board,
	stitchPieceToBoard:stitchPieceToBoard,
	generateAndAssignNewPiece: generateAndAssignNewPiece,
	removeLines: removeLines
});
controls.init();

var points = [40, 100, 300, 1200];
var score = 0;
$('#score').val(score);

setInterval(function() {

	if (check(piece.clone().goDown())) {
		piece.goDown();
	} 
	else {
		//wait for user no input and specified seconds
		stitchPieceToBoard(piece);
		removeLines();
		piece = generateRandomPiece();
		controls.updatePiece(piece);
	}

}, 500);


var renderToken = setInterval(function() {
	var ghostPiece = calculateGhostPiece();
	renderer.render(piece, ghostPiece);
}, 50);


function generateRandomPiece () {
	var random = Math.floor(Math.random() * blocks.length);
	var p = new Piece({
		type: blocks[random],
		x: 3,
		y: 0 
	});
	return p;
}

function stitchPieceToBoard(piece) {
	var shape = piece.shape;
	for (var row = 0; row < shape.length; row++) {
		for (var col = 0; col < shape[row].length; col++) {
			if(shape[row][col] !== 0) {
				var x = piece.x + col;
				var y = piece.y + row;
				var index = blocks.indexOf(piece.type) + 1;
					board[y][x] = index;
			}
		};
	};
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
	 	console.log(fullLines);
	 	score += points[--fullLines];
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


function generateAndAssignNewPiece (){
	piece = generateRandomPiece();
	controls.updatePiece(piece);
}
