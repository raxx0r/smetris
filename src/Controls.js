var keys = require('./keys.js');
var Piece = require('./Piece.js');

var VALID_EVENTS = ['down','right','left','drop','hold','rotate'];

module.exports = function Controls(createOptions) {
	var createOptions = createOptions || {};
	var config = createOptions.config;
	var selector = createOptions.selector || document;
	var listeners;
	var timerReady = true;
	var isRotatePressed = false;

	return {
		init: init,
		on: addListener,
		off: removeListener,
		VALID_EVENTS: VALID_EVENTS
	}

	function init() {
		$(document).ready(function(){
			$(selector).on('keydown', keyPressed);
			$(selector).on('keyup', keyReleased);
		});
		listeners = {};
		VALID_EVENTS.forEach(function(event) {
			listeners[event] = [];
		})
	}

	function addListener(event, callback) {
		listeners[event].push(callback);
	}

	function removeListener(event, callback) {
		var index = listeners[event].indexOf(callback);
		listeners[event].splice(index, 1);
	}

	function emit(event) {
		listeners[event].forEach(function(callback) {
			callback();
		})
	}

	function keyReleased(e) {
		timerReady = true;

		if (e.keyCode === keys.UP) isRotatePressed = false;
	}

	function isKeyReady() {
		return timerReady;
	}

	function keyPressed(e) {
		if(!isKeyReady()) return;

		if (e.keyCode === keys.RIGHT) emit('right');
		if (e.keyCode === keys.LEFT) emit('left');
		if (e.keyCode === keys.DOWN) emit('down');
		if (e.keyCode === keys.SPACE) emit('drop');
		if (e.keyCode === keys.SHIFT) emit('hold');
		if (e.keyCode === keys.UP && !isRotatePressed) {
			emit('rotate');
			isRotatePressed = true;
		}

		timerReady = false;
		setTimeout(function() {timerReady = true;}, config.controls.REPEAT_COOLDOWN);
	}
}
