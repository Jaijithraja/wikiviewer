const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const suggestions = document.getElementById("suggestions");
const result = document.getElementById("result");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popupContent");
const closePopup = document.getElementById("closePopup");
const fontPlus = document.getElementById("fontPlus");
const fontMinus = document.getElementById("fontMinus");
const lineToggle = document.getElementById("lineToggle");
const darkToggle = document.getElementById("darkToggle");
const imgToggle = document.getElementById("imgToggle");
const clearText = document.getElementById("clearText");

let fontSize = 16;
let lineHeight = 1.5;
let imagesVisible = true;

searchInput.addEventListener("input", () => {
  let query = searchInput.value.trim();
  clearText.style.display = query ? "inline" : "none";
  if (query === "") {
    suggestions.innerHTML = "";
    return;
  }
  fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search=${query}`)
    .then(res => res.json())
    .then(data => {
      suggestions.innerHTML = "";
      data[1].forEach(item => {
        let li = document.createElement("li");
        li.textContent = item;
        li.onclick = () => {
          searchInput.value = item;
          suggestions.innerHTML = "";
          clearText.style.display = "inline";
          getArticle(item);
        };
        suggestions.appendChild(li);
      });
    });
});

clearText.onclick = () => {
  searchInput.value = "";
  suggestions.innerHTML = "";
  clearText.style.display = "none";
  result.innerHTML = "";
};

searchButton.addEventListener("click", () => {
  let topic = searchInput.value.trim();
  if (topic !== "") {
    getArticle(topic);
  }
});

function getArticle(title) {
  fetch(`https://en.wikipedia.org/w/api.php?action=parse&format=json&origin=*&page=${title}`)
    .then(res => res.json())
    .then(data => {
      if (data.parse && data.parse.text) {
        popupContent.innerHTML = data.parse.text["*"];
        popup.style.display = "block";
        handleLinks();
        handleImages();
        applyStyles();
      } else {
        popupContent.innerHTML = "<p>Article not found.</p>";
        popup.style.display = "block";
      }
    })
    .catch(() => {
      popupContent.innerHTML = "<p>Something went wrong. Try again.</p>";
      popup.style.display = "block";
    });
}

function handleLinks() {
  let links = popupContent.querySelectorAll("a");
  links.forEach(link => {
    let href = link.getAttribute("href");
    link.onclick = (e) => {
      e.preventDefault();
      if (href && href.startsWith("/wiki/")) {
        let title = decodeURIComponent(href.split("/wiki/")[1]);
        getArticle(title);
      } else {
        window.open(href, "_blank");
      }
    };
  });
}

closePopup.onclick = () => {
  popup.style.display = "none";
  popupContent.innerHTML = "";
};

fontPlus.onclick = () => {
  fontSize += 2;
  applyStyles();
};

fontMinus.onclick = () => {
  fontSize = Math.max(12, fontSize - 2);
  applyStyles();
};

lineToggle.onclick = () => {
  lineHeight = lineHeight === 1.5 ? 2 : 1.5;
  applyStyles();
};

darkToggle.onclick = () => {
  document.body.classList.toggle("dark-mode");
};

imgToggle.onclick = () => {
  imagesVisible = !imagesVisible;
  handleImages();
};

function applyStyles() {
  popupContent.style.fontSize = fontSize + "px";
  popupContent.style.lineHeight = lineHeight;
}

function handleImages() {
  let imgs = popupContent.querySelectorAll("img");
  imgs.forEach(img => {
    img.style.display = imagesVisible ? "inline" : "none";
  });
}
