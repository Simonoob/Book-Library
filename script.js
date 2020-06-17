function Book(title,author,pages,read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

const libraryHTML = document.getElementById("library");

Book.prototype.showInfo = function(){
    console.log(`${this.title} by ${this.author}. ${this.pages} pages long. ${this.read}.`);
    const book = document.createElement("section");
    book.setAttribute("id", this.title );
    const title = document.createElement("span");
    title.setAttribute("class", "title");
    title.textContent = `Title: ${this.title}`;
    const author = document.createElement("span");
    author.setAttribute("class", "author");
    author.textContent = `Author: ${this.author}`;
    const pages = document.createElement("span");
    pages.setAttribute("class", "pages");
    pages.textContent = `Pages: ${this.pages}`;
    const read = document.createElement("span");
    read.setAttribute("class", "read");
    read.textContent = this.read;
    book.appendChild(title);
    book.appendChild(author);
    book.appendChild(pages);
    book.appendChild(read);
    libraryHTML.appendChild(book);
}

let myLibrary = [];

const emptyLibraryMessage = document.createElement("span");
emptyLibraryMessage.setAttribute("id", "empty-library-message");

function addBookToLibrary(e){
    e.preventDefault();

    const titleInput = document.getElementById("title");
    const authorInput = document.getElementById("author");
    const pagesInput = document.getElementById("pages");
    const readOptions = document.getElementById("read");
    const readSelection = readOptions.options[readOptions.selectedIndex].text;

    book = new Book(titleInput.value, authorInput.value, pagesInput.value, readSelection);

    myLibrary.length === 0 ? myLibrary[myLibrary.length] = book : myLibrary[myLibrary.length -1] = book;
    
    toggleForm();

    renderContent();
}

function renderContent(){
    if (myLibrary.length === 0){
        emptyLibraryMessage.textContent = "It looks like your librabry is empty, try adding a new book.";
        emptyLibraryMessage.style.display = "inherit";
        document.body.appendChild(emptyLibraryMessage);
    } else{
        myLibrary.forEach(book => {
            emptyLibraryMessage.textContent = "";
            emptyLibraryMessage.style.display = "none";
            book.showInfo();
        });
    }
}

renderContent();


const newBookButton = document.getElementById("new-book");
newBookButton.addEventListener("click", toggleForm);
const form = document.getElementById("new-book-form");
const backButton = document.getElementById("back");
backButton.addEventListener("click", toggleForm);
form.addEventListener("submit", addBookToLibrary);

function toggleForm(){
    newBookButton.classList.toggle("inactive");
    newBookButton.classList.toggle("active");
    form.classList.toggle("inactive");
    form.classList.toggle("active");
}