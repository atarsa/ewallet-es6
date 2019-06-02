import { ItemCtrl } from "./item";

// UI controller
export const UICtrl= (function(){
  const UISelectors = {
    itemCurrencyInput: '#item-currency',
    itemAmountInput: '#item-amount',
    itemList: '#items-list',
    currencyList: '#currency-list',
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
      li.id = `item-${item.id}`;

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

    // Show available currencies list
    showCurrencyList: function(){
      
      const availableCurrency = ItemCtrl.getAvaliableCurrencies();
            
      const currencyList = document.querySelector(UISelectors.currencyList);
      
      // clear list on each key down
      currencyList.innerHTML = '';
      // get user input
      const currencyInput = document.querySelector(UISelectors.itemCurrencyInput).value;

      let ulHtml = '';

      // filter currency list with user input
      for (const [k, v] of Object.entries(availableCurrency)){
                
        if(v.toLowerCase().includes(currencyInput.toLowerCase())|| k.toLowerCase().includes(currencyInput.toLowerCase())){
          ulHtml += `<li class="collection-item">${k} <span class="small">${v}</span></li>`;
        }
      }
      currencyList.innerHTML = ulHtml;
      
    },

    getCurrencyInput: function(e){
      
      if(e.target.matches('.small')){
        document.querySelector(UISelectors.itemCurrencyInput).value = e.target.parentElement.innerText;
       
      } else {
        document.querySelector(UISelectors.itemCurrencyInput).value = e.target.innerText;      
      }
      // clear currency list
      document.querySelector(UISelectors.currencyList).innerHTML = '';
    },

    
    // Clear input
    clearInput: function(){
      document.querySelector(UISelectors.itemCurrencyInput).value = "";
      document.querySelector(UISelectors.itemAmountInput).value = "";
    },



  }
})();