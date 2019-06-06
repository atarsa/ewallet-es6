import {ItemCtrl} from './item';
import {UICtrl} from './ui';
import {StorageCtrl} from './storage';
import css from './styles/app.css';


const App = (function(ItemCtrl, UICtrl, StorageCtrl){

  // Get UI Selectors
  const UISelectors = UICtrl.getSelectors();

  // Load event listeners
  const loadEventListeners = function(){
    
    // key down in currency input
    document.querySelectorAll(UISelectors.currencyInput).forEach(input => {
      input.addEventListener('keyup', UICtrl.showCurrencyList);
    })
   
    // click on currency list item
    document.querySelectorAll(UISelectors.currencyList).forEach(list => {
      list.addEventListener('click', getCurrencyInput)
    })

    // Add item event 
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // delete item click event
    document.querySelector(UISelectors.itemsList).addEventListener('click', itemDeleteSubmit);

    // update item click event
    document.querySelector(UISelectors.itemsList).addEventListener('click', itemEditClick);

    // back item click event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.setDefaultState);

    // clear all click event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllClick);
  
  }

  function itemAddSubmit(e){
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();
   
    // Check for currency and amount input
    if (input.currency != '' && input.amount != ''){

      // check if number is positive
      if (input.amount < 0){
        // TODO: show alert with msg
        
      } else   {
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
        // Clear input
        UICtrl.clearInput();
        
      
      }
    } else{
      // TODO: show message that no input
      console.log("No input");
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
        // TODO: remove data from local storage
        StorageCtrl.removeItemFromStorage(ID);
        // update list item
        UICtrl.deleteItemFromList(ID);
        // check if any items left
        UICtrl.checkForItems();

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

      // Update form with editem item
      UICtrl.addItemToForm();

    }
  }
  
  function itemUpdateSubmit(e){
    const item = UICtrl.getItemInput();
    
    // get only abbrevation for currency input
    if (item.currency.includes(' ')){
      item.currency = item.currency.split(" ")[0];
    }
    
    // update current element
    const updatedItem = ItemCtrl.updateItem(item.currency, item.amount);
    
    // update local storage
    StorageCtrl.updateItemFromStorage(updatedItem);
    // update UI
    UICtrl.updateListItem(updatedItem);
    UICtrl.clearInput();
    UICtrl.setDefaultState();
  }

  function clearAllClick(e){

    if(confirm('Are you sure?')){
      // clear data.items
      ItemCtrl.clearDataItems();

      // TODO: clear local storage
      StorageCtrl.clearAllStorage();

      // clear UI
      UICtrl.clearInput();
      UICtrl.clearItemsList();
      UICtrl.updateTotalMoney();
      // hide items list as none items left
      UICtrl.checkForItems();
    }
  }

  function getCurrencyInput(e){
   // Get targeted list 
    let targetedList;

    // Check what element targeted to traverse DOM accordingly 
    if (e.target.matches('.small')){
      targetedList = e.target.parentElement.parentElement;
      
      if (targetedList.matches('.base')){
        // set base currency
        document.querySelector(UISelectors.baseCurrencyInput).value = e.target.parentElement.innerText;
        
        ItemCtrl.setBaseCurrency(e.target.parentElement.innerText.split(" ")[0]);

      } else {
        // set item currency
        document.querySelector(UISelectors.itemCurrencyInput).value = e.target.parentElement.innerText;
        
      }
    } else {
      targetedList = e.target.parentElement;
      
      if (targetedList.matches('.base')){
        // set base currency
        document.querySelector(UISelectors.baseCurrencyInput).value = e.target.innerText;

        ItemCtrl.setBaseCurrency(e.target.innerText.split(" ")[0]);

      } else {
        // set item currency
        document.querySelector(UISelectors.itemCurrencyInput).value = e.target.innerText;
      }
    
    }
    targetedList.innerHTML = '';
    
  }

  
  // Public methods
  return {
    init: function(){
      
      // set initial state
      UICtrl.setDefaultState();
      
      const baseCurrency = ItemCtrl.getBaseCurrency();
      const currencyFullName = UICtrl.getCurrencyFullName(baseCurrency);

      document.querySelector(UISelectors.baseCurrencyInput).value = `${baseCurrency} ${currencyFullName}`;
      
      ItemCtrl.fetchCurrencyRates(baseCurrency).then(() => {

        // TODO: Fetch data from data structure

        //Populate list with items
        UICtrl.populateItemsList();
        //  Get converted total money
        UICtrl.updateTotalMoney();

        // check if any items in the list
        UICtrl.checkForItems();
      });

      // Load event listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, UICtrl, StorageCtrl);

// Initialise App
App.init();
//ItemCtrl.dataLog();