var keys = require('./keys.js');
var Piece = require('./Piece.js')

var VALID_EVENTS = ['down','right','left','drop','hold','rotate'];

module.exports = function Controls(createOptions) {

	var listeners;

	return {
		init: init,
		updatePiece: updatePiece,
		on: addListener,
		off: removeListener
	}

	function init() {
		$(document).on('keydown', keyPressed);

		listeners = {};
		VALID_EVENTS.forEach(function(event) {
			listeners[event] = [];
		})
	}

	function updatePiece(newPiece) {
		piece = newPiece;
	}

	function addListener(event, callback) {
		listeners[event].push(callback);
	}

	function removeListener(event, callback) {
		var index = listeners[event].indexOf(callback);
		listeners[event].splice(index,1);
	}

	function emit(event) {
		listeners[event].forEach(function(callback) {
			callback();
		})
	}
	
	function keyPressed(e) {
		if (e.keyCode === keys.RIGHT) emit('right');
		if (e.keyCode === keys.LEFT) emit('left');
		if (e.keyCode === keys.UP)  emit('rotate');
		if(e.keyCode === keys.DOWN) emit('down');
		if(e.keyCode === keys.SPACE) emit('drop');
	}
}