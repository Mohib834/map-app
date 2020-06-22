import address from "./address";

const axios = require('axios');

const apiURL = 'api';

export default function() {
  return {
    modules: {
      shippingAddress: address(),
      billingAddress: address(),
    },
    state: state(),
    getters : getters,
    mutations: mutations,
    actions : actions
  }
}

const state = () => {
  return {

    checkoutDataLoaded : false,
    isLivePaymentMode: null,
    paymentServiceID: null, // e.g "braintree" or "stripe"
    braintreeClientToken: null,
    stripePublishableKey: null,
    billingAddressSameAsShippingAddress: true,
    shippingRatesRequireUpdating: true,
    shippingRatesLoading: false,
    shippingRateID : "STANDARD", // exeample 'FEDEX_EXPRESS_SAVER'
    shippingRates : [
      /*
      {name:"Standard (3-10 working days)", id:"STANDARD", rate:5.00},
      {name:"Express (3-5 working days)", id:"EXPRESS", rate:10.00}
*/
    ],

    states: {
      "CA": [
        {
          "code": "AB",
          "name": "Alberta"
        },
        {
          "code": "BC",
          "name": "British Columbia"
        },
        {
          "code": "MB",
          "name": "Manitoba"
        },
        {
          "code": "NB",
          "name": "New Brunswick"
        },
        {
          "code": "NL",
          "name": "Newfoundland and Labrador"
        },
        {
          "code": "NS",
          "name": "Nova Scotia"
        },
        {
          "code": "NT",
          "name": "Northwest Territories"
        },
        {
          "code": "NU",
          "name": "Nunavut"
        },
        {
          "code": "ON",
          "name": "Ontario"
        },
        {
          "code": "PE",
          "name": "Prince Edward Island"
        },
        {
          "code": "QC",
          "name": "Quebec"
        },
        {
          "code": "SK",
          "name": "Saskatchewan"
        },
        {
          "code": "YT",
          "name": "Yukon"
        }
      ],
      "AU" : [
        {
          "code": "ACT",
          "name": "Australian Capital Territory"
        },
        {
          "code": "NSW",
          "name": "New South Wales"
        },
        {
          "code": "NT",
          "name": "Northern Territory"
        },
        {
          "code": "QLD",
          "name": "Queensland"
        },
        {
          "code": "SA",
          "name": "South Australia"
        },
        {
          "code": "TAS",
          "name": "Tasmania"
        },
        {
          "code": "VIC",
          "name": "Victoria"
        },
        {
          "code": "WA",
          "name": "Western Australia"
        }
      ],
      "US": [
        {
          "code": "AA",
          "name": "Armed Forces Americas (except Canada)"
        },
        {
          "code": "AE",
          "name": "Armed Forces"
        },
        {
          "code": "AK",
          "name": "Alaska"
        },
        {
          "code": "AL",
          "name": "Alabama"
        },
        {
          "code": "AP",
          "name": "Armed Forces Pacific"
        },
        {
          "code": "AR",
          "name": "Arkansas"
        },
        {
          "code": "AS",
          "name": "American Samoa"
        },
        {
          "code": "AZ",
          "name": "Arizona"
        },
        {
          "code": "CA",
          "name": "California"
        },
        {
          "code": "CO",
          "name": "Colorado"
        },
        {
          "code": "CT",
          "name": "Connecticut"
        },
        {
          "code": "DC",
          "name": "District of Columbia"
        },
        {
          "code": "DE",
          "name": "Delaware"
        },
        {
          "code": "FL",
          "name": "Florida"
        },
        {
          "code": "FM",
          "name": "Federated States of Micronesia"
        },
        {
          "code": "GA",
          "name": "Georgia"
        },
        {
          "code": "GU",
          "name": "Guam"
        },
        {
          "code": "HI",
          "name": "Hawaii"
        },
        {
          "code": "IA",
          "name": "Iowa"
        },
        {
          "code": "ID",
          "name": "Idaho"
        },
        {
          "code": "IL",
          "name": "Illinois"
        },
        {
          "code": "IN",
          "name": "Indiana"
        },
        {
          "code": "KS",
          "name": "Kansas"
        },
        {
          "code": "KY",
          "name": "Kentucky"
        },
        {
          "code": "LA",
          "name": "Louisiana"
        },
        {
          "code": "MA",
          "name": "Massachusetts"
        },
        {
          "code": "MD",
          "name": "Maryland"
        },
        {
          "code": "ME",
          "name": "Maine"
        },
        {
          "code": "MH",
          "name": "Marshall Islands"
        },
        {
          "code": "MI",
          "name": "Michigan"
        },
        {
          "code": "MN",
          "name": "Minnesota"
        },
        {
          "code": "MO",
          "name": "Missouri"
        },
        {
          "code": "MP",
          "name": "Northern Mariana Islands"
        },
        {
          "code": "MS",
          "name": "Mississippi"
        },
        {
          "code": "MT",
          "name": "Montana"
        },
        {
          "code": "NC",
          "name": "North Carolina"
        },
        {
          "code": "ND",
          "name": "North Dakota"
        },
        {
          "code": "NE",
          "name": "Nebraska"
        },
        {
          "code": "NH",
          "name": "New Hampshire"
        },
        {
          "code": "NJ",
          "name": "New Jersey"
        },
        {
          "code": "NM",
          "name": "New Mexico"
        },
        {
          "code": "NV",
          "name": "Nevada"
        },
        {
          "code": "NY",
          "name": "New York"
        },
        {
          "code": "OH",
          "name": "Ohio"
        },
        {
          "code": "OK",
          "name": "Oklahoma"
        },
        {
          "code": "OR",
          "name": "Oregon"
        },
        {
          "code": "PA",
          "name": "Pennsylvania"
        },
        {
          "code": "PR",
          "name": "Puerto Rico"
        },
        {
          "code": "PW",
          "name": "Palau"
        },
        {
          "code": "RI",
          "name": "Rhode Island"
        },
        {
          "code": "SC",
          "name": "South Carolina"
        },
        {
          "code": "SD",
          "name": "South Dakota"
        },
        {
          "code": "TN",
          "name": "Tennessee"
        },
        {
          "code": "TX",
          "name": "Texas"
        },
        {
          "code": "UT",
          "name": "Utah"
        },
        {
          "code": "VA",
          "name": "Virginia"
        },
        {
          "code": "VI",
          "name": "Virgin Islands"
        },
        {
          "code": "VT",
          "name": "Vermont"
        },
        {
          "code": "WA",
          "name": "Washington"
        },
        {
          "code": "WI",
          "name": "Wisconsin"
        },
        {
          "code": "WV",
          "name": "West Virginia"
        },
        {
          "code": "WY",
          "name": "Wyoming"
        }
      ]
    },
    countriesLoaded :false,
    countries:[
      {
        "shippingCountryCode": "US",
        "shippingCountryName": "United States",
      },
      {
        "shippingCountryCode": "GB",
        "shippingCountryName": "United Kingdom",
      }
    ]
  }
};

