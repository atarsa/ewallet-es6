import { UICtrl } from "./ui";
import { StorageCtrl } from "./storage";

export const ItemCtrl =  (function(){
  // Item constructor
  const Item  = function(id, currency, amount){
    this.id = id;
    this.currency = currency;
    this.amount = amount;
  }

  // Data Strucuture
  const data = {
    items : StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    baseCurrency: StorageCtrl.getBaseCurrencyFromStorage(),
    exchangeRates: {},
    exchangeRateLastUpdate: null,
    todaysRatesList: []
  }

  // Available currencies with full names and country code
  /* list compatible with https://exchangeratesapi.io/ and foreign exchange rates published by the European Central Bank https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html */
  const currenciesList = {'EUR': ['Euro', 'eu'],
                          'USD': ['US dollar', 'us'],
                          'JPY': ['Japanese yen', 'jp'],
                          'BGN': ['Bulgarian lev', 'bg'],
                          'CZK': ['Czech koruna','cz'],
                          'DKK': ['Danish krone','dk'],
                          'GBP': ['Pound sterling', 'gb'],
                          'HUF': ['Hungarian forint','hu'],
                          'PLN': ['Polish zloty', 'pl'],
                          'RON': ['Romanian leu','ro'],
                          'SEK': ['Swedish krona', 'se'],
                          'CHF': ['Swiss franc', 'ch'],
                          'ISK': ['Icelandic krona','is'],
                          'NOK': ['Norwegian krone','no'],
                          'HRK': ['Croatian kuna','hr'],
                          'RUB': ['Russian rouble', 'ru'],
                          'TRY': ['Turkish lira', 'tr'],
                          'AUD': ['Australian dollar', 'au'],
                          'BRL': ['Brazilian real', 'br'],
                          'CAD': ['Canadian dollar', 'ca'],
                          'CNY': ['Chinese yuan renminbi', 'cn'],
                          'HKD': ['Hong Kong dollar', 'hk'],
                          'IDR': ['Indonesian rupiah', 'id'],
                          'ILS': ['Israeli shekel', 'il'],
                          'INR': ['Indian rupee', 'in'],
                          'KRW': ['South Korean won', 'kr'],
                          'MXN': ['Mexican peso', 'mx'],
                          'MYR': ['Malaysian ringgit','my'],
                          'NZD': ['New Zealand dollar', 'nz'],
                          'PHP': ['Philippine peso', 'ph'],
                          'SGD': ['Singapore dollar', 'sg'],
                          'THB': ['Thai baht', 'th'],
                          'ZAR': ['South African rand', 'za']
 }; 

 
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

      // Add to local storage
      StorageCtrl.addItemToStorage(newItem);
      return newItem;
    },

    deleteItem: function(id){
      // get ids
      const ids = data.items.map(item => {
        return item.id
      });

      // get the index
      const index = ids.indexOf(id);
      // delete item from array
      data.items.splice(index, 1);
    },

    updateItem: function(currency, amount){
      let found = null;
      amount = parseInt(amount);

      data.items.forEach(item => {
        if (item.id === data.currentItem.id){
          item.currency = currency;
          item.amount = amount;
          found = item;
        }
      })

      return found

    },

    
    // Set base currency
    setBaseCurrency: function(currency){
      data.baseCurrency = currency;

      // update local storage
      StorageCtrl.addBaseCurrencyToStorage(currency);
      
      // update items list with new conversion rate
      this.fetchCurrencyRates(currency)
        .then(() =>{
        
        this.setTodaysRatesList();
        UICtrl.updateUI();
       
      })
        .catch(err => console.log(err));
      
    },

    getBaseCurrency: function(){
      return data.baseCurrency;
    },

    // Today's rates list
    getTodaysRatesList: function(){
      return data.todaysRatesList;
    },

    setTodaysRatesList: function(){
      
      // depending on base currency show different set of todays rates
      switch(data.baseCurrency){
        case 'GBP':
          data.todaysRatesList = ["USD", "EUR", "CAD", "AUD", "PLN"];
          break;
        case 'USD':
          data.todaysRatesList = ["GBP", "EUR", "CAD", "AUD", "PLN"];
          break;
        case 'EUR':
            data.todaysRatesList = ["GBP", "USD", "CAD", "AUD", "PLN"];
            break;
        case 'CAD':
          data.todaysRatesList = ["GBP", "EUR", "USD", "AUD", "PLN"];
          break;
        case 'AUD':
          data.todaysRatesList = ["GBP", "EUR", "CAD", "USD", "PLN"];
          break;
        default:
          data.todaysRatesList = ["USD", "GBP", "EUR", "CAD", "AUD"];
          
      }
      
    },
    getAvaliableCurrencies: function(){
      return currenciesList;

    },
    
    fetchCurrencyRates: async function(baseCurrency){
      let url = `https://api.exchangeratesapi.io/latest?base=${baseCurrency}`;

      let exchangeRates = {};
   
      const response = await fetch(url);
      const data = await response.json();
             
      for (const [curr, rate] of Object.entries(data.rates)){
           exchangeRates[curr] = rate;
      }

      await this.setDataExchangeRates(exchangeRates);
            
      this.setExchangeRateLastUpdate(new Date().toLocaleString());
    },

    setDataExchangeRates: function(exchangeRates){
      data.exchangeRates = exchangeRates;
    },

    getDataExchangeRates: function(){
      return data.exchangeRates;
    },

    setExchangeRateLastUpdate: function(date){
      data.exchangeRateLastUpdate = date;
    },

    getExchangeRateLastUpdate: function(){
      return data.exchangeRateLastUpdate;
    },

    exchangeMoney: function(currency, amount){
      
      let money = 0;
      // get exchange rate
      const rates = this.getDataExchangeRates();
      
      for (const [k,v] of Object.entries(rates)){
        if (k === currency){
          money =  (amount / v).toFixed(2);
        }
      }
      
      return money;
    },

    getItemById: function(ID){
      let found = null;

      // loop through items
      data.items.forEach(item => {
        if(item.id === ID){
          found = item;
        }
      })
      
      return found;
    },

    getDataItems: function(){
      return data.items;
    },

    clearDataItems: function(){
      data.items = [];
    },

    setCurrentItem: function(item){

      data.currentItem = item;
    },

    getCurrentItem: function(){
      return data.currentItem;
    },

    // validate currency
    isCurrencyValid: function(currency){
      let found = false;
      // split currency string to currency array
      currency = currency.split(" ");
      for (let [k,v] of Object.entries(currenciesList)){
        if(k == currency[0] || v[0] == currency[1]){
          found = true;
          break
        } 
      }
      return found;
    },

    dataLog: function(){
      console.log(data)
    }

  }
})();



