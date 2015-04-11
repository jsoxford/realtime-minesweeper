var express = require('express');
var path = require('path');
var game = require('./game');

game.start(16, 16);
game.getBoard(function(board) {
  game.watchMoves();
});

var app = express();
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.listen(3000);
