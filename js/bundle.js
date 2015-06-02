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
				
					var isBelowBottom = y >= board.height;
					if (isBelowBottom) return false;
	           
					var isSpaceTaken = board[y][x] !== 0;
					if (isSpaceTaken) return false;
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
	var pieceTypes = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
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
					var pieceType = pieceTypes [ (board[row][col]-1) ];
					var bg = config.piece.colors[pieceType];
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

var pieceTypes = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

var board = Board();
var collisionDetection = CollisionDetection({
	board: board
});
var check = collisionDetection.check;
var renderer = Renderer({board: board});
var controls = Controls();
controls.init();

var piece = generateRandomPiece();

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
	var random = Math.floor(Math.random() * pieceTypes.length);
	var p = new Piece({
		type: pieceTypes[random],
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
				var index = pieceTypes.indexOf(piece.type) + 1;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzcvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwianMvQm9hcmQuanMiLCJqcy9Db2xsaXNpb25EZXRlY3Rpb24uanMiLCJqcy9Db250cm9scy5qcyIsImpzL1BpZWNlLmpzIiwianMvUmVuZGVyZXIuanMiLCJqcy9TaGFwZXMuanMiLCJqcy9oZWxwZXJzLmpzIiwianMva2V5cy5qcyIsImpzL21haW4uanMiLCJqcy9yZW5kZXJlckNvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuXHR2YXIgYm9hcmQgPSBbXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XTtcblxuXHRib2FyZC5oZWlnaHQgPSBib2FyZC5sZW5ndGg7XG5cdGJvYXJkLndpZHRoID0gYm9hcmRbMF0ubGVuZ3RoO1xuXG5cdHJldHVybiBib2FyZDtcbn1cblxuIiwidmFyIFBpZWNlID0gcmVxdWlyZSgnLi9QaWVjZS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIENvbGxpc2lvbkRldGVjdGlvbihjcmVhdGVPcHRpb25zKXtcblx0dmFyIGJvYXJkID0gY3JlYXRlT3B0aW9ucy5ib2FyZDtcblx0cmV0dXJuIHtcblx0XHRjaGVjazogY2hlY2tcblx0fTtcblxuXHRmdW5jdGlvbiBjaGVjayhwaWVjZSkge1xuXHRcdHZhciBzaGFwZSA9IHBpZWNlLnNoYXBlO1xuXHRcdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0XHRpZiAoc2hhcGVbcm93XVtjb2xdICE9PSAwKSB7XG5cdFx0XHRcdFx0dmFyIHkgPSAocGllY2UueSArIHJvdyk7XG5cdFx0XHRcdFx0dmFyIHggPSAocGllY2UueCArIGNvbCk7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdHZhciBpc0JlbG93Qm90dG9tID0geSA+PSBib2FyZC5oZWlnaHQ7XG5cdFx0XHRcdFx0aWYgKGlzQmVsb3dCb3R0b20pIHJldHVybiBmYWxzZTtcblx0ICAgICAgICAgICBcblx0XHRcdFx0XHR2YXIgaXNTcGFjZVRha2VuID0gYm9hcmRbeV1beF0gIT09IDA7XG5cdFx0XHRcdFx0aWYgKGlzU3BhY2VUYWtlbikgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHQgfVxuXHRcdFx0fTtcblx0XHR9O1xuXHRcdHJldHVybiB0cnVlO1x0XHRcblx0fVxufVxuIiwidmFyIGtleXMgPSByZXF1aXJlKCcuL2tleXMuanMnKTtcbnZhciBQaWVjZSA9IHJlcXVpcmUoJy4vUGllY2UuanMnKVxuXG52YXIgVkFMSURfRVZFTlRTID0gWydkb3duJywncmlnaHQnLCdsZWZ0JywnZHJvcCcsJ2hvbGQnLCdyb3RhdGUnXTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBDb250cm9scyhjcmVhdGVPcHRpb25zKSB7XG5cblx0dmFyIGxpc3RlbmVycztcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXQsXG5cdFx0b246IGFkZExpc3RlbmVyLFxuXHRcdG9mZjogcmVtb3ZlTGlzdGVuZXJcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0JChkb2N1bWVudCkub24oJ2tleWRvd24nLCBrZXlQcmVzc2VkKTtcblxuXHRcdGxpc3RlbmVycyA9IHt9O1xuXHRcdFZBTElEX0VWRU5UUy5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRsaXN0ZW5lcnNbZXZlbnRdID0gW107XG5cdFx0fSlcblx0fVxuXG5cdGZ1bmN0aW9uIGFkZExpc3RlbmVyKGV2ZW50LCBjYWxsYmFjaykge1xuXHRcdGxpc3RlbmVyc1tldmVudF0ucHVzaChjYWxsYmFjayk7XG5cdH1cblxuXHRmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcihldmVudCwgY2FsbGJhY2spIHtcblx0XHR2YXIgaW5kZXggPSBsaXN0ZW5lcnNbZXZlbnRdLmluZGV4T2YoY2FsbGJhY2spO1xuXHRcdGxpc3RlbmVyc1tldmVudF0uc3BsaWNlKGluZGV4LDEpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZW1pdChldmVudCkge1xuXHRcdGxpc3RlbmVyc1tldmVudF0uZm9yRWFjaChmdW5jdGlvbihjYWxsYmFjaykge1xuXHRcdFx0Y2FsbGJhY2soKTtcblx0XHR9KVxuXHR9XG5cdFxuXHRmdW5jdGlvbiBrZXlQcmVzc2VkKGUpIHtcblx0XHRpZiAoZS5rZXlDb2RlID09PSBrZXlzLlJJR0hUKSBlbWl0KCdyaWdodCcpO1xuXHRcdGlmIChlLmtleUNvZGUgPT09IGtleXMuTEVGVCkgZW1pdCgnbGVmdCcpO1xuXHRcdGlmIChlLmtleUNvZGUgPT09IGtleXMuVVApICBlbWl0KCdyb3RhdGUnKTtcblx0XHRpZihlLmtleUNvZGUgPT09IGtleXMuRE9XTikgZW1pdCgnZG93bicpO1xuXHRcdGlmKGUua2V5Q29kZSA9PT0ga2V5cy5TUEFDRSkgZW1pdCgnZHJvcCcpO1xuXHRcdGlmKGUua2V5Q29kZSA9PT0ga2V5cy5TSElGVCkgZW1pdCgnaG9sZCcpO1xuXHR9XG59IiwidmFyIFNoYXBlcyA9IHJlcXVpcmUoJy4vU2hhcGVzLmpzJyk7XG5cbmZ1bmN0aW9uIFBpZWNlKG9wdGlvbnMpIHtcblx0dGhpcy50eXBlID0gb3B0aW9ucy50eXBlO1xuXHR0aGlzLnggPSBvcHRpb25zLnggfHwgMDtcblx0dGhpcy55ID0gb3B0aW9ucy55IHx8IDA7XHRcblx0dGhpcy5zaGFwZSA9IG9wdGlvbnMuc2hhcGUgfHwgU2hhcGVzW3RoaXMudHlwZV0uc2hhcGU7XG59XG5cblBpZWNlLnByb3RvdHlwZS5nb1JpZ2h0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMueCsrO1xuXHRyZXR1cm4gdGhpcztcbn1cblxuUGllY2UucHJvdG90eXBlLmdvTGVmdCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLngtLTtcblx0cmV0dXJuIHRoaXM7XG59XG5cblBpZWNlLnByb3RvdHlwZS5nb0Rvd24gPSBmdW5jdGlvbigpIHtcblx0dGhpcy55Kys7XG5cdHJldHVybiB0aGlzO1xufVxuXG5QaWVjZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIG5ldyBQaWVjZSh0aGlzKTtcbn1cblxuUGllY2UucHJvdG90eXBlLnJvdGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnNoYXBlID0gcm90YXRpb24odGhpcy5zaGFwZSk7XG5cdHJldHVybiB0aGlzO1xufVxuXG5mdW5jdGlvbiByb3RhdGlvbihzaGFwZSkge1xuXHR2YXIgbiA9IFtdO1xuXHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBzaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0dmFyIHAgPSBbXTtcblx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBzaGFwZVtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdHAucHVzaChzaGFwZVtzaGFwZS5sZW5ndGggLSBjb2wgLSAxXVtyb3ddKTtcblx0XHR9O1xuXHRcdG4ucHVzaChwKVxuXHR9O1xuXHRyZXR1cm4gbjtcbn1cblxuZnVuY3Rpb24gbG9nU2hhcGUoc2hhcGUpIHtcblx0dmFyIHNoYXBlU3RyaW5nID0gXCJcIjtcblx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgc2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0c2hhcGVTdHJpbmcgKz0gXHRzaGFwZVtyb3ddW2NvbF07XG5cdFx0fTtcblx0XHRzaGFwZVN0cmluZyArPSAnXFxuJztcblx0fTtcblx0Y29uc29sZS5sb2coc2hhcGVTdHJpbmcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBpZWNlOyIsInZhciBjb2xvckx1bWluYW5jZSA9IHJlcXVpcmUoJy4vaGVscGVycy5qcycpLmNvbG9yTHVtaW5hbmNlO1xudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vcmVuZGVyZXJDb25maWcuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBSZW5kZXJlcihvcHRpb25zKSB7XG5cdHZhciBib2FyZCA9IG9wdGlvbnMuYm9hcmQ7XG5cdHZhciBwaWVjZVR5cGVzID0gWydJJywgJ0onLCAnTCcsICdPJywgJ1MnLCAnVCcsICdaJ107XG5cdHZhciBjb250ZXh0O1xuXHR2YXIgY2FudmFzO1xuXHR2YXIgc2l6ZTtcblx0c3F1YXJlID0ge307XG5cdGluaXQoKTtcblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0LFxuXHRcdHJlbmRlcjogcmVuZGVyLFxuXHRcdGZpbGxTcXVhcmU6IGZpbGxTcXVhcmVcblx0fTtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLWNhbnZhcycpO1xuXHRcdGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHQvL2NvbnRleHQuc2NhbGUoMiwyKTtcblx0XHRjYWxjdWxhdGVTcXVhcmVTaXplKCk7XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXIocGllY2UsIGdob3N0UGllY2UpIHtcblx0XHQvL2NsZWFyKCk7XG5cdFx0cmVuZGVyQm9hcmQoY29uZmlnKTtcblx0XHRyZW5kZXJQaWVjZShnaG9zdFBpZWNlLCBjb25maWcuZ2hvc3RQaWVjZSk7XG5cdFx0cmVuZGVyUGllY2UocGllY2UsIGNvbmZpZy5waWVjZSk7XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXJCb2FyZChjb25maWcpIHtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBib2FyZC5sZW5ndGg7IHJvdysrKSB7XG5cdFx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBib2FyZFtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdFx0aWYoYm9hcmRbcm93XVtjb2xdICE9PSAwKSB7XG5cdFx0XHRcdFx0dmFyIHBpZWNlVHlwZSA9IHBpZWNlVHlwZXMgWyAoYm9hcmRbcm93XVtjb2xdLTEpIF07XG5cdFx0XHRcdFx0dmFyIGJnID0gY29uZmlnLnBpZWNlLmNvbG9yc1twaWVjZVR5cGVdO1xuXHRcdFx0XHRcdGNvbmZpZy5waWVjZS5iYWNrZ3JvdW5kID0gYmc7XG5cdFx0XHRcdFx0cmVuZGVyU3F1YXJlKGNvbCwgcm93LCBjb25maWcucGllY2UpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHZhciBiZztcblx0XHRcdFx0XHRpZiAoY29uZmlnLmJvYXJkLmNoZWNrZXJlZCkge1xuXHRcdFx0XHRcdFx0YmcgPSBldmVuKHJvdyArIGNvbCkgPyBjb25maWcuYm9hcmQuY2hlY2tlZC5jb2xvcjEgOiBjb25maWcuYm9hcmQuY2hlY2tlZC5jb2xvcjI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0YmcgPSBjb25maWcuYm9hcmQuYmFja2dyb3VuZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y29uZmlnLmJvYXJkLmJhY2tncm91bmQgPSBiZztcblx0XHRcdFx0XHRyZW5kZXJTcXVhcmUoY29sLCByb3csIGNvbmZpZy5ib2FyZCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlbmRlclBpZWNlKHBpZWNlLCBjb25maWcpIHtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBwaWVjZS5zaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBwaWVjZS5zaGFwZVtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdFx0dmFyIHggPSAocGllY2UueCArIGNvbCk7XG5cdFx0XHRcdHZhciB5ID0gKHBpZWNlLnkgKyByb3cpO1xuXG5cdFx0XHRcdGlmKCBwaWVjZS5zaGFwZVtyb3ddW2NvbF0gIT09IDAgKSB7XG5cdFx0XHRcdFx0aWYoY29uZmlnLm1vdmluZ1BpZWNlKSB7XG5cdFx0XHRcdFx0XHR2YXIgYmcgPSBjb25maWcuY29sb3JzW3BpZWNlLnR5cGVdO1xuXHRcdFx0XHRcdFx0Y29uZmlnLmJhY2tncm91bmQgPSBiZztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVuZGVyU3F1YXJlKHgsIHksIGNvbmZpZyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHR9O1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXJTcXVhcmUoaSwgaiwgb3B0aW9ucykge1xuXHRcdGZpbGxTcXVhcmUoc3F1YXJlLndpZHRoICogaSwgc3F1YXJlLmhlaWdodCAqIGosIG9wdGlvbnMpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZmlsbFNxdWFyZSh4LCB5LCBvcHRpb25zKSB7XG5cdFx0dmFyIGNvbG9yID0gb3B0aW9ucy5iZyB8fCBvcHRpb25zLmJhY2tncm91bmQ7XG5cdFx0Y29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcblx0XHRjb250ZXh0LmZpbGxSZWN0KHgsIHksIHNxdWFyZS53aWR0aCwgc3F1YXJlLmhlaWdodCk7XG5cdFx0XG5cdFx0dmFyIHN0cm9rZSA9ICgob3B0aW9ucy5zdHJva2UgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnN0cm9rZSA6IHRydWUpO1xuXHRcdGlmKHN0cm9rZSkge1xuXHRcdFx0dmFyIHN0cm9rZUNvbG9yID0gY29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjEpO1xuXHRcdFx0dmFyIHN0cm9rZVRoaWNrbmVzcyA9IG9wdGlvbnMuc3Ryb2tlVGhpY2tuZXNzIHx8IDIuNTtcblx0XHRcdC8vZHJhd1N0cm9rZSh4LCB5LCB7c3Ryb2tlQ29sb3IsIHN0cm9rZVRoaWNrbmVzc30pXG5cdFx0XHRjb250ZXh0LnN0cm9rZVN0eWxlID0gc3Ryb2tlQ29sb3I7XG5cdFx0XHRjb250ZXh0LmxpbmVXaWR0aCA9IHN0cm9rZVRoaWNrbmVzcztcblx0XHRcdHZhciB4ID0geCArIHN0cm9rZVRoaWNrbmVzcyAqIDAuNTtcblx0XHRcdHZhciB5ID0geSArIHN0cm9rZVRoaWNrbmVzcyAqIDAuNTtcblx0XHRcdHZhciB3aWR0aCA9IHNxdWFyZS53aWR0aCAtIHN0cm9rZVRoaWNrbmVzcztcblx0XHRcdHZhciBoZWlnaHQgPSBzcXVhcmUuaGVpZ2h0IC0gc3Ryb2tlVGhpY2tuZXNzO1xuXHRcdFx0Y29udGV4dC5zdHJva2VSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGNhbGN1bGF0ZVNxdWFyZVNpemUoKSB7XG5cdFx0c3F1YXJlLndpZHRoID0gY2FudmFzLndpZHRoIC8gYm9hcmQud2lkdGg7XG5cdFx0c3F1YXJlLmhlaWdodCA9IGNhbnZhcy5oZWlnaHQgLyBib2FyZC5oZWlnaHQ7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGNsZWFyKCkge1xuXHRcdGNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdFx0Y29udGV4dC5jbGVhclJlY3QgKCAwICwgMCAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZXZlbihudW1iZXIpIHtcblx0XHRyZXR1cm4gKCBudW1iZXIgJSAyID09IDAgKTtcblx0fVxufSIsInZhciBTaGFwZXMgPSBtb2R1bGUuZXhwb3J0cyA9IHtcblx0J0knOiB7XG5cdFx0c2hhcGU6IFsgWzAsIDAsIDAsIDBdLCBcblx0XHRcdFx0IFsxLCAxLCAxLCAxXSwgXG5cdFx0XHRcdCBbMCwgMCwgMCwgMF0sIFxuXHRcdFx0XHQgWzAsIDAsIDAsIDBdIF1cblx0fSxcblx0J0onOiB7XG5cdFx0c2hhcGU6IFsgWzAsIDAsIDBdLCBcblx0XHRcdFx0IFsxLCAxLCAxXSwgXG5cdFx0XHRcdCBbMCwgMCwgMV0gXVxuXHR9LFxuXHQnTCc6IHtcblx0XHRzaGFwZTogWyBbMCwgMCwgMF0sIFxuXHRcdFx0XHQgWzEsIDEsIDFdLCBcblx0XHRcdFx0IFsxLCAwLCAwXSBdXG5cdH0sXG5cdCdPJzoge1xuXHRcdHNoYXBlOiBbIFsxLCAxXSwgXG5cdFx0XHRcdCBbMSwgMV0gXVxuXHR9LFxuXHQnUyc6IHtcblx0XHRzaGFwZTogWyBbMCwgMSwgMV0sIFxuXHRcdFx0XHQgWzEsIDEsIDBdLCBcblx0XHRcdFx0IFswLCAwLCAwXSBdXG5cdH0sXG5cdCdUJzoge1xuXHRcdHNoYXBlOiBbIFswLCAxLCAwXSwgXG5cdFx0XHRcdCBbMSwgMSwgMV0sIFxuXHRcdFx0XHQgWzAsIDAsIDBdIF1cblx0fSxcblx0J1onOiB7XG5cdFx0c2hhcGU6IFsgWzEsIDEsIDBdLCBcblx0XHRcdFx0IFswLCAxLCAxXSwgXG5cdFx0XHRcdCBbMCwgMCwgMF0gXVxuXHR9XG59O1xuIiwiZnVuY3Rpb24gY29sb3JMdW1pbmFuY2UoaGV4LCBsdW0pIHtcblxuXHQvLyB2YWxpZGF0ZSBoZXggc3RyaW5nXG5cdGhleCA9IFN0cmluZyhoZXgpLnJlcGxhY2UoL1teMC05YS1mXS9naSwgJycpO1xuXHRpZiAoaGV4Lmxlbmd0aCA8IDYpIHtcblx0XHRoZXggPSBoZXhbMF0raGV4WzBdK2hleFsxXStoZXhbMV0raGV4WzJdK2hleFsyXTtcblx0fVxuXHRsdW0gPSBsdW0gfHwgMDtcblxuXHQvLyBjb252ZXJ0IHRvIGRlY2ltYWwgYW5kIGNoYW5nZSBsdW1pbm9zaXR5XG5cdHZhciByZ2IgPSBcIiNcIiwgYywgaTtcblx0Zm9yIChpID0gMDsgaSA8IDM7IGkrKykge1xuXHRcdGMgPSBwYXJzZUludChoZXguc3Vic3RyKGkqMiwyKSwgMTYpO1xuXHRcdGMgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KDAsIGMgKyAoYyAqIGx1bSkpLCAyNTUpKS50b1N0cmluZygxNik7XG5cdFx0cmdiICs9IChcIjAwXCIrYykuc3Vic3RyKGMubGVuZ3RoKTtcblx0fVxuXG5cdHJldHVybiByZ2I7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRjb2xvckx1bWluYW5jZTogY29sb3JMdW1pbmFuY2Vcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0U1BBQ0U6IDMyLFxuXHRMRUZUOiAzNyxcblx0UklHSFQ6IDM5LFxuXHRVUDogMzgsXG5cdERPV046IDQwLFxuXHRTSElGVDogMTZcbn07XG4iLCJ2YXIgQm9hcmQgPSByZXF1aXJlKCcuL0JvYXJkLmpzJyk7XG52YXIgUGllY2UgPSByZXF1aXJlKCcuL1BpZWNlLmpzJyk7XG52YXIgQ29sbGlzaW9uRGV0ZWN0aW9uID0gcmVxdWlyZSgnLi9Db2xsaXNpb25EZXRlY3Rpb24uanMnKTtcbnZhciBDb250cm9scyA9IHJlcXVpcmUoJy4vQ29udHJvbHMuanMnKTtcbnZhciBSZW5kZXJlciA9IHJlcXVpcmUoJy4vUmVuZGVyZXIuanMnKTtcblxudmFyIHBpZWNlVHlwZXMgPSBbJ0knLCAnSicsICdMJywgJ08nLCAnUycsICdUJywgJ1onXTtcblxudmFyIGJvYXJkID0gQm9hcmQoKTtcbnZhciBjb2xsaXNpb25EZXRlY3Rpb24gPSBDb2xsaXNpb25EZXRlY3Rpb24oe1xuXHRib2FyZDogYm9hcmRcbn0pO1xudmFyIGNoZWNrID0gY29sbGlzaW9uRGV0ZWN0aW9uLmNoZWNrO1xudmFyIHJlbmRlcmVyID0gUmVuZGVyZXIoe2JvYXJkOiBib2FyZH0pO1xudmFyIGNvbnRyb2xzID0gQ29udHJvbHMoKTtcbmNvbnRyb2xzLmluaXQoKTtcblxudmFyIHBpZWNlID0gZ2VuZXJhdGVSYW5kb21QaWVjZSgpO1xuXG5jb250cm9scy5vbigncmlnaHQnLCBmdW5jdGlvbigpIHtcblx0aWYgKGNoZWNrKHBpZWNlLmNsb25lKCkuZ29SaWdodCgpKSkge1xuXHRcdHBpZWNlLmdvUmlnaHQoKTtcblx0XHRyZW5kZXJlci5yZW5kZXIocGllY2UsIGNhbGN1bGF0ZUdob3N0UGllY2UoKSk7XHRcblx0fVxufSlcdFx0XHRcbmNvbnRyb2xzLm9uKCdsZWZ0JywgZnVuY3Rpb24oKSB7XG5cdGlmIChjaGVjayhwaWVjZS5jbG9uZSgpLmdvTGVmdCgpKSkge1xuXHRcdHBpZWNlLmdvTGVmdCgpO1xuXHRcdHJlbmRlcmVyLnJlbmRlcihwaWVjZSwgY2FsY3VsYXRlR2hvc3RQaWVjZSgpKTtcdFxuXHR9XG59KTtcbmNvbnRyb2xzLm9uKCdyb3RhdGUnLCBmdW5jdGlvbigpIHtcblx0d2FsbEtpY2socGllY2Uucm90YXRlKCkpO1xuXHRyZW5kZXJlci5yZW5kZXIocGllY2UsIGNhbGN1bGF0ZUdob3N0UGllY2UoKSk7XHRcbn0pO1xuY29udHJvbHMub24oJ2Rvd24nLCBmdW5jdGlvbigpIHtcblx0aWYgKGNoZWNrKHBpZWNlLmNsb25lKCkuZ29Eb3duKCkpKSB7XG5cdFx0cGllY2UuZ29Eb3duKCk7XG5cdFx0cmVuZGVyZXIucmVuZGVyKHBpZWNlLCBjYWxjdWxhdGVHaG9zdFBpZWNlKCkpO1x0XG5cdH1cbn0pO1xuY29udHJvbHMub24oJ2Ryb3AnLCBmdW5jdGlvbigpIHtcblx0dmFyIG5ld1BpZWNlID0gcGllY2UuY2xvbmUoKTtcblx0d2hpbGUoY2hlY2sobmV3UGllY2UuY2xvbmUoKS5nb0Rvd24oKSkpIHtcblx0XHRuZXdQaWVjZS5nb0Rvd24oKTtcblx0fVxuXHRhdHRhY2hQaWVjZVRvQm9hcmQobmV3UGllY2UpO1xuXHRyZW1vdmVMaW5lcygpO1xuXHRwaWVjZSA9IGdlbmVyYXRlUmFuZG9tUGllY2UoKTtcblx0cmVuZGVyZXIucmVuZGVyKHBpZWNlLCBjYWxjdWxhdGVHaG9zdFBpZWNlKCkpO1x0XG59KTtcblxuXG52YXIgcG9pbnRzID0gWzQwLCAxMDAsIDMwMCwgMTIwMF07XG52YXIgc2NvcmUgPSAwO1xuJCgnI3Njb3JlJykudmFsKHNjb3JlKTtcblxucmVuZGVyZXIucmVuZGVyKHBpZWNlLCBjYWxjdWxhdGVHaG9zdFBpZWNlKCkpO1xuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG5cdHJlbmRlcmVyLnJlbmRlcihwaWVjZSwgY2FsY3VsYXRlR2hvc3RQaWVjZSgpKTtcblxuXHRpZiAoY2hlY2socGllY2UuY2xvbmUoKS5nb0Rvd24oKSkpIHtcblx0XHRwaWVjZS5nb0Rvd24oKTtcblx0fSBcblx0ZWxzZSB7XG5cdFx0Ly93YWl0IGZvciB1c2VyIG5vIGlucHV0IGFuZCBzcGVjaWZpZWQgc2Vjb25kc1xuXHRcdGF0dGFjaFBpZWNlVG9Cb2FyZChwaWVjZSk7XG5cdFx0cmVtb3ZlTGluZXMoKTtcblx0XHRwaWVjZSA9IGdlbmVyYXRlUmFuZG9tUGllY2UoKTtcblx0fVxuXG59LCA1MDApO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVBpZWNlICgpIHtcblx0dmFyIHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBpZWNlVHlwZXMubGVuZ3RoKTtcblx0dmFyIHAgPSBuZXcgUGllY2Uoe1xuXHRcdHR5cGU6IHBpZWNlVHlwZXNbcmFuZG9tXSxcblx0XHR4OiAzLFxuXHRcdHk6IDAgXG5cdH0pO1xuXHRyZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gYXR0YWNoUGllY2VUb0JvYXJkKHBpZWNlKSB7XG5cdHZhciBzaGFwZSA9IHBpZWNlLnNoYXBlO1xuXHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBzaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRpZihzaGFwZVtyb3ddW2NvbF0gIT09IDApIHtcblx0XHRcdFx0dmFyIHggPSBwaWVjZS54ICsgY29sO1xuXHRcdFx0XHR2YXIgeSA9IHBpZWNlLnkgKyByb3c7XG5cdFx0XHRcdHZhciBpbmRleCA9IHBpZWNlVHlwZXMuaW5kZXhPZihwaWVjZS50eXBlKSArIDE7XG5cdFx0XHRcdFx0Ym9hcmRbeV1beF0gPSBpbmRleDtcblx0XHRcdH1cblx0XHR9O1xuXHR9O1xufVxuXG5mdW5jdGlvbiB3YWxsS2ljayhwaWVjZSkge1xuXHR2YXIgc2hhcGUgPSBwaWVjZS5zaGFwZTtcblx0dmFyIHhzID1bXTtcblx0dmFyIHlzID1bXTtcblx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgc2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0aWYoc2hhcGVbcm93XVtjb2xdICE9PSAwKSB7XG5cdFx0XHRcdHhzLnB1c2gocGllY2UueCArIGNvbCk7XG5cdFx0XHRcdHlzLnB1c2gocGllY2UueSArIHJvdyk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fTtcblxuXHR2YXIgb3V0c2lkZUxlZnQgPSBfLm1pbih4cykgPCAwO1xuXHRpZihvdXRzaWRlTGVmdCkge1xuXHRcdHBpZWNlLnggLT0gXy5taW4oeHMpO1xuXHR9XG5cdHZhciBvdXRzaWRlUmlnaHQgPSBfLm1heCh4cykgPiAoYm9hcmQud2lkdGgtMSk7XG5cdGlmKG91dHNpZGVSaWdodCkge1xuXHRcdHZhciBkaWZmID0gKF8ubWF4KHhzKSArMSAtIGJvYXJkLndpZHRoKTtcblx0XHRwaWVjZS54IC09IGRpZmY7XG5cdH1cblx0dmFyIG91dHNpZGVCb3R0b20gPSBfLm1heCh5cykgPiAoYm9hcmQuaGVpZ2h0LTEpO1xuXHRpZihvdXRzaWRlQm90dG9tKSB7XG5cdFx0dmFyIGRpZmYgPSAoXy5tYXgoeXMpICsxIC0gYm9hcmQuaGVpZ2h0KTtcblx0XHRwaWVjZS55IC09IGRpZmY7XHRcdFx0XG5cdH1cblxuXHRyZXR1cm4gcGllY2U7XG59XG5cblxuZnVuY3Rpb24gcmVtb3ZlTGluZXMoKSB7XG5cdHZhciBmdWxsTGluZXMgPSAwO1xuXHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBib2FyZC5sZW5ndGg7IHJvdysrKSB7XG5cdFx0dmFyIGZ1bGxMaW5lID0gKF8ubWluKGJvYXJkW3Jvd10pICE9PSAwKTtcblx0XHRpZihmdWxsTGluZSkge1xuXHRcdFx0ZnVsbExpbmVzKys7XG5cdFx0XHRib2FyZC5zcGxpY2Uocm93LDEpO1xuXHRcdFx0Ym9hcmQudW5zaGlmdChlbXB0eVJvdygpKTtcblx0XHR9XG5cdH07XG5cdCBpZihmdWxsTGluZXMgPiAwKXtcblx0IFx0c2NvcmUgKz0gcG9pbnRzW2Z1bGxMaW5lcy0xXTtcblx0IH1cblx0ICQoJyNzY29yZScpLmh0bWwoc2NvcmUpO1xufVxuXG5mdW5jdGlvbiBlbXB0eVJvdygpIHtcblx0dmFyIHJvdyA9IFtdO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGJvYXJkLndpZHRoOyBpKyspIHtcblx0XHRyb3cucHVzaCgwKTtcblx0fTtcblx0cmV0dXJuIHJvdztcbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlR2hvc3RQaWVjZSgpIHtcblx0dmFyIGdob3N0UGllY2UgPSBwaWVjZS5jbG9uZSgpO1xuXHR3aGlsZShjaGVjayhnaG9zdFBpZWNlLmNsb25lKCkuZ29Eb3duKCkpKSB7XG5cdFx0Z2hvc3RQaWVjZS5nb0Rvd24oKTtcblx0fVxuXHRyZXR1cm4gZ2hvc3RQaWVjZTtcbn1cbiIsInZhciBwaWVjZUNvbG9ycyA9IHtcblx0J0knOiAnIzI3REVGRicsIC8vbGp1c2Jsw6Vcblx0J0onOiAnIzNDNjZGRicsIC8vYmzDpVxuXHQnTCc6ICcjRTg3NDBDJywgLy9vcmFuZ2Vcblx0J08nOiAnI0ZGRDcwRCcsIC8vZ3VsXG5cdCdTJzogJyMyNkZGMDAnLCAvL2dyw7ZuXG5cdCdUJzogJyM5RTBDRTgnLCAvL2xpbGFcblx0J1onOiAnI0ZGMDAwMCcgIC8vcsO2ZFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Ym9hcmQ6IHtcblx0XHRzdHJva2U6IGZhbHNlLFxuXHRcdGJhY2tncm91bmQ6ICdwaW5rJyxcblx0XHRjaGVja2VyZWQ6IHRydWUsXG5cdFx0Y2hlY2tlZDoge1xuXHRcdFx0Y29sb3IxOiAnI2ZmZicsXG5cdFx0XHRjb2xvcjI6ICcjZWVlJ1xuXHRcdH0sXG5cdFx0c3Ryb2tlOiBmYWxzZSxcblx0XHRzdHJva2VUaGlja25lc3M6IDAuM1xuXHR9LFxuXHRwaWVjZToge1xuXHRcdHN0cm9rZVRoaWNrbmVzczogMy41LFxuXHRcdHN0cm9rZTogdHJ1ZSxcblx0XHRjb2xvcnM6IHBpZWNlQ29sb3JzLFxuXHRcdG1vdmluZ1BpZWNlOiB0cnVlIC8vZHVtbXkgbm8gY29uZmlnIHByb3BlcnR5XG5cdH0sXG5cdGdob3N0UGllY2U6IHsgXG5cdFx0YmFja2dyb3VuZDogJ3JnYmEoMTAwLCAxMDAsIDEwMCwgMC42KScsIFxuXHRcdHN0cm9rZTogZmFsc2Vcblx0fVxufSJdfQ==
