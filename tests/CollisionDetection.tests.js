var assert = require('assert');
var sinon = require('sinon');
var CollisionDetection = require('../src/CollisionDetection.js');

describe('when a piece is outside of board', function(){
	it('should return false', function() {
		var board = function() {
			return function() {
				return {
					isOccupied: false
				}
			}
		}
		board.height = function() {return 10;};
		var piece = { x: 0, y: 9};
		piece.shape = [
			[0,1,0],
			[1,1,1],
			[0,0,0],
		]

		var check = CollisionDetection({board: board}).check;

		assert( !check(piece) );
	})
})

describe('when a piece is outside of the sides of the board', function(){
	it('should detect this', function() {

		var check = collision.isOutside(board, piece);

		var assert(!check);
	})
})
