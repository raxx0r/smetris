var Game = require('./Game.js');
var ScoreController = require('./ScoreController.js');
var Renderer = require('./Renderer.js');
var Board = require('./Board.js');

var board = Board();
var game = Game({board: board});

var scoreController = ScoreController({game: game});
var renderer = Renderer({game: game, board: board});
