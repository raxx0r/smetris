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
		updatePiece: updatePiece,
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

	function updatePiece(newPiece) {
		piece = newPiece;
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
	}
});
controls.on('drop', function() {
	var newPiece = piece.clone();
	while(check(newPiece.clone().goDown())) {
		newPiece.goDown();
	}
	attachPieceToBoard(newPiece);
	removeLines();
	generateAndAssignNewPiece();
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
		controls.updatePiece(piece);
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
	 	console.log(fullLines);
	 	score += points[--fullLines];
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


function generateAndAssignNewPiece (){
	piece = generateRandomPiece();
	controls.updatePiece(piece);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzcvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwianMvQm9hcmQuanMiLCJqcy9Db2xsaXNpb25EZXRlY3Rpb24uanMiLCJqcy9Db250cm9scy5qcyIsImpzL1BpZWNlLmpzIiwianMvUmVuZGVyZXIuanMiLCJqcy9TaGFwZXMuanMiLCJqcy9oZWxwZXJzLmpzIiwianMva2V5cy5qcyIsImpzL21haW4uanMiLCJqcy9yZW5kZXJlckNvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuXG5cdHZhciBib2FyZCA9IFtcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRdO1xuXG5cdGJvYXJkLmhlaWdodCA9IGJvYXJkLmxlbmd0aDtcblx0Ym9hcmQud2lkdGggPSBib2FyZFswXS5sZW5ndGg7XG5cblx0cmV0dXJuIGJvYXJkO1xufVxuXG4iLCJ2YXIgUGllY2UgPSByZXF1aXJlKCcuL1BpZWNlLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gQ29sbGlzaW9uRGV0ZWN0aW9uKGNyZWF0ZU9wdGlvbnMpe1xuXHR2YXIgYm9hcmQgPSBjcmVhdGVPcHRpb25zLmJvYXJkO1xuXHRyZXR1cm4ge1xuXHRcdGNoZWNrOiBjaGVja1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGNoZWNrKHBpZWNlKSB7XG5cdFx0dmFyIHNoYXBlID0gcGllY2Uuc2hhcGU7XG5cdFx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgc2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRcdGlmIChzaGFwZVtyb3ddW2NvbF0gIT09IDApIHtcblx0XHRcdFx0XHR2YXIgeSA9IChwaWVjZS55ICsgcm93KTtcblx0XHRcdFx0XHR2YXIgeCA9IChwaWVjZS54ICsgY29sKTtcblx0XHRcdFx0XHRpZiAoeSA+PSBib2FyZC5oZWlnaHQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0ICAgICAgICAgICAgXHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAoYm9hcmRbeV1beF0gIT09IDAgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQgfVxuXHRcdFx0fTtcblx0XHR9O1xuXHRcdHJldHVybiB0cnVlO1x0XHRcblx0fVxufVxuIiwidmFyIGtleXMgPSByZXF1aXJlKCcuL2tleXMuanMnKTtcbnZhciBQaWVjZSA9IHJlcXVpcmUoJy4vUGllY2UuanMnKVxuXG52YXIgVkFMSURfRVZFTlRTID0gWydkb3duJywncmlnaHQnLCdsZWZ0JywnZHJvcCcsJ2hvbGQnLCdyb3RhdGUnXTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBDb250cm9scyhjcmVhdGVPcHRpb25zKSB7XG5cblx0dmFyIGxpc3RlbmVycztcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXQsXG5cdFx0dXBkYXRlUGllY2U6IHVwZGF0ZVBpZWNlLFxuXHRcdG9uOiBhZGRMaXN0ZW5lcixcblx0XHRvZmY6IHJlbW92ZUxpc3RlbmVyXG5cdH1cblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdCQoZG9jdW1lbnQpLm9uKCdrZXlkb3duJywga2V5UHJlc3NlZCk7XG5cblx0XHRsaXN0ZW5lcnMgPSB7fTtcblx0XHRWQUxJRF9FVkVOVFMuZm9yRWFjaChmdW5jdGlvbihldmVudCkge1xuXHRcdFx0bGlzdGVuZXJzW2V2ZW50XSA9IFtdO1xuXHRcdH0pXG5cdH1cblxuXHRmdW5jdGlvbiB1cGRhdGVQaWVjZShuZXdQaWVjZSkge1xuXHRcdHBpZWNlID0gbmV3UGllY2U7XG5cdH1cblxuXHRmdW5jdGlvbiBhZGRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2spIHtcblx0XHRsaXN0ZW5lcnNbZXZlbnRdLnB1c2goY2FsbGJhY2spO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrKSB7XG5cdFx0dmFyIGluZGV4ID0gbGlzdGVuZXJzW2V2ZW50XS5pbmRleE9mKGNhbGxiYWNrKTtcblx0XHRsaXN0ZW5lcnNbZXZlbnRdLnNwbGljZShpbmRleCwxKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGVtaXQoZXZlbnQpIHtcblx0XHRsaXN0ZW5lcnNbZXZlbnRdLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0XHRcdGNhbGxiYWNrKCk7XG5cdFx0fSlcblx0fVxuXHRcblx0ZnVuY3Rpb24ga2V5UHJlc3NlZChlKSB7XG5cdFx0aWYgKGUua2V5Q29kZSA9PT0ga2V5cy5SSUdIVCkgZW1pdCgncmlnaHQnKTtcblx0XHRpZiAoZS5rZXlDb2RlID09PSBrZXlzLkxFRlQpIGVtaXQoJ2xlZnQnKTtcblx0XHRpZiAoZS5rZXlDb2RlID09PSBrZXlzLlVQKSAgZW1pdCgncm90YXRlJyk7XG5cdFx0aWYoZS5rZXlDb2RlID09PSBrZXlzLkRPV04pIGVtaXQoJ2Rvd24nKTtcblx0XHRpZihlLmtleUNvZGUgPT09IGtleXMuU1BBQ0UpIGVtaXQoJ2Ryb3AnKTtcblx0fVxufSIsInZhciBTaGFwZXMgPSByZXF1aXJlKCcuL1NoYXBlcy5qcycpO1xuXG5mdW5jdGlvbiBQaWVjZShvcHRpb25zKSB7XG5cdHRoaXMudHlwZSA9IG9wdGlvbnMudHlwZTtcblx0dGhpcy54ID0gb3B0aW9ucy54IHx8IDA7XG5cdHRoaXMueSA9IG9wdGlvbnMueSB8fCAwO1x0XG5cdHRoaXMuc2hhcGUgPSBvcHRpb25zLnNoYXBlIHx8IFNoYXBlc1t0aGlzLnR5cGVdLnNoYXBlO1xufVxuXG5QaWVjZS5wcm90b3R5cGUuZ29SaWdodCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLngrKztcblx0cmV0dXJuIHRoaXM7XG59XG5cblBpZWNlLnByb3RvdHlwZS5nb0xlZnQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy54LS07XG5cdHJldHVybiB0aGlzO1xufVxuXG5QaWVjZS5wcm90b3R5cGUuZ29Eb3duID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMueSsrO1xuXHRyZXR1cm4gdGhpcztcbn1cblxuUGllY2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBuZXcgUGllY2UodGhpcyk7XG59XG5cblBpZWNlLnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5zaGFwZSA9IHJvdGF0aW9uKHRoaXMuc2hhcGUpO1xuXHRyZXR1cm4gdGhpcztcbn1cblxuZnVuY3Rpb24gcm90YXRpb24oc2hhcGUpIHtcblx0dmFyIG4gPSBbXTtcblx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgc2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdHZhciBwID0gW107XG5cdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRwLnB1c2goc2hhcGVbc2hhcGUubGVuZ3RoIC0gY29sIC0gMV1bcm93XSk7XG5cdFx0fTtcblx0XHRuLnB1c2gocClcblx0fTtcblx0cmV0dXJuIG47XG59XG5cbmZ1bmN0aW9uIGxvZ1NoYXBlKHNoYXBlKSB7XG5cdHZhciBzaGFwZVN0cmluZyA9IFwiXCI7XG5cdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBzaGFwZVtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdHNoYXBlU3RyaW5nICs9IFx0c2hhcGVbcm93XVtjb2xdO1xuXHRcdH07XG5cdFx0c2hhcGVTdHJpbmcgKz0gJ1xcbic7XG5cdH07XG5cdGNvbnNvbGUubG9nKHNoYXBlU3RyaW5nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQaWVjZTsiLCJ2YXIgY29sb3JMdW1pbmFuY2UgPSByZXF1aXJlKCcuL2hlbHBlcnMuanMnKS5jb2xvckx1bWluYW5jZTtcbnZhciBjb25maWcgPSByZXF1aXJlKCcuL3JlbmRlcmVyQ29uZmlnLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUmVuZGVyZXIob3B0aW9ucykge1xuXHR2YXIgYm9hcmQgPSBvcHRpb25zLmJvYXJkO1xuXHR2YXIgY29sb3JJbmRleGVzID0gWydJJywgJ0onLCAnTCcsICdPJywgJ1MnLCAnVCcsICdaJ107XG5cdGJvYXJkLmhlaWdodCA9IGJvYXJkLmxlbmd0aDtcblx0Ym9hcmQud2lkdGggPSBib2FyZFswXS5sZW5ndGg7XG5cdHZhciBjb250ZXh0O1xuXHR2YXIgY2FudmFzO1xuXHR2YXIgc2l6ZTtcblx0c3F1YXJlID0ge307XG5cdGluaXQoKTtcblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0LFxuXHRcdHJlbmRlcjogcmVuZGVyLFxuXHRcdGZpbGxTcXVhcmU6IGZpbGxTcXVhcmVcblx0fTtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLWNhbnZhcycpO1xuXHRcdGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHQvL2NvbnRleHQuc2NhbGUoMiwyKTtcblx0XHRjYWxjdWxhdGVTcXVhcmVTaXplKCk7XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXIocGllY2UsIGdob3N0UGllY2UpIHtcblx0XHQvL2NsZWFyKCk7XG5cdFx0cmVuZGVyQm9hcmQoY29uZmlnKTtcblx0XHRyZW5kZXJQaWVjZShnaG9zdFBpZWNlLCBjb25maWcuZ2hvc3RQaWVjZSk7XG5cdFx0cmVuZGVyUGllY2UocGllY2UsIGNvbmZpZy5waWVjZSk7XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXJCb2FyZChjb25maWcpIHtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBib2FyZC5sZW5ndGg7IHJvdysrKSB7XG5cdFx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBib2FyZFtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdFx0aWYoYm9hcmRbcm93XVtjb2xdICE9PSAwKSB7XG5cdFx0XHRcdFx0dmFyIGJsb2NrVHlwZSA9IGNvbG9ySW5kZXhlcyBbIChib2FyZFtyb3ddW2NvbF0tMSkgXTtcblx0XHRcdFx0XHR2YXIgYmcgPSBjb25maWcucGllY2UuY29sb3JzW2Jsb2NrVHlwZV07XG5cdFx0XHRcdFx0Y29uZmlnLnBpZWNlLmJhY2tncm91bmQgPSBiZztcblx0XHRcdFx0XHRyZW5kZXJTcXVhcmUoY29sLCByb3csIGNvbmZpZy5waWVjZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dmFyIGJnO1xuXHRcdFx0XHRcdGlmIChjb25maWcuYm9hcmQuY2hlY2tlcmVkKSB7XG5cdFx0XHRcdFx0XHRiZyA9IGV2ZW4ocm93ICsgY29sKSA/IGNvbmZpZy5ib2FyZC5jaGVja2VkLmNvbG9yMSA6IGNvbmZpZy5ib2FyZC5jaGVja2VkLmNvbG9yMjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRiZyA9IGNvbmZpZy5ib2FyZC5iYWNrZ3JvdW5kO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjb25maWcuYm9hcmQuYmFja2dyb3VuZCA9IGJnO1xuXHRcdFx0XHRcdHJlbmRlclNxdWFyZShjb2wsIHJvdywgY29uZmlnLmJvYXJkKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVuZGVyUGllY2UocGllY2UsIGNvbmZpZykge1xuXHRcdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHBpZWNlLnNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHBpZWNlLnNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0XHR2YXIgeCA9IChwaWVjZS54ICsgY29sKTtcblx0XHRcdFx0dmFyIHkgPSAocGllY2UueSArIHJvdyk7XG5cblx0XHRcdFx0aWYoIHBpZWNlLnNoYXBlW3Jvd11bY29sXSAhPT0gMCApIHtcblx0XHRcdFx0XHRpZihjb25maWcubW92aW5nUGllY2UpIHtcblx0XHRcdFx0XHRcdHZhciBiZyA9IGNvbmZpZy5jb2xvcnNbcGllY2UudHlwZV07XG5cdFx0XHRcdFx0XHRjb25maWcuYmFja2dyb3VuZCA9IGJnO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZW5kZXJTcXVhcmUoeCwgeSwgY29uZmlnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdH07XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlbmRlclNxdWFyZShpLCBqLCBvcHRpb25zKSB7XG5cdFx0ZmlsbFNxdWFyZShzcXVhcmUud2lkdGggKiBpLCBzcXVhcmUuaGVpZ2h0ICogaiwgb3B0aW9ucyk7XG5cdH1cblxuXHRmdW5jdGlvbiBmaWxsU3F1YXJlKHgsIHksIG9wdGlvbnMpIHtcblx0XHR2YXIgY29sb3IgPSBvcHRpb25zLmJnIHx8IG9wdGlvbnMuYmFja2dyb3VuZDtcblx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xuXHRcdGNvbnRleHQuZmlsbFJlY3QoeCwgeSwgc3F1YXJlLndpZHRoLCBzcXVhcmUuaGVpZ2h0KTtcblx0XHRcblx0XHR2YXIgc3Ryb2tlID0gKChvcHRpb25zLnN0cm9rZSAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuc3Ryb2tlIDogdHJ1ZSk7XG5cdFx0aWYoc3Ryb2tlKSB7XG5cdFx0XHR2YXIgc3Ryb2tlQ29sb3IgPSBjb2xvckx1bWluYW5jZShjb2xvciwgLTAuMSk7XG5cdFx0XHR2YXIgc3Ryb2tlVGhpY2tuZXNzID0gb3B0aW9ucy5zdHJva2VUaGlja25lc3MgfHwgMi41O1xuXHRcdFx0Ly9kcmF3U3Ryb2tlKHgsIHksIHtzdHJva2VDb2xvciwgc3Ryb2tlVGhpY2tuZXNzfSlcblx0XHRcdGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBzdHJva2VDb2xvcjtcblx0XHRcdGNvbnRleHQubGluZVdpZHRoID0gc3Ryb2tlVGhpY2tuZXNzO1xuXHRcdFx0dmFyIHggPSB4ICsgc3Ryb2tlVGhpY2tuZXNzICogMC41O1xuXHRcdFx0dmFyIHkgPSB5ICsgc3Ryb2tlVGhpY2tuZXNzICogMC41O1xuXHRcdFx0dmFyIHdpZHRoID0gc3F1YXJlLndpZHRoIC0gc3Ryb2tlVGhpY2tuZXNzO1xuXHRcdFx0dmFyIGhlaWdodCA9IHNxdWFyZS5oZWlnaHQgLSBzdHJva2VUaGlja25lc3M7XG5cdFx0XHRjb250ZXh0LnN0cm9rZVJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gY2FsY3VsYXRlU3F1YXJlU2l6ZSgpIHtcblx0XHRzcXVhcmUud2lkdGggPSBjYW52YXMud2lkdGggLyBib2FyZC53aWR0aDtcblx0XHRzcXVhcmUuaGVpZ2h0ID0gY2FudmFzLmhlaWdodCAvIGJvYXJkLmhlaWdodDtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2xlYXIoKSB7XG5cdFx0Y29udGV4dC5iZWdpblBhdGgoKTtcblx0XHRjb250ZXh0LmNsZWFyUmVjdCAoIDAgLCAwICwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0ICk7XG5cdH1cblxuXHRmdW5jdGlvbiBldmVuKG51bWJlcikge1xuXHRcdHJldHVybiAoIG51bWJlciAlIDIgPT0gMCApO1xuXHR9XG59IiwidmFyIFNoYXBlcyA9IG1vZHVsZS5leHBvcnRzID0ge1xuXHQnSSc6IHtcblx0XHRzaGFwZTogWyBbMCwgMCwgMCwgMF0sIFxuXHRcdFx0XHQgWzEsIDEsIDEsIDFdLCBcblx0XHRcdFx0IFswLCAwLCAwLCAwXSwgXG5cdFx0XHRcdCBbMCwgMCwgMCwgMF0gXVxuXHR9LFxuXHQnSic6IHtcblx0XHRzaGFwZTogWyBbMCwgMCwgMF0sIFxuXHRcdFx0XHQgWzEsIDEsIDFdLCBcblx0XHRcdFx0IFswLCAwLCAxXSBdXG5cdH0sXG5cdCdMJzoge1xuXHRcdHNoYXBlOiBbIFswLCAwLCAwXSwgXG5cdFx0XHRcdCBbMSwgMSwgMV0sIFxuXHRcdFx0XHQgWzEsIDAsIDBdIF1cblx0fSxcblx0J08nOiB7XG5cdFx0c2hhcGU6IFsgWzEsIDFdLCBcblx0XHRcdFx0IFsxLCAxXSBdXG5cdH0sXG5cdCdTJzoge1xuXHRcdHNoYXBlOiBbIFswLCAxLCAxXSwgXG5cdFx0XHRcdCBbMSwgMSwgMF0sIFxuXHRcdFx0XHQgWzAsIDAsIDBdIF1cblx0fSxcblx0J1QnOiB7XG5cdFx0c2hhcGU6IFsgWzAsIDEsIDBdLCBcblx0XHRcdFx0IFsxLCAxLCAxXSwgXG5cdFx0XHRcdCBbMCwgMCwgMF0gXVxuXHR9LFxuXHQnWic6IHtcblx0XHRzaGFwZTogWyBbMSwgMSwgMF0sIFxuXHRcdFx0XHQgWzAsIDEsIDFdLCBcblx0XHRcdFx0IFswLCAwLCAwXSBdXG5cdH1cbn07XG4iLCJmdW5jdGlvbiBjb2xvckx1bWluYW5jZShoZXgsIGx1bSkge1xuXG5cdC8vIHZhbGlkYXRlIGhleCBzdHJpbmdcblx0aGV4ID0gU3RyaW5nKGhleCkucmVwbGFjZSgvW14wLTlhLWZdL2dpLCAnJyk7XG5cdGlmIChoZXgubGVuZ3RoIDwgNikge1xuXHRcdGhleCA9IGhleFswXStoZXhbMF0raGV4WzFdK2hleFsxXStoZXhbMl0raGV4WzJdO1xuXHR9XG5cdGx1bSA9IGx1bSB8fCAwO1xuXG5cdC8vIGNvbnZlcnQgdG8gZGVjaW1hbCBhbmQgY2hhbmdlIGx1bWlub3NpdHlcblx0dmFyIHJnYiA9IFwiI1wiLCBjLCBpO1xuXHRmb3IgKGkgPSAwOyBpIDwgMzsgaSsrKSB7XG5cdFx0YyA9IHBhcnNlSW50KGhleC5zdWJzdHIoaSoyLDIpLCAxNik7XG5cdFx0YyA9IE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgoMCwgYyArIChjICogbHVtKSksIDI1NSkpLnRvU3RyaW5nKDE2KTtcblx0XHRyZ2IgKz0gKFwiMDBcIitjKS5zdWJzdHIoYy5sZW5ndGgpO1xuXHR9XG5cblx0cmV0dXJuIHJnYjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGNvbG9yTHVtaW5hbmNlOiBjb2xvckx1bWluYW5jZVxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRTUEFDRTogMzIsXG5cdExFRlQ6IDM3LFxuXHRSSUdIVDogMzksXG5cdFVQOiAzOCxcblx0RE9XTjogNDAsXG5cdFNISUZUOiAxNlxufTtcbiIsInZhciBCb2FyZCA9IHJlcXVpcmUoJy4vQm9hcmQuanMnKTtcbnZhciBQaWVjZSA9IHJlcXVpcmUoJy4vUGllY2UuanMnKTtcbnZhciBDb2xsaXNpb25EZXRlY3Rpb24gPSByZXF1aXJlKCcuL0NvbGxpc2lvbkRldGVjdGlvbi5qcycpO1xudmFyIENvbnRyb2xzID0gcmVxdWlyZSgnLi9Db250cm9scy5qcycpO1xudmFyIFJlbmRlcmVyID0gcmVxdWlyZSgnLi9SZW5kZXJlci5qcycpO1xuXG52YXIgYmxvY2tzID0gWydJJywgJ0onLCAnTCcsICdPJywgJ1MnLCAnVCcsICdaJ107XG5cbnZhciBib2FyZCA9IEJvYXJkKCk7XG52YXIgcGllY2UgPSBnZW5lcmF0ZVJhbmRvbVBpZWNlKCk7XG52YXIgY29sbGlzaW9uRGV0ZWN0aW9uID0gQ29sbGlzaW9uRGV0ZWN0aW9uKHtcblx0Ym9hcmQ6IGJvYXJkXG59KTtcbnZhciBjaGVjayA9IGNvbGxpc2lvbkRldGVjdGlvbi5jaGVjaztcblxudmFyIHJlbmRlcmVyID0gUmVuZGVyZXIoe2JvYXJkOiBib2FyZH0pO1xudmFyIGNvbnRyb2xzID0gQ29udHJvbHMoKTtcbmNvbnRyb2xzLmluaXQoKTtcblxuY29udHJvbHMub24oJ3JpZ2h0JywgZnVuY3Rpb24oKSB7XG5cdGlmIChjaGVjayhwaWVjZS5jbG9uZSgpLmdvUmlnaHQoKSkpIHtcblx0XHRwaWVjZS5nb1JpZ2h0KCk7XG5cdFx0cmVuZGVyZXIucmVuZGVyKHBpZWNlLCBjYWxjdWxhdGVHaG9zdFBpZWNlKCkpO1x0XG5cdH1cbn0pXHRcdFx0XG5jb250cm9scy5vbignbGVmdCcsIGZ1bmN0aW9uKCkge1xuXHRpZiAoY2hlY2socGllY2UuY2xvbmUoKS5nb0xlZnQoKSkpIHtcblx0XHRwaWVjZS5nb0xlZnQoKTtcblx0XHRyZW5kZXJlci5yZW5kZXIocGllY2UsIGNhbGN1bGF0ZUdob3N0UGllY2UoKSk7XHRcblx0fVxufSk7XG5jb250cm9scy5vbigncm90YXRlJywgZnVuY3Rpb24oKSB7XG5cdHdhbGxLaWNrKHBpZWNlLnJvdGF0ZSgpKTtcblx0cmVuZGVyZXIucmVuZGVyKHBpZWNlLCBjYWxjdWxhdGVHaG9zdFBpZWNlKCkpO1x0XG59KTtcbmNvbnRyb2xzLm9uKCdkb3duJywgZnVuY3Rpb24oKSB7XG5cdGlmIChjaGVjayhwaWVjZS5jbG9uZSgpLmdvRG93bigpKSkge1xuXHRcdHBpZWNlLmdvRG93bigpO1xuXHR9XG59KTtcbmNvbnRyb2xzLm9uKCdkcm9wJywgZnVuY3Rpb24oKSB7XG5cdHZhciBuZXdQaWVjZSA9IHBpZWNlLmNsb25lKCk7XG5cdHdoaWxlKGNoZWNrKG5ld1BpZWNlLmNsb25lKCkuZ29Eb3duKCkpKSB7XG5cdFx0bmV3UGllY2UuZ29Eb3duKCk7XG5cdH1cblx0YXR0YWNoUGllY2VUb0JvYXJkKG5ld1BpZWNlKTtcblx0cmVtb3ZlTGluZXMoKTtcblx0Z2VuZXJhdGVBbmRBc3NpZ25OZXdQaWVjZSgpO1xuXHRyZW5kZXJlci5yZW5kZXIocGllY2UsIGNhbGN1bGF0ZUdob3N0UGllY2UoKSk7XHRcbn0pO1xuXG5cbnZhciBwb2ludHMgPSBbNDAsIDEwMCwgMzAwLCAxMjAwXTtcbnZhciBzY29yZSA9IDA7XG4kKCcjc2NvcmUnKS52YWwoc2NvcmUpO1xuXG5yZW5kZXJlci5yZW5kZXIocGllY2UsIGNhbGN1bGF0ZUdob3N0UGllY2UoKSk7XG5zZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcblx0cmVuZGVyZXIucmVuZGVyKHBpZWNlLCBjYWxjdWxhdGVHaG9zdFBpZWNlKCkpO1xuXG5cdGlmIChjaGVjayhwaWVjZS5jbG9uZSgpLmdvRG93bigpKSkge1xuXHRcdHBpZWNlLmdvRG93bigpO1xuXHR9IFxuXHRlbHNlIHtcblx0XHQvL3dhaXQgZm9yIHVzZXIgbm8gaW5wdXQgYW5kIHNwZWNpZmllZCBzZWNvbmRzXG5cdFx0YXR0YWNoUGllY2VUb0JvYXJkKHBpZWNlKTtcblx0XHRyZW1vdmVMaW5lcygpO1xuXHRcdHBpZWNlID0gZ2VuZXJhdGVSYW5kb21QaWVjZSgpO1xuXHRcdGNvbnRyb2xzLnVwZGF0ZVBpZWNlKHBpZWNlKTtcblx0fVxuXG59LCA1MDApO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVBpZWNlICgpIHtcblx0dmFyIHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGJsb2Nrcy5sZW5ndGgpO1xuXHR2YXIgcCA9IG5ldyBQaWVjZSh7XG5cdFx0dHlwZTogYmxvY2tzW3JhbmRvbV0sXG5cdFx0eDogMyxcblx0XHR5OiAwIFxuXHR9KTtcblx0cmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIGF0dGFjaFBpZWNlVG9Cb2FyZChwaWVjZSkge1xuXHR2YXIgc2hhcGUgPSBwaWVjZS5zaGFwZTtcblx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgc2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0aWYoc2hhcGVbcm93XVtjb2xdICE9PSAwKSB7XG5cdFx0XHRcdHZhciB4ID0gcGllY2UueCArIGNvbDtcblx0XHRcdFx0dmFyIHkgPSBwaWVjZS55ICsgcm93O1xuXHRcdFx0XHR2YXIgaW5kZXggPSBibG9ja3MuaW5kZXhPZihwaWVjZS50eXBlKSArIDE7XG5cdFx0XHRcdFx0Ym9hcmRbeV1beF0gPSBpbmRleDtcblx0XHRcdH1cblx0XHR9O1xuXHR9O1xufVxuXG5mdW5jdGlvbiB3YWxsS2ljayhwaWVjZSkge1xuXHR2YXIgc2hhcGUgPSBwaWVjZS5zaGFwZTtcblx0dmFyIHhzID1bXTtcblx0dmFyIHlzID1bXTtcblx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgc2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0aWYoc2hhcGVbcm93XVtjb2xdICE9PSAwKSB7XG5cdFx0XHRcdHhzLnB1c2gocGllY2UueCArIGNvbCk7XG5cdFx0XHRcdHlzLnB1c2gocGllY2UueSArIHJvdyk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fTtcblxuXHR2YXIgb3V0c2lkZUxlZnQgPSBfLm1pbih4cykgPCAwO1xuXHRpZihvdXRzaWRlTGVmdCkge1xuXHRcdHBpZWNlLnggLT0gXy5taW4oeHMpO1xuXHR9XG5cdHZhciBvdXRzaWRlUmlnaHQgPSBfLm1heCh4cykgPiAoYm9hcmQud2lkdGgtMSk7XG5cdGlmKG91dHNpZGVSaWdodCkge1xuXHRcdHZhciBkaWZmID0gKF8ubWF4KHhzKSArMSAtIGJvYXJkLndpZHRoKTtcblx0XHRwaWVjZS54IC09IGRpZmY7XG5cdH1cblx0dmFyIG91dHNpZGVCb3R0b20gPSBfLm1heCh5cykgPiAoYm9hcmQuaGVpZ2h0LTEpO1xuXHRpZihvdXRzaWRlQm90dG9tKSB7XG5cdFx0dmFyIGRpZmYgPSAoXy5tYXgoeXMpICsxIC0gYm9hcmQuaGVpZ2h0KTtcblx0XHRwaWVjZS55IC09IGRpZmY7XHRcdFx0XG5cdH1cblxuXHRyZXR1cm4gcGllY2U7XG59XG5cblxuZnVuY3Rpb24gcmVtb3ZlTGluZXMoKSB7XG5cdHZhciBmdWxsTGluZXMgPSAwO1xuXHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBib2FyZC5sZW5ndGg7IHJvdysrKSB7XG5cdFx0dmFyIGZ1bGxMaW5lID0gKF8ubWluKGJvYXJkW3Jvd10pICE9PSAwKTtcblx0XHRpZihmdWxsTGluZSkge1xuXHRcdFx0ZnVsbExpbmVzKys7XG5cdFx0XHRib2FyZC5zcGxpY2Uocm93LDEpO1xuXHRcdFx0Ym9hcmQudW5zaGlmdChlbXB0eVJvdygpKTtcblx0XHR9XG5cdH07XG5cdCBpZihmdWxsTGluZXMgPiAwKXtcblx0IFx0Y29uc29sZS5sb2coZnVsbExpbmVzKTtcblx0IFx0c2NvcmUgKz0gcG9pbnRzWy0tZnVsbExpbmVzXTtcblx0IH1cblx0ICQoJyNzY29yZScpLmh0bWwoc2NvcmUpO1xufVxuXG5mdW5jdGlvbiBlbXB0eVJvdygpIHtcblx0dmFyIHJvdyA9IFtdO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGJvYXJkLndpZHRoOyBpKyspIHtcblx0XHRyb3cucHVzaCgwKTtcblx0fTtcblx0cmV0dXJuIHJvdztcbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlR2hvc3RQaWVjZSgpIHtcblx0dmFyIGdob3N0UGllY2UgPSBwaWVjZS5jbG9uZSgpO1xuXHR3aGlsZShjaGVjayhnaG9zdFBpZWNlLmNsb25lKCkuZ29Eb3duKCkpKSB7XG5cdFx0Z2hvc3RQaWVjZS5nb0Rvd24oKTtcblx0fVxuXHRyZXR1cm4gZ2hvc3RQaWVjZTtcbn1cblxuXG5mdW5jdGlvbiBnZW5lcmF0ZUFuZEFzc2lnbk5ld1BpZWNlICgpe1xuXHRwaWVjZSA9IGdlbmVyYXRlUmFuZG9tUGllY2UoKTtcblx0Y29udHJvbHMudXBkYXRlUGllY2UocGllY2UpO1xufVxuIiwidmFyIHBpZWNlQ29sb3JzID0ge1xuXHQnSSc6ICcjMjdERUZGJywgLy9sanVzYmzDpVxuXHQnSic6ICcjM0M2NkZGJywgLy9ibMOlXG5cdCdMJzogJyNFODc0MEMnLCAvL29yYW5nZVxuXHQnTyc6ICcjRkZENzBEJywgLy9ndWxcblx0J1MnOiAnIzI2RkYwMCcsIC8vZ3LDtm5cblx0J1QnOiAnIzlFMENFOCcsIC8vbGlsYVxuXHQnWic6ICcjRkYwMDAwJyAgLy9yw7ZkXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRib2FyZDoge1xuXHRcdHN0cm9rZTogZmFsc2UsXG5cdFx0YmFja2dyb3VuZDogJ3BpbmsnLFxuXHRcdGNoZWNrZXJlZDogdHJ1ZSxcblx0XHRjaGVja2VkOiB7XG5cdFx0XHRjb2xvcjE6ICcjZmZmJyxcblx0XHRcdGNvbG9yMjogJyNlZWUnXG5cdFx0fSxcblx0XHRzdHJva2U6IGZhbHNlLFxuXHRcdHN0cm9rZVRoaWNrbmVzczogMC4zXG5cdH0sXG5cdHBpZWNlOiB7XG5cdFx0c3Ryb2tlVGhpY2tuZXNzOiAzLjUsXG5cdFx0c3Ryb2tlOiB0cnVlLFxuXHRcdGNvbG9yczogcGllY2VDb2xvcnMsXG5cdFx0bW92aW5nUGllY2U6IHRydWUgLy9kdW1teSBubyBjb25maWcgcHJvcGVydHlcblx0fSxcblx0Z2hvc3RQaWVjZTogeyBcblx0XHRiYWNrZ3JvdW5kOiAncmdiYSgxMDAsIDEwMCwgMTAwLCAwLjYpJywgXG5cdFx0c3Ryb2tlOiBmYWxzZVxuXHR9XG59Il19
