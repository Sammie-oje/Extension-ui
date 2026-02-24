import data from "./data.json" assert { type: "json" };

let updatedExtensionData;

const populateUI = extensions => {
    const mainEl = document.querySelector("main");
    mainEl.innerHTML = extensions.map(item => extensionCard(item)).join("");
};

//When the HTML and styles are ready, populate the UI with the extensions

window.onload = () => {
    const allLink = document.querySelector("#all");
    allLink.click();
    populateUI(data);
};

const extensionCard = item => {
    return `
    <article class="extension-info" id="${item.name}">
          <section class="extension-main">
            <img src="${item.logo}" alt="${item.name}">
            <div class="extension-text">
              <h3>${item.name}</h3>
              <p>${item.description}</p>
            </div>
          </section>
          <div class="switch-wrapper">
            <button class="remove-btn" onClick="showDialog()">Remove</button>
            <div class="toggle-switch ${
                item.isActive ? "active" : ""
            }" tabindex="0">
              <div class="switch ${item.isActive ? "switch-active" : ""}" onClick="toggleSwitch(this)"></div>
            </div>
          </div>
        </article>
        `;
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

window.toggleSwitch = switchEl => {
    const switchElContainer = switchEl.parentElement;
    switchElContainer.classList.toggle("active");
    switchEl.classList.toggle("switch-active");

    filterOnToggle(switchEl);
};

const filterOnToggle = switchEl => {
    const isSwitchActive = switchEl.classList.contains("switch-active");
    const articleEl = switchEl.closest("article");

    updatedExtensionData = (
        updatedExtensionData ? updatedExtensionData : data
    ).map(extension => {
        if (extension.name === articleEl.id) {
            return {
                ...extension,
                isActive: isSwitchActive
            };
        }
        return extension;
    });
    console.log(updatedExtensionData);
};

window.showDialog = () => {
    const dialog = document.createElement("dialog");
    dialog.className = "modal";

    dialog.innerHTML = `
      <p>
       Are you sure you want to remove this extension. 
       This action is <strong><em>irreversible</em></strong>
      </p>
      <div id="btn-wrapper">
        <button id="continue-btn">Continue</button>
        <button id="cancel-btn">Cancel</button>
      </div>`;

    document.body.appendChild(dialog);
    dialog.showModal();

    //Cleanup dialog
    const cancelBtn = dialog.querySelector("#cancel-btn");
    cancelBtn.addEventListener("click", () => {
        //Remove from the UI
        dialog.close();
        //Remove from the DOM
        dialog.remove();
    });
};

//Toggle focus state for nav links
const nav = document.querySelector("nav");
const indicator = document.querySelector("nav #indicator");
/*
Add event listener to the parent element, find if the clicked element is coming from an <a> tag, then remove the class from tge focused element and add to the target element
*/
nav.addEventListener("click", e => {
    const link = e.target.closest("a");
    //If it's not a link that is clicked, exit the function
    if (!link) return;

    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.height = `${link.offsetHeight}px`;
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;


    const focusedLink = nav.querySelector(".focus");
    //If no element is focused without a click
    focusedLink?.classList.remove("focus");
    //Add focus class to the clicked link
    link.classList.add("focus");

    /*
  -Get the textContent of the clicked link
  -Then filter the extensions based in the "filterType"
  */
    const filterType = link.textContent;
    filterExtensions(
        filterType,
        updatedExtensionData ? updatedExtensionData : data
    );
});

const filterExtensions = (filterParam, extensions) => {
    if (filterParam === "Active") {
        populateUI(extensions.filter(item => item.isActive === true));
    } else if (filterParam === "Inactive") {
        populateUI(extensions.filter(item => item.isActive !== true));
    } else if (filterParam === "All") {
        populateUI(extensions);
        return;
    }
};
