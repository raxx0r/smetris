var $ = require('jquery');
module.exports = function (options) {

	var highscores = options.highscores || [];
	var recordPlayer = options.recordPlayer;
	var $highscore, highscore;

	init();

	function init() {
		highscores.sort(function(a, b) {
			return b.score - a.score;
		})
		$highscore = $('#highscore .score');
		highscore = highscores[0];
		render();
	}


	function render () {
		var html = '<ul class="highscore-controller">'
		highscores.forEach(function(highscore) {
			html += '<li>'
			html += '<span>' + highscore.score + '</span>'
			html += '<button>play</button>'
			html += '</div>'
			html += '</li>'
		});
		html += '</ul>'
		$highscore.html(html);

		$('.highscore-controller li button').on('click', function() {
			recordPlayer.stop();
			var index = $(this).parent().index();
			console.log(index, highscores)
			var highscore = highscores[index];

			recordPlayer.play(highscore.replay)
		})
	}

	return {};
}