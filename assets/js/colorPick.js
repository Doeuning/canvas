const canvas = document.getElementById("canvas");
const color = document.getElementById("color");
if (canvas.getContext) {
  init();
}

function init() {
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);
  const w = (color.width = 100);
  const h = (color.height = 100);

  const ctx = canvas.getContext("2d");
  const ctx2 = color.getContext("2d");

  const bg = new Image();
  let imgData, data, colorPicked;

  ctx2.clearRect(0, 0, w, h);
  ctx2.fillStyle = "black";
  ctx2.fillRect(0, 0, w, h);
  ctx2.fillStyle = "white";
  ctx2.fillRect(5, 5, w - 10, h - 10);
  // ctx2.strokeStyle = "#000";
  // ctx2.lineWidth = "5";
  // ctx2.strokeRect(0, 0, w, h);

  function draw() {
    bg.crossOrigin = "Anonymous";
    bg.addEventListener("load", () => {
      ctx.drawImage(bg, 0, 0, width, height);
      imgData = ctx.getImageData(0, 0, width, height);
      data = imgData.data;
    });
    bg.src = "../assets/images/image.jpg";
  }
  draw();

  console.log(data);
  function updateCanvas(mousePosition) {
    const x = mousePosition.x;
    const y = mousePosition.y;
    let r, g, b, a;

    const index = (y * width + x) * 4;
    r = data[index + 0];
    g = data[index + 1];
    b = data[index + 2];
    a = data[index + 3];

    console.log(index, r, g, b, a);
    colorPicked = `rgba(${r}, ${g}, ${b}, ${a})`;
    ctx2.fillStyle = "black";
    ctx2.fillRect(0, 0, w, h);
    ctx2.fillStyle = colorPicked;
    ctx2.fillRect(5, 5, w - 10, h - 10);
  }

  function getColor() {
    alert(colorPicked);
  }

  canvas.addEventListener("mousemove", (e) => {
    const mousePosition = { x: e.layerX, y: e.layerY };
    updateCanvas(mousePosition);
  });
  canvas.addEventListener("click", (e) => {
    getColor();
  });
}
document.getElementById("app").appendChild(canvas);
