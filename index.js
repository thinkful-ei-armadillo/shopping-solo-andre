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
  hideChecked: false,
  searched: false
};

let SEARCH = [];

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

  // if 'hide checked' option is enabled AND an item is checked, return false (filter it out)
  const items = shoppingList
    .filter(item => !(STORE.hideChecked && item.checked))
    .map((item, index) => generateItemElement(item, index));
  
  return items.join('');
}

// generate html and write to the DOM
function renderShoppingList() {
  let arr = STORE.searched ? SEARCH : STORE.items;
  const shoppingListItemsString = generateShoppingItemsString(arr);
  console.log('rendered the shopping list (renderShoppingList)');

  if(arr.length > 0) {
    $('.js-shopping-list').html(shoppingListItemsString);
  } else {
    $('.js-shopping-list').html('<p>Didn\'t find anything!</p>');
  }
}

// get index of selected DOM element
function getItemIndexFromElement(el) {
  const itemIndexString = $(el)
    .closest('.js-item-index-element')
    .attr('data-item-index');

  return parseInt(itemIndexString, 10);
}

// form functions
function addItemToShoppingList(itemName) {
  console.log(`added "${itemName}" to item array`);

  STORE.items.push({name: itemName, checked: false});
}

function toggleHiddenItems() {
  STORE.hideChecked = !STORE.hideChecked;
}

function searchShoppingList(arr, query) {
  STORE.searched = true;
  SEARCH = arr.filter(item => item.name.indexOf(query) > -1);
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



// form listener: add item submit
function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    console.log('add item form submitted (handleNewItemSubmit)');

    addItemToShoppingList($('.js-shopping-list-entry').val());
    event.preventDefault();
    event.currentTarget.reset();

    renderShoppingList();
  });
}

// form listener: hide checked option
function handleOptionHideChecked() {
  $('#js-shopping-list-form').on('change', '#option-hide-checked', event => {
    console.log('option changed: hide checked items (handleOptionHideChecked)');

    toggleHiddenItems();
    renderShoppingList();
  });
}

// form listener: search submit
function handleSearchSubmit() {
  $('#js-shopping-list-search').submit(event => {
    console.log('searched for item (handleSearchSubmit)');

    event.preventDefault();

    searchShoppingList(STORE.items, $('.js-shopping-list-search').val());
    renderShoppingList();
  });
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
  handleOptionHideChecked();
  handleSearchSubmit();
  handleItemCheck();
  handleItemDelete();
}

$(handleShoppingList);