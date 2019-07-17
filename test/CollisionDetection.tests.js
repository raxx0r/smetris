var assert = require('assert');
var sinon = require('sinon');
var CollisionDetection = require('../src/CollisionDetection.js');

describe('CollisionDetection', function(){

	it('when a piece is outside of board should return SOMETHINGse', function() {})
	it('when a piece is outside of board should return false', function() {
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

	it('when a piece is outside to the right should detect this', function() {

		var board = { width: function() {return 3}};
		var collision = CollisionDetection({board: board});
		
		var piece = {x: 2, shape: [1,2,4] }

		var check = collision.isOutsideRight(board, piece);

		assert(check);
	})

})
