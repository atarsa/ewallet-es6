import { ItemCtrl } from "./item";

// UI controller
export const UICtrl= (function(){
  const UISelectors = {
    itemCurrencyInput: '#item-currency',
    baseCurrencyInput: '#base-currency',
    currencyInput: '.currency-input',
    itemAmountInput: '#item-amount',
    itemsList: '#items-list',
    listItems: '#items-list li',
    currencyListItem: '.currency-list.item',
    currencyListBase: '.currency-list.base',
    currencyList: '.currency-list',
    convertedAmount: '.converted-amount',
    // total
    totalAmount: 'h4 .total-money',
    totalCurrency: 'h4 .base-currency',
    // buttons
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn'
    
  }
  
  // Public methods
  return {
    getSelectors: function(){
      return UISelectors
    },

    // get user input
    getItemInput: function(){
      const currency = document.querySelector(UISelectors.itemCurrencyInput).value;
      const amount =  document.querySelector(UISelectors.itemAmountInput).value;
      
      return {
        currency,
        amount
      }
    },
    
    
    // Add new item to the existing list
    addListItem: function(item){
      // Get base currency and exchange money
      const baseCurrency = ItemCtrl.getBaseCurrency();
      const convertedAmount = ItemCtrl.exchangeMoney(item.currency, item.amount);
      
      // Create  li element
      const li = document.createElement('li');
      // Add class and data attribute
      li.className = 'collection-item';
      li.setAttribute('data-id', item.id);

      // Add html
      li.innerHTML = `
        <a href="#" class="delete">
          <i class="delete-item fas fa-trash-alt"></i>
        </a>
        <a href="#" class="update">
          <i class="edit-item fas fa-edit"></i>
        </a>
        
        <span class="amount">${item.amount}</span>
        <span class="currency">${item.currency}</span>
       
        <span class="secondary-content">
          <span class="converted-amount">${convertedAmount}</span>
          <span class="base-currency">${baseCurrency}</span>
        </span>
      `;
      // Insert item
      document.querySelector(UISelectors.itemsList).insertAdjacentElement('beforeend', li);

      // Update total money
      this.updateTotalMoney();

      // check if items list previously empty
      // if so, show border
      this.toggleItemsListBorder();
    },

    updateListItem: function(item){
      const baseCurrency = ItemCtrl.getBaseCurrency();
      const convertedAmount = ItemCtrl.exchangeMoney(item.currency, item.amount);

      document.querySelector(`[data-id="${item.id}"]`).innerHTML = `
      <a href="#" class="delete">
        <i class="delete-item fas fa-trash-alt"></i>
      </a>
      <a href="#" class="update">
        <i class="edit-item fas fa-edit"></i>
      </a>
      <span class="amount">${item.amount}</span>
      <span class="currency">${item.currency}</span>
      
      <span class="secondary-content">
        <span class="converted-amount">${convertedAmount}</span>
        <span class="base-currency">${baseCurrency}</span>
      </span>`;

      // Update total money
      this.updateTotalMoney();
    
    },

    populateItemsList: function(){
      const items = ItemCtrl.getDataItems();
      
      document.querySelector(UISelectors.itemsList).innerHTML = '';
      items.forEach(item => this.addListItem(item));

    },

    updateTotalMoney: function(){
      // get base currency
      const baseCurrency = ItemCtrl.getBaseCurrency();

      // get exchanged amount from each item list and calculate total money
     let total = 0;
      document.querySelectorAll(UISelectors.convertedAmount).forEach(item => {
        total += Number.parseFloat(item.innerText);
      })
      

      // update UI
      document.querySelector(UISelectors.totalAmount).innerHTML = total.toFixed(2);
      document.querySelector(UISelectors.totalCurrency).innerHTML = baseCurrency;
   
    },

    // Show available currencies list
    showCurrencyList: function(e){
      
      const availableCurrency = ItemCtrl.getAvaliableCurrencies();
      let currencyList;
      let currencyInput;

      // Check which list 
      if (e.target.matches('.base')){
        // Get base currency list
        currencyList = document.querySelector(UISelectors.currencyListBase);
        // Get base currency user input
        currencyInput = document.querySelector(UISelectors.baseCurrencyInput).value;

      } else {
        // Get item currency list
        currencyList = document.querySelector(UISelectors.currencyListItem);
        // Get item currency user input
        currencyInput = document.querySelector(UISelectors.itemCurrencyInput).value;

      }
            
      // clear list on each key up
      currencyList.innerHTML = '';
      

      let ulHtml = '';

      // filter currency list with user input
      for (const [k, v] of Object.entries(availableCurrency)){
                
        if(v.toLowerCase().includes(currencyInput.toLowerCase())|| k.toLowerCase().includes(currencyInput.toLowerCase())){
          ulHtml += `<li class="collection-item">${k} <span class="small">${v}</span></li>`;
        }
      }
      currencyList.innerHTML = ulHtml;
     
    },

    deleteItemFromList: function(id){
        
        document.querySelector(`[data-id="${id}"]`).remove();
        this.updateTotalMoney();

        // check if any any items left on the list
        // if so hide border
        this.toggleItemsListBorder();
    },   

    addItemToForm: function(){
      
      const item = ItemCtrl.getCurrentItem();
      
      let currencyFullName = this.getCurrencyFullName(item.currency);
      
      document.querySelector(UISelectors.itemCurrencyInput).value = `${item.currency} ${currencyFullName}` ;

      // disable currency input to prevent multiple same currencies in (currency) list items
      document.querySelector(UISelectors.itemCurrencyInput).disabled = true;

      document.querySelector(UISelectors.itemAmountInput).value = item.amount;

      // set edit state
      UICtrl.setEditState();

    },
    // Clear input
    clearUserInput: function(){
      document.querySelector(UISelectors.itemCurrencyInput).value = "";
      document.querySelector(UISelectors.itemAmountInput).value = "";
    },

    // Clear items list
    clearItemsList: function(){
      document.querySelector(UISelectors.itemsList).innerHTML = '';
    },

    // Deafult state
    setDefaultState: function(){
      document.querySelector(UISelectors.itemCurrencyInput).disabled = false;
      UICtrl.clearUserInput();

      document.querySelector(UISelectors.addBtn).style.display = "inline";
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
    },


    // Edit State
    setEditState: function(){
      document.querySelector(UISelectors.addBtn).style.display = "none";
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
    },

   
    // Show/ hide border 
    toggleItemsListBorder: function(){

      const list = document.querySelector(UISelectors.itemsList);
      
      // if list empty set border
      // otherwise remove border
      if(list.children.length === 0){
        list.style.border = "none";
      } else {
        list.style.border = "1px solid #e0e0e0";
      }
    },

    getCurrencyFullName: function(currencyAbrr){
      // iterate through available currencies
      // to get full currency name
      let currencyFullName = '';
      const currencyList = ItemCtrl.getAvaliableCurrencies();
      
      for (let [k, v] of Object.entries(currencyList)){
        if (k === currencyAbrr){
          currencyFullName = v;
          break;
        }
      }
      return currencyFullName;
    },

    showAlert: function(msg){
      // select div
      const alert = document.querySelector('.card .alert');
      alert.innerText = msg;
      alert.style.display = "block";

      //clear after 3 seconds
      setTimeout(()=>{
        this.hideAlert();
      }, 2000);
      
    },

    hideAlert: function(){
      document.querySelector('.alert').style.display = "none";
    }
  }
})();