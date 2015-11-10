module.exports = function (createOptions) {
//board(2)(2).isOccupied;
//board.width();
//board(2)(2).update(2);
//
//boardscheme  boardarray boardprototype boardskeleton boardbones boardmatrix

	createOptions = createOptions || {};

	var boardScheme = createOptions.boardScheme || require('./BoardScheme.js');

	var board = core;

	board.width = width;
	board.height = height;
	board.row = row;

	function row(row) {return boardScheme[row];}
	function width() {return boardScheme[0].length;}
	function height() {return boardScheme.length;}

	function core(x) {
		return function (y) {
			return {
				isOccupied: check(x,y),
				isFree: !check(x,y),
				update: function (value) {
					update(x,y,value);
				},
				value: value(x,y)
			}
		};
	}

	function value(x, y) { return boardScheme[y][x];}
	function check(x, y) {
		return (boardScheme[y][x] !== 0);
	}

	function update(x, y, value) {
		boardScheme[y][x] = value;
	}

	return board;
};