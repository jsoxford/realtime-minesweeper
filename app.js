var game = require('./game');

game.getBoard(function(board) {
  game.watchBoard(function(x, y, square) {
    console.log(x, y, square);
  });
});

game.makeMove(3, 3, 'john');
