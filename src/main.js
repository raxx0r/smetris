var $ = require('jquery');
var Audio = require('./Audio.js');
var Game = require('./Game.js');
var Controls = require('./Controls.js');
var ScoreController = require('./ScoreController.js');
var HighscoreController = require('./HighscoreController.js');
var Renderer = require('./Renderer.js');
var Board = require('./Board.js');
var config = require('./config.js');


var board = Board();
var controls = Controls({config: config});
controls.init();

var game = Game({board: board, controls: controls, config: config});

var audio = Audio({game: game, controls:controls});
var scoreController = ScoreController({game: game, config: config});
var highscoreController = HighscoreController();
var renderer = Renderer({game: game, board: board});

game.start();

game.on('gameOver', function (event){
	var newScore = event.score;

	var highscore = localStorage.getItem("highscore");
	if (newScore > highscore) {
		localStorage.setItem("highscore", newScore);
	}
});

game.on('gameOver', function (){
	$('#alerter').text("Game over!");
})