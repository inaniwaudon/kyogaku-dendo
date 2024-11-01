const IS_DEVELOPMENT = false;

const token = localStorage.getItem("token");

let priceInput;
let frankCountInput;
let drinkCountInput;
let statusTextarea;

const displayDateTime = (date) => {
  const zeroPadding = (str) => ("0" + str).slice(-2);
  return `${zeroPadding(date.getMonth() + 1)}/${zeroPadding(
    date.getDate()
  )} ${zeroPadding(date.getHours())}:${zeroPadding(
    date.getMinutes()
  )}:${zeroPadding(date.getSeconds())}`;
};

const setPrice = (value) => {
  priceInput.value = value;
};

const setFrankCount = (value) => {
  frankCountInput.value = value;
};

const setDrinkCount = (value) => {
  drinkCountInput.value = value;
};

const onClick = async () => {
  try {
    // トークン確認
    if (!token) {
      alert("トークンが登録されていません");
      return;
    }

    const price = parseInt(priceInput.value);
    const frankCount = parseInt(frankCountInput.value);
    const drinkCount = parseInt(drinkCountInput.value);
    const memo = document.getElementById("memo").value;

    const url = IS_DEVELOPMENT
      ? "http://localhost:8787/order"
      : "https://renbai-counter.w-yuto09164566.workers.dev/order";
    const data = { price, frankCount, drinkCount, memo };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      statusTextarea.value =
        `${price} 円 ×（フ ${frankCount} 個，飲 ${drinkCount} 個） ／ ${displayDateTime(
          new Date()
        )}\n` + statusTextarea.value;
    } else {
      if (response.status === 401) {
        alert("認証エラーです");
      } else {
        alert("内部エラー（バックエンド）です");
      }
    }
  } catch (e) {
    console.log(e);
    alert("内部エラー（フロントエンド）です");
  }
};

window.addEventListener("load", async () => {
  priceInput = document.getElementById("price");
  frankCountInput = document.getElementById("frank-count");
  drinkCountInput = document.getElementById("drink-count");
  statusTextarea = document.getElementById("status");

  const submit = document.getElementById("submit");
  const now = document.getElementById("now");
  const tokenUnregistered = document.getElementById("token-unregistered");

  if (!token) {
    tokenUnregistered.style.display = "block";
  }
  submit.addEventListener("click", onClick);

  // 時刻の更新
  const time = () => {
    now.innerHTML = displayDateTime(new Date());
  };
  setInterval(time, 500);
});
