export const ItemCtrl =  (function(){
  // Item constructor
  const Item  = function(id, currency, amount){
    this.id = id;
    this.currency = currency;
    this.amount = amount;
  }

  // Data Strucuture
  const data = {
    items : [],
    currentItem: null
  }

  // Public methods
  return {

    // add item to data.items array
    addItem: function(currency, amount){
      let ID;

      // create id
      if(data.items.length > 0){
        ID = data.items[data.items.length-1].id + 1;
      } else {
        ID = 0;
      }

      // Amount to Number
      amount = Number.parseFloat(amount);

      // Create new item
      let newItem = new Item(ID, currency, amount);
      // Add to items array
      data.items.push(newItem);
      return newItem;
    },

    dataLog: function(){
      console.log(data)
    }

  }
})();

