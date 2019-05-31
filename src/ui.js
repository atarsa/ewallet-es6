// UI controller
export const UICtrl= (function(){
  const UISelectors = {
    itemCurrencyInput: '#item-currency',
    itemAmountInput: '#item-amount',
    itemList: '#items-list',
    addBtn: '.add-btn'
  }
  
  // Public methods
  return {
    getSelectors: function(){
      return UISelectors
    },

    getItemInput: function(){

      const currency = document.querySelector(UISelectors.itemCurrencyInput).value;
      const amount =  document.querySelector(UISelectors.itemAmountInput).value;
      return {
        currency,
        amount
      }
    },

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

    }



  }
})();