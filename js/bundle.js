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
	var board = createOptions.board;
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
		if (e.keyCode == keys.UP)  {
			wallKick(piece.rotate());
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

		if(_.min(xs) < 0) {
			piece.x -= _.min(xs);
		}
		if(_.max(xs) > (board.width-1)) {
			var diff = (_.max(xs) +1 - board.width);
			piece.x -= diff;
		}
		if(_.max(ys)> (board.height-1)) {
			var diff = (_.max(ys) +1 - board.height);
			piece.y -= diff;			
		}

		return piece;

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
	board: board,
	stitchPieceToBoard:stitchPieceToBoard,
	generateAndAssignNewPiece: generateAndAssignNewPiece,
	removeLines: removeLines
});
controls.init();

var points = [40, 100, 300, 1200];
var score = 0;
$('#score').val(score);

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
		x: 3,
		y: 0 
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

},{"./Board.js":1,"./CollisionDetection.js":2,"./Colors.js":3,"./Controls.js":4,"./Piece.js":5,"./Renderer.js":6}]},{},[10])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzcvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwianMvQm9hcmQuanMiLCJqcy9Db2xsaXNpb25EZXRlY3Rpb24uanMiLCJqcy9Db2xvcnMuanMiLCJqcy9Db250cm9scy5qcyIsImpzL1BpZWNlLmpzIiwianMvUmVuZGVyZXIuanMiLCJqcy9TaGFwZXMuanMiLCJqcy9oZWxwZXJzLmpzIiwianMva2V5cy5qcyIsImpzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuXG5cdHZhciBib2FyZCA9IFtcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRcdFswLDAsMCwwLDAsMCwwLDAsMCwwXSxcblx0XHRbMCwwLDAsMCwwLDAsMCwwLDAsMF0sXG5cdFx0WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFxuXHRdO1xuXG5cdGJvYXJkLmhlaWdodCA9IGJvYXJkLmxlbmd0aDtcblx0Ym9hcmQud2lkdGggPSBib2FyZFswXS5sZW5ndGg7XG5cblx0cmV0dXJuIGJvYXJkO1xufVxuXG4iLCJ2YXIgUGllY2UgPSByZXF1aXJlKCcuL1BpZWNlLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gQ29sbGlzaW9uRGV0ZWN0aW9uKGNyZWF0ZU9wdGlvbnMpe1xuXHR2YXIgYm9hcmQgPSBjcmVhdGVPcHRpb25zLmJvYXJkO1xuXHRyZXR1cm4ge1xuXHRcdGNoZWNrOiBjaGVja1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGNoZWNrKHBpZWNlKSB7XG5cdFx0dmFyIHNoYXBlID0gcGllY2Uuc2hhcGU7XG5cdFx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgc2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRcdGlmIChzaGFwZVtyb3ddW2NvbF0gIT09IDApIHtcblx0XHRcdFx0XHR2YXIgeSA9IChwaWVjZS55ICsgcm93KTtcblx0XHRcdFx0XHR2YXIgeCA9IChwaWVjZS54ICsgY29sKTtcblx0XHRcdFx0XHRpZiAoeSA+PSBib2FyZC5oZWlnaHQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0ICAgICAgICAgICAgXHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAoYm9hcmRbeV1beF0gIT09IDAgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQgfVxuXHRcdFx0fTtcblx0XHR9O1xuXHRcdHJldHVybiB0cnVlO1x0XHRcblx0fVxuXG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBDb2xvcnMoKSB7XG5cdHJldHVybiB7XG5cdFx0J0knOiAnIzI3REVGRicsIC8vbGp1c2Jsw6Vcblx0XHQnSic6ICcjM0M2NkZGJywgLy9ibMOlXG5cdFx0J0wnOiAnI0U4NzQwQycsIC8vb3JhbmdlXG5cdFx0J08nOiAnI0ZGRDcwRCcsIC8vZ3VsXG5cdFx0J1MnOiAnIzI2RkYwMCcsIC8vZ3LDtm5cblx0XHQnVCc6ICcjOUUwQ0U4JywgLy9saWxhXG5cdFx0J1onOiAnI0ZGMDAwMCcgIC8vcsO2ZFxuXHR9XG59IiwidmFyIGtleXMgPSByZXF1aXJlKCcuL2tleXMuanMnKTtcbnZhciBQaWVjZSA9IHJlcXVpcmUoJy4vUGllY2UuanMnKVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBDb250cm9scyhjcmVhdGVPcHRpb25zKSB7XG5cdHZhciBib2FyZCA9IGNyZWF0ZU9wdGlvbnMuYm9hcmQ7XG5cdHZhciBwaWVjZSA9IGNyZWF0ZU9wdGlvbnMucGllY2U7XG5cdHZhciBjaGVjayA9IGNyZWF0ZU9wdGlvbnMuY2hlY2s7XG5cdHZhciBzdGl0Y2hQaWVjZVRvQm9hcmQgPSBjcmVhdGVPcHRpb25zLnN0aXRjaFBpZWNlVG9Cb2FyZDtcblx0dmFyIGdlbmVyYXRlUmFuZG9tUGllY2UgPSBjcmVhdGVPcHRpb25zLmdlbmVyYXRlUmFuZG9tUGllY2U7XG5cdHZhciBnZW5lcmF0ZUFuZEFzc2lnbk5ld1BpZWNlID0gY3JlYXRlT3B0aW9ucy5nZW5lcmF0ZUFuZEFzc2lnbk5ld1BpZWNlO1xuXHR2YXIgcmVtb3ZlTGluZXMgPSBjcmVhdGVPcHRpb25zLnJlbW92ZUxpbmVzO1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdCxcblx0XHR1cGRhdGVQaWVjZTogdXBkYXRlUGllY2Vcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0JChkb2N1bWVudCkub24oJ2tleWRvd24nLCBrZXlQcmVzc2VkKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHVwZGF0ZVBpZWNlKG5ld1BpZWNlKSB7XG5cdFx0cGllY2UgPSBuZXdQaWVjZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGtleVByZXNzZWQoZSkge1xuXG5cdFx0aWYgKGUua2V5Q29kZSA9PSBrZXlzLlJJR0hUKSB7XG5cdFx0XHRpZiAoY2hlY2socGllY2UuY2xvbmUoKS5nb1JpZ2h0KCkpKSB7XG5cdFx0XHRcdHBpZWNlLmdvUmlnaHQoKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGUua2V5Q29kZSA9PSBrZXlzLkxFRlQpIHtcblx0XHRcdGlmIChjaGVjayhwaWVjZS5jbG9uZSgpLmdvTGVmdCgpKSkge1xuXHRcdFx0XHRwaWVjZS5nb0xlZnQoKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGUua2V5Q29kZSA9PSBrZXlzLlVQKSAge1xuXHRcdFx0d2FsbEtpY2socGllY2Uucm90YXRlKCkpO1xuXHRcdH1cblx0XHRpZihlLmtleUNvZGUgPT0ga2V5cy5ET1dOKSB7XG5cdFx0XHRpZiAoY2hlY2socGllY2UuY2xvbmUoKS5nb0Rvd24oKSkpIHtcblx0XHRcdFx0cGllY2UuZ29Eb3duKClcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZS5rZXlDb2RlID09IGtleXMuU1BBQ0UpIHtcblx0XHRcdHZhciBuZXdQaWVjZSA9IHBpZWNlLmNsb25lKCk7XG5cdFx0XHR3aGlsZShjaGVjayhuZXdQaWVjZS5jbG9uZSgpLmdvRG93bigpKSkge1xuXHRcdFx0XHRuZXdQaWVjZS5nb0Rvd24oKTtcblx0XHRcdH1cblx0XHRcdHN0aXRjaFBpZWNlVG9Cb2FyZChuZXdQaWVjZSk7XG5cdFx0XHRyZW1vdmVMaW5lcygpO1xuXHRcdFx0Z2VuZXJhdGVBbmRBc3NpZ25OZXdQaWVjZSgpO1xuXG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gd2FsbEtpY2socGllY2UpIHtcblx0XHR2YXIgc2hhcGUgPSBwaWVjZS5zaGFwZTtcblx0XHR2YXIgeHMgPVtdO1xuXHRcdHZhciB5cyA9W107XG5cdFx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgc2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRcdGlmKHNoYXBlW3Jvd11bY29sXSAhPT0gMCkge1xuXHRcdFx0XHRcdHhzLnB1c2gocGllY2UueCArIGNvbCk7XG5cdFx0XHRcdFx0eXMucHVzaChwaWVjZS55ICsgcm93KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9O1xuXG5cdFx0aWYoXy5taW4oeHMpIDwgMCkge1xuXHRcdFx0cGllY2UueCAtPSBfLm1pbih4cyk7XG5cdFx0fVxuXHRcdGlmKF8ubWF4KHhzKSA+IChib2FyZC53aWR0aC0xKSkge1xuXHRcdFx0dmFyIGRpZmYgPSAoXy5tYXgoeHMpICsxIC0gYm9hcmQud2lkdGgpO1xuXHRcdFx0cGllY2UueCAtPSBkaWZmO1xuXHRcdH1cblx0XHRpZihfLm1heCh5cyk+IChib2FyZC5oZWlnaHQtMSkpIHtcblx0XHRcdHZhciBkaWZmID0gKF8ubWF4KHlzKSArMSAtIGJvYXJkLmhlaWdodCk7XG5cdFx0XHRwaWVjZS55IC09IGRpZmY7XHRcdFx0XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBpZWNlO1xuXG5cdH1cblxufSIsInZhciBTaGFwZXMgPSByZXF1aXJlKCcuL1NoYXBlcy5qcycpO1xuXG5mdW5jdGlvbiBQaWVjZShvcHRpb25zKSB7XG5cdHRoaXMudHlwZSA9IG9wdGlvbnMudHlwZTtcblx0dGhpcy54ID0gb3B0aW9ucy54IHx8IDA7XG5cdHRoaXMueSA9IG9wdGlvbnMueSB8fCAwO1x0XG5cdHRoaXMuc2hhcGUgPSBvcHRpb25zLnNoYXBlIHx8IFNoYXBlc1t0aGlzLnR5cGVdLnNoYXBlO1xuXHR0aGlzLnBpdm90UG9pbnQgPSBTaGFwZXNbdGhpcy50eXBlXS5waXZvdFBvaW50O1xuXG5cdHJldHVybjtcbn1cblxuUGllY2UucHJvdG90eXBlLmdvUmlnaHQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy54Kys7XG5cdHJldHVybiB0aGlzO1xufVxuXG5QaWVjZS5wcm90b3R5cGUuZ29MZWZ0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMueC0tO1xuXHRyZXR1cm4gdGhpcztcbn1cblxuXG5QaWVjZS5wcm90b3R5cGUuZ29Eb3duID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMueSsrO1xuXHRyZXR1cm4gdGhpcztcbn1cblxuUGllY2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBuZXcgUGllY2UodGhpcyk7XG59XG5cblBpZWNlLnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5zaGFwZSA9IHJvdGF0aW9uKHRoaXMuc2hhcGUpO1xuXHRyZXR1cm4gdGhpcztcbn1cblxuZnVuY3Rpb24gcm90YXRpb24oc2hhcGUpIHtcblx0dmFyIG4gPSBbXTtcblx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgc2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdHZhciBwID0gW107XG5cdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRwLnB1c2goc2hhcGVbc2hhcGUubGVuZ3RoIC0gY29sIC0gMV1bcm93XSk7XG5cdFx0fTtcblx0XHRuLnB1c2gocClcblx0fTtcblx0cmV0dXJuIG47XG59XG5cbmZ1bmN0aW9uIGxvZ1NoYXBlKHNoYXBlKSB7XG5cdHZhciBzaGFwZVN0cmluZyA9IFwiXCI7XG5cdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IFx0c2hhcGUubGVuZ3RoOyByb3crKykge1xuXHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IFx0c2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRzaGFwZVN0cmluZyArPSBcdHNoYXBlW3Jvd11bY29sXTtcblx0XHR9O1xuXHRcdHNoYXBlU3RyaW5nICs9ICdcXG4nO1xuXHR9O1xuXHRjb25zb2xlLmxvZyhzaGFwZVN0cmluZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGllY2U7IiwidmFyIGNvbG9yTHVtaW5hbmNlID0gcmVxdWlyZSgnLi9oZWxwZXJzLmpzJykuY29sb3JMdW1pbmFuY2U7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBSZW5kZXJlcihvcHRpb25zKSB7XG5cdHZhciBib2FyZCA9IG9wdGlvbnMuYm9hcmQ7XG5cdHZhciBjb2xvcnMgPSBvcHRpb25zLmNvbG9ycztcblx0dmFyIGNvbG9ySW5kZXhlcyA9IFsnSScsICdKJywgJ0wnLCAnTycsICdTJywgJ1QnLCAnWiddO1xuXHRib2FyZC5oZWlnaHQgPSBib2FyZC5sZW5ndGg7XG5cdGJvYXJkLndpZHRoID0gYm9hcmRbMF0ubGVuZ3RoO1xuXHR2YXIgY29udGV4dDtcblx0dmFyIGNhbnZhcztcblx0dmFyIHNpemU7XG5cdHNxdWFyZSA9IHt9O1xuXHRpbml0KCk7XG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdCxcblx0XHRyZW5kZXI6IHJlbmRlcixcblx0XHRmaWxsU3F1YXJlOiBmaWxsU3F1YXJlXG5cdH07XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1jYW52YXMnKTtcblx0XHRjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0Ly9jb250ZXh0LnNjYWxlKDIsMik7XG5cdFx0Y2FsY3VsYXRlU3F1YXJlU2l6ZSgpO1xuXG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXIocGllY2UsIGdob3N0UGllY2UpIHtcblx0XHRjbGVhcigpO1xuXHRcdHJlbmRlckJvYXJkKCk7XG5cdFx0cmVuZGVyR2hvc3RQaWVjZShnaG9zdFBpZWNlKTtcblx0XHRyZW5kZXJNb3ZpbmdQaWVjZShwaWVjZSk7XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXJCb2FyZCgpIHtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBib2FyZC5sZW5ndGg7IHJvdysrKSB7XG5cdFx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBib2FyZFtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdFx0aWYoYm9hcmRbcm93XVtjb2xdICE9PSAwKSB7XG5cdFx0XHRcdFx0cmVuZGVyRm9yZWdyb3VuZFNxdWFyZShyb3csIGNvbCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dmFyIGJnID0gJyNlZWUnO1xuXHRcdFx0XHRcdHZhciBiZzIgPSAnI2ZmZic7XG5cdFx0XHRcdFx0aWYoIChyb3crY29sKSAlIDIgPT0gMCApe1xuXHRcdFx0XHRcdFx0YmcgPSBiZzI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRiZyA9IGJnO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZW5kZXJTcXVhcmUoY29sLCByb3csIHtcblx0XHRcdFx0XHRcdGJnOiBiZyxcblx0XHRcdFx0XHRcdC8vc3Ryb2tlOmZhbHNlXG5cdFx0XHRcdFx0XHRzdHJva2VUaGlja25lc3M6IDAuMyxcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gY2hlY2tlcmVkKHJvdywgY29sKSB7XG5cdFx0dmFyIGJnID0gJyNlZWUnO1xuXHRcdHZhciBiZzIgPSAnI2ZmZic7XG5cdFx0aWYoIChyb3crY29sKSAlIDIgPT0gMCApe1xuXHRcdFx0YmcgPSBiZzI7XG5cdFx0fVxuXHRcdGVsc2V7XG5cdFx0XHRiZyA9IGJnO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHJlbmRlckZvcmVncm91bmRTcXVhcmUocm93LCBjb2wpIHtcblx0XHR2YXIgYmxvY2tUeXBlID0gY29sb3JJbmRleGVzIFsgKGJvYXJkW3Jvd11bY29sXS0xKSBdO1xuXHRcdHZhciBiZyA9IGNvbG9yc1tibG9ja1R5cGVdO1xuXHRcdHZhciBzdHJva2VDb2xvciA9IGNvbG9yTHVtaW5hbmNlKGJnLCAtMC4yKTtcblx0XHR2YXIgc3Ryb2tlVGhpY2tuZXNzID0gMi41O1xuXHRcdHJlbmRlclNxdWFyZShjb2wsIHJvdywge1xuXHRcdFx0Ymc6IGJnLCBcblx0XHRcdHN0cm9rZUNvbG9yOiBzdHJva2VDb2xvcixcblx0XHRcdHN0cm9rZVRoaWNrbmVzczogc3Ryb2tlVGhpY2tuZXNzXG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXJNb3ZpbmdQaWVjZShwaWVjZSkge1xuXHRcdGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHBpZWNlLnNoYXBlLmxlbmd0aDsgcm93KyspIHtcblx0XHRcdGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHBpZWNlLnNoYXBlW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuXHRcdFx0XHR2YXIgeCA9IChwaWVjZS54ICsgY29sKTtcblx0XHRcdFx0dmFyIHkgPSAocGllY2UueSArIHJvdyk7XG5cdFx0XHRcdHZhciBiZyA9IGNvbG9yc1twaWVjZS50eXBlXTtcblx0XHRcdFx0dmFyIHN0cm9rZUNvbG9yID0gY29sb3JMdW1pbmFuY2UoYmcsIC0wLjEpO1xuXHRcdFx0XHRpZiggcGllY2Uuc2hhcGVbcm93XVtjb2xdICE9PSAwICkge1xuXHRcdFx0XHRcdHJlbmRlclNxdWFyZSh4LCB5LCB7XG5cdFx0XHRcdFx0XHRiZzogYmcsXG5cdFx0XHRcdFx0XHRzdHJva2VDb2xvcjogc3Ryb2tlQ29sb3Jcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdH07XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlbmRlckdob3N0UGllY2UocGllY2UpIHtcblx0XHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBwaWVjZS5zaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0XHRmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBwaWVjZS5zaGFwZVtyb3ddLmxlbmd0aDsgY29sKyspIHtcblx0XHRcdFx0dmFyIHggPSAocGllY2UueCArIGNvbCk7XG5cdFx0XHRcdHZhciB5ID0gKHBpZWNlLnkgKyByb3cpO1xuXHRcdFx0XHR2YXIgYmcgPSBjb2xvcnNbcGllY2UudHlwZV07XG5cdFx0XHRcdHZhciBzdHJva2VDb2xvciA9IGNvbG9yTHVtaW5hbmNlKGJnLCAtMC4xKTtcblx0XHRcdFx0aWYoIHBpZWNlLnNoYXBlW3Jvd11bY29sXSAhPT0gMCApIHtcblx0XHRcdFx0XHRyZW5kZXJTcXVhcmUoeCwgeSwge1xuXHRcdFx0XHRcdFx0Ymc6ICdyZ2JhKDEwMCwgMTAwLCAxMDAsIDAuNiknLFxuXHRcdFx0XHRcdFx0c3Ryb2tlOiBmYWxzZVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHR9O1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiByZW5kZXJTcXVhcmUoaSwgaiwgb3B0aW9ucykge1xuXHRcdGZpbGxTcXVhcmUoc3F1YXJlLndpZHRoICogaSwgc3F1YXJlLmhlaWdodCAqIGosIG9wdGlvbnMpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZmlsbFNxdWFyZSh4LCB5LCBvcHRpb25zKSB7XG5cdFx0dmFyIHN0cm9rZSA9ICgob3B0aW9ucy5zdHJva2UgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnN0cm9rZSA6IHRydWUpO1xuXHRcdHZhciBzdHJva2VDb2xvciA9IG9wdGlvbnMuc3Ryb2tlQ29sb3IgfHwgJyNjY2MnO1xuXHRcdHZhciBzdHJva2VUaGlja25lc3MgPSBvcHRpb25zLnN0cm9rZVRoaWNrbmVzcyB8fCAyLjU7XG5cblx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IG9wdGlvbnMuYmc7XG5cdFx0Y29udGV4dC5maWxsUmVjdCh4LCB5LCBzcXVhcmUud2lkdGgsIHNxdWFyZS5oZWlnaHQpO1xuXHRcdFxuXHRcdGlmKHN0cm9rZSkge1xuXHRcdFx0Y29udGV4dC5zdHJva2VTdHlsZSA9IHN0cm9rZUNvbG9yO1xuXHRcdFx0Y29udGV4dC5saW5lV2lkdGggPSBzdHJva2VUaGlja25lc3M7XG5cdFx0XHRjb250ZXh0LnN0cm9rZVJlY3QoeCArIHN0cm9rZVRoaWNrbmVzcyAqIDAuNSwgeSArIHN0cm9rZVRoaWNrbmVzcyAqIDAuNSwgc3F1YXJlLndpZHRoIC0gc3Ryb2tlVGhpY2tuZXNzLCBzcXVhcmUuaGVpZ2h0IC0gc3Ryb2tlVGhpY2tuZXNzKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBjYWxjdWxhdGVTcXVhcmVTaXplKCkge1xuXHRcdHNxdWFyZS53aWR0aCA9IGNhbnZhcy53aWR0aCAvIGJvYXJkLndpZHRoO1xuXHRcdHNxdWFyZS5oZWlnaHQgPSBjYW52YXMuaGVpZ2h0IC8gYm9hcmQuaGVpZ2h0O1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjbGVhcigpIHtcblx0XHRjb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRcdGNvbnRleHQuY2xlYXJSZWN0ICggMCAsIDAgLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQgKTtcblx0fVxufSIsInZhciBTaGFwZXMgPSBtb2R1bGUuZXhwb3J0cyA9IHtcblx0J0knOiB7XG5cdFx0c2hhcGU6IFsgWzAsIDAsIDAsIDBdLCBbMSwgMSwgMSwgMV0sIFswLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDBdIF1cblx0fSxcblx0J0onOiB7XG5cdFx0c2hhcGU6IFsgWzAsIDAsIDBdLCBbMSwgMSwgMV0sIFswLCAwLCAxXSBdXG5cdH0sXG5cdCdMJzoge1xuXHRcdHNoYXBlOiBbIFswLCAwLCAwXSwgWzEsIDEsIDFdLCBbMSwgMCwgMF0gXVxuXHR9LFxuXHQnTyc6IHtcblx0XHRzaGFwZTogWyBbMSwgMV0sIFsxLCAxXSBdXG5cdH0sXG5cdCdTJzoge1xuXHRcdHNoYXBlOiBbIFswLCAxLCAxXSwgWzEsIDEsIDBdLCBbMCwgMCwgMF0gXVxuXHR9LFxuXHQnVCc6IHtcblx0XHRzaGFwZTogWyBbMCwgMSwgMF0sIFsxLCAxLCAxXSwgWzAsIDAsIDBdIF1cblx0fSxcblx0J1onOiB7XG5cdFx0c2hhcGU6IFsgWzEsIDEsIDBdLCBbMCwgMSwgMV0sIFswLCAwLCAwXSBdXG5cdH1cbn07XG4iLCJcblxuZnVuY3Rpb24gY29sb3JMdW1pbmFuY2UoaGV4LCBsdW0pIHtcblxuXHQvLyB2YWxpZGF0ZSBoZXggc3RyaW5nXG5cdGhleCA9IFN0cmluZyhoZXgpLnJlcGxhY2UoL1teMC05YS1mXS9naSwgJycpO1xuXHRpZiAoaGV4Lmxlbmd0aCA8IDYpIHtcblx0XHRoZXggPSBoZXhbMF0raGV4WzBdK2hleFsxXStoZXhbMV0raGV4WzJdK2hleFsyXTtcblx0fVxuXHRsdW0gPSBsdW0gfHwgMDtcblxuXHQvLyBjb252ZXJ0IHRvIGRlY2ltYWwgYW5kIGNoYW5nZSBsdW1pbm9zaXR5XG5cdHZhciByZ2IgPSBcIiNcIiwgYywgaTtcblx0Zm9yIChpID0gMDsgaSA8IDM7IGkrKykge1xuXHRcdGMgPSBwYXJzZUludChoZXguc3Vic3RyKGkqMiwyKSwgMTYpO1xuXHRcdGMgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KDAsIGMgKyAoYyAqIGx1bSkpLCAyNTUpKS50b1N0cmluZygxNik7XG5cdFx0cmdiICs9IChcIjAwXCIrYykuc3Vic3RyKGMubGVuZ3RoKTtcblx0fVxuXG5cdHJldHVybiByZ2I7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGNvbG9yTHVtaW5hbmNlOiBjb2xvckx1bWluYW5jZVxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRTUEFDRTogMzIsXG5cdExFRlQ6IDM3LFxuXHRSSUdIVDogMzksXG5cdFVQOiAzOCxcblx0RE9XTjogNDAsXG5cdFNISUZUOiAxNlxufTtcbiIsInZhciBCb2FyZCA9IHJlcXVpcmUoJy4vQm9hcmQuanMnKTtcbnZhciBQaWVjZSA9IHJlcXVpcmUoJy4vUGllY2UuanMnKTtcbnZhciBDb2xvcnMgPSByZXF1aXJlKCcuL0NvbG9ycy5qcycpO1xudmFyIENvbGxpc2lvbkRldGVjdGlvbiA9IHJlcXVpcmUoJy4vQ29sbGlzaW9uRGV0ZWN0aW9uLmpzJyk7XG52YXIgQ29udHJvbHMgPSByZXF1aXJlKCcuL0NvbnRyb2xzLmpzJyk7XG52YXIgUmVuZGVyZXIgPSByZXF1aXJlKCcuL1JlbmRlcmVyLmpzJyk7XG5cbnZhciBibG9ja3MgPSBbJ0knLCAnSicsICdMJywgJ08nLCAnUycsICdUJywgJ1onXTtcbnZhciBjb2xvcnMgPSBDb2xvcnMoKTtcbnZhciBib2FyZCA9IEJvYXJkKCk7XG52YXIgcGllY2UgPSBnZW5lcmF0ZVJhbmRvbVBpZWNlKCk7XG52YXIgY29sbGlzaW9uRGV0ZWN0aW9uID0gQ29sbGlzaW9uRGV0ZWN0aW9uKHtcblx0Ym9hcmQ6IGJvYXJkXG59KTtcbnZhciBjaGVjayA9IGNvbGxpc2lvbkRldGVjdGlvbi5jaGVjaztcblxudmFyIHJlbmRlcmVyID0gUmVuZGVyZXIoe2JvYXJkOiBib2FyZCwgY29sb3JzOiBjb2xvcnN9KTtcbnZhciBjb250cm9scyA9IENvbnRyb2xzKHtcblx0cGllY2U6IHBpZWNlLFxuXHRjaGVjazpjaGVjayxcblx0Ym9hcmQ6IGJvYXJkLFxuXHRzdGl0Y2hQaWVjZVRvQm9hcmQ6c3RpdGNoUGllY2VUb0JvYXJkLFxuXHRnZW5lcmF0ZUFuZEFzc2lnbk5ld1BpZWNlOiBnZW5lcmF0ZUFuZEFzc2lnbk5ld1BpZWNlLFxuXHRyZW1vdmVMaW5lczogcmVtb3ZlTGluZXNcbn0pO1xuY29udHJvbHMuaW5pdCgpO1xuXG52YXIgcG9pbnRzID0gWzQwLCAxMDAsIDMwMCwgMTIwMF07XG52YXIgc2NvcmUgPSAwO1xuJCgnI3Njb3JlJykudmFsKHNjb3JlKTtcblxuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG5cblx0aWYgKGNoZWNrKHBpZWNlLmNsb25lKCkuZ29Eb3duKCkpKSB7XG5cdFx0cGllY2UuZ29Eb3duKCk7XG5cdH0gXG5cdGVsc2Uge1xuXHRcdC8vd2FpdCBmb3IgdXNlciBubyBpbnB1dCBhbmQgc3BlY2lmaWVkIHNlY29uZHNcblx0XHRzdGl0Y2hQaWVjZVRvQm9hcmQocGllY2UpO1xuXHRcdHJlbW92ZUxpbmVzKCk7XG5cdFx0cGllY2UgPSBnZW5lcmF0ZVJhbmRvbVBpZWNlKCk7XG5cdFx0Y29udHJvbHMudXBkYXRlUGllY2UocGllY2UpO1xuXHR9XG5cbn0sIDUwMCk7XG5cblxudmFyIHJlbmRlclRva2VuID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG5cdHZhciBnaG9zdFBpZWNlID0gY2FsY3VsYXRlR2hvc3RQaWVjZSgpO1xuXHRyZW5kZXJlci5yZW5kZXIocGllY2UsIGdob3N0UGllY2UpO1xufSwgNTApO1xuXG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tUGllY2UgKCkge1xuXHR2YXIgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYmxvY2tzLmxlbmd0aCk7XG5cdHZhciBwID0gbmV3IFBpZWNlKHtcblx0XHR0eXBlOiBibG9ja3NbcmFuZG9tXSxcblx0XHR4OiAzLFxuXHRcdHk6IDAgXG5cdH0pO1xuXHRyZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gc3RpdGNoUGllY2VUb0JvYXJkKHBpZWNlKSB7XG5cdHZhciBzaGFwZSA9IHBpZWNlLnNoYXBlO1xuXHRmb3IgKHZhciByb3cgPSAwOyByb3cgPCBzaGFwZS5sZW5ndGg7IHJvdysrKSB7XG5cdFx0Zm9yICh2YXIgY29sID0gMDsgY29sIDwgc2hhcGVbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG5cdFx0XHRpZihzaGFwZVtyb3ddW2NvbF0gIT09IDApIHtcblx0XHRcdFx0dmFyIHggPSBwaWVjZS54ICsgY29sO1xuXHRcdFx0XHR2YXIgeSA9IHBpZWNlLnkgKyByb3c7XG5cdFx0XHRcdHZhciBpbmRleCA9IGJsb2Nrcy5pbmRleE9mKHBpZWNlLnR5cGUpICsgMTtcblx0XHRcdFx0XHRib2FyZFt5XVt4XSA9IGluZGV4O1xuXHRcdFx0fVxuXHRcdH07XG5cdH07XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUxpbmVzKCkge1xuXHR2YXIgZnVsbExpbmVzID0gMDtcblx0Zm9yICh2YXIgcm93ID0gMDsgcm93IDwgYm9hcmQubGVuZ3RoOyByb3crKykge1xuXHRcdHZhciBmdWxsTGluZSA9IChfLm1pbihib2FyZFtyb3ddKSAhPT0gMCk7XG5cdFx0aWYoZnVsbExpbmUpIHtcblx0XHRcdGZ1bGxMaW5lcysrO1xuXHRcdFx0Ym9hcmQuc3BsaWNlKHJvdywxKTtcblx0XHRcdGJvYXJkLnVuc2hpZnQoZW1wdHlSb3coKSk7XG5cdFx0fVxuXHR9O1xuXHQgaWYoZnVsbExpbmVzID4gMCl7XG5cdCBcdGNvbnNvbGUubG9nKGZ1bGxMaW5lcyk7XG5cdCBcdHNjb3JlICs9IHBvaW50c1stLWZ1bGxMaW5lc107XG5cdCB9XG5cdCAkKCcjc2NvcmUnKS5odG1sKHNjb3JlKTtcbn1cblxuZnVuY3Rpb24gZW1wdHlSb3coKSB7XG5cdHZhciByb3cgPSBbXTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBib2FyZC53aWR0aDsgaSsrKSB7XG5cdFx0cm93LnB1c2goMCk7XG5cdH07XG5cdHJldHVybiByb3c7XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZUdob3N0UGllY2UoKSB7XG5cdHZhciBnaG9zdFBpZWNlID0gcGllY2UuY2xvbmUoKTtcblx0d2hpbGUoY2hlY2soZ2hvc3RQaWVjZS5jbG9uZSgpLmdvRG93bigpKSkge1xuXHRcdGdob3N0UGllY2UuZ29Eb3duKCk7XG5cdH1cblx0cmV0dXJuIGdob3N0UGllY2U7XG59XG5cblxuZnVuY3Rpb24gZ2VuZXJhdGVBbmRBc3NpZ25OZXdQaWVjZSAoKXtcblx0cGllY2UgPSBnZW5lcmF0ZVJhbmRvbVBpZWNlKCk7XG5cdGNvbnRyb2xzLnVwZGF0ZVBpZWNlKHBpZWNlKTtcbn1cbiJdfQ==
