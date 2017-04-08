var $ = require('jquery');
var renderConfig = require('./rendererConfig');
var colors = require('./Colors.js');
module.exports = function (createOptions) {

	var fillSquare= createOptions.fillSquare;
  var context;
	init();
  return {
    render: render
  }

	function init() {
		$dom = $('#hold-piece');
		canvas = $dom.find('canvas').get(0);
    console.log(canvas)
    context = canvas.getContext('2d')
	}


	function render (event) {
    if (!event.hold) return;

    clear();
    var piece = event.hold;
		for (var row = 0; row < piece.shape.length; row++) {

			for (var col = 0; col < piece.shape[row].length; col++) {

				var x = col;
				var y = row;

				if( piece.shape[row][col] !== 0 ) {
					var color = colors[piece.type];
					var thing = (piece.type == 'I') ? 25 : 50;
          var conf = {background: color, stroke: renderConfig.piece.stroke};
          fillSquare(context, x * 18, y * 18, conf)
				}

			};
		};

  }

	function clear() {
		context.beginPath();
		context.clearRect ( 0 , 0 , canvas.width, canvas.height );
	}
}
