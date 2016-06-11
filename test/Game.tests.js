var assert = require('assert');
var Board = require('../src/Board.js');
var Piece = require('../src/Piece.js');
var CollisionDetection = require('../src/CollisionDetection.js');

describe('Game.', function() {
	it('when rotating piece with landed pieces underneath should not be able to rotate', function(){

		var shape = [
			[1,1,1],
			[0,1,0],
			[0,0,0],
		];
		/*
			Will rotate to this:
			[0,0,1],
			[0,1,1],
			[0,0,1],
		 */

		var boardScheme = [
			[0,0,0],
			[0,0,0],
			[1,1,1],
		]; 
		var piece = new Piece({
			type: 'T',
			shape: shape
		})

		var board = Board({boardScheme: boardScheme})
		var collisionDetection = CollisionDetection({
			board: board
		});
		var check = collisionDetection.check;

		assert(!check(piece.clone().rotate()));

	})	
});