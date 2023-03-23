const canvas = document.getElementById("canvas");
// const stateCanvas = document.getElementById("state");
if (canvas.getContext) {
  init();
}

function init() {
  const winW = window.innerWidth;
  const winH = window.innerHeight;
  const width = (canvas.width = winW / 2);
  const height = (canvas.height = winH / 2);
  const ctx = canvas.getContext("2d");

  //
  const margin = 20;
  const dansoWidth = 50;
  const dansoHeight = 100;
  const workerWidth = 50;
  const workerHeight = 100;

  // 상태
  let running = false;
  let paused = false;
  let dead = false;
  let played = false;
  let timer = 0;
  let diffX, diffY;

  // 객체
  let runAnimation = null;
  let dansoMan = null;
  let workers = [];

  function clearBg() {
    ctx.fillStyle = "#f2f2f2";
    ctx.fillRect(0, 0, width, height);
  }

  class DansoMan {
    constructor() {
      this.defaultY = (height / 3) * 2 - dansoHeight;
      this.x = margin;
      this.y = (height / 3) * 2 - dansoHeight;
      this.w = dansoWidth;
      this.h = dansoHeight;
      this.jump = false;
      this.up = false;
    }
    draw() {
      if (this.jump) {
        if (this.up) {
          this.y -= 5;
          if (this.y < this.defaultY - this.h * 2) {
            this.up = false;
          }
        } else {
          this.y += 5;
          if (this.y >= this.defaultY) {
            this.jump = false;
          }
        }
      }
      clearBg();
      ctx.fillStyle = "#000";
      ctx.fillRect(this.x, this.y, this.w, this.h);
    }
  }

  class Worker {
    constructor() {
      this.defaultY = (height / 3) * 2 - 100;
      this.x = width - margin - workerWidth;
      this.y = (height / 3) * 2 - 100;
      this.w = workerWidth;
      this.h = workerHeight;
      this.speed = 5;
    }
    draw() {
      // console.log("역무원이 나타났다!");
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(this.x, this.y, this.w, this.h);
      this.x -= this.speed;
    }
  }

  function start() {
    init();
    document.querySelector(".float-area").classList.remove("show");
    dansoMan = new DansoMan();
    dansoMan.draw();
    run();
  }

  function run() {
    running = true;

    timer++;
    document.getElementById("score").innerHTML = timer;
    dansoMan.draw();

    if (timer % 120 === 0) {
      const speed = Math.floor(Math.random() * 6 + 2);
      const worker = new Worker();
      worker.speed = speed;
      workers.push(worker);
    }

    runAnimation = requestAnimationFrame(run);
    workers.forEach((worker, i) => {
      worker.draw();
      crash(dansoMan, worker);
    });
    showState(dansoMan.jump);
  }

  function crash(man, worker) {
    diffX = worker.x - (man.x + man.w);
    diffY = worker.y - (man.y + man.h);
    const maxX = worker.w + man.w;
    if (diffX < 0 && diffX > -maxX && diffY < 0) {
      finish();
    }
    document.getElementById("x-show").innerHTML = diffX;
    document.getElementById("y-show").innerHTML = diffY;
  }

  function pause() {
    running = false;
    paused = true;
    cancelAnimationFrame(runAnimation);

    showState();
  }

  function finish() {
    running = false;
    played = true;
    dead = true;
    cancelAnimationFrame(runAnimation);
    changeState();

    if (played) {
      document.querySelector(".result-score").classList.add("show");
      document.getElementById("resultScore").innerHTML = timer;
    }
    document.querySelector(".float-area").classList.add("show");

    showState();
  }

  window.addEventListener("load", (e) => {
    document.querySelector(".float-area").classList.add("show");
  });

  window.addEventListener("keydown", (e) => {
    console.log(e.key, dansoMan);
    if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
      dansoMan.jump = true;
      dansoMan.up = true;
    }
  });

  window.addEventListener("click", (e) => {
    console.log(e.target);
    if (e.target.getAttribute("id") === "btnStart") {
      start();
    }
    if (e.target.getAttribute("id") === "btnToggle") {
      running = !running;
      paused = !paused;
      changeState();
    }
  });
  function changeState() {
    console.log("change");
    if (running && !paused && !dead) {
      run();
    }
    if (paused) {
      if (dead) {
        finish();
      } else {
        pause();
      }
    }
  }

  clearBg();
  function showState(jump) {
    document.getElementById("running-show").innerHTML = running;
    document.getElementById("dead-show").innerHTML = dead;
    document.getElementById("paused-show").innerHTML = paused;
    document.getElementById("jump-show").innerHTML = jump;
  }
}

document.getElementById("wrap").appendChild(canvas);
