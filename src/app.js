import {ItemCtrl} from './item';
import {UICtrl} from './ui';


const App = (function(ItemCtrl, UICtrl){

  // Get UI Selectors
  const UISelectors = UICtrl.getSelectors();

  // Load event listeners
  const loadEventListeners = function(){
    
    // Add item event 
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // key down in currency input
    document.querySelectorAll(UISelectors.currencyInput).forEach(input => {
      input.addEventListener('keyup', UICtrl.showCurrencyList);
    })
   

    // click on currency list item
    document.querySelectorAll(UISelectors.currencyList).forEach(list => {
      list.addEventListener('click', getCurrencyInput)
    })
  
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
      
      // TODO: set initial set
      let baseCurrency = ItemCtrl.getBaseCurrency();
      ItemCtrl.fetchCurrencyRates(baseCurrency).then(() => {

        // TODO: Populate list with items
        UICtrl.populateItemsList();
        UICtrl.updateTotalMoney();
      });

      // TODO: Fetch data from data structure

      
      //UICtrl.populateItemsList();

      // TODO: Get calculated amount


      // Load event listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, UICtrl);

// Initialise App
App.init();
//ItemCtrl.dataLog();