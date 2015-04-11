var game = require('./game');

game.start(16, 16);
game.getBoard(function(board) {
  game.watchMoves();
});
