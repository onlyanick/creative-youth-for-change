function insertTemplate(template) {
  if (document.getElementById(template)) {
    return fetch(`/Templates/${template}.html`).then((response) =>
      response
        .text()
        .then((data) => (document.getElementById(template).innerHTML = data)),
    );
  } else return;
}

let languageData = localStorage.getItem("language") || "en";

(async () => {
  await Promise.all([insertTemplate("footer"), insertTemplate("navbar")]);

  const navbar = document.querySelector(".navbar");
  const closeBtn = document.getElementById("close-btn");
  const openBtn = document.getElementById("open-btn");
  const langBtn = document.getElementById("lang-btn");

  openBtn.addEventListener("click", () => {
    navbar.classList.toggle("open");
  });

  closeBtn.addEventListener("click", () => {
    navbar.classList.remove("open");
  });

  navbar.addEventListener("mouseleave", () => {
    navbar.classList.remove("open");
  });

  async function loadLang(lang) {
    const response = await fetch(`/languages/${lang}.json`);
    const transcript = await response.json();
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const i18n = element.dataset.i18n;
      const value = i18n
        .split(".")
        .reduce((obj, key) => obj?.[key], transcript);
      if (value !== undefined) {
        element.textContent = value;
      }
    });
  }

  loadLang(localStorage.getItem("language") || "en");

  function changeLanguage(newLang) {
    languageData = newLang;
    localStorage.setItem("language", newLang);
    document.documentElement.lang = newLang;
    loadLang(newLang);
  }

  langBtn.addEventListener("click", () => {
    if (languageData === "en") {
      changeLanguage("prs");
    } else {
      changeLanguage("en");
    }
  });
})();
