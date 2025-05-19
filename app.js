let searchButton = document.getElementById("searchButton");
let searchInput = document.getElementById("searchInput");
let result = document.getElementById("result");

searchButton.addEventListener("click", async function () {
  let topic = searchInput.value;
  let url = "https://en.wikipedia.org/w/api.php?action=parse&page=" + topic + "&format=json&origin=*";

  try {
    let response = await fetch(url);
    let data = await response.json();

    if (data.parse) {
      result.innerHTML = data.parse.text["*"];
    } else {
      result.innerHTML = "Page not found.";
    }
  } catch (error) {
    result.innerHTML = "Error fetching data.";
  }
});
