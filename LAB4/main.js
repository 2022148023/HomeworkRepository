// DOM elements
const books_wrapper = document.querySelector(".items");
const footer = document.querySelector(".footer");
const search_form = document.querySelector("#search_form");

// Helper variables
let books_API = null;
let books = null;
const BOOKS_PER_PAGE = 4;
let page = 0;
let LOADED_ALL = false;

document.addEventListener("DOMContentLoaded", () => {
  fetch("product.json")
    .then((response) => response.json())
    .then((data) => {
      books_API = data.books;
      books = data.books;
      loadBooks();
    })
    .catch((e) => {
      console.log(e);
    });
});

document.addEventListener("scroll", function () {
  // check if we reached end of page right before the footer
  if (
    window.innerHeight + window.pageYOffset >=
    document.body.offsetHeight - footer.getBoundingClientRect().height
  ) {
    // if there are books found and we have not loaded all books, load more books
    if (books && !LOADED_ALL) {
      loadBooks();
    }
  }
});

search_form.addEventListener("submit", (e) => {
  // prevent submitting data to server
  e.preventDefault();
  // delete all existing books
  books_wrapper.innerHTML = "";
  // get form data
  var formData = new FormData(search_form);
  let category = formData.get("category");
  let search_term = formData.get("search_term");
  let sort = formData.get("sort");
  // update books
  books = books_API
    //  filter books based on category first, return true means ignore filtering
    .filter((book) =>
      category === "ALL"
        ? true
        : book.title.toLowerCase().includes(category.toLowerCase())
    )
    // filter books based on inputted keyword, return true means ignore filtering
    .filter((book) =>
      search_term
        ? book.title.toLowerCase().includes(search_term.toLowerCase())
        : true
    )
    // sort books based on pricing
    .sort((book1, book2) =>
      sort
        ? sort === "ascending"
          ? book1.price - book2.price
          : book2.price - book1.price
        : true
    );
  // set helper variables to default
  page = 0;
  LOADED_ALL = false;
  // load new set of books
  loadBooks();
});

function loadBooks() {
  // slice books array and render new book
  let start = page * BOOKS_PER_PAGE;
  let end = start + BOOKS_PER_PAGE;
  books
    .slice(start, start + BOOKS_PER_PAGE)
    .map((book) => books_wrapper.appendChild(createBookElement(book)));
  page += 1;
  // if we reached end of array we should not load books anymore
  if (end >= books.length) {
    LOADED_ALL = true;
  }
}

// creates book component
function createBookElement(book) {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("class", "item");
  const title = document.createElement("span");
  title.setAttribute("class", "book-title");
  title.innerText = book.title;
  const price = document.createElement("span");
  price.setAttribute("class", "book-price");
  price.innerText = `$${book.price}`;
  const cover = document.createElement("img");
  cover.setAttribute("src", `static/images/${book.cover}`);
  wrapper.appendChild(title);
  wrapper.appendChild(price);
  wrapper.appendChild(cover);
  return wrapper;
}
