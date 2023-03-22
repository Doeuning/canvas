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
  let running = false;
  let dead = false;
  let runAnimation = null;
  let dansoMan = null;
  let workers = [];
  let timer = 0;
  // setting

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

  window.addEventListener("load", (e) => {
    document.getElementById("btnStart").classList.add("show");
  });

  window.addEventListener("keydown", (e) => {
    if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
      dansoMan.jump = true;
      dansoMan.up = true;
    }
  });

  window.addEventListener("click", (e) => {
    if (e.target.getAttribute("id") === "btnStart") {
      e.target.remove();
      dansoMan = new DansoMan();
      dansoMan.draw();
      running = true;
    }
    if (e.target.getAttribute("id") === "btnToggle") {
      const btnState = e.target.getAttribute("data-state");
      if (btnState === "running") {
        running = false;
        e.target.setAttribute("data-state", "paused");
      } else if (btnState === "paused") {
        running = true;
        e.target.setAttribute("data-state", "running");
      } else {
        running = true;
        e.target.setAttribute("data-state", "finished");
      }
      // if (running) {
      //   running = false;
      // } else {
      //   if (dead) {
      //     init();
      //   } else {
      //     running = true;
      //   }
      //   document.getElementById("btnToggle").innerHTML = "STOP!";
      // }
    }
    changeState();
  });
  function changeState() {
    console.log("change");
    if (running) {
      run();
      document.getElementById("btnToggle").classList.remove("stopped");
      document.getElementById("btnToggle").innerHTML = "PAUSE!";
    } else {
      stop();
      document.getElementById("btnToggle").classList.add("stopped");
      document.getElementById("btnToggle").innerHTML = "KEEP GOING!";
    }
  }
  function run() {
    timer++;
    document.getElementById("score").innerHTML = timer;
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
        endGame();
        changeState();
      }
    });
  }

  function stop() {
    const btnTxt = "KEEP GOING!";
    console.log(dead ? "----------------end--------------------" : "stop");
    document.getElementById("btnToggle").setAttribute("data-state", "paused");
    cancelAnimationFrame(runAnimation);
  }

  function endGame() {
    running = false;
    dead = true;
    const btnTxt = "TRY AGAIN!";
    document.getElementById("btnToggle").setAttribute("data-state", "finished");
    cancelAnimationFrame(runAnimation);
  }

  clearBg();
}

document.getElementById("wrap").appendChild(canvas);
