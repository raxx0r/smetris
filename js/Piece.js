function Piece(options) {
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