function colorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}

function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

function randomColors() {
	function randomColor() {
		var r = Math.round(Math.random() * 255)
		var g = Math.round(Math.random() * 255)
		var b = Math.round(Math.random() * 255)

		var res = `rgba(${r}, ${g}, ${b}, 0)`;
		return rgb2hex(res)
	}
	return {
		'I': randomColor(),
		'J': randomColor(),
		'L': randomColor(),
		'O': randomColor(),
		'S': randomColor(),
		'T': randomColor(),
		'Z': randomColor()
	}
}

module.exports = {
	rgb2hex: rgb2hex,
	randomColors: randomColors,
	colorLuminance: colorLuminance
}
