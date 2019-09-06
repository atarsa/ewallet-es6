import { ItemCtrl } from "./item";

// UI controller
export const UICtrl= (function(){
  const UISelectors = {
    // base currency
    baseCurrencyBtn: '.btn--base-currency',
    baseCurrencyList: '#base-currency-list',
    // item user input
    itemCurrencyInput: '#item-currency',
    itemAmountInput: '#item-amount',
    // items list
    itemsList: '#items-list',
    // rates list
    ratesList: '.collection--rates',
    ratesBaseCurrency: '.card--rates .base-currency',
    ratesLastUpdated: '.card--rates .update-time',
    // currency list
    currencyListItem: '.currency-list.item',
    currencyList: '.currency-list',
    convertedAmount: '.converted-amount',
    // wallet message 
    walletMessage: '.wallet .message',
    // total
    totalSummary: '.total',
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
      const currency = document.querySelector(UISelectors.itemCurrencyInput).value.trim();
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
          <span class="delete-item fas fa-trash-alt"></span>
        </a>
        <a href="#" class="update">
          <span class="edit-item fas fa-edit"></span>
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

      this.checkForListItems();
      // Update total money
      this.updateTotalMoney();

    },

    updateListItem: function(item){
      const baseCurrency = ItemCtrl.getBaseCurrency();
      const convertedAmount = ItemCtrl.exchangeMoney(item.currency, item.amount);

      document.querySelector(`[data-id="${item.id}"]`).innerHTML = `
      <a href="#" class="delete">
        <span class="delete-item fas fa-trash-alt"></span>
      </a>
      <a href="#" class="update">
        <span class="edit-item fas fa-edit"></span>
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

    // Populate Today's rates list with latest currency exchange rates
    populateTodaysRates: function(){
      const exchangedRates = ItemCtrl.getDataExchangeRates();
      // needed to have country code
      const currenciesAvailable = ItemCtrl.getAvaliableCurrencies();
      const todaysRatesList = ItemCtrl.getTodaysRatesList();
      let ratesList = document.querySelector(UISelectors.ratesList);
      ratesList.innerHTML = "";

      todaysRatesList.forEach(currency => {
        ratesList.innerHTML += `
          <li class="collection-item">
            <span class="flag-icon flag-icon-${currenciesAvailable[currency][1]}"></span>
            <span class="left-align"> ${currency} </span>
            <span class="right">${exchangedRates[currency].toFixed(3)}</span>
          </li>
          `
      })
            
    },

    // Update base currency button inner HTML with new currency and its flag
    updateBaseCurrencyBtn: function(baseCurrency){
      // get List of available currencies to get country code
      const currenciesAvailable = ItemCtrl.getAvaliableCurrencies();
      
      let baseCurrencyBtn = document.querySelector(UISelectors.baseCurrencyBtn);

      baseCurrencyBtn.innerHTML = `
      <span class="flag-icon flag-icon-${currenciesAvailable[baseCurrency][1]}"></span>
      ${baseCurrency} <span class="fas fa-chevron-down"></span>
      `;
    },

    // Show available currencies list
    showCurrencyList: function(e){
      
      const availableCurrency = ItemCtrl.getAvaliableCurrencies();
      let currencyList;
      let currencyInput;

      // Get item currency list
      currencyList = document.querySelector(UISelectors.currencyListItem);
        // Get item currency user input
      currencyInput = document.querySelector(UISelectors.itemCurrencyInput).value;

                  
      // clear list on each key up
      currencyList.innerHTML = '';
      
      let ulHtml = '';

      // filter currency list with user input
      for (const [k, v] of Object.entries(availableCurrency)){
                
        if(v[0].toLowerCase().includes(currencyInput.toLowerCase())|| k.toLowerCase().includes(currencyInput.toLowerCase())){
          ulHtml += `<li class="collection-item">
            <span class="flag-icon flag-icon-${v[1]}"></span>
            ${k} 
            <span class="small">${v[0]}</span></li>`;
        }
      }
      currencyList.innerHTML = ulHtml;
     
    },

    deleteItemFromList: function(id){
        
        document.querySelector(`[data-id="${id}"]`).remove();
        this.updateTotalMoney();
       
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
      this.checkForListItems();
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

   // Update UI
    updateUI: function(){
      this.populateItemsList();
      this.checkForListItems();
      this.updateTotalMoney();
      this.populateTodaysRates();
      this.updateBaseCurrencyInTodaysRates();
      this.updateExchangeTime();
    },

    updateBaseCurrencyInTodaysRates: function(){
      const baseCurrency = ItemCtrl.getBaseCurrency();
      
      document.querySelector(UISelectors.ratesBaseCurrency).innerHTML = `
      1 ${baseCurrency} =`;

    },

    updateExchangeTime: function(){
      const updateTime = ItemCtrl.getExchangeRateLastUpdate();
      document.querySelector(UISelectors.ratesLastUpdated).innerHTML = updateTime;
    },
    
    // check if any items in the items list 
    checkForListItems: function(){
      const itemsList = document.querySelector(UISelectors.itemsList);
      const totalSummary = document.querySelector(UISelectors.totalSummary);
      const walletMessage = document.querySelector(UISelectors.walletMessage);

      // if no items in the list
      if(itemsList.childNodes.length === 0){
        // hide "total", show message
        totalSummary.style.display = "none";
        walletMessage.style.display = "block";
      } else {
        // show "total", hide message
        totalSummary.style.display = "block";
        walletMessage.style.display = "none";
        
      }
      
    },

    getCurrencyFullName: function(currencyAbrr){
      // iterate through available currencies
      // to get full currency name
      let currencyFullName = '';
      const currencyList = ItemCtrl.getAvaliableCurrencies();
      
      for (let [k, v] of Object.entries(currencyList)){
        if (k === currencyAbrr){
          currencyFullName = v[0];
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