const getters = {
  getStateName : (state,getters) => (countryCode , stateCode) =>{
    let states = state.states;
    if (states.hasOwnProperty(countryCode)) {
      let statesList = states[countryCode];
      let n = statesList.length;
      for(var i =0; i < n;++i)
      {
        if(statesList[i].code == stateCode)
        {
          return statesList[i].name;
        }
      }
    } else {

    }
    return "";
  },
  getCountryName : (state,getters) => countryCode =>{
    let countries = state.countries;
    let n = countries.length;
    for(var i =0; i < n; ++i)
    {
      if(countries[i].shippingCountryCode == countryCode)
      {
        return countries[i].shippingCountryName;
      }
    }
    return "";
  },

  billingAddressSummary : (state,getters) =>{
    return getters.getAddressSummary(state.billingAddress);
  },
  shippingAddressSummary : (state,getters) =>{
    return getters.getAddressSummary(state.shippingAddress);
  },
  getAddressSummary : (state,getters) => (address) =>{
    let str= "";
    str += address.firstname + " " + address.lastname + "\n";
    str += address.address1 + "\n";
    if((address.address2 != "") && (address.address2 != null) ) str += address.address2 + "\n";
    str += address.city + "\n";
    if((address.zip !== "") && (address.zip != null)) str += address.zip + "\n";
    str += getters.getCountryName(address.countryCode) + "\n";
    if((address.stateCode !== "") && (address.stateCode != null) ) str += getters.getStateName(address.countryCode, address.stateCode) + "\n";

    str += "\n";
    if((address.email != "") && (address.email != null)) str += address.email + "\n";
    if((address.phoneNumber != "") && (address.phoneNumber != null)) str += address.phoneNumber + "\n";

    return str;
  },
  getEstimatedDeliveryDates: (state,getters) => (shippingRateObj) => {
    let maxDays =  shippingRateObj.maxEstShippingDays;
    let minDays =  shippingRateObj.minEstShippingDays;
    /*
    if(shippingRateObj.maxEstShippingDays == shippingRateObj.minEstShippingDays)
    {
      return  minDays + " days";
    }
    return minDays +  " - " +  maxDays + " days";*/

    let minDate = addWorkDays(new Date(), minDays);
    let maxDate = addWorkDays(new Date(), maxDays);
    //maxDate.setDate(today.getDate() +maxDays);

    let mlist = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    let minMonth =  mlist[minDate.getMonth()];
    let maxMonth =  mlist[maxDate.getMonth()];

    var minDay = minDate.getDate();
    var maxDay = maxDate.getDate();

    if( (minDay == maxDay) && (minMonth == maxMonth) )
    {
      return minDay + " " + minMonth;
    }
    else if(maxMonth != maxMonth)
    {
      return minDay + " " + minMonth + " - " +  maxDay + " " + maxMonth;

    }
    else{ // same month but diffferent day
      return minDay + " - " +  maxDay + " " + maxMonth;

    }
  },
  billingAddressSameAsShippingAddress : state => {
    return state.billingAddressSameAsShippingAddress;
  },
  shippingRates: state => {
    return state.shippingRates;
  },

  shippingRate : state => {
    if(state.shippingRateID != null)
    {
      for(var i =0; i< state.shippingRates.length;++i)
      {
        if(state.shippingRates[i].shippingRateID == state.shippingRateID)
        {
          return state.shippingRates[i];
        }
      }
    }
    return null;
  },
  shippingRatePriceWithCurrency: (state,getters) =>
  {
    return getters.getCurrencySymbol + getters.shippingRatePrice;
  },
  shippingRatePrice: (state,getters) =>
  {
    console.log("shippingRatePrice", getters.shippingRate, state.shippingRateID);
    return getters.getShippingRatePriceForObject(getters.shippingRate);
  },
  getShippingRatePriceForObject: (state,getters) => (shippingRateObj) =>
  {
    var priceName = "shippingRatePrice" + getters.getCurrencyName;
    if(shippingRateObj == null) return 0;
    return  shippingRateObj[priceName];
  },
  shippingRateDescription: (state,getters) =>
  {
    var rate= getters.shippingRate;
    if(rate) return getters.getShippingRateDescriptionForObj(rate);
    return "";
  },
  getShippingRateDescriptionForObj: (state,getters)=> (shippingRateObj) =>
  {
    return shippingRateObj['shippingRateName'];
  },

  countriesLoaded: (state,getters)=>
  {
    return state.countriesLoaded;
  },
  paymentServiceID: (state,getters) =>{
    return state.paymentServiceID;
  },
  stripePublishableKey : (state,getters)=>{
    return state.stripePublishableKey;
  },
  braintreeClientToken: (state,getters)=>{
    return state.braintreeClientToken;
  },
  isLivePaymentMode : (state,getters)=>{
    return state.livePaymentMode;
  },
  checkoutDataLoaded : (state,getters)=>{
    return state.checkoutDataLoaded;
  },


  /*
  shippingAddress : state => {
    return state.shippingAddress;
  },*/
};

