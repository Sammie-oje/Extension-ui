async function fetchUI() {
    try {
        const response = await fetch("src/data.json");
        const data = await response.json();
        populateUI(data);
    } catch {
        console.error("There was an error fetching the data");
    }
}

const populateUI = extensions => {
    const mainEl = document.querySelector("main");
    mainEl.innerHTML = extensions
        .map(
            item => `
        <article class="extension-info" id="${item.name}">
          <section class="extension-main">
            <img src="${item.logo}" alt="${item.name}">
            <div class="extension-text">
              <h3>${item.name}</h3>
              <p>${item.description}</p>
            </div>
          </section>
          <div class="switch-wrapper">
            <button class="remove-btn">Remove</button>
            <div class="toggle-switch ${
                item.isActive ? "active" : ""
            }" tabindex="0">
              <div class="switch ${
                  item.isActive ? "switch-active" : ""
              }" onClick="switchToggle(this)"></div>
            </div>
          </div>
        </article>
        `
        )
        .join("");
};

const toggleTheme = () => {
    const body = document.body;
    const logo = document.getElementById("logo");
    const themeIcon = document.getElementById("theme-icon");

    if (body.classList.contains("dark")) {
        body.classList.remove("dark");
        logo.src = "./assets/images/logo.svg";
        themeIcon.src = "./assets/images/icon-moon.svg";
    } else {
        body.classList.add("dark");
        logo.src = "./assets/images/logo-dark.svg";
        themeIcon.src = "./assets/images/icon-sun.svg";
    }
};

const themeToggle = document.getElementById("toggle-theme");
themeToggle.addEventListener("click", () => toggleTheme());

const switchToggle = element => {
    const toggleSwitch = element.parentElement;
    toggleSwitch.classList.toggle("active");
    element.classList.toggle("switch-active");
};

const filterExtensions = filterType => {
    const extensions = document.querySelectorAll(".extension-info");

    [...extensions].map(ext => {
        const switchEl = ext.querySelector(".switch");
        const isActive = switchEl.classList.contains("switch-active");
        return isActive;
    });
};

fetchUI();
