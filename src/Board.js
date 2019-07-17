var deepClone = require('./helpers.js').deepClone;

module.exports = function Board(createOptions) {

	createOptions = createOptions || {};

	var boardScheme = createOptions.boardScheme || require('./BoardScheme.js');
	var board = core;

	board.width = width;
	board.height = height;
	board.row = row;
	board.clearRow = clearRow;
	board.clone = clone;
	board.toJSON = function() {
		return {
			width: width(),
			height: height(),
			grid: boardScheme
		}
	}

	function row(row) {return boardScheme[row];}
	function width() {return boardScheme[0].length;}
	function height() {return boardScheme.length;}
	function clearRow(row) {				
		boardScheme.splice(row,1);
		boardScheme.unshift(emptyRow());
	}

	function emptyRow() {
		var row = [];
		for (var i = 0; i < board.width(); i++) {
			row.push(0);
		};
		return row;
	}

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

	function clone() {
			cBoardScheme = deepClone(boardScheme)
			return Board({boardScheme: cBoardScheme})
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