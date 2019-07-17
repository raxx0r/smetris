$ = require('jquery');
var Audio = require('./Audio.js');
var Game = require('./Game.js');
var Controls = require('./Controls.js');
var MultipleControls = require('./MultipleControls.js');
var ScoreController = require('./ScoreController.js');
var HighscoreController = require('./HighscoreController.js');
var Renderer = require('./Renderer.js');
var Board = require('./Board.js');
var RecordPlayer = require('./RecordPlayer.js');
var CustomRenderer = require('./CustomRenderer.js');
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
var recordPlayer = RecordPlayer({renderer: mainRenderer});
var audio = Audio({game: game, controls:controls, muted: config.muted_default});

// Controllers
var highscores = JSON.parse(localStorage.getItem("highscore")) // TODO fix a default
var muteController = MuteController({audio: audio});
var scoreController = ScoreController({game: game, config: config});
var highscoreController = HighscoreController({highscores: highscores, recordPlayer: recordPlayer});
var nextPiecesController = NextPiecesController({game: game, colors: colors, fillSquare: mainRenderer.fillSquare, squareSize: squareSize});
var holdPieceController = HoldPieceController({squareSize: squareSize, colors: colors, fillSquare: mainRenderer.fillSquare});

var customRenderer = CustomRenderer({canvas: mainCanvas});
game.on('UPDATE', nextPiecesController.render);
game.on('UPDATE', function(e) {
	if (config.use_custom_renderer) {
		customRenderer.renderPiece(e.piece)	
	} else {	
		mainRenderer.render(e)
	}
});
game.on('UPDATE', holdPieceController.render);

var history = []
var start = new Date().getTime()
game.on('UPDATE', function (obj) {
	var time = new Date().getTime() - start;
	history.push({time: time, data: obj})
});

// game.start();
$('#start-game-button').on('click', function() { game.start() })

controls.on('pauseToggle', function() {
	game.pauseToggle();

	if (game.isPaused()) {
		console.log('pausing')
	} else {
		console.log('unpausing')
	}
})
mainRenderer.clear()
game.on('GAME_OVER', function(event) {
	var newScore = event.score;

	var highscores = JSON.parse(localStorage.getItem("highscore")) || [{score: 0}]

	// if (highscores.length < 10) {
		var timestamp = new Date().getTime()
		highscores.push({
			score: newScore,
			replay: history,
			timestamp: timestamp
		})
	// }

	localStorage.setItem("highscore", JSON.stringify(highscores));


	mainRenderer.clear();
	recordPlayer.play(history);

});

game.on('GAME_OVER', function (){
	$('#alerter').text("Game over!");
})
