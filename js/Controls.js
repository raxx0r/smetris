function Controls(createOptions) {
	var collisionDetection = createOptions.collisionDetection;
	var keys = {
		SPACE: 32,
		LEFT: 37,
		RIGHT: 39,
		UP: 38,
		DOWN: 40,
		SHIFT: 16
	};

	return {
		init: init
	}

	function init() {
		$(document).on('keydown', keyPressed);
	}

	function keyPressed(e) {

		if (e.keyCode == keys.RIGHT) {
			if (collisionDetection.canGoRight()) {
				goRight();
			}
		}
		else if (e.keyCode == keys.LEFT) {
			if (collisionDetection.canGoLeft()) {
				goLeft();
			}
		}
		else if (e.keyCode == keys.UP) {
			//if (collisionDetection.canRotate()) {
				piece.rotate();
			//}
		}
	}

	function goLeft() {
		piece.x--;
	}

	function goRight() {
		piece.x++;
	}

}