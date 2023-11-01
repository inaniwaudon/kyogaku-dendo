let textImage;
let npotasoImage;
let cupImage;
let noImages;

// 画像読み込み
const loadImage = (src) =>
  new Promise((resolve) => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      resolve(image);
    };
  });

// グラフのパターンを描画
const patternCanvas = (() => {
  const size = 2000;
  const interval = 13;
  const radius = 4;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = size;
  canvas.height = size;
  context.fillStyle = "#000099";

  for (let y = 0; y < size / interval; y++) {
    for (let x = 0; x < size / interval; x++) {
      context.moveTo(x * interval, y * interval);
      context.arc(
        x * interval * 2,
        y * interval * 2,
        radius * 2,
        0,
        2 * Math.PI
      );
    }
  }
  context.fill();

  return canvas;
})();

const drawImage = async (current, left, ratio) => {
  const width = 1920 * 2;
  const height = 1080 * 2;

  const canvas = document.getElementById("graph-canvas");
  const context = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;

  context.fillStyle = "#ffcc53";
  context.fillRect(0, 0, width, height);

  // グラフの Canvas を用意
  const barX = 285 * 2;
  const barY = 130 * 2;
  const barWidth = 200 * 2;
  const barHeight = 950 * 2;

  const graphCanvas = document.createElement("canvas");
  const graphContext = graphCanvas.getContext("2d");
  graphCanvas.width = barWidth;
  graphCanvas.height = barHeight;

  const rotation = ((2 * Math.PI) / 360) * -10;
  graphContext.rotate(rotation);
  graphContext.drawImage(patternCanvas, -400, -0);
  graphContext.rotate(-rotation);
  graphContext.clearRect(0, 0, barWidth, barHeight * (1.0 - ratio));

  // グラフ描画
  context.fillStyle = "#ea9900";
  context.fillRect(barX, barY, barWidth, barHeight);
  context.drawImage(graphCanvas, barX, barY);

  // テキスト画像
  context.drawImage(textImage, 0, 0, width, height);

  // 損益分岐点まで
  context.font = "bold 220px sans-serif";
  context.textAlign = "center";
  context.fillStyle = "#006";
  context.lineWidth = 18 * 2;

  const sonekiX = 3230;
  const sonekiY = 840;

  context.strokeStyle = "#ff3366";
  context.strokeText(left, sonekiX + 8 * 2, sonekiY + 8 * 2);
  context.strokeStyle = "#ffffff";
  context.strokeText(left, sonekiX, sonekiY);
  context.fillText(left, sonekiX, sonekiY);

  // 現在の杯数
  const currentX = 2200;
  const currentY = 940;
  const currentWidth = 720;

  const hundred = Math.floor(current / 100);
  const ten = Math.floor((current % 100) / 10);
  const one = current % 10;

  if (hundred > 0) {
    context.drawImage(noImages[hundred], currentX - currentWidth * 2, currentY);
  }
  if (hundred > 0 || ten > 0) {
    context.drawImage(noImages[ten], currentX - currentWidth, currentY);
  }
  context.drawImage(noImages[one], currentX, currentY);

  // 「杯」、んぽたそ画像
  context.drawImage(cupImage, 0, 0, width, height);
  context.drawImage(npotasoImage, 0, 0, width, height);
};

const update = async () => {
  const url = "https://renbai-counter.yokohama.dev/order";
  const response = await fetch(url);
  const json = await response.json();

  const current = json.sum_count;
  const left = 480 - current;
  const ratio = current / 600;

  drawImage(current, left, ratio);

  // Twitter リンク更新
  const twitterLink = document.getElementById("twitter");
  const tweet = `驚額の殿堂 リアルタイム売上監視システム\n現在やきそばが ${current} 杯売れています\nhttps://kyogaku.yokohama.dev/realtime`;
  twitterLink.href = encodeURI(
    `https://twitter.com/intent/tweet?text=${tweet}`
  );
};

window.addEventListener("load", async () => {
  // 画像読み込み
  textImage = await loadImage("../img/realtime/text.webp");
  cupImage = await loadImage("../img/realtime/cup.webp");
  npotasoImage = await loadImage("../img/realtime/npotaso.webp");

  noImages = [
    await loadImage("../img/realtime/0.webp"),
    await loadImage("../img/realtime/1.webp"),
    await loadImage("../img/realtime/2.webp"),
    await loadImage("../img/realtime/3.webp"),
    await loadImage("../img/realtime/4.webp"),
    await loadImage("../img/realtime/5.webp"),
    await loadImage("../img/realtime/6.webp"),
    await loadImage("../img/realtime/7.webp"),
    await loadImage("../img/realtime/8.webp"),
    await loadImage("../img/realtime/9.webp"),
  ];

  // 画面更新
  update();

  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has("interval")) {
    const interval = parseFloat(searchParams.get("interval"));
    setInterval(update, 1000 * interval);
  }
});
