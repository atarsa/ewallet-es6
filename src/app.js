import {ItemCtrl} from './item';
import {UICtrl} from './ui';
import {StorageCtrl} from './storage';
require ('flag-icon-css/css/flag-icon.css');
require('./scss/style.scss');




const App = (function(ItemCtrl, UICtrl, StorageCtrl){

  // Get UI Selectors
  const UISelectors = UICtrl.getSelectors();

  // Load event listeners
  const loadEventListeners = function(){
    
    
    // key up in currency input
    document.querySelector(UISelectors.itemCurrencyInput).addEventListener('keyup', UICtrl.showCurrencyList);
    
   
    // click on currency list item
    document.querySelector(UISelectors.currencyList).addEventListener('click', getCurrencyInput);
    
    // click on base currency dropdown list 
    document.querySelector(UISelectors.baseCurrencyList).addEventListener("click", pickBaseCurrency);
    
    // Add item submit event 
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Update item submit event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // delete item submit event
    document.querySelector(UISelectors.itemsList).addEventListener('click', itemDeleteSubmit);

    // edit item click event
    document.querySelector(UISelectors.itemsList).addEventListener('click', itemEditClick);

    // back button click event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.setDefaultState);

    // clear all click event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllClick);
  
  }

  // Change base currency on item click
  function pickBaseCurrency(e){
    let baseCurrency;
    // if "click" on flag
    if (e.target.matches('.flag-icon')){
      baseCurrency = e.target.parentElement.dataset.currency;
    } else {
      baseCurrency = e.target.dataset.currency;
    }
    ItemCtrl.setBaseCurrency(baseCurrency);
    // update base currency button with new base currency and country flag
    UICtrl.updateBaseCurrencyBtn(baseCurrency);
    
  }

  function itemAddSubmit(e){
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();
   
    // Check for currency and amount input
    if (input.currency != '' && input.amount != ''){

      // check if number is positive
      if (input.amount < 0){
        // show alert with msg
        UICtrl.showAlert("Amount must be positive.");
        
      } else   {
        // validate currencyInput
        if (ItemCtrl.isCurrencyValid(input.currency)){
          // get currency abbreviation
        input.currency = input.currency.split(" ")[0]; 
        
        // check if input.currency already in list -> if yes update it instead of creating new item
        const dataItems = ItemCtrl.getDataItems();
        

          // list clear, add item to the list
          if (dataItems.length === 0){
            let newItem = ItemCtrl.addItem(input.currency, input.amount);
            UICtrl.addListItem(newItem);

          } else {
            
            // check if currency already in the list
            let found =  dataItems.find(function(element) {

              return element.currency === input.currency;
            })
            
            if (found){
              // Update list item
              found.amount += Number.parseInt(input.amount);
              UICtrl.updateListItem(found);
                        
            } else {
              // Add new item
              let newItem = ItemCtrl.addItem(input.currency, input.amount);
              
              UICtrl.addListItem(newItem);
            }

          }
         
        } else {
          // show message that no such currency
          UICtrl.showAlert(`"${input.currency}" is not a valid currency.`);
        }
        // Clear input
        UICtrl.clearUserInput();
            
      }
    } else{
      // show message that no input
      UICtrl.showAlert("Please fill the form.");
    }
    ItemCtrl.dataLog();
    e.preventDefault();
  }

  
  function itemDeleteSubmit(e){
    
    if (e.target.matches('.delete-item')){
      // get item id
      const ID = e.target.parentElement.parentElement.getAttribute('data-id');
     
           
      if (confirm('Are you sure?')){
        // remove item from data.items
        ItemCtrl.deleteItem(ID);
        // remove data from local storage
        StorageCtrl.removeItemFromStorage(ID);
        // update list item
        UICtrl.deleteItemFromList(ID);
        // hide border if none items left
        UICtrl.toggleItemsListBorder();

      }
    }
  }

  function itemEditClick(e){
    
    if (e.target.matches('.edit-item')){

      // get item id
      const ID = e.target.parentElement.parentElement.getAttribute('data-id');
      
      // get item
      const editedItem = ItemCtrl.getItemById(Number.parseInt(ID));
      
      // set current item 
      ItemCtrl.setCurrentItem(editedItem);

      // Update form with edited item
      UICtrl.addItemToForm();

    }
  }
  
  function itemUpdateSubmit(e){
    const item = UICtrl.getItemInput();
    
    // get only abbrevation from currency input
    if (item.currency.includes(' ')){
      item.currency = item.currency.split(" ")[0];
    }
    
    // update current item
    const updatedItem = ItemCtrl.updateItem(item.currency, item.amount);
    
    // update local storage
    StorageCtrl.updateItemInStorage(updatedItem);
    // update UI
    UICtrl.updateListItem(updatedItem);
    UICtrl.clearUserInput();
    UICtrl.setDefaultState();
  }

  function clearAllClick(e){

    if(confirm('Are you sure?')){
      // clear data.items
      ItemCtrl.clearDataItems();

      // clear local storage
      StorageCtrl.clearAllStorage();

      // clear UI
      UICtrl.clearUserInput();
      UICtrl.clearItemsList();
      UICtrl.updateTotalMoney();
      
    }
  }

  function getCurrencyInput(e){
   // Get targeted list 
    let targetedList;
    
    // Check what element targeted to traverse DOM accordingly 
    if (e.target.matches('.small') || e.target.matches('.flag-icon')){
      targetedList = e.target.parentElement.parentElement;
            
      // set item currency
      document.querySelector(UISelectors.itemCurrencyInput).value = e.target.parentElement.innerText;
        
     
    } else {
      targetedList = e.target.parentElement;
            
      // set item currency
      document.querySelector(UISelectors.itemCurrencyInput).value = e.target.innerText;
          
    }
    targetedList.innerHTML = '';
    
  }

  
  // Public methods
  return {
    init: function(){
      
      // set initial state
      UICtrl.setDefaultState();
      
      const baseCurrency = ItemCtrl.getBaseCurrency();
      UICtrl.updateBaseCurrencyBtn(baseCurrency);
      
      // set today's rates currency list
      ItemCtrl.setTodaysRatesList();
      
      // fetch exchange rates and update UI
      ItemCtrl.fetchCurrencyRates(baseCurrency).then(() => {

        UICtrl.updateUI();
        
      });

      // Load event listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, UICtrl, StorageCtrl);

// Initialise App
App.init();
// ItemCtrl.dataLog();