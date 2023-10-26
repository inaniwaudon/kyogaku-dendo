const token = localStorage.getItem("token");

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

    if (response.status === 401) {
      alert("認証エラーです");
    } else if (!response.ok) {
      alert("内部エラー（バックエンド）です");
    }
  } catch {
    alert("内部エラー（フロントエンド）です");
  }
};

window.addEventListener("load", async () => {
  const button = document.getElementById("button");
  const now = document.getElementById("now");
  const tokenUnregistered = document.getElementById("token-unregistered");

  button.addEventListener("click", onClick);

  if (!token) {
    tokenUnregistered.style.display = "block";
  }

  const time = () => {
    const date = new Date();
    const zeroPadding = (str) => ("0" + str).slice(-2);
    now.innerHTML = `${zeroPadding(date.getMonth() + 1)}月${zeroPadding(
      date.getDate()
    )}日  ${zeroPadding(date.getHours())}時${zeroPadding(
      date.getMinutes()
    )}分${zeroPadding(date.getSeconds())}秒`;
  };
  setInterval(time, 500);
});
