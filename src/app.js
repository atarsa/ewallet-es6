import {ItemCtrl} from './item';
import {UICtrl} from './ui';


const App = (function(ItemCtrl, UICtrl){

  // Load event listeners
  const loadEventListeners = function(){
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event 
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // key down in currency input
    document.querySelector(UISelectors.itemCurrencyInput).addEventListener('keyup', UICtrl.showCurrencyList);

    // click on currency list item
    document.querySelector(UISelectors.currencyList).addEventListener('click', UICtrl.getCurrencyInput);
  }

  function itemAddSubmit(e){
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();
   
    // Check for currency and amount input
    if (input.currency != '' && input.amount != ''){

      // check if number is positive
      if (input.amount < 0){
        // TODO: show alert with msg
        
      } else {
        // check if input.currency already in list -> if yes update it instead of creating new item
        const newItem = ItemCtrl.addItem(input.currency.split(" ")[0], input.amount);

        // Add item to UI list
        // !or update existing one
        UICtrl.addListItem(newItem);
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



  // Public methods
  return {
    init: function(){
      // TODO: set initial set

      // TODO: Fetch data from data structure

      // TODO: Populate list with items

      // TODO: Get calculated amount


      // Load event listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, UICtrl);

// Initialise App
App.init();
//ItemCtrl.dataLog();