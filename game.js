var Firebase = require("firebase");
var _ = require('lodash');
var firebase = new Firebase("https://luminous-inferno-2359.firebaseio.com");

var difficulty = 0.5;

var game = module.exports = {
  // Resets the game board with random mines
  start: function(width, height) {
    this.width = width;
    this.height = height;
    this.board = _.times(height, function(y) {
      return _.times(width, function(x) {
        return { mine: Math.random() < 0.1, open: false, nearby: 0, x: x, y: y };
      });
    });

    this.calculateNearby();

    firebase.child('board').set(this.board);
    firebase.child('moves').set([]);
  },
  // Gets the entire board from the server
  getBoard: function(fn) {
    firebase.child('board').once('value', function(data) {
      game.board = data.val();
      fn(data.val());
    });
  },
  // Watches for moves and applies them to the board
  watchMoves: function() {
    firebase.child('moves').on('child_added', function(data) {
      data = data.val();
      if (game.setCell(data.x, data.y, data.user)) {
        firebase.child('board').set(game.board);
      }
    });
  },
  // Watches for changes to the board and sends to a callback
  watchBoard: function(fn) {
    _.times(this.height, function(y) {
      firebase.child('board/' + y).on("child_changed", function(data) {
        fn(data.val());
      });
    });
  },
  // Makes a move
  makeMove: function(x, y, user) {
    firebase.child('moves').push({ x: x, y: y, user: user });
  },
  // Sets a cell to a user
  setCell: function(x, y, user) {
    if (this.board[y][x].open !== false) return;

    this.board[y][x].open = user;
    if (this.board[y][x].nearby === 0) {
      this.getAdjacents(x, y).map(function(adjacent) {
        game.setCell(adjacent.x, adjacent.y, user);
      });
    }
    return true;
  },
  // Calculates the number of mines around each cell
  calculateNearby: function() {
    this.board.map(function(row, y) {
      row.map(function(cell, x) {
        cell.nearby = 0;
        game.getAdjacents(x, y).map(function(adjacent) {
          if (adjacent.mine) cell.nearby++;
        })
      })
    });
  },
  // Gets the adjacent cells for a cell, including itself
  getAdjacents: function(x, y) {
    var adjacents = [];
    [-1, 0, 1].map(function(yy) {
      [-1, 0, 1].map(function(xx) {
        if (game.board[y + yy] && game.board[y + yy][x + xx]) {
          adjacents.push(game.board[y + yy][x + xx]);
        }
      });
    });
    return adjacents;
  },
  // Renders the board to the console
  renderBoard: function() {
    console.log(_.repeat('- ', 16));
    this.board.map(function(row, y) {
      console.log(row.map(function(cell, x) {
        return cell.mine ? 'X' : (cell.open ? cell.nearby : '?');
      }).join(' '));
    });
    console.log(_.repeat('- ', 16) + '\n');
  }
};
