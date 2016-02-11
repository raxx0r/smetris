module.exports = function (options) {
	var controls = options.controls;
	var game = options.game;

	var sounds = {
		HITS_BOTTOM: 'block_hits_bottom.wav',
		ROTATE: 'rotate_block.wav',
		GAME_OVER: 'game_over.wav'
	}

	controls.on('rotate', play(sounds.ROTATE));
	controls.on('drop', play(sounds.HITS_BOTTOM));
	game.on('gameOver', play(sounds.GAME_OVER));

	function play(sound) {
		return function () {
			new Audio('assets/sounds/' + sound).play();
		}
	}
}