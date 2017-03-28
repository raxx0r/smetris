var $ = require('jquery');
module.exports = function (options) {


	init();

	function init() {
		$highscore = $('#hold-piece');
		render();
	}


	function render () {
		$highscore.html('<h1> Next Piece </h1>');
	}

	return {};
}
