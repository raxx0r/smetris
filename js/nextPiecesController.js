var $ = require('jquery');
var colors = require('./Colors.js')();

module.exports = function (createOptions) {

	var nextPiecesGenerator = createOptions.nextPiecesGenerator;
	var canvas;
	var context;
	init();

	return {}

	function init() {
		canvas = document.getElementById('next-pieces');
		context = canvas.getContext('2d');
		
		nextPiecesGenerator.on('update', render);
	}

	function render() {
		var nextPieces = nextPiecesGenerator.getNextPieces();

		for (var i = 0; i < nextPieces.length; i++) {
			context.fillStyle = colors[nextPieces[i].type];
			context.fillRect(0, (30+ 10)*i , 30, 30);

		};
	}

}