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