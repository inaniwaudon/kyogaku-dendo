let textImage;
let honImage;
let barImage;
let npotasoImage;
let noImages = [];
let leftImages = [];

// 画像読み込み
const loadImage = (src) =>
  new Promise((resolve) => {
    const image = new Image();
    image.src = src;
    image.setAttribute("crossorigin", "anonymous");
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
  context.fillStyle = "#ffffff";

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

  // 背景色
  context.fillStyle = "#ffcc53";
  context.fillRect(0, 0, width, height);

  // グラフ描画
  (() => {
    // グラフの Canvas を用意
    const barX = 220 * 2;
    const barY = 130 * 2;
    const barWidth = 78 * 2;
    const barHeight = 950 * 2;

    const graphCanvas = document.createElement("canvas");
    const graphContext = graphCanvas.getContext("2d");
    graphCanvas.width = barWidth;
    graphCanvas.height = barHeight;

    const rotation = ((2 * Math.PI) / 360) * -10;
    graphContext.fillStyle = "#003377";
    graphContext.fillRect(0, 0, barWidth, barHeight);
    graphContext.rotate(rotation);
    graphContext.drawImage(patternCanvas, -400, -0);
    graphContext.rotate(-rotation);
    graphContext.clearRect(0, 0, barWidth, barHeight * (1.0 - ratio));

    // グラフ描画
    context.drawImage(barImage, 0, 0);
    context.drawImage(graphCanvas, barX, barY);
  })();

  // テキスト描画
  context.drawImage(textImage, 0, 0, width, height);

  // 損益分岐点まで
  (() => {
    const hundred = Math.floor(left / 100);
    const ten = Math.floor((left % 100) / 10);
    const one = left % 10;
    const scale = 1.2;

    const oneImage = leftImages[one];
    const tenImage = leftImages[ten];
    const hundredImage = leftImages[hundred];

    // 本数位置
    const right = 3210;
    const top = 750;
    const oneX = right - oneImage.naturalWidth * scale + 60;
    const tenX = oneX - tenImage.naturalWidth * scale + 60;
    const hundredX = tenX - hundredImage.naturalWidth * scale + 60;

    // 100 の位
    if (hundred > 0) {
      context.drawImage(
        hundredImage,
        hundredX,
        top,
        hundredImage.naturalWidth * scale,
        hundredImage.naturalHeight * scale
      );
    }

    // 10 の位
    if (hundred > 0 || ten > 0) {
      context.drawImage(
        tenImage,
        tenX,
        top,
        tenImage.naturalWidth * scale,
        tenImage.naturalHeight * scale
      );
    }

    // 1 の位
    context.drawImage(
      oneImage,
      oneX,
      top,
      oneImage.naturalWidth * scale,
      oneImage.naturalHeight * scale
    );
  })();

  // 現在の本数
  (() => {
    const thousand = Math.floor(current / 1000);
    const hundred = Math.floor((current % 1000) / 100);
    const ten = Math.floor((current % 100) / 10);
    const one = current % 10;
    const scale = 1.15;

    const oneImage = noImages[one];
    const tenImage = noImages[ten];
    const hundredImage = noImages[hundred];
    const thousandImage = noImages[thousand];

    // 本数位置
    const right = 3200;
    const top = 1110;
    const oneX = right - oneImage.naturalWidth * scale + 280;
    const tenX = oneX - tenImage.naturalWidth * scale + 280;
    const hundredX = tenX - hundredImage.naturalWidth * scale + 280;
    const thousandX = hundredX - thousandImage.naturalWidth * scale + 280;

    // 1000 の位
    if (thousand > 1) {
      context.drawImage(
        thousandImage,
        thousandX,
        top,
        thousandImage.naturalWidth * scale,
        thousandImage.naturalHeight * scale
      );
    }

    // 100 の位
    if (hundred > 0) {
      context.drawImage(
        hundredImage,
        hundredX,
        top,
        hundredImage.naturalWidth * scale,
        hundredImage.naturalHeight * scale
      );
    }

    // 10 の位
    if (hundred > 0 || ten > 0) {
      context.drawImage(
        tenImage,
        tenX,
        top,
        tenImage.naturalWidth * scale,
        tenImage.naturalHeight * scale
      );
    }

    // 1 の位
    context.drawImage(
      oneImage,
      oneX,
      top,
      oneImage.naturalWidth * scale,
      oneImage.naturalHeight * scale
    );

    // 本
    context.drawImage(honImage, 0, 0, width, height);
  })();

  // んぽたそ画像
  context.drawImage(npotasoImage, -100, 0, width, height);
};

const update = async () => {
  const url = "https://renbai-counter.w-yuto09164566.workers.dev/order";
  const response = await fetch(url);
  const json = await response.json();
  const current = json.total_frank_count;

  const SONEKI = 800;
  const MAX = 1200;
  const left = Math.max(SONEKI - current, 0);
  const ratio = current / MAX;

  drawImage(current, left, ratio);

  // Twitter リンク更新
  const twitterLink = document.getElementById("twitter");
  const tweet = `驚額の殿堂2（ツー）リアルタイム売上システム\n現在フランクフルトが ${current} 本売れています\nhttps://kyogaku.yokohama.dev/realtime`;
  twitterLink.href = encodeURI(
    `https://twitter.com/intent/tweet?text=${tweet}`
  );
};

window.addEventListener("load", async () => {
  // 画像読み込み
  [
    textImage,
    honImage,
    barImage,
    npotasoImage,
    noImages[0],
    noImages[1],
    noImages[2],
    noImages[3],
    noImages[4],
    noImages[5],
    noImages[6],
    noImages[7],
    noImages[8],
    noImages[9],
    leftImages[0],
    leftImages[1],
    leftImages[2],
    leftImages[3],
    leftImages[4],
    leftImages[5],
    leftImages[6],
    leftImages[7],
    leftImages[8],
    leftImages[9],
  ] = await Promise.all([
    loadImage("../img/realtime/text.webp"),
    loadImage("../img/realtime/hon.webp"),
    loadImage("../img/realtime/bar.webp"),
    loadImage("../img/realtime/npotaso.webp"),
    loadImage("../img/realtime/0.webp"),
    loadImage("../img/realtime/1.webp"),
    loadImage("../img/realtime/2.webp"),
    loadImage("../img/realtime/3.webp"),
    loadImage("../img/realtime/4.webp"),
    loadImage("../img/realtime/5.webp"),
    loadImage("../img/realtime/6.webp"),
    loadImage("../img/realtime/7.webp"),
    loadImage("../img/realtime/8.webp"),
    loadImage("../img/realtime/9.webp"),
    loadImage("../img/realtime/left/0.webp"),
    loadImage("../img/realtime/left/1.webp"),
    loadImage("../img/realtime/left/2.webp"),
    loadImage("../img/realtime/left/3.webp"),
    loadImage("../img/realtime/left/4.webp"),
    loadImage("../img/realtime/left/5.webp"),
    loadImage("../img/realtime/left/6.webp"),
    loadImage("../img/realtime/left/7.webp"),
    loadImage("../img/realtime/left/8.webp"),
    loadImage("../img/realtime/left/9.webp"),
  ]);

  // 画面更新
  update();

  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has("interval")) {
    const interval = parseFloat(searchParams.get("interval"));
    setInterval(update, 1000 * interval);
  }
});

const openImage = () => {
  const canvas = document.getElementById("graph-canvas");
  canvas.toBlob((blob) => {
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.click();
    URL.revokeObjectURL(link.href);
  });
};
