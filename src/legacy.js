async function populate() {
    const requestURL = "src/data.json";
    const request = new Request(requestURL);

    const response = await fetch(request);
    const data = await response.json();

    populateMainUI(data);
}

populate();

function populateMainUI(el) {
    const mainEl = document.querySelector("main");
    el.forEach(item => {
        const myArticle = document.createElement("article");
        myArticle.className = "extension-info";

        myArticle.innerHTML = `
        <section class="extension-main">
         <img src="${item.logo}" alt="${item.name}">
         <div class="extension-text">
           <h3>${item.name}</h3>
           <p>${item.description}</p>
         </div>
        </section>
        <div class="switch-wrapper">
          <button class="remove-btn">Remove</button>
          <div class="toggle-switch" tabindex="0">
           <div class="switch"></div>
          </div>
        </div>
    `;
        //Toggle active states
        const toggleSwitch = myArticle.querySelector(".toggle-switch");
        const switchEl = myArticle.querySelector(".switch");

        if (item.isActive) {
            toggleSwitch.classList.add("active");
            switchEl.classList.add("switch-active");
        }
        switchEl.addEventListener("click", () => {
            toggleSwitch.classList.toggle("active");
            switchEl.classList.toggle("switch-active");
        });
        //Modal logic
        const modal = document.createElement("dialog");
        modal.className = "modal";

        modal.innerHTML = `
    <p>
      Are you sure you want to remove this extension. 
      This action is <strong><em>irreversible</em></strong>
    </p>
    <div id="btn-wrapper">
      <button id="continue-btn">Continue</button>
      <button id="cancel-btn">Cancel</button>
    </div>
    `;
        //Show modal when remove button is clicked
        const removeBtn = myArticle.querySelector(".remove-btn");

        removeBtn.addEventListener("click", () => modal.showModal());
        //Remove modal when cancel button is clicked
        const cancelBtn = modal.querySelector("#cancel-btn");

        cancelBtn.addEventListener("click", () => modal.close());
        //Remove article element when continue button is clicked
        const continueBtn = modal.querySelector("#continue-btn");

        continueBtn.addEventListener("click", () => {
            modal.close();
            myArticle.style.transform = "translateX(-100vw)";
        });
        document.body.appendChild(modal);
        mainEl.appendChild(myArticle);
    });
}

//Switch theme logic
const themeToggle = document.getElementById("toggle-theme");
themeToggle.addEventListener("click", () => {
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
});

//Toggle active states between nav links
const navLinks = document.querySelectorAll("nav a");
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navLinks.forEach(el => el.classList.remove("focus"));
        link.classList.add("focus");
    });
});

//Display active extensions when active link is clicked
const activeLink = document.querySelector("#active");
const inactiveLink = document.querySelector("#inactive");
const allLink = document.querySelector("#all");

function filterExtensions(filterType) {
    const extensions = document.querySelectorAll(".extension-info");

    for (const ext of extensions) {
        const switchEl = ext.querySelector(".switch");
        console.log(switchEl);
        const isActive = switchEl.classList.contains("switch-active");
        console.log(isActive);

        switch (filterType) {
            case "active":
                ext.style.display = isActive ? "block" : "none";
                break;
            case "inactive":
                ext.style.display = !isActive ? "block" : "none";
                break;
            default:
                ext.style.display = "block";
        }
    }
}

activeLink.addEventListener("click", () => filterExtensions("active"));
inactiveLink.addEventListener("click", () => filterExtensions("inactive"));
allLink.addEventListener("click", () => filterExtensions("all"));
