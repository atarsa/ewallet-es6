import { UICtrl } from "./ui";

export const ItemCtrl =  (function(){
  // Item constructor
  const Item  = function(id, currency, amount){
    this.id = id;
    this.currency = currency;
    this.amount = amount;
  }

  // Data Strucuture
  const data = {
    items : [{ id: 0, currency: "PLN", amount: 100 },
    { id: 1, currency: "GBP", amount: 100 }
      ],
    currentItem: null,
    // init with GBP as defualt
    // TODO: get base currency from local storage on load
    baseCurrency: "GBP",
    exchangeRates: {}
  }

  // Available currencies
  /* list compatible with https://exchangeratesapi.io/ and foreign exchange rates published by the European Central Bank https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html */
  const currenciesList = {'EUR': 'Euro',
                          'USD': 'US dollar',
                          'JPY': 'Japanese yen',
                          'BGN': 'Bulgarian lev',
                          'CZK': 'Czech koruna',
                          'DKK': 'Danish krone',
                          'GBP': 	'Pound sterling',
                          'HUF' :	'Hungarian forint',
                          'PLN' :	'Polish zloty',
                          'RON' :	'Romanian leu',
                          'SEK' :	'Swedish krona',
                          'CHF' :	'Swiss franc',
                          'ISK' :	'Icelandic krona',
                          'NOK' :	'Norwegian krone',
                          'HRK' :	'Croatian kuna',
                          'RUB' :	'Russian rouble',
                          'TRY' :	'Turkish lira',
                          'AUD' :	'Australian dollar',
                          'BRL': 	'Brazilian real',
                          'CAD': 	'Canadian dollar',
                          'CNY' :  'Chinese yuan renminbi',
                          'HKD'  : 'Hong Kong dollar',
                          'IDR'  : 'Indonesian rupiah',
                          'ILS' :	'Israeli shekel',
                          'INR' :	'Indian rupee',
                          'KRW' :'South Korean won',
                          'MXN' :	'Mexican peso',
                          'MYR' :	'Malaysian ringgit',
                          'NZD' :	'New Zealand dollar',
                          'PHP' :	'Philippine peso',
                          'SGD' :	'Singapore dollar',
                          'THB' :	'Thai baht',
                          'ZAR': 	'South African rand'
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
      return newItem;
    },

    // Set base currency
    setBaseCurrency: function(currency){
      data.baseCurrency = currency;
      // update items list with new conversion rate
      this.fetchCurrencyRates(currency)
        .then(() =>{
        UICtrl.populateItemsList();
        UICtrl.updateTotalMoney();
      })
        .catch(err => console.log(err));
      
    },

    getBaseCurrency: function(){
      return data.baseCurrency;
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
      
      
    },

    setDataExchangeRates: function(exchangeRates){
      data.exchangeRates = exchangeRates;
    },

    getDataExchangeRates: function(){
      return data.exchangeRates;
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
      
      // update total
      // updateTotal(money)
      return money;
    },

    
    
    getDataItems: function(){
      return data.items;
    },

    dataLog: function(){
      console.log(data)
    }

  }
})();



