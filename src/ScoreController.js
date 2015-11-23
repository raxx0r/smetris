var $ = require('jquery');

module.exports = function(createOptions) {

	var points = [40, 100, 300, 1200];
	var game = createOptions.game;
	var score = 0;

	game.on('linesCleared', function(data) {
		var lines = data.linesCleared;
		score += points[lines-1];
		
		render();
	});

	function render() {
		$('#score').html(score);
	}

}