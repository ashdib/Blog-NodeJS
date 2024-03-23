// TEST: Connection to the "./layouts/main" is successful
// alert("Hello from script.js!");

document.addEventListener("DOMContentLoaded", function () {
  // select the searchButton in ./partials/header.ejs
  const allButtons = document.querySelectorAll(".searchBtn");
  // select the searchBar in ./partials/search.ejs
  const searchBar = document.querySelector(".searchBar");
  // select the searchInput ID in ./partials/search.ejs
  const searchInput = document.getElementById("searchInput");
  // select the searchClose ID in ./partials/search.ejs
  const searchClose = document.getElementById("searchClose");

  // TODO: Making the searchButton when click the searchBar will poopup
  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener("click", function () {
      searchBar.style.visibility = "visible";
      searchBar.classList.add("open");
      // Making it expanded
      this.setAttribute("aria-expanded", true);
      searchInput.focus();
    });
  }

  // TODO: Making the search fill close when click the "close"
  searchClose.addEventListener("click", function () {
    searchBar.style.visibility = "hidden";
    searchBar.classList.remove("open");
    // Making it expanded
    this.setAttribute("aria-expanded", false);
  });
});
