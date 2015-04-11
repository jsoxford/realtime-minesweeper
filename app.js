var game = require('./game');
window.game = game;
var grid = new Grid(16, 16);
game.height = 16;
game.watchBoard(openCell);



function Grid(rows, cols){
    document.body.innerHTML = '<div id="grid">' + getCellHTML(rows, cols, 64, 64) + '</div>';
}

function getCellHTML(rows, cols, width, height){
  console.log(width, height);
  var user = "randomKey";
    cellsHTML = "";
    for (var x = 0; x < rows; x++){
        var left = x * width;
        for (var y = 0; y < cols; y++){
            var down = y * height;
            cellsHTML += '<div class="cell" x="' + x + '" y="' + y + '" style="left: ' + left + 'px; top: ' + down + 'px"></div>';    
        }
    }
    return cellsHTML;
}

function openCell(cell){
  console.log(cell);
  var child = 
    document.body.children[0].children[16*cell.x + cell.y].innerText = cell.nearby;
}

$("#grid").on("click", ".cell", function(e){
  var node = e.target;
  console.log(node);
  var x = node.getAttribute("x");
  var y = node.getAttribute("y");
  game.makeMove(x, y, "a key");
})