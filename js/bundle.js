(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function (options) {

	var board = [
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[1,0,0,0,0,0,0,0,0,0],
		[1,0,0,0,0,0,0,0,0,0],
		[1,0,0,0,0,0,0,0,1,1],
		[1,0,0,0,0,0,0,0,1,0],
		[0,0,0,0,0,0,0,1,1,0],
		[0,0,0,0,0,0,0,1,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[1,1,1,1,0,0,0,0,0,0],
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
		canGoLeft: canGoLeft,
		canGoRight: canGoRight,
		canGoDown: canGoDown,
		canRotate: canRotate
	};

	function canGoLeft(piece) {
		for (var row = 0; row < piece.shape.length; row++) {
			for (var col = 0; col < piece.shape[row].length; col++) {
				var x = piece.x + col - 1;
				var y = piece.y + row;
				var isInside = x * piece.shape[row][col] >= 0;
				var hitRestingPieces = ( (board[y][x] !== 0) && (piece.shape[row][col] == 1) );
				if(hitRestingPieces || !isInside) return false;
			};
		};
		return true;
	}


	function canGoRight(piece) {
		for (var row = 0; row < piece.shape.length; row++) {
			for (var col = 0; col < piece.shape[row].length; col++) {
				var x = piece.x + col + 1;
				var y = piece.y + row;
				var isInside = x * piece.shape[row][col] < board.width;
				var hitRestingPieces = ( (board[y][x] !== 0) && (piece.shape[row][col] == 1) );
				if(hitRestingPieces || !isInside) return false;
			};
		};
		return true;
	}

	function canGoDown(piece) {
		for (var row = 0; row < piece.shape.length; row++) {
			for (var col = 0; col < piece.shape[row].length; col++) {
				var x = (piece.x + col);
				var y = (piece.y + 1 + row);

				var hit = ( (board[y][x] !== 0) && (piece.shape[row][col] == 1) );
				if(hit) {
					return false;
				}
			};
		};
		return true;
	}

	function canRotate(piece) {

		var copy = new Piece(piece);
		copy.rotate();
		var shape = copy.shape;

		for (var row = 0; row < shape.length; row++) {
			for (var col = 0; col < shape[row].length; col++) {
				var x = (copy.x + col);
				var y = (copy.y + row);

				var hitRestingPieces = ( (board[y][x] !== 0) && (shape[col][row] !== 0) );

				if (hitRestingPieces) {
					return false;
				}
			};
		};	
		return true;	
	}
	
}
},{"./Piece.js":5,"./Transform.js":8}],3:[function(require,module,exports){
//var blockColors = ['#27DEFF','#3C66FF','#E8740C','#FFD70D','#26FF00','#9E0CE8','#FF0000'];
//ljusblå, blå, orange, gul, grön, lila, röd
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
module.exports = function Controls(createOptions) {
	var piece = createOptions.piece;
	var collisionDetection = createOptions.collisionDetection;
	var keys = {
		SPACE: 32,
		LEFT: 37,
		RIGHT: 39,
		UP: 38,
		DOWN: 40,
		SHIFT: 16
	};

	return {
		init: init
	}

	function init() {
		$(document).on('keydown', keyPressed);
	}

	function keyPressed(e) {

		if (e.keyCode == keys.RIGHT) {
			if (collisionDetection.canGoRight(piece)) {
				goRight();
			}
		}
		else if (e.keyCode == keys.LEFT) {
			if (collisionDetection.canGoLeft(piece)) {
				goLeft();
			}
		}
		else if (e.keyCode == keys.UP) {
			if (collisionDetection.canRotate(piece)) {
				piece.rotate();
			 }
		}
		else if(e.keyCode == keys.DOWN) {
			if (collisionDetection.canGoDown(piece)) {
				piece.y++;
			}
		} 
	}

	function goLeft() {
		piece.x--;
	}

	function goRight() {
		piece.x++;
	}

}
},{}],5:[function(require,module,exports){
var Shapes = require('./Shapes.js');
var transform = require('./transform.js');

var Piece = module.exports = function Piece(options) {
	this.type = options.type;
	this.x = options.x || 0;
	this.y = options.y || 0;	
	this.shape = Shapes[this.type].shape;
	this.pivotPoint = Shapes[this.type].pivotPoint;

}

Piece.prototype.rotate = function() {
	this.shape = transform.rotate(this);
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

},{"./Shapes.js":7,"./transform.js":10}],6:[function(require,module,exports){
module.exports = function Renderer(options) {
	var board = options.board;
	var colors = options.colors;
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
					renderSquare(col, row, board[row][col]);
				}
				else {
					renderSquare(col, row, {
						bg:'#ccc',
						stroke: '#eee'
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
				if( piece.shape[row][col] !== 0 ) {
					renderSquare(x, y, {bg: colors[piece.type]});
				}
				
			};
		};
	}

	function renderGhostPiece(piece) {
		context.rect(piece.x, canvas.height - square.height, square.width, square.height);
		context.stroke();
	}

	function renderSquare(i, j, color) {
		fillSquare(square.width * i, square.height * j, color);
	}

	function fillSquare(x, y, color) {
		var stroke = true;
		var strokeColor = color.stroke || '#333';

		context.fillStyle = color.bg;
		context.fillRect(x*sizepadding, y*sizepadding, square.width, square.height);
		
		if(stroke) {
			var strokeThickness = 1.5;
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
},{}],7:[function(require,module,exports){
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
var collisionDetection = CollisionDetection({
	board: board
});

var renderer = Renderer({board: board, colors: colors});
var controls = Controls({
	piece: piece,
	collisionDetection:collisionDetection
});
controls.init();


setInterval(function() {
	if(piece.y > board.height) {
		piece = generateRandomPiece();
	}

	var canMoveDown = collisionDetection.canGoDown(piece);
	if (canMoveDown) {
		//piece.y++;
		//stichPieceToBoard;
	}
}, 500);


var renderToken = setInterval(function() {
	renderer.render(piece);
}, 50);


function generateRandomPiece () {
	var blocks = ['J', 'L', 'O', 'S', 'T', 'Z'];
	var random = Math.floor(Math.random() * blocks.length);
	return Piece({type: blocks[random]});
}
},{"./Board.js":1,"./CollisionDetection.js":2,"./Colors.js":3,"./Controls.js":4,"./Piece.js":5,"./Renderer.js":6,"./Transform.js":8}],10:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8}]},{},[9])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzcvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwianMvQm9hcmQuanMiLCJqcy9Db2xsaXNpb25EZXRlY3Rpb24uanMiLCJqcy9Db2xvcnMuanMiLCJqcy9Db250cm9scy5qcyIsImpzL1BpZWNlLmpzIiwianMvUmVuZGVyZXIuanMiLCJqcy9TaGFwZXMuanMiLCJqcy9UcmFuc2Zvcm0uanMiLCJqcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuXG5cdHZhciBib2FyZCA9IFtcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMSwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzEsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFsxLDAsMCwwLDAsMCwwLDAsMSwxXSxcblx0XHRbMSwwLDAsMCwwLDAsMCwwLDEsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMSwxLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDEsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMSwxLDEsMSwwLDAsMCwwLDAsMF0sXG5cdF07XG5cblx0Ym9hcmQuaGVpZ2h0ID0gYm9hcmQubGVuZ3RoO1xuXHRib2FyZC53aWR0aCA9IGJvYXJkWzBdLmxlbmd0aDtcblxuXHRyZXR1cm4gYm9hcmQ7XG59XG5cbiIsInZhciBQaWVjZSA9IHJlcXVpcmUoJy4vUGllY2UuanMnKTtcbnZhciB0cmFuc2Zvcm0gPSByZXF1aXJlKCcuL1RyYW5zZm9ybS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIENvbGxpc2lvbkRldGVjdGlvbihjcmVhdGVPcHRpb25zKXtcblx0dmFyIGJvYXJkID0gY3JlYXRlT3B0aW9ucy5ib2FyZDtcblx0cmV0dXJuIHtcblx0XHRjYW5Hb0xlZnQ6IGNhbkdvTGVmdCxcblx0XHRjYW5Hb1JpZ2h0OiBjYW5Hb1JpZ2h0LFxuXHRcdGNhbkdvRG93bjogY2FuR29Eb3duLFxuXHRcdGNhblJvdGF0ZTogY2FuUm90YXRlXG5cdH07XG5cblx0ZnVuY3Rpb24gY2FuR29MZWZ0KHBpZWNlKSB7XG5cdFx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgcGllY2Uuc2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgcGllY2Uuc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRcdHZhciB4ID0gcGllY2UueCArIGNvbCAtIDE7XG5cdFx0XHRcdHZhciB5ID0gcGllY2UueSArIHJvdztcblx0XHRcdFx0dmFyIGlzSW5zaWRlID0geCAqIHBpZWNlLnNoYXBlW3Jvd11bY29sXSA+PSAwO1xuXHRcdFx0XHR2YXIgaGl0UmVzdGluZ1BpZWNlcyA9ICggKGJvYXJkW3ldW3hdICE9PSAwKSAmJiAocGllY2Uuc2hhcGVbcm93XVtjb2xdID09IDEpICk7XG5cdFx0XHRcdGlmKGhpdFJlc3RpbmdQaWVjZXMgfHwgIWlzSW5zaWRlKSByZXR1cm4gZmFsc2U7XG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIGNhbkdvUmlnaHQocGllY2UpIHtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBwaWVjZS5zaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBwaWVjZS5zaGFwZVtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdFx0dmFyIHggPSBwaWVjZS54ICsgY29sICsgMTtcblx0XHRcdFx0dmFyIHkgPSBwaWVjZS55ICsgcm93O1xuXHRcdFx0XHR2YXIgaXNJbnNpZGUgPSB4ICogcGllY2Uuc2hhcGVbcm93XVtjb2xdIDwgYm9hcmQud2lkdGg7XG5cdFx0XHRcdHZhciBoaXRSZXN0aW5nUGllY2VzID0gKCAoYm9hcmRbeV1beF0gIT09IDApICYmIChwaWVjZS5zaGFwZVtyb3ddW2NvbF0gPT0gMSkgKTtcblx0XHRcdFx0aWYoaGl0UmVzdGluZ1BpZWNlcyB8fCAhaXNJbnNpZGUpIHJldHVybiBmYWxzZTtcblx0XHRcdH07XG5cdFx0fTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNhbkdvRG93bihwaWVjZSkge1xuXHRcdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHBpZWNlLnNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHBpZWNlLnNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0XHR2YXIgeCA9IChwaWVjZS54ICsgY29sKTtcblx0XHRcdFx0dmFyIHkgPSAocGllY2UueSArIDEgKyByb3cpO1xuXG5cdFx0XHRcdHZhciBoaXQgPSAoIChib2FyZFt5XVt4XSAhPT0gMCkgJiYgKHBpZWNlLnNoYXBlW3Jvd11bY29sXSA9PSAxKSApO1xuXHRcdFx0XHRpZihoaXQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNhblJvdGF0ZShwaWVjZSkge1xuXG5cdFx0dmFyIGNvcHkgPSBuZXcgUGllY2UocGllY2UpO1xuXHRcdGNvcHkucm90YXRlKCk7XG5cdFx0dmFyIHNoYXBlID0gY29weS5zaGFwZTtcblxuXHRcdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0XHR2YXIgeCA9IChjb3B5LnggKyBjb2wpO1xuXHRcdFx0XHR2YXIgeSA9IChjb3B5LnkgKyByb3cpO1xuXG5cdFx0XHRcdHZhciBoaXRSZXN0aW5nUGllY2VzID0gKCAoYm9hcmRbeV1beF0gIT09IDApICYmIChzaGFwZVtjb2xdW3Jvd10gIT09IDApICk7XG5cblx0XHRcdFx0aWYgKGhpdFJlc3RpbmdQaWVjZXMpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fTtcdFxuXHRcdHJldHVybiB0cnVlO1x0XG5cdH1cblx0XG59IiwiLy92YXIgYmxvY2tDb2xvcnMgPSBbJyMyN0RFRkYnLCcjM0M2NkZGJywnI0U4NzQwQycsJyNGRkQ3MEQnLCcjMjZGRjAwJywnIzlFMENFOCcsJyNGRjAwMDAnXTtcbi8vbGp1c2Jsw6UsIGJsw6UsIG9yYW5nZSwgZ3VsLCBncsO2biwgbGlsYSwgcsO2ZFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBDb2xvcnMoKSB7XG5cblx0cmV0dXJuIHtcblx0XHQnSSc6ICcjMjdERUZGJywgLy9sanVzYmzDpVxuXHRcdCdKJzogJyMzQzY2RkYnLCAvL2Jsw6Vcblx0XHQnTCc6ICcjRTg3NDBDJywgLy9vcmFuZ2Vcblx0XHQnTyc6ICcjRkZENzBEJywgLy9ndWxcblx0XHQnUyc6ICcjMjZGRjAwJywgLy9ncsO2blxuXHRcdCdUJzogJyM5RTBDRTgnLCAvL2xpbGFcblx0XHQnWic6ICcjRkYwMDAwJyAgLy9yw7ZkXG5cdH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIENvbnRyb2xzKGNyZWF0ZU9wdGlvbnMpIHtcblx0dmFyIHBpZWNlID0gY3JlYXRlT3B0aW9ucy5waWVjZTtcblx0dmFyIGNvbGxpc2lvbkRldGVjdGlvbiA9IGNyZWF0ZU9wdGlvbnMuY29sbGlzaW9uRGV0ZWN0aW9uO1xuXHR2YXIga2V5cyA9IHtcblx0XHRTUEFDRTogMzIsXG5cdFx0TEVGVDogMzcsXG5cdFx0UklHSFQ6IDM5LFxuXHRcdFVQOiAzOCxcblx0XHRET1dOOiA0MCxcblx0XHRTSElGVDogMTZcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0JChkb2N1bWVudCkub24oJ2tleWRvd24nLCBrZXlQcmVzc2VkKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGtleVByZXNzZWQoZSkge1xuXG5cdFx0aWYgKGUua2V5Q29kZSA9PSBrZXlzLlJJR0hUKSB7XG5cdFx0XHRpZiAoY29sbGlzaW9uRGV0ZWN0aW9uLmNhbkdvUmlnaHQocGllY2UpKSB7XG5cdFx0XHRcdGdvUmlnaHQoKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAoZS5rZXlDb2RlID09IGtleXMuTEVGVCkge1xuXHRcdFx0aWYgKGNvbGxpc2lvbkRldGVjdGlvbi5jYW5Hb0xlZnQocGllY2UpKSB7XG5cdFx0XHRcdGdvTGVmdCgpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmIChlLmtleUNvZGUgPT0ga2V5cy5VUCkge1xuXHRcdFx0aWYgKGNvbGxpc2lvbkRldGVjdGlvbi5jYW5Sb3RhdGUocGllY2UpKSB7XG5cdFx0XHRcdHBpZWNlLnJvdGF0ZSgpO1xuXHRcdFx0IH1cblx0XHR9XG5cdFx0ZWxzZSBpZihlLmtleUNvZGUgPT0ga2V5cy5ET1dOKSB7XG5cdFx0XHRpZiAoY29sbGlzaW9uRGV0ZWN0aW9uLmNhbkdvRG93bihwaWVjZSkpIHtcblx0XHRcdFx0cGllY2UueSsrO1xuXHRcdFx0fVxuXHRcdH0gXG5cdH1cblxuXHRmdW5jdGlvbiBnb0xlZnQoKSB7XG5cdFx0cGllY2UueC0tO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ29SaWdodCgpIHtcblx0XHRwaWVjZS54Kys7XG5cdH1cblxufSIsInZhciBTaGFwZXMgPSByZXF1aXJlKCcuL1NoYXBlcy5qcycpO1xudmFyIHRyYW5zZm9ybSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtLmpzJyk7XG5cbnZhciBQaWVjZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUGllY2Uob3B0aW9ucykge1xuXHR0aGlzLnR5cGUgPSBvcHRpb25zLnR5cGU7XG5cdHRoaXMueCA9IG9wdGlvbnMueCB8fCAwO1xuXHR0aGlzLnkgPSBvcHRpb25zLnkgfHwgMDtcdFxuXHR0aGlzLnNoYXBlID0gU2hhcGVzW3RoaXMudHlwZV0uc2hhcGU7XG5cdHRoaXMucGl2b3RQb2ludCA9IFNoYXBlc1t0aGlzLnR5cGVdLnBpdm90UG9pbnQ7XG5cbn1cblxuUGllY2UucHJvdG90eXBlLnJvdGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnNoYXBlID0gdHJhbnNmb3JtLnJvdGF0ZSh0aGlzKTtcbn1cblxuUGllY2UucHJvdG90eXBlLmxvZ1NoYXBlID0gZnVuY3Rpb24oKSB7XG5cdHZhciBzaGFwZVN0cmluZyA9IFwiXCI7XG5cdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHRoaXMuc2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHRoaXMuc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRzaGFwZVN0cmluZyArPSB0aGlzLnNoYXBlW3Jvd11bY29sXTtcblx0XHR9O1xuXHRcdHNoYXBlU3RyaW5nICs9ICdcXG4nO1xuXHR9O1xuXHRjb25zb2xlLmxvZyhzaGFwZVN0cmluZyk7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFJlbmRlcmVyKG9wdGlvbnMpIHtcblx0dmFyIGJvYXJkID0gb3B0aW9ucy5ib2FyZDtcblx0dmFyIGNvbG9ycyA9IG9wdGlvbnMuY29sb3JzO1xuXHRib2FyZC5oZWlnaHQgPSBib2FyZC5sZW5ndGg7XG5cdGJvYXJkLndpZHRoID0gYm9hcmRbMF0ubGVuZ3RoO1xuXHR2YXIgY29udGV4dDtcblx0dmFyIGNhbnZhcztcblx0dmFyIHNpemU7XG5cdHZhciBzaXplcGFkZGluZyA9IDE7XG5cdHNxdWFyZSA9IHt9O1xuXHRpbml0KCk7XG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdCxcblx0XHRyZW5kZXI6IHJlbmRlcixcblx0XHRmaWxsU3F1YXJlOiBmaWxsU3F1YXJlXG5cdH07XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1jYW52YXMnKTtcblx0XHRjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0Y2FsY3VsYXRlU3F1YXJlU2l6ZSgpO1xuXG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXIocGllY2UpIHtcblx0XHRjbGVhcigpO1xuXHRcdHJlbmRlckJvYXJkKCk7XG5cdFx0cmVuZGVyTW92aW5nUGllY2UocGllY2UpO1xuXHRcdC8vz4ByZW5kZXJHaG9zdFBpZWNlKHBpZWNlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlbmRlckJvYXJkKCkge1xuXHRcdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IGJvYXJkLmxlbmd0aDsgcm93KyspIHtcblx0XHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IGJvYXJkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0XHRpZihib2FyZFtyb3ddW2NvbF0gIT09IDApIHtcblx0XHRcdFx0XHRyZW5kZXJTcXVhcmUoY29sLCByb3csIGJvYXJkW3Jvd11bY29sXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0cmVuZGVyU3F1YXJlKGNvbCwgcm93LCB7XG5cdFx0XHRcdFx0XHRiZzonI2NjYycsXG5cdFx0XHRcdFx0XHRzdHJva2U6ICcjZWVlJ1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXJNb3ZpbmdQaWVjZShwaWVjZSkge1xuXHRcdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHBpZWNlLnNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHBpZWNlLnNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0XHR2YXIgeCA9IChwaWVjZS54ICsgY29sKTtcblx0XHRcdFx0dmFyIHkgPSAocGllY2UueSArIHJvdyk7XG5cdFx0XHRcdGlmKCBwaWVjZS5zaGFwZVtyb3ddW2NvbF0gIT09IDAgKSB7XG5cdFx0XHRcdFx0cmVuZGVyU3F1YXJlKHgsIHksIHtiZzogY29sb3JzW3BpZWNlLnR5cGVdfSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHR9O1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXJHaG9zdFBpZWNlKHBpZWNlKSB7XG5cdFx0Y29udGV4dC5yZWN0KHBpZWNlLngsIGNhbnZhcy5oZWlnaHQgLSBzcXVhcmUuaGVpZ2h0LCBzcXVhcmUud2lkdGgsIHNxdWFyZS5oZWlnaHQpO1xuXHRcdGNvbnRleHQuc3Ryb2tlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXJTcXVhcmUoaSwgaiwgY29sb3IpIHtcblx0XHRmaWxsU3F1YXJlKHNxdWFyZS53aWR0aCAqIGksIHNxdWFyZS5oZWlnaHQgKiBqLCBjb2xvcik7XG5cdH1cblxuXHRmdW5jdGlvbiBmaWxsU3F1YXJlKHgsIHksIGNvbG9yKSB7XG5cdFx0dmFyIHN0cm9rZSA9IHRydWU7XG5cdFx0dmFyIHN0cm9rZUNvbG9yID0gY29sb3Iuc3Ryb2tlIHx8ICcjMzMzJztcblxuXHRcdGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3IuYmc7XG5cdFx0Y29udGV4dC5maWxsUmVjdCh4KnNpemVwYWRkaW5nLCB5KnNpemVwYWRkaW5nLCBzcXVhcmUud2lkdGgsIHNxdWFyZS5oZWlnaHQpO1xuXHRcdFxuXHRcdGlmKHN0cm9rZSkge1xuXHRcdFx0dmFyIHN0cm9rZVRoaWNrbmVzcyA9IDEuNTtcblx0XHRcdGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBzdHJva2VDb2xvcjtcblx0XHRcdGNvbnRleHQubGluZVdpZHRoID0gc3Ryb2tlVGhpY2tuZXNzO1xuXHRcdFx0Y29udGV4dC5zdHJva2VSZWN0KHggKyBzdHJva2VUaGlja25lc3MgKiAwLjUsIHkgKyBzdHJva2VUaGlja25lc3MgKiAwLjUsIHNxdWFyZS53aWR0aCAtIHN0cm9rZVRoaWNrbmVzcywgc3F1YXJlLmhlaWdodCAtIHN0cm9rZVRoaWNrbmVzcyk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gY2FsY3VsYXRlU3F1YXJlU2l6ZSgpIHtcblx0XHRzcXVhcmUud2lkdGggPSBjYW52YXMud2lkdGggLyBib2FyZC53aWR0aDtcblx0XHRzcXVhcmUuaGVpZ2h0ID0gY2FudmFzLmhlaWdodCAvIGJvYXJkLmhlaWdodDtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2xlYXIoKSB7XG5cdFx0Y29udGV4dC5iZWdpblBhdGgoKTtcblx0XHRjb250ZXh0LmNsZWFyUmVjdCAoIDAgLCAwICwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0ICk7XG5cdH1cbn0iLCJ2YXIgU2hhcGVzID0gbW9kdWxlLmV4cG9ydHMgPSB7XG5cdCdJJzoge30sXG5cdCdKJzoge1xuXHRcdHNoYXBlOiBbIFswLCAwLCAwXSwgWzEsIDEsIDFdLCBbMCwgMCwgMV0gXSxcblx0XHRwaXZvdFBvaW50OiB7eDogMSwgeTogMX1cblx0fSxcblx0J0wnOiB7XG5cdFx0c2hhcGU6IFsgWzAsIDAsIDBdLCBbMSwgMSwgMV0sIFsxLCAwLCAwXSBdLFxuXHRcdHBpdm90UG9pbnQ6IHt4OiAxLCB5OiAxfVxuXHR9LFxuXHQnTyc6IHtcblx0XHRzaGFwZTogWyBbMSwgMV0sIFsxLCAxXSBdLFxuXHRcdHBpdm90UG9pbnQ6IHt4OiAwLCB5OiAwfVxuXHR9LFxuXHQnUyc6IHtcblx0XHRzaGFwZTogWyBbMCwgMSwgMV0sIFsxLCAxLCAwXSwgWzAsIDAsIDBdIF0sXG5cdFx0cGl2b3RQb2ludDoge3g6IDEsIHk6IDF9XG5cdH0sXG5cdCdUJzoge1xuXHRcdHNoYXBlOiBbIFswLCAxLCAwXSwgWzEsIDEsIDFdLCBbMCwgMCwgMF0gXSxcblx0XHRwaXZvdFBvaW50OiB7eDogMSwgeTogMX1cblx0fSxcblx0J1onOiB7XG5cdFx0c2hhcGU6IFsgWzEsIDEsIDBdLCBbMCwgMSwgMV0sIFswLCAwLCAwXSBdLFxuXHRcdHBpdm90UG9pbnQ6IHt4OiAxLCB5OiAxfVxuXHR9XG59O1xuIiwidmFyIFRyYW5zZm9ybSA9IG1vZHVsZS5leHBvcnRzID0ge1xuXHRyb3RhdGU6IHJvdGF0ZVxufTtcblxuXHR2YXIgdGV0cm9taW5vO1xuXG5cdGZ1bmN0aW9uIHJvdGF0ZShteVBpZWNlKSB7XG5cdFx0aWYobXlQaWVjZS50eXBlID09ICdPJykgcmV0dXJuO1xuXG5cdFx0dGV0cm9taW5vID0gbXlQaWVjZTtcblx0XHR2YXIgcGl2b3RQb2ludCA9IHRldHJvbWluby5waXZvdFBvaW50O1xuXG5cdFx0dmFyIHBvaW50cyA9IGNvbnZlcnRTaGFwZVRvUG9pbnRzKHRldHJvbWluby5zaGFwZSk7XG5cdFx0cG9pbnRzID0gdHJhbnNsYXRlUG9pbnRzQnlEaXN0YW5jZShwb2ludHMsIHt4OiAtcGl2b3RQb2ludC54LCB5OiAtcGl2b3RQb2ludC55fSlcblx0XHRwb2ludHMgPSByb3RhdGVQb2ludHMocG9pbnRzKTtcblx0XHRwb2ludHMgPSB0cmFuc2xhdGVQb2ludHNCeURpc3RhbmNlKHBvaW50cywge3g6IHBpdm90UG9pbnQueCwgeTogcGl2b3RQb2ludC55fSk7XG5cdFx0dmFyIGZpbmFsU2hhcGUgPSBjb252ZXJ0UG9pbnRzVG9TaGFwZShwb2ludHMpO1xuXHRcdHBvaW50cyA9IFtdO1xuXG5cdFx0cmV0dXJuIGZpbmFsU2hhcGU7XG5cdH1cblx0ZnVuY3Rpb24gY29udmVydFNoYXBlVG9Qb2ludHMoc2hhcGUpIHtcblx0XHR2YXIgcG9pbnRzID0gW107XG5cdFx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgc2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRcdHZhciBwb2ludCA9IHtcblx0XHRcdFx0XHR4OiBjb2wsIFxuXHRcdFx0XHRcdHk6IHJvdyxcblx0XHRcdFx0XHR2YWx1ZTogc2hhcGVbcm93XVtjb2xdXG5cdFx0XHRcdH1cblx0XHRcdFx0cG9pbnRzLnB1c2gocG9pbnQpO1xuXHRcdFx0fTtcblx0XHR9O1xuXHRcdHJldHVybiBwb2ludHM7XG5cdH1cblxuXHRmdW5jdGlvbiB0cmFuc2xhdGVQb2ludHNCeURpc3RhbmNlKHBvaW50cywgZGlzdGFuY2UpIHtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0cG9pbnRzW2ldLnggPSBwb2ludHNbaV0ueCArIGRpc3RhbmNlLng7XG5cdFx0XHRwb2ludHNbaV0ueSA9IHBvaW50c1tpXS55ICsgZGlzdGFuY2UueTtcblx0XHR9O1xuXHRcdHJldHVybiBwb2ludHM7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3ZlVG9QaXZvdFBvaW50KCkge1xuXHRcdHZhciBzaGFwZSA9IHRldHJvbWluby5zaGFwZTtcblx0XHR2YXIgcGl2b3RQb2ludCA9IHRldHJvbWluby5waXZvdFBvaW50O1xuXHRcdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0XHR2YXIgbW92ZWRYID0gY29sIC0gcGl2b3RQb2ludC54O1xuXHRcdFx0XHR2YXIgbW92ZWRZID0gcm93IC0gcGl2b3RQb2ludC55O1xuXHRcdFx0XHR2YXIgcG9pbnQgPSB7XG5cdFx0XHRcdFx0eDogbW92ZWRYLCBcblx0XHRcdFx0XHR5OiBtb3ZlZFksXG5cdFx0XHRcdFx0dmFsdWU6IHNoYXBlW3Jvd11bY29sXVxuXHRcdFx0XHR9XG5cdFx0XHRcdHBvaW50cy5wdXNoKHBvaW50KTtcblx0XHRcdH07XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJvdGF0ZVBvaW50cyhwb2ludHMpIHtcblx0XHQvL3ZhciByb3QgPSBbWzAsIDFdLCBbLTEsIDBdXTsgLy8gOTAgZGVnIENvdW50ZXJDbG9ja3dpc2Vcblx0XHR2YXIgcm90ID0gW1swLCAtMV0sIFsxLCAwXV07IC8vIDkwIGRlZyBDbG9ja3dpc2Vcblx0XHR2YXIgdGVtcCA9IHt9O1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciB4ID0gcG9pbnRzW2ldLng7XG5cdFx0XHR2YXIgeSA9IHBvaW50c1tpXS55O1xuXHRcdFx0dGVtcC54ID0geCAqIHJvdFswXVswXSArIHkgKiByb3RbMF1bMV07XG5cdFx0XHR0ZW1wLnkgPSB4ICogcm90WzFdWzBdICsgeSAqIHJvdFsxXVsxXTtcblx0XHRcdHBvaW50c1tpXS54ID0gdGVtcC54O1xuXHRcdFx0cG9pbnRzW2ldLnkgPSB0ZW1wLnk7XG5cdFx0fTtcblx0XHRyZXR1cm4gcG9pbnRzO1xuXHR9XG5cblx0ZnVuY3Rpb24gY29udmVydFBvaW50c1RvU2hhcGUocG9pbnRzKSB7XG5cdFx0dmFyIHRlbXBTaGFwZSA9IGNvcHlTaGFwZSh0ZXRyb21pbm8uc2hhcGUpXG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGNvbCA9IHBvaW50c1tpXS54O1xuXHRcdFx0dmFyIHJvdyA9IHBvaW50c1tpXS55O1xuXHRcdFx0dGVtcFNoYXBlW3Jvd11bY29sXSA9IHBvaW50c1tpXS52YWx1ZTtcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHRlbXBTaGFwZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNvcHlTaGFwZShzb21lU2hhcGUpIHtcblx0XHR2YXIgbmV3QXJyYXkgPSBbXTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNvbWVTaGFwZS5sZW5ndGg7IGkrKykge1xuXHQgICAgXHRuZXdBcnJheVtpXSA9IHNvbWVTaGFwZVtpXS5zbGljZSgpO1xuXHRcdH1cblx0XHRyZXR1cm4gbmV3QXJyYXk7XG5cdH1cbiIsInZhciBCb2FyZCA9IHJlcXVpcmUoJy4vQm9hcmQuanMnKTtcbnZhciBQaWVjZSA9IHJlcXVpcmUoJy4vUGllY2UuanMnKTtcbnZhciBDb2xvcnMgPSByZXF1aXJlKCcuL0NvbG9ycy5qcycpO1xudmFyIHRyYW5zZm9ybSA9IHJlcXVpcmUoJy4vVHJhbnNmb3JtLmpzJyk7XG52YXIgQ29sbGlzaW9uRGV0ZWN0aW9uID0gcmVxdWlyZSgnLi9Db2xsaXNpb25EZXRlY3Rpb24uanMnKTtcbnZhciBDb250cm9scyA9IHJlcXVpcmUoJy4vQ29udHJvbHMuanMnKTtcbnZhciBSZW5kZXJlciA9IHJlcXVpcmUoJy4vUmVuZGVyZXIuanMnKTtcblxudmFyIGNvbG9ycyA9IENvbG9ycygpO1xudmFyIGJvYXJkID0gQm9hcmQoKTtcbnZhciBwaWVjZSA9IG5ldyBQaWVjZSh7dHlwZTogJ0wnfSk7XG52YXIgY29sbGlzaW9uRGV0ZWN0aW9uID0gQ29sbGlzaW9uRGV0ZWN0aW9uKHtcblx0Ym9hcmQ6IGJvYXJkXG59KTtcblxudmFyIHJlbmRlcmVyID0gUmVuZGVyZXIoe2JvYXJkOiBib2FyZCwgY29sb3JzOiBjb2xvcnN9KTtcbnZhciBjb250cm9scyA9IENvbnRyb2xzKHtcblx0cGllY2U6IHBpZWNlLFxuXHRjb2xsaXNpb25EZXRlY3Rpb246Y29sbGlzaW9uRGV0ZWN0aW9uXG59KTtcbmNvbnRyb2xzLmluaXQoKTtcblxuXG5zZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcblx0aWYocGllY2UueSA+IGJvYXJkLmhlaWdodCkge1xuXHRcdHBpZWNlID0gZ2VuZXJhdGVSYW5kb21QaWVjZSgpO1xuXHR9XG5cblx0dmFyIGNhbk1vdmVEb3duID0gY29sbGlzaW9uRGV0ZWN0aW9uLmNhbkdvRG93bihwaWVjZSk7XG5cdGlmIChjYW5Nb3ZlRG93bikge1xuXHRcdC8vcGllY2UueSsrO1xuXHRcdC8vc3RpY2hQaWVjZVRvQm9hcmQ7XG5cdH1cbn0sIDUwMCk7XG5cblxudmFyIHJlbmRlclRva2VuID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG5cdHJlbmRlcmVyLnJlbmRlcihwaWVjZSk7XG59LCA1MCk7XG5cblxuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21QaWVjZSAoKSB7XG5cdHZhciBibG9ja3MgPSBbJ0onLCAnTCcsICdPJywgJ1MnLCAnVCcsICdaJ107XG5cdHZhciByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBibG9ja3MubGVuZ3RoKTtcblx0cmV0dXJuIFBpZWNlKHt0eXBlOiBibG9ja3NbcmFuZG9tXX0pO1xufSJdfQ==
