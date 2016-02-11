var Piece = require('./Piece.js');
var CollisionDetection = require('./CollisionDetection.js');
var Renderer = require('./Renderer.js');
var nextPiecesGenerator = require('./nextPiecesGenerator.js')();
var NextPiecesController = require('./nextPiecesController.js');

var pieceTypes = require('./PieceTypesArray.js');

var PIECE_DROP_INTERVAL = 1000;
var EVENTS = ['linesCleared', 'boardUpdate', 'gameOver'];

module.exports = function(createOptions) {

	var board = createOptions.board;
	var controls = createOptions.controls;

	var listeners = {};
	init();


	var collisionDetection = CollisionDetection({
		board: board
	});
	var check = collisionDetection.check;

	var nextPiecesController = NextPiecesController({nextPiecesGenerator: nextPiecesGenerator});

	var piece = nextPiecesGenerator.getNextPiece();

	function calculateUpdate() {
		return {
			piece: piece, 
			ghostPiece: calculateGhostPiece(),
			board: board
		}
	}

	controls.on('right', function() {
		if (check(piece.clone().goRight())) {
			piece.goRight();
			emit('boardUpdate', calculateUpdate());
		}
	})			
	controls.on('left', function() {
		if (check(piece.clone().goLeft())) {
			piece.goLeft();
			emit('boardUpdate', calculateUpdate());	
		}
	});
	controls.on('rotate', function() {
		if (check(wallKick(piece.clone().rotate()))) {
			wallKick(piece.rotate());
			emit('boardUpdate', calculateUpdate());	
		}
	});
	controls.on('down', function() {
		if (check(piece.clone().goDown())) {
			piece.goDown();
			emit('boardUpdate', calculateUpdate());
		}
	});
	controls.on('drop', function() {
		var newPiece = piece.clone();
		while(check(newPiece.clone().goDown())) {
			newPiece.goDown();
		}
		attachPieceToBoard(newPiece);
		removeLines();
		piece = nextPiecesGenerator.getNextPiece();
		emit('boardUpdate', calculateUpdate());
	});

	function start() {	
		emit('boardUpdate', calculateUpdate());
		//game loop logic
		var intervalId = setInterval(function() {
			emit('boardUpdate', calculateUpdate());

			var canGoDown = check(piece.clone().goDown());

			if (canGoDown) {
				piece.goDown();
			} 
			else if (!canGoDown && (piece.y == 0)) {
				emit('gameOver');
				clearInterval(intervalId);
			}
			else {
				//wait for user no input and specified seconds
				attachPieceToBoard(piece);
				removeLines();
				piece = nextPiecesGenerator.getNextPiece();
			}

		}, PIECE_DROP_INTERVAL);
	}

	function init() {
		listeners = {};
		EVENTS.forEach(function(event) {
			listeners[event] = [];
		})
	}

	function attachPieceToBoard(piece) {
		var shape = piece.shape;
		for (var row = 0; row < shape.length; row++) {
			for (var col = 0; col < shape[row].length; col++) {
				if(shape[row][col] !== 0) {
					var x = piece.x + col;
					var y = piece.y + row;
					var index = pieceTypes.indexOf(piece.type) + 1;
					board(x)(y).update(index);
				}
			};
		};
	}

	function wallKick(piece) { //compensatepositionforwalls keepinsidebounds kickinsidebounds
		/*
			Responsability:
			Check if oustide left, right and bottom
			Compensate the piece position;
			Too many responsibilities for a function
			Should it even compensate for bottom?
		 */
		var shape = piece.shape;

		if(piece.x < 0) {
			piece.x = 0;
		}
		
		var outsideRight = (piece.x + shape.length) > board.width()
		if(outsideRight) {
			piece.x = (board.width() - shape[0].length);
		}

		var outsideBottom = (piece.y + shape.length) > board.height();
		if(outsideBottom) {
			piece.y = board.height() - shape[0].length;	
		}

		return piece;
	}

	function removeLines() {
		var fullLines = 0;
		for (var row = 0; row < board.height(); row++) {
			var fullLine = (_.min(board.row(row)) !== 0);
			if(fullLine) {
				fullLines++;
				board.clearRow(row);
			}
		};
		 if(fullLines > 0){
		 	emit('linesCleared', {linesCleared: fullLines});
		 }	 
	}

	function calculateGhostPiece() { //calculateGhostPiecePositon??
		var ghostPiece = piece.clone();
		while(check(ghostPiece.clone().goDown())) {
			ghostPiece.goDown();
		}
		return ghostPiece;
	}

	function addListener(event, callback) {
		if (!EVENTS.includes(event)) throw Error("event " + event + " not supported");

		listeners[event].push(callback);
	}

	function emit(event, data) {
		listeners[event].forEach(function(callback){callback(data);});
	}

	return {
		on: addListener,
		start: start
	}
}