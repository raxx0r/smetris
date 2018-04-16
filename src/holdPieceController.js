var $ = require('jquery');
var renderConfig = require('./rendererConfig');
var Piece = require('./Piece');

module.exports = function (createOptions) {

  var fillSquare = createOptions.fillSquare;
  var square = createOptions.squareSize;
  var colors = createOptions.colors;
  var context;
  var offsets = {
  	'I': {
  		x: 12.5,
  		y: 20
  	},
  	'Z': {
  		x: 20,
  		y: 30
  	},
  	'S': {
  		x: 20,
  		y: 30
  	},
  	'L': {
  		x: 20,
  		y: 20
  	},
  	'J': {
  		x: 20,
  		y: 20
  	},
  	'T': {
  		x: 20,
  		y: 30
  	},
  	'O': {
  		x: 30,
  		y: 30
  	}
  }
  var offsetX = 30; // I
	var offsetY = 30; // I
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
    var piece = new Piece({type: event.hold.type});
		for (var row = 0; row < piece.shape.length; row++) {
			for (var col = 0; col < piece.shape[row].length; col++) {

				var x = col;
				var y = row;

				if( piece.shape[row][col] !== 0 ) {
					var color = colors[piece.type];
					var thing = (piece.type == 'I') ? 25 : 50;
          var conf = {
            square: square,
            background: color,
            stroke: renderConfig.piece.stroke
          };
          fillSquare(context, offsets[piece.type].x + x * 18, offsets[piece.type].y + y * 18, conf)
				}

			};
		};

  }

	function clear() {
		context.beginPath();
		context.clearRect ( 0 , 0 , canvas.width, canvas.height );
	}
}
