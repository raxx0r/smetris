var Piece = require('./Piece.js')
var Board = require('./Board.js')

module.exports = function(createOptions) {
	var renderer = createOptions.renderer;
	var tokens = [];

	return {
		play: play,
		stop: stop
	}

	function stop() {
		clearTokens()
	}

	function clearTokens() {
		tokens.forEach(function(token) {
			clearTimeout(token);
		})

		tokens = [];
	}

	function play(history) {
		clearTokens();

		history.forEach(function(item, index){
			var token = setTimeout(function() {
				var piece = item.data.piece;
				var board = item.data.board;
				var ghostPiece = item.data.ghostPiece;

				renderer.render({
					board: Board({boardScheme: board.grid}),
					piece: new Piece(piece),
					ghostPiece: new Piece(ghostPiece)
				});

			}, item.time);
			tokens.push(token);
		})
	}
}