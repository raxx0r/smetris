var $ = require('jquery');

module.exports = function(createOptions) {
	var config = createOptions.config;
	var points = config.pointsPerLinesCleared;
	var game = createOptions.game;
	var score = 0;

	game.on('LINES_CLEARED', function(data) {
		var lines = data.linesCleared;
		score += points[lines-1];

		render();
	});

	function render() {
		$('#score').html(score);
	}

}
