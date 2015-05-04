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
},{"./Piece.js":5}],3:[function(require,module,exports){
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
var Piece = require('./Piece.js')
module.exports = function Controls(createOptions) {
	var piece = createOptions.piece;
	var check = createOptions.check;
	var stitchPieceToBoard = createOptions.stitchPieceToBoard;
	var generateRandomPiece = createOptions.generateRandomPiece;
	var generateAndAssignNewPiece = createOptions.generateAndAssignNewPiece;
	var removeLines = createOptions.removeLines;

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
		if (e.keyCode == keys.LEFT) {
			if (check(piece.clone().goLeft())) {
				piece.goLeft();
			}
		}
		if (e.keyCode == keys.UP) {
			if (check(piece.clone().rotate())) {
				piece.rotate();
			 }
		}
		if(e.keyCode == keys.DOWN) {
			if (check(piece.clone().goDown())) {
				piece.goDown()
			}
		}
		if(e.keyCode == keys.SPACE) {
			var newPiece = piece.clone();
			while(check(newPiece.clone().goDown())) {
				newPiece.goDown();
			}
			stitchPieceToBoard(newPiece);
			removeLines();
			generateAndAssignNewPiece();

		}
	}

}
},{"./Piece.js":5,"./keys.js":9}],5:[function(require,module,exports){
var Shapes = require('./Shapes.js');

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
},{"./Shapes.js":7}],6:[function(require,module,exports){
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
		clear();
		renderBoard();
		renderGhostPiece(ghostPiece);
		renderMovingPiece(piece);
	}

	function renderBoard() {
		for (var row = 0; row < board.length; row++) {
			for (var col = 0; col < board[row].length; col++) {
				if(board[row][col] !== 0) {
					renderForegroundSquare(row, col);
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

	function checkered(row, col) {
		var bg = '#eee';
		var bg2 = '#fff';
		if( (row+col) % 2 == 0 ){
			bg = bg2;
		}
		else{
			bg = bg;
		}
	}

	function renderForegroundSquare(row, col) {
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
		for (var row = 0; row < piece.shape.length; row++) {
			for (var col = 0; col < piece.shape[row].length; col++) {
				var x = (piece.x + col);
				var y = (piece.y + row);
				var bg = colors[piece.type];
				var strokeColor = colorLuminance(bg, -0.1);
				if( piece.shape[row][col] !== 0 ) {
					renderSquare(x, y, {
						bg: 'rgba(100, 100, 100, 0.6)',
						stroke: false
					})
				}
				
			};
		};
	}

	function renderSquare(i, j, options) {
		fillSquare(square.width * i, square.height * j, options);
	}

	function fillSquare(x, y, options) {
		var stroke = ((options.stroke !== undefined) ? options.stroke : true);
		var strokeColor = options.strokeColor || '#ccc';
		var strokeThickness = options.strokeThickness || 2.5;

		context.fillStyle = options.bg;
		context.fillRect(x, y, square.width, square.height);
		
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
},{"./helpers.js":8}],7:[function(require,module,exports){
var Shapes = module.exports = {
	'I': {
		shape: [ [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0] ]
	},
	'J': {
		shape: [ [0, 0, 0], [1, 1, 1], [0, 0, 1] ]
	},
	'L': {
		shape: [ [0, 0, 0], [1, 1, 1], [1, 0, 0] ]
	},
	'O': {
		shape: [ [1, 1], [1, 1] ]
	},
	'S': {
		shape: [ [0, 1, 1], [1, 1, 0], [0, 0, 0] ]
	},
	'T': {
		shape: [ [0, 1, 0], [1, 1, 1], [0, 0, 0] ]
	},
	'Z': {
		shape: [ [1, 1, 0], [0, 1, 1], [0, 0, 0] ]
	}
};

},{}],8:[function(require,module,exports){


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
},{}],9:[function(require,module,exports){
module.exports = {
	SPACE: 32,
	LEFT: 37,
	RIGHT: 39,
	UP: 38,
	DOWN: 40,
	SHIFT: 16
};
},{}],10:[function(require,module,exports){
var Board = require('./Board.js');
var Piece = require('./Piece.js');
var Colors = require('./Colors.js');
var CollisionDetection = require('./CollisionDetection.js');
var Controls = require('./Controls.js');
var Renderer = require('./Renderer.js');

var blocks = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
var colors = Colors();
var board = Board();
var piece = generateRandomPiece();
var collisionDetection = CollisionDetection({
	board: board
});
var check = collisionDetection.check;

var renderer = Renderer({board: board, colors: colors});
var controls = Controls({
	piece: piece,
	check:check,
	stitchPieceToBoard:stitchPieceToBoard,
	generateAndAssignNewPiece: generateAndAssignNewPiece,
	removeLines: removeLines
});
controls.init();


setInterval(function() {

	if (check(piece.clone().goDown())) {
		piece.goDown();
	} 
	else {
		//wait for user no input and specified seconds
		stitchPieceToBoard(piece);
		removeLines();
		piece = generateRandomPiece();
		controls.updatePiece(piece);
	}

}, 500);


var renderToken = setInterval(function() {
	var ghostPiece = calculateGhostPiece();
	renderer.render(piece, ghostPiece);
}, 50);


function generateRandomPiece () {
	var random = Math.floor(Math.random() * blocks.length);
	var p = new Piece({
		type: blocks[random],
		x: 3 
	});
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

function removeLines() {
	for (var row = 0; row < board.length; row++) {
		var fullLine = (_.min(board[row]) !== 0);
		if(fullLine) {
			board.splice(row,1);
			board.unshift(emptyRow());
		}
	};
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

},{"./Board.js":1,"./CollisionDetection.js":2,"./Colors.js":3,"./Controls.js":4,"./Piece.js":5,"./Renderer.js":6}]},{},[10])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzcvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwianMvQm9hcmQuanMiLCJqcy9Db2xsaXNpb25EZXRlY3Rpb24uanMiLCJqcy9Db2xvcnMuanMiLCJqcy9Db250cm9scy5qcyIsImpzL1BpZWNlLmpzIiwianMvUmVuZGVyZXIuanMiLCJqcy9TaGFwZXMuanMiLCJqcy9oZWxwZXJzLmpzIiwianMva2V5cy5qcyIsImpzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cblx0dmFyIGJvYXJkID0gW1xuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdF07XG5cblx0Ym9hcmQuaGVpZ2h0ID0gYm9hcmQubGVuZ3RoO1xuXHRib2FyZC53aWR0aCA9IGJvYXJkWzBdLmxlbmd0aDtcblxuXHRyZXR1cm4gYm9hcmQ7XG59XG5cbiIsInZhciBQaWVjZSA9IHJlcXVpcmUoJy4vUGllY2UuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBDb2xsaXNpb25EZXRlY3Rpb24oY3JlYXRlT3B0aW9ucyl7XG5cdHZhciBib2FyZCA9IGNyZWF0ZU9wdGlvbnMuYm9hcmQ7XG5cdHJldHVybiB7XG5cdFx0Y2hlY2s6IGNoZWNrXG5cdH07XG5cblx0ZnVuY3Rpb24gY2hlY2socGllY2UpIHtcblx0XHR2YXIgc2hhcGUgPSBwaWVjZS5zaGFwZTtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBzaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBzaGFwZVtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdFx0aWYgKHNoYXBlW3Jvd11bY29sXSAhPT0gMCkge1xuXHRcdFx0XHRcdHZhciB5ID0gKHBpZWNlLnkgKyByb3cpO1xuXHRcdFx0XHRcdHZhciB4ID0gKHBpZWNlLnggKyBjb2wpO1xuXHRcdFx0XHRcdGlmICh5ID49IGJvYXJkLmhlaWdodCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHQgICAgICAgICAgICBcdH1cblx0XHRcdFx0XHRlbHNlIGlmIChib2FyZFt5XVt4XSAhPT0gMCApIHtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCBcdC8vY2hlY2sgaWYgb3V0IG9mIGJvdW5kcyBoZWlnaHRcblx0XHRcdFx0IFx0Ly9jaGVjayBpZiBvdXRvZmJvdW5kcyByaWdodCwgY29tcGVuc2F0ZVxuXHRcdFx0XHQgXHQvL2NoZWNrIGlmIG91dG9mYm91bmRzIGxlZnQsIGNvbXBlbnNhdGVcblx0XHRcdFx0IH1cblx0XHRcdH07XG5cdFx0fTtcblx0XHRyZXR1cm4gdHJ1ZTtcdFx0XG5cdH1cblxuXHRmdW5jdGlvbiBsb2dTaGFwZShzaGFwZSkge1xuXHRcdHZhciBzaGFwZVN0cmluZyA9IFwiXCI7XG5cdFx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgc2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRcdHNoYXBlU3RyaW5nICs9IHNoYXBlW3Jvd11bY29sXTtcblx0XHRcdH07XG5cdFx0XHRzaGFwZVN0cmluZyArPSAnXFxuJztcblx0XHR9O1xuXHRcdGNvbnNvbGUubG9nKHNoYXBlU3RyaW5nKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGxvZ1BhcnRPZkJvYXJkKGNvcHkpIHtcblx0XHR2YXIgYm9hcmRTdHJpbmcgPSBcIlwiO1xuXHRcdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IDM7IHJvdysrKSB7XG5cdFx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCAzOyBjb2wrKykge1xuXHRcdFx0XHR2YXIgeCA9IChjb3B5LnggKyBjb2wpO1xuXHRcdFx0XHR2YXIgeSA9IChjb3B5LnkgKyByb3cpO1xuXHRcdFx0XHRib2FyZFN0cmluZyArPSBib2FyZFt5XVt4XTtcblx0XHRcdH07XG5cdFx0XHRib2FyZFN0cmluZyArPSAnXFxuJztcblx0XHR9O1xuXHRcdGNvbnNvbGUubG9nKGJvYXJkU3RyaW5nKTtcblx0fVxuXG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBDb2xvcnMoKSB7XG5cdHJldHVybiB7XG5cdFx0J0knOiAnIzI3REVGRicsIC8vbGp1c2Jsw6Vcblx0XHQnSic6ICcjM0M2NkZGJywgLy9ibMOlXG5cdFx0J0wnOiAnI0U4NzQwQycsIC8vb3JhbmdlXG5cdFx0J08nOiAnI0ZGRDcwRCcsIC8vZ3VsXG5cdFx0J1MnOiAnIzI2RkYwMCcsIC8vZ3LDtm5cblx0XHQnVCc6ICcjOUUwQ0U4JywgLy9saWxhXG5cdFx0J1onOiAnI0ZGMDAwMCcgIC8vcsO2ZFxuXHR9XG59IiwidmFyIGtleXMgPSByZXF1aXJlKCcuL2tleXMuanMnKTtcbnZhciBQaWVjZSA9IHJlcXVpcmUoJy4vUGllY2UuanMnKVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBDb250cm9scyhjcmVhdGVPcHRpb25zKSB7XG5cdHZhciBwaWVjZSA9IGNyZWF0ZU9wdGlvbnMucGllY2U7XG5cdHZhciBjaGVjayA9IGNyZWF0ZU9wdGlvbnMuY2hlY2s7XG5cdHZhciBzdGl0Y2hQaWVjZVRvQm9hcmQgPSBjcmVhdGVPcHRpb25zLnN0aXRjaFBpZWNlVG9Cb2FyZDtcblx0dmFyIGdlbmVyYXRlUmFuZG9tUGllY2UgPSBjcmVhdGVPcHRpb25zLmdlbmVyYXRlUmFuZG9tUGllY2U7XG5cdHZhciBnZW5lcmF0ZUFuZEFzc2lnbk5ld1BpZWNlID0gY3JlYXRlT3B0aW9ucy5nZW5lcmF0ZUFuZEFzc2lnbk5ld1BpZWNlO1xuXHR2YXIgcmVtb3ZlTGluZXMgPSBjcmVhdGVPcHRpb25zLnJlbW92ZUxpbmVzO1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdCxcblx0XHR1cGRhdGVQaWVjZTogdXBkYXRlUGllY2Vcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0JChkb2N1bWVudCkub24oJ2tleWRvd24nLCBrZXlQcmVzc2VkKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHVwZGF0ZVBpZWNlKG5ld1BpZWNlKSB7XG5cdFx0cGllY2UgPSBuZXdQaWVjZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGtleVByZXNzZWQoZSkge1xuXG5cdFx0aWYgKGUua2V5Q29kZSA9PSBrZXlzLlJJR0hUKSB7XG5cdFx0XHRpZiAoY2hlY2socGllY2UuY2xvbmUoKS5nb1JpZ2h0KCkpKSB7XG5cdFx0XHRcdHBpZWNlLmdvUmlnaHQoKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGUua2V5Q29kZSA9PSBrZXlzLkxFRlQpIHtcblx0XHRcdGlmIChjaGVjayhwaWVjZS5jbG9uZSgpLmdvTGVmdCgpKSkge1xuXHRcdFx0XHRwaWVjZS5nb0xlZnQoKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGUua2V5Q29kZSA9PSBrZXlzLlVQKSB7XG5cdFx0XHRpZiAoY2hlY2socGllY2UuY2xvbmUoKS5yb3RhdGUoKSkpIHtcblx0XHRcdFx0cGllY2Uucm90YXRlKCk7XG5cdFx0XHQgfVxuXHRcdH1cblx0XHRpZihlLmtleUNvZGUgPT0ga2V5cy5ET1dOKSB7XG5cdFx0XHRpZiAoY2hlY2socGllY2UuY2xvbmUoKS5nb0Rvd24oKSkpIHtcblx0XHRcdFx0cGllY2UuZ29Eb3duKClcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZS5rZXlDb2RlID09IGtleXMuU1BBQ0UpIHtcblx0XHRcdHZhciBuZXdQaWVjZSA9IHBpZWNlLmNsb25lKCk7XG5cdFx0XHR3aGlsZShjaGVjayhuZXdQaWVjZS5jbG9uZSgpLmdvRG93bigpKSkge1xuXHRcdFx0XHRuZXdQaWVjZS5nb0Rvd24oKTtcblx0XHRcdH1cblx0XHRcdHN0aXRjaFBpZWNlVG9Cb2FyZChuZXdQaWVjZSk7XG5cdFx0XHRyZW1vdmVMaW5lcygpO1xuXHRcdFx0Z2VuZXJhdGVBbmRBc3NpZ25OZXdQaWVjZSgpO1xuXG5cdFx0fVxuXHR9XG5cbn0iLCJ2YXIgU2hhcGVzID0gcmVxdWlyZSgnLi9TaGFwZXMuanMnKTtcblxuZnVuY3Rpb24gUGllY2Uob3B0aW9ucykge1xuXHR0aGlzLnR5cGUgPSBvcHRpb25zLnR5cGU7XG5cdHRoaXMueCA9IG9wdGlvbnMueCB8fCAwO1xuXHR0aGlzLnkgPSBvcHRpb25zLnkgfHwgMDtcdFxuXHR0aGlzLnNoYXBlID0gb3B0aW9ucy5zaGFwZSB8fCBTaGFwZXNbdGhpcy50eXBlXS5zaGFwZTtcblx0dGhpcy5waXZvdFBvaW50ID0gU2hhcGVzW3RoaXMudHlwZV0ucGl2b3RQb2ludDtcblxuXHRyZXR1cm47XG59XG5cblBpZWNlLnByb3RvdHlwZS5nb1JpZ2h0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMueCsrO1xuXHRyZXR1cm4gdGhpcztcbn1cblxuUGllY2UucHJvdG90eXBlLmdvTGVmdCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLngtLTtcblx0cmV0dXJuIHRoaXM7XG59XG5cblxuUGllY2UucHJvdG90eXBlLmdvRG93biA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnkrKztcblx0cmV0dXJuIHRoaXM7XG59XG5cblBpZWNlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gbmV3IFBpZWNlKHRoaXMpO1xufVxuXG5QaWVjZS5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuc2hhcGUgPSByb3RhdGlvbih0aGlzLnNoYXBlKTtcblx0cmV0dXJuIHRoaXM7XG59XG5cbmZ1bmN0aW9uIHJvdGF0aW9uKHNoYXBlKSB7XG5cdHZhciBuID0gW107XG5cdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHR2YXIgcCA9IFtdO1xuXHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0cC5wdXNoKHNoYXBlW3NoYXBlLmxlbmd0aCAtIGNvbCAtIDFdW3Jvd10pO1xuXHRcdH07XG5cdFx0bi5wdXNoKHApXG5cdH07XG5cdHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBsb2dTaGFwZShzaGFwZSkge1xuXHR2YXIgc2hhcGVTdHJpbmcgPSBcIlwiO1xuXHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBcdHNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBcdHNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0c2hhcGVTdHJpbmcgKz0gXHRzaGFwZVtyb3ddW2NvbF07XG5cdFx0fTtcblx0XHRzaGFwZVN0cmluZyArPSAnXFxuJztcblx0fTtcblx0Y29uc29sZS5sb2coc2hhcGVTdHJpbmcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBpZWNlOyIsInZhciBjb2xvckx1bWluYW5jZSA9IHJlcXVpcmUoJy4vaGVscGVycy5qcycpLmNvbG9yTHVtaW5hbmNlO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUmVuZGVyZXIob3B0aW9ucykge1xuXHR2YXIgYm9hcmQgPSBvcHRpb25zLmJvYXJkO1xuXHR2YXIgY29sb3JzID0gb3B0aW9ucy5jb2xvcnM7XG5cdHZhciBjb2xvckluZGV4ZXMgPSBbJ0knLCAnSicsICdMJywgJ08nLCAnUycsICdUJywgJ1onXTtcblx0Ym9hcmQuaGVpZ2h0ID0gYm9hcmQubGVuZ3RoO1xuXHRib2FyZC53aWR0aCA9IGJvYXJkWzBdLmxlbmd0aDtcblx0dmFyIGNvbnRleHQ7XG5cdHZhciBjYW52YXM7XG5cdHZhciBzaXplO1xuXHRzcXVhcmUgPSB7fTtcblx0aW5pdCgpO1xuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXQsXG5cdFx0cmVuZGVyOiByZW5kZXIsXG5cdFx0ZmlsbFNxdWFyZTogZmlsbFNxdWFyZVxuXHR9O1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0Y2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtY2FudmFzJyk7XG5cdFx0Y29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdC8vY29udGV4dC5zY2FsZSgyLDIpO1xuXHRcdGNhbGN1bGF0ZVNxdWFyZVNpemUoKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gcmVuZGVyKHBpZWNlLCBnaG9zdFBpZWNlKSB7XG5cdFx0Y2xlYXIoKTtcblx0XHRyZW5kZXJCb2FyZCgpO1xuXHRcdHJlbmRlckdob3N0UGllY2UoZ2hvc3RQaWVjZSk7XG5cdFx0cmVuZGVyTW92aW5nUGllY2UocGllY2UpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVuZGVyQm9hcmQoKSB7XG5cdFx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgYm9hcmQubGVuZ3RoOyByb3crKykge1xuXHRcdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgYm9hcmRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRcdGlmKGJvYXJkW3Jvd11bY29sXSAhPT0gMCkge1xuXHRcdFx0XHRcdHJlbmRlckZvcmVncm91bmRTcXVhcmUocm93LCBjb2wpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHZhciBiZyA9ICcjZWVlJztcblx0XHRcdFx0XHR2YXIgYmcyID0gJyNmZmYnO1xuXHRcdFx0XHRcdGlmKCAocm93K2NvbCkgJSAyID09IDAgKXtcblx0XHRcdFx0XHRcdGJnID0gYmcyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0YmcgPSBiZztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVuZGVyU3F1YXJlKGNvbCwgcm93LCB7XG5cdFx0XHRcdFx0XHRiZzogYmcsXG5cdFx0XHRcdFx0XHQvL3N0cm9rZTpmYWxzZVxuXHRcdFx0XHRcdFx0c3Ryb2tlVGhpY2tuZXNzOiAwLjMsXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNoZWNrZXJlZChyb3csIGNvbCkge1xuXHRcdHZhciBiZyA9ICcjZWVlJztcblx0XHR2YXIgYmcyID0gJyNmZmYnO1xuXHRcdGlmKCAocm93K2NvbCkgJSAyID09IDAgKXtcblx0XHRcdGJnID0gYmcyO1xuXHRcdH1cblx0XHRlbHNle1xuXHRcdFx0YmcgPSBiZztcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXJGb3JlZ3JvdW5kU3F1YXJlKHJvdywgY29sKSB7XG5cdFx0dmFyIGJsb2NrVHlwZSA9IGNvbG9ySW5kZXhlcyBbIChib2FyZFtyb3ddW2NvbF0tMSkgXTtcblx0XHR2YXIgYmcgPSBjb2xvcnNbYmxvY2tUeXBlXTtcblx0XHR2YXIgc3Ryb2tlQ29sb3IgPSBjb2xvckx1bWluYW5jZShiZywgLTAuMik7XG5cdFx0dmFyIHN0cm9rZVRoaWNrbmVzcyA9IDIuNTtcblx0XHRyZW5kZXJTcXVhcmUoY29sLCByb3csIHtcblx0XHRcdGJnOiBiZywgXG5cdFx0XHRzdHJva2VDb2xvcjogc3Ryb2tlQ29sb3IsXG5cdFx0XHRzdHJva2VUaGlja25lc3M6IHN0cm9rZVRoaWNrbmVzc1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVuZGVyTW92aW5nUGllY2UocGllY2UpIHtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBwaWVjZS5zaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBwaWVjZS5zaGFwZVtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdFx0dmFyIHggPSAocGllY2UueCArIGNvbCk7XG5cdFx0XHRcdHZhciB5ID0gKHBpZWNlLnkgKyByb3cpO1xuXHRcdFx0XHR2YXIgYmcgPSBjb2xvcnNbcGllY2UudHlwZV07XG5cdFx0XHRcdHZhciBzdHJva2VDb2xvciA9IGNvbG9yTHVtaW5hbmNlKGJnLCAtMC4xKTtcblx0XHRcdFx0aWYoIHBpZWNlLnNoYXBlW3Jvd11bY29sXSAhPT0gMCApIHtcblx0XHRcdFx0XHRyZW5kZXJTcXVhcmUoeCwgeSwge1xuXHRcdFx0XHRcdFx0Ymc6IGJnLFxuXHRcdFx0XHRcdFx0c3Ryb2tlQ29sb3I6IHN0cm9rZUNvbG9yXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHR9O1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXJHaG9zdFBpZWNlKHBpZWNlKSB7XG5cdFx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgcGllY2Uuc2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgcGllY2Uuc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRcdHZhciB4ID0gKHBpZWNlLnggKyBjb2wpO1xuXHRcdFx0XHR2YXIgeSA9IChwaWVjZS55ICsgcm93KTtcblx0XHRcdFx0dmFyIGJnID0gY29sb3JzW3BpZWNlLnR5cGVdO1xuXHRcdFx0XHR2YXIgc3Ryb2tlQ29sb3IgPSBjb2xvckx1bWluYW5jZShiZywgLTAuMSk7XG5cdFx0XHRcdGlmKCBwaWVjZS5zaGFwZVtyb3ddW2NvbF0gIT09IDAgKSB7XG5cdFx0XHRcdFx0cmVuZGVyU3F1YXJlKHgsIHksIHtcblx0XHRcdFx0XHRcdGJnOiAncmdiYSgxMDAsIDEwMCwgMTAwLCAwLjYpJyxcblx0XHRcdFx0XHRcdHN0cm9rZTogZmFsc2Vcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0fTtcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVuZGVyU3F1YXJlKGksIGosIG9wdGlvbnMpIHtcblx0XHRmaWxsU3F1YXJlKHNxdWFyZS53aWR0aCAqIGksIHNxdWFyZS5oZWlnaHQgKiBqLCBvcHRpb25zKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGZpbGxTcXVhcmUoeCwgeSwgb3B0aW9ucykge1xuXHRcdHZhciBzdHJva2UgPSAoKG9wdGlvbnMuc3Ryb2tlICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5zdHJva2UgOiB0cnVlKTtcblx0XHR2YXIgc3Ryb2tlQ29sb3IgPSBvcHRpb25zLnN0cm9rZUNvbG9yIHx8ICcjY2NjJztcblx0XHR2YXIgc3Ryb2tlVGhpY2tuZXNzID0gb3B0aW9ucy5zdHJva2VUaGlja25lc3MgfHwgMi41O1xuXG5cdFx0Y29udGV4dC5maWxsU3R5bGUgPSBvcHRpb25zLmJnO1xuXHRcdGNvbnRleHQuZmlsbFJlY3QoeCwgeSwgc3F1YXJlLndpZHRoLCBzcXVhcmUuaGVpZ2h0KTtcblx0XHRcblx0XHRpZihzdHJva2UpIHtcblx0XHRcdGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBzdHJva2VDb2xvcjtcblx0XHRcdGNvbnRleHQubGluZVdpZHRoID0gc3Ryb2tlVGhpY2tuZXNzO1xuXHRcdFx0Y29udGV4dC5zdHJva2VSZWN0KHggKyBzdHJva2VUaGlja25lc3MgKiAwLjUsIHkgKyBzdHJva2VUaGlja25lc3MgKiAwLjUsIHNxdWFyZS53aWR0aCAtIHN0cm9rZVRoaWNrbmVzcywgc3F1YXJlLmhlaWdodCAtIHN0cm9rZVRoaWNrbmVzcyk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gY2FsY3VsYXRlU3F1YXJlU2l6ZSgpIHtcblx0XHRzcXVhcmUud2lkdGggPSBjYW52YXMud2lkdGggLyBib2FyZC53aWR0aDtcblx0XHRzcXVhcmUuaGVpZ2h0ID0gY2FudmFzLmhlaWdodCAvIGJvYXJkLmhlaWdodDtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2xlYXIoKSB7XG5cdFx0Y29udGV4dC5iZWdpblBhdGgoKTtcblx0XHRjb250ZXh0LmNsZWFyUmVjdCAoIDAgLCAwICwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0ICk7XG5cdH1cbn0iLCJ2YXIgU2hhcGVzID0gbW9kdWxlLmV4cG9ydHMgPSB7XG5cdCdJJzoge1xuXHRcdHNoYXBlOiBbIFswLCAwLCAwLCAwXSwgWzEsIDEsIDEsIDFdLCBbMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwXSBdXG5cdH0sXG5cdCdKJzoge1xuXHRcdHNoYXBlOiBbIFswLCAwLCAwXSwgWzEsIDEsIDFdLCBbMCwgMCwgMV0gXVxuXHR9LFxuXHQnTCc6IHtcblx0XHRzaGFwZTogWyBbMCwgMCwgMF0sIFsxLCAxLCAxXSwgWzEsIDAsIDBdIF1cblx0fSxcblx0J08nOiB7XG5cdFx0c2hhcGU6IFsgWzEsIDFdLCBbMSwgMV0gXVxuXHR9LFxuXHQnUyc6IHtcblx0XHRzaGFwZTogWyBbMCwgMSwgMV0sIFsxLCAxLCAwXSwgWzAsIDAsIDBdIF1cblx0fSxcblx0J1QnOiB7XG5cdFx0c2hhcGU6IFsgWzAsIDEsIDBdLCBbMSwgMSwgMV0sIFswLCAwLCAwXSBdXG5cdH0sXG5cdCdaJzoge1xuXHRcdHNoYXBlOiBbIFsxLCAxLCAwXSwgWzAsIDEsIDFdLCBbMCwgMCwgMF0gXVxuXHR9XG59O1xuIiwiXG5cbmZ1bmN0aW9uIGNvbG9yTHVtaW5hbmNlKGhleCwgbHVtKSB7XG5cblx0Ly8gdmFsaWRhdGUgaGV4IHN0cmluZ1xuXHRoZXggPSBTdHJpbmcoaGV4KS5yZXBsYWNlKC9bXjAtOWEtZl0vZ2ksICcnKTtcblx0aWYgKGhleC5sZW5ndGggPCA2KSB7XG5cdFx0aGV4ID0gaGV4WzBdK2hleFswXStoZXhbMV0raGV4WzFdK2hleFsyXStoZXhbMl07XG5cdH1cblx0bHVtID0gbHVtIHx8IDA7XG5cblx0Ly8gY29udmVydCB0byBkZWNpbWFsIGFuZCBjaGFuZ2UgbHVtaW5vc2l0eVxuXHR2YXIgcmdiID0gXCIjXCIsIGMsIGk7XG5cdGZvciAoaSA9IDA7IGkgPCAzOyBpKyspIHtcblx0XHRjID0gcGFyc2VJbnQoaGV4LnN1YnN0cihpKjIsMiksIDE2KTtcblx0XHRjID0gTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCgwLCBjICsgKGMgKiBsdW0pKSwgMjU1KSkudG9TdHJpbmcoMTYpO1xuXHRcdHJnYiArPSAoXCIwMFwiK2MpLnN1YnN0cihjLmxlbmd0aCk7XG5cdH1cblxuXHRyZXR1cm4gcmdiO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRjb2xvckx1bWluYW5jZTogY29sb3JMdW1pbmFuY2Vcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0U1BBQ0U6IDMyLFxuXHRMRUZUOiAzNyxcblx0UklHSFQ6IDM5LFxuXHRVUDogMzgsXG5cdERPV046IDQwLFxuXHRTSElGVDogMTZcbn07IiwidmFyIEJvYXJkID0gcmVxdWlyZSgnLi9Cb2FyZC5qcycpO1xudmFyIFBpZWNlID0gcmVxdWlyZSgnLi9QaWVjZS5qcycpO1xudmFyIENvbG9ycyA9IHJlcXVpcmUoJy4vQ29sb3JzLmpzJyk7XG52YXIgQ29sbGlzaW9uRGV0ZWN0aW9uID0gcmVxdWlyZSgnLi9Db2xsaXNpb25EZXRlY3Rpb24uanMnKTtcbnZhciBDb250cm9scyA9IHJlcXVpcmUoJy4vQ29udHJvbHMuanMnKTtcbnZhciBSZW5kZXJlciA9IHJlcXVpcmUoJy4vUmVuZGVyZXIuanMnKTtcblxudmFyIGJsb2NrcyA9IFsnSScsICdKJywgJ0wnLCAnTycsICdTJywgJ1QnLCAnWiddO1xudmFyIGNvbG9ycyA9IENvbG9ycygpO1xudmFyIGJvYXJkID0gQm9hcmQoKTtcbnZhciBwaWVjZSA9IGdlbmVyYXRlUmFuZG9tUGllY2UoKTtcbnZhciBjb2xsaXNpb25EZXRlY3Rpb24gPSBDb2xsaXNpb25EZXRlY3Rpb24oe1xuXHRib2FyZDogYm9hcmRcbn0pO1xudmFyIGNoZWNrID0gY29sbGlzaW9uRGV0ZWN0aW9uLmNoZWNrO1xuXG52YXIgcmVuZGVyZXIgPSBSZW5kZXJlcih7Ym9hcmQ6IGJvYXJkLCBjb2xvcnM6IGNvbG9yc30pO1xudmFyIGNvbnRyb2xzID0gQ29udHJvbHMoe1xuXHRwaWVjZTogcGllY2UsXG5cdGNoZWNrOmNoZWNrLFxuXHRzdGl0Y2hQaWVjZVRvQm9hcmQ6c3RpdGNoUGllY2VUb0JvYXJkLFxuXHRnZW5lcmF0ZUFuZEFzc2lnbk5ld1BpZWNlOiBnZW5lcmF0ZUFuZEFzc2lnbk5ld1BpZWNlLFxuXHRyZW1vdmVMaW5lczogcmVtb3ZlTGluZXNcbn0pO1xuY29udHJvbHMuaW5pdCgpO1xuXG5cbnNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuXG5cdGlmIChjaGVjayhwaWVjZS5jbG9uZSgpLmdvRG93bigpKSkge1xuXHRcdHBpZWNlLmdvRG93bigpO1xuXHR9IFxuXHRlbHNlIHtcblx0XHQvL3dhaXQgZm9yIHVzZXIgbm8gaW5wdXQgYW5kIHNwZWNpZmllZCBzZWNvbmRzXG5cdFx0c3RpdGNoUGllY2VUb0JvYXJkKHBpZWNlKTtcblx0XHRyZW1vdmVMaW5lcygpO1xuXHRcdHBpZWNlID0gZ2VuZXJhdGVSYW5kb21QaWVjZSgpO1xuXHRcdGNvbnRyb2xzLnVwZGF0ZVBpZWNlKHBpZWNlKTtcblx0fVxuXG59LCA1MDApO1xuXG5cbnZhciByZW5kZXJUb2tlbiA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuXHR2YXIgZ2hvc3RQaWVjZSA9IGNhbGN1bGF0ZUdob3N0UGllY2UoKTtcblx0cmVuZGVyZXIucmVuZGVyKHBpZWNlLCBnaG9zdFBpZWNlKTtcbn0sIDUwKTtcblxuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVBpZWNlICgpIHtcblx0dmFyIHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGJsb2Nrcy5sZW5ndGgpO1xuXHR2YXIgcCA9IG5ldyBQaWVjZSh7XG5cdFx0dHlwZTogYmxvY2tzW3JhbmRvbV0sXG5cdFx0eDogMyBcblx0fSk7XG5cdHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBzdGl0Y2hQaWVjZVRvQm9hcmQocGllY2UpIHtcblx0dmFyIHNoYXBlID0gcGllY2Uuc2hhcGU7XG5cdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBzaGFwZVtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdGlmKHNoYXBlW3Jvd11bY29sXSAhPT0gMCkge1xuXHRcdFx0XHR2YXIgeCA9IHBpZWNlLnggKyBjb2w7XG5cdFx0XHRcdHZhciB5ID0gcGllY2UueSArIHJvdztcblx0XHRcdFx0dmFyIGluZGV4ID0gYmxvY2tzLmluZGV4T2YocGllY2UudHlwZSkgKyAxO1xuXHRcdFx0XHRcdGJvYXJkW3ldW3hdID0gaW5kZXg7XG5cdFx0XHR9XG5cdFx0fTtcblx0fTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlTGluZXMoKSB7XG5cdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IGJvYXJkLmxlbmd0aDsgcm93KyspIHtcblx0XHR2YXIgZnVsbExpbmUgPSAoXy5taW4oYm9hcmRbcm93XSkgIT09IDApO1xuXHRcdGlmKGZ1bGxMaW5lKSB7XG5cdFx0XHRib2FyZC5zcGxpY2Uocm93LDEpO1xuXHRcdFx0Ym9hcmQudW5zaGlmdChlbXB0eVJvdygpKTtcblx0XHR9XG5cdH07XG59XG5cbmZ1bmN0aW9uIGVtcHR5Um93KCkge1xuXHR2YXIgcm93ID0gW107XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYm9hcmQud2lkdGg7IGkrKykge1xuXHRcdHJvdy5wdXNoKDApO1xuXHR9O1xuXHRyZXR1cm4gcm93O1xufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVHaG9zdFBpZWNlKCkge1xuXHR2YXIgZ2hvc3RQaWVjZSA9IHBpZWNlLmNsb25lKCk7XG5cdHdoaWxlKGNoZWNrKGdob3N0UGllY2UuY2xvbmUoKS5nb0Rvd24oKSkpIHtcblx0XHRnaG9zdFBpZWNlLmdvRG93bigpO1xuXHR9XG5cdHJldHVybiBnaG9zdFBpZWNlO1xufVxuXG5cbmZ1bmN0aW9uIGdlbmVyYXRlQW5kQXNzaWduTmV3UGllY2UgKCl7XG5cdHBpZWNlID0gZ2VuZXJhdGVSYW5kb21QaWVjZSgpO1xuXHRjb250cm9scy51cGRhdGVQaWVjZShwaWVjZSk7XG59XG4iXX0=
