var $ = require('jquery');
var Audio = require('./Audio.js');
var Game = require('./Game.js');
var Controls = require('./Controls.js');
var ScoreController = require('./ScoreController.js');
var Renderer = require('./Renderer.js');
var Board = require('./Board.js');

var board = Board();
var controls = Controls();
controls.init();

var game = Game({board: board, controls: controls});

var audio = Audio({game: game, controls:controls});
var scoreController = ScoreController({game: game});
var renderer = Renderer({game: game, board: board});

game.start();

game.on('gameOver', function (){
	$('#alerter').text("Game over!");
})