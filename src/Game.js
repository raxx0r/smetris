var Piece = require('./Piece.js');
var CollisionDetection = require('./CollisionDetection.js');
var Renderer = require('./Renderer.js');
var getRandomPieces = require('./nextPiecesHelpers.js').getRandomPieces;
var generateRandomPiece = require('./nextPiecesHelpers.js').generateRandomPiece;

var pieceTypes = require('./PieceTypesArray.js');

var PIECE_DROP_INTERVAL = 1000;
var EVENTS = ['LINES_CLEARED', 'UPDATE', 'GAME_OVER'];

module.exports = function(createOptions) {

	var config = createOptions.config;
	var nextPiecesGenerator = createOptions.nextPiecesGenerator;
	var points = config.pointsPerLinesCleared;
	var board = createOptions.board;
	var controls = createOptions.controls;
	var score = 0;
	var intervalId;
	var queue;
	var piece;
	var hold;


	var listeners = {};
	init();


	var collisionDetection = CollisionDetection({
		board: board
	});
	var check = collisionDetection.check;


	function calculateUpdate() {
		return {
			piece: piece,
			ghostPiece: calculateGhostPiece(),
			board: board,
			queue: queue,
			hold: hold
		}
	}

	controls.on('right', onRightPressed)
	controls.on('left', onLeftPressed);
	controls.on('rotate', onRotatePressed);
	controls.on('down', onDownPressed);
	controls.on('drop', onDropPressed);
	controls.on('hold', onHoldPressed);

	function onRightPressed() {
		if (check(piece.clone().goRight())) {
			piece.goRight();
			emit('UPDATE', calculateUpdate());
		}
	}

	function onLeftPressed() {
		if (check(piece.clone().goLeft())) {
			piece.goLeft();
			emit('UPDATE', calculateUpdate());
		}
	}

	function onRotatePressed() {
		if (check(wallKick(piece.clone().rotate()))) {
			wallKick(piece.rotate());
			emit('UPDATE', calculateUpdate());
		}
	}

	function onDownPressed() {
		if (check(piece.clone().goDown())) {
			piece.goDown();
			emit('UPDATE', calculateUpdate());
		}
	}

	function onDropPressed() {
		var newPiece = piece.clone();
		while(check(newPiece.clone().goDown())) {
			newPiece.goDown();
		}

		onPieceLanded(newPiece);
	}

	function onHoldPressed() {
		if (hold) {
			var temp = piece.clone();
			piece = hold.clone()
			hold = temp;
		}
		else {
			hold = piece.clone();
			piece = queue.shift();
			queue.push(generateRandomPiece());
		}

		emit('UPDATE', calculateUpdate());
	}

	function start() {
		queue = getRandomPieces(5);
		piece = queue.shift()

		emit('UPDATE', calculateUpdate());
		//game loop logic
		intervalId = setInterval(function() {
			emit('UPDATE', calculateUpdate());

			var canGoDown = check(piece.clone().goDown());

			if (canGoDown) {
				piece.goDown();
			}
			else if (!canGoDown && (piece.y == 0)) {
				emit('GAME_OVER', {score: score});
				clearInterval(intervalId);
			}
			else {
				// TODO: wait for user no input and specified seconds before landing piece.
				onPieceLanded(piece);
			}

		}, PIECE_DROP_INTERVAL);
	}

	function onPieceLanded(landingPiece) {
		attachPieceToBoard(landingPiece);
		removeLines();
		piece = queue.shift();
		queue.push(generateRandomPiece());
		emit('UPDATE', calculateUpdate());
	}

	function pause() {
		clearInterval(intervalId);
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
		 	score += points[fullLines-1];
		 	emit('LINES_CLEARED', {linesCleared: fullLines});
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
		start: start,
		pause: pause
	}
}
