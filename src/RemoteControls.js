var keys = require('./keys.js');
var Piece = require('./Piece.js');
var W3CWebSocket = require('websocket').w3cwebsocket;

var VALID_EVENTS = ['down','right','left','drop','hold','rotate', 'pauseToggle'];

var DEBUG = false;

module.exports = function Controls(createOptions) {

	var client = new W3CWebSocket('ws://localhost:8080/', 'echo-protocol');
	var createOptions = createOptions || {};
	// var config = createOptions.config;
	// var selector = createOptions.selector || document;
	var listeners;
	var timerReady = true;
	var isRotatePressed = false;
	init();
	return {
		init: init,
		on: addListener,
		off: removeListener,
		VALID_EVENTS: VALID_EVENTS
	}

	function init() {
		listeners = {};
		VALID_EVENTS.forEach(function(event) {
			listeners[event] = [];
		}) 
	
		client.onerror = function() { console.log('Connection Error'); };
		client.onclose = function() { console.log('echo-protocol Client Closed'); };
		client.onopen = function() { console.log('WebSocket Client Connected');};
		 
		client.onmessage = function(e) {
			console.log(e.data)
		    if (typeof e.data === 'string') {
		       var type = e.data
					emit(type)
		    }
		};
	}

	function recieveMessage(message) {
		console.log(message);
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
		if (DEBUG) console.log(e.keyCode)
		if(!isKeyReady()) return;

		if (e.keyCode === keys.RIGHT) emit('right');
		if (e.keyCode === keys.LEFT) emit('left');
		if (e.keyCode === keys.DOWN) emit('down');
		if (e.keyCode === keys.SPACE) emit('drop');
		if (e.keyCode === keys.SHIFT) emit('hold');
		if (e.keyCode === keys.P) emit('pauseToggle');
		if (e.keyCode === keys.UP && !isRotatePressed) {
			emit('rotate');
			isRotatePressed = true;
		}

		timerReady = false;
		setTimeout(function() {timerReady = true;}, config.controls.REPEAT_COOLDOWN);
	}
}
