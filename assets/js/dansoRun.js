const canvas = document.getElementById("canvas");
// const stateCanvas = document.getElementById("state");
if (canvas.getContext) {
  init();
}

// // 역무원
// 어이 어이 얌마!
// 조용히해!
// 자리에 앉어!

// // 단소
// 너 누구야
// 너 누구야
// 후.아.유
// 컴온 컴온 컴온
// 나 여깄어
// 하! 하! 하!

function init() {
  const winW = window.innerWidth;
  const winH = window.innerHeight;
  const width = (canvas.width = winW / 2);
  const height = (canvas.height = winH / 2);
  const ctx = canvas.getContext("2d");

  const margin = 20;
  const dansoWidth = 60;
  const dansoHeight = 100;
  const workerWidth = 50;
  const workerHeight = 100;
  const dansomanSrc = [
    "../assets/images/dansoMan-0.png",
    "../assets/images/dansoMan-1.png",
    "../assets/images/dansoMan-2.png",
    "../assets/images/dansoMan-3.png",
  ];
  const msgSrc = {
    default: "../assets/images/txt-1.png",
    jump: "../assets/images/txt-2.png",
  };
  const workerSrc = [
    "../assets/images/worker-0.png",
    "../assets/images/worker-1.png",
  ];

  const dansomanImg = new Image();
  dansomanImg.src = dansomanSrc[0];

  const msgImg = new Image();
  msgImg.src = msgSrc.default;

  const workerImg = new Image();
  workerImg.src = workerSrc[0];

  // 상태
  let running = false;
  let paused = false;
  let dead = false;
  let played = false;
  let timer = 0;
  let diffX, diffY;
  let keydown = false;

  // 객체
  let runAnimation = null;
  let dansoMan = null;
  let workers = [];

  function setState() {
    running = false;
    paused = false;
    dead = false;
    played = false;
    timer = 0;
    diffX = null;
    diffY = null;
    keydown = false;

    runAnimation = null;
    dansoMan = null;
    workers = [];
  }

  function clearBg() {
    ctx.fillStyle = "#f2f2f2";
    ctx.fillRect(0, 0, width, height);
  }

  class DansoMan {
    constructor() {
      this.defaultY = (height / 4) * 3 - dansoHeight;
      this.x = margin;
      this.y = (height / 4) * 3 - dansoHeight;
      this.w = dansoWidth;
      this.h = dansoHeight;
      this.jump = false;
      this.up = false;
      this.currentImageIndex = 0;
      this.lastImageUpdateTime = 0;
    }
    message() {
      this.clearMessage();
      if (this.jump) {
        msgImg.src = msgSrc.jump;
      } else {
        msgImg.src = msgSrc.default;
      }
      ctx.drawImage(msgImg, this.x + 70, this.y - 30);
    }
    clearMessage() {
      ctx.fillStyle = "#f2f2f2";
      ctx.fillRect(this.x + 70, this.y - 30, 100, 400);
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
        dansomanImg.src = dansomanSrc[1];
      } else {
        if (Date.now() - this.lastImageUpdateTime > 200) {
          this.currentImageIndex =
            (this.currentImageIndex + 1) % dansomanSrc.length;
          this.lastImageUpdateTime = Date.now();
        }
        dansomanImg.src = dansomanSrc[this.currentImageIndex];
      }
      clearBg();
      this.message();
      ctx.drawImage(dansomanImg, this.x, this.y);
    }
  }

  class Worker {
    constructor() {
      this.defaultY = (height / 4) * 3 - 100;
      this.x = width - margin - workerWidth;
      this.y = (height / 4) * 3 - workerHeight;
      this.w = workerWidth;
      this.h = workerHeight;
      this.speed = 5;
      this.currentImageIndex = 0;
      this.lastImageUpdateTime = 0;
    }
    draw() {
      if (Date.now() - this.lastImageUpdateTime > 200) {
        this.currentImageIndex =
          (this.currentImageIndex + 1) % workerSrc.length;
        this.lastImageUpdateTime = Date.now();
      }
      workerImg.src = workerSrc[this.currentImageIndex];
      ctx.drawImage(workerImg, this.x, this.y);
      this.x -= this.speed;
    }
  }

  function start() {
    console.log("---------------------------start");
    setState();
    document.querySelector(".float-area").classList.remove("show");
    dansoMan = new DansoMan();
    dansoMan.draw();
    run();
  }

  function run() {
    console.log("run");
    running = true;

    timer++;
    document.getElementById("score").innerHTML = timer;
    document.getElementById("btnToggle").innerHTML = "PAUSE!";
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
    console.log("pause");
    running = false;
    paused = true;
    document.getElementById("btnToggle").innerHTML = "KEEP GOING!";
    cancelAnimationFrame(runAnimation);

    showState();
  }

  function finish() {
    console.log("finish------------");
    running = false;
    played = true;
    dead = true;
    keydown = false;
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
    console.log(e.code, e, dansoMan, "키다운");
    e.preventDefault();
    if (e.repeat === false) {
      if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
        dansoMan.jump = true;
        dansoMan.up = true;
        keydown = true;
      }
    }
  });

  window.addEventListener("click", (e) => {
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

  setState();
  clearBg();
  function showState(jump) {
    document.getElementById("running-show").innerHTML = running;
    document.getElementById("dead-show").innerHTML = dead;
    document.getElementById("paused-show").innerHTML = paused;
    document.getElementById("jump-show").innerHTML = jump;
  }
}

document.getElementById("wrap").appendChild(canvas);
