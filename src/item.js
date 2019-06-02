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

  // Available currencies
  /* list compatible with https://exchangeratesapi.io/ and foreign exchange rates published by the European Central Bank https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html */
  const currenciesList = {'USD': 'US dollar',
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

    getAvaliableCurrencies: function(){
      return currenciesList;

    },

    

    dataLog: function(){
      console.log(data)
    }

  }
})();

