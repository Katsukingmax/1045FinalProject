// alert("HEllo this is Katsuki from javascript");

// alert("HEllo this is Katsuki from javascript222");

// function findAvg(num1, num2, num3) {
//   return (num1 + num2 + num3) / 3;
// }
// function sum(num1, num2) {
//   return num1 + num2;
// }
// function newFunc1() {
//   return "new Function1";
// }
// function newFunc2() {
//   return "new function2";
// }
let ROWS = 8;
let COLS = 8;
let SQUARE_SIZE = 100;
let board = [];
//0=empty 1=red 2=black

function createBoard() {
  for (let r = 0; r < ROWS; r++) {
    let row = [];
    for (let c = 0; c < COLS; c++) {
      if (r < 3 && (r + c) % 2 === 1) {
        row.push(2);
      } else if (r > 4 && (r + c) % 2 === 1) {
        row.push(1);
      } else {
        row.push(0);
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
      if (board[r][c] !== 0) {
        if (board[r][c] === 1) {
          ctx.fillStyle = "grey";
        } else {
          ctx.fillStyle = "red";
        }
        let x = c * SQUARE_SIZE + SQUARE_SIZE / 2;
        let y = r * SQUARE_SIZE + SQUARE_SIZE / 2;
        let radius = SQUARE_SIZE / 2 - 10;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
      }
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
  let value = board[row][col];

  alert("Clicked: Column " + row + ", row " + col + " → value = " + value);
}

window.onload = function () {
  createBoard();
  drawBoard();
  drawPieces();

  const canvas = document.getElementById("myCanvas");
  canvas.addEventListener("click", handleClick);
};
