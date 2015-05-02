
ljud
ghost piece

var blockColors = ['#27DEFF','#3C66FF','#E8740C','#FFD70D','#26FF00','#9E0CE8','#FF0000'];
//ljusblå, blå, orange, gul, grön, lila, röd
var blocks = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];


// Game size: 10 x 20 alternativt 10 x 16

ljud 
- när man roterar en bit
- när man flyttar en bit i sidled
- när man skjutsar ner en bit
poäng
config
- tick interval

blocka att man kan snurra biten hur snabbt som helst

//generate random rotation on piece
can go right
can go left
can rotate

calculate ghostpiece position
render ghost piece
SPACE piece.drop() == ghostpiece position?

Ta reda på varför det blir mörkare när en bit har lagt sig.
Bryt ut transform koden till ett eget biblitek som inte används i detta projektet
Hitta ett smart sätt att byta ut färger, ha en render config med alla färger.


undersök varför det blir fuzzy i canvas, har med retina att göra? varför fixar rafael det ändå?

Tetris friends marathon färger
bakgrundruta 0,0,0
bakgrundsruta stroke (0.1, 0.1, 0.1)

Klockwise rotation!
