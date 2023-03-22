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

  // 상태
  let running = false;
  let paused = false;
  let dead = false;
  let timer = 0;

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
      this.defaultY = (height / 3) * 2 - 100;
      this.x = 20;
      this.y = (height / 3) * 2 - 100;
      this.w = 50;
      this.h = 100;
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
      this.x = width - 20 - 50;
      this.y = (height / 3) * 2 - 100;
      this.w = 50;
      this.h = 100;
    }
    draw() {
      // console.log("역무원이 나타났다!");
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(this.x, this.y, this.w, this.h);
      this.x -= 5;
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
    document.getElementById("resultScore").innerHTML = timer;
    dansoMan.draw();

    if (timer % 120 === 0) {
      const worker = new Worker();
      workers.push(worker);
    }

    runAnimation = requestAnimationFrame(run);

    const dansoPosX = dansoMan.x + dansoMan.w;
    const dansoPosY = dansoMan.y + dansoMan.h;
    workers.forEach((worker) => {
      worker.draw();
      if (dansoPosX >= worker.x && dansoPosY >= worker.y) {
        finish();
      }
    });
    showState(dansoMan.jump);
    console.log(dansoMan);
  }

  function pause() {
    running = false;
    paused = true;
    cancelAnimationFrame(runAnimation);
    showState();
  }

  function finish() {
    running = false;
    dead = true;
    cancelAnimationFrame(runAnimation);
    showState();

    document.querySelector(".float-area").classList.add("show");
  }

  window.addEventListener("load", (e) => {
    document.querySelector(".float-area").classList.add("show");
  });

  window.addEventListener("keydown", (e) => {
    if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
      dansoMan.jump = true;
      dansoMan.up = true;
    }
  });

  window.addEventListener("click", (e) => {
    if (e.target.getAttribute("id") === "btnStart") {
      start();
    }
    changeState();
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
