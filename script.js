// アクセスカウンタのフェッチ
const fetchAccessCounter = async () => {
  const url = "https://renbai-counter.yokohama.dev/counter";
  try {
    const request = await fetch(url);
    return (await request.json()).count;
  } catch {
    return null;
  }
};

// アクセスカウンタの計測 & 表示
const displayAccessCounter = async () => {
  let count = await fetchAccessCounter();

  // トップページのみ表示
  const span = document.querySelector("#access-counter-no");
  if (!span) {
    return;
  }
  if (count === null) {
    count = 0;
  }
  const countStr = ("00000" + count).slice(-6);
  for (let i = 0; i < 6; i++) {
    const digit = countStr[i];
    const img = document.createElement("img");
    img.src = `img/digits/${digit}.gif`;
    span.appendChild(img);
  }
};

// 共通ナビゲーションの表示
const displayNavigation = () => {
  const navHtml = `<h2>驚額の殿堂</h2>
<ul>
  <li><a href="index.html">トップ</a></li>
  <li><a href="genka.html">原価</a></li>
  <li><a href="poster.html">ポスター</a></li>
  <li><a href="heya.html">んぽたその部屋</a></li>
  <li><a href="chat.html">んぽとおはなしするんぽ〜〜</a></li>
  <li><a href="/maps">地図</a></li>
  <li><a href="kiyaku.html">んぽからのお願い</a></li>
  <li>レポート（工事中）</li>
</ul>
<a href="https://sites.google.com/view/happy-busy/">
  <img src="img/jikan.webp" alt="時間ねぇー" />
</a>`;
  const nav = document.getElementById("nav");
  nav.innerHTML = navHtml;
};

window.addEventListener("load", async () => {
  displayAccessCounter();
  displayNavigation();

  // 右クリック・コピーの禁止
  document.body.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    alert("右クリックは禁止です!!");
  });
  document.body.addEventListener("copy", (e) => {
    e.preventDefault();
    alert("コピーも禁止です!!");
  });
});
