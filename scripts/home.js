// ADD A TODO
// the array that will hold the todo list items
let todoItems = [];

let addTodo = (text) => {
  // create a new todo list object based on user input
  const todo = {
    text,
    checked: false,
    id: Date.now(), // id is no. of milliseconds that elapsed since 1/1/1970 so all ids will be different
  };

  // push new todo to the todoItems array
  todoItems.push(todo);

  // see complete list of items
  renderTodo(todo);
};

// select the form element
const form = document.querySelector(".js-form");

// add a submit event listender
form.addEventListener("submit", (e) => {
  e.preventDefault(); // prevents the page from refreshing on submission
  const input = document.querySelector(".js-todo-input"); // select input text

  // get value of input and remove whitespace
  const text = input.value.trim();

  if (text !== "") {
    // conditional statement to prevent adding an empty todo item
    // if input is not empty,
    addTodo(text); // run the function
    input.value = ""; // clear the text
    input.focus(); // input is focused so that multiple items can be added without activating the input field over and over again
  }
});

//--------------------------------------------------------------------
// RENDER THE TODO ITEMS TO THE SCREEN
let renderTodo = (todo) => {
  // saving todoitems to browser local storage in case the page is reloaded
  localStorage.setItem("todoItemsRef", JSON.stringify(todoItems));

  // select the ul
  const list = document.querySelector(".js-todo-list");

  // select the current todo item in the DOM
  const item = document.querySelector(`[data-key='${todo.id}']`);

  if (todo.deleted) {
    // remove the item from the DOM
    item.remove();

    // remove whitespace from list container when 'todoItems' is empty
    if (todoItems.length === 0) list.innerHTML = "";
    return;
  }

  // ternary operator to check if 'todo.checked' is true
  // if so, then assign 'done' to isChecked; otherwise ''
  const isChecked = todo.checked ? "done" : "";

  // creating an 'li' element
  const node = document.createElement("li");

  // setting class attribute
  node.setAttribute("class", `todo-item ${isChecked}`);

  // setting the data-key attribute to id of the todo
  // to locate a specific todo item in the DOM
  node.setAttribute("data-key", todo.id);

  // setting the contents of the li
  node.innerHTML = `
        <input id="${todo.id}" type="checkbox"/>
        <label for="${todo.id}" class="tick js-tick"></label>
        <span><p>${todo.text}</p></span>
        <button class="delete-todo js-delete-todo">
        <svg><use href="#delete-icon"></use></svg>
        </button>
    `;

  if (item) {
    // if the item already exists in the DOM,
    list.replaceChild(node, item);
  } else {
    // appending the element to the DOM as the last child of the ul
    // element
    list.append(node);
  }
};

//--------------------------------------------------------------------
// MARK TASK AS COMPLETED
// select the entire list
const list = document.querySelector(".js-todo-list");

// adding a click event listener to the list and its children instead
// of listening to the clicks on the individuals
list.addEventListener("click", (e) => {
  if (e.target.classList.contains("js-tick")) {
    // check to make sure that the checkbox of class 'js-tick' was clicked
    const itemKey = e.target.parentElement.dataset.key; // selecting the value of the data-key (id)
    toggleDone(itemKey); // the id is extracted and passed on to the toggleDone function
  }

  if (e.target.classList.contains("js-delete-todo")) {
    // check to make sure that the checkbox of class 'js-delete-todo' was clicked
    const itemKey = e.target.parentElement.dataset.key; // selecting the id of the item
    deleteTodo(itemKey); // id is extracted and passed on the the deleteTodo function
  }
});

let toggleDone = (key) => {
  // receives the id of the list item
  // using the findIndex method to return the position of the listItem
  // in the todoItems array
  const index = todoItems.findIndex((item) => item.id === Number(key));

  // locating the todo item in the array and setting its checked
  // property to the opposite it 'true' to 'false' or 'false' to 'true'
  todoItems[index].checked = !todoItems[index].checked;
  renderTodo(todoItems[index]); // will duplicate the item for now
};

//--------------------------------------------------------------------
// DELETE TODO ITEMS
/*const list = document.querySelector(".js-todo-list");
list.addEventListener("click", (event) => {
  if (event.target.classList.contains("js-tick")) {
    const itemKey = event.target.parentElement.dataset.key;
    toggleDone(itemKey);
  }

  // add this `if` block
  if (event.target.classList.contains("js-delete-todo")) {
    const itemKey = event.target.parentElement.dataset.key;
    deleteTodo(itemKey);
  }
}); */

let deleteTodo = (key) => {
  // finding the index of the corresponding todo object in the array
  const index = todoItems.findIndex((item) => item.id === Number(key));

  // creating a new todo object with same properties of the current
  // todo object but adding a 'deleted' property and setting it to
  // 'true'
  const todo = {
    deleted: true,
    ...todoItems[index], // extending all the current properties
  };

  // removing the todo item from the array by filtering it out
  todoItems = todoItems.filter((item) => item.id !== Number(key));
  renderTodo(todo);
};

//--------------------------------------------------------------------
//PERSISTING THE APPLICATION STATE
// retrieving previous todo items from local storage and persisting
// them on the screen in case of reload
document.addEventListener("DOMContentLoaded", () => {
  const ref = localStorage.getItem("todoItemsRef");
  if (ref) {
    todoItems = JSON.parse(ref);
    todoItems.forEach((t) => {
      renderTodo(t);
    });
  }
});
