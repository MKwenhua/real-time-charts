const pastTrades = [{
      position: "GOOG",
      volume: 120,
      date: new Date().toDateString(),
      short: false,
      pricestart: 776.15,
      priceend: 776.95
   }, {
      position: "YHOO",
      volume: 45,
      date: new Date().toDateString(),
      short: false,
      pricestart: 38.19,
      priceend: 38.80
   }, {
      position: "APPL",
      volume: 8212,
      date: new Date().toDateString(),
      short: false,
      pricestart: 121,
      priceend: 88
   }, {
      position: "MSFT",
      volume: 95,
      date: new Date().toDateString(),
      short: false,
      pricestart: 61.79,
      priceend: 61.52
   }, {
      position: "GBP/USD",
      volume: 80,
      date: new Date().toDateString(),
      short: false,
      pricestart: 1.327,
      priceend: 1.3272
   },

   {
      position: "AUD/JPY",
      volume: 20,
      date: new Date().toDateString(),
      short: false,
      pricestart: 82.21,
      priceend: 81.94
   }, {
      position: "APPL",
      volume: 8212,
      date: new Date().toDateString(),
      short: false,
      pricestart: 121,
      priceend: 88
   }, {
      position: "AMZN",
      volume: 200,
      date: new Date().toDateString(),
      short: false,
      pricestart: 751.77,
      priceend: 750.77
   }, {
      position: "AAPL",
      volume: 330,
      date: new Date().toDateString(),
      short: false,
      pricestart: 120.13,
      priceend: 119.97
   }, {
      position: "APPL",
      volume: 8212,
      date: new Date().toDateString(),
      short: false,
      pricestart: 121,
      priceend: 88
   }, {
      position: "APPL",
      volume: 8212,
      date: new Date().toDateString(),
      short: false,
      pricestart: 121,
      priceend: 88
   }, {
      position: "APPL",
      volume: 8212,
      date: new Date().toDateString(),
      short: false,
      pricestart: 121,
      priceend: 88
   }, {
      position: "APPL",
      volume: 8212,
      date: new Date().toDateString(),
      short: false,
      pricestart: 121,
      priceend: 88
   }, {
      position: "APPL",
      volume: 8212,
      date: new Date().toDateString(),
      short: false,
      pricestart: 121,
      priceend: 88
   }, {
      position: "APPL",
      volume: 8212,
      date: new Date().toDateString(),
      short: false,
      pricestart: 121,
      priceend: 88
   }, {
      position: "APPL",
      volume: 8212,
      date: new Date().toDateString(),
      short: false,
      pricestart: 121,
      priceend: 88
   }, {
      position: "APPL",
      volume: 8212,
      date: new Date().toDateString(),
      short: false,
      pricestart: 121,
      priceend: 88
   }

];

export default function reducer(state = {
   pastTrades: pastTrades,
   currentPos: [],
   todayTotal: 0.0,
   moneyAvaliable: 0.0,
   fetching: false,
   fetched: false,
   error: null,
}, action) {

   switch (action.type) {
      case "FETCH_TRADES":
         {
            return {...state,
               fetching: true
            }
         }
      case "FETCH_TRADES_REJECTED":
         {
            return {...state,
               fetching: false,
               error: action.payload
            }
         }
      case "FETCH_TRADES_FULFILLED":
         {
            return {
               ...state,
               fetching: false,
               fetched: true,
               pastTrades: action.payload,
            }
         }
      case "ADD_TRADE":
         {
            return {
               ...state,
               currentPos: [...state.currentPos, action.payload],
            }
         }
      case "TRADE_COMPLETE":
         {

            return {
               ...state,
               pastTrades: [...state.pastTrades, action.payload],
            }
         }
      case "ADD_MONEY":
         {
            return {
               ...state,
               moneyAvaliable: action.payload,
            }
         }
   }

   return state
}