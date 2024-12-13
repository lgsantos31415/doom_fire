let width = 12;
let height = 12;
let numberOfCells = width * height;
let array = Array(numberOfCells).fill(0);
let canva = document.getElementById("canva");
let cellSize = (window.innerHeight - 200) / height;
let cells = [];
let palette = [
  "#070707",
  "#1F0707",
  "#2F0F07",
  "#470F07",
  "#571707",
  "#671F07",
  "#771F07",
  "#8F2707",
  "#9F2F07",
  "#AF3F07",
  "#BF4707",
  "#C74707",
  "#DF4F07",
  "#DF5707",
  "#DF5707",
  "#D75F07",
  "#D75F07",
  "#D7670F",
  "#CF6F0F",
  "#CF770F",
  "#CF7F0F",
  "#CF8717",
  "#C78717",
  "#C78F17",
  "#C79F1F",
  "#BF9F1F",
  "#BF9F1F",
  "#BFA727",
  "#BFA727",
  "#BFAF2F",
  "#B7AF2F",
  "#B7B72F",
  "#B7B737",
  "#CFCF6F",
  "#DFDF9F",
  "#EFEFC7",
  "#FFFFFF",
];
let lastTwoColumns = [];
for (let x = width - 2; x < width; x++) {
  for (let y = 0; y < height; y++) {
    let index = searchTable(y, x);
    lastTwoColumns.push(index);
  }
}

let row = document.getElementById("row");
let debug = row.children[0];
let bstart = row.children[1];
let pause = row.children[2];
pause.classList.add("invisible");
let restart = row.children[3];
restart.classList.add("invisible");
let interval;
let debugState = false;
let runningState = false;

function debugFunction() {
  debugState = !debugState;

  if (debugState) {
    cells.forEach((td) => {
      td.style.border = `1px solid black`;
      let p = td.querySelector("p");
      let span = td.querySelector("span");
      p.classList.remove("invisible");
      span.classList.remove("invisible");
    });
  } else {
    cells.forEach((td) => {
      td.style.border = `none`;
      let p = td.querySelector("p");
      let span = td.querySelector("span");
      p.classList.add("invisible");
      span.classList.add("invisible");
    });
  }
}

function startFunction() {
  runningState = !runningState;
  interval = setInterval(loop, 175);
  bstart.classList.add("invisible");
  pause.classList.remove("invisible");
  restart.classList.remove("invisible");
}

function pauseFunction() {
  runningState = !runningState;
  clearInterval(interval);
  bstart.classList.remove("invisible");
  pause.classList.add("invisible");
}

function restartFunction() {
  runningState = !runningState;
  clearInterval(interval);
  bstart.classList.remove("invisible");
  pause.classList.add("invisible");
  restart.classList.add("invisible");
  array = Array(numberOfCells).fill(0);
  updateTable();
  ignition();
}

debug.onclick = debugFunction;
bstart.onclick = startFunction;
pause.onclick = pauseFunction;
restart.onclick = restartFunction;

function searchTable(row, col) {
  return row * width + col;
}

function createTable() {
  let table = document.createElement("table");
  let tbody = document.createElement("tbody");

  for (let x = 0; x < width; x++) {
    let tr = document.createElement("tr");
    for (let y = 0; y < height; y++) {
      let td = document.createElement("td");

      let index = searchTable(x, y);

      let p = document.createElement("p");
      p.innerText = array[index];
      p.style.fontSize = `${cellSize * 0.4}px`;
      p.classList.add("invisible");
      let span = document.createElement("span");
      span.innerText = index;
      span.style.fontSize = `${cellSize * 0.3}px`;
      span.classList.add("invisible");

      td.appendChild(p);
      td.appendChild(span);

      td.style.width = `${cellSize}px`;
      td.style.height = `${cellSize}px`;

      tr.appendChild(td);
      cells.push(td);
    }
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  canva.appendChild(table);
}

function ignition() {
  for (let x = 0; x < width; x++) {
    let index = searchTable(height - 1, x);
    array[index] = 36;
  }
}

function propagation() {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width - 1; x++) {
      let index = searchTable(x, y);
      let indexBelow = index + height;
      let randInt = Math.floor(Math.random() * 12);
      let randWind = Math.floor(Math.random() * 3);

      if (lastTwoColumns.includes(index)) {
        array[index] = Math.max(array[indexBelow] - randInt, 0);
      } else {
        array[index] = Math.max(array[indexBelow + randWind] - randInt, 0);
      }
    }
  }
}

function updateTable() {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let index = searchTable(x, y);

      cells[index].style.background = palette[array[index]];

      if (array[index] < 16 && debugState) {
        cells[index].style.border = "1px solid white";
        cells[index].style.color = "white";
      } else if (array[index] >= 16 && debugState) {
        cells[index].style.border = "1px solid black";
        cells[index].style.color = "black";
      }

      let p = cells[index].querySelector("p");
      p.innerText = array[index];
    }
  }
}

function start() {
  createTable();
  updateTable();
  ignition();
}

function loop() {
  propagation();
  updateTable();
}

start();
