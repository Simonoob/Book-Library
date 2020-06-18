function Book(title,author,pages,read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

const libraryHTML = document.getElementById("library");
//creating the card for the book
Book.prototype.createBookCard = function(){
    //creating DOM elements of the card
    const book = document.createElement("section");
    book.classList.add("book");
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
    //Adding delete button to the card
    const deleteButton = document.createElement("button");
    const deleteIcon = document.createElement("a");
    deleteIcon.classList.add("delete-icon");
    deleteIcon.innerHTML = '<i class="far fa-trash-alt"></i>';
    deleteButton.setAttribute("id","delete-button");
    deleteButton.classList.add("class", "button");
    deleteButton.addEventListener("click", deleteCard);
    deleteButton.appendChild(deleteIcon);

    //rendering the card
    book.appendChild(deleteButton);
    book.appendChild(title);
    book.appendChild(author);
    book.appendChild(pages);
    book.appendChild(read);
    libraryHTML.appendChild(book);
}

let myLibrary = [];
//creating the message HTML element
const emptyLibraryMessage = document.createElement("span");
emptyLibraryMessage.setAttribute("id", "empty-library-message");

function addBookToLibrary(e){
    e.preventDefault();
    //Creating the new book object
    const titleInput = document.getElementById("title");
    const authorInput = document.getElementById("author");
    const pagesInput = document.getElementById("pages");
    const readOptions = document.getElementById("read");
    const readSelection = readOptions.options[readOptions.selectedIndex].text;

    const BookAlreadyPresent = myLibrary.some( book => {
        return book.title === titleInput.value && book.author === authorInput.value;
    });
    if (BookAlreadyPresent){
        const message = document.createElement("span");
        message.setAttribute("id", "book-already-present");
        message.classList.add("message");
        message.textContent = "There is already a book with the same title by the same author";
        form.appendChild(message);
        setTimeout(() => {
            message.remove();
        }, 3000);
        return;
    }

    book = new Book(titleInput.value, authorInput.value, pagesInput.value, readSelection);
    //adding it to the array
    myLibrary.push(book);
    toggleForm();
    renderContent();
}

function renderContent(){
    //implementing message for empty library and clearing screen
    if (myLibrary.length === 0){
        emptyLibraryMessage.textContent = "It looks like your librabry is empty, try adding a new book.";
        emptyLibraryMessage.style.display = "inherit";
        document.body.appendChild(emptyLibraryMessage);
    } else{
        const booksDOM = document.getElementsByClassName("book");
        const booksDOMArray = Array.from(booksDOM);
        booksDOMArray.forEach(book => {
            book.remove();
        });
        myLibrary.forEach(book => {
            emptyLibraryMessage.textContent = "";
            emptyLibraryMessage.style.display = "none";
            book.createBookCard();
        });
    }
}

renderContent();

//Adding event listeners to buttons
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



const deleteCard = (e) => {
    let target = e.target.parentNode.id;
    const targetIndex = myLibrary.findIndex( book => book.title === target);
    myLibrary.splice(targetIndex, 1);
    renderContent();
};