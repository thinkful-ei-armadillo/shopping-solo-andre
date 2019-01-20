/* eslint-disable no-console */
/* global $ */
'use strict';

const STORE = {
  items: [
    {id: 1, name: 'koolaid', checked: false},
    {id: 2, name: 'frosted flakes', checked: false},
    {id: 3, name: 'milk', checked: true},
    {id: 4, name: 'bread', checked: false}
  ],
  hideChecked: false, // optionally hide checked items
  searched: false, // if there was a search query 
  editing: 0, // id of item being edited
};

let SEARCH = [];
let autoIncrement = 5;


// ratchet templating
function generateItemElement(item, template) {
  const isEditing = STORE.editing === item.id;

  const title = `
    <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">
      ${item.name}
    </span>`;

  const editBox = `
    <input type="text" class="shopping-item-newname js-shopping-item-newname" id="newname-${item.id}">`;

  const itemControls = `
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
    </div>`;
  
  const itemControlsEdit = `
    <div class="shopping-item-controls">
      <button class="shopping-item-edit-save js-item-edit-save">
        <span class="button-label">save</span>
      </button>
      <button class="shopping-item-edit-cancel js-item-edit-cancel">
        <span class="button-label">nevermind</span>
      </button>
    </div>`;

  return `
    <li class="js-item-index-element" data-item-id="${item.id}">
      ${isEditing ? '' : title}
      ${isEditing ? editBox : ''}
      ${isEditing ? itemControlsEdit : itemControls}
    </li>`;
}

// iterate thru our data to create the html for the shopping list
function generateShoppingItemsString(shoppingList) {
  // if 'hide checked' option is enabled AND an item is checked, return false (filter it out)
  const items = shoppingList
    .filter(item => !(STORE.hideChecked && item.checked))
    .map((item) => generateItemElement(item));
  
  return items.join('');
}

// generate html and write to the DOM
function renderShoppingList() {
  let arr = STORE.searched ? SEARCH : STORE.items;
  const shoppingListItemsString = generateShoppingItemsString(arr);

  if(arr.length > 0) {
    $('.js-shopping-list').html(shoppingListItemsString);

    if(STORE.editing > 0) {
      //$(`#newname-${STORE.editing}`).val(STORE.items[STORE.editing].name);
      $(`#newname-${STORE.editing}`).val(STORE.items.find(item => item.id === STORE.editing).name);
    }
  } else {
    $('.js-shopping-list').html('<p>Didn\'t find anything!</p>');
  }
}

// get index of selected DOM element
function getItemIdFromElement(el) {
  const itemIndexString = $(el)
    .closest('.js-item-index-element')
    .attr('data-item-id');

  return parseInt(itemIndexString, 10);
}

// form functions
function addItemToShoppingList(itemName) {
  STORE.items.push({id: autoIncrement++, name: itemName, checked: false});
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
function listItemToggleChecked(itemId) {
  //STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
  let item = STORE.items.find(item => item.id === itemId);

  item.checked = !item.checked;
}

function listItemEdit(itemId) {
  STORE.editing = itemId;
}

function listItemEditSave(itemId, newName) {
  let itemIndex = STORE.items.findIndex(item => item.id === itemId);

  STORE.items[itemIndex].name = newName;
  STORE.editing = 0;
}

function listItemCancelEdit() {
  STORE.editing = -1;
}

function listItemDelete(itemId) {
  // might be a tad bit outside the scope of this assignment ;)
  // also delete the item from the search array too
  let itemIndex = STORE.items.findIndex(item => item.id === itemId);
  let searchItemIndex = SEARCH.findIndex(item => item.id === itemId);

  if(itemIndex > -1) {
    STORE.items.splice(itemIndex, 1);
  }

  if(searchItemIndex > -1) {
    SEARCH.splice(searchItemIndex, 1);
  }
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
    const itemId = getItemIdFromElement(event.currentTarget);
    listItemToggleChecked(itemId);

    renderShoppingList();
  });
}

// item edit
function handleItemEdit() {
  $('.js-shopping-list')
    .on('click', '.js-item-edit', event => {
      const itemId = getItemIdFromElement(event.currentTarget);
      listItemEdit(itemId);

      renderShoppingList();
    })
    .on('click', '.js-item-edit-save', event => {
      const itemId = getItemIdFromElement(event.currentTarget);
      listItemEditSave(itemId, $(`#newname-${itemId}`).val());

      renderShoppingList();
    })
    .on('click', '.js-item-edit-cancel', event => {
      const itemId = getItemIdFromElement(event.currentTarget);
      listItemCancelEdit(itemId);

      renderShoppingList();
    });
}

// item delete
function handleItemDelete() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const itemId = getItemIdFromElement(event.currentTarget);
    listItemDelete(itemId);

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