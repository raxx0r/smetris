module.exports = function (options) {
	var controls = options.controls;
	var game = options.game;
	var mute = options.muted != undefined ? options.muted : false;

	var sounds = {
		HITS_BOTTOM: 'block_hits_bottom.wav',
		ROTATE: 'rotate_block.wav',
		GAME_OVER: 'game_over.wav'
	}

	controls.on('drop', play(sounds.HITS_BOTTOM));
	// game.on('gameOver', play(sounds.GAME_OVER));

	function play(sound) {

		return function () {
			if (mute) return;
			new Audio('assets/sounds/' + sound).play();
		}
	}

	function toggle(_mute) {
		mute = _mute;
	}

	function isMuted() {
		return mute;
	}

	return {
		toggle: toggle,
		isMuted: isMuted
	}
}
