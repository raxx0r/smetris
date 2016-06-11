var $ = require('jquery');
var assert = require('assert');
var keys = require('../src/keys.js');
var sinon = require('sinon');
var Board = require('../src/Board.js');

describe('when calling for width and height', function(){
	it('should recive the correct width and height', function() {
		var scheme = [
			[1,2,3],
			[1,2,3]
		]
		var board = Board({boardScheme: scheme});

		assert(board.width() == 3);
		assert(board.height() == 2);
	});
})

describe('when extracting a position', function(){	
	it('should recieve if it is occupied or not', function() {
		var scheme =[
			[0, 0, 1],
			[0, 0, 0]
		];
		var board = Board({boardScheme: scheme});

		assert( board(2)(0).isOccupied );
	})
});

describe('when updating a position', function(){	
	it('should update the occupied positions value', function() {
		var scheme =[
			[0, 0, 0],
			[0, 0, 0]
		];
		var board = Board({boardScheme: scheme});
		
		assert( board(2)(0).isFree );

		board(2)(0).update(1);

		assert( board(2)(0).isOccupied );

	})
});

describe('when retrieving a row', function(){	
	it('should get corresponding row', function() {
		var scheme =[
			[1, 2, 3],
			[0, 0, 0]
		];
		var board = Board({boardScheme: scheme});

		var row = board.row(0);

		assert(row[0] == 1);
		assert(row[1] == 2);
		assert(row[2] == 3);

	})
});

describe('when retrieving a certain positions value', function(){	
	it('should get corresponding value', function() {
		var scheme =[
			[1, 2, 3],
			[0, 0, 0]
		];
		var board = Board({boardScheme: scheme});


		assert(board(2)(0).value == 3);

	})
});
