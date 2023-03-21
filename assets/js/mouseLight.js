const canvas = document.getElementById("canvas");
canvas.style.cursor = "none";
if (canvas.getContext) {
  init();
}

function init() {
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);
  const ctx = canvas.getContext("2d");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.willReadFrequently = true;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  const staticLightPos = [{ x: width / 2, y: height / 2 }];
  let mousePos = { x: 0, y: 0 };

  function move() {
    imageData = ctx.getImageData(0, 0, width, height);
    data = imageData.data;

    ctx.fillRect(0, 0, width, height);
    let allPos = staticLightPos.slice();
    allPos.push(mousePos);

    let currPos;
    const radius = 10;

    for (let a = 0; a < width; a++) {
      for (let b = 0; b < height; b++) {
        let closestDistanceToAnyLight = 100000;
        for (let i = 0; i < allPos.length; i++) {
          currPos = allPos[i];
          const { x, y } = currPos;
          const distance = parseInt(
            Math.sqrt(Math.pow(x - a, 2) + Math.pow(y - b, 2))
          );
          if (distance < closestDistanceToAnyLight) {
            closestDistanceToAnyLight = distance;
          }
        }
        const index = (b * width + a) * 4;
        const color = parseInt((100 / closestDistanceToAnyLight / 4) * 255);
        // const color = 255 - distance * 2;
        data[index + 0] = color;
        data[index + 1] = color;
        data[index + 2] = color;
        data[index + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(move);
  }

  canvas.addEventListener("mousemove", (e) => {
    mousePos = { x: e.clientX, y: e.clientY };
  });

  requestAnimationFrame(move);
}
document.getElementById("app").appendChild(canvas);
