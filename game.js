var Firebase = require("firebase");
var _ = require('lodash');
var firebase = new Firebase("https://luminous-inferno-2359.firebaseio.com");

var game = module.exports = {
  // Resets the game board with random mines
  start: function(width, height) {
    var self = this;

    this.width = width;
    this.height = height;

    this.board = _.times(height, function() {
      return _.times(width, function() {
        return { mine: Math.random() < 0.3, open: false, nearby: 0 };
      });
    })

    this.calculateNearby();

    firebase.child('board').set(this.board);
    firebase.child('moves').set([]);
  },
  // Gets the entire board from the server
  getBoard: function(fn) {
    var self = this;

    firebase.child('board').once('value', function(data) {
      self.board = data.val();
      fn(data.val());
    });
  },
  // Watches for moves and applies them to the board
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
  // Watches for changes to the board and sends to a callback
  watchBoard: function(fn) {
    _.times(this.height, function(y) {
      firebase.child('board/' + y).on("child_changed", function(data) {
        fn(+data.key(), y, data.val());
      });
    });
  },
  // Makes a move
  makeMove: function(x, y, user) {
    firebase.child('moves').push({x: x, y: y, user: user});
  },
  // Calculates the number of mines around a space
  calculateNearby: function() {
    var self = this;

    this.board.map(function(row, y) {
      row.map(function(space, x) {
        space.nearby = 0;
        self.getAdjacents(x, y).map(function(sibling) {
          if (sibling.mine) space.nearby++;
        })
      })
    });
  },
  // Gets the adjacent spaces for a space
  getAdjacents: function(x, y) {
    var self = this;

    var siblings = [];
    [-1, 0, 1].map(function(yy) {
      [-1, 0, 1].map(function(xx) {
        if (self.board[y + yy] && self.board[y + yy][x + xx]) {
          siblings.push(self.board[y + yy][x + xx]);
        }
      });
    });
    return siblings;
  }
};
