let ROWS = 8;
let COLS = 8;
let SQUARE_SIZE = 100;
let board = [];


function createBoard() {
  for (let r = 0; r < ROWS; r++) {
    let row = [];
    for (let c = 0; c < COLS; c++) {
      if (r < 3 && (r + c) % 2 === 1) {
        row.push(new Piece(r, c, "red", false, false));
      } else if (r > 4 && (r + c) % 2 === 1) {
        row.push(new Piece(r, c, "gray", false, false));
      } else {
        row.push(null);
      }
    }
    board.push(row);
  }
}

function drawBoard() {
  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if ((r + c) % 2 === 0) {
        ctx.fillStyle = "white";
      } else {
        ctx.fillStyle = "black";
      }
      ctx.fillRect(c * SQUARE_SIZE, r * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    }
  }
}

function drawPieces() {
  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let piece = board[r][c];
      if (piece != null) {
        piece.draw(ctx);
      }
      // if (board[r][c] !== 0) {
      //   if (board[r][c] === 1) {
      //     ctx.fillStyle = "grey";
      //   } else {
      //     ctx.fillStyle = "red";
      //   }
      //   let x = c * SQUARE_SIZE + SQUARE_SIZE / 2;
      //   let y = r * SQUARE_SIZE + SQUARE_SIZE / 2;
      //   let radius = SQUARE_SIZE / 2 - 10;

      //   ctx.beginPath();
      //   ctx.arc(x, y, radius, 0, 2 * Math.PI);
      //   ctx.fill();
      // }
    }
  }
}
function handleClick(event) {
  let canvas = document.getElementById("myCanvas");
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  let col = Math.floor(x / SQUARE_SIZE);
  let row = Math.floor(y / SQUARE_SIZE);

  let clickedPiece = board[row][col];
  //square is not empty
  if (clickedPiece != null) {
    let selectedPiece = getSelectedPiece();

    if (selectedPiece && selectedPiece != clickedPiece) {
      selectedPiece.isClicked = false;
      clickedPiece.isClicked = true;
    } else if (selectedPiece == clickedPiece) {
      clickedPiece.isClicked = !clickedPiece.isClicked;
    } else {
      clickedPiece.isClicked = true;
    }
  }
  //square is empty
  else {
    let p = getSelectedPiece();
    if (p != null && p.isValidMove(row, col) == true) {
      board[p.row][p.col] = null;
      p.row = row;
      p.col = col;
      p.checkKing();
      board[row][col] = p;
      p.isClicked = false;
    }
  }

  drawBoard();
  drawPieces();
  currenTurn++;
  // alert(
  //   "Clicked: Column " + row + ", row " + col + " → value = " + clickedPiece
  // );
}

window.onload = function () {
  createBoard();
  drawBoard();
  drawPieces();

  const canvas = document.getElementById("myCanvas");
  canvas.addEventListener("click", handleClick);
};

//CREATE A CONSTRUCTOR FUNCTION (Piece)

function Piece(row, col, color, isClicked, isKing) {
  this.row = row;
  this.col = col;
  this.color = color;
  this.isClicked = isClicked;
  this.isKing = isKing;

  //draw method
  this.draw = function (ctx) {
    let x = this.col * SQUARE_SIZE + SQUARE_SIZE / 2;
    let y = this.row * SQUARE_SIZE + SQUARE_SIZE / 2;
    let radius = SQUARE_SIZE / 2 - 10;

    if (this.isClicked == true) {
      //yellow circle
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(x, y, 50, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.fillStyle = this.color;
    ctx.beginPath();

    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();

    if (this.isKing == true) {
      ctx.fillStyle = "white";

      // Left eye
      ctx.beginPath();
      ctx.arc(x - 10, y - 10, 3, 0, 2 * Math.PI);
      ctx.fill();

      // Right eye
      ctx.beginPath();
      ctx.arc(x + 10, y - 10, 3, 0, 2 * Math.PI);
      ctx.fill();

      // mouth
      ctx.beginPath();
      ctx.arc(x, y + 5, 10, 0, Math.PI);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  //checkKing method
  this.checkKing = function () {
    if (this.color == "red" && this.row == 7) {
      this.isKing = true;
    } else if (this.color == "gray" && this.row == 0) {
      this.isKing = true;
    }
  };

  // isValid method
  this.isValidMove = function (newRow, newCol) {
    if (newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLS)
      return false;

    // new place has to be empty
    if (board[newRow][newCol] !== null) return false;

    let rowDiff = newRow - this.row;
    let colDiff = newCol - this.col;

    if (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1) {
      if (this.color === "red" && (rowDiff == 1 || this.isKing)) {
        return true;
      }
      if (this.color == "gray" && (rowDiff == -1 || this.isKing)) {
        return true;
      }
    }

    //jump move and then capture middle piece
    
    if (this.isKing == true) {
      if (Math.abs(colDiff) == 2 && Math.abs(rowDiff) == 2) {
        let midRow = this.row + rowDiff / 2;
        let midCol = this.col + colDiff / 2;
        let jumpedPiece = board[midRow][midCol];
        if (jumpedPiece != null && jumpedPiece.color != this.color) {
          board[midRow][midCol] = null;
          
          return true;
        
        }
      }
    } else if (this.color == "gray") {
      if (Math.abs(colDiff) == 2 && rowDiff == -2) {
        let midRow = this.row + rowDiff / 2;
        let midCol = this.col + colDiff / 2;
        let jumpedPiece = board[midRow][midCol];
        if (jumpedPiece != null && jumpedPiece.color != this.color) {
          board[midRow][midCol] = null;
          return true;
        }
      }
    } else if (this.color == "red") {
      if (Math.abs(colDiff) == 2 && rowDiff == 2) {
        let midRow = this.row + rowDiff / 2;
        let midCol = this.col + colDiff / 2;
        let jumpedPiece = board[midRow][midCol];
        if (jumpedPiece != null && jumpedPiece.color != this.color) {
          board[midRow][midCol] = null;
          return true;
        }
      }
    }

   

    return false;
  };
}

function getSelectedPiece() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let piece = board[i][j];
      if (piece != null && piece.isClicked == true) {
        return piece;
      }
    }
  }
  return null;
}
