// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyD8A31LBNmCkEH2PNnyfF8NnZhRMnrDcLA",
    authDomain: "book-library-final.firebaseapp.com",
    databaseURL: "https://book-library-final.firebaseio.com",
    projectId: "book-library-final",
    storageBucket: "book-library-final.appspot.com",
    messagingSenderId: "230840764530",
    appId: "1:230840764530:web:3d098ebfa4aeee21861aeb",
    measurementId: "G-FGX5859TSE"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();// Your web app's Firebase configuration






function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

const libraryHTML = document.getElementById("library");
//creating the card for the book
Book.prototype.createBookCard = function () {
    //creating DOM elements of the card
    const book = document.createElement("section");
    book.classList.add("book");
    book.setAttribute("id", this.title);
    const title = document.createElement("span");
    title.setAttribute("class", "title");
    title.textContent = `Title: ${this.title}`;
    const author = document.createElement("span");
    author.setAttribute("class", "author");
    author.textContent = `Author: ${this.author}`;
    const pages = document.createElement("span");
    pages.setAttribute("class", "pages");
    pages.textContent = `Pages: ${this.pages}`;

    //adding read button
    const read = document.createElement("button");
    read.classList.add("read", "button");
    read.textContent = this.read;
    read.addEventListener("click", toggleRead);
    if (read.textContent === "To read") {
        book.style.boxShadow = "30px 30px #f03d29";
    } else {
        read.style.background = "lightgreen";
        book.style.boxShadow = "30px 30px lightgreen";
    }


    //Adding delete button to the card
    const deleteButton = document.createElement("button");
    const deleteIcon = document.createElement("a");
    deleteIcon.classList.add("delete-icon");
    deleteIcon.innerHTML = '<i class="far fa-trash-alt"></i>';
    deleteButton.setAttribute("id", "delete-button");
    deleteButton.classList.add("button");
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

function addBookToLibrary(e) {
    e.preventDefault();
    //Creating the new book object
    const titleInput = document.getElementById("title");
    const authorInput = document.getElementById("author");
    const pagesInput = document.getElementById("pages");
    const readOptions = document.getElementById("read");
    const readSelection = readOptions.options[readOptions.selectedIndex].text;

    const BookAlreadyPresent = myLibrary.some(book => {
        return book.title === titleInput.value && book.author === authorInput.value;
    });
    if (BookAlreadyPresent) {
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
    saveBook(book);
    toggleForm();
    renderContent();
}

function renderContent() {
    //implementing message for empty library and clearing screen
    const booksDOM = document.getElementsByClassName("book");
    const booksDOMArray = Array.from(booksDOM);
    booksDOMArray.forEach(book => {
        book.remove();
    });

    if (!myLibrary.length) {
        emptyLibraryMessage.textContent = "It looks like your librabry is empty, try adding a new book.";
        emptyLibraryMessage.style.display = "inherit";
        document.body.appendChild(emptyLibraryMessage);
    } else {
        myLibrary.forEach(book => {
            emptyLibraryMessage.textContent = "";
            emptyLibraryMessage.style.display = "none";
            book.createBookCard();
        });
    }
}


//Adding event listeners to main buttons
const newBookButton = document.getElementById("new-book");
newBookButton.addEventListener("click", toggleForm);
const form = document.getElementById("new-book-form");
const backButton = document.getElementById("back");
backButton.addEventListener("click", toggleForm);
form.addEventListener("submit", addBookToLibrary);

function toggleForm() {
    newBookButton.classList.toggle("inactive");
    newBookButton.classList.toggle("active");
    form.classList.toggle("inactive");
    form.classList.toggle("active");
}

let targetRefValue = "";

const deleteCard = (e) => {
    const target = e.target.parentNode.id;
    const targetIndex = myLibrary.findIndex(book => book.title === target);
    // deleting the object in the database
    getDatabaseObject(e);
    dbRefBooks.child(targetRefValue).remove()
};

const toggleRead = (e) => {
    const target = e.target
    const targetIndex = myLibrary.findIndex(book => book.title === target.parentNode.id);
    if (myLibrary[targetIndex].read === "To read") {
        // changing the value of "read" in the database
        getDatabaseObject(e);
        dbRefBooks.child(targetRefValue).update({
            read : "Already read"
        });
    } else {
        // changing the value of "read" in the database
        getDatabaseObject(e);
        dbRefBooks.child(targetRefValue).update({
            read : "To read"
        });
    }
    renderContent();
}


//hooking up firebase real-time database

//create reference in the database
const dbRefBooks = firebase.database().ref().child("books");

//create the new book ref
const saveBook = (title, author, pages, read) => {
    const newBookRef = dbRefBooks.push();
    newBookRef.set(book);
}

//sync changes
dbRefBooks.on("value", snap => {
    console.log(snap.val());
    myLibrary = [];
    snap.forEach(element => {
        elementVal = element.val();
        newBook = new Book(elementVal.title, elementVal.author, elementVal.pages, elementVal.read);
        myLibrary.push(newBook);
    })
    console.log(myLibrary);
    renderContent();
});

const getDatabaseObject = (e) => {
    dbRefBooks.orderByChild("title").equalTo(e.target.parentNode.id).on("value", function (snapshot) {
        console.log(snapshot.val());
        const targetRefString = JSON.stringify(snapshot.val());
        console.log(targetRefString);
        const targetRefArray = Array.from(targetRefString);
        const targetRef = targetRefArray.splice(2, 20).toString();
        console.log(targetRef);
        targetRefValue = "";
        const getTargetRefValue = () => {
            for (let index = 0; index < targetRef.length; index++) {
                let element = targetRef[index];
                element === "," ? element = "" : {};
                targetRefValue += element;
            }
        };
        getTargetRefValue();
        console.log(targetRefValue);
    });
}
