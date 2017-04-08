

function ImageData(filename, width, height) {
	var Canvas = require('canvas')
	  , Image = Canvas.Image
	  , canvas = new Canvas(100, 100)
	  , ctx = canvas.getContext('2d');

	var fs = require('fs');

	var file = fs.readFileSync(__dirname + '/' + filename);

	img = new Image;
	img.src = file;
	ctx.drawImage(img, 0, 0, img.width, img.height);

	var data = ctx.getImageData(0,0, img.width, img.height);
	return canvas;
}

function writeImage(filename, canvas) {

	var fs = require('fs')
	  , out = fs.createWriteStream(__dirname + '/' + filename)
	  , stream = canvas.pngStream();
	 
	stream.on('data', function(chunk){
	  out.write(chunk);
	});
	 
	stream.on('end', function(){
	  console.log('saved png');
	});
}


exports.ImageData = ImageData;
exports.writeImage = writeImage;