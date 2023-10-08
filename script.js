document.body.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  alert("右クリックは禁止です!!");
});

document.body.addEventListener("copy", (e) => {
  e.preventDefault();
  alert("コピーも禁止です!!");
});
