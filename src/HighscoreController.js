var $ = require('jquery');
module.exports = function (options) {

	var $highscore, highscore;

	init();

	function init() {
		$highscore = $('#highscore .score');
		highscore = localStorage.getItem("highscore");
		render();
	}


	function render () {
		$highscore.html(highscore);
	}

	return {};
}