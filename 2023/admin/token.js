window.addEventListener("load", () => {
  const searchParams = new URLSearchParams(window.location.search);
  if (!searchParams.has("token")) {
    alert("トークンがありません");
    return;
  }
  const token = searchParams.get("token");
  localStorage.setItem("token", token);
  alert(`${token} を登録しました`);
});
