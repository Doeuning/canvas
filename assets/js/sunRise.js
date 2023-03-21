const canvas = document.getElementById("canvas");
if (canvas.getContext) {
  init();
}

function init() {
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);
  const ctx = canvas.getContext("2d");
  let rotationValue = 0;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.willReadFrequently = true;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  const staticLightPos = [{ x: width / 2, y: height / 2 }];

  function toRadian(d) {
    return (d * Math.PI) / 180;
  }
  function move() {
    imageData = ctx.getImageData(0, 0, width, height);
    data = imageData.data;

    ctx.translate(width / 2, height);
    ctx.save();
    ctx.rotate(toRadian(rotationValue));
    rotationValue += 1;

    ctx.fillRect(0, 0, width, height);
    let allPos = staticLightPos.slice();

    let currPos;

    for (let a = 0; a < width; a++) {
      for (let b = 0; b < height; b++) {
        let closestDistanceToAnyLight = 10000;
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

        const color = parseInt((255 * 25) / closestDistanceToAnyLight);
        data[index + 0] = color;
        data[index + 1] = color;
        data[index + 2] = color + 155;
        data[index + 3] = 100;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(move);
  }

  requestAnimationFrame(move);
}
document.getElementById("app").appendChild(canvas);
