function Transform() {
	var tetromino;
	return {
		rotate: rotate
	}

	function rotate(myPiece) {
		if(myPiece.type == 'O') return;

		tetromino = myPiece;
		console.log(tetromino)
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
		var rot = [[0, 1], [-1, 0]]; // 90 deg Clockwise
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
}