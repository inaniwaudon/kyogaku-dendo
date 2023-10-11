document.body.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  alert("右クリックは禁止です!!");
});

document.body.addEventListener("copy", (e) => {
  e.preventDefault();
  alert("コピーも禁止です!!");
});

const fetchAccessCounter = async () => {
  const url = "https://renbai-counter.yokohama.dev/";
  const request = await fetch(url);
  return (await request.json()).count;
};

window.addEventListener("load", async () => {
  const span = document.querySelector("#access-counter-no");
  const count = await fetchAccessCounter();
  const countStr = ("000" + count).slice(-6);
  for (let i = 0; i < 6; i++) {
    const digit = countStr[i];
    console.log(digit);
    const img = document.createElement("img");
    img.src = `digits/${digit}.gif`;
    span.appendChild(img);
  }
});
