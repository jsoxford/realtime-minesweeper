var Firebase = require("firebase");
var _ = require('lodash');
var firebase = new Firebase("https://luminous-inferno-2359.firebaseio.com");

var game = module.exports = {
  start: function(width, height) {
    var self = this;
    this.width = width;
    this.height = height;

    this.board = _.times(height, function() {
      return _.times(width, function() {
        return { mine: Math.random() < 0.3, open: false, nearby: 0 };
      });
    })

    this.board.map(function(row, y) {
      row.map(function(space, x) {
        self.getSiblings(x, y).map(function(sibling) {
          if (sibling.mine) space.nearby++;
        })
      })
    });

    console.log(this.board);

    firebase.child('board').set(this.board);
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
  },
  getSiblings: function(x, y) {
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
