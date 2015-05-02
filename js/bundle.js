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
		[1,2,3,4,5,0,0,0,0,0],
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
		init: init
	}

	function init() {
		$(document).on('keydown', keyPressed);
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
	this.shape = transform.rotate(this);
	return this;
}

Piece.prototype.logShape = function() {
	var shapeString = "";
	for (var row = 0; row < this.shape.length; row++) {
		for (var col = 0; col < this.shape[row].length; col++) {
			shapeString += this.shape[row][col];
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
	var colorIndexes = ['J', 'L', 'O', 'S', 'T', 'Z'];
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
					var blockType = colorIndexes [ board[row][col] ];
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
	'I': {},
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
var piece = new Piece({type: 'L'});
var blocks = ['J', 'L', 'O', 'S', 'T', 'Z'];
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
		console.log(piece)
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
				var index = blocks.indexOf(piece.type);
				console.log(index)
					board[y][x] = index;
			}
		};
	};
}


},{"./Board.js":1,"./CollisionDetection.js":2,"./Colors.js":3,"./Controls.js":4,"./Piece.js":5,"./Renderer.js":6,"./Transform.js":8}],12:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8}]},{},[11])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzcvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwianMvQm9hcmQuanMiLCJqcy9Db2xsaXNpb25EZXRlY3Rpb24uanMiLCJqcy9Db2xvcnMuanMiLCJqcy9Db250cm9scy5qcyIsImpzL1BpZWNlLmpzIiwianMvUmVuZGVyZXIuanMiLCJqcy9TaGFwZXMuanMiLCJqcy9UcmFuc2Zvcm0uanMiLCJqcy9oZWxwZXJzLmpzIiwianMva2V5cy5qcyIsImpzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuXG5cdHZhciBib2FyZCA9IFtcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMSwyLDMsNCw1LDAsMCwwLDAsMF0sXG5cdF07XG5cblx0Ym9hcmQuaGVpZ2h0ID0gYm9hcmQubGVuZ3RoO1xuXHRib2FyZC53aWR0aCA9IGJvYXJkWzBdLmxlbmd0aDtcblxuXHRyZXR1cm4gYm9hcmQ7XG59XG5cbiIsInZhciBQaWVjZSA9IHJlcXVpcmUoJy4vUGllY2UuanMnKTtcbnZhciB0cmFuc2Zvcm0gPSByZXF1aXJlKCcuL1RyYW5zZm9ybS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIENvbGxpc2lvbkRldGVjdGlvbihjcmVhdGVPcHRpb25zKXtcblx0dmFyIGJvYXJkID0gY3JlYXRlT3B0aW9ucy5ib2FyZDtcblx0cmV0dXJuIHtcblx0XHRjaGVjazogY2hlY2tcblx0fTtcblxuXHRmdW5jdGlvbiBjaGVjayhwaWVjZSkge1xuXHRcdHZhciBzaGFwZSA9IHBpZWNlLnNoYXBlO1xuXHRcdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0XHRpZiAoc2hhcGVbcm93XVtjb2xdICE9PSAwKSB7XG5cdFx0XHRcdFx0dmFyIHkgPSAocGllY2UueSArIHJvdyk7XG5cdFx0XHRcdFx0dmFyIHggPSAocGllY2UueCArIGNvbCk7XG5cdFx0XHRcdFx0aWYgKHkgPj0gYm9hcmQuaGVpZ2h0KSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdCAgICAgICAgICAgIFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKGJvYXJkW3ldW3hdICE9PSAwICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0IFx0Ly9jaGVjayBpZiBvdXQgb2YgYm91bmRzIGhlaWdodFxuXHRcdFx0XHQgXHQvL2NoZWNrIGlmIG91dG9mYm91bmRzIHJpZ2h0LCBjb21wZW5zYXRlXG5cdFx0XHRcdCBcdC8vY2hlY2sgaWYgb3V0b2Zib3VuZHMgbGVmdCwgY29tcGVuc2F0ZVxuXHRcdFx0XHQgfVxuXHRcdFx0fTtcblx0XHR9O1xuXHRcdHJldHVybiB0cnVlO1x0XHRcblx0fVxuXG5cdGZ1bmN0aW9uIGxvZ1NoYXBlKHNoYXBlKSB7XG5cdFx0dmFyIHNoYXBlU3RyaW5nID0gXCJcIjtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBzaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBzaGFwZVtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdFx0c2hhcGVTdHJpbmcgKz0gc2hhcGVbcm93XVtjb2xdO1xuXHRcdFx0fTtcblx0XHRcdHNoYXBlU3RyaW5nICs9ICdcXG4nO1xuXHRcdH07XG5cdFx0Y29uc29sZS5sb2coc2hhcGVTdHJpbmcpO1xuXHR9XG5cblx0ZnVuY3Rpb24gbG9nUGFydE9mQm9hcmQoY29weSkge1xuXHRcdHZhciBib2FyZFN0cmluZyA9IFwiXCI7XG5cdFx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgMzsgcm93KyspIHtcblx0XHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IDM7IGNvbCsrKSB7XG5cdFx0XHRcdHZhciB4ID0gKGNvcHkueCArIGNvbCk7XG5cdFx0XHRcdHZhciB5ID0gKGNvcHkueSArIHJvdyk7XG5cdFx0XHRcdGJvYXJkU3RyaW5nICs9IGJvYXJkW3ldW3hdO1xuXHRcdFx0fTtcblx0XHRcdGJvYXJkU3RyaW5nICs9ICdcXG4nO1xuXHRcdH07XG5cdFx0Y29uc29sZS5sb2coYm9hcmRTdHJpbmcpO1xuXHR9XG5cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIENvbG9ycygpIHtcblx0cmV0dXJuIHtcblx0XHQnSSc6ICcjMjdERUZGJywgLy9sanVzYmzDpVxuXHRcdCdKJzogJyMzQzY2RkYnLCAvL2Jsw6Vcblx0XHQnTCc6ICcjRTg3NDBDJywgLy9vcmFuZ2Vcblx0XHQnTyc6ICcjRkZENzBEJywgLy9ndWxcblx0XHQnUyc6ICcjMjZGRjAwJywgLy9ncsO2blxuXHRcdCdUJzogJyM5RTBDRTgnLCAvL2xpbGFcblx0XHQnWic6ICcjRkYwMDAwJyAgLy9yw7ZkXG5cdH1cbn0iLCJ2YXIga2V5cyA9IHJlcXVpcmUoJy4va2V5cy5qcycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBDb250cm9scyhjcmVhdGVPcHRpb25zKSB7XG5cdHZhciBwaWVjZSA9IGNyZWF0ZU9wdGlvbnMucGllY2U7XG5cdHZhciBjb2xsaXNpb25EZXRlY3Rpb24gPSBjcmVhdGVPcHRpb25zLmNvbGxpc2lvbkRldGVjdGlvbjtcblx0dmFyIGNoZWNrID0gY3JlYXRlT3B0aW9ucy5jaGVjaztcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0JChkb2N1bWVudCkub24oJ2tleWRvd24nLCBrZXlQcmVzc2VkKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGtleVByZXNzZWQoZSkge1xuXG5cdFx0aWYgKGUua2V5Q29kZSA9PSBrZXlzLlJJR0hUKSB7XG5cdFx0XHRpZiAoY2hlY2socGllY2UuY2xvbmUoKS5nb1JpZ2h0KCkpKSB7XG5cdFx0XHRcdHBpZWNlLmdvUmlnaHQoKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAoZS5rZXlDb2RlID09IGtleXMuTEVGVCkge1xuXHRcdFx0aWYgKGNoZWNrKHBpZWNlLmNsb25lKCkuZ29MZWZ0KCkpKSB7XG5cdFx0XHRcdHBpZWNlLmdvTGVmdCgpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmIChlLmtleUNvZGUgPT0ga2V5cy5VUCkge1xuXHRcdFx0aWYgKGNoZWNrKHBpZWNlLmNsb25lKCkucm90YXRlKCkpKSB7XG5cdFx0XHRcdHBpZWNlLnJvdGF0ZSgpO1xuXHRcdFx0IH1cblx0XHR9XG5cdFx0ZWxzZSBpZihlLmtleUNvZGUgPT0ga2V5cy5ET1dOKSB7XG5cdFx0XHRpZiAoY2hlY2socGllY2UuY2xvbmUoKS5nb0Rvd24oKSkpIHtcblx0XHRcdFx0cGllY2UuZ29Eb3duKClcblx0XHRcdH1cblx0XHR9IFxuXHR9XG5cbn0iLCJ2YXIgU2hhcGVzID0gcmVxdWlyZSgnLi9TaGFwZXMuanMnKTtcbnZhciB0cmFuc2Zvcm0gPSByZXF1aXJlKCcuL3RyYW5zZm9ybS5qcycpO1xuXG5mdW5jdGlvbiBQaWVjZShvcHRpb25zKSB7XG5cdHRoaXMudHlwZSA9IG9wdGlvbnMudHlwZTtcblx0dGhpcy54ID0gb3B0aW9ucy54IHx8IDA7XG5cdHRoaXMueSA9IG9wdGlvbnMueSB8fCAwO1x0XG5cdHRoaXMuc2hhcGUgPSBvcHRpb25zLnNoYXBlIHx8IFNoYXBlc1t0aGlzLnR5cGVdLnNoYXBlO1xuXHR0aGlzLnBpdm90UG9pbnQgPSBTaGFwZXNbdGhpcy50eXBlXS5waXZvdFBvaW50O1xuXG5cdHJldHVybjtcbn1cblxuUGllY2UucHJvdG90eXBlLmdvUmlnaHQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy54Kys7XG5cdHJldHVybiB0aGlzO1xufVxuXG5QaWVjZS5wcm90b3R5cGUuZ29MZWZ0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMueC0tO1xuXHRyZXR1cm4gdGhpcztcbn1cblxuXG5QaWVjZS5wcm90b3R5cGUuZ29Eb3duID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMueSsrO1xuXHRyZXR1cm4gdGhpcztcbn1cblxuUGllY2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBuZXcgUGllY2UodGhpcyk7XG59XG5cblBpZWNlLnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5zaGFwZSA9IHRyYW5zZm9ybS5yb3RhdGUodGhpcyk7XG5cdHJldHVybiB0aGlzO1xufVxuXG5QaWVjZS5wcm90b3R5cGUubG9nU2hhcGUgPSBmdW5jdGlvbigpIHtcblx0dmFyIHNoYXBlU3RyaW5nID0gXCJcIjtcblx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgdGhpcy5zaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgdGhpcy5zaGFwZVtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdHNoYXBlU3RyaW5nICs9IHRoaXMuc2hhcGVbcm93XVtjb2xdO1xuXHRcdH07XG5cdFx0c2hhcGVTdHJpbmcgKz0gJ1xcbic7XG5cdH07XG5cdGNvbnNvbGUubG9nKHNoYXBlU3RyaW5nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQaWVjZTsiLCJ2YXIgY29sb3JMdW1pbmFuY2UgPSByZXF1aXJlKCcuL2hlbHBlcnMuanMnKS5jb2xvckx1bWluYW5jZTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFJlbmRlcmVyKG9wdGlvbnMpIHtcblx0dmFyIGJvYXJkID0gb3B0aW9ucy5ib2FyZDtcblx0dmFyIGNvbG9ycyA9IG9wdGlvbnMuY29sb3JzO1xuXHR2YXIgY29sb3JJbmRleGVzID0gWydKJywgJ0wnLCAnTycsICdTJywgJ1QnLCAnWiddO1xuXHRib2FyZC5oZWlnaHQgPSBib2FyZC5sZW5ndGg7XG5cdGJvYXJkLndpZHRoID0gYm9hcmRbMF0ubGVuZ3RoO1xuXHR2YXIgY29udGV4dDtcblx0dmFyIGNhbnZhcztcblx0dmFyIHNpemU7XG5cdHZhciBzaXplcGFkZGluZyA9IDE7XG5cdHNxdWFyZSA9IHt9O1xuXHRpbml0KCk7XG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdCxcblx0XHRyZW5kZXI6IHJlbmRlcixcblx0XHRmaWxsU3F1YXJlOiBmaWxsU3F1YXJlXG5cdH07XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1jYW52YXMnKTtcblx0XHRjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0Ly9jb250ZXh0LnNjYWxlKDIsMik7XG5cdFx0Y2FsY3VsYXRlU3F1YXJlU2l6ZSgpO1xuXG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXIocGllY2UpIHtcblx0XHRjbGVhcigpO1xuXHRcdHJlbmRlckJvYXJkKCk7XG5cdFx0cmVuZGVyTW92aW5nUGllY2UocGllY2UpO1xuXHRcdC8vz4ByZW5kZXJHaG9zdFBpZWNlKHBpZWNlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlbmRlckJvYXJkKCkge1xuXHRcdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IGJvYXJkLmxlbmd0aDsgcm93KyspIHtcblx0XHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IGJvYXJkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0XHRpZihib2FyZFtyb3ddW2NvbF0gIT09IDApIHtcblx0XHRcdFx0XHR2YXIgYmxvY2tUeXBlID0gY29sb3JJbmRleGVzIFsgYm9hcmRbcm93XVtjb2xdIF07XG5cdFx0XHRcdFx0dmFyIGJnID0gY29sb3JzW2Jsb2NrVHlwZV07XG5cdFx0XHRcdFx0dmFyIHN0cm9rZUNvbG9yID0gY29sb3JMdW1pbmFuY2UoYmcsIC0wLjIpO1xuXHRcdFx0XHRcdHZhciBzdHJva2VUaGlja25lc3MgPSAyLjU7XG5cdFx0XHRcdFx0cmVuZGVyU3F1YXJlKGNvbCwgcm93LCB7XG5cdFx0XHRcdFx0XHRiZzogYmcsIFxuXHRcdFx0XHRcdFx0c3Ryb2tlQ29sb3I6IHN0cm9rZUNvbG9yLFxuXHRcdFx0XHRcdFx0c3Ryb2tlVGhpY2tuZXNzOiBzdHJva2VUaGlja25lc3Ncblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR2YXIgYmcgPSAnI2VlZSc7XG5cdFx0XHRcdFx0dmFyIGJnMiA9ICcjZmZmJztcblx0XHRcdFx0XHRpZiggKHJvdytjb2wpICUgMiA9PSAwICl7XG5cdFx0XHRcdFx0XHRiZyA9IGJnMjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdGJnID0gYmc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlbmRlclNxdWFyZShjb2wsIHJvdywge1xuXHRcdFx0XHRcdFx0Ymc6IGJnLFxuXHRcdFx0XHRcdFx0Ly9zdHJva2U6ZmFsc2Vcblx0XHRcdFx0XHRcdHN0cm9rZVRoaWNrbmVzczogMC4zLFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXJNb3ZpbmdQaWVjZShwaWVjZSkge1xuXHRcdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHBpZWNlLnNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHBpZWNlLnNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0XHR2YXIgeCA9IChwaWVjZS54ICsgY29sKTtcblx0XHRcdFx0dmFyIHkgPSAocGllY2UueSArIHJvdyk7XG5cdFx0XHRcdHZhciBiZyA9IGNvbG9yc1twaWVjZS50eXBlXTtcblx0XHRcdFx0dmFyIHN0cm9rZUNvbG9yID0gY29sb3JMdW1pbmFuY2UoYmcsIC0wLjEpO1xuXHRcdFx0XHRpZiggcGllY2Uuc2hhcGVbcm93XVtjb2xdICE9PSAwICkge1xuXHRcdFx0XHRcdHJlbmRlclNxdWFyZSh4LCB5LCB7XG5cdFx0XHRcdFx0XHRiZzogYmcsXG5cdFx0XHRcdFx0XHRzdHJva2VDb2xvcjogc3Ryb2tlQ29sb3Jcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdH07XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlbmRlckdob3N0UGllY2UocGllY2UpIHtcblx0XHRjb250ZXh0LnJlY3QocGllY2UueCwgY2FudmFzLmhlaWdodCAtIHNxdWFyZS5oZWlnaHQsIHNxdWFyZS53aWR0aCwgc3F1YXJlLmhlaWdodCk7XG5cdFx0Y29udGV4dC5zdHJva2UoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlbmRlclNxdWFyZShpLCBqLCBvcHRpb25zKSB7XG5cdFx0ZmlsbFNxdWFyZShzcXVhcmUud2lkdGggKiBpLCBzcXVhcmUuaGVpZ2h0ICogaiwgb3B0aW9ucyk7XG5cdH1cblxuXHRmdW5jdGlvbiBmaWxsU3F1YXJlKHgsIHksIG9wdGlvbnMpIHtcblx0XHR2YXIgc3Ryb2tlID0gKChvcHRpb25zLnN0cm9rZSAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuc3Ryb2tlIDogdHJ1ZSk7XG5cdFx0dmFyIHN0cm9rZUNvbG9yID0gb3B0aW9ucy5zdHJva2VDb2xvciB8fCAnI2NjYyc7XG5cdFx0dmFyIHN0cm9rZVRoaWNrbmVzcyA9IG9wdGlvbnMuc3Ryb2tlVGhpY2tuZXNzIHx8IDIuNTtcblxuXHRcdGNvbnRleHQuZmlsbFN0eWxlID0gb3B0aW9ucy5iZztcblx0XHRjb250ZXh0LmZpbGxSZWN0KHgqc2l6ZXBhZGRpbmcsIHkqc2l6ZXBhZGRpbmcsIHNxdWFyZS53aWR0aCwgc3F1YXJlLmhlaWdodCk7XG5cdFx0XG5cdFx0aWYoc3Ryb2tlKSB7XG5cdFx0XHRjb250ZXh0LnN0cm9rZVN0eWxlID0gc3Ryb2tlQ29sb3I7XG5cdFx0XHRjb250ZXh0LmxpbmVXaWR0aCA9IHN0cm9rZVRoaWNrbmVzcztcblx0XHRcdGNvbnRleHQuc3Ryb2tlUmVjdCh4ICsgc3Ryb2tlVGhpY2tuZXNzICogMC41LCB5ICsgc3Ryb2tlVGhpY2tuZXNzICogMC41LCBzcXVhcmUud2lkdGggLSBzdHJva2VUaGlja25lc3MsIHNxdWFyZS5oZWlnaHQgLSBzdHJva2VUaGlja25lc3MpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGNhbGN1bGF0ZVNxdWFyZVNpemUoKSB7XG5cdFx0c3F1YXJlLndpZHRoID0gY2FudmFzLndpZHRoIC8gYm9hcmQud2lkdGg7XG5cdFx0c3F1YXJlLmhlaWdodCA9IGNhbnZhcy5oZWlnaHQgLyBib2FyZC5oZWlnaHQ7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGNsZWFyKCkge1xuXHRcdGNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdFx0Y29udGV4dC5jbGVhclJlY3QgKCAwICwgMCAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCApO1xuXHR9XG59IiwidmFyIFNoYXBlcyA9IG1vZHVsZS5leHBvcnRzID0ge1xuXHQnSSc6IHt9LFxuXHQnSic6IHtcblx0XHRzaGFwZTogWyBbMCwgMCwgMF0sIFsxLCAxLCAxXSwgWzAsIDAsIDFdIF0sXG5cdFx0cGl2b3RQb2ludDoge3g6IDEsIHk6IDF9XG5cdH0sXG5cdCdMJzoge1xuXHRcdHNoYXBlOiBbIFswLCAwLCAwXSwgWzEsIDEsIDFdLCBbMSwgMCwgMF0gXSxcblx0XHRwaXZvdFBvaW50OiB7eDogMSwgeTogMX1cblx0fSxcblx0J08nOiB7XG5cdFx0c2hhcGU6IFsgWzEsIDFdLCBbMSwgMV0gXSxcblx0XHRwaXZvdFBvaW50OiB7eDogMCwgeTogMH1cblx0fSxcblx0J1MnOiB7XG5cdFx0c2hhcGU6IFsgWzAsIDEsIDFdLCBbMSwgMSwgMF0sIFswLCAwLCAwXSBdLFxuXHRcdHBpdm90UG9pbnQ6IHt4OiAxLCB5OiAxfVxuXHR9LFxuXHQnVCc6IHtcblx0XHRzaGFwZTogWyBbMCwgMSwgMF0sIFsxLCAxLCAxXSwgWzAsIDAsIDBdIF0sXG5cdFx0cGl2b3RQb2ludDoge3g6IDEsIHk6IDF9XG5cdH0sXG5cdCdaJzoge1xuXHRcdHNoYXBlOiBbIFsxLCAxLCAwXSwgWzAsIDEsIDFdLCBbMCwgMCwgMF0gXSxcblx0XHRwaXZvdFBvaW50OiB7eDogMSwgeTogMX1cblx0fVxufTtcbiIsInZhciBUcmFuc2Zvcm0gPSBtb2R1bGUuZXhwb3J0cyA9IHtcblx0cm90YXRlOiByb3RhdGVcbn07XG5cblx0dmFyIHRldHJvbWlubztcblxuXHRmdW5jdGlvbiByb3RhdGUobXlQaWVjZSkge1xuXHRcdGlmKG15UGllY2UudHlwZSA9PSAnTycpIHJldHVybjtcblxuXHRcdHRldHJvbWlubyA9IG15UGllY2U7XG5cdFx0dmFyIHBpdm90UG9pbnQgPSB0ZXRyb21pbm8ucGl2b3RQb2ludDtcblxuXHRcdHZhciBwb2ludHMgPSBjb252ZXJ0U2hhcGVUb1BvaW50cyh0ZXRyb21pbm8uc2hhcGUpO1xuXHRcdHBvaW50cyA9IHRyYW5zbGF0ZVBvaW50c0J5RGlzdGFuY2UocG9pbnRzLCB7eDogLXBpdm90UG9pbnQueCwgeTogLXBpdm90UG9pbnQueX0pXG5cdFx0cG9pbnRzID0gcm90YXRlUG9pbnRzKHBvaW50cyk7XG5cdFx0cG9pbnRzID0gdHJhbnNsYXRlUG9pbnRzQnlEaXN0YW5jZShwb2ludHMsIHt4OiBwaXZvdFBvaW50LngsIHk6IHBpdm90UG9pbnQueX0pO1xuXHRcdHZhciBmaW5hbFNoYXBlID0gY29udmVydFBvaW50c1RvU2hhcGUocG9pbnRzKTtcblx0XHRwb2ludHMgPSBbXTtcblxuXHRcdHJldHVybiBmaW5hbFNoYXBlO1xuXHR9XG5cdGZ1bmN0aW9uIGNvbnZlcnRTaGFwZVRvUG9pbnRzKHNoYXBlKSB7XG5cdFx0dmFyIHBvaW50cyA9IFtdO1xuXHRcdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0XHR2YXIgcG9pbnQgPSB7XG5cdFx0XHRcdFx0eDogY29sLCBcblx0XHRcdFx0XHR5OiByb3csXG5cdFx0XHRcdFx0dmFsdWU6IHNoYXBlW3Jvd11bY29sXVxuXHRcdFx0XHR9XG5cdFx0XHRcdHBvaW50cy5wdXNoKHBvaW50KTtcblx0XHRcdH07XG5cdFx0fTtcblx0XHRyZXR1cm4gcG9pbnRzO1xuXHR9XG5cblx0ZnVuY3Rpb24gdHJhbnNsYXRlUG9pbnRzQnlEaXN0YW5jZShwb2ludHMsIGRpc3RhbmNlKSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHBvaW50c1tpXS54ID0gcG9pbnRzW2ldLnggKyBkaXN0YW5jZS54O1xuXHRcdFx0cG9pbnRzW2ldLnkgPSBwb2ludHNbaV0ueSArIGRpc3RhbmNlLnk7XG5cdFx0fTtcblx0XHRyZXR1cm4gcG9pbnRzO1xuXHR9XG5cblx0ZnVuY3Rpb24gbW92ZVRvUGl2b3RQb2ludCgpIHtcblx0XHR2YXIgc2hhcGUgPSB0ZXRyb21pbm8uc2hhcGU7XG5cdFx0dmFyIHBpdm90UG9pbnQgPSB0ZXRyb21pbm8ucGl2b3RQb2ludDtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBzaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBzaGFwZVtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdFx0dmFyIG1vdmVkWCA9IGNvbCAtIHBpdm90UG9pbnQueDtcblx0XHRcdFx0dmFyIG1vdmVkWSA9IHJvdyAtIHBpdm90UG9pbnQueTtcblx0XHRcdFx0dmFyIHBvaW50ID0ge1xuXHRcdFx0XHRcdHg6IG1vdmVkWCwgXG5cdFx0XHRcdFx0eTogbW92ZWRZLFxuXHRcdFx0XHRcdHZhbHVlOiBzaGFwZVtyb3ddW2NvbF1cblx0XHRcdFx0fVxuXHRcdFx0XHRwb2ludHMucHVzaChwb2ludCk7XG5cdFx0XHR9O1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiByb3RhdGVQb2ludHMocG9pbnRzKSB7XG5cdFx0Ly92YXIgcm90ID0gW1swLCAxXSwgWy0xLCAwXV07IC8vIDkwIGRlZyBDb3VudGVyQ2xvY2t3aXNlXG5cdFx0dmFyIHJvdCA9IFtbMCwgLTFdLCBbMSwgMF1dOyAvLyA5MCBkZWcgQ2xvY2t3aXNlXG5cdFx0dmFyIHRlbXAgPSB7fTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgeCA9IHBvaW50c1tpXS54O1xuXHRcdFx0dmFyIHkgPSBwb2ludHNbaV0ueTtcblx0XHRcdHRlbXAueCA9IHggKiByb3RbMF1bMF0gKyB5ICogcm90WzBdWzFdO1xuXHRcdFx0dGVtcC55ID0geCAqIHJvdFsxXVswXSArIHkgKiByb3RbMV1bMV07XG5cdFx0XHRwb2ludHNbaV0ueCA9IHRlbXAueDtcblx0XHRcdHBvaW50c1tpXS55ID0gdGVtcC55O1xuXHRcdH07XG5cdFx0cmV0dXJuIHBvaW50cztcblx0fVxuXG5cdGZ1bmN0aW9uIGNvbnZlcnRQb2ludHNUb1NoYXBlKHBvaW50cykge1xuXHRcdHZhciB0ZW1wU2hhcGUgPSBjb3B5U2hhcGUodGV0cm9taW5vLnNoYXBlKVxuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBjb2wgPSBwb2ludHNbaV0ueDtcblx0XHRcdHZhciByb3cgPSBwb2ludHNbaV0ueTtcblx0XHRcdHRlbXBTaGFwZVtyb3ddW2NvbF0gPSBwb2ludHNbaV0udmFsdWU7XG5cdFx0fTtcblxuXHRcdHJldHVybiB0ZW1wU2hhcGU7XG5cdH1cblxuXHRmdW5jdGlvbiBjb3B5U2hhcGUoc29tZVNoYXBlKSB7XG5cdFx0dmFyIG5ld0FycmF5ID0gW107XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzb21lU2hhcGUubGVuZ3RoOyBpKyspIHtcblx0ICAgIFx0bmV3QXJyYXlbaV0gPSBzb21lU2hhcGVbaV0uc2xpY2UoKTtcblx0XHR9XG5cdFx0cmV0dXJuIG5ld0FycmF5O1xuXHR9XG4iLCJcblxuZnVuY3Rpb24gY29sb3JMdW1pbmFuY2UoaGV4LCBsdW0pIHtcblxuXHQvLyB2YWxpZGF0ZSBoZXggc3RyaW5nXG5cdGhleCA9IFN0cmluZyhoZXgpLnJlcGxhY2UoL1teMC05YS1mXS9naSwgJycpO1xuXHRpZiAoaGV4Lmxlbmd0aCA8IDYpIHtcblx0XHRoZXggPSBoZXhbMF0raGV4WzBdK2hleFsxXStoZXhbMV0raGV4WzJdK2hleFsyXTtcblx0fVxuXHRsdW0gPSBsdW0gfHwgMDtcblxuXHQvLyBjb252ZXJ0IHRvIGRlY2ltYWwgYW5kIGNoYW5nZSBsdW1pbm9zaXR5XG5cdHZhciByZ2IgPSBcIiNcIiwgYywgaTtcblx0Zm9yIChpID0gMDsgaSA8IDM7IGkrKykge1xuXHRcdGMgPSBwYXJzZUludChoZXguc3Vic3RyKGkqMiwyKSwgMTYpO1xuXHRcdGMgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KDAsIGMgKyAoYyAqIGx1bSkpLCAyNTUpKS50b1N0cmluZygxNik7XG5cdFx0cmdiICs9IChcIjAwXCIrYykuc3Vic3RyKGMubGVuZ3RoKTtcblx0fVxuXG5cdHJldHVybiByZ2I7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGNvbG9yTHVtaW5hbmNlOiBjb2xvckx1bWluYW5jZVxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRTUEFDRTogMzIsXG5cdExFRlQ6IDM3LFxuXHRSSUdIVDogMzksXG5cdFVQOiAzOCxcblx0RE9XTjogNDAsXG5cdFNISUZUOiAxNlxufTsiLCJ2YXIgQm9hcmQgPSByZXF1aXJlKCcuL0JvYXJkLmpzJyk7XG52YXIgUGllY2UgPSByZXF1aXJlKCcuL1BpZWNlLmpzJyk7XG52YXIgQ29sb3JzID0gcmVxdWlyZSgnLi9Db2xvcnMuanMnKTtcbnZhciB0cmFuc2Zvcm0gPSByZXF1aXJlKCcuL1RyYW5zZm9ybS5qcycpO1xudmFyIENvbGxpc2lvbkRldGVjdGlvbiA9IHJlcXVpcmUoJy4vQ29sbGlzaW9uRGV0ZWN0aW9uLmpzJyk7XG52YXIgQ29udHJvbHMgPSByZXF1aXJlKCcuL0NvbnRyb2xzLmpzJyk7XG52YXIgUmVuZGVyZXIgPSByZXF1aXJlKCcuL1JlbmRlcmVyLmpzJyk7XG5cbnZhciBjb2xvcnMgPSBDb2xvcnMoKTtcbnZhciBib2FyZCA9IEJvYXJkKCk7XG52YXIgcGllY2UgPSBuZXcgUGllY2Uoe3R5cGU6ICdMJ30pO1xudmFyIGJsb2NrcyA9IFsnSicsICdMJywgJ08nLCAnUycsICdUJywgJ1onXTtcbnZhciBjb2xsaXNpb25EZXRlY3Rpb24gPSBDb2xsaXNpb25EZXRlY3Rpb24oe1xuXHRib2FyZDogYm9hcmRcbn0pO1xudmFyIGNoZWNrID0gY29sbGlzaW9uRGV0ZWN0aW9uLmNoZWNrO1xuXG52YXIgcmVuZGVyZXIgPSBSZW5kZXJlcih7Ym9hcmQ6IGJvYXJkLCBjb2xvcnM6IGNvbG9yc30pO1xudmFyIGNvbnRyb2xzID0gQ29udHJvbHMoe1xuXHRwaWVjZTogcGllY2UsXG5cdGNoZWNrOmNoZWNrXG59KTtcbmNvbnRyb2xzLmluaXQoKTtcblxuXG5zZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcblx0Ly9pZihwaWVjZS55ID4gYm9hcmQuaGVpZ2h0KSB7XG5cdC8vXHRwaWVjZSA9IGdlbmVyYXRlUmFuZG9tUGllY2UoKTtcblx0Ly99XG5cblx0aWYgKGNoZWNrKHBpZWNlLmNsb25lKCkuZ29Eb3duKCkpKSB7XG5cdFx0cGllY2UuZ29Eb3duKCk7XG5cdH0gXG5cdGVsc2Uge1xuXHRcdHN0aXRjaFBpZWNlVG9Cb2FyZChwaWVjZSk7XG5cdFx0cGllY2UgPSBnZW5lcmF0ZVJhbmRvbVBpZWNlKCk7XG5cdFx0Y29uc29sZS5sb2cocGllY2UpXG5cdH1cblxufSwgNTAwKTtcblxuXG52YXIgcmVuZGVyVG9rZW4gPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcblx0cmVuZGVyZXIucmVuZGVyKHBpZWNlKTtcbn0sIDUwKTtcblxuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVBpZWNlICgpIHtcblxuXHR2YXIgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYmxvY2tzLmxlbmd0aCk7XG5cdHZhciBwID0gbmV3IFBpZWNlKHt0eXBlOiBibG9ja3NbcmFuZG9tXX0pO1xuXHRyZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gc3RpdGNoUGllY2VUb0JvYXJkKHBpZWNlKSB7XG5cdHZhciBzaGFwZSA9IHBpZWNlLnNoYXBlO1xuXHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBzaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRpZihzaGFwZVtyb3ddW2NvbF0gIT09IDApIHtcblx0XHRcdFx0dmFyIHggPSBwaWVjZS54ICsgY29sO1xuXHRcdFx0XHR2YXIgeSA9IHBpZWNlLnkgKyByb3c7XG5cdFx0XHRcdHZhciBpbmRleCA9IGJsb2Nrcy5pbmRleE9mKHBpZWNlLnR5cGUpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhpbmRleClcblx0XHRcdFx0XHRib2FyZFt5XVt4XSA9IGluZGV4O1xuXHRcdFx0fVxuXHRcdH07XG5cdH07XG59XG5cbiJdfQ==
