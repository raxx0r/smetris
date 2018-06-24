$ = require('jquery');
var Audio = require('./Audio.js');
var Game = require('./Game.js');
var Controls = require('./Controls.js');
var MultipleControls = require('./MultipleControls.js');
var ScoreController = require('./ScoreController.js');
var HighscoreController = require('./HighscoreController.js');
var Renderer = require('./Renderer.js');
var Board = require('./Board.js');
var config = require('./config.js');
var NextPiecesController = require('./nextPiecesController.js');
var HoldPieceController = require('./holdPieceController.js');
var MuteController = require('./MuteController.js');
var utils = require('./utils.js');
var helpers = require('./helpers.js');

var RemoteControls = require('./RemoteControls.js');


var colors = config.randomize_piece_color ? helpers.randomColors() : require('./Colors');
var board = Board();
var localControls = Controls({config: config});
var remoteControls = RemoteControls({});
localControls.init();
remoteControls.init();
var controls = MultipleControls({controls: [localControls, remoteControls]})
controls.init();

game = Game({board: board, controls: controls, config: config});

var mainCanvas = document.getElementById('game-canvas');
var squareSize = utils.calculateSquareSizeForBoard(mainCanvas, board);
var mainRenderer = Renderer({
	colors: colors,
	canvas: mainCanvas,
	squareSize: squareSize
});
var audio = Audio({game: game, controls:controls, muted: config.muted_default});

// Controllers
var muteController = MuteController({audio: audio});
var scoreController = ScoreController({game: game, config: config});
var highscoreController = HighscoreController();
var nextPiecesController = NextPiecesController({game: game, colors: colors, fillSquare: mainRenderer.fillSquare, squareSize: squareSize});
var holdPieceController = HoldPieceController({squareSize: squareSize, colors: colors, fillSquare: mainRenderer.fillSquare});
game.on('UPDATE', nextPiecesController.render);
game.on('UPDATE', mainRenderer.render);
game.on('UPDATE', holdPieceController.render);

game.start();


controls.on('pauseToggle', function() {
	game.pauseToggle();

	if (game.isPaused()) {
		console.log('pausing')
	} else {
		console.log('unpausing')
	}
})

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
