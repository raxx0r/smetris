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
	];

	board.height = board.length;
	board.width = board[0].length;

	return board;
}


},{}],2:[function(require,module,exports){
var Piece = require('./Piece.js');
var transform = require('./Transform.js');

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
				 	//check if out of bounds height
				 	//check if outofbounds right, compensate
				 	//check if outofbounds left, compensate
				 }
			};
		};
		return true;		
	}

	function logShape(shape) {
		var shapeString = "";
		for (var row = 0; row < shape.length; row++) {
			for (var col = 0; col < shape[row].length; col++) {
				shapeString += shape[row][col];
			};
			shapeString += '\n';
		};
		console.log(shapeString);
	}

	function logPartOfBoard(copy) {
		var boardString = "";
		for (var row = 0; row < 3; row++) {
			for (var col = 0; col < 3; col++) {
				var x = (copy.x + col);
				var y = (copy.y + row);
				boardString += board[y][x];
			};
			boardString += '\n';
		};
		console.log(boardString);
	}

}
},{"./Piece.js":5,"./Transform.js":8}],3:[function(require,module,exports){
module.exports = function Colors() {
	return {
		'I': '#27DEFF', //ljusblå
		'J': '#3C66FF', //blå
		'L': '#E8740C', //orange
		'O': '#FFD70D', //gul
		'S': '#26FF00', //grön
		'T': '#9E0CE8', //lila
		'Z': '#FF0000'  //röd
	}
}
},{}],4:[function(require,module,exports){
var keys = require('./keys.js');
module.exports = function Controls(createOptions) {
	var piece = createOptions.piece;
	var collisionDetection = createOptions.collisionDetection;
	var check = createOptions.check;

	return {
		init: init,
		updatePiece: updatePiece
	}

	function init() {
		$(document).on('keydown', keyPressed);
	}

	function updatePiece(newPiece) {
		piece = newPiece;
	}

	function keyPressed(e) {

		if (e.keyCode == keys.RIGHT) {
			if (check(piece.clone().goRight())) {
				piece.goRight();
			}
		}
		else if (e.keyCode == keys.LEFT) {
			if (check(piece.clone().goLeft())) {
				piece.goLeft();
			}
		}
		else if (e.keyCode == keys.UP) {
			if (check(piece.clone().rotate())) {
				piece.rotate();
			 }
		}
		else if(e.keyCode == keys.DOWN) {
			if (check(piece.clone().goDown())) {
				piece.goDown()
			}
		} 
	}

}
},{"./keys.js":10}],5:[function(require,module,exports){
var Shapes = require('./Shapes.js');
var transform = require('./transform.js');

function Piece(options) {
	this.type = options.type;
	this.x = options.x || 0;
	this.y = options.y || 0;	
	this.shape = options.shape || Shapes[this.type].shape;
	this.pivotPoint = Shapes[this.type].pivotPoint;

	return;
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
	//this.shape = transform.rotate(this);
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
	for (var row = 0; row < 	shape.length; row++) {
		for (var col = 0; col < 	shape[row].length; col++) {
			shapeString += 	shape[row][col];
		};
		shapeString += '\n';
	};
	console.log(shapeString);
}

module.exports = Piece;
},{"./Shapes.js":7,"./transform.js":12}],6:[function(require,module,exports){
var colorLuminance = require('./helpers.js').colorLuminance;


module.exports = function Renderer(options) {
	var board = options.board;
	var colors = options.colors;
	var colorIndexes = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
	board.height = board.length;
	board.width = board[0].length;
	var context;
	var canvas;
	var size;
	var sizepadding = 1;
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

	function render(piece) {
		clear();
		renderBoard();
		renderMovingPiece(piece);
		//πrenderGhostPiece(piece);
	}

	function renderBoard() {
		for (var row = 0; row < board.length; row++) {
			for (var col = 0; col < board[row].length; col++) {
				if(board[row][col] !== 0) {
					var blockType = colorIndexes [ (board[row][col]-1) ];
					var bg = colors[blockType];
					var strokeColor = colorLuminance(bg, -0.2);
					var strokeThickness = 2.5;
					renderSquare(col, row, {
						bg: bg, 
						strokeColor: strokeColor,
						strokeThickness: strokeThickness
					});
				}
				else {
					var bg = '#eee';
					var bg2 = '#fff';
					if( (row+col) % 2 == 0 ){
						bg = bg2;
					}
					else{
						bg = bg;
					}
					renderSquare(col, row, {
						bg: bg,
						//stroke:false
						strokeThickness: 0.3,
					});
				}
			};
		};
	}

	function renderMovingPiece(piece) {
		for (var row = 0; row < piece.shape.length; row++) {
			for (var col = 0; col < piece.shape[row].length; col++) {
				var x = (piece.x + col);
				var y = (piece.y + row);
				var bg = colors[piece.type];
				var strokeColor = colorLuminance(bg, -0.1);
				if( piece.shape[row][col] !== 0 ) {
					renderSquare(x, y, {
						bg: bg,
						strokeColor: strokeColor
					});
				}
				
			};
		};
	}

	function renderGhostPiece(piece) {
		context.rect(piece.x, canvas.height - square.height, square.width, square.height);
		context.stroke();
	}

	function renderSquare(i, j, options) {
		fillSquare(square.width * i, square.height * j, options);
	}

	function fillSquare(x, y, options) {
		var stroke = ((options.stroke !== undefined) ? options.stroke : true);
		var strokeColor = options.strokeColor || '#ccc';
		var strokeThickness = options.strokeThickness || 2.5;

		context.fillStyle = options.bg;
		context.fillRect(x*sizepadding, y*sizepadding, square.width, square.height);
		
		if(stroke) {
			context.strokeStyle = strokeColor;
			context.lineWidth = strokeThickness;
			context.strokeRect(x + strokeThickness * 0.5, y + strokeThickness * 0.5, square.width - strokeThickness, square.height - strokeThickness);
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
}
},{"./helpers.js":9}],7:[function(require,module,exports){
var Shapes = module.exports = {
	'I': {
		shape: [ [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0] ],
		pivotPoint: {x: 1, y: 1}
	},
	'J': {
		shape: [ [0, 0, 0], [1, 1, 1], [0, 0, 1] ],
		pivotPoint: {x: 1, y: 1}
	},
	'L': {
		shape: [ [0, 0, 0], [1, 1, 1], [1, 0, 0] ],
		pivotPoint: {x: 1, y: 1}
	},
	'O': {
		shape: [ [1, 1], [1, 1] ],
		pivotPoint: {x: 0, y: 0}
	},
	'S': {
		shape: [ [0, 1, 1], [1, 1, 0], [0, 0, 0] ],
		pivotPoint: {x: 1, y: 1}
	},
	'T': {
		shape: [ [0, 1, 0], [1, 1, 1], [0, 0, 0] ],
		pivotPoint: {x: 1, y: 1}
	},
	'Z': {
		shape: [ [1, 1, 0], [0, 1, 1], [0, 0, 0] ],
		pivotPoint: {x: 1, y: 1}
	}
};

},{}],8:[function(require,module,exports){
var Transform = module.exports = {
	rotate: rotate
};

	var tetromino;

	function rotate(myPiece) {
		if(myPiece.type == 'O') return;

		tetromino = myPiece;
		var pivotPoint = tetromino.pivotPoint;

		var points = convertShapeToPoints(tetromino.shape);
		points = translatePointsByDistance(points, {x: -pivotPoint.x, y: -pivotPoint.y})
		points = rotatePoints(points);
		points = translatePointsByDistance(points, {x: pivotPoint.x, y: pivotPoint.y});
		var finalShape = convertPointsToShape(points);
		points = [];

		return finalShape;
	}
	function convertShapeToPoints(shape) {
		var points = [];
		for (var row = 0; row < shape.length; row++) {
			for (var col = 0; col < shape[row].length; col++) {
				var point = {
					x: col, 
					y: row,
					value: shape[row][col]
				}
				points.push(point);
			};
		};
		return points;
	}

	function translatePointsByDistance(points, distance) {
		for (var i = 0; i < points.length; i++) {
			points[i].x = points[i].x + distance.x;
			points[i].y = points[i].y + distance.y;
		};
		return points;
	}

	function moveToPivotPoint() {
		var shape = tetromino.shape;
		var pivotPoint = tetromino.pivotPoint;
		for (var row = 0; row < shape.length; row++) {
			for (var col = 0; col < shape[row].length; col++) {
				var movedX = col - pivotPoint.x;
				var movedY = row - pivotPoint.y;
				var point = {
					x: movedX, 
					y: movedY,
					value: shape[row][col]
				}
				points.push(point);
			};
		};
	}

	function rotatePoints(points) {
		//var rot = [[0, 1], [-1, 0]]; // 90 deg CounterClockwise
		var rot = [[0, -1], [1, 0]]; // 90 deg Clockwise
		var temp = {};

		for (var i = 0; i < points.length; i++) {
			var x = points[i].x;
			var y = points[i].y;
			temp.x = x * rot[0][0] + y * rot[0][1];
			temp.y = x * rot[1][0] + y * rot[1][1];
			points[i].x = temp.x;
			points[i].y = temp.y;
		};
		return points;
	}

	function convertPointsToShape(points) {
		var tempShape = copyShape(tetromino.shape)

		for (var i = 0; i < points.length; i++) {
			var col = points[i].x;
			var row = points[i].y;
			tempShape[row][col] = points[i].value;
		};

		return tempShape;
	}

	function copyShape(someShape) {
		var newArray = [];
		for (var i = 0; i < someShape.length; i++) {
	    	newArray[i] = someShape[i].slice();
		}
		return newArray;
	}

},{}],9:[function(require,module,exports){


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
},{}],10:[function(require,module,exports){
module.exports = {
	SPACE: 32,
	LEFT: 37,
	RIGHT: 39,
	UP: 38,
	DOWN: 40,
	SHIFT: 16
};
},{}],11:[function(require,module,exports){
var Board = require('./Board.js');
var Piece = require('./Piece.js');
var Colors = require('./Colors.js');
var transform = require('./Transform.js');
var CollisionDetection = require('./CollisionDetection.js');
var Controls = require('./Controls.js');
var Renderer = require('./Renderer.js');

var colors = Colors();
var board = Board();
var piece = new Piece({type: 'I'});
var blocks = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
var collisionDetection = CollisionDetection({
	board: board
});
var check = collisionDetection.check;

var renderer = Renderer({board: board, colors: colors});
var controls = Controls({
	piece: piece,
	check:check
});
controls.init();


setInterval(function() {
	//if(piece.y > board.height) {
	//	piece = generateRandomPiece();
	//}

	if (check(piece.clone().goDown())) {
		piece.goDown();
	} 
	else {
		stitchPieceToBoard(piece);
		piece = generateRandomPiece();
		controls.updatePiece(piece);
	}

}, 500);


var renderToken = setInterval(function() {
	renderer.render(piece);
}, 50);


function generateRandomPiece () {
	var random = Math.floor(Math.random() * blocks.length);
	var p = new Piece({type: blocks[random]});
	return p;
}

function stitchPieceToBoard(piece) {
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


},{"./Board.js":1,"./CollisionDetection.js":2,"./Colors.js":3,"./Controls.js":4,"./Piece.js":5,"./Renderer.js":6,"./Transform.js":8}],12:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8}]},{},[11])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzcvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwianMvQm9hcmQuanMiLCJqcy9Db2xsaXNpb25EZXRlY3Rpb24uanMiLCJqcy9Db2xvcnMuanMiLCJqcy9Db250cm9scy5qcyIsImpzL1BpZWNlLmpzIiwianMvUmVuZGVyZXIuanMiLCJqcy9TaGFwZXMuanMiLCJqcy9UcmFuc2Zvcm0uanMiLCJqcy9oZWxwZXJzLmpzIiwianMva2V5cy5qcyIsImpzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cblx0dmFyIGJvYXJkID0gW1xuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XTtcblxuXHRib2FyZC5oZWlnaHQgPSBib2FyZC5sZW5ndGg7XG5cdGJvYXJkLndpZHRoID0gYm9hcmRbMF0ubGVuZ3RoO1xuXG5cdHJldHVybiBib2FyZDtcbn1cblxuIiwidmFyIFBpZWNlID0gcmVxdWlyZSgnLi9QaWVjZS5qcycpO1xudmFyIHRyYW5zZm9ybSA9IHJlcXVpcmUoJy4vVHJhbnNmb3JtLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gQ29sbGlzaW9uRGV0ZWN0aW9uKGNyZWF0ZU9wdGlvbnMpe1xuXHR2YXIgYm9hcmQgPSBjcmVhdGVPcHRpb25zLmJvYXJkO1xuXHRyZXR1cm4ge1xuXHRcdGNoZWNrOiBjaGVja1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGNoZWNrKHBpZWNlKSB7XG5cdFx0dmFyIHNoYXBlID0gcGllY2Uuc2hhcGU7XG5cdFx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgc2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRcdGlmIChzaGFwZVtyb3ddW2NvbF0gIT09IDApIHtcblx0XHRcdFx0XHR2YXIgeSA9IChwaWVjZS55ICsgcm93KTtcblx0XHRcdFx0XHR2YXIgeCA9IChwaWVjZS54ICsgY29sKTtcblx0XHRcdFx0XHRpZiAoeSA+PSBib2FyZC5oZWlnaHQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0ICAgICAgICAgICAgXHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAoYm9hcmRbeV1beF0gIT09IDAgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQgXHQvL2NoZWNrIGlmIG91dCBvZiBib3VuZHMgaGVpZ2h0XG5cdFx0XHRcdCBcdC8vY2hlY2sgaWYgb3V0b2Zib3VuZHMgcmlnaHQsIGNvbXBlbnNhdGVcblx0XHRcdFx0IFx0Ly9jaGVjayBpZiBvdXRvZmJvdW5kcyBsZWZ0LCBjb21wZW5zYXRlXG5cdFx0XHRcdCB9XG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0cmV0dXJuIHRydWU7XHRcdFxuXHR9XG5cblx0ZnVuY3Rpb24gbG9nU2hhcGUoc2hhcGUpIHtcblx0XHR2YXIgc2hhcGVTdHJpbmcgPSBcIlwiO1xuXHRcdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0XHRzaGFwZVN0cmluZyArPSBzaGFwZVtyb3ddW2NvbF07XG5cdFx0XHR9O1xuXHRcdFx0c2hhcGVTdHJpbmcgKz0gJ1xcbic7XG5cdFx0fTtcblx0XHRjb25zb2xlLmxvZyhzaGFwZVN0cmluZyk7XG5cdH1cblxuXHRmdW5jdGlvbiBsb2dQYXJ0T2ZCb2FyZChjb3B5KSB7XG5cdFx0dmFyIGJvYXJkU3RyaW5nID0gXCJcIjtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCAzOyByb3crKykge1xuXHRcdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgMzsgY29sKyspIHtcblx0XHRcdFx0dmFyIHggPSAoY29weS54ICsgY29sKTtcblx0XHRcdFx0dmFyIHkgPSAoY29weS55ICsgcm93KTtcblx0XHRcdFx0Ym9hcmRTdHJpbmcgKz0gYm9hcmRbeV1beF07XG5cdFx0XHR9O1xuXHRcdFx0Ym9hcmRTdHJpbmcgKz0gJ1xcbic7XG5cdFx0fTtcblx0XHRjb25zb2xlLmxvZyhib2FyZFN0cmluZyk7XG5cdH1cblxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gQ29sb3JzKCkge1xuXHRyZXR1cm4ge1xuXHRcdCdJJzogJyMyN0RFRkYnLCAvL2xqdXNibMOlXG5cdFx0J0onOiAnIzNDNjZGRicsIC8vYmzDpVxuXHRcdCdMJzogJyNFODc0MEMnLCAvL29yYW5nZVxuXHRcdCdPJzogJyNGRkQ3MEQnLCAvL2d1bFxuXHRcdCdTJzogJyMyNkZGMDAnLCAvL2dyw7ZuXG5cdFx0J1QnOiAnIzlFMENFOCcsIC8vbGlsYVxuXHRcdCdaJzogJyNGRjAwMDAnICAvL3LDtmRcblx0fVxufSIsInZhciBrZXlzID0gcmVxdWlyZSgnLi9rZXlzLmpzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIENvbnRyb2xzKGNyZWF0ZU9wdGlvbnMpIHtcblx0dmFyIHBpZWNlID0gY3JlYXRlT3B0aW9ucy5waWVjZTtcblx0dmFyIGNvbGxpc2lvbkRldGVjdGlvbiA9IGNyZWF0ZU9wdGlvbnMuY29sbGlzaW9uRGV0ZWN0aW9uO1xuXHR2YXIgY2hlY2sgPSBjcmVhdGVPcHRpb25zLmNoZWNrO1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdCxcblx0XHR1cGRhdGVQaWVjZTogdXBkYXRlUGllY2Vcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0JChkb2N1bWVudCkub24oJ2tleWRvd24nLCBrZXlQcmVzc2VkKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHVwZGF0ZVBpZWNlKG5ld1BpZWNlKSB7XG5cdFx0cGllY2UgPSBuZXdQaWVjZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGtleVByZXNzZWQoZSkge1xuXG5cdFx0aWYgKGUua2V5Q29kZSA9PSBrZXlzLlJJR0hUKSB7XG5cdFx0XHRpZiAoY2hlY2socGllY2UuY2xvbmUoKS5nb1JpZ2h0KCkpKSB7XG5cdFx0XHRcdHBpZWNlLmdvUmlnaHQoKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAoZS5rZXlDb2RlID09IGtleXMuTEVGVCkge1xuXHRcdFx0aWYgKGNoZWNrKHBpZWNlLmNsb25lKCkuZ29MZWZ0KCkpKSB7XG5cdFx0XHRcdHBpZWNlLmdvTGVmdCgpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmIChlLmtleUNvZGUgPT0ga2V5cy5VUCkge1xuXHRcdFx0aWYgKGNoZWNrKHBpZWNlLmNsb25lKCkucm90YXRlKCkpKSB7XG5cdFx0XHRcdHBpZWNlLnJvdGF0ZSgpO1xuXHRcdFx0IH1cblx0XHR9XG5cdFx0ZWxzZSBpZihlLmtleUNvZGUgPT0ga2V5cy5ET1dOKSB7XG5cdFx0XHRpZiAoY2hlY2socGllY2UuY2xvbmUoKS5nb0Rvd24oKSkpIHtcblx0XHRcdFx0cGllY2UuZ29Eb3duKClcblx0XHRcdH1cblx0XHR9IFxuXHR9XG5cbn0iLCJ2YXIgU2hhcGVzID0gcmVxdWlyZSgnLi9TaGFwZXMuanMnKTtcbnZhciB0cmFuc2Zvcm0gPSByZXF1aXJlKCcuL3RyYW5zZm9ybS5qcycpO1xuXG5mdW5jdGlvbiBQaWVjZShvcHRpb25zKSB7XG5cdHRoaXMudHlwZSA9IG9wdGlvbnMudHlwZTtcblx0dGhpcy54ID0gb3B0aW9ucy54IHx8IDA7XG5cdHRoaXMueSA9IG9wdGlvbnMueSB8fCAwO1x0XG5cdHRoaXMuc2hhcGUgPSBvcHRpb25zLnNoYXBlIHx8IFNoYXBlc1t0aGlzLnR5cGVdLnNoYXBlO1xuXHR0aGlzLnBpdm90UG9pbnQgPSBTaGFwZXNbdGhpcy50eXBlXS5waXZvdFBvaW50O1xuXG5cdHJldHVybjtcbn1cblxuUGllY2UucHJvdG90eXBlLmdvUmlnaHQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy54Kys7XG5cdHJldHVybiB0aGlzO1xufVxuXG5QaWVjZS5wcm90b3R5cGUuZ29MZWZ0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMueC0tO1xuXHRyZXR1cm4gdGhpcztcbn1cblxuXG5QaWVjZS5wcm90b3R5cGUuZ29Eb3duID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMueSsrO1xuXHRyZXR1cm4gdGhpcztcbn1cblxuUGllY2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBuZXcgUGllY2UodGhpcyk7XG59XG5cblBpZWNlLnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbigpIHtcblx0Ly90aGlzLnNoYXBlID0gdHJhbnNmb3JtLnJvdGF0ZSh0aGlzKTtcblx0dGhpcy5zaGFwZSA9IHJvdGF0aW9uKHRoaXMuc2hhcGUpO1xuXHRyZXR1cm4gdGhpcztcbn1cblxuZnVuY3Rpb24gcm90YXRpb24oc2hhcGUpIHtcblx0dmFyIG4gPSBbXTtcblx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgc2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdHZhciBwID0gW107XG5cdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRwLnB1c2goc2hhcGVbc2hhcGUubGVuZ3RoIC0gY29sIC0gMV1bcm93XSk7XG5cdFx0fTtcblx0XHRuLnB1c2gocClcblx0fTtcblx0cmV0dXJuIG47XG59XG5cbmZ1bmN0aW9uIGxvZ1NoYXBlKHNoYXBlKSB7XG5cdHZhciBzaGFwZVN0cmluZyA9IFwiXCI7XG5cdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IFx0c2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IFx0c2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRzaGFwZVN0cmluZyArPSBcdHNoYXBlW3Jvd11bY29sXTtcblx0XHR9O1xuXHRcdHNoYXBlU3RyaW5nICs9ICdcXG4nO1xuXHR9O1xuXHRjb25zb2xlLmxvZyhzaGFwZVN0cmluZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGllY2U7IiwidmFyIGNvbG9yTHVtaW5hbmNlID0gcmVxdWlyZSgnLi9oZWxwZXJzLmpzJykuY29sb3JMdW1pbmFuY2U7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBSZW5kZXJlcihvcHRpb25zKSB7XG5cdHZhciBib2FyZCA9IG9wdGlvbnMuYm9hcmQ7XG5cdHZhciBjb2xvcnMgPSBvcHRpb25zLmNvbG9ycztcblx0dmFyIGNvbG9ySW5kZXhlcyA9IFsnSScsICdKJywgJ0wnLCAnTycsICdTJywgJ1QnLCAnWiddO1xuXHRib2FyZC5oZWlnaHQgPSBib2FyZC5sZW5ndGg7XG5cdGJvYXJkLndpZHRoID0gYm9hcmRbMF0ubGVuZ3RoO1xuXHR2YXIgY29udGV4dDtcblx0dmFyIGNhbnZhcztcblx0dmFyIHNpemU7XG5cdHZhciBzaXplcGFkZGluZyA9IDE7XG5cdHNxdWFyZSA9IHt9O1xuXHRpbml0KCk7XG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdCxcblx0XHRyZW5kZXI6IHJlbmRlcixcblx0XHRmaWxsU3F1YXJlOiBmaWxsU3F1YXJlXG5cdH07XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1jYW52YXMnKTtcblx0XHRjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0Ly9jb250ZXh0LnNjYWxlKDIsMik7XG5cdFx0Y2FsY3VsYXRlU3F1YXJlU2l6ZSgpO1xuXG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXIocGllY2UpIHtcblx0XHRjbGVhcigpO1xuXHRcdHJlbmRlckJvYXJkKCk7XG5cdFx0cmVuZGVyTW92aW5nUGllY2UocGllY2UpO1xuXHRcdC8vz4ByZW5kZXJHaG9zdFBpZWNlKHBpZWNlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlbmRlckJvYXJkKCkge1xuXHRcdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IGJvYXJkLmxlbmd0aDsgcm93KyspIHtcblx0XHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IGJvYXJkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0XHRpZihib2FyZFtyb3ddW2NvbF0gIT09IDApIHtcblx0XHRcdFx0XHR2YXIgYmxvY2tUeXBlID0gY29sb3JJbmRleGVzIFsgKGJvYXJkW3Jvd11bY29sXS0xKSBdO1xuXHRcdFx0XHRcdHZhciBiZyA9IGNvbG9yc1tibG9ja1R5cGVdO1xuXHRcdFx0XHRcdHZhciBzdHJva2VDb2xvciA9IGNvbG9yTHVtaW5hbmNlKGJnLCAtMC4yKTtcblx0XHRcdFx0XHR2YXIgc3Ryb2tlVGhpY2tuZXNzID0gMi41O1xuXHRcdFx0XHRcdHJlbmRlclNxdWFyZShjb2wsIHJvdywge1xuXHRcdFx0XHRcdFx0Ymc6IGJnLCBcblx0XHRcdFx0XHRcdHN0cm9rZUNvbG9yOiBzdHJva2VDb2xvcixcblx0XHRcdFx0XHRcdHN0cm9rZVRoaWNrbmVzczogc3Ryb2tlVGhpY2tuZXNzXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dmFyIGJnID0gJyNlZWUnO1xuXHRcdFx0XHRcdHZhciBiZzIgPSAnI2ZmZic7XG5cdFx0XHRcdFx0aWYoIChyb3crY29sKSAlIDIgPT0gMCApe1xuXHRcdFx0XHRcdFx0YmcgPSBiZzI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRiZyA9IGJnO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZW5kZXJTcXVhcmUoY29sLCByb3csIHtcblx0XHRcdFx0XHRcdGJnOiBiZyxcblx0XHRcdFx0XHRcdC8vc3Ryb2tlOmZhbHNlXG5cdFx0XHRcdFx0XHRzdHJva2VUaGlja25lc3M6IDAuMyxcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVuZGVyTW92aW5nUGllY2UocGllY2UpIHtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBwaWVjZS5zaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBwaWVjZS5zaGFwZVtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdFx0dmFyIHggPSAocGllY2UueCArIGNvbCk7XG5cdFx0XHRcdHZhciB5ID0gKHBpZWNlLnkgKyByb3cpO1xuXHRcdFx0XHR2YXIgYmcgPSBjb2xvcnNbcGllY2UudHlwZV07XG5cdFx0XHRcdHZhciBzdHJva2VDb2xvciA9IGNvbG9yTHVtaW5hbmNlKGJnLCAtMC4xKTtcblx0XHRcdFx0aWYoIHBpZWNlLnNoYXBlW3Jvd11bY29sXSAhPT0gMCApIHtcblx0XHRcdFx0XHRyZW5kZXJTcXVhcmUoeCwgeSwge1xuXHRcdFx0XHRcdFx0Ymc6IGJnLFxuXHRcdFx0XHRcdFx0c3Ryb2tlQ29sb3I6IHN0cm9rZUNvbG9yXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHR9O1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXJHaG9zdFBpZWNlKHBpZWNlKSB7XG5cdFx0Y29udGV4dC5yZWN0KHBpZWNlLngsIGNhbnZhcy5oZWlnaHQgLSBzcXVhcmUuaGVpZ2h0LCBzcXVhcmUud2lkdGgsIHNxdWFyZS5oZWlnaHQpO1xuXHRcdGNvbnRleHQuc3Ryb2tlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXJTcXVhcmUoaSwgaiwgb3B0aW9ucykge1xuXHRcdGZpbGxTcXVhcmUoc3F1YXJlLndpZHRoICogaSwgc3F1YXJlLmhlaWdodCAqIGosIG9wdGlvbnMpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZmlsbFNxdWFyZSh4LCB5LCBvcHRpb25zKSB7XG5cdFx0dmFyIHN0cm9rZSA9ICgob3B0aW9ucy5zdHJva2UgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnN0cm9rZSA6IHRydWUpO1xuXHRcdHZhciBzdHJva2VDb2xvciA9IG9wdGlvbnMuc3Ryb2tlQ29sb3IgfHwgJyNjY2MnO1xuXHRcdHZhciBzdHJva2VUaGlja25lc3MgPSBvcHRpb25zLnN0cm9rZVRoaWNrbmVzcyB8fCAyLjU7XG5cblx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IG9wdGlvbnMuYmc7XG5cdFx0Y29udGV4dC5maWxsUmVjdCh4KnNpemVwYWRkaW5nLCB5KnNpemVwYWRkaW5nLCBzcXVhcmUud2lkdGgsIHNxdWFyZS5oZWlnaHQpO1xuXHRcdFxuXHRcdGlmKHN0cm9rZSkge1xuXHRcdFx0Y29udGV4dC5zdHJva2VTdHlsZSA9IHN0cm9rZUNvbG9yO1xuXHRcdFx0Y29udGV4dC5saW5lV2lkdGggPSBzdHJva2VUaGlja25lc3M7XG5cdFx0XHRjb250ZXh0LnN0cm9rZVJlY3QoeCArIHN0cm9rZVRoaWNrbmVzcyAqIDAuNSwgeSArIHN0cm9rZVRoaWNrbmVzcyAqIDAuNSwgc3F1YXJlLndpZHRoIC0gc3Ryb2tlVGhpY2tuZXNzLCBzcXVhcmUuaGVpZ2h0IC0gc3Ryb2tlVGhpY2tuZXNzKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBjYWxjdWxhdGVTcXVhcmVTaXplKCkge1xuXHRcdHNxdWFyZS53aWR0aCA9IGNhbnZhcy53aWR0aCAvIGJvYXJkLndpZHRoO1xuXHRcdHNxdWFyZS5oZWlnaHQgPSBjYW52YXMuaGVpZ2h0IC8gYm9hcmQuaGVpZ2h0O1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjbGVhcigpIHtcblx0XHRjb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRcdGNvbnRleHQuY2xlYXJSZWN0ICggMCAsIDAgLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQgKTtcblx0fVxufSIsInZhciBTaGFwZXMgPSBtb2R1bGUuZXhwb3J0cyA9IHtcblx0J0knOiB7XG5cdFx0c2hhcGU6IFsgWzAsIDAsIDAsIDBdLCBbMSwgMSwgMSwgMV0sIFswLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDBdIF0sXG5cdFx0cGl2b3RQb2ludDoge3g6IDEsIHk6IDF9XG5cdH0sXG5cdCdKJzoge1xuXHRcdHNoYXBlOiBbIFswLCAwLCAwXSwgWzEsIDEsIDFdLCBbMCwgMCwgMV0gXSxcblx0XHRwaXZvdFBvaW50OiB7eDogMSwgeTogMX1cblx0fSxcblx0J0wnOiB7XG5cdFx0c2hhcGU6IFsgWzAsIDAsIDBdLCBbMSwgMSwgMV0sIFsxLCAwLCAwXSBdLFxuXHRcdHBpdm90UG9pbnQ6IHt4OiAxLCB5OiAxfVxuXHR9LFxuXHQnTyc6IHtcblx0XHRzaGFwZTogWyBbMSwgMV0sIFsxLCAxXSBdLFxuXHRcdHBpdm90UG9pbnQ6IHt4OiAwLCB5OiAwfVxuXHR9LFxuXHQnUyc6IHtcblx0XHRzaGFwZTogWyBbMCwgMSwgMV0sIFsxLCAxLCAwXSwgWzAsIDAsIDBdIF0sXG5cdFx0cGl2b3RQb2ludDoge3g6IDEsIHk6IDF9XG5cdH0sXG5cdCdUJzoge1xuXHRcdHNoYXBlOiBbIFswLCAxLCAwXSwgWzEsIDEsIDFdLCBbMCwgMCwgMF0gXSxcblx0XHRwaXZvdFBvaW50OiB7eDogMSwgeTogMX1cblx0fSxcblx0J1onOiB7XG5cdFx0c2hhcGU6IFsgWzEsIDEsIDBdLCBbMCwgMSwgMV0sIFswLCAwLCAwXSBdLFxuXHRcdHBpdm90UG9pbnQ6IHt4OiAxLCB5OiAxfVxuXHR9XG59O1xuIiwidmFyIFRyYW5zZm9ybSA9IG1vZHVsZS5leHBvcnRzID0ge1xuXHRyb3RhdGU6IHJvdGF0ZVxufTtcblxuXHR2YXIgdGV0cm9taW5vO1xuXG5cdGZ1bmN0aW9uIHJvdGF0ZShteVBpZWNlKSB7XG5cdFx0aWYobXlQaWVjZS50eXBlID09ICdPJykgcmV0dXJuO1xuXG5cdFx0dGV0cm9taW5vID0gbXlQaWVjZTtcblx0XHR2YXIgcGl2b3RQb2ludCA9IHRldHJvbWluby5waXZvdFBvaW50O1xuXG5cdFx0dmFyIHBvaW50cyA9IGNvbnZlcnRTaGFwZVRvUG9pbnRzKHRldHJvbWluby5zaGFwZSk7XG5cdFx0cG9pbnRzID0gdHJhbnNsYXRlUG9pbnRzQnlEaXN0YW5jZShwb2ludHMsIHt4OiAtcGl2b3RQb2ludC54LCB5OiAtcGl2b3RQb2ludC55fSlcblx0XHRwb2ludHMgPSByb3RhdGVQb2ludHMocG9pbnRzKTtcblx0XHRwb2ludHMgPSB0cmFuc2xhdGVQb2ludHNCeURpc3RhbmNlKHBvaW50cywge3g6IHBpdm90UG9pbnQueCwgeTogcGl2b3RQb2ludC55fSk7XG5cdFx0dmFyIGZpbmFsU2hhcGUgPSBjb252ZXJ0UG9pbnRzVG9TaGFwZShwb2ludHMpO1xuXHRcdHBvaW50cyA9IFtdO1xuXG5cdFx0cmV0dXJuIGZpbmFsU2hhcGU7XG5cdH1cblx0ZnVuY3Rpb24gY29udmVydFNoYXBlVG9Qb2ludHMoc2hhcGUpIHtcblx0XHR2YXIgcG9pbnRzID0gW107XG5cdFx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgc2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRcdHZhciBwb2ludCA9IHtcblx0XHRcdFx0XHR4OiBjb2wsIFxuXHRcdFx0XHRcdHk6IHJvdyxcblx0XHRcdFx0XHR2YWx1ZTogc2hhcGVbcm93XVtjb2xdXG5cdFx0XHRcdH1cblx0XHRcdFx0cG9pbnRzLnB1c2gocG9pbnQpO1xuXHRcdFx0fTtcblx0XHR9O1xuXHRcdHJldHVybiBwb2ludHM7XG5cdH1cblxuXHRmdW5jdGlvbiB0cmFuc2xhdGVQb2ludHNCeURpc3RhbmNlKHBvaW50cywgZGlzdGFuY2UpIHtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0cG9pbnRzW2ldLnggPSBwb2ludHNbaV0ueCArIGRpc3RhbmNlLng7XG5cdFx0XHRwb2ludHNbaV0ueSA9IHBvaW50c1tpXS55ICsgZGlzdGFuY2UueTtcblx0XHR9O1xuXHRcdHJldHVybiBwb2ludHM7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3ZlVG9QaXZvdFBvaW50KCkge1xuXHRcdHZhciBzaGFwZSA9IHRldHJvbWluby5zaGFwZTtcblx0XHR2YXIgcGl2b3RQb2ludCA9IHRldHJvbWluby5waXZvdFBvaW50O1xuXHRcdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0XHR2YXIgbW92ZWRYID0gY29sIC0gcGl2b3RQb2ludC54O1xuXHRcdFx0XHR2YXIgbW92ZWRZID0gcm93IC0gcGl2b3RQb2ludC55O1xuXHRcdFx0XHR2YXIgcG9pbnQgPSB7XG5cdFx0XHRcdFx0eDogbW92ZWRYLCBcblx0XHRcdFx0XHR5OiBtb3ZlZFksXG5cdFx0XHRcdFx0dmFsdWU6IHNoYXBlW3Jvd11bY29sXVxuXHRcdFx0XHR9XG5cdFx0XHRcdHBvaW50cy5wdXNoKHBvaW50KTtcblx0XHRcdH07XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJvdGF0ZVBvaW50cyhwb2ludHMpIHtcblx0XHQvL3ZhciByb3QgPSBbWzAsIDFdLCBbLTEsIDBdXTsgLy8gOTAgZGVnIENvdW50ZXJDbG9ja3dpc2Vcblx0XHR2YXIgcm90ID0gW1swLCAtMV0sIFsxLCAwXV07IC8vIDkwIGRlZyBDbG9ja3dpc2Vcblx0XHR2YXIgdGVtcCA9IHt9O1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciB4ID0gcG9pbnRzW2ldLng7XG5cdFx0XHR2YXIgeSA9IHBvaW50c1tpXS55O1xuXHRcdFx0dGVtcC54ID0geCAqIHJvdFswXVswXSArIHkgKiByb3RbMF1bMV07XG5cdFx0XHR0ZW1wLnkgPSB4ICogcm90WzFdWzBdICsgeSAqIHJvdFsxXVsxXTtcblx0XHRcdHBvaW50c1tpXS54ID0gdGVtcC54O1xuXHRcdFx0cG9pbnRzW2ldLnkgPSB0ZW1wLnk7XG5cdFx0fTtcblx0XHRyZXR1cm4gcG9pbnRzO1xuXHR9XG5cblx0ZnVuY3Rpb24gY29udmVydFBvaW50c1RvU2hhcGUocG9pbnRzKSB7XG5cdFx0dmFyIHRlbXBTaGFwZSA9IGNvcHlTaGFwZSh0ZXRyb21pbm8uc2hhcGUpXG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGNvbCA9IHBvaW50c1tpXS54O1xuXHRcdFx0dmFyIHJvdyA9IHBvaW50c1tpXS55O1xuXHRcdFx0dGVtcFNoYXBlW3Jvd11bY29sXSA9IHBvaW50c1tpXS52YWx1ZTtcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHRlbXBTaGFwZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNvcHlTaGFwZShzb21lU2hhcGUpIHtcblx0XHR2YXIgbmV3QXJyYXkgPSBbXTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNvbWVTaGFwZS5sZW5ndGg7IGkrKykge1xuXHQgICAgXHRuZXdBcnJheVtpXSA9IHNvbWVTaGFwZVtpXS5zbGljZSgpO1xuXHRcdH1cblx0XHRyZXR1cm4gbmV3QXJyYXk7XG5cdH1cbiIsIlxuXG5mdW5jdGlvbiBjb2xvckx1bWluYW5jZShoZXgsIGx1bSkge1xuXG5cdC8vIHZhbGlkYXRlIGhleCBzdHJpbmdcblx0aGV4ID0gU3RyaW5nKGhleCkucmVwbGFjZSgvW14wLTlhLWZdL2dpLCAnJyk7XG5cdGlmIChoZXgubGVuZ3RoIDwgNikge1xuXHRcdGhleCA9IGhleFswXStoZXhbMF0raGV4WzFdK2hleFsxXStoZXhbMl0raGV4WzJdO1xuXHR9XG5cdGx1bSA9IGx1bSB8fCAwO1xuXG5cdC8vIGNvbnZlcnQgdG8gZGVjaW1hbCBhbmQgY2hhbmdlIGx1bWlub3NpdHlcblx0dmFyIHJnYiA9IFwiI1wiLCBjLCBpO1xuXHRmb3IgKGkgPSAwOyBpIDwgMzsgaSsrKSB7XG5cdFx0YyA9IHBhcnNlSW50KGhleC5zdWJzdHIoaSoyLDIpLCAxNik7XG5cdFx0YyA9IE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgoMCwgYyArIChjICogbHVtKSksIDI1NSkpLnRvU3RyaW5nKDE2KTtcblx0XHRyZ2IgKz0gKFwiMDBcIitjKS5zdWJzdHIoYy5sZW5ndGgpO1xuXHR9XG5cblx0cmV0dXJuIHJnYjtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Y29sb3JMdW1pbmFuY2U6IGNvbG9yTHVtaW5hbmNlXG59IiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFNQQUNFOiAzMixcblx0TEVGVDogMzcsXG5cdFJJR0hUOiAzOSxcblx0VVA6IDM4LFxuXHRET1dOOiA0MCxcblx0U0hJRlQ6IDE2XG59OyIsInZhciBCb2FyZCA9IHJlcXVpcmUoJy4vQm9hcmQuanMnKTtcbnZhciBQaWVjZSA9IHJlcXVpcmUoJy4vUGllY2UuanMnKTtcbnZhciBDb2xvcnMgPSByZXF1aXJlKCcuL0NvbG9ycy5qcycpO1xudmFyIHRyYW5zZm9ybSA9IHJlcXVpcmUoJy4vVHJhbnNmb3JtLmpzJyk7XG52YXIgQ29sbGlzaW9uRGV0ZWN0aW9uID0gcmVxdWlyZSgnLi9Db2xsaXNpb25EZXRlY3Rpb24uanMnKTtcbnZhciBDb250cm9scyA9IHJlcXVpcmUoJy4vQ29udHJvbHMuanMnKTtcbnZhciBSZW5kZXJlciA9IHJlcXVpcmUoJy4vUmVuZGVyZXIuanMnKTtcblxudmFyIGNvbG9ycyA9IENvbG9ycygpO1xudmFyIGJvYXJkID0gQm9hcmQoKTtcbnZhciBwaWVjZSA9IG5ldyBQaWVjZSh7dHlwZTogJ0knfSk7XG52YXIgYmxvY2tzID0gWydJJywgJ0onLCAnTCcsICdPJywgJ1MnLCAnVCcsICdaJ107XG52YXIgY29sbGlzaW9uRGV0ZWN0aW9uID0gQ29sbGlzaW9uRGV0ZWN0aW9uKHtcblx0Ym9hcmQ6IGJvYXJkXG59KTtcbnZhciBjaGVjayA9IGNvbGxpc2lvbkRldGVjdGlvbi5jaGVjaztcblxudmFyIHJlbmRlcmVyID0gUmVuZGVyZXIoe2JvYXJkOiBib2FyZCwgY29sb3JzOiBjb2xvcnN9KTtcbnZhciBjb250cm9scyA9IENvbnRyb2xzKHtcblx0cGllY2U6IHBpZWNlLFxuXHRjaGVjazpjaGVja1xufSk7XG5jb250cm9scy5pbml0KCk7XG5cblxuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG5cdC8vaWYocGllY2UueSA+IGJvYXJkLmhlaWdodCkge1xuXHQvL1x0cGllY2UgPSBnZW5lcmF0ZVJhbmRvbVBpZWNlKCk7XG5cdC8vfVxuXG5cdGlmIChjaGVjayhwaWVjZS5jbG9uZSgpLmdvRG93bigpKSkge1xuXHRcdHBpZWNlLmdvRG93bigpO1xuXHR9IFxuXHRlbHNlIHtcblx0XHRzdGl0Y2hQaWVjZVRvQm9hcmQocGllY2UpO1xuXHRcdHBpZWNlID0gZ2VuZXJhdGVSYW5kb21QaWVjZSgpO1xuXHRcdGNvbnRyb2xzLnVwZGF0ZVBpZWNlKHBpZWNlKTtcblx0fVxuXG59LCA1MDApO1xuXG5cbnZhciByZW5kZXJUb2tlbiA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuXHRyZW5kZXJlci5yZW5kZXIocGllY2UpO1xufSwgNTApO1xuXG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tUGllY2UgKCkge1xuXHR2YXIgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYmxvY2tzLmxlbmd0aCk7XG5cdHZhciBwID0gbmV3IFBpZWNlKHt0eXBlOiBibG9ja3NbcmFuZG9tXX0pO1xuXHRyZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gc3RpdGNoUGllY2VUb0JvYXJkKHBpZWNlKSB7XG5cdHZhciBzaGFwZSA9IHBpZWNlLnNoYXBlO1xuXHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBzaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRpZihzaGFwZVtyb3ddW2NvbF0gIT09IDApIHtcblx0XHRcdFx0dmFyIHggPSBwaWVjZS54ICsgY29sO1xuXHRcdFx0XHR2YXIgeSA9IHBpZWNlLnkgKyByb3c7XG5cdFx0XHRcdHZhciBpbmRleCA9IGJsb2Nrcy5pbmRleE9mKHBpZWNlLnR5cGUpICsgMTtcblx0XHRcdFx0XHRib2FyZFt5XVt4XSA9IGluZGV4O1xuXHRcdFx0fVxuXHRcdH07XG5cdH07XG59XG5cbiJdfQ==
