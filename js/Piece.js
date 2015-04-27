function Piece(options) {
	var transform = Transform();
	var type = options.type;
	var x = 0;
	var y = 0;	
	var shape = Shapes[type].shape;
	var pivotPoint = Shapes[type].pivotPoint;
	
	return {
		x: x,
		y: y,
		type: type,
		shape: shape,
		rotate: rotate,
		pivotPoint: pivotPoint
	};

	function rotate() {
		 transform.rotate({
			x: x,
			y: y,
			type: type,
			shape: shape,
			rotate: rotate,
			pivotPoint: pivotPoint			
		});
	}
}
