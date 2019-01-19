/* eslint-disable no-console */
/* global $ */
'use strict';

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  hideCompleted: false
};

// templating
function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-edit js-item-edit">
            <span class="button-label">edit</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}

// iterate thru our data to create the html for the shopping list
function generateShoppingItemsString(shoppingList) {
  console.log('generated the shopping list html');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join('');
}

// generate html and write to the DOM
function renderShoppingList() {
  console.log('rendered the shopping list (renderShoppingList)');

  const shoppingListItemsString = generateShoppingItemsString(STORE.items);

  $('.js-shopping-list').html(shoppingListItemsString);
}

// add an item to the data
function addItemToShoppingList(itemName) {
  console.log(`added "${itemName}" to item array`);

  STORE.items.push({name: itemName, checked: false});
}

// run when 'add item' form is submitted
function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    console.log('add item form submitted (handleNewItemSubmit)');

    addItemToShoppingList($('.js-shopping-list-entry').val());
    event.preventDefault();
    event.currentTarget.reset();

    renderShoppingList();
  });
}

// list item functions
function listItemToggleChecked(itemIndex) {
  console.log(`toggled checked property for item at index ${itemIndex}`);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function listItemDelete(itemIndex) {
  console.log(`Item was removed at index ${itemIndex}`);
  STORE.items.splice(itemIndex, 1);
}

// get index of selected DOM element
function getItemIndexFromElement(el) {
  const itemIndexString = $(el)
    .closest('.js-item-index-element')
    .attr('data-item-index');

  return parseInt(itemIndexString, 10);
}

// button press listener: check
function handleItemCheck() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('check button pressed (handleItemCheckClicked)');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    listItemToggleChecked(itemIndex);

    renderShoppingList();
  });
}

// button press listener: delete
function handleItemDelete() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('delete button pressed (handleDeleteItemClicked)');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    listItemDelete(itemIndex);

    renderShoppingList();
  });
}

// main function. handle initial render and event listeners
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheck();
  handleItemDelete();
}

$(handleShoppingList);