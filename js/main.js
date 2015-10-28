var Game = require('./Game.js');
var ScoreController = require('./ScoreController.js');

var game = Game();

var scoreController = ScoreController({game: game});