const mutations = {
  updateShippingRates: (state, payload) => {
    state.shippingRates = payload;
    if((state.shippingRates != null) && (state.shippingRates.length > 0) ) {
      state.shippingRateID = state.shippingRates[0].shippingRateID;
    }
    else{
      state.shippingRateID = null;
    }

  },
  shippingAddressDirty: (state) =>{
    state.shippingRatesRequireUpdating = true;
    //state.shippingRatesLoading = false;
    state.shippingRateID = null;
    state.shippingRates = [];
  },
  billingAddressSameAsShippingAddress : (state, payload) =>{
    state.billingAddressSameAsShippingAddress = payload;
  },
  setPaymentServiceID : (state,payload) =>{
    state.paymentServiceID = payload;
  },
  setStripePublishableKey: (state ,payload) =>{
    state.stripePublishableKey = payload;
  },
  setBraintreeClientToken: (state ,payload) =>{
    state.braintreeClientToken = payload;
  },
  setLivePaymentMode: (state ,payload) =>{
    state.livePaymentMode = payload;
  },

  setCountries: (state, payload) =>{
    state.countries = payload;
    state.countriesLoaded = true;
  },


};

const actions = {

// get data including the countries and the api key from server
  retrieveCheckoutDataFromServer : context =>{
    console.log("retrieveCheckoutDataFromServer /getCheckoutData");
    context.state.checkoutDataLoaded = false;
    context.state.countriesLoaded = false;
    context.state.countries = [];
    var data = {};
    return new Promise((resolve, reject) => {
      axios.post(apiURL + '/getCheckoutData', data)
        .then(function (response) {
          console.log("/getCheckoutData response: " ,response.data);
          setTimeout(() => {
            let data = response.data;
            let paymentServiceID = data.paymentServiceID;
            context.commit("setCountries",data.countries);
            context.commit("setLivePaymentMode", data.livePaymentMode);
            context.commit("setPaymentServiceID", data.paymentServiceID );
            if(paymentServiceID == "stripe") {
              context.commit("setStripePublishableKey", data.stripePublishableKey);
            }
            else{
              context.commit("setBraintreeClientToken", data.braintreeClientToken);
            }
            context.state.checkoutDataLoaded = true;
            resolve(data);
          }, 100); //add a timeout to test
        })
        .catch(function (error) {
          console.log(error);
          reject();
        });
    });
  },

};

function addWorkDays(startDate, days) {
  if(isNaN(days)) {
    console.log("Value provided for \"days\" was not a number");
    return
  }
  if(!(startDate instanceof Date)) {
    console.log("Value provided for \"startDate\" was not a Date object");
    return
  }
  // Get the day of the week as a number (0 = Sunday, 1 = Monday, .... 6 = Saturday)
  var dow = startDate.getDay();
  var daysToAdd = parseInt(days);
  // If the current day is Sunday add one day
  if (dow == 0)
    daysToAdd++;
  // If the start date plus the additional days falls on or after the closest Saturday calculate weekends
  if (dow + daysToAdd >= 6) {
    //Subtract days in current working week from work days
    var remainingWorkDays = daysToAdd - (5 - dow);
    //Add current working week's weekend
    daysToAdd += 2;
    if (remainingWorkDays > 5) {
      //Add two days for each working week by calculating how many weeks are included
      daysToAdd += 2 * Math.floor(remainingWorkDays / 5);
      //Exclude final weekend if remainingWorkDays resolves to an exact number of weeks
      if (remainingWorkDays % 5 == 0)
        daysToAdd -= 2;
    }
  }
  startDate.setDate(startDate.getDate() + daysToAdd);
  return startDate;
}
