var pieceColors = require('./colors')

module.exports = {
	board: {
		stroke: false,
		background: 'pink',
		checkered: true,
		checked: {
			color1: '#fff',
			color2: '#eee'
		}
	},
	piece: {
		stroke: {
			thickness: 3.5,
		},
		colors: pieceColors,
	},
	ghostPiece: { 
		background: 'rgba(100, 100, 100, 0.6)', 
		stroke: false
	}
}
