module.exports = function (createOptions) {
	var audio = createOptions.audio;
	var mute = audio.isMuted();
	init()

	function init() {
		$('#mute-button').on('click', onMuteClicked)
		audio.toggle(mute)
		render()
	}

	function onMuteClicked() {
		mute = !mute;

		render();

		audio.toggle(mute);
	}

	function render() {
			if (mute) {
				$('#mute-button').text("Sound")
			} else {
				$('#mute-button').text("Mute")
			}
	}

}