document.addEventListener("DOMContentLoaded", function () {
  const bookSubmit = document.getElementById("bookSubmit");
  const searchSubmit = document.getElementById("searchSubmit");

  loadBooksFromStorage();

  bookSubmit.addEventListener("click", function (event) {
    event.preventDefault();
    addBook();
  });

  searchSubmit.addEventListener("click", function (event) {
    event.preventDefault();
    searchBook();
  });

  function getBooksFromStorage() {
    return JSON.parse(localStorage.getItem("books")) || [];
  }

  function saveBooksToStorage(books) {
    localStorage.setItem("books", JSON.stringify(books));
  }

  function loadBooksFromStorage() {
    const books = getBooksFromStorage();
    books.forEach((book) => {
      if (book.isComplete) {
        document
          .getElementById("completeBookshelfList")
          .appendChild(createBookElement(book));
      } else {
        document
          .getElementById("incompleteBookshelfList")
          .appendChild(createBookElement(book));
      }
    });
  }

  function addBook() {
    const inputBookTitle = document.getElementById("inputBookTitle").value;
    const inputBookAuthor = document.getElementById("inputBookAuthor").value;
    const inputBookYear = Number(
      document.getElementById("inputBookYear").value
    );
    const inputBookIsComplete = document.getElementById(
      "inputBookIsComplete"
    ).checked;

    const book = {
      id: +new Date(),
      title: inputBookTitle,
      author: inputBookAuthor,
      year: inputBookYear,
      isComplete: inputBookIsComplete,
    };

    const books = getBooksFromStorage();
    books.push(book);
    saveBooksToStorage(books);

    if (inputBookIsComplete) {
      document
        .getElementById("completeBookshelfList")
        .appendChild(createBookElement(book));
    } else {
      document
        .getElementById("incompleteBookshelfList")
        .appendChild(createBookElement(book));
    }

    document.getElementById("inputBook").reset();
  }

  function createBookElement(book) {
    const bookElement = document.createElement("article");
    bookElement.classList.add("book_item");
    bookElement.setAttribute("id", `book-${book.id}`);

    const bookTitle = document.createElement("h3");
    bookTitle.innerText = book.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = `Penulis: ${book.author}`;

    const bookYear = document.createElement("p");
    bookYear.innerText = `Tahun: ${book.year}`;

    const bookActions = document.createElement("div");
    bookActions.classList.add("action");

    const toggleCompleteButton = document.createElement("button");
    toggleCompleteButton.classList.add("green");
    toggleCompleteButton.innerText = book.isComplete
      ? "Belum selesai di Baca"
      : "Selesai dibaca";
    toggleCompleteButton.addEventListener("click", function () {
      toggleBookCompletion(book.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "Hapus buku";
    deleteButton.addEventListener("click", function () {
      deleteBook(book.id);
    });

    bookActions.appendChild(toggleCompleteButton);
    bookActions.appendChild(deleteButton);

    bookElement.appendChild(bookTitle);
    bookElement.appendChild(bookAuthor);
    bookElement.appendChild(bookYear);
    bookElement.appendChild(bookActions);

    return bookElement;
  }

  function toggleBookCompletion(bookId) {
    const books = getBooksFromStorage();
    const bookIndex = books.findIndex((book) => book.id === bookId);
    if (bookIndex === -1) return;

    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveBooksToStorage(books);

    const bookElement = document.getElementById(`book-${bookId}`);
    bookElement.remove();

    if (books[bookIndex].isComplete) {
      document
        .getElementById("completeBookshelfList")
        .appendChild(createBookElement(books[bookIndex]));
    } else {
      document
        .getElementById("incompleteBookshelfList")
        .appendChild(createBookElement(books[bookIndex]));
    }
  }

  function deleteBook(bookId) {
    const books = getBooksFromStorage();
    const updatedBooks = books.filter((book) => book.id !== bookId);
    saveBooksToStorage(updatedBooks);

    const bookElement = document.getElementById(`book-${bookId}`);
    bookElement.remove();
  }

  function searchBook() {
    const searchBookTitle = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const incompleteBooks = document.querySelectorAll(
      "#incompleteBookshelfList .book_item"
    );
    const completeBooks = document.querySelectorAll(
      "#completeBookshelfList .book_item"
    );
    let found = false;
    incompleteBooks.forEach((book) => {
      const bookTitle = book.querySelector("h3").innerText.toLowerCase();
      if (bookTitle.includes(searchBookTitle)) {
        book.style.display = "block";
        found = true;
      } else {
        book.style.display = "none";
      }
    });
    completeBooks.forEach((book) => {
      const bookTitle = book.querySelector("h3").innerText.toLowerCase();
      if (bookTitle.includes(searchBookTitle)) {
        book.style.display = "block";
        found = true;
      } else {
        book.style.display = "none";
      }
    });
    const searchSection = document.querySelector(".search_section");
    let noBooksMessage = document.getElementById("noBooksMessage");
    let resetButton = document.getElementById("resetButton");
    if (!found) {
      if (!noBooksMessage) {
        noBooksMessage = document.createElement("p");
        noBooksMessage.id = "noBooksMessage";
        noBooksMessage.innerText =
          "Maaf Buku Yang Anda Cari Tidak Ditemukan! Sorry, the book you are looking for does not exist.";
        searchSection.appendChild(noBooksMessage);
      }
      if (!resetButton) {
        resetButton = document.createElement("button");
        resetButton.id = "resetButton";
        resetButton.innerText = "Reset Pencarian";
        resetButton.addEventListener("click", resetSearch);
        searchSection.appendChild(resetButton);
      }
    } else {
      if (noBooksMessage) {
        noBooksMessage.remove();
      }
      if (resetButton) {
        resetButton.remove();
      }
    }
  }

  function resetSearch() {
    document.getElementById("searchBookTitle").value = "";
    const books = document.querySelectorAll(".book_item");
    books.forEach((book) => {
      book.style.display = "block";
    });

    const noBooksMessage = document.getElementById("noBooksMessage");
    if (noBooksMessage) {
      noBooksMessage.remove();
    }

    const resetButton = document.getElementById("resetButton");
    if (resetButton) {
      resetButton.remove();
    }
  }
});
