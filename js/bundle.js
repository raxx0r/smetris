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
		else if(e.keyCode == keys.SPACE) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzcvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwianMvQm9hcmQuanMiLCJqcy9Db2xsaXNpb25EZXRlY3Rpb24uanMiLCJqcy9Db2xvcnMuanMiLCJqcy9Db250cm9scy5qcyIsImpzL1BpZWNlLmpzIiwianMvUmVuZGVyZXIuanMiLCJqcy9TaGFwZXMuanMiLCJqcy9oZWxwZXJzLmpzIiwianMva2V5cy5qcyIsImpzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuXHR2YXIgYm9hcmQgPSBbXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRdO1xuXG5cdGJvYXJkLmhlaWdodCA9IGJvYXJkLmxlbmd0aDtcblx0Ym9hcmQud2lkdGggPSBib2FyZFswXS5sZW5ndGg7XG5cblx0cmV0dXJuIGJvYXJkO1xufVxuXG4iLCJ2YXIgUGllY2UgPSByZXF1aXJlKCcuL1BpZWNlLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gQ29sbGlzaW9uRGV0ZWN0aW9uKGNyZWF0ZU9wdGlvbnMpe1xuXHR2YXIgYm9hcmQgPSBjcmVhdGVPcHRpb25zLmJvYXJkO1xuXHRyZXR1cm4ge1xuXHRcdGNoZWNrOiBjaGVja1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGNoZWNrKHBpZWNlKSB7XG5cdFx0dmFyIHNoYXBlID0gcGllY2Uuc2hhcGU7XG5cdFx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgc2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRcdGlmIChzaGFwZVtyb3ddW2NvbF0gIT09IDApIHtcblx0XHRcdFx0XHR2YXIgeSA9IChwaWVjZS55ICsgcm93KTtcblx0XHRcdFx0XHR2YXIgeCA9IChwaWVjZS54ICsgY29sKTtcblx0XHRcdFx0XHRpZiAoeSA+PSBib2FyZC5oZWlnaHQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0ICAgICAgICAgICAgXHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAoYm9hcmRbeV1beF0gIT09IDAgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQgXHQvL2NoZWNrIGlmIG91dCBvZiBib3VuZHMgaGVpZ2h0XG5cdFx0XHRcdCBcdC8vY2hlY2sgaWYgb3V0b2Zib3VuZHMgcmlnaHQsIGNvbXBlbnNhdGVcblx0XHRcdFx0IFx0Ly9jaGVjayBpZiBvdXRvZmJvdW5kcyBsZWZ0LCBjb21wZW5zYXRlXG5cdFx0XHRcdCB9XG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0cmV0dXJuIHRydWU7XHRcdFxuXHR9XG5cblx0ZnVuY3Rpb24gbG9nU2hhcGUoc2hhcGUpIHtcblx0XHR2YXIgc2hhcGVTdHJpbmcgPSBcIlwiO1xuXHRcdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0XHRzaGFwZVN0cmluZyArPSBzaGFwZVtyb3ddW2NvbF07XG5cdFx0XHR9O1xuXHRcdFx0c2hhcGVTdHJpbmcgKz0gJ1xcbic7XG5cdFx0fTtcblx0XHRjb25zb2xlLmxvZyhzaGFwZVN0cmluZyk7XG5cdH1cblxuXHRmdW5jdGlvbiBsb2dQYXJ0T2ZCb2FyZChjb3B5KSB7XG5cdFx0dmFyIGJvYXJkU3RyaW5nID0gXCJcIjtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCAzOyByb3crKykge1xuXHRcdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgMzsgY29sKyspIHtcblx0XHRcdFx0dmFyIHggPSAoY29weS54ICsgY29sKTtcblx0XHRcdFx0dmFyIHkgPSAoY29weS55ICsgcm93KTtcblx0XHRcdFx0Ym9hcmRTdHJpbmcgKz0gYm9hcmRbeV1beF07XG5cdFx0XHR9O1xuXHRcdFx0Ym9hcmRTdHJpbmcgKz0gJ1xcbic7XG5cdFx0fTtcblx0XHRjb25zb2xlLmxvZyhib2FyZFN0cmluZyk7XG5cdH1cblxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gQ29sb3JzKCkge1xuXHRyZXR1cm4ge1xuXHRcdCdJJzogJyMyN0RFRkYnLCAvL2xqdXNibMOlXG5cdFx0J0onOiAnIzNDNjZGRicsIC8vYmzDpVxuXHRcdCdMJzogJyNFODc0MEMnLCAvL29yYW5nZVxuXHRcdCdPJzogJyNGRkQ3MEQnLCAvL2d1bFxuXHRcdCdTJzogJyMyNkZGMDAnLCAvL2dyw7ZuXG5cdFx0J1QnOiAnIzlFMENFOCcsIC8vbGlsYVxuXHRcdCdaJzogJyNGRjAwMDAnICAvL3LDtmRcblx0fVxufSIsInZhciBrZXlzID0gcmVxdWlyZSgnLi9rZXlzLmpzJyk7XG52YXIgUGllY2UgPSByZXF1aXJlKCcuL1BpZWNlLmpzJylcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gQ29udHJvbHMoY3JlYXRlT3B0aW9ucykge1xuXHR2YXIgcGllY2UgPSBjcmVhdGVPcHRpb25zLnBpZWNlO1xuXHR2YXIgY2hlY2sgPSBjcmVhdGVPcHRpb25zLmNoZWNrO1xuXHR2YXIgc3RpdGNoUGllY2VUb0JvYXJkID0gY3JlYXRlT3B0aW9ucy5zdGl0Y2hQaWVjZVRvQm9hcmQ7XG5cdHZhciBnZW5lcmF0ZVJhbmRvbVBpZWNlID0gY3JlYXRlT3B0aW9ucy5nZW5lcmF0ZVJhbmRvbVBpZWNlO1xuXHR2YXIgZ2VuZXJhdGVBbmRBc3NpZ25OZXdQaWVjZSA9IGNyZWF0ZU9wdGlvbnMuZ2VuZXJhdGVBbmRBc3NpZ25OZXdQaWVjZTtcblx0dmFyIHJlbW92ZUxpbmVzID0gY3JlYXRlT3B0aW9ucy5yZW1vdmVMaW5lcztcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXQsXG5cdFx0dXBkYXRlUGllY2U6IHVwZGF0ZVBpZWNlXG5cdH1cblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdCQoZG9jdW1lbnQpLm9uKCdrZXlkb3duJywga2V5UHJlc3NlZCk7XG5cdH1cblxuXHRmdW5jdGlvbiB1cGRhdGVQaWVjZShuZXdQaWVjZSkge1xuXHRcdHBpZWNlID0gbmV3UGllY2U7XG5cdH1cblxuXHRmdW5jdGlvbiBrZXlQcmVzc2VkKGUpIHtcblxuXHRcdGlmIChlLmtleUNvZGUgPT0ga2V5cy5SSUdIVCkge1xuXHRcdFx0aWYgKGNoZWNrKHBpZWNlLmNsb25lKCkuZ29SaWdodCgpKSkge1xuXHRcdFx0XHRwaWVjZS5nb1JpZ2h0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGUua2V5Q29kZSA9PSBrZXlzLkxFRlQpIHtcblx0XHRcdGlmIChjaGVjayhwaWVjZS5jbG9uZSgpLmdvTGVmdCgpKSkge1xuXHRcdFx0XHRwaWVjZS5nb0xlZnQoKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAoZS5rZXlDb2RlID09IGtleXMuVVApIHtcblx0XHRcdGlmIChjaGVjayhwaWVjZS5jbG9uZSgpLnJvdGF0ZSgpKSkge1xuXHRcdFx0XHRwaWVjZS5yb3RhdGUoKTtcblx0XHRcdCB9XG5cdFx0fVxuXHRcdGVsc2UgaWYoZS5rZXlDb2RlID09IGtleXMuRE9XTikge1xuXHRcdFx0aWYgKGNoZWNrKHBpZWNlLmNsb25lKCkuZ29Eb3duKCkpKSB7XG5cdFx0XHRcdHBpZWNlLmdvRG93bigpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgaWYoZS5rZXlDb2RlID09IGtleXMuU1BBQ0UpIHtcblx0XHRcdHZhciBuZXdQaWVjZSA9IHBpZWNlLmNsb25lKCk7XG5cdFx0XHR3aGlsZShjaGVjayhuZXdQaWVjZS5jbG9uZSgpLmdvRG93bigpKSkge1xuXHRcdFx0XHRuZXdQaWVjZS5nb0Rvd24oKTtcblx0XHRcdH1cblx0XHRcdHN0aXRjaFBpZWNlVG9Cb2FyZChuZXdQaWVjZSk7XG5cdFx0XHRyZW1vdmVMaW5lcygpO1xuXHRcdFx0Z2VuZXJhdGVBbmRBc3NpZ25OZXdQaWVjZSgpO1xuXG5cdFx0fVxuXHR9XG5cbn0iLCJ2YXIgU2hhcGVzID0gcmVxdWlyZSgnLi9TaGFwZXMuanMnKTtcblxuZnVuY3Rpb24gUGllY2Uob3B0aW9ucykge1xuXHR0aGlzLnR5cGUgPSBvcHRpb25zLnR5cGU7XG5cdHRoaXMueCA9IG9wdGlvbnMueCB8fCAwO1xuXHR0aGlzLnkgPSBvcHRpb25zLnkgfHwgMDtcdFxuXHR0aGlzLnNoYXBlID0gb3B0aW9ucy5zaGFwZSB8fCBTaGFwZXNbdGhpcy50eXBlXS5zaGFwZTtcblx0dGhpcy5waXZvdFBvaW50ID0gU2hhcGVzW3RoaXMudHlwZV0ucGl2b3RQb2ludDtcblxuXHRyZXR1cm47XG59XG5cblBpZWNlLnByb3RvdHlwZS5nb1JpZ2h0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMueCsrO1xuXHRyZXR1cm4gdGhpcztcbn1cblxuUGllY2UucHJvdG90eXBlLmdvTGVmdCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLngtLTtcblx0cmV0dXJuIHRoaXM7XG59XG5cblxuUGllY2UucHJvdG90eXBlLmdvRG93biA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnkrKztcblx0cmV0dXJuIHRoaXM7XG59XG5cblBpZWNlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gbmV3IFBpZWNlKHRoaXMpO1xufVxuXG5QaWVjZS5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuc2hhcGUgPSByb3RhdGlvbih0aGlzLnNoYXBlKTtcblx0cmV0dXJuIHRoaXM7XG59XG5cbmZ1bmN0aW9uIHJvdGF0aW9uKHNoYXBlKSB7XG5cdHZhciBuID0gW107XG5cdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHR2YXIgcCA9IFtdO1xuXHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0cC5wdXNoKHNoYXBlW3NoYXBlLmxlbmd0aCAtIGNvbCAtIDFdW3Jvd10pO1xuXHRcdH07XG5cdFx0bi5wdXNoKHApXG5cdH07XG5cdHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBsb2dTaGFwZShzaGFwZSkge1xuXHR2YXIgc2hhcGVTdHJpbmcgPSBcIlwiO1xuXHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBcdHNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBcdHNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0c2hhcGVTdHJpbmcgKz0gXHRzaGFwZVtyb3ddW2NvbF07XG5cdFx0fTtcblx0XHRzaGFwZVN0cmluZyArPSAnXFxuJztcblx0fTtcblx0Y29uc29sZS5sb2coc2hhcGVTdHJpbmcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBpZWNlOyIsInZhciBjb2xvckx1bWluYW5jZSA9IHJlcXVpcmUoJy4vaGVscGVycy5qcycpLmNvbG9yTHVtaW5hbmNlO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUmVuZGVyZXIob3B0aW9ucykge1xuXHR2YXIgYm9hcmQgPSBvcHRpb25zLmJvYXJkO1xuXHR2YXIgY29sb3JzID0gb3B0aW9ucy5jb2xvcnM7XG5cdHZhciBjb2xvckluZGV4ZXMgPSBbJ0knLCAnSicsICdMJywgJ08nLCAnUycsICdUJywgJ1onXTtcblx0Ym9hcmQuaGVpZ2h0ID0gYm9hcmQubGVuZ3RoO1xuXHRib2FyZC53aWR0aCA9IGJvYXJkWzBdLmxlbmd0aDtcblx0dmFyIGNvbnRleHQ7XG5cdHZhciBjYW52YXM7XG5cdHZhciBzaXplO1xuXHR2YXIgc2l6ZXBhZGRpbmcgPSAxO1xuXHRzcXVhcmUgPSB7fTtcblx0aW5pdCgpO1xuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXQsXG5cdFx0cmVuZGVyOiByZW5kZXIsXG5cdFx0ZmlsbFNxdWFyZTogZmlsbFNxdWFyZVxuXHR9O1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0Y2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtY2FudmFzJyk7XG5cdFx0Y29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdC8vY29udGV4dC5zY2FsZSgyLDIpO1xuXHRcdGNhbGN1bGF0ZVNxdWFyZVNpemUoKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gcmVuZGVyKHBpZWNlLCBnaG9zdFBpZWNlKSB7XG5cdFx0Y2xlYXIoKTtcblx0XHRyZW5kZXJCb2FyZCgpO1xuXHRcdHJlbmRlckdob3N0UGllY2UoZ2hvc3RQaWVjZSk7XG5cdFx0cmVuZGVyTW92aW5nUGllY2UocGllY2UpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVuZGVyQm9hcmQoKSB7XG5cdFx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgYm9hcmQubGVuZ3RoOyByb3crKykge1xuXHRcdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgYm9hcmRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRcdGlmKGJvYXJkW3Jvd11bY29sXSAhPT0gMCkge1xuXHRcdFx0XHRcdHJlbmRlckZvcmVncm91bmRTcXVhcmUocm93LCBjb2wpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHZhciBiZyA9ICcjZWVlJztcblx0XHRcdFx0XHR2YXIgYmcyID0gJyNmZmYnO1xuXHRcdFx0XHRcdGlmKCAocm93K2NvbCkgJSAyID09IDAgKXtcblx0XHRcdFx0XHRcdGJnID0gYmcyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0YmcgPSBiZztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVuZGVyU3F1YXJlKGNvbCwgcm93LCB7XG5cdFx0XHRcdFx0XHRiZzogYmcsXG5cdFx0XHRcdFx0XHQvL3N0cm9rZTpmYWxzZVxuXHRcdFx0XHRcdFx0c3Ryb2tlVGhpY2tuZXNzOiAwLjMsXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlbmRlckZvcmVncm91bmRTcXVhcmUocm93LCBjb2wpIHtcblx0XHR2YXIgYmxvY2tUeXBlID0gY29sb3JJbmRleGVzIFsgKGJvYXJkW3Jvd11bY29sXS0xKSBdO1xuXHRcdHZhciBiZyA9IGNvbG9yc1tibG9ja1R5cGVdO1xuXHRcdHZhciBzdHJva2VDb2xvciA9IGNvbG9yTHVtaW5hbmNlKGJnLCAtMC4yKTtcblx0XHR2YXIgc3Ryb2tlVGhpY2tuZXNzID0gMi41O1xuXHRcdHJlbmRlclNxdWFyZShjb2wsIHJvdywge1xuXHRcdFx0Ymc6IGJnLCBcblx0XHRcdHN0cm9rZUNvbG9yOiBzdHJva2VDb2xvcixcblx0XHRcdHN0cm9rZVRoaWNrbmVzczogc3Ryb2tlVGhpY2tuZXNzXG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXJNb3ZpbmdQaWVjZShwaWVjZSkge1xuXHRcdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHBpZWNlLnNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHBpZWNlLnNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0XHR2YXIgeCA9IChwaWVjZS54ICsgY29sKTtcblx0XHRcdFx0dmFyIHkgPSAocGllY2UueSArIHJvdyk7XG5cdFx0XHRcdHZhciBiZyA9IGNvbG9yc1twaWVjZS50eXBlXTtcblx0XHRcdFx0dmFyIHN0cm9rZUNvbG9yID0gY29sb3JMdW1pbmFuY2UoYmcsIC0wLjEpO1xuXHRcdFx0XHRpZiggcGllY2Uuc2hhcGVbcm93XVtjb2xdICE9PSAwICkge1xuXHRcdFx0XHRcdHJlbmRlclNxdWFyZSh4LCB5LCB7XG5cdFx0XHRcdFx0XHRiZzogYmcsXG5cdFx0XHRcdFx0XHRzdHJva2VDb2xvcjogc3Ryb2tlQ29sb3Jcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdH07XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlbmRlckdob3N0UGllY2UocGllY2UpIHtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBwaWVjZS5zaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBwaWVjZS5zaGFwZVtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdFx0dmFyIHggPSAocGllY2UueCArIGNvbCk7XG5cdFx0XHRcdHZhciB5ID0gKHBpZWNlLnkgKyByb3cpO1xuXHRcdFx0XHR2YXIgYmcgPSBjb2xvcnNbcGllY2UudHlwZV07XG5cdFx0XHRcdHZhciBzdHJva2VDb2xvciA9IGNvbG9yTHVtaW5hbmNlKGJnLCAtMC4xKTtcblx0XHRcdFx0aWYoIHBpZWNlLnNoYXBlW3Jvd11bY29sXSAhPT0gMCApIHtcblx0XHRcdFx0XHRyZW5kZXJTcXVhcmUoeCwgeSwge1xuXHRcdFx0XHRcdFx0Ymc6ICdyZ2JhKDEwMCwgMTAwLCAxMDAsIDAuNiknLFxuXHRcdFx0XHRcdFx0c3Ryb2tlOiBmYWxzZVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHR9O1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXJTcXVhcmUoaSwgaiwgb3B0aW9ucykge1xuXHRcdGZpbGxTcXVhcmUoc3F1YXJlLndpZHRoICogaSwgc3F1YXJlLmhlaWdodCAqIGosIG9wdGlvbnMpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZmlsbFNxdWFyZSh4LCB5LCBvcHRpb25zKSB7XG5cdFx0dmFyIHN0cm9rZSA9ICgob3B0aW9ucy5zdHJva2UgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnN0cm9rZSA6IHRydWUpO1xuXHRcdHZhciBzdHJva2VDb2xvciA9IG9wdGlvbnMuc3Ryb2tlQ29sb3IgfHwgJyNjY2MnO1xuXHRcdHZhciBzdHJva2VUaGlja25lc3MgPSBvcHRpb25zLnN0cm9rZVRoaWNrbmVzcyB8fCAyLjU7XG5cblx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IG9wdGlvbnMuYmc7XG5cdFx0Y29udGV4dC5maWxsUmVjdCh4KnNpemVwYWRkaW5nLCB5KnNpemVwYWRkaW5nLCBzcXVhcmUud2lkdGgsIHNxdWFyZS5oZWlnaHQpO1xuXHRcdFxuXHRcdGlmKHN0cm9rZSkge1xuXHRcdFx0Y29udGV4dC5zdHJva2VTdHlsZSA9IHN0cm9rZUNvbG9yO1xuXHRcdFx0Y29udGV4dC5saW5lV2lkdGggPSBzdHJva2VUaGlja25lc3M7XG5cdFx0XHRjb250ZXh0LnN0cm9rZVJlY3QoeCArIHN0cm9rZVRoaWNrbmVzcyAqIDAuNSwgeSArIHN0cm9rZVRoaWNrbmVzcyAqIDAuNSwgc3F1YXJlLndpZHRoIC0gc3Ryb2tlVGhpY2tuZXNzLCBzcXVhcmUuaGVpZ2h0IC0gc3Ryb2tlVGhpY2tuZXNzKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBjYWxjdWxhdGVTcXVhcmVTaXplKCkge1xuXHRcdHNxdWFyZS53aWR0aCA9IGNhbnZhcy53aWR0aCAvIGJvYXJkLndpZHRoO1xuXHRcdHNxdWFyZS5oZWlnaHQgPSBjYW52YXMuaGVpZ2h0IC8gYm9hcmQuaGVpZ2h0O1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjbGVhcigpIHtcblx0XHRjb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRcdGNvbnRleHQuY2xlYXJSZWN0ICggMCAsIDAgLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQgKTtcblx0fVxufSIsInZhciBTaGFwZXMgPSBtb2R1bGUuZXhwb3J0cyA9IHtcblx0J0knOiB7XG5cdFx0c2hhcGU6IFsgWzAsIDAsIDAsIDBdLCBbMSwgMSwgMSwgMV0sIFswLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDBdIF1cblx0fSxcblx0J0onOiB7XG5cdFx0c2hhcGU6IFsgWzAsIDAsIDBdLCBbMSwgMSwgMV0sIFswLCAwLCAxXSBdXG5cdH0sXG5cdCdMJzoge1xuXHRcdHNoYXBlOiBbIFswLCAwLCAwXSwgWzEsIDEsIDFdLCBbMSwgMCwgMF0gXVxuXHR9LFxuXHQnTyc6IHtcblx0XHRzaGFwZTogWyBbMSwgMV0sIFsxLCAxXSBdXG5cdH0sXG5cdCdTJzoge1xuXHRcdHNoYXBlOiBbIFswLCAxLCAxXSwgWzEsIDEsIDBdLCBbMCwgMCwgMF0gXVxuXHR9LFxuXHQnVCc6IHtcblx0XHRzaGFwZTogWyBbMCwgMSwgMF0sIFsxLCAxLCAxXSwgWzAsIDAsIDBdIF1cblx0fSxcblx0J1onOiB7XG5cdFx0c2hhcGU6IFsgWzEsIDEsIDBdLCBbMCwgMSwgMV0sIFswLCAwLCAwXSBdXG5cdH1cbn07XG4iLCJcblxuZnVuY3Rpb24gY29sb3JMdW1pbmFuY2UoaGV4LCBsdW0pIHtcblxuXHQvLyB2YWxpZGF0ZSBoZXggc3RyaW5nXG5cdGhleCA9IFN0cmluZyhoZXgpLnJlcGxhY2UoL1teMC05YS1mXS9naSwgJycpO1xuXHRpZiAoaGV4Lmxlbmd0aCA8IDYpIHtcblx0XHRoZXggPSBoZXhbMF0raGV4WzBdK2hleFsxXStoZXhbMV0raGV4WzJdK2hleFsyXTtcblx0fVxuXHRsdW0gPSBsdW0gfHwgMDtcblxuXHQvLyBjb252ZXJ0IHRvIGRlY2ltYWwgYW5kIGNoYW5nZSBsdW1pbm9zaXR5XG5cdHZhciByZ2IgPSBcIiNcIiwgYywgaTtcblx0Zm9yIChpID0gMDsgaSA8IDM7IGkrKykge1xuXHRcdGMgPSBwYXJzZUludChoZXguc3Vic3RyKGkqMiwyKSwgMTYpO1xuXHRcdGMgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KDAsIGMgKyAoYyAqIGx1bSkpLCAyNTUpKS50b1N0cmluZygxNik7XG5cdFx0cmdiICs9IChcIjAwXCIrYykuc3Vic3RyKGMubGVuZ3RoKTtcblx0fVxuXG5cdHJldHVybiByZ2I7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGNvbG9yTHVtaW5hbmNlOiBjb2xvckx1bWluYW5jZVxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRTUEFDRTogMzIsXG5cdExFRlQ6IDM3LFxuXHRSSUdIVDogMzksXG5cdFVQOiAzOCxcblx0RE9XTjogNDAsXG5cdFNISUZUOiAxNlxufTsiLCJ2YXIgQm9hcmQgPSByZXF1aXJlKCcuL0JvYXJkLmpzJyk7XG52YXIgUGllY2UgPSByZXF1aXJlKCcuL1BpZWNlLmpzJyk7XG52YXIgQ29sb3JzID0gcmVxdWlyZSgnLi9Db2xvcnMuanMnKTtcbnZhciBDb2xsaXNpb25EZXRlY3Rpb24gPSByZXF1aXJlKCcuL0NvbGxpc2lvbkRldGVjdGlvbi5qcycpO1xudmFyIENvbnRyb2xzID0gcmVxdWlyZSgnLi9Db250cm9scy5qcycpO1xudmFyIFJlbmRlcmVyID0gcmVxdWlyZSgnLi9SZW5kZXJlci5qcycpO1xuXG52YXIgY29sb3JzID0gQ29sb3JzKCk7XG52YXIgYm9hcmQgPSBCb2FyZCgpO1xudmFyIHBpZWNlID0gbmV3IFBpZWNlKHt0eXBlOiAnSSd9KTtcbnZhciBibG9ja3MgPSBbJ0knLCAnSicsICdMJywgJ08nLCAnUycsICdUJywgJ1onXTtcbnZhciBjb2xsaXNpb25EZXRlY3Rpb24gPSBDb2xsaXNpb25EZXRlY3Rpb24oe1xuXHRib2FyZDogYm9hcmRcbn0pO1xudmFyIGNoZWNrID0gY29sbGlzaW9uRGV0ZWN0aW9uLmNoZWNrO1xuXG52YXIgcmVuZGVyZXIgPSBSZW5kZXJlcih7Ym9hcmQ6IGJvYXJkLCBjb2xvcnM6IGNvbG9yc30pO1xudmFyIGNvbnRyb2xzID0gQ29udHJvbHMoe1xuXHRwaWVjZTogcGllY2UsXG5cdGNoZWNrOmNoZWNrLFxuXHRzdGl0Y2hQaWVjZVRvQm9hcmQ6c3RpdGNoUGllY2VUb0JvYXJkLFxuXHRnZW5lcmF0ZUFuZEFzc2lnbk5ld1BpZWNlOiBnZW5lcmF0ZUFuZEFzc2lnbk5ld1BpZWNlLFxuXHRyZW1vdmVMaW5lczogcmVtb3ZlTGluZXNcbn0pO1xuY29udHJvbHMuaW5pdCgpO1xuXG5cbnNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuXG5cdGlmIChjaGVjayhwaWVjZS5jbG9uZSgpLmdvRG93bigpKSkge1xuXHRcdHBpZWNlLmdvRG93bigpO1xuXHR9IFxuXHRlbHNlIHtcblx0XHQvL3dhaXQgZm9yIHVzZXIgbm8gaW5wdXQgYW5kIHNwZWNpZmllZCBzZWNvbmRzXG5cdFx0c3RpdGNoUGllY2VUb0JvYXJkKHBpZWNlKTtcblx0XHRyZW1vdmVMaW5lcygpO1xuXHRcdHBpZWNlID0gZ2VuZXJhdGVSYW5kb21QaWVjZSgpO1xuXHRcdGNvbnRyb2xzLnVwZGF0ZVBpZWNlKHBpZWNlKTtcblx0fVxuXG59LCA1MDApO1xuXG5cbnZhciByZW5kZXJUb2tlbiA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuXHR2YXIgZ2hvc3RQaWVjZSA9IGNhbGN1bGF0ZUdob3N0UGllY2UoKTtcblx0cmVuZGVyZXIucmVuZGVyKHBpZWNlLCBnaG9zdFBpZWNlKTtcbn0sIDUwKTtcblxuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVBpZWNlICgpIHtcblx0dmFyIHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGJsb2Nrcy5sZW5ndGgpO1xuXHR2YXIgcCA9IG5ldyBQaWVjZSh7dHlwZTogYmxvY2tzW3JhbmRvbV19KTtcblx0cmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIHN0aXRjaFBpZWNlVG9Cb2FyZChwaWVjZSkge1xuXHR2YXIgc2hhcGUgPSBwaWVjZS5zaGFwZTtcblx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgc2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0aWYoc2hhcGVbcm93XVtjb2xdICE9PSAwKSB7XG5cdFx0XHRcdHZhciB4ID0gcGllY2UueCArIGNvbDtcblx0XHRcdFx0dmFyIHkgPSBwaWVjZS55ICsgcm93O1xuXHRcdFx0XHR2YXIgaW5kZXggPSBibG9ja3MuaW5kZXhPZihwaWVjZS50eXBlKSArIDE7XG5cdFx0XHRcdFx0Ym9hcmRbeV1beF0gPSBpbmRleDtcblx0XHRcdH1cblx0XHR9O1xuXHR9O1xufVxuXG5mdW5jdGlvbiByZW1vdmVMaW5lcygpIHtcblx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgYm9hcmQubGVuZ3RoOyByb3crKykge1xuXHRcdHZhciBmdWxsTGluZSA9IChfLm1pbihib2FyZFtyb3ddKSAhPT0gMCk7XG5cdFx0aWYoZnVsbExpbmUpIHtcblx0XHRcdGJvYXJkLnNwbGljZShyb3csMSk7XG5cdFx0XHRib2FyZC51bnNoaWZ0KGVtcHR5Um93KCkpO1xuXHRcdH1cblx0fTtcbn1cblxuZnVuY3Rpb24gZW1wdHlSb3coKSB7XG5cdHZhciByb3cgPSBbXTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBib2FyZC53aWR0aDsgaSsrKSB7XG5cdFx0cm93LnB1c2goMCk7XG5cdH07XG5cdHJldHVybiByb3c7XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZUdob3N0UGllY2UoKSB7XG5cdHZhciBnaG9zdFBpZWNlID0gcGllY2UuY2xvbmUoKTtcblx0d2hpbGUoY2hlY2soZ2hvc3RQaWVjZS5jbG9uZSgpLmdvRG93bigpKSkge1xuXHRcdGdob3N0UGllY2UuZ29Eb3duKCk7XG5cdH1cblx0cmV0dXJuIGdob3N0UGllY2U7XG59XG5cblxuZnVuY3Rpb24gZ2VuZXJhdGVBbmRBc3NpZ25OZXdQaWVjZSAoKXtcblx0cGllY2UgPSBnZW5lcmF0ZVJhbmRvbVBpZWNlKCk7XG5cdGNvbnRyb2xzLnVwZGF0ZVBpZWNlKHBpZWNlKTtcbn1cbiJdfQ==
