module.exports = {
	calculateSquareSizeForBoard: calculateSquareSize
}

function calculateSquareSize(canvas, board) {
	var square = {};
	square.width = canvas.width / board.width();
	square.height = canvas.height / board.height();
	return square;
}