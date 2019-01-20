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
  hideChecked: false, // optionally hide checked items
  searched: false, // if there was a search query 
  editing: -1, // index of item being edited
};

let SEARCH = [];


// templating
function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <input type="text" class="shopping-item-newname ${STORE.editing === itemIndex ? '':'hidden'} js-shopping-item-newname" id="newname-${itemIndex}">
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

  if(STORE.editing > -1) {
    $(`#newname-${STORE.editing}`).val(STORE.items[STORE.editing].name);
  }

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
  STORE.items.push({name: itemName, checked: false});
}

function toggleHiddenItems() {
  STORE.hideChecked = !STORE.hideChecked;
}

function searchShoppingList(arr, query) {
  STORE.searched = true;
  SEARCH = arr.filter(item => item.name.indexOf(query) > -1);
}

function searchClear() {
  $('.js-shopping-list-search').val('');
  STORE.searched = false;
  SEARCH = [];
}

// list item functions
function listItemToggleChecked(itemIndex) {
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function listItemEdit(itemIndex) {
  STORE.editing = itemIndex;
}

function listItemDelete(itemIndex) {
  STORE.items.splice(itemIndex, 1);
}



/* listeners */
// add item
function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    addItemToShoppingList($('.js-shopping-list-entry').val());
    event.preventDefault();
    event.currentTarget.reset();

    renderShoppingList();
  });
}

// hide checked option
function handleOptionHideChecked() {
  $('#js-shopping-list-form').on('change', '#option-hide-checked', event => {
    toggleHiddenItems();
    renderShoppingList();
  });
}

// search
function handleSearchSubmit() {
  $('#js-shopping-list-search').submit(event => {
    event.preventDefault();

    searchShoppingList(STORE.items, $('.js-shopping-list-search').val());
    renderShoppingList();
  });
}

// search clear
function handleSearchClear() {
  $('#js-shopping-list-search').on('click', '.search-clear', event => {
    searchClear();
    renderShoppingList();
  });
}

// item check off
function handleItemCheck() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    listItemToggleChecked(itemIndex);

    renderShoppingList();
  });
}

// item edit
function handleItemEdit() {
  $('.js-shopping-list').on('click', '.js-item-edit', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    listItemEdit(itemIndex);

    renderShoppingList();
  });
}

// item delete
function handleItemDelete() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
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
  handleSearchClear();
  handleItemCheck();
  handleItemEdit();
  handleItemDelete();
}

$(handleShoppingList);