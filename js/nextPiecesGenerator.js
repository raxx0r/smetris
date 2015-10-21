var pieceTypes = require('./PieceTypesArray.js');
var Piece = require('./Piece.js');

var MAX_NUMBER_OF_NEXT_PIECES = 4;

module.exports = function(createOptions) {

	var nextPieces = [];
	var listeners = {};
	init();


	return {
		getNextPiece: getNextPiece,
		getNextPieces: function() { return nextPieces.slice(0); },
		log: log,
		on: on
	}

	function init() {
		['update'].forEach(function(event) {
			listeners[event] = [];
		})

		for (var i = 0; i < MAX_NUMBER_OF_NEXT_PIECES; i++) {
			nextPieces.push(generateRandomPiece());
		};
	}

	function on(event, callback) {
		listeners[event].push(callback);
	}

	function emit(event, data) {
		listeners[event].forEach(function(callback){
			callback(data);
		})
	}

	function getNextPiece() {
		var nextPiece = nextPieces.shift();
		nextPieces.push(generateRandomPiece())
		emit('update', {nextPiece: nextPiece});
		return nextPiece;
	}

	function generateRandomPiece () {
		var random = Math.floor(Math.random() * pieceTypes.length);
		var p = new Piece({
			type: pieceTypes[random],
			x: 3,
			y: 0 
		});
		return p;
	}

	function log() {
		var str="";
		for (var i = 0; i < nextPieces.length; i++) {
			str += nextPieces[i].type + " ";
		};
		console.log(str);
	}
}