var game = require('./game');

game.start(16, 16);
game.getBoard(function(board) {
  game.watchBoard(function(x, y, square) {
    console.log(x, y, square);
  });
});

game.watchMoves();
