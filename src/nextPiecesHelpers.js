var pieceTypes = require('./PieceTypesArray.js');
var Piece = require('./Piece.js');


function getRandomPieces(number) {
  var pieces = []

  for (var i = 0; i < number; i++) {
    pieces.push(generateRandomPiece());
  };

  return pieces;
}

function generateRandomPiece () {
  var random = Math.floor(Math.random() * pieceTypes.length);
  var p = new Piece({
    type: pieceTypes[random],
    x: 3,
    y: 0
  });
  return p;
}

module.exports = {
  getRandomPieces: getRandomPieces,
  generateRandomPiece: generateRandomPiece
}
