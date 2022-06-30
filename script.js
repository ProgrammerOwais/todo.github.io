// // Cached Elements
// const button = document.getElementById("enter");
// const input = document.getElementById("userinput");
// const ul = document.querySelector("ul");
// const listItems = document.querySelectorAll("li");
// const deleteAll = document.querySelector("#reset");

// // Functions for Event Listeners

// // List item length checker (checks if input is empty)
// function inputLength() {
//   return input.value.length;
// }

// // Creates list element with delete button
// function createListElement() {
//   let li = document.createElement("li");
//   li.appendChild(document.createTextNode(input.value));
//   let deleteButton = document.createElement("button");
//   deleteButton.classList.add("delete");
//   deleteButton.textContent = "X";
//   li.appendChild(deleteButton);
//   ul.appendChild(li);
//   input.value = "";
// }

// // Adds list item when button is clicked
// function addListAfterClick() {
//   if (inputLength() > 0) {
//     createListElement();
//   }
// }

// // Adds list item when keyboard key 'Enter' is pressed
// function addListAfterKeypress(event) {
//   if (inputLength() > 0 && event.keyCode === 13) {
//     createListElement();
//   }
// }

// // Toggles done class (strike through)
// function toggleDone(event) {
//   if (event.target.tagName === "LI") {
//     event.target.classList.toggle("done");
//   }
// }

// // Adds delete button to each list item (even those written in the html file)
// for (var i = 0; i < listItems.length; i++) {
//   let deleteButton = document.createElement("button");
//   deleteButton.classList.add("delete");
//   deleteButton.textContent = "X";
//   listItems[i].appendChild(deleteButton);
// }

// // Deletes list item when delete button is clicked
// function deleteAfterClick(event) {
//   if (event.target.classList.contains("delete")) {
//     event.target.parentNode.remove();
//   }
// }
// function delAll() {
//   while (ul.firstChild) {
//     ul.firstChild.remove();
//   }
// }

// // Event Listeners
// button.addEventListener("click", addListAfterClick);

// input.addEventListener("keydown", addListAfterKeypress);

// ul.addEventListener("click", toggleDone);

// ul.addEventListener("click", deleteAfterClick);
// deleteAll.addEventListener("click", delAll);
let todoItems = [];
const clear = document.querySelector(".clear");
const enter = document.querySelector(".enter");
function renderTodo(todo) {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
  clear.addEventListener("click", () => {
    localStorage.clear();
    document.location.reload();
  });

  const list = document.querySelector(".js-todo-list");
  const item = document.querySelector(`[data-key='${todo.id}']`);

  if (todo.deleted) {
    item.remove();
    if (todoItems.length === 0) list.innerHTML = "";
    return;
  }

  const isChecked = todo.checked ? "done" : "";
  const node = document.createElement("li");
  node.setAttribute("class", `todo-item ${isChecked}`);
  node.setAttribute("data-key", todo.id);
  node.innerHTML = `
    <input id="${todo.id}" type="checkbox"/>
    <label for="${todo.id}" class="tick js-tick"></label>
    <span>${todo.text}</span>
    <button class="delete-todo js-delete-todo">
    <svg><use href="#delete-icon"></use></svg>
    </button>
  `;

  if (item) {
    list.replaceChild(node, item);
  } else {
    list.append(node);
  }
}

function addTodo(text) {
  const todo = {
    text,
    checked: false,
    id: Date.now(),
  };

  todoItems.push(todo);
  renderTodo(todo);
}

function toggleDone(key) {
  const index = todoItems.findIndex((item) => item.id === Number(key));
  todoItems[index].checked = !todoItems[index].checked;
  renderTodo(todoItems[index]);
}

function deleteTodo(key) {
  const index = todoItems.findIndex((item) => item.id === Number(key));
  const todo = {
    deleted: true,
    ...todoItems[index],
  };
  todoItems = todoItems.filter((item) => item.id !== Number(key));
  renderTodo(todo);
}

const form = document.querySelector(".js-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector(".js-todo-input");

  const text = input.value.trim();
  if (text !== "") {
    addTodo(text);
    input.value = "";
    input.focus();
  }
});
enter.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector(".js-todo-input");

  const text = input.value.trim();
  if (text !== "") {
    addTodo(text);
    input.value = "";
    input.focus();
  }
});

const list = document.querySelector(".js-todo-list");
list.addEventListener("click", (event) => {
  if (event.target.classList.contains("js-tick")) {
    const itemKey = event.target.parentElement.dataset.key;
    toggleDone(itemKey);
  }

  if (event.target.classList.contains("js-delete-todo")) {
    const itemKey = event.target.parentElement.dataset.key;
    deleteTodo(itemKey);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const ref = localStorage.getItem("todoItems");
  if (ref) {
    todoItems = JSON.parse(ref);
    todoItems.forEach((t) => {
      renderTodo(t);
    });
  }
});
