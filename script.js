"use strict";

const list = document.querySelector("ul");
const button = document.querySelector("button");
const alphabet = [..."ABCD"];
let listItems = [];
let startIndex;

init();

function createList() {
  Array.from(alphabet)
    .sort(() => Math.random() - 0.5)
    .forEach((item, index) => {
      const listItem = document.createElement("li");
      const markup = `
        <p>${index + 1}</p>
        <div draggable="true" class="draggable">
          <span class="item-title">${item}</span>
          <span class="drag-spot">///</span>
        </div>
      `;

      listItem.classList.add("list-item");
      listItem.setAttribute("data-index", index.toString());
      listItem.insertAdjacentHTML("afterbegin", markup);

      listItems.push(listItem);
      list.appendChild(listItem);
    });
}

function dragEventListener() {
  const draggables = document.querySelectorAll(".draggable");

  let isReadyToDrag = false;

  function dragDown(event) {
    if (event.target.closest(".drag-spot")) isReadyToDrag = true;
  }

  function dragUp() {
    isReadyToDrag = false;
  }

  function dragStart(event) {
    if (!isReadyToDrag) {
      event.preventDefault();
      return;
    }
    const target = event.target.closest(".list-item");

    startIndex = Number.parseInt(target.dataset.index);
    target.classList.add("dragged");
  }

  function dragEnd(event) {
    const target = event.target.closest(".list-item");

    isReadyToDrag = false;
    target.classList.remove("dragged");
  }

  draggables.forEach((draggable) => {
    draggable.addEventListener("mousedown", dragDown);
    draggable.addEventListener("mouseup", dragUp);
    draggable.addEventListener("dragstart", dragStart);
    draggable.addEventListener("dragend", dragEnd);
  });
}

function dropEventListener() {
  function dragLeave(event) {
    const target = event.target.closest(".list-item");
    target.classList.remove("dragging");
  }

  function dragOver(event) {
    event.preventDefault();
    const target = event.target.closest(".list-item");
    target.classList.add("dragging");
  }

  function dragDrop(event) {
    const target = event.target.closest(".list-item");
    const endIndex = Number.parseInt(target.dataset.index);

    target.classList.remove("dragging");
    listItems[startIndex].classList.remove("dragged");
    dragAndDrop(startIndex, endIndex);
  }

  listItems.forEach((listItem) => {
    listItem.addEventListener("dragleave", dragLeave);
    listItem.addEventListener("dragover", dragOver);
    listItem.addEventListener("drop", dragDrop);
  });
}

function dragAndDrop(startIndex, endIndex) {
  const listItemStart = listItems[startIndex];
  const listItemEnd = listItems[endIndex];
  const startDraggable = listItemStart.querySelector(".draggable");
  const endDraggable = listItemEnd.querySelector(".draggable");

  listItemStart.appendChild(endDraggable);
  listItemEnd.appendChild(startDraggable);
}

let isReset = false;
button.addEventListener("click", function () {
  const reset = document.querySelector(".reset-btn");
  const check = document.querySelector(".check-btn");
  let isAllRight = true;

  resetCheck();

  if (isReset) {
    isReset = false;
    reset.style.display = "none";
    check.style.display = "block";
    list.innerHTML = "";
    listItems = [];
    init();
    return;
  }

  alphabet.forEach((alpha, index) => {
    const listItem = listItems[index];
    const draggable = listItem.querySelector(".draggable");
    const content = draggable.querySelector(".item-title");

    if (
      alpha.trim().toLowerCase() === content.textContent.trim().toLowerCase()
    ) {
      listItem.classList.add("right");
    } else {
      listItem.classList.add("wrong");
      isAllRight = false;
    }
  });

  if (isAllRight) {
    isReset = true;
    reset.style.display = "block";
    check.style.display = "none";
  }
});

function resetCheck() {
  listItems.forEach((listItem) => {
    listItem.classList.remove("right");
    listItem.classList.remove("wrong");
  });
}

function init() {
  createList();
  dragEventListener();
  dropEventListener();
}
