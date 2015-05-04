var keys = require('./keys.js');
var Piece = require('./Piece.js')
module.exports = function Controls(createOptions) {
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
		if (e.keyCode == keys.UP) {
			if (check(piece.clone().rotate())) {
				piece.rotate();
			 }
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

}