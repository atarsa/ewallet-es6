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
    addBtn: '.add-btn'
    
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
      // Add class and id
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
        <strong>
          <span class="amount">${item.amount}</span>
          <span class="currency">${item.currency}</span>
        </strong>

        <span class="secondary-content">
          <span class="converted-amount">${convertedAmount}</span>
          <span class="base-currency">${baseCurrency}</span>
        </span>
      `;
      // Insert item
      document.querySelector(UISelectors.itemsList).insertAdjacentElement('beforeend', li);

      // Update total money
      this.updateTotalMoney();

    },

    updateListItem: function(item){
      const baseCurrency = ItemCtrl.getBaseCurrency();
      const convertedAmount = ItemCtrl.exchangeMoney(item.currency, item.amount);

      document.getElementById(`item-${item.id}`).innerHTML = `
      <a href="#" class="delete">
        <i class="delete-item fas fa-trash-alt"></i>
      </a>
      <a href="#" class="update">
        <i class="edit-item fas fa-edit"></i>
      </a>
      <strong>
        <span class="amount">${item.amount}</span>
        <span class="currency">${item.currency}</span>
      </strong>

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
            
      // clear list on each key down
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
        
     },   
    // Clear input
    clearInput: function(){
      document.querySelector(UISelectors.itemCurrencyInput).value = "";
      document.querySelector(UISelectors.itemAmountInput).value = "";
    },



  }
})();