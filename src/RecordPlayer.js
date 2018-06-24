module.exports = function(createOptions) {
	var history = createOptions.history;
	var renderer = createOptions.renderer;
	var time = 0;

	return {
		play: play
	}

	function play() {
		history.forEach(function(item, index){
			setTimeout(function() {
				renderer.render(item.data);

			}, item.time);
		})
	}
}