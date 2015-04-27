function Transform() {
	var points = [];
	return {
		rotate: rotate
	}

	function rotate(_piece) {
		if(_piece.type == 'O') return;

		moveToPivotPoint(_piece);
		rotatePoints(_piece);
		var finalShape = translateBack(_piece);
		points = [];

		return finalShape;
	}

	function moveToPivotPoint(original) {
		var _piece = _.clone(original);
		var shape = _piece.shape;
		var pivotPoint = _piece.pivotPoint;
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

	function rotatePoints(_piece) {
		var rot = [[0, 1], [-1, 0]];
		var temp = {};

		for (var i = 0; i < points.length; i++) {
			var x = points[i].x;
			var y = points[i].y;
			temp.x = x * rot[0][0] + y * rot[0][1];
			temp.y = x * rot[1][0] + y * rot[1][1];
			points[i].x = temp.x;
			points[i].y = temp.y;
		};

	}

	function translateBack(_piece) {
		var pivotPoint = _piece.pivotPoint;
		var tempShape = _.clone(_piece.shape);
		for (var i = 0; i < points.length; i++) {
				points[i].x += pivotPoint.x;
				points[i].y += pivotPoint.y;
		};

		for (var i = 0; i < points.length; i++) {
			var col = points[i].x;
			var row = points[i].y;
			tempShape[row][col] = points[i].value;
		};

		return tempShape;
	}
}