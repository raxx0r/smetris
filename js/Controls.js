var keys = require('./keys.js');
var Piece = require('./Piece.js')
module.exports = function Controls(createOptions) {
	var board = createOptions.board;
	var piece = createOptions.piece;
	var check = createOptions.check;
	var stitchPieceToBoard = createOptions.stitchPieceToBoard;
	var generateRandomPiece = createOptions.generateRandomPiece;
	var generateAndAssignNewPiece = createOptions.generateAndAssignNewPiece;
	var removeLines = createOptions.removeLines;

	return {
		init: init,
		updatePiece: updatePiece
	}

	function init() {
		$(document).on('keydown', keyPressed);
	}

	function updatePiece(newPiece) {
		piece = newPiece;
	}

	function keyPressed(e) {

		if (e.keyCode == keys.RIGHT) {
			if (check(piece.clone().goRight())) {
				piece.goRight();
			}
		}
		if (e.keyCode == keys.LEFT) {
			if (check(piece.clone().goLeft())) {
				piece.goLeft();
			}
		}
		if (e.keyCode == keys.UP)  {
			wallKick(piece.rotate());
		}
		if(e.keyCode == keys.DOWN) {
			if (check(piece.clone().goDown())) {
				piece.goDown()
			}
		}
		if(e.keyCode == keys.SPACE) {
			var newPiece = piece.clone();
			while(check(newPiece.clone().goDown())) {
				newPiece.goDown();
			}
			stitchPieceToBoard(newPiece);
			removeLines();
			generateAndAssignNewPiece();

		}
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

		if(_.min(xs) < 0) {
			piece.x -= _.min(xs);
		}
		if(_.max(xs) > (board.width-1)) {
			var diff = (_.max(xs) +1 - board.width);
			piece.x -= diff;
		}
		if(_.max(ys)> (board.height-1)) {
			var diff = (_.max(ys) +1 - board.height);
			piece.y -= diff;			
		}

		return piece;

	}

}