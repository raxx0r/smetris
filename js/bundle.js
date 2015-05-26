(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function (options) {

	var board = [
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
	];

	board.height = board.length;
	board.width = board[0].length;

	return board;
}


},{}],2:[function(require,module,exports){
var Piece = require('./Piece.js');

module.exports = function CollisionDetection(createOptions){
	var board = createOptions.board;
	return {
		check: check
	};

	function check(piece) {
		var shape = piece.shape;
		for (var row = 0; row < shape.length; row++) {
			for (var col = 0; col < shape[row].length; col++) {
				if (shape[row][col] !== 0) {
					var y = (piece.y + row);
					var x = (piece.x + col);
					if (y >= board.height) {
						return false;
	            	}
					else if (board[y][x] !== 0 ) {
						return false;
					}
				 }
			};
		};
		return true;		
	}
}

},{"./Piece.js":4}],3:[function(require,module,exports){
var keys = require('./keys.js');
var Piece = require('./Piece.js')

var VALID_EVENTS = ['down','right','left','drop','hold','rotate'];

module.exports = function Controls(createOptions) {

	var listeners;

	return {
		init: init,
		on: addListener,
		off: removeListener
	}

	function init() {
		$(document).on('keydown', keyPressed);

		listeners = {};
		VALID_EVENTS.forEach(function(event) {
			listeners[event] = [];
		})
	}

	function addListener(event, callback) {
		listeners[event].push(callback);
	}

	function removeListener(event, callback) {
		var index = listeners[event].indexOf(callback);
		listeners[event].splice(index,1);
	}

	function emit(event) {
		listeners[event].forEach(function(callback) {
			callback();
		})
	}
	
	function keyPressed(e) {
		if (e.keyCode === keys.RIGHT) emit('right');
		if (e.keyCode === keys.LEFT) emit('left');
		if (e.keyCode === keys.UP)  emit('rotate');
		if(e.keyCode === keys.DOWN) emit('down');
		if(e.keyCode === keys.SPACE) emit('drop');
		if(e.keyCode === keys.SHIFT) emit('hold');
	}
}
},{"./Piece.js":4,"./keys.js":8}],4:[function(require,module,exports){
var Shapes = require('./Shapes.js');

function Piece(options) {
	this.type = options.type;
	this.x = options.x || 0;
	this.y = options.y || 0;	
	this.shape = options.shape || Shapes[this.type].shape;
}

Piece.prototype.goRight = function() {
	this.x++;
	return this;
}

Piece.prototype.goLeft = function() {
	this.x--;
	return this;
}

Piece.prototype.goDown = function() {
	this.y++;
	return this;
}

Piece.prototype.clone = function() {
	return new Piece(this);
}

Piece.prototype.rotate = function() {
	this.shape = rotation(this.shape);
	return this;
}

function rotation(shape) {
	var n = [];
	for (var row = 0; row < shape.length; row++) {
		var p = [];
		for (var col = 0; col < shape[row].length; col++) {
			p.push(shape[shape.length - col - 1][row]);
		};
		n.push(p)
	};
	return n;
}

function logShape(shape) {
	var shapeString = "";
	for (var row = 0; row < shape.length; row++) {
		for (var col = 0; col < shape[row].length; col++) {
			shapeString += 	shape[row][col];
		};
		shapeString += '\n';
	};
	console.log(shapeString);
}

module.exports = Piece;
},{"./Shapes.js":6}],5:[function(require,module,exports){
var colorLuminance = require('./helpers.js').colorLuminance;
var config = require('./rendererConfig.js');

module.exports = function Renderer(options) {
	var board = options.board;
	var colorIndexes = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
	board.height = board.length;
	board.width = board[0].length;
	var context;
	var canvas;
	var size;
	square = {};
	init();
	return {
		init: init,
		render: render,
		fillSquare: fillSquare
	};

	function init() {
		canvas = document.getElementById('game-canvas');
		context = canvas.getContext('2d');
		//context.scale(2,2);
		calculateSquareSize();
	}

	function render(piece, ghostPiece) {
		//clear();
		renderBoard(config);
		renderPiece(ghostPiece, config.ghostPiece);
		renderPiece(piece, config.piece);
	}

	function renderBoard(config) {
		for (var row = 0; row < board.length; row++) {
			for (var col = 0; col < board[row].length; col++) {
				if(board[row][col] !== 0) {
					var blockType = colorIndexes [ (board[row][col]-1) ];
					var bg = config.piece.colors[blockType];
					config.piece.background = bg;
					renderSquare(col, row, config.piece);
				}
				else {
					var bg;
					if (config.board.checkered) {
						bg = even(row + col) ? config.board.checked.color1 : config.board.checked.color2;
					}
					else {
						bg = config.board.background;
					}
					config.board.background = bg;
					renderSquare(col, row, config.board);
				}
			};
		};
	}

	function renderPiece(piece, config) {
		for (var row = 0; row < piece.shape.length; row++) {
			for (var col = 0; col < piece.shape[row].length; col++) {
				var x = (piece.x + col);
				var y = (piece.y + row);

				if( piece.shape[row][col] !== 0 ) {
					if(config.movingPiece) {
						var bg = config.colors[piece.type];
						config.background = bg;
					}
					renderSquare(x, y, config);
				}
				
			};
		};
	}

	function renderSquare(i, j, options) {
		fillSquare(square.width * i, square.height * j, options);
	}

	function fillSquare(x, y, options) {
		var color = options.bg || options.background;
		context.fillStyle = color;
		context.fillRect(x, y, square.width, square.height);
		
		var stroke = ((options.stroke !== undefined) ? options.stroke : true);
		if(stroke) {
			var strokeColor = colorLuminance(color, -0.1);
			var strokeThickness = options.strokeThickness || 2.5;
			//drawStroke(x, y, {strokeColor, strokeThickness})
			context.strokeStyle = strokeColor;
			context.lineWidth = strokeThickness;
			var x = x + strokeThickness * 0.5;
			var y = y + strokeThickness * 0.5;
			var width = square.width - strokeThickness;
			var height = square.height - strokeThickness;
			context.strokeRect(x, y, width, height);
		}
	}

	function calculateSquareSize() {
		square.width = canvas.width / board.width;
		square.height = canvas.height / board.height;
	}
	
	function clear() {
		context.beginPath();
		context.clearRect ( 0 , 0 , canvas.width, canvas.height );
	}

	function even(number) {
		return ( number % 2 == 0 );
	}
}
},{"./helpers.js":7,"./rendererConfig.js":10}],6:[function(require,module,exports){
var Shapes = module.exports = {
	'I': {
		shape: [ [0, 0, 0, 0], 
				 [1, 1, 1, 1], 
				 [0, 0, 0, 0], 
				 [0, 0, 0, 0] ]
	},
	'J': {
		shape: [ [0, 0, 0], 
				 [1, 1, 1], 
				 [0, 0, 1] ]
	},
	'L': {
		shape: [ [0, 0, 0], 
				 [1, 1, 1], 
				 [1, 0, 0] ]
	},
	'O': {
		shape: [ [1, 1], 
				 [1, 1] ]
	},
	'S': {
		shape: [ [0, 1, 1], 
				 [1, 1, 0], 
				 [0, 0, 0] ]
	},
	'T': {
		shape: [ [0, 1, 0], 
				 [1, 1, 1], 
				 [0, 0, 0] ]
	},
	'Z': {
		shape: [ [1, 1, 0], 
				 [0, 1, 1], 
				 [0, 0, 0] ]
	}
};

},{}],7:[function(require,module,exports){
function colorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}

module.exports = {
	colorLuminance: colorLuminance
}
},{}],8:[function(require,module,exports){
module.exports = {
	SPACE: 32,
	LEFT: 37,
	RIGHT: 39,
	UP: 38,
	DOWN: 40,
	SHIFT: 16
};

},{}],9:[function(require,module,exports){
var Board = require('./Board.js');
var Piece = require('./Piece.js');
var CollisionDetection = require('./CollisionDetection.js');
var Controls = require('./Controls.js');
var Renderer = require('./Renderer.js');

var blocks = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

var board = Board();
var piece = generateRandomPiece();
var collisionDetection = CollisionDetection({
	board: board
});
var check = collisionDetection.check;

var renderer = Renderer({board: board});
var controls = Controls();
controls.init();

controls.on('right', function() {
	if (check(piece.clone().goRight())) {
		piece.goRight();
		renderer.render(piece, calculateGhostPiece());	
	}
})			
controls.on('left', function() {
	if (check(piece.clone().goLeft())) {
		piece.goLeft();
		renderer.render(piece, calculateGhostPiece());	
	}
});
controls.on('rotate', function() {
	wallKick(piece.rotate());
	renderer.render(piece, calculateGhostPiece());	
});
controls.on('down', function() {
	if (check(piece.clone().goDown())) {
		piece.goDown();
		renderer.render(piece, calculateGhostPiece());	
	}
});
controls.on('drop', function() {
	var newPiece = piece.clone();
	while(check(newPiece.clone().goDown())) {
		newPiece.goDown();
	}
	attachPieceToBoard(newPiece);
	removeLines();
	piece = generateRandomPiece();
	renderer.render(piece, calculateGhostPiece());	
});


var points = [40, 100, 300, 1200];
var score = 0;
$('#score').val(score);

renderer.render(piece, calculateGhostPiece());
setInterval(function() {
	renderer.render(piece, calculateGhostPiece());

	if (check(piece.clone().goDown())) {
		piece.goDown();
	} 
	else {
		//wait for user no input and specified seconds
		attachPieceToBoard(piece);
		removeLines();
		piece = generateRandomPiece();
	}

}, 500);

function generateRandomPiece () {
	var random = Math.floor(Math.random() * blocks.length);
	var p = new Piece({
		type: blocks[random],
		x: 3,
		y: 0 
	});
	return p;
}

function attachPieceToBoard(piece) {
	var shape = piece.shape;
	for (var row = 0; row < shape.length; row++) {
		for (var col = 0; col < shape[row].length; col++) {
			if(shape[row][col] !== 0) {
				var x = piece.x + col;
				var y = piece.y + row;
				var index = blocks.indexOf(piece.type) + 1;
					board[y][x] = index;
			}
		};
	};
}

function wallKick(piece) {
	var shape = piece.shape;
	var xs =[];
	var ys =[];
	for (var row = 0; row < shape.length; row++) {
		for (var col = 0; col < shape[row].length; col++) {
			if(shape[row][col] !== 0) {
				xs.push(piece.x + col);
				ys.push(piece.y + row);
			}
		};
	};

	var outsideLeft = _.min(xs) < 0;
	if(outsideLeft) {
		piece.x -= _.min(xs);
	}
	var outsideRight = _.max(xs) > (board.width-1);
	if(outsideRight) {
		var diff = (_.max(xs) +1 - board.width);
		piece.x -= diff;
	}
	var outsideBottom = _.max(ys) > (board.height-1);
	if(outsideBottom) {
		var diff = (_.max(ys) +1 - board.height);
		piece.y -= diff;			
	}

	return piece;
}


function removeLines() {
	var fullLines = 0;
	for (var row = 0; row < board.length; row++) {
		var fullLine = (_.min(board[row]) !== 0);
		if(fullLine) {
			fullLines++;
			board.splice(row,1);
			board.unshift(emptyRow());
		}
	};
	 if(fullLines > 0){
	 	score += points[fullLines-1];
	 }
	 $('#score').html(score);
}

function emptyRow() {
	var row = [];
	for (var i = 0; i < board.width; i++) {
		row.push(0);
	};
	return row;
}

function calculateGhostPiece() {
	var ghostPiece = piece.clone();
	while(check(ghostPiece.clone().goDown())) {
		ghostPiece.goDown();
	}
	return ghostPiece;
}

},{"./Board.js":1,"./CollisionDetection.js":2,"./Controls.js":3,"./Piece.js":4,"./Renderer.js":5}],10:[function(require,module,exports){
var pieceColors = {
	'I': '#27DEFF', //ljusblå
	'J': '#3C66FF', //blå
	'L': '#E8740C', //orange
	'O': '#FFD70D', //gul
	'S': '#26FF00', //grön
	'T': '#9E0CE8', //lila
	'Z': '#FF0000'  //röd
}

module.exports = {
	board: {
		stroke: false,
		background: 'pink',
		checkered: true,
		checked: {
			color1: '#fff',
			color2: '#eee'
		},
		stroke: false,
		strokeThickness: 0.3
	},
	piece: {
		strokeThickness: 3.5,
		stroke: true,
		colors: pieceColors,
		movingPiece: true //dummy no config property
	},
	ghostPiece: { 
		background: 'rgba(100, 100, 100, 0.6)', 
		stroke: false
	}
}
},{}]},{},[9])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzcvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwianMvQm9hcmQuanMiLCJqcy9Db2xsaXNpb25EZXRlY3Rpb24uanMiLCJqcy9Db250cm9scy5qcyIsImpzL1BpZWNlLmpzIiwianMvUmVuZGVyZXIuanMiLCJqcy9TaGFwZXMuanMiLCJqcy9oZWxwZXJzLmpzIiwianMva2V5cy5qcyIsImpzL21haW4uanMiLCJqcy9yZW5kZXJlckNvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cblx0dmFyIGJvYXJkID0gW1xuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdF07XG5cblx0Ym9hcmQuaGVpZ2h0ID0gYm9hcmQubGVuZ3RoO1xuXHRib2FyZC53aWR0aCA9IGJvYXJkWzBdLmxlbmd0aDtcblxuXHRyZXR1cm4gYm9hcmQ7XG59XG5cbiIsInZhciBQaWVjZSA9IHJlcXVpcmUoJy4vUGllY2UuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBDb2xsaXNpb25EZXRlY3Rpb24oY3JlYXRlT3B0aW9ucyl7XG5cdHZhciBib2FyZCA9IGNyZWF0ZU9wdGlvbnMuYm9hcmQ7XG5cdHJldHVybiB7XG5cdFx0Y2hlY2s6IGNoZWNrXG5cdH07XG5cblx0ZnVuY3Rpb24gY2hlY2socGllY2UpIHtcblx0XHR2YXIgc2hhcGUgPSBwaWVjZS5zaGFwZTtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBzaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBzaGFwZVtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdFx0aWYgKHNoYXBlW3Jvd11bY29sXSAhPT0gMCkge1xuXHRcdFx0XHRcdHZhciB5ID0gKHBpZWNlLnkgKyByb3cpO1xuXHRcdFx0XHRcdHZhciB4ID0gKHBpZWNlLnggKyBjb2wpO1xuXHRcdFx0XHRcdGlmICh5ID49IGJvYXJkLmhlaWdodCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHQgICAgICAgICAgICBcdH1cblx0XHRcdFx0XHRlbHNlIGlmIChib2FyZFt5XVt4XSAhPT0gMCApIHtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCB9XG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0cmV0dXJuIHRydWU7XHRcdFxuXHR9XG59XG4iLCJ2YXIga2V5cyA9IHJlcXVpcmUoJy4va2V5cy5qcycpO1xudmFyIFBpZWNlID0gcmVxdWlyZSgnLi9QaWVjZS5qcycpXG5cbnZhciBWQUxJRF9FVkVOVFMgPSBbJ2Rvd24nLCdyaWdodCcsJ2xlZnQnLCdkcm9wJywnaG9sZCcsJ3JvdGF0ZSddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIENvbnRyb2xzKGNyZWF0ZU9wdGlvbnMpIHtcblxuXHR2YXIgbGlzdGVuZXJzO1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdCxcblx0XHRvbjogYWRkTGlzdGVuZXIsXG5cdFx0b2ZmOiByZW1vdmVMaXN0ZW5lclxuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHQkKGRvY3VtZW50KS5vbigna2V5ZG93bicsIGtleVByZXNzZWQpO1xuXG5cdFx0bGlzdGVuZXJzID0ge307XG5cdFx0VkFMSURfRVZFTlRTLmZvckVhY2goZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdGxpc3RlbmVyc1tldmVudF0gPSBbXTtcblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gYWRkTGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrKSB7XG5cdFx0bGlzdGVuZXJzW2V2ZW50XS5wdXNoKGNhbGxiYWNrKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKGV2ZW50LCBjYWxsYmFjaykge1xuXHRcdHZhciBpbmRleCA9IGxpc3RlbmVyc1tldmVudF0uaW5kZXhPZihjYWxsYmFjayk7XG5cdFx0bGlzdGVuZXJzW2V2ZW50XS5zcGxpY2UoaW5kZXgsMSk7XG5cdH1cblxuXHRmdW5jdGlvbiBlbWl0KGV2ZW50KSB7XG5cdFx0bGlzdGVuZXJzW2V2ZW50XS5mb3JFYWNoKGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdFx0XHRjYWxsYmFjaygpO1xuXHRcdH0pXG5cdH1cblx0XG5cdGZ1bmN0aW9uIGtleVByZXNzZWQoZSkge1xuXHRcdGlmIChlLmtleUNvZGUgPT09IGtleXMuUklHSFQpIGVtaXQoJ3JpZ2h0Jyk7XG5cdFx0aWYgKGUua2V5Q29kZSA9PT0ga2V5cy5MRUZUKSBlbWl0KCdsZWZ0Jyk7XG5cdFx0aWYgKGUua2V5Q29kZSA9PT0ga2V5cy5VUCkgIGVtaXQoJ3JvdGF0ZScpO1xuXHRcdGlmKGUua2V5Q29kZSA9PT0ga2V5cy5ET1dOKSBlbWl0KCdkb3duJyk7XG5cdFx0aWYoZS5rZXlDb2RlID09PSBrZXlzLlNQQUNFKSBlbWl0KCdkcm9wJyk7XG5cdFx0aWYoZS5rZXlDb2RlID09PSBrZXlzLlNISUZUKSBlbWl0KCdob2xkJyk7XG5cdH1cbn0iLCJ2YXIgU2hhcGVzID0gcmVxdWlyZSgnLi9TaGFwZXMuanMnKTtcblxuZnVuY3Rpb24gUGllY2Uob3B0aW9ucykge1xuXHR0aGlzLnR5cGUgPSBvcHRpb25zLnR5cGU7XG5cdHRoaXMueCA9IG9wdGlvbnMueCB8fCAwO1xuXHR0aGlzLnkgPSBvcHRpb25zLnkgfHwgMDtcdFxuXHR0aGlzLnNoYXBlID0gb3B0aW9ucy5zaGFwZSB8fCBTaGFwZXNbdGhpcy50eXBlXS5zaGFwZTtcbn1cblxuUGllY2UucHJvdG90eXBlLmdvUmlnaHQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy54Kys7XG5cdHJldHVybiB0aGlzO1xufVxuXG5QaWVjZS5wcm90b3R5cGUuZ29MZWZ0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMueC0tO1xuXHRyZXR1cm4gdGhpcztcbn1cblxuUGllY2UucHJvdG90eXBlLmdvRG93biA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnkrKztcblx0cmV0dXJuIHRoaXM7XG59XG5cblBpZWNlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gbmV3IFBpZWNlKHRoaXMpO1xufVxuXG5QaWVjZS5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuc2hhcGUgPSByb3RhdGlvbih0aGlzLnNoYXBlKTtcblx0cmV0dXJuIHRoaXM7XG59XG5cbmZ1bmN0aW9uIHJvdGF0aW9uKHNoYXBlKSB7XG5cdHZhciBuID0gW107XG5cdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHR2YXIgcCA9IFtdO1xuXHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0cC5wdXNoKHNoYXBlW3NoYXBlLmxlbmd0aCAtIGNvbCAtIDFdW3Jvd10pO1xuXHRcdH07XG5cdFx0bi5wdXNoKHApXG5cdH07XG5cdHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBsb2dTaGFwZShzaGFwZSkge1xuXHR2YXIgc2hhcGVTdHJpbmcgPSBcIlwiO1xuXHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBzaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRzaGFwZVN0cmluZyArPSBcdHNoYXBlW3Jvd11bY29sXTtcblx0XHR9O1xuXHRcdHNoYXBlU3RyaW5nICs9ICdcXG4nO1xuXHR9O1xuXHRjb25zb2xlLmxvZyhzaGFwZVN0cmluZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGllY2U7IiwidmFyIGNvbG9yTHVtaW5hbmNlID0gcmVxdWlyZSgnLi9oZWxwZXJzLmpzJykuY29sb3JMdW1pbmFuY2U7XG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi9yZW5kZXJlckNvbmZpZy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFJlbmRlcmVyKG9wdGlvbnMpIHtcblx0dmFyIGJvYXJkID0gb3B0aW9ucy5ib2FyZDtcblx0dmFyIGNvbG9ySW5kZXhlcyA9IFsnSScsICdKJywgJ0wnLCAnTycsICdTJywgJ1QnLCAnWiddO1xuXHRib2FyZC5oZWlnaHQgPSBib2FyZC5sZW5ndGg7XG5cdGJvYXJkLndpZHRoID0gYm9hcmRbMF0ubGVuZ3RoO1xuXHR2YXIgY29udGV4dDtcblx0dmFyIGNhbnZhcztcblx0dmFyIHNpemU7XG5cdHNxdWFyZSA9IHt9O1xuXHRpbml0KCk7XG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdCxcblx0XHRyZW5kZXI6IHJlbmRlcixcblx0XHRmaWxsU3F1YXJlOiBmaWxsU3F1YXJlXG5cdH07XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1jYW52YXMnKTtcblx0XHRjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0Ly9jb250ZXh0LnNjYWxlKDIsMik7XG5cdFx0Y2FsY3VsYXRlU3F1YXJlU2l6ZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVuZGVyKHBpZWNlLCBnaG9zdFBpZWNlKSB7XG5cdFx0Ly9jbGVhcigpO1xuXHRcdHJlbmRlckJvYXJkKGNvbmZpZyk7XG5cdFx0cmVuZGVyUGllY2UoZ2hvc3RQaWVjZSwgY29uZmlnLmdob3N0UGllY2UpO1xuXHRcdHJlbmRlclBpZWNlKHBpZWNlLCBjb25maWcucGllY2UpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVuZGVyQm9hcmQoY29uZmlnKSB7XG5cdFx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgYm9hcmQubGVuZ3RoOyByb3crKykge1xuXHRcdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgYm9hcmRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRcdGlmKGJvYXJkW3Jvd11bY29sXSAhPT0gMCkge1xuXHRcdFx0XHRcdHZhciBibG9ja1R5cGUgPSBjb2xvckluZGV4ZXMgWyAoYm9hcmRbcm93XVtjb2xdLTEpIF07XG5cdFx0XHRcdFx0dmFyIGJnID0gY29uZmlnLnBpZWNlLmNvbG9yc1tibG9ja1R5cGVdO1xuXHRcdFx0XHRcdGNvbmZpZy5waWVjZS5iYWNrZ3JvdW5kID0gYmc7XG5cdFx0XHRcdFx0cmVuZGVyU3F1YXJlKGNvbCwgcm93LCBjb25maWcucGllY2UpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHZhciBiZztcblx0XHRcdFx0XHRpZiAoY29uZmlnLmJvYXJkLmNoZWNrZXJlZCkge1xuXHRcdFx0XHRcdFx0YmcgPSBldmVuKHJvdyArIGNvbCkgPyBjb25maWcuYm9hcmQuY2hlY2tlZC5jb2xvcjEgOiBjb25maWcuYm9hcmQuY2hlY2tlZC5jb2xvcjI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0YmcgPSBjb25maWcuYm9hcmQuYmFja2dyb3VuZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y29uZmlnLmJvYXJkLmJhY2tncm91bmQgPSBiZztcblx0XHRcdFx0XHRyZW5kZXJTcXVhcmUoY29sLCByb3csIGNvbmZpZy5ib2FyZCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlbmRlclBpZWNlKHBpZWNlLCBjb25maWcpIHtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBwaWVjZS5zaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBwaWVjZS5zaGFwZVtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdFx0dmFyIHggPSAocGllY2UueCArIGNvbCk7XG5cdFx0XHRcdHZhciB5ID0gKHBpZWNlLnkgKyByb3cpO1xuXG5cdFx0XHRcdGlmKCBwaWVjZS5zaGFwZVtyb3ddW2NvbF0gIT09IDAgKSB7XG5cdFx0XHRcdFx0aWYoY29uZmlnLm1vdmluZ1BpZWNlKSB7XG5cdFx0XHRcdFx0XHR2YXIgYmcgPSBjb25maWcuY29sb3JzW3BpZWNlLnR5cGVdO1xuXHRcdFx0XHRcdFx0Y29uZmlnLmJhY2tncm91bmQgPSBiZztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVuZGVyU3F1YXJlKHgsIHksIGNvbmZpZyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHR9O1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXJTcXVhcmUoaSwgaiwgb3B0aW9ucykge1xuXHRcdGZpbGxTcXVhcmUoc3F1YXJlLndpZHRoICogaSwgc3F1YXJlLmhlaWdodCAqIGosIG9wdGlvbnMpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZmlsbFNxdWFyZSh4LCB5LCBvcHRpb25zKSB7XG5cdFx0dmFyIGNvbG9yID0gb3B0aW9ucy5iZyB8fCBvcHRpb25zLmJhY2tncm91bmQ7XG5cdFx0Y29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcblx0XHRjb250ZXh0LmZpbGxSZWN0KHgsIHksIHNxdWFyZS53aWR0aCwgc3F1YXJlLmhlaWdodCk7XG5cdFx0XG5cdFx0dmFyIHN0cm9rZSA9ICgob3B0aW9ucy5zdHJva2UgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnN0cm9rZSA6IHRydWUpO1xuXHRcdGlmKHN0cm9rZSkge1xuXHRcdFx0dmFyIHN0cm9rZUNvbG9yID0gY29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjEpO1xuXHRcdFx0dmFyIHN0cm9rZVRoaWNrbmVzcyA9IG9wdGlvbnMuc3Ryb2tlVGhpY2tuZXNzIHx8IDIuNTtcblx0XHRcdC8vZHJhd1N0cm9rZSh4LCB5LCB7c3Ryb2tlQ29sb3IsIHN0cm9rZVRoaWNrbmVzc30pXG5cdFx0XHRjb250ZXh0LnN0cm9rZVN0eWxlID0gc3Ryb2tlQ29sb3I7XG5cdFx0XHRjb250ZXh0LmxpbmVXaWR0aCA9IHN0cm9rZVRoaWNrbmVzcztcblx0XHRcdHZhciB4ID0geCArIHN0cm9rZVRoaWNrbmVzcyAqIDAuNTtcblx0XHRcdHZhciB5ID0geSArIHN0cm9rZVRoaWNrbmVzcyAqIDAuNTtcblx0XHRcdHZhciB3aWR0aCA9IHNxdWFyZS53aWR0aCAtIHN0cm9rZVRoaWNrbmVzcztcblx0XHRcdHZhciBoZWlnaHQgPSBzcXVhcmUuaGVpZ2h0IC0gc3Ryb2tlVGhpY2tuZXNzO1xuXHRcdFx0Y29udGV4dC5zdHJva2VSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGNhbGN1bGF0ZVNxdWFyZVNpemUoKSB7XG5cdFx0c3F1YXJlLndpZHRoID0gY2FudmFzLndpZHRoIC8gYm9hcmQud2lkdGg7XG5cdFx0c3F1YXJlLmhlaWdodCA9IGNhbnZhcy5oZWlnaHQgLyBib2FyZC5oZWlnaHQ7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGNsZWFyKCkge1xuXHRcdGNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdFx0Y29udGV4dC5jbGVhclJlY3QgKCAwICwgMCAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZXZlbihudW1iZXIpIHtcblx0XHRyZXR1cm4gKCBudW1iZXIgJSAyID09IDAgKTtcblx0fVxufSIsInZhciBTaGFwZXMgPSBtb2R1bGUuZXhwb3J0cyA9IHtcblx0J0knOiB7XG5cdFx0c2hhcGU6IFsgWzAsIDAsIDAsIDBdLCBcblx0XHRcdFx0IFsxLCAxLCAxLCAxXSwgXG5cdFx0XHRcdCBbMCwgMCwgMCwgMF0sIFxuXHRcdFx0XHQgWzAsIDAsIDAsIDBdIF1cblx0fSxcblx0J0onOiB7XG5cdFx0c2hhcGU6IFsgWzAsIDAsIDBdLCBcblx0XHRcdFx0IFsxLCAxLCAxXSwgXG5cdFx0XHRcdCBbMCwgMCwgMV0gXVxuXHR9LFxuXHQnTCc6IHtcblx0XHRzaGFwZTogWyBbMCwgMCwgMF0sIFxuXHRcdFx0XHQgWzEsIDEsIDFdLCBcblx0XHRcdFx0IFsxLCAwLCAwXSBdXG5cdH0sXG5cdCdPJzoge1xuXHRcdHNoYXBlOiBbIFsxLCAxXSwgXG5cdFx0XHRcdCBbMSwgMV0gXVxuXHR9LFxuXHQnUyc6IHtcblx0XHRzaGFwZTogWyBbMCwgMSwgMV0sIFxuXHRcdFx0XHQgWzEsIDEsIDBdLCBcblx0XHRcdFx0IFswLCAwLCAwXSBdXG5cdH0sXG5cdCdUJzoge1xuXHRcdHNoYXBlOiBbIFswLCAxLCAwXSwgXG5cdFx0XHRcdCBbMSwgMSwgMV0sIFxuXHRcdFx0XHQgWzAsIDAsIDBdIF1cblx0fSxcblx0J1onOiB7XG5cdFx0c2hhcGU6IFsgWzEsIDEsIDBdLCBcblx0XHRcdFx0IFswLCAxLCAxXSwgXG5cdFx0XHRcdCBbMCwgMCwgMF0gXVxuXHR9XG59O1xuIiwiZnVuY3Rpb24gY29sb3JMdW1pbmFuY2UoaGV4LCBsdW0pIHtcblxuXHQvLyB2YWxpZGF0ZSBoZXggc3RyaW5nXG5cdGhleCA9IFN0cmluZyhoZXgpLnJlcGxhY2UoL1teMC05YS1mXS9naSwgJycpO1xuXHRpZiAoaGV4Lmxlbmd0aCA8IDYpIHtcblx0XHRoZXggPSBoZXhbMF0raGV4WzBdK2hleFsxXStoZXhbMV0raGV4WzJdK2hleFsyXTtcblx0fVxuXHRsdW0gPSBsdW0gfHwgMDtcblxuXHQvLyBjb252ZXJ0IHRvIGRlY2ltYWwgYW5kIGNoYW5nZSBsdW1pbm9zaXR5XG5cdHZhciByZ2IgPSBcIiNcIiwgYywgaTtcblx0Zm9yIChpID0gMDsgaSA8IDM7IGkrKykge1xuXHRcdGMgPSBwYXJzZUludChoZXguc3Vic3RyKGkqMiwyKSwgMTYpO1xuXHRcdGMgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KDAsIGMgKyAoYyAqIGx1bSkpLCAyNTUpKS50b1N0cmluZygxNik7XG5cdFx0cmdiICs9IChcIjAwXCIrYykuc3Vic3RyKGMubGVuZ3RoKTtcblx0fVxuXG5cdHJldHVybiByZ2I7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRjb2xvckx1bWluYW5jZTogY29sb3JMdW1pbmFuY2Vcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0U1BBQ0U6IDMyLFxuXHRMRUZUOiAzNyxcblx0UklHSFQ6IDM5LFxuXHRVUDogMzgsXG5cdERPV046IDQwLFxuXHRTSElGVDogMTZcbn07XG4iLCJ2YXIgQm9hcmQgPSByZXF1aXJlKCcuL0JvYXJkLmpzJyk7XG52YXIgUGllY2UgPSByZXF1aXJlKCcuL1BpZWNlLmpzJyk7XG52YXIgQ29sbGlzaW9uRGV0ZWN0aW9uID0gcmVxdWlyZSgnLi9Db2xsaXNpb25EZXRlY3Rpb24uanMnKTtcbnZhciBDb250cm9scyA9IHJlcXVpcmUoJy4vQ29udHJvbHMuanMnKTtcbnZhciBSZW5kZXJlciA9IHJlcXVpcmUoJy4vUmVuZGVyZXIuanMnKTtcblxudmFyIGJsb2NrcyA9IFsnSScsICdKJywgJ0wnLCAnTycsICdTJywgJ1QnLCAnWiddO1xuXG52YXIgYm9hcmQgPSBCb2FyZCgpO1xudmFyIHBpZWNlID0gZ2VuZXJhdGVSYW5kb21QaWVjZSgpO1xudmFyIGNvbGxpc2lvbkRldGVjdGlvbiA9IENvbGxpc2lvbkRldGVjdGlvbih7XG5cdGJvYXJkOiBib2FyZFxufSk7XG52YXIgY2hlY2sgPSBjb2xsaXNpb25EZXRlY3Rpb24uY2hlY2s7XG5cbnZhciByZW5kZXJlciA9IFJlbmRlcmVyKHtib2FyZDogYm9hcmR9KTtcbnZhciBjb250cm9scyA9IENvbnRyb2xzKCk7XG5jb250cm9scy5pbml0KCk7XG5cbmNvbnRyb2xzLm9uKCdyaWdodCcsIGZ1bmN0aW9uKCkge1xuXHRpZiAoY2hlY2socGllY2UuY2xvbmUoKS5nb1JpZ2h0KCkpKSB7XG5cdFx0cGllY2UuZ29SaWdodCgpO1xuXHRcdHJlbmRlcmVyLnJlbmRlcihwaWVjZSwgY2FsY3VsYXRlR2hvc3RQaWVjZSgpKTtcdFxuXHR9XG59KVx0XHRcdFxuY29udHJvbHMub24oJ2xlZnQnLCBmdW5jdGlvbigpIHtcblx0aWYgKGNoZWNrKHBpZWNlLmNsb25lKCkuZ29MZWZ0KCkpKSB7XG5cdFx0cGllY2UuZ29MZWZ0KCk7XG5cdFx0cmVuZGVyZXIucmVuZGVyKHBpZWNlLCBjYWxjdWxhdGVHaG9zdFBpZWNlKCkpO1x0XG5cdH1cbn0pO1xuY29udHJvbHMub24oJ3JvdGF0ZScsIGZ1bmN0aW9uKCkge1xuXHR3YWxsS2ljayhwaWVjZS5yb3RhdGUoKSk7XG5cdHJlbmRlcmVyLnJlbmRlcihwaWVjZSwgY2FsY3VsYXRlR2hvc3RQaWVjZSgpKTtcdFxufSk7XG5jb250cm9scy5vbignZG93bicsIGZ1bmN0aW9uKCkge1xuXHRpZiAoY2hlY2socGllY2UuY2xvbmUoKS5nb0Rvd24oKSkpIHtcblx0XHRwaWVjZS5nb0Rvd24oKTtcblx0XHRyZW5kZXJlci5yZW5kZXIocGllY2UsIGNhbGN1bGF0ZUdob3N0UGllY2UoKSk7XHRcblx0fVxufSk7XG5jb250cm9scy5vbignZHJvcCcsIGZ1bmN0aW9uKCkge1xuXHR2YXIgbmV3UGllY2UgPSBwaWVjZS5jbG9uZSgpO1xuXHR3aGlsZShjaGVjayhuZXdQaWVjZS5jbG9uZSgpLmdvRG93bigpKSkge1xuXHRcdG5ld1BpZWNlLmdvRG93bigpO1xuXHR9XG5cdGF0dGFjaFBpZWNlVG9Cb2FyZChuZXdQaWVjZSk7XG5cdHJlbW92ZUxpbmVzKCk7XG5cdHBpZWNlID0gZ2VuZXJhdGVSYW5kb21QaWVjZSgpO1xuXHRyZW5kZXJlci5yZW5kZXIocGllY2UsIGNhbGN1bGF0ZUdob3N0UGllY2UoKSk7XHRcbn0pO1xuXG5cbnZhciBwb2ludHMgPSBbNDAsIDEwMCwgMzAwLCAxMjAwXTtcbnZhciBzY29yZSA9IDA7XG4kKCcjc2NvcmUnKS52YWwoc2NvcmUpO1xuXG5yZW5kZXJlci5yZW5kZXIocGllY2UsIGNhbGN1bGF0ZUdob3N0UGllY2UoKSk7XG5zZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcblx0cmVuZGVyZXIucmVuZGVyKHBpZWNlLCBjYWxjdWxhdGVHaG9zdFBpZWNlKCkpO1xuXG5cdGlmIChjaGVjayhwaWVjZS5jbG9uZSgpLmdvRG93bigpKSkge1xuXHRcdHBpZWNlLmdvRG93bigpO1xuXHR9IFxuXHRlbHNlIHtcblx0XHQvL3dhaXQgZm9yIHVzZXIgbm8gaW5wdXQgYW5kIHNwZWNpZmllZCBzZWNvbmRzXG5cdFx0YXR0YWNoUGllY2VUb0JvYXJkKHBpZWNlKTtcblx0XHRyZW1vdmVMaW5lcygpO1xuXHRcdHBpZWNlID0gZ2VuZXJhdGVSYW5kb21QaWVjZSgpO1xuXHR9XG5cbn0sIDUwMCk7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tUGllY2UgKCkge1xuXHR2YXIgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYmxvY2tzLmxlbmd0aCk7XG5cdHZhciBwID0gbmV3IFBpZWNlKHtcblx0XHR0eXBlOiBibG9ja3NbcmFuZG9tXSxcblx0XHR4OiAzLFxuXHRcdHk6IDAgXG5cdH0pO1xuXHRyZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gYXR0YWNoUGllY2VUb0JvYXJkKHBpZWNlKSB7XG5cdHZhciBzaGFwZSA9IHBpZWNlLnNoYXBlO1xuXHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBzaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRpZihzaGFwZVtyb3ddW2NvbF0gIT09IDApIHtcblx0XHRcdFx0dmFyIHggPSBwaWVjZS54ICsgY29sO1xuXHRcdFx0XHR2YXIgeSA9IHBpZWNlLnkgKyByb3c7XG5cdFx0XHRcdHZhciBpbmRleCA9IGJsb2Nrcy5pbmRleE9mKHBpZWNlLnR5cGUpICsgMTtcblx0XHRcdFx0XHRib2FyZFt5XVt4XSA9IGluZGV4O1xuXHRcdFx0fVxuXHRcdH07XG5cdH07XG59XG5cbmZ1bmN0aW9uIHdhbGxLaWNrKHBpZWNlKSB7XG5cdHZhciBzaGFwZSA9IHBpZWNlLnNoYXBlO1xuXHR2YXIgeHMgPVtdO1xuXHR2YXIgeXMgPVtdO1xuXHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBzaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRpZihzaGFwZVtyb3ddW2NvbF0gIT09IDApIHtcblx0XHRcdFx0eHMucHVzaChwaWVjZS54ICsgY29sKTtcblx0XHRcdFx0eXMucHVzaChwaWVjZS55ICsgcm93KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9O1xuXG5cdHZhciBvdXRzaWRlTGVmdCA9IF8ubWluKHhzKSA8IDA7XG5cdGlmKG91dHNpZGVMZWZ0KSB7XG5cdFx0cGllY2UueCAtPSBfLm1pbih4cyk7XG5cdH1cblx0dmFyIG91dHNpZGVSaWdodCA9IF8ubWF4KHhzKSA+IChib2FyZC53aWR0aC0xKTtcblx0aWYob3V0c2lkZVJpZ2h0KSB7XG5cdFx0dmFyIGRpZmYgPSAoXy5tYXgoeHMpICsxIC0gYm9hcmQud2lkdGgpO1xuXHRcdHBpZWNlLnggLT0gZGlmZjtcblx0fVxuXHR2YXIgb3V0c2lkZUJvdHRvbSA9IF8ubWF4KHlzKSA+IChib2FyZC5oZWlnaHQtMSk7XG5cdGlmKG91dHNpZGVCb3R0b20pIHtcblx0XHR2YXIgZGlmZiA9IChfLm1heCh5cykgKzEgLSBib2FyZC5oZWlnaHQpO1xuXHRcdHBpZWNlLnkgLT0gZGlmZjtcdFx0XHRcblx0fVxuXG5cdHJldHVybiBwaWVjZTtcbn1cblxuXG5mdW5jdGlvbiByZW1vdmVMaW5lcygpIHtcblx0dmFyIGZ1bGxMaW5lcyA9IDA7XG5cdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IGJvYXJkLmxlbmd0aDsgcm93KyspIHtcblx0XHR2YXIgZnVsbExpbmUgPSAoXy5taW4oYm9hcmRbcm93XSkgIT09IDApO1xuXHRcdGlmKGZ1bGxMaW5lKSB7XG5cdFx0XHRmdWxsTGluZXMrKztcblx0XHRcdGJvYXJkLnNwbGljZShyb3csMSk7XG5cdFx0XHRib2FyZC51bnNoaWZ0KGVtcHR5Um93KCkpO1xuXHRcdH1cblx0fTtcblx0IGlmKGZ1bGxMaW5lcyA+IDApe1xuXHQgXHRzY29yZSArPSBwb2ludHNbZnVsbExpbmVzLTFdO1xuXHQgfVxuXHQgJCgnI3Njb3JlJykuaHRtbChzY29yZSk7XG59XG5cbmZ1bmN0aW9uIGVtcHR5Um93KCkge1xuXHR2YXIgcm93ID0gW107XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYm9hcmQud2lkdGg7IGkrKykge1xuXHRcdHJvdy5wdXNoKDApO1xuXHR9O1xuXHRyZXR1cm4gcm93O1xufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVHaG9zdFBpZWNlKCkge1xuXHR2YXIgZ2hvc3RQaWVjZSA9IHBpZWNlLmNsb25lKCk7XG5cdHdoaWxlKGNoZWNrKGdob3N0UGllY2UuY2xvbmUoKS5nb0Rvd24oKSkpIHtcblx0XHRnaG9zdFBpZWNlLmdvRG93bigpO1xuXHR9XG5cdHJldHVybiBnaG9zdFBpZWNlO1xufVxuIiwidmFyIHBpZWNlQ29sb3JzID0ge1xuXHQnSSc6ICcjMjdERUZGJywgLy9sanVzYmzDpVxuXHQnSic6ICcjM0M2NkZGJywgLy9ibMOlXG5cdCdMJzogJyNFODc0MEMnLCAvL29yYW5nZVxuXHQnTyc6ICcjRkZENzBEJywgLy9ndWxcblx0J1MnOiAnIzI2RkYwMCcsIC8vZ3LDtm5cblx0J1QnOiAnIzlFMENFOCcsIC8vbGlsYVxuXHQnWic6ICcjRkYwMDAwJyAgLy9yw7ZkXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRib2FyZDoge1xuXHRcdHN0cm9rZTogZmFsc2UsXG5cdFx0YmFja2dyb3VuZDogJ3BpbmsnLFxuXHRcdGNoZWNrZXJlZDogdHJ1ZSxcblx0XHRjaGVja2VkOiB7XG5cdFx0XHRjb2xvcjE6ICcjZmZmJyxcblx0XHRcdGNvbG9yMjogJyNlZWUnXG5cdFx0fSxcblx0XHRzdHJva2U6IGZhbHNlLFxuXHRcdHN0cm9rZVRoaWNrbmVzczogMC4zXG5cdH0sXG5cdHBpZWNlOiB7XG5cdFx0c3Ryb2tlVGhpY2tuZXNzOiAzLjUsXG5cdFx0c3Ryb2tlOiB0cnVlLFxuXHRcdGNvbG9yczogcGllY2VDb2xvcnMsXG5cdFx0bW92aW5nUGllY2U6IHRydWUgLy9kdW1teSBubyBjb25maWcgcHJvcGVydHlcblx0fSxcblx0Z2hvc3RQaWVjZTogeyBcblx0XHRiYWNrZ3JvdW5kOiAncmdiYSgxMDAsIDEwMCwgMTAwLCAwLjYpJywgXG5cdFx0c3Ryb2tlOiBmYWxzZVxuXHR9XG59Il19
