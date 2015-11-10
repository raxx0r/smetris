
var Piece = require('./Piece.js');
var CollisionDetection = require('./CollisionDetection.js');
var Controls = require('./Controls.js');
var Renderer = require('./Renderer.js');
var nextPiecesGenerator = require('./nextPiecesGenerator.js')();
var NextPiecesController = require('./nextPiecesController.js');

var pieceTypes = require('./PieceTypesArray.js');

var PIECE_DROP_INTERVAL = 1000;

module.exports = function(createOptions) {

	var board = createOptions.board;

	var listeners = {};
	init();


	var collisionDetection = CollisionDetection({
		board: board
	});
	var check = collisionDetection.check;
	var controls = Controls();
	controls.init();

	var nextPiecesController = NextPiecesController({nextPiecesGenerator: nextPiecesGenerator});

	var piece = nextPiecesGenerator.getNextPiece();


	controls.on('right', function() {
		if (check(piece.clone().goRight())) {
			piece.goRight();
			emit('boardUpdate', {
				piece: piece, 
				ghostPiece: calculateGhostPiece(),
				board: board
			});
		}
	})			
	controls.on('left', function() {
		if (check(piece.clone().goLeft())) {
			piece.goLeft();
			emit('boardUpdate', {
				piece: piece, 
				ghostPiece: calculateGhostPiece(),
				board: board
			});	
		}
	});
	controls.on('rotate', function() {
		wallKick(piece.rotate());
		emit('boardUpdate', {
			piece: piece, 
			ghostPiece: calculateGhostPiece(),
			board: board
		});	
	});
	controls.on('down', function() {
		if (check(piece.clone().goDown())) {
			piece.goDown();
			emit('boardUpdate', {
				piece: piece, 
				ghostPiece: calculateGhostPiece(),
				board: board
			});
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
		emit('boardUpdate', {
			piece: piece, 
			ghostPiece: calculateGhostPiece(),
			board: board
		});
	});


	emit('boardUpdate', {
		piece: piece, 
		ghostPiece: calculateGhostPiece(),
		board: board
	});

	//game loop logic
	setInterval(function() {
		emit('boardUpdate', {
			piece: piece, 
			ghostPiece: calculateGhostPiece(),
			board: board
		});

		if (check(piece.clone().goDown())) {
			piece.goDown();
		} 
		else {
			//wait for user no input and specified seconds
			attachPieceToBoard(piece);
			removeLines();
			piece = nextPiecesGenerator.getNextPiece();
		}

	}, PIECE_DROP_INTERVAL);

	function init() {
		listeners = {};
		['linesCleared', 'boardUpdate'].forEach(function(event) {
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
		var outsideRight = _.max(xs) > (board.width()-1);
		if(outsideRight) {
			var diff = (_.max(xs) +1 - board.width());
			piece.x -= diff;
		}
		var outsideBottom = _.max(ys) > (board.height()-1);
		if(outsideBottom) {
			var diff = (_.max(ys) +1 - board.height());
			piece.y -= diff;			
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
				//board.splice(row,1);
				//board.unshift(emptyRow());
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
		listeners[event].push(callback);
	}


	function emit(event, data) {
		listeners[event].forEach(function(callback){callback(data);});
	}

	return {
		on: addListener
	}
}