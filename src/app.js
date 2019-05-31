import {ItemCtrl} from './item';
import {UICtrl} from './ui';



const App = (function(ItemCtrl, UICtrl){

  // Load event listeners
  const loadEventListeners = function(){
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event 
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
  }

  function itemAddSubmit(e){
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();
    // Check for currency and amount input
    // If not empty: check if input.currency on list of available currencies
    if (input.currency != null && input.amount != null){
      // if input.currency aleready in list -> if yes update it instead of creating new item
      // check if input.amount > 0
      const newItem = ItemCtrl.addItem(input.currency, input.amount);

      // Add item to UI list
      // !or update existing one
      UICtrl.addListItem(newItem)
    }
    
    
    
    
    //console.log(newItem);
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