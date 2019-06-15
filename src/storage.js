export const StorageCtrl = (function(){

  // Public functions
  return {
    addItemToStorage: function(item){
      let items;
      // check if empty
      if (localStorage.getItem('items') === null){
        items = [];
        // push new item
        items.push(item);

        // set ls to items
        localStorage.setItem('items', JSON.stringify(items));

      } else {
        // get items from ls
        items = JSON.parse(localStorage.getItem('items'));

        items.push(item);
        // re set ls to items
        localStorage.setItem('items', JSON.stringify(items));
        
      }

    },

    getItemsFromStorage: function(){
      let items;

      if (localStorage.getItem('items') === null){
        items = [];
      } else {
        
        items = JSON.parse(localStorage.getItem('items'));
      }

      return items
    },

    updateItemInStorage: function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach((item, index) => {
        if (updatedItem.id === item.id){
          items.splice(index, 1, updatedItem);
        }
      })

      localStorage.setItem('items', JSON.stringify(items));

    },

    removeItemFromStorage: function(id){
      id = parseInt(id)
      let items = JSON.parse(localStorage.getItem('items'));
      
      items.forEach((item, index) => {
        if (id === item.id){
          items.splice(index, 1);
        }
      })
      localStorage.setItem('items', JSON.stringify(items));
    },

    clearAllStorage: function(){
      localStorage.removeItem('items');
      localStorage.removeItem('baseCurrency');
    },

    addBaseCurrencyToStorage: function(curreny){
      localStorage.setItem('baseCurrency', curreny)
    },

    getBaseCurrencyFromStorage: function(){
      let currency;
      // if empty set to deafult: GBP
      if (localStorage.getItem('baseCurrency') === null){
        localStorage.setItem('baseCurrency', 'GBP');
        currency = 'GBP';
      } else {
        currency = localStorage.getItem('baseCurrency');
      }

      return currency;
    }
  }
})()