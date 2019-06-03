import {ItemCtrl} from './item';
import {UICtrl} from './ui';


const App = (function(ItemCtrl, UICtrl){

  // Get UI Selectors
  const UISelectors = UICtrl.getSelectors();

  // Load event listeners
  const loadEventListeners = function(){
    // Get UI Selectors
    //const UISelectors = UICtrl.getSelectors();

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
        
      } else   {
        // get currency abbreviation
        input.currency = input.currency.split(" ")[0]; 

        // check if input.currency already in list -> if yes update it instead of creating new item
        const dataItems = ItemCtrl.getDataItems();
        console.log(dataItems);

        // list clear, add item to the list
        if (dataItems.length === 0){
          let newItem = ItemCtrl.addItem(input.currency, input.amount);
          UICtrl.addListItem(newItem);
        } else {
          // check if currency already in the list
          let found =  dataItems.find(function(element) {

            return element.currency === input.currency;
          })
          console.log(found)

          if (found){
            // TODO: Update found
            found.amount += Number.parseInt(input.amount);
            UICtrl.updateListItem(found);
          //   document.getElementById(`item-${found.id}`).innerHTML = `
          //   <a href="#" class="">
          //   <i class="edit-item fas fa-edit"></i>
          // </a>
          // <strong>
          //   <span class="amount">${found.amount}</span>
          //   <span class="currency">${found.currency}</span>
          // </strong>
  
          // <span class="secondary-content">
          //   <span class="converted-amount">12</span>
          //   <span class="base-currency">GBP </span>
          // </span>
            // `;
            
          } else {
            // add new item
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