var keys = require('./keys.js');
var Piece = require('./Piece.js');

var VALID_EVENTS = ['down','right','left','drop','hold','rotate', 'pauseToggle'];

var DEBUG = false;

module.exports = function Controls(createOptions) {
	var createOptions = createOptions || {};
	var controls = createOptions.controls;
	// var config = createOptions.config;
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
		controls.forEach(function(control) {
			VALID_EVENTS.forEach(function(event) {
				control.on(event, function(e) {
					emit(event)
				});
			})
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
}
