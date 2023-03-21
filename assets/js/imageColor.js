const canvas = document.getElementById("canvas");
canvas.style.cursor = "none";
if (canvas.getContext) {
  init();
}

function init() {
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);
  const ctx = canvas.getContext("2d");

  const bg = new Image();
  let imageData, data;
  let mousePos = { x: 0, y: 0 };

  function draw() {
    bg.addEventListener("load", () => {
      ctx.drawImage(bg, 0, 0, width, height);
      gray();
    });

    bg.src = "../assets/images/image.jpg";
  }

  function gray() {
    imageData = ctx.getImageData(0, 0, width, height);
    data = imageData.data;

    for (let a = 0; a < width; a++) {
      for (let b = 0; b < height; b++) {
        const index = (b * width + a) * 4;
        0;
        const lightness =
          (data[index + 0] + data[index + 1] + data[index + 2]) / 3;
        data[index + 0] = lightness;
        data[index + 1] = lightness;
        data[index + 2] = lightness;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }
  function move() {
    const { x, y } = mousePos;
    const radius = 10;
    imageData = ctx.getImageData(0, 0, width, height);
    data = imageData.data;

    for (let a = 0; a < width; a++) {
      for (let b = 0; b < height; b++) {
        const index = (b * width + a) * 4;
        const distance = Math.sqrt(Math.pow(x - a, 2) + Math.pow(y - b, 2));
        if (distance < radius) {
          data[index + 0] = 255;
          data[index + 1] = 255;
          data[index + 2] = 255;
          data[index + 3] = 0;
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(move);
  }

  canvas.addEventListener("mousemove", (e) => {
    mousePos = { x: e.clientX, y: e.clientY };
  });
  draw();
  requestAnimationFrame(move);
}
document.getElementById("app").appendChild(canvas);
