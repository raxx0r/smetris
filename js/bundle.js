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
		[0,0,0,0,0,0,0,2,3,0],
		[0,0,0,0,1,0,0,1,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,5,5,3,2,0,0],
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
				var hitRestingPieces = ( (board[y][x] !== 0) && (piece.shape[row][col] !== 0) );
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
				var hitRestingPieces = ( (board[y][x] !== 0) && (piece.shape[row][col] !== 0) );
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

				var hit = ( (board[y][x] !== 0) && (piece.shape[row][col] !== 0) );
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
		logShape(shape);
		logPartOfBoard(copy);

		for (var row = 0; row < shape.length; row++) {
			for (var col = 0; col < shape[row].length; col++) {
				 if (shape[row][col] !== 0) {
					var x = (copy.x + col);
					var y = (copy.y + row);
				 	
				 	var hitRestingPieces = (board[y][x] !== 0 );
				 	console.log('hit', hitRestingPieces)
					if (hitRestingPieces) {
						return false;
					}
				 }
				//var hitRestingPieces = ( (board[y][x] !== 0) && (shape[col][row] !== 0) );

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
},{"./keys.js":10}],5:[function(require,module,exports){
var Shapes = require('./Shapes.js');
var transform = require('./transform.js');

var Piece = module.exports = function Piece(options) {
	this.type = options.type;
	this.x = options.x || 0;
	this.y = options.y || 0;	
	this.shape = options.shape || Shapes[this.type].shape;
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
					var strokeColor = colorLuminance(bg, -0.1);
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
						stroke: false
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
},{"./Board.js":1,"./CollisionDetection.js":2,"./Colors.js":3,"./Controls.js":4,"./Piece.js":5,"./Renderer.js":6,"./Transform.js":8}],12:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8}]},{},[11])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzcvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwianMvQm9hcmQuanMiLCJqcy9Db2xsaXNpb25EZXRlY3Rpb24uanMiLCJqcy9Db2xvcnMuanMiLCJqcy9Db250cm9scy5qcyIsImpzL1BpZWNlLmpzIiwianMvUmVuZGVyZXIuanMiLCJqcy9TaGFwZXMuanMiLCJqcy9UcmFuc2Zvcm0uanMiLCJqcy9oZWxwZXJzLmpzIiwianMva2V5cy5qcyIsImpzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cblx0dmFyIGJvYXJkID0gW1xuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFsxLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMSwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzEsMCwwLDAsMCwwLDAsMCwxLDFdLFxuXHRcdFsxLDAsMCwwLDAsMCwwLDAsMSwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwyLDMsMF0sXG5cdFx0WzAsMCwwLDAsMSwwLDAsMSwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCw1LDUsMywyLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFsxLDEsMSwxLDAsMCwwLDAsMCwwXSxcblx0XTtcblxuXHRib2FyZC5oZWlnaHQgPSBib2FyZC5sZW5ndGg7XG5cdGJvYXJkLndpZHRoID0gYm9hcmRbMF0ubGVuZ3RoO1xuXG5cdHJldHVybiBib2FyZDtcbn1cblxuIiwidmFyIFBpZWNlID0gcmVxdWlyZSgnLi9QaWVjZS5qcycpO1xudmFyIHRyYW5zZm9ybSA9IHJlcXVpcmUoJy4vVHJhbnNmb3JtLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gQ29sbGlzaW9uRGV0ZWN0aW9uKGNyZWF0ZU9wdGlvbnMpe1xuXHR2YXIgYm9hcmQgPSBjcmVhdGVPcHRpb25zLmJvYXJkO1xuXHRyZXR1cm4ge1xuXHRcdGNhbkdvTGVmdDogY2FuR29MZWZ0LFxuXHRcdGNhbkdvUmlnaHQ6IGNhbkdvUmlnaHQsXG5cdFx0Y2FuR29Eb3duOiBjYW5Hb0Rvd24sXG5cdFx0Y2FuUm90YXRlOiBjYW5Sb3RhdGVcblx0fTtcblxuXHRmdW5jdGlvbiBjYW5Hb0xlZnQocGllY2UpIHtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBwaWVjZS5zaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBwaWVjZS5zaGFwZVtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdFx0dmFyIHggPSBwaWVjZS54ICsgY29sIC0gMTtcblx0XHRcdFx0dmFyIHkgPSBwaWVjZS55ICsgcm93O1xuXHRcdFx0XHR2YXIgaXNJbnNpZGUgPSB4ICogcGllY2Uuc2hhcGVbcm93XVtjb2xdID49IDA7XG5cdFx0XHRcdHZhciBoaXRSZXN0aW5nUGllY2VzID0gKCAoYm9hcmRbeV1beF0gIT09IDApICYmIChwaWVjZS5zaGFwZVtyb3ddW2NvbF0gIT09IDApICk7XG5cdFx0XHRcdGlmKGhpdFJlc3RpbmdQaWVjZXMgfHwgIWlzSW5zaWRlKSByZXR1cm4gZmFsc2U7XG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIGNhbkdvUmlnaHQocGllY2UpIHtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBwaWVjZS5zaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBwaWVjZS5zaGFwZVtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdFx0dmFyIHggPSBwaWVjZS54ICsgY29sICsgMTtcblx0XHRcdFx0dmFyIHkgPSBwaWVjZS55ICsgcm93O1xuXHRcdFx0XHR2YXIgaXNJbnNpZGUgPSB4ICogcGllY2Uuc2hhcGVbcm93XVtjb2xdIDwgYm9hcmQud2lkdGg7XG5cdFx0XHRcdHZhciBoaXRSZXN0aW5nUGllY2VzID0gKCAoYm9hcmRbeV1beF0gIT09IDApICYmIChwaWVjZS5zaGFwZVtyb3ddW2NvbF0gIT09IDApICk7XG5cdFx0XHRcdGlmKGhpdFJlc3RpbmdQaWVjZXMgfHwgIWlzSW5zaWRlKSByZXR1cm4gZmFsc2U7XG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRmdW5jdGlvbiBjYW5Hb0Rvd24ocGllY2UpIHtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBwaWVjZS5zaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBwaWVjZS5zaGFwZVtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdFx0dmFyIHggPSAocGllY2UueCArIGNvbCk7XG5cdFx0XHRcdHZhciB5ID0gKHBpZWNlLnkgKyAxICsgcm93KTtcblxuXHRcdFx0XHR2YXIgaGl0ID0gKCAoYm9hcmRbeV1beF0gIT09IDApICYmIChwaWVjZS5zaGFwZVtyb3ddW2NvbF0gIT09IDApICk7XG5cdFx0XHRcdGlmKGhpdCkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9O1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2FuUm90YXRlKHBpZWNlKSB7XG5cblx0XHR2YXIgY29weSA9IG5ldyBQaWVjZShwaWVjZSk7XG5cdFx0Y29weS5yb3RhdGUoKTtcblx0XHR2YXIgc2hhcGUgPSBjb3B5LnNoYXBlO1xuXHRcdGxvZ1NoYXBlKHNoYXBlKTtcblx0XHRsb2dQYXJ0T2ZCb2FyZChjb3B5KTtcblxuXHRcdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0XHQgaWYgKHNoYXBlW3Jvd11bY29sXSAhPT0gMCkge1xuXHRcdFx0XHRcdHZhciB4ID0gKGNvcHkueCArIGNvbCk7XG5cdFx0XHRcdFx0dmFyIHkgPSAoY29weS55ICsgcm93KTtcblx0XHRcdFx0IFx0XG5cdFx0XHRcdCBcdHZhciBoaXRSZXN0aW5nUGllY2VzID0gKGJvYXJkW3ldW3hdICE9PSAwICk7XG5cdFx0XHRcdCBcdGNvbnNvbGUubG9nKCdoaXQnLCBoaXRSZXN0aW5nUGllY2VzKVxuXHRcdFx0XHRcdGlmIChoaXRSZXN0aW5nUGllY2VzKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQgfVxuXHRcdFx0XHQvL3ZhciBoaXRSZXN0aW5nUGllY2VzID0gKCAoYm9hcmRbeV1beF0gIT09IDApICYmIChzaGFwZVtjb2xdW3Jvd10gIT09IDApICk7XG5cblx0XHRcdH07XG5cdFx0fTtcdFxuXHRcdHJldHVybiB0cnVlO1x0XG5cdH1cblx0ZnVuY3Rpb24gbG9nU2hhcGUoc2hhcGUpIHtcblx0XHR2YXIgc2hhcGVTdHJpbmcgPSBcIlwiO1xuXHRcdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0XHRzaGFwZVN0cmluZyArPSBzaGFwZVtyb3ddW2NvbF07XG5cdFx0XHR9O1xuXHRcdFx0c2hhcGVTdHJpbmcgKz0gJ1xcbic7XG5cdFx0fTtcblx0XHRjb25zb2xlLmxvZyhzaGFwZVN0cmluZyk7XG5cdH1cblxuXHRmdW5jdGlvbiBsb2dQYXJ0T2ZCb2FyZChjb3B5KSB7XG5cdFx0dmFyIGJvYXJkU3RyaW5nID0gXCJcIjtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCAzOyByb3crKykge1xuXHRcdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgMzsgY29sKyspIHtcblx0XHRcdFx0dmFyIHggPSAoY29weS54ICsgY29sKTtcblx0XHRcdFx0dmFyIHkgPSAoY29weS55ICsgcm93KTtcblx0XHRcdFx0Ym9hcmRTdHJpbmcgKz0gYm9hcmRbeV1beF07XG5cdFx0XHR9O1xuXHRcdFx0Ym9hcmRTdHJpbmcgKz0gJ1xcbic7XG5cdFx0fTtcblx0XHRjb25zb2xlLmxvZyhib2FyZFN0cmluZyk7XG5cdH1cblxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gQ29sb3JzKCkge1xuXHRyZXR1cm4ge1xuXHRcdCdJJzogJyMyN0RFRkYnLCAvL2xqdXNibMOlXG5cdFx0J0onOiAnIzNDNjZGRicsIC8vYmzDpVxuXHRcdCdMJzogJyNFODc0MEMnLCAvL29yYW5nZVxuXHRcdCdPJzogJyNGRkQ3MEQnLCAvL2d1bFxuXHRcdCdTJzogJyMyNkZGMDAnLCAvL2dyw7ZuXG5cdFx0J1QnOiAnIzlFMENFOCcsIC8vbGlsYVxuXHRcdCdaJzogJyNGRjAwMDAnICAvL3LDtmRcblx0fVxufSIsInZhciBrZXlzID0gcmVxdWlyZSgnLi9rZXlzLmpzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIENvbnRyb2xzKGNyZWF0ZU9wdGlvbnMpIHtcblx0dmFyIHBpZWNlID0gY3JlYXRlT3B0aW9ucy5waWVjZTtcblx0dmFyIGNvbGxpc2lvbkRldGVjdGlvbiA9IGNyZWF0ZU9wdGlvbnMuY29sbGlzaW9uRGV0ZWN0aW9uO1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHQkKGRvY3VtZW50KS5vbigna2V5ZG93bicsIGtleVByZXNzZWQpO1xuXHR9XG5cblx0ZnVuY3Rpb24ga2V5UHJlc3NlZChlKSB7XG5cblx0XHRpZiAoZS5rZXlDb2RlID09IGtleXMuUklHSFQpIHtcblx0XHRcdGlmIChjb2xsaXNpb25EZXRlY3Rpb24uY2FuR29SaWdodChwaWVjZSkpIHtcblx0XHRcdFx0Z29SaWdodCgpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmIChlLmtleUNvZGUgPT0ga2V5cy5MRUZUKSB7XG5cdFx0XHRpZiAoY29sbGlzaW9uRGV0ZWN0aW9uLmNhbkdvTGVmdChwaWVjZSkpIHtcblx0XHRcdFx0Z29MZWZ0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGUua2V5Q29kZSA9PSBrZXlzLlVQKSB7XG5cdFx0XHRpZiAoY29sbGlzaW9uRGV0ZWN0aW9uLmNhblJvdGF0ZShwaWVjZSkpIHtcblx0XHRcdFx0cGllY2Uucm90YXRlKCk7XG5cdFx0XHQgfVxuXHRcdH1cblx0XHRlbHNlIGlmKGUua2V5Q29kZSA9PSBrZXlzLkRPV04pIHtcblx0XHRcdGlmIChjb2xsaXNpb25EZXRlY3Rpb24uY2FuR29Eb3duKHBpZWNlKSkge1xuXHRcdFx0XHRwaWVjZS55Kys7XG5cdFx0XHR9XG5cdFx0fSBcblx0fVxuXG5cdGZ1bmN0aW9uIGdvTGVmdCgpIHtcblx0XHRwaWVjZS54LS07XG5cdH1cblxuXHRmdW5jdGlvbiBnb1JpZ2h0KCkge1xuXHRcdHBpZWNlLngrKztcblx0fVxuXG59IiwidmFyIFNoYXBlcyA9IHJlcXVpcmUoJy4vU2hhcGVzLmpzJyk7XG52YXIgdHJhbnNmb3JtID0gcmVxdWlyZSgnLi90cmFuc2Zvcm0uanMnKTtcblxudmFyIFBpZWNlID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBQaWVjZShvcHRpb25zKSB7XG5cdHRoaXMudHlwZSA9IG9wdGlvbnMudHlwZTtcblx0dGhpcy54ID0gb3B0aW9ucy54IHx8IDA7XG5cdHRoaXMueSA9IG9wdGlvbnMueSB8fCAwO1x0XG5cdHRoaXMuc2hhcGUgPSBvcHRpb25zLnNoYXBlIHx8IFNoYXBlc1t0aGlzLnR5cGVdLnNoYXBlO1xuXHR0aGlzLnBpdm90UG9pbnQgPSBTaGFwZXNbdGhpcy50eXBlXS5waXZvdFBvaW50O1xuXG59XG5cblBpZWNlLnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5zaGFwZSA9IHRyYW5zZm9ybS5yb3RhdGUodGhpcyk7XG59XG5cblBpZWNlLnByb3RvdHlwZS5sb2dTaGFwZSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgc2hhcGVTdHJpbmcgPSBcIlwiO1xuXHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCB0aGlzLnNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCB0aGlzLnNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0c2hhcGVTdHJpbmcgKz0gdGhpcy5zaGFwZVtyb3ddW2NvbF07XG5cdFx0fTtcblx0XHRzaGFwZVN0cmluZyArPSAnXFxuJztcblx0fTtcblx0Y29uc29sZS5sb2coc2hhcGVTdHJpbmcpO1xufVxuIiwidmFyIGNvbG9yTHVtaW5hbmNlID0gcmVxdWlyZSgnLi9oZWxwZXJzLmpzJykuY29sb3JMdW1pbmFuY2U7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBSZW5kZXJlcihvcHRpb25zKSB7XG5cdHZhciBib2FyZCA9IG9wdGlvbnMuYm9hcmQ7XG5cdHZhciBjb2xvcnMgPSBvcHRpb25zLmNvbG9ycztcblx0dmFyIGNvbG9ySW5kZXhlcyA9IFsnSicsICdMJywgJ08nLCAnUycsICdUJywgJ1onXTtcblx0Ym9hcmQuaGVpZ2h0ID0gYm9hcmQubGVuZ3RoO1xuXHRib2FyZC53aWR0aCA9IGJvYXJkWzBdLmxlbmd0aDtcblx0dmFyIGNvbnRleHQ7XG5cdHZhciBjYW52YXM7XG5cdHZhciBzaXplO1xuXHR2YXIgc2l6ZXBhZGRpbmcgPSAxO1xuXHRzcXVhcmUgPSB7fTtcblx0aW5pdCgpO1xuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXQsXG5cdFx0cmVuZGVyOiByZW5kZXIsXG5cdFx0ZmlsbFNxdWFyZTogZmlsbFNxdWFyZVxuXHR9O1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0Y2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtY2FudmFzJyk7XG5cdFx0Y29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdGNhbGN1bGF0ZVNxdWFyZVNpemUoKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gcmVuZGVyKHBpZWNlKSB7XG5cdFx0Y2xlYXIoKTtcblx0XHRyZW5kZXJCb2FyZCgpO1xuXHRcdHJlbmRlck1vdmluZ1BpZWNlKHBpZWNlKTtcblx0XHQvL8+AcmVuZGVyR2hvc3RQaWVjZShwaWVjZSk7XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXJCb2FyZCgpIHtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBib2FyZC5sZW5ndGg7IHJvdysrKSB7XG5cdFx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBib2FyZFtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdFx0aWYoYm9hcmRbcm93XVtjb2xdICE9PSAwKSB7XG5cdFx0XHRcdFx0dmFyIGJsb2NrVHlwZSA9IGNvbG9ySW5kZXhlcyBbIGJvYXJkW3Jvd11bY29sXSBdO1xuXHRcdFx0XHRcdHZhciBiZyA9IGNvbG9yc1tibG9ja1R5cGVdO1xuXHRcdFx0XHRcdHZhciBzdHJva2VDb2xvciA9IGNvbG9yTHVtaW5hbmNlKGJnLCAtMC4xKTtcblx0XHRcdFx0XHR2YXIgc3Ryb2tlVGhpY2tuZXNzID0gMi41O1xuXHRcdFx0XHRcdHJlbmRlclNxdWFyZShjb2wsIHJvdywge1xuXHRcdFx0XHRcdFx0Ymc6IGJnLCBcblx0XHRcdFx0XHRcdHN0cm9rZUNvbG9yOiBzdHJva2VDb2xvcixcblx0XHRcdFx0XHRcdHN0cm9rZVRoaWNrbmVzczogc3Ryb2tlVGhpY2tuZXNzXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dmFyIGJnID0gJyNlZWUnO1xuXHRcdFx0XHRcdHZhciBiZzIgPSAnI2ZmZic7XG5cdFx0XHRcdFx0aWYoIChyb3crY29sKSAlIDIgPT0gMCApe1xuXHRcdFx0XHRcdFx0YmcgPSBiZzI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRiZyA9IGJnO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZW5kZXJTcXVhcmUoY29sLCByb3csIHtcblx0XHRcdFx0XHRcdGJnOiBiZyxcblx0XHRcdFx0XHRcdHN0cm9rZTogZmFsc2Vcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVuZGVyTW92aW5nUGllY2UocGllY2UpIHtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBwaWVjZS5zaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBwaWVjZS5zaGFwZVtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdFx0dmFyIHggPSAocGllY2UueCArIGNvbCk7XG5cdFx0XHRcdHZhciB5ID0gKHBpZWNlLnkgKyByb3cpO1xuXHRcdFx0XHR2YXIgYmcgPSBjb2xvcnNbcGllY2UudHlwZV07XG5cdFx0XHRcdHZhciBzdHJva2VDb2xvciA9IGNvbG9yTHVtaW5hbmNlKGJnLCAtMC4xKTtcblx0XHRcdFx0aWYoIHBpZWNlLnNoYXBlW3Jvd11bY29sXSAhPT0gMCApIHtcblx0XHRcdFx0XHRyZW5kZXJTcXVhcmUoeCwgeSwge1xuXHRcdFx0XHRcdFx0Ymc6IGJnLFxuXHRcdFx0XHRcdFx0c3Ryb2tlQ29sb3I6IHN0cm9rZUNvbG9yXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHR9O1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXJHaG9zdFBpZWNlKHBpZWNlKSB7XG5cdFx0Y29udGV4dC5yZWN0KHBpZWNlLngsIGNhbnZhcy5oZWlnaHQgLSBzcXVhcmUuaGVpZ2h0LCBzcXVhcmUud2lkdGgsIHNxdWFyZS5oZWlnaHQpO1xuXHRcdGNvbnRleHQuc3Ryb2tlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXJTcXVhcmUoaSwgaiwgb3B0aW9ucykge1xuXHRcdGZpbGxTcXVhcmUoc3F1YXJlLndpZHRoICogaSwgc3F1YXJlLmhlaWdodCAqIGosIG9wdGlvbnMpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZmlsbFNxdWFyZSh4LCB5LCBvcHRpb25zKSB7XG5cdFx0dmFyIHN0cm9rZSA9ICgob3B0aW9ucy5zdHJva2UgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnN0cm9rZSA6IHRydWUpO1xuXHRcdHZhciBzdHJva2VDb2xvciA9IG9wdGlvbnMuc3Ryb2tlQ29sb3IgfHwgJyNjY2MnO1xuXHRcdHZhciBzdHJva2VUaGlja25lc3MgPSBvcHRpb25zLnN0cm9rZVRoaWNrbmVzcyB8fCAyLjU7XG5cblx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IG9wdGlvbnMuYmc7XG5cdFx0Y29udGV4dC5maWxsUmVjdCh4KnNpemVwYWRkaW5nLCB5KnNpemVwYWRkaW5nLCBzcXVhcmUud2lkdGgsIHNxdWFyZS5oZWlnaHQpO1xuXHRcdFxuXHRcdGlmKHN0cm9rZSkge1xuXHRcdFx0Y29udGV4dC5zdHJva2VTdHlsZSA9IHN0cm9rZUNvbG9yO1xuXHRcdFx0Y29udGV4dC5saW5lV2lkdGggPSBzdHJva2VUaGlja25lc3M7XG5cdFx0XHRjb250ZXh0LnN0cm9rZVJlY3QoeCArIHN0cm9rZVRoaWNrbmVzcyAqIDAuNSwgeSArIHN0cm9rZVRoaWNrbmVzcyAqIDAuNSwgc3F1YXJlLndpZHRoIC0gc3Ryb2tlVGhpY2tuZXNzLCBzcXVhcmUuaGVpZ2h0IC0gc3Ryb2tlVGhpY2tuZXNzKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBjYWxjdWxhdGVTcXVhcmVTaXplKCkge1xuXHRcdHNxdWFyZS53aWR0aCA9IGNhbnZhcy53aWR0aCAvIGJvYXJkLndpZHRoO1xuXHRcdHNxdWFyZS5oZWlnaHQgPSBjYW52YXMuaGVpZ2h0IC8gYm9hcmQuaGVpZ2h0O1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjbGVhcigpIHtcblx0XHRjb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRcdGNvbnRleHQuY2xlYXJSZWN0ICggMCAsIDAgLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQgKTtcblx0fVxufSIsInZhciBTaGFwZXMgPSBtb2R1bGUuZXhwb3J0cyA9IHtcblx0J0knOiB7fSxcblx0J0onOiB7XG5cdFx0c2hhcGU6IFsgWzAsIDAsIDBdLCBbMSwgMSwgMV0sIFswLCAwLCAxXSBdLFxuXHRcdHBpdm90UG9pbnQ6IHt4OiAxLCB5OiAxfVxuXHR9LFxuXHQnTCc6IHtcblx0XHRzaGFwZTogWyBbMCwgMCwgMF0sIFsxLCAxLCAxXSwgWzEsIDAsIDBdIF0sXG5cdFx0cGl2b3RQb2ludDoge3g6IDEsIHk6IDF9XG5cdH0sXG5cdCdPJzoge1xuXHRcdHNoYXBlOiBbIFsxLCAxXSwgWzEsIDFdIF0sXG5cdFx0cGl2b3RQb2ludDoge3g6IDAsIHk6IDB9XG5cdH0sXG5cdCdTJzoge1xuXHRcdHNoYXBlOiBbIFswLCAxLCAxXSwgWzEsIDEsIDBdLCBbMCwgMCwgMF0gXSxcblx0XHRwaXZvdFBvaW50OiB7eDogMSwgeTogMX1cblx0fSxcblx0J1QnOiB7XG5cdFx0c2hhcGU6IFsgWzAsIDEsIDBdLCBbMSwgMSwgMV0sIFswLCAwLCAwXSBdLFxuXHRcdHBpdm90UG9pbnQ6IHt4OiAxLCB5OiAxfVxuXHR9LFxuXHQnWic6IHtcblx0XHRzaGFwZTogWyBbMSwgMSwgMF0sIFswLCAxLCAxXSwgWzAsIDAsIDBdIF0sXG5cdFx0cGl2b3RQb2ludDoge3g6IDEsIHk6IDF9XG5cdH1cbn07XG4iLCJ2YXIgVHJhbnNmb3JtID0gbW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJvdGF0ZTogcm90YXRlXG59O1xuXG5cdHZhciB0ZXRyb21pbm87XG5cblx0ZnVuY3Rpb24gcm90YXRlKG15UGllY2UpIHtcblx0XHRpZihteVBpZWNlLnR5cGUgPT0gJ08nKSByZXR1cm47XG5cblx0XHR0ZXRyb21pbm8gPSBteVBpZWNlO1xuXHRcdHZhciBwaXZvdFBvaW50ID0gdGV0cm9taW5vLnBpdm90UG9pbnQ7XG5cblx0XHR2YXIgcG9pbnRzID0gY29udmVydFNoYXBlVG9Qb2ludHModGV0cm9taW5vLnNoYXBlKTtcblx0XHRwb2ludHMgPSB0cmFuc2xhdGVQb2ludHNCeURpc3RhbmNlKHBvaW50cywge3g6IC1waXZvdFBvaW50LngsIHk6IC1waXZvdFBvaW50Lnl9KVxuXHRcdHBvaW50cyA9IHJvdGF0ZVBvaW50cyhwb2ludHMpO1xuXHRcdHBvaW50cyA9IHRyYW5zbGF0ZVBvaW50c0J5RGlzdGFuY2UocG9pbnRzLCB7eDogcGl2b3RQb2ludC54LCB5OiBwaXZvdFBvaW50Lnl9KTtcblx0XHR2YXIgZmluYWxTaGFwZSA9IGNvbnZlcnRQb2ludHNUb1NoYXBlKHBvaW50cyk7XG5cdFx0cG9pbnRzID0gW107XG5cblx0XHRyZXR1cm4gZmluYWxTaGFwZTtcblx0fVxuXHRmdW5jdGlvbiBjb252ZXJ0U2hhcGVUb1BvaW50cyhzaGFwZSkge1xuXHRcdHZhciBwb2ludHMgPSBbXTtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBzaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBzaGFwZVtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdFx0dmFyIHBvaW50ID0ge1xuXHRcdFx0XHRcdHg6IGNvbCwgXG5cdFx0XHRcdFx0eTogcm93LFxuXHRcdFx0XHRcdHZhbHVlOiBzaGFwZVtyb3ddW2NvbF1cblx0XHRcdFx0fVxuXHRcdFx0XHRwb2ludHMucHVzaChwb2ludCk7XG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0cmV0dXJuIHBvaW50cztcblx0fVxuXG5cdGZ1bmN0aW9uIHRyYW5zbGF0ZVBvaW50c0J5RGlzdGFuY2UocG9pbnRzLCBkaXN0YW5jZSkge1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRwb2ludHNbaV0ueCA9IHBvaW50c1tpXS54ICsgZGlzdGFuY2UueDtcblx0XHRcdHBvaW50c1tpXS55ID0gcG9pbnRzW2ldLnkgKyBkaXN0YW5jZS55O1xuXHRcdH07XG5cdFx0cmV0dXJuIHBvaW50cztcblx0fVxuXG5cdGZ1bmN0aW9uIG1vdmVUb1Bpdm90UG9pbnQoKSB7XG5cdFx0dmFyIHNoYXBlID0gdGV0cm9taW5vLnNoYXBlO1xuXHRcdHZhciBwaXZvdFBvaW50ID0gdGV0cm9taW5vLnBpdm90UG9pbnQ7XG5cdFx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgc2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRcdHZhciBtb3ZlZFggPSBjb2wgLSBwaXZvdFBvaW50Lng7XG5cdFx0XHRcdHZhciBtb3ZlZFkgPSByb3cgLSBwaXZvdFBvaW50Lnk7XG5cdFx0XHRcdHZhciBwb2ludCA9IHtcblx0XHRcdFx0XHR4OiBtb3ZlZFgsIFxuXHRcdFx0XHRcdHk6IG1vdmVkWSxcblx0XHRcdFx0XHR2YWx1ZTogc2hhcGVbcm93XVtjb2xdXG5cdFx0XHRcdH1cblx0XHRcdFx0cG9pbnRzLnB1c2gocG9pbnQpO1xuXHRcdFx0fTtcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gcm90YXRlUG9pbnRzKHBvaW50cykge1xuXHRcdC8vdmFyIHJvdCA9IFtbMCwgMV0sIFstMSwgMF1dOyAvLyA5MCBkZWcgQ291bnRlckNsb2Nrd2lzZVxuXHRcdHZhciByb3QgPSBbWzAsIC0xXSwgWzEsIDBdXTsgLy8gOTAgZGVnIENsb2Nrd2lzZVxuXHRcdHZhciB0ZW1wID0ge307XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIHggPSBwb2ludHNbaV0ueDtcblx0XHRcdHZhciB5ID0gcG9pbnRzW2ldLnk7XG5cdFx0XHR0ZW1wLnggPSB4ICogcm90WzBdWzBdICsgeSAqIHJvdFswXVsxXTtcblx0XHRcdHRlbXAueSA9IHggKiByb3RbMV1bMF0gKyB5ICogcm90WzFdWzFdO1xuXHRcdFx0cG9pbnRzW2ldLnggPSB0ZW1wLng7XG5cdFx0XHRwb2ludHNbaV0ueSA9IHRlbXAueTtcblx0XHR9O1xuXHRcdHJldHVybiBwb2ludHM7XG5cdH1cblxuXHRmdW5jdGlvbiBjb252ZXJ0UG9pbnRzVG9TaGFwZShwb2ludHMpIHtcblx0XHR2YXIgdGVtcFNoYXBlID0gY29weVNoYXBlKHRldHJvbWluby5zaGFwZSlcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgY29sID0gcG9pbnRzW2ldLng7XG5cdFx0XHR2YXIgcm93ID0gcG9pbnRzW2ldLnk7XG5cdFx0XHR0ZW1wU2hhcGVbcm93XVtjb2xdID0gcG9pbnRzW2ldLnZhbHVlO1xuXHRcdH07XG5cblx0XHRyZXR1cm4gdGVtcFNoYXBlO1xuXHR9XG5cblx0ZnVuY3Rpb24gY29weVNoYXBlKHNvbWVTaGFwZSkge1xuXHRcdHZhciBuZXdBcnJheSA9IFtdO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc29tZVNoYXBlLmxlbmd0aDsgaSsrKSB7XG5cdCAgICBcdG5ld0FycmF5W2ldID0gc29tZVNoYXBlW2ldLnNsaWNlKCk7XG5cdFx0fVxuXHRcdHJldHVybiBuZXdBcnJheTtcblx0fVxuIiwiXG5cbmZ1bmN0aW9uIGNvbG9yTHVtaW5hbmNlKGhleCwgbHVtKSB7XG5cblx0Ly8gdmFsaWRhdGUgaGV4IHN0cmluZ1xuXHRoZXggPSBTdHJpbmcoaGV4KS5yZXBsYWNlKC9bXjAtOWEtZl0vZ2ksICcnKTtcblx0aWYgKGhleC5sZW5ndGggPCA2KSB7XG5cdFx0aGV4ID0gaGV4WzBdK2hleFswXStoZXhbMV0raGV4WzFdK2hleFsyXStoZXhbMl07XG5cdH1cblx0bHVtID0gbHVtIHx8IDA7XG5cblx0Ly8gY29udmVydCB0byBkZWNpbWFsIGFuZCBjaGFuZ2UgbHVtaW5vc2l0eVxuXHR2YXIgcmdiID0gXCIjXCIsIGMsIGk7XG5cdGZvciAoaSA9IDA7IGkgPCAzOyBpKyspIHtcblx0XHRjID0gcGFyc2VJbnQoaGV4LnN1YnN0cihpKjIsMiksIDE2KTtcblx0XHRjID0gTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCgwLCBjICsgKGMgKiBsdW0pKSwgMjU1KSkudG9TdHJpbmcoMTYpO1xuXHRcdHJnYiArPSAoXCIwMFwiK2MpLnN1YnN0cihjLmxlbmd0aCk7XG5cdH1cblxuXHRyZXR1cm4gcmdiO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRjb2xvckx1bWluYW5jZTogY29sb3JMdW1pbmFuY2Vcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0U1BBQ0U6IDMyLFxuXHRMRUZUOiAzNyxcblx0UklHSFQ6IDM5LFxuXHRVUDogMzgsXG5cdERPV046IDQwLFxuXHRTSElGVDogMTZcbn07IiwidmFyIEJvYXJkID0gcmVxdWlyZSgnLi9Cb2FyZC5qcycpO1xudmFyIFBpZWNlID0gcmVxdWlyZSgnLi9QaWVjZS5qcycpO1xudmFyIENvbG9ycyA9IHJlcXVpcmUoJy4vQ29sb3JzLmpzJyk7XG52YXIgdHJhbnNmb3JtID0gcmVxdWlyZSgnLi9UcmFuc2Zvcm0uanMnKTtcbnZhciBDb2xsaXNpb25EZXRlY3Rpb24gPSByZXF1aXJlKCcuL0NvbGxpc2lvbkRldGVjdGlvbi5qcycpO1xudmFyIENvbnRyb2xzID0gcmVxdWlyZSgnLi9Db250cm9scy5qcycpO1xudmFyIFJlbmRlcmVyID0gcmVxdWlyZSgnLi9SZW5kZXJlci5qcycpO1xuXG52YXIgY29sb3JzID0gQ29sb3JzKCk7XG52YXIgYm9hcmQgPSBCb2FyZCgpO1xudmFyIHBpZWNlID0gbmV3IFBpZWNlKHt0eXBlOiAnTCd9KTtcbnZhciBjb2xsaXNpb25EZXRlY3Rpb24gPSBDb2xsaXNpb25EZXRlY3Rpb24oe1xuXHRib2FyZDogYm9hcmRcbn0pO1xuXG52YXIgcmVuZGVyZXIgPSBSZW5kZXJlcih7Ym9hcmQ6IGJvYXJkLCBjb2xvcnM6IGNvbG9yc30pO1xudmFyIGNvbnRyb2xzID0gQ29udHJvbHMoe1xuXHRwaWVjZTogcGllY2UsXG5cdGNvbGxpc2lvbkRldGVjdGlvbjpjb2xsaXNpb25EZXRlY3Rpb25cbn0pO1xuY29udHJvbHMuaW5pdCgpO1xuXG5cbnNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuXHRpZihwaWVjZS55ID4gYm9hcmQuaGVpZ2h0KSB7XG5cdFx0cGllY2UgPSBnZW5lcmF0ZVJhbmRvbVBpZWNlKCk7XG5cdH1cblxuXHR2YXIgY2FuTW92ZURvd24gPSBjb2xsaXNpb25EZXRlY3Rpb24uY2FuR29Eb3duKHBpZWNlKTtcblx0aWYgKGNhbk1vdmVEb3duKSB7XG5cdFx0Ly9waWVjZS55Kys7XG5cdFx0Ly9zdGljaFBpZWNlVG9Cb2FyZDtcblx0fVxufSwgNTAwKTtcblxuXG52YXIgcmVuZGVyVG9rZW4gPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcblx0cmVuZGVyZXIucmVuZGVyKHBpZWNlKTtcbn0sIDUwKTtcblxuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVBpZWNlICgpIHtcblx0dmFyIGJsb2NrcyA9IFsnSicsICdMJywgJ08nLCAnUycsICdUJywgJ1onXTtcblx0dmFyIHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGJsb2Nrcy5sZW5ndGgpO1xuXHRyZXR1cm4gUGllY2Uoe3R5cGU6IGJsb2Nrc1tyYW5kb21dfSk7XG59Il19
