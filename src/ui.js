import { ItemCtrl } from "./item";

// UI controller
export const UICtrl= (function(){
  const UISelectors = {
    itemCurrencyInput: '#item-currency',
    baseCurrencyInput: '#base-currency',
    currencyInput: '.currency-input',
    itemAmountInput: '#item-amount',
    itemList: '#items-list',
    listItems: '#items-list li',
    currencyListItem: '.currency-list.item',
    currencyListBase: '.currency-list.base',
    currencyList: '.currency-list',
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
      // Create  li element
      const li = document.createElement('li');
      // Add class and id
      li.className = 'collection-item';
      li.id=  `item-${item.id}`;

      // Add html
      li.innerHTML = `
        <a href="#" class="">
          <i class="edit-item fas fa-edit"></i>
        </a>
        <strong>
          <span class="amount">${item.amount}</span>
          <span class="currency">${item.currency}</span>
        </strong>

        <span class="secondary-content">
          <span class="converted-amount">12</span>
          <span class="base-currency">GBP </span>
        </span>
      `;
      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

    },
    updateListItem: function(item){
      document.getElementById(`item-${item.id}`).innerHTML = `
      <a href="#" class="">
        <i class="edit-item fas fa-edit"></i>
      </a>
      <strong>
        <span class="amount">${item.amount}</span>
        <span class="currency">${item.currency}</span>
      </strong>

      <span class="secondary-content">
        <span class="converted-amount">12</span>
        <span class="base-currency">GBP </span>
      </span>`;
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

    getCurrencyInput: function(e, list){
      //console.log(e.target)
      let input;
      if (list.parentElement.matches('base')){
        input = UISelectors.itemCurrencyBase
      } else {
        input = UISelectors.itemCurrencyInput;
      }
      
      if(e.target.matches('.small')){
        document.querySelector(input).value = e.target.parentElement.innerText;
       
      } else {
        document.querySelector(input).value = e.target.innerText;      
      }
      // clear currency list
      list.innerHTML = '';
    },

    
    // Clear input
    clearInput: function(){
      document.querySelector(UISelectors.itemCurrencyInput).value = "";
      document.querySelector(UISelectors.itemAmountInput).value = "";
    },



  }
})();