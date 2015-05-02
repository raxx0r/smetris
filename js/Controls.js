var keys = require('./keys.js');
module.exports = function Controls(createOptions) {
	var piece = createOptions.piece;
	var collisionDetection = createOptions.collisionDetection;
	var check = createOptions.check;

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
		else if (e.keyCode == keys.LEFT) {
			if (check(piece.clone().goLeft())) {
				piece.goLeft();
			}
		}
		else if (e.keyCode == keys.UP) {
			if (check(piece.clone().rotate())) {
				piece.rotate();
			 }
		}
		else if(e.keyCode == keys.DOWN) {
			if (check(piece.clone().goDown())) {
				piece.goDown()
			}
		} 
	}

}