$ = require('jquery');
var Audio = require('./Audio.js');
var Game = require('./Game.js');
var Controls = require('./Controls.js');
var ScoreController = require('./ScoreController.js');
var HighscoreController = require('./HighscoreController.js');
var Renderer = require('./Renderer.js');
var Board = require('./Board.js');
var config = require('./config.js');
var NextPiecesController = require('./nextPiecesController.js');
var utils = require('./utils.js');


var board = Board();
var controls = Controls({config: config});
controls.init();

game = Game({board: board, controls: controls, config: config});

var mainCanvas = document.getElementById('game-canvas');
var squareSize = utils.calculateSquareSizeForBoard(mainCanvas, board);
var mainRenderer = Renderer({
	canvas: mainCanvas,
	squareSize: squareSize
});
game.on('UPDATE', mainRenderer.render);

var audio = Audio({game: game, controls:controls});

// Controllers
var scoreController = ScoreController({game: game, config: config});
var highscoreController = HighscoreController();
var nextPiecesController = NextPiecesController({game: game});

game.start();

game.on('GAME_OVER', function (event){
	var newScore = event.score;

	var highscore = localStorage.getItem("highscore");
	if (newScore > highscore) {
		localStorage.setItem("highscore", newScore);
	}
});

game.on('GAME_OVER', function (){
	$('#alerter').text("Game over!");
})
