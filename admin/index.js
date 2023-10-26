const token = localStorage.getItem("token");
let status;

const displayDateTime = (date) => {
  const zeroPadding = (str) => ("0" + str).slice(-2);
  return `${zeroPadding(date.getMonth() + 1)}/${zeroPadding(
    date.getDate()
  )} ${zeroPadding(date.getHours())}:${zeroPadding(
    date.getMinutes()
  )}:${zeroPadding(date.getSeconds())}`;
};

const onClick = async () => {
  try {
    const price = parseInt(document.getElementById("price").value);
    const count = parseInt(document.getElementById("count").value);
    const memo = document.getElementById("memo").value;

    if (!token) {
      alert("トークンが登録されていません");
      return;
    }

    const url = "http://localhost:8787/order";
    const data = { price, count, memo };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": token,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const json = await response.json();
      status.value =
        `No. ${json.times} ／ ${json.price} 円 × ${
          json.count
        } 個 ／ ${displayDateTime(new Date())}\n` + status.value;
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
  const button = document.getElementById("button");
  const now = document.getElementById("now");
  const tokenUnregistered = document.getElementById("token-unregistered");
  status = document.getElementById("status");

  button.addEventListener("click", onClick);

  if (!token) {
    tokenUnregistered.style.display = "block";
  }

  // 時刻の更新
  const time = () => {
    now.innerHTML = displayDateTime(new Date());
  };
  setInterval(time, 500);
});
