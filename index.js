var Firebase = require("firebase");
var _ = require('lodash');
var firebase = new Firebase("https://luminous-inferno-2359.firebaseio.com");

var game = {
  start: function(width, height) {
    this.width = width;
    this.height = height;
    firebase.child('board').set(
      _.times(height, function() {
        return _.times(width, function() {
          return { mine: false, open: false, nearby: 0 };
        });
      })
    );
    firebase.child('moves').set([]);
  },
  getBoard: function(fn) {
    var self = this;
    firebase.child('board').once('value', function(data) {
      self.board = data.val();
      fn(data.val());
    });
  },
  watchMoves: function() {
    var self = this;
    firebase.child('moves').on('child_added', function(data) {
      data = data.val();
      if (self.board[data.y][data.x].open === false) {
        self.board[data.y][data.x].open = data.user;
        firebase.child('board').set(self.board);
      }
    });
  },
  watchBoard: function(fn) {
    _.times(this.height, function(y) {
      firebase.child('board/' + y).on("child_changed", function(data) {
        fn(+data.key(), y, data.val());
      });
    });
  },
  makeMove: function(x, y, user) {
    firebase.child('moves').push({x: x, y: y, user: user});
  }
};

game.start(16, 16);

game.getBoard(function(board) {
  game.watchBoard(function(x, y, square) {
    console.log(x, y, square);
  });
});

game.watchMoves();

game.makeMove(3, 3, 'john');


