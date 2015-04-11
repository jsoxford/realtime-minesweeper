var express = require('express');
var game = require('./game');

game.start(16, 16);
game.getBoard(function(board) {
  game.watchMoves();
});

var app = express();
app.get('/', function(req, res) {
    res.sendFile('./index.html');
});
app.listen(3000);
