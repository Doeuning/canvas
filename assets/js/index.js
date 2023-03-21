window.addEventListener("load", () => {
  const header = document.querySelector("header");
  fetch("../components/nav.html")
    .then((res) => res.text())
    .then((data) => (header.innerHTML = data))
    .then(() => {
      header.classList.add("attached");
    });
});
