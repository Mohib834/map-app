/* eslint-disable */

import Vue from 'vue';
import Vuex from 'vuex';
import io from 'socket.io-client';

import checkout from './modules/checkout'

Vue.use(Vuex);

const axios = require('axios');

var commonGlobals = require('../../../common/commonGlobals');
import {bus} from "../main"
var localStore = require('../utils/localStore');




//const USE_TEST_SERVER = true;  // set to true to use the cloud server, otherwise use localhost

//const rootURL = window.location.protocol +"//"+ window.location.hostname;
//const rootURL = "https://makemapart.com";
//const apiURL = commonGlobals.API_URL;
//const apiURL = "http://192.168.1.16:3000/api";
//const apiURL =  rootURL + '/api';
//const apiURL =  (USE_TEST_SERVER)? rootURL + '/api' :  "/api";
const apiURL =  "/api";

console.log("store apiURL", apiURL);

var _socket = null;

//const MAPEDITORPAGE_MODE_ADD = "add";
//const MAPEDITORPAGE_MODE_EDIT = "edit";

export default new Vuex.Store({
  modules:{
    checkout: checkout(),

  },
  state: {
    socketID: null,

    findMyOrderDataLoading: true,
    findMyOrderData: null,
    isMobileDevice: false,
    browserID: null, // gets set in app
    jobID: null, // currently processing jobID, used for cancelling

    innerHeight: 0, // caclulate on app start, inner height for the window on first load. this is used because mobile browsers change thier height on scroll as the viewport changes

    ///////////////////////////
    // calculated from the server - this is the pricing breakdown
    subTotal: 0,
    totalDiscounts : 0,
    shippingCost: null,
    VAT : null,
    totalCost: null,
    ///////////////////////////

    voucherData: null,
    localStorageLoaded: false,
    nVisits: 0,

    minZoomLevel: 12,
    maxZoomLevel: 15,

    shippingOfferMessageClosed : false,
    shippingOfferDescription: "",
    shippingOfferID: commonGlobals.SHIPPING_OFFER_ID_NONE, // preset this for now

    activeJobLoaded: false,
    activeJob: {
      basemapID: null,
      queuePosition: 0,
      estimatedQueueDuration : null, // time in seconds
      processPercentage : 0,  // current step
      processPercentageNext: 0, // next progress step
      status: null,
      viewed : false
    },
    previewCreatorFirstVisit : true,
    mapEditorFirstVisit : true,
    /*
    mapEditorPage:{
      mode: "add"
    },*/

    currencyID: 1,
    currencies: [
      // loaded from server
      /*
      {currencyID:1, currencyName:"USD", currencySymbol:"$", showing:1},
      {currencyID:2, currencyName:"EUR", currencySymbol:"€", showing:1},
      {currencyID:3, currencyName:"GBP", currencySymbol:"£", showing:0}
*/
    ],

    //metricUnits : false,
    currenciesLoaded: false,
    skusAndPrintSizesLoaded : false,
    themesLoading : false,
    themesLoaded: false,
    demoThemes: [{"themeID":"abyss","road":[1,24,42],"water":[222,206,183],"segments":[{"colour":[233,221,195],"weight":13},{"colour":[234,212,173],"weight":35},{"colour":[224,202,164],"weight":10},{"colour":[201,184,155],"weight":6},{"colour":[190,173,145],"weight":12},{"colour":[179,163,137],"weight":14},{"colour":[106,191,172],"weight":6},{"colour":[80,173,152],"weight":15},{"colour":[48,139,130],"weight":13},{"colour":[39,168,163],"weight":20},{"colour":[43,156,150],"weight":16},{"colour":[54,198,193],"weight":7},{"colour":[19,106,113],"weight":15},{"colour":[0,72,84],"weight":8},{"colour":[0,36,60],"weight":14},{"colour":[1,24,42],"weight":12},{"colour":[2,68,90],"weight":12}]},{"themeID":1,"road":[212,202,166],"water":[209,140,102],"segments":[{"colour":[233,221,195],"weight":13},{"colour":[182,132,104],"weight":5},{"colour":[217,184,141],"weight":13},{"colour":[234,212,173],"weight":15},{"colour":[224,202,164],"weight":10},{"colour":[201,184,155],"weight":6},{"colour":[190,173,145],"weight":12},{"colour":[179,163,137],"weight":14},{"colour":[106,191,172],"weight":6},{"colour":[80,173,152],"weight":15},{"colour":[48,139,130],"weight":13},{"colour":[39,168,163],"weight":20},{"colour":[43,156,150],"weight":16},{"colour":[54,198,193],"weight":7},{"colour":[19,106,113],"weight":15},{"colour":[0,72,84],"weight":8},{"colour":[0,36,60],"weight":14},{"colour":[1,24,42],"weight":12},{"colour":[2,68,90],"weight":12}]},{"themeID":2,"road":[243,236,215],"water":[112,173,145],"segments":[{"colour":[98,153,128],"weight":36},{"colour":[164,210,170],"weight":69},{"colour":[255,77,68],"weight":24},{"colour":[252,198,82],"weight":40},{"colour":[216,192,126],"weight":0},{"colour":[215,192,128],"weight":25},{"colour":[255,231,164],"weight":32}]},{"themeID":3,"road":[50,50,50],"water":[204,212,213],"segments":[{"colour":[204,212,213],"weight":201},{"colour":[25,164,193],"weight":6},{"colour":[69,194,220],"weight":19},{"colour":[116,193,209],"weight":8},{"colour":[76,76,76],"weight":21},{"colour":[139,139,139],"weight":22},{"colour":[181,181,181],"weight":21}]},{"themeID":4,"road":[105,130,138],"water":[155,200,215],"segments":[{"colour":[29,26,24],"weight":38},{"colour":[128,128,128],"weight":18},{"colour":[249,249,249],"weight":21},{"colour":[139,139,139],"weight":31},{"colour":[216,216,216],"weight":42},{"colour":[76,76,76],"weight":51},{"colour":[181,181,181],"weight":25},{"colour":[216,216,216],"weight":33}]},{"themeID":5,"road":[29,26,24],"water":[185,185,185],"segments":[{"colour":[128,128,128],"weight":18},{"colour":[249,249,249],"weight":21},{"colour":[139,139,139],"weight":31},{"colour":[216,216,216],"weight":42},{"colour":[76,76,76],"weight":51},{"colour":[181,181,181],"weight":25},{"colour":[216,216,216],"weight":33}]},{"themeID":6,"road":[29,26,24],"water":[202,165,132],"segments":[{"colour":[128,128,128],"weight":18},{"colour":[249,249,249],"weight":21},{"colour":[139,139,139],"weight":31},{"colour":[216,216,216],"weight":42},{"colour":[76,76,76],"weight":51},{"colour":[181,181,181],"weight":25},{"colour":[216,216,216],"weight":33}]},{"themeID":7,"road":[29,26,24],"water":[67,171,160],"segments":[{"colour":[138,190,185],"weight":18},{"colour":[249,249,249],"weight":21},{"colour":[142,160,158],"weight":16},{"colour":[139,139,139],"weight":14},{"colour":[163,191,189],"weight":18},{"colour":[216,216,216],"weight":23},{"colour":[76,76,76],"weight":51},{"colour":[181,181,181],"weight":25},{"colour":[216,216,216],"weight":33}]},{"themeID":8,"road":[29,26,24],"water":[160,194,131],"segments":[{"colour":[128,128,128],"weight":18},{"colour":[249,249,249],"weight":21},{"colour":[139,139,139],"weight":31},{"colour":[216,216,216],"weight":42},{"colour":[76,76,76],"weight":51},{"colour":[181,181,181],"weight":25},{"colour":[216,216,216],"weight":33}]},{"themeID":9,"road":[29,26,24],"water":[241,117,138],"segments":[{"colour":[128,128,128],"weight":18},{"colour":[249,249,249],"weight":21},{"colour":[139,139,139],"weight":31},{"colour":[216,216,216],"weight":42},{"colour":[76,76,76],"weight":51},{"colour":[181,181,181],"weight":25},{"colour":[216,216,216],"weight":33}]},{"themeID":10,"road":[29,26,24],"water":[240,241,117],"segments":[{"colour":[228,228,161],"weight":25},{"colour":[249,249,249],"weight":21},{"colour":[139,139,139],"weight":31},{"colour":[216,216,216],"weight":42},{"colour":[76,76,76],"weight":51},{"colour":[181,181,181],"weight":25},{"colour":[216,216,216],"weight":33}]},{"themeID":11,"road":[72,82,89],"water":[101,164,205],"segments":[{"colour":[204,212,213],"weight":201},{"colour":[111,162,198],"weight":6},{"colour":[160,184,201],"weight":19},{"colour":[185,210,229],"weight":8},{"colour":[76,76,76],"weight":21},{"colour":[103,117,127],"weight":22},{"colour":[176,176,176],"weight":21}]},{"themeID":12,"road":[255,255,255],"water":[200,116,93],"segments":[{"colour":[28,33,56],"weight":46},{"colour":[200,116,93],"weight":3},{"colour":[66,73,103],"weight":37},{"colour":[143,144,177],"weight":66},{"colour":[182,183,196],"weight":119},{"colour":[228,228,230],"weight":56},{"colour":[255,255,255],"weight":24},{"colour":[228,228,230],"weight":1},{"colour":[255,255,255],"weight":6}]},{"themeID":13,"road":[239,234,224],"water":[82,173,207],"segments":[{"colour":[4,88,147],"weight":21},{"colour":[13,100,147],"weight":32},{"colour":[14,131,175],"weight":25},{"colour":[1,150,207],"weight":70},{"colour":[20,188,208],"weight":24},{"colour":[64,211,194],"weight":52},{"colour":[172,226,220],"weight":55},{"colour":[234,208,65],"weight":32},{"colour":[240,141,61],"weight":10},{"colour":[240,86,61],"weight":8},{"colour":[221,153,166],"weight":5}]},{"themeID":14,"road":[232,226,204],"water":[68,68,68],"segments":[{"colour":[237,233,217],"weight":32},{"colour":[0,0,0],"weight":12},{"colour":[70,67,59],"weight":23},{"colour":[112,106,88],"weight":29},{"colour":[230,32,82],"weight":25},{"colour":[244,28,84],"weight":13},{"colour":[44,176,180],"weight":14},{"colour":[47,142,162],"weight":14},{"colour":[44,175,158],"weight":17},{"colour":[5,167,179],"weight":25},{"colour":[229,192,169],"weight":11},{"colour":[184,188,74],"weight":11},{"colour":[202,208,71],"weight":41}]},{"themeID":15,"road":[30,55,63],"water":[231,213,222],"segments":[{"colour":[43,72,82],"weight":40},{"colour":[195,140,168],"weight":6},{"colour":[200,174,187],"weight":28},{"colour":[212,199,206],"weight":15},{"colour":[70,107,115],"weight":21},{"colour":[99,123,136],"weight":33},{"colour":[139,163,176],"weight":59},{"colour":[177,194,203],"weight":54},{"colour":[226,210,218],"weight":40}]},{"themeID":16,"road":[29,26,24],"water":[225,195,153],"segments":[{"colour":[232,234,45],"weight":25},{"colour":[241,123,81],"weight":30},{"colour":[241,190,117],"weight":39},{"colour":[241,211,117],"weight":33},{"colour":[29,26,24],"weight":13},{"colour":[76,76,76],"weight":25},{"colour":[186,177,165],"weight":8},{"colour":[181,181,181],"weight":14},{"colour":[231,219,180],"weight":12},{"colour":[214,214,214],"weight":18},{"colour":[244,240,219],"weight":11}]},{"themeID":17,"road":[111,82,67],"water":[235,221,213],"segments":[{"colour":[190,158,141],"weight":18},{"colour":[128,93,75],"weight":5},{"colour":[130,104,91],"weight":15},{"colour":[181,168,161],"weight":35},{"colour":[109,174,166],"weight":5},{"colour":[128,201,192],"weight":32},{"colour":[166,206,200],"weight":92},{"colour":[190,219,215],"weight":54}]},{"themeID":18,"road":[205,205,205],"water":[214,220,221],"segments":[{"colour":[54,179,205],"weight":39},{"colour":[94,202,225],"weight":48},{"colour":[76,195,220],"weight":121},{"colour":[25,164,193],"weight":10},{"colour":[229,226,122],"weight":1},{"colour":[215,115,145],"weight":3},{"colour":[225,124,154],"weight":9},{"colour":[76,76,76],"weight":21},{"colour":[139,139,139],"weight":22},{"colour":[181,181,181],"weight":21}]},{"themeID":19,"road":[217,204,167],"water":[224,217,198],"segments":[{"colour":[218,204,167],"weight":0},{"colour":[213,203,167],"weight":0},{"colour":[110,167,166],"weight":0},{"colour":[105,166,166],"weight":0},{"colour":[106,166,166],"weight":94},{"colour":[106,167,167],"weight":0},{"colour":[104,161,162],"weight":0},{"colour":[66,48,64],"weight":0},{"colour":[64,42,59],"weight":0},{"colour":[64,43,60],"weight":56},{"colour":[63,42,60],"weight":0},{"colour":[242,178,99],"weight":56},{"colour":[242,104,53],"weight":49}]},{"themeID":20,"road":[48,43,38],"water":[60,56,52],"segments":[{"colour":[175,190,63],"weight":46},{"colour":[179,187,117],"weight":36},{"colour":[203,196,172],"weight":31},{"colour":[233,229,217],"weight":26},{"colour":[237,233,221],"weight":24},{"colour":[154,206,183],"weight":25},{"colour":[152,211,212],"weight":33},{"colour":[103,97,107],"weight":22},{"colour":[99,99,136],"weight":29}]},{"themeID":21,"road":[238,242,210],"water":[209,211,194],"segments":[{"colour":[109,214,166],"weight":31},{"colour":[18,173,145],"weight":83},{"colour":[49,86,98],"weight":82},{"colour":[31,18,38],"weight":47},{"colour":[60,41,69],"weight":35}]},{"themeID":22,"road":[189,196,169],"water":[233,229,210],"segments":[{"colour":[230,219,173],"weight":32},{"colour":[231,225,196],"weight":5},{"colour":[85,210,187],"weight":5},{"colour":[77,217,192],"weight":7},{"colour":[141,196,176],"weight":40},{"colour":[23,140,119],"weight":21},{"colour":[81,169,153],"weight":27},{"colour":[33,145,124],"weight":21},{"colour":[37,152,99],"weight":5},{"colour":[27,178,151],"weight":52},{"colour":[0,163,133],"weight":36},{"colour":[32,18,2],"weight":3},{"colour":[60,37,10],"weight":22},{"colour":[96,62,23],"weight":4},{"colour":[230,219,173],"weight":11},{"colour":[189,196,169],"weight":0},{"colour":[233,229,210],"weight":6},{"colour":[114,132,123],"weight":0},{"colour":[76,82,69],"weight":17}]},{"themeID":23,"road":[50,50,50],"water":[183,178,182],"segments":[{"colour":[204,212,213],"weight":184},{"colour":[233,229,158],"weight":7},{"colour":[223,143,162],"weight":8},{"colour":[25,164,193],"weight":9},{"colour":[69,194,220],"weight":13},{"colour":[116,193,209],"weight":11},{"colour":[76,76,76],"weight":21},{"colour":[139,139,139],"weight":22},{"colour":[181,181,181],"weight":21}]},{"themeID":24,"road":[10,28,42],"water":[137,150,163],"segments":[{"colour":[176,188,219],"weight":18},{"colour":[121,166,201],"weight":21},{"colour":[209,218,241],"weight":31},{"colour":[14,79,129],"weight":42},{"colour":[8,63,106],"weight":51},{"colour":[23,95,136],"weight":59}]},{"themeID":25,"road":[234,217,224],"water":[212,171,188],"segments":[{"colour":[194,0,92],"weight":21},{"colour":[231,103,159],"weight":37},{"colour":[212,171,188],"weight":48},{"colour":[232,234,45],"weight":12},{"colour":[31,27,27],"weight":16},{"colour":[63,32,46],"weight":13},{"colour":[145,121,129],"weight":21},{"colour":[156,158,165],"weight":19},{"colour":[166,196,209],"weight":32}]},{"themeID":26,"road":[234,217,224],"water":[154,142,148],"segments":[{"colour":[194,0,92],"weight":21},{"colour":[231,103,159],"weight":37},{"colour":[212,171,188],"weight":48},{"colour":[232,234,45],"weight":12},{"colour":[31,27,27],"weight":16},{"colour":[63,32,46],"weight":13},{"colour":[118,129,144],"weight":21},{"colour":[156,158,165],"weight":19},{"colour":[95,175,209],"weight":6},{"colour":[140,182,200],"weight":25}]},{"themeID":27,"road":[19,26,64],"water":[41,46,75],"segments":[{"colour":[65,208,250],"weight":13},{"colour":[44,173,215],"weight":11},{"colour":[23,219,192],"weight":17},{"colour":[121,230,219],"weight":32},{"colour":[78,92,167],"weight":60},{"colour":[144,154,204],"weight":14},{"colour":[207,2,95],"weight":26},{"colour":[220,35,87],"weight":5},{"colour":[242,63,114],"weight":18},{"colour":[238,111,147],"weight":7},{"colour":[219,212,191],"weight":39},{"colour":[234,227,207],"weight":42},{"colour":[249,242,224],"weight":34},{"colour":[75,98,105],"weight":34}]},{"themeID":28,"road":[236,220,190],"water":[235,226,209],"segments":[{"colour":[33,133,197],"weight":82},{"colour":[126,206,253],"weight":6},{"colour":[91,182,235],"weight":39},{"colour":[126,206,253],"weight":36},{"colour":[62,69,76],"weight":3},{"colour":[46,50,56],"weight":45},{"colour":[62,69,76],"weight":33},{"colour":[255,127,102],"weight":38}]},{"themeID":29,"road":[241,241,226],"water":[55,77,126],"segments":[{"colour":[234,46,73],"weight":27},{"colour":[239,103,71],"weight":24},{"colour":[255,162,0],"weight":29},{"colour":[255,192,0],"weight":44},{"colour":[55,77,126],"weight":54},{"colour":[66,88,137],"weight":37},{"colour":[75,99,151],"weight":33},{"colour":[90,122,165],"weight":32},{"colour":[99,157,195],"weight":16}]},{"themeID":30,"road":[219,219,199],"water":[204,199,176],"segments":[{"colour":[148,188,189],"weight":42},{"colour":[113,171,173],"weight":43},{"colour":[119,165,159],"weight":47},{"colour":[113,161,173],"weight":25},{"colour":[79,117,128],"weight":48},{"colour":[73,76,78],"weight":41},{"colour":[48,59,64],"weight":41}]},{"themeID":31,"road":[62,62,62],"water":[244,244,214],"segments":[{"colour":[68,92,66],"weight":19},{"colour":[140,174,110],"weight":28},{"colour":[188,214,148],"weight":21},{"colour":[36,51,61],"weight":0},{"colour":[47,64,68],"weight":14},{"colour":[45,59,62],"weight":1},{"colour":[56,86,92],"weight":0},{"colour":[64,106,114],"weight":0},{"colour":[62,101,108],"weight":16},{"colour":[59,98,106],"weight":0},{"colour":[74,114,117],"weight":0},{"colour":[84,124,124],"weight":0},{"colour":[81,121,122],"weight":6},{"colour":[77,116,118],"weight":0},{"colour":[109,160,151],"weight":18},{"colour":[222,216,102],"weight":22},{"colour":[247,240,111],"weight":28}]},{"themeID":32,"road":[237,220,192],"water":[240,228,209],"segments":[{"colour":[64,211,194],"weight":12},{"colour":[129,194,184],"weight":57},{"colour":[227,207,98],"weight":37},{"colour":[234,208,65],"weight":36},{"colour":[240,175,61],"weight":16},{"colour":[240,141,61],"weight":30},{"colour":[240,86,61],"weight":56},{"colour":[73,76,78],"weight":37},{"colour":[48,59,64],"weight":41}]},{"themeID":33,"road":[230,217,172],"water":[233,226,200],"segments":[{"colour":[255,70,42],"weight":29},{"colour":[248,87,62],"weight":11},{"colour":[253,110,66],"weight":21},{"colour":[255,127,88],"weight":92},{"colour":[232,162,141],"weight":60},{"colour":[229,177,139],"weight":16},{"colour":[229,188,139],"weight":21},{"colour":[55,51,48],"weight":48}]},{"themeID":34,"road":[76,76,76],"water":[226,226,204],"segments":[{"colour":[246,215,0],"weight":22},{"colour":[232,234,45],"weight":34},{"colour":[232,234,43],"weight":0},{"colour":[232,235,40],"weight":0},{"colour":[232,236,37],"weight":0},{"colour":[232,236,35],"weight":0},{"colour":[235,218,124],"weight":0},{"colour":[235,219,122],"weight":0},{"colour":[235,219,119],"weight":0},{"colour":[235,220,116],"weight":0},{"colour":[235,220,115],"weight":70},{"colour":[76,76,76],"weight":33},{"colour":[241,242,125],"weight":24},{"colour":[181,181,181],"weight":9},{"colour":[216,216,216],"weight":8},{"colour":[217,217,196],"weight":12},{"colour":[240,236,217],"weight":11}]},{"themeID":35,"road":[54,54,54],"water":[99,171,194],"segments":[{"colour":[133,231,219],"weight":6},{"colour":[113,195,209],"weight":8},{"colour":[99,151,167],"weight":20},{"colour":[175,148,102],"weight":8},{"colour":[102,74,27],"weight":8},{"colour":[224,232,128],"weight":26},{"colour":[230,167,203],"weight":22},{"colour":[249,242,224],"weight":177},{"colour":[221,217,205],"weight":23},{"colour":[75,76,71],"weight":22}]},{"themeID":36,"road":[48,43,38],"water":[60,56,52],"segments":[{"colour":[34,34,34],"weight":2},{"colour":[0,45,65],"weight":4},{"colour":[42,82,97],"weight":61},{"colour":[65,186,197],"weight":65},{"colour":[223,239,244],"weight":66},{"colour":[255,105,70],"weight":67},{"colour":[111,197,105],"weight":65}]},{"themeID":37,"road":[128,55,94],"water":[57,140,147],"segments":[{"colour":[239,193,88],"weight":1},{"colour":[222,198,144],"weight":40},{"colour":[239,193,88],"weight":29},{"colour":[240,145,138],"weight":0},{"colour":[229,179,175],"weight":48},{"colour":[240,145,138],"weight":24},{"colour":[234,122,111],"weight":8}]},{"themeID":38,"road":[48,43,38],"water":[167,198,205],"segments":[{"colour":[43,69,140],"weight":65},{"colour":[37,105,166],"weight":68},{"colour":[126,185,198],"weight":69},{"colour":[164,101,95],"weight":69}]},{"themeID":39,"road":[48,43,38],"water":[60,56,52],"segments":[{"colour":[69,177,246],"weight":69},{"colour":[63,233,77],"weight":68},{"colour":[255,241,51],"weight":70},{"colour":[232,102,48],"weight":70}]},{"themeID":40,"road":[32,58,87],"water":[209,207,239],"segments":[{"colour":[114,21,75],"weight":15},{"colour":[179,29,99],"weight":19},{"colour":[213,34,138],"weight":29},{"colour":[219,86,157],"weight":66},{"colour":[100,89,189],"weight":36},{"colour":[175,171,209],"weight":0},{"colour":[127,121,180],"weight":32},{"colour":[166,161,219],"weight":96},{"colour":[83,132,187],"weight":0},{"colour":[23,95,172],"weight":34}]},{"themeID":41,"road":[48,43,38],"water":[163,207,195],"segments":[{"colour":[108,159,178],"weight":2},{"colour":[100,174,185],"weight":61},{"colour":[28,125,136],"weight":67},{"colour":[152,236,199],"weight":69},{"colour":[244,90,102],"weight":69}]},{"themeID":42,"road":[48,43,38],"water":[194,208,228],"segments":[{"colour":[255,230,149],"weight":64},{"colour":[255,239,172],"weight":71},{"colour":[170,178,181],"weight":68},{"colour":[57,69,74],"weight":71}]},{"themeID":43,"road":[124,103,77],"water":[82,144,226],"segments":[{"colour":[129,212,181],"weight":9},{"colour":[142,199,178],"weight":32},{"colour":[129,212,181],"weight":25},{"colour":[251,223,199],"weight":19},{"colour":[243,224,207],"weight":48},{"colour":[188,212,129],"weight":18},{"colour":[97,114,65],"weight":14},{"colour":[101,125,54],"weight":7}]},{"themeID":44,"road":[91,54,82],"water":[245,221,101],"segments":[{"colour":[60,56,52],"weight":11},{"colour":[106,94,84],"weight":22},{"colour":[192,188,187],"weight":1},{"colour":[191,188,187],"weight":29},{"colour":[192,188,187],"weight":1},{"colour":[181,181,181],"weight":18},{"colour":[0,198,113],"weight":14},{"colour":[143,201,163],"weight":35},{"colour":[149,195,165],"weight":26},{"colour":[215,241,216],"weight":13},{"colour":[212,244,213],"weight":31}]},{"themeID":45,"road":[48,43,38],"water":[42,253,172],"segments":[{"colour":[232,67,222],"weight":30},{"colour":[224,75,155],"weight":18},{"colour":[218,42,136],"weight":9},{"colour":[228,33,216],"weight":5},{"colour":[186,98,114],"weight":16},{"colour":[75,33,33],"weight":5},{"colour":[113,60,67],"weight":4},{"colour":[97,21,201],"weight":20},{"colour":[121,57,209],"weight":55},{"colour":[53,124,255],"weight":47},{"colour":[17,100,255],"weight":14},{"colour":[91,160,183],"weight":23},{"colour":[39,59,89],"weight":8},{"colour":[0,41,228],"weight":16}]},{"themeID":46,"road":[95,87,80],"water":[245,245,222],"segments":[{"colour":[244,230,169],"weight":56},{"colour":[239,238,219],"weight":28},{"colour":[198,211,196],"weight":70},{"colour":[209,222,208],"weight":74},{"colour":[255,188,180],"weight":56}]},{"themeID":47,"road":[20,18,17],"water":[60,56,52],"segments":[{"colour":[242,191,194],"weight":63},{"colour":[242,128,137],"weight":68},{"colour":[242,191,194],"weight":69},{"colour":[242,242,242],"weight":67}]},{"themeID":48,"road":[44,44,45],"water":[219,216,204],"segments":[{"colour":[204,112,129],"weight":12},{"colour":[139,144,156],"weight":30},{"colour":[145,164,179],"weight":30},{"colour":[206,206,199],"weight":33},{"colour":[205,167,147],"weight":38}]},{"themeID":49,"road":[48,43,38],"water":[94,69,61],"segments":[{"colour":[87,96,168],"weight":29},{"colour":[106,125,173],"weight":35},{"colour":[63,81,127],"weight":4},{"colour":[39,48,117],"weight":15},{"colour":[63,81,127],"weight":46},{"colour":[39,48,117],"weight":0},{"colour":[135,189,219],"weight":19},{"colour":[150,205,219],"weight":46},{"colour":[224,207,193],"weight":20},{"colour":[225,207,200],"weight":46},{"colour":[224,207,193],"weight":0},{"colour":[163,140,130],"weight":13}]}],
    themes : [{"themeID":"abyss","road":[1,24,42],"water":[222,206,183],"segments":[{"colour":[233,221,195],"weight":13},{"colour":[234,212,173],"weight":35},{"colour":[224,202,164],"weight":10},{"colour":[201,184,155],"weight":6},{"colour":[190,173,145],"weight":12},{"colour":[179,163,137],"weight":14},{"colour":[106,191,172],"weight":6},{"colour":[80,173,152],"weight":15},{"colour":[48,139,130],"weight":13},{"colour":[39,168,163],"weight":20},{"colour":[43,156,150],"weight":16},{"colour":[54,198,193],"weight":7},{"colour":[19,106,113],"weight":15},{"colour":[0,72,84],"weight":8},{"colour":[0,36,60],"weight":14},{"colour":[1,24,42],"weight":12},{"colour":[2,68,90],"weight":12}]},{"themeID":1,"road":[212,202,166],"water":[209,140,102],"segments":[{"colour":[233,221,195],"weight":13},{"colour":[182,132,104],"weight":5},{"colour":[217,184,141],"weight":13},{"colour":[234,212,173],"weight":15},{"colour":[224,202,164],"weight":10},{"colour":[201,184,155],"weight":6},{"colour":[190,173,145],"weight":12},{"colour":[179,163,137],"weight":14},{"colour":[106,191,172],"weight":6},{"colour":[80,173,152],"weight":15},{"colour":[48,139,130],"weight":13},{"colour":[39,168,163],"weight":20},{"colour":[43,156,150],"weight":16},{"colour":[54,198,193],"weight":7},{"colour":[19,106,113],"weight":15},{"colour":[0,72,84],"weight":8},{"colour":[0,36,60],"weight":14},{"colour":[1,24,42],"weight":12},{"colour":[2,68,90],"weight":12}]},{"themeID":2,"road":[243,236,215],"water":[112,173,145],"segments":[{"colour":[98,153,128],"weight":36},{"colour":[164,210,170],"weight":69},{"colour":[255,77,68],"weight":24},{"colour":[252,198,82],"weight":40},{"colour":[216,192,126],"weight":0},{"colour":[215,192,128],"weight":25},{"colour":[255,231,164],"weight":32}]},{"themeID":3,"road":[50,50,50],"water":[204,212,213],"segments":[{"colour":[204,212,213],"weight":201},{"colour":[25,164,193],"weight":6},{"colour":[69,194,220],"weight":19},{"colour":[116,193,209],"weight":8},{"colour":[76,76,76],"weight":21},{"colour":[139,139,139],"weight":22},{"colour":[181,181,181],"weight":21}]},{"themeID":4,"road":[105,130,138],"water":[155,200,215],"segments":[{"colour":[29,26,24],"weight":38},{"colour":[128,128,128],"weight":18},{"colour":[249,249,249],"weight":21},{"colour":[139,139,139],"weight":31},{"colour":[216,216,216],"weight":42},{"colour":[76,76,76],"weight":51},{"colour":[181,181,181],"weight":25},{"colour":[216,216,216],"weight":33}]},{"themeID":5,"road":[29,26,24],"water":[185,185,185],"segments":[{"colour":[128,128,128],"weight":18},{"colour":[249,249,249],"weight":21},{"colour":[139,139,139],"weight":31},{"colour":[216,216,216],"weight":42},{"colour":[76,76,76],"weight":51},{"colour":[181,181,181],"weight":25},{"colour":[216,216,216],"weight":33}]},{"themeID":6,"road":[29,26,24],"water":[202,165,132],"segments":[{"colour":[128,128,128],"weight":18},{"colour":[249,249,249],"weight":21},{"colour":[139,139,139],"weight":31},{"colour":[216,216,216],"weight":42},{"colour":[76,76,76],"weight":51},{"colour":[181,181,181],"weight":25},{"colour":[216,216,216],"weight":33}]},{"themeID":7,"road":[29,26,24],"water":[67,171,160],"segments":[{"colour":[138,190,185],"weight":18},{"colour":[249,249,249],"weight":21},{"colour":[142,160,158],"weight":16},{"colour":[139,139,139],"weight":14},{"colour":[163,191,189],"weight":18},{"colour":[216,216,216],"weight":23},{"colour":[76,76,76],"weight":51},{"colour":[181,181,181],"weight":25},{"colour":[216,216,216],"weight":33}]},{"themeID":8,"road":[29,26,24],"water":[160,194,131],"segments":[{"colour":[128,128,128],"weight":18},{"colour":[249,249,249],"weight":21},{"colour":[139,139,139],"weight":31},{"colour":[216,216,216],"weight":42},{"colour":[76,76,76],"weight":51},{"colour":[181,181,181],"weight":25},{"colour":[216,216,216],"weight":33}]},{"themeID":9,"road":[29,26,24],"water":[241,117,138],"segments":[{"colour":[128,128,128],"weight":18},{"colour":[249,249,249],"weight":21},{"colour":[139,139,139],"weight":31},{"colour":[216,216,216],"weight":42},{"colour":[76,76,76],"weight":51},{"colour":[181,181,181],"weight":25},{"colour":[216,216,216],"weight":33}]},{"themeID":10,"road":[29,26,24],"water":[240,241,117],"segments":[{"colour":[228,228,161],"weight":25},{"colour":[249,249,249],"weight":21},{"colour":[139,139,139],"weight":31},{"colour":[216,216,216],"weight":42},{"colour":[76,76,76],"weight":51},{"colour":[181,181,181],"weight":25},{"colour":[216,216,216],"weight":33}]},{"themeID":11,"road":[72,82,89],"water":[101,164,205],"segments":[{"colour":[204,212,213],"weight":201},{"colour":[111,162,198],"weight":6},{"colour":[160,184,201],"weight":19},{"colour":[185,210,229],"weight":8},{"colour":[76,76,76],"weight":21},{"colour":[103,117,127],"weight":22},{"colour":[176,176,176],"weight":21}]},{"themeID":12,"road":[255,255,255],"water":[200,116,93],"segments":[{"colour":[28,33,56],"weight":46},{"colour":[200,116,93],"weight":3},{"colour":[66,73,103],"weight":37},{"colour":[143,144,177],"weight":66},{"colour":[182,183,196],"weight":119},{"colour":[228,228,230],"weight":56},{"colour":[255,255,255],"weight":24},{"colour":[228,228,230],"weight":1},{"colour":[255,255,255],"weight":6}]},{"themeID":13,"road":[239,234,224],"water":[82,173,207],"segments":[{"colour":[4,88,147],"weight":21},{"colour":[13,100,147],"weight":32},{"colour":[14,131,175],"weight":25},{"colour":[1,150,207],"weight":70},{"colour":[20,188,208],"weight":24},{"colour":[64,211,194],"weight":52},{"colour":[172,226,220],"weight":55},{"colour":[234,208,65],"weight":32},{"colour":[240,141,61],"weight":10},{"colour":[240,86,61],"weight":8},{"colour":[221,153,166],"weight":5}]},{"themeID":14,"road":[232,226,204],"water":[68,68,68],"segments":[{"colour":[237,233,217],"weight":32},{"colour":[0,0,0],"weight":12},{"colour":[70,67,59],"weight":23},{"colour":[112,106,88],"weight":29},{"colour":[230,32,82],"weight":25},{"colour":[244,28,84],"weight":13},{"colour":[44,176,180],"weight":14},{"colour":[47,142,162],"weight":14},{"colour":[44,175,158],"weight":17},{"colour":[5,167,179],"weight":25},{"colour":[229,192,169],"weight":11},{"colour":[184,188,74],"weight":11},{"colour":[202,208,71],"weight":41}]},{"themeID":15,"road":[30,55,63],"water":[231,213,222],"segments":[{"colour":[43,72,82],"weight":40},{"colour":[195,140,168],"weight":6},{"colour":[200,174,187],"weight":28},{"colour":[212,199,206],"weight":15},{"colour":[70,107,115],"weight":21},{"colour":[99,123,136],"weight":33},{"colour":[139,163,176],"weight":59},{"colour":[177,194,203],"weight":54},{"colour":[226,210,218],"weight":40}]},{"themeID":16,"road":[29,26,24],"water":[225,195,153],"segments":[{"colour":[232,234,45],"weight":25},{"colour":[241,123,81],"weight":30},{"colour":[241,190,117],"weight":39},{"colour":[241,211,117],"weight":33},{"colour":[29,26,24],"weight":13},{"colour":[76,76,76],"weight":25},{"colour":[186,177,165],"weight":8},{"colour":[181,181,181],"weight":14},{"colour":[231,219,180],"weight":12},{"colour":[214,214,214],"weight":18},{"colour":[244,240,219],"weight":11}]},{"themeID":17,"road":[111,82,67],"water":[235,221,213],"segments":[{"colour":[190,158,141],"weight":18},{"colour":[128,93,75],"weight":5},{"colour":[130,104,91],"weight":15},{"colour":[181,168,161],"weight":35},{"colour":[109,174,166],"weight":5},{"colour":[128,201,192],"weight":32},{"colour":[166,206,200],"weight":92},{"colour":[190,219,215],"weight":54}]},{"themeID":18,"road":[205,205,205],"water":[214,220,221],"segments":[{"colour":[54,179,205],"weight":39},{"colour":[94,202,225],"weight":48},{"colour":[76,195,220],"weight":121},{"colour":[25,164,193],"weight":10},{"colour":[229,226,122],"weight":1},{"colour":[215,115,145],"weight":3},{"colour":[225,124,154],"weight":9},{"colour":[76,76,76],"weight":21},{"colour":[139,139,139],"weight":22},{"colour":[181,181,181],"weight":21}]},{"themeID":19,"road":[217,204,167],"water":[224,217,198],"segments":[{"colour":[218,204,167],"weight":0},{"colour":[213,203,167],"weight":0},{"colour":[110,167,166],"weight":0},{"colour":[105,166,166],"weight":0},{"colour":[106,166,166],"weight":94},{"colour":[106,167,167],"weight":0},{"colour":[104,161,162],"weight":0},{"colour":[66,48,64],"weight":0},{"colour":[64,42,59],"weight":0},{"colour":[64,43,60],"weight":56},{"colour":[63,42,60],"weight":0},{"colour":[242,178,99],"weight":56},{"colour":[242,104,53],"weight":49}]},{"themeID":20,"road":[48,43,38],"water":[60,56,52],"segments":[{"colour":[175,190,63],"weight":46},{"colour":[179,187,117],"weight":36},{"colour":[203,196,172],"weight":31},{"colour":[233,229,217],"weight":26},{"colour":[237,233,221],"weight":24},{"colour":[154,206,183],"weight":25},{"colour":[152,211,212],"weight":33},{"colour":[103,97,107],"weight":22},{"colour":[99,99,136],"weight":29}]},{"themeID":21,"road":[238,242,210],"water":[209,211,194],"segments":[{"colour":[109,214,166],"weight":31},{"colour":[18,173,145],"weight":83},{"colour":[49,86,98],"weight":82},{"colour":[31,18,38],"weight":47},{"colour":[60,41,69],"weight":35}]},{"themeID":22,"road":[189,196,169],"water":[233,229,210],"segments":[{"colour":[230,219,173],"weight":32},{"colour":[231,225,196],"weight":5},{"colour":[85,210,187],"weight":5},{"colour":[77,217,192],"weight":7},{"colour":[141,196,176],"weight":40},{"colour":[23,140,119],"weight":21},{"colour":[81,169,153],"weight":27},{"colour":[33,145,124],"weight":21},{"colour":[37,152,99],"weight":5},{"colour":[27,178,151],"weight":52},{"colour":[0,163,133],"weight":36},{"colour":[32,18,2],"weight":3},{"colour":[60,37,10],"weight":22},{"colour":[96,62,23],"weight":4},{"colour":[230,219,173],"weight":11},{"colour":[189,196,169],"weight":0},{"colour":[233,229,210],"weight":6},{"colour":[114,132,123],"weight":0},{"colour":[76,82,69],"weight":17}]},{"themeID":23,"road":[50,50,50],"water":[183,178,182],"segments":[{"colour":[204,212,213],"weight":184},{"colour":[233,229,158],"weight":7},{"colour":[223,143,162],"weight":8},{"colour":[25,164,193],"weight":9},{"colour":[69,194,220],"weight":13},{"colour":[116,193,209],"weight":11},{"colour":[76,76,76],"weight":21},{"colour":[139,139,139],"weight":22},{"colour":[181,181,181],"weight":21}]},{"themeID":24,"road":[10,28,42],"water":[137,150,163],"segments":[{"colour":[176,188,219],"weight":18},{"colour":[121,166,201],"weight":21},{"colour":[209,218,241],"weight":31},{"colour":[14,79,129],"weight":42},{"colour":[8,63,106],"weight":51},{"colour":[23,95,136],"weight":59}]},{"themeID":25,"road":[234,217,224],"water":[212,171,188],"segments":[{"colour":[194,0,92],"weight":21},{"colour":[231,103,159],"weight":37},{"colour":[212,171,188],"weight":48},{"colour":[232,234,45],"weight":12},{"colour":[31,27,27],"weight":16},{"colour":[63,32,46],"weight":13},{"colour":[145,121,129],"weight":21},{"colour":[156,158,165],"weight":19},{"colour":[166,196,209],"weight":32}]},{"themeID":26,"road":[234,217,224],"water":[154,142,148],"segments":[{"colour":[194,0,92],"weight":21},{"colour":[231,103,159],"weight":37},{"colour":[212,171,188],"weight":48},{"colour":[232,234,45],"weight":12},{"colour":[31,27,27],"weight":16},{"colour":[63,32,46],"weight":13},{"colour":[118,129,144],"weight":21},{"colour":[156,158,165],"weight":19},{"colour":[95,175,209],"weight":6},{"colour":[140,182,200],"weight":25}]},{"themeID":27,"road":[19,26,64],"water":[41,46,75],"segments":[{"colour":[65,208,250],"weight":13},{"colour":[44,173,215],"weight":11},{"colour":[23,219,192],"weight":17},{"colour":[121,230,219],"weight":32},{"colour":[78,92,167],"weight":60},{"colour":[144,154,204],"weight":14},{"colour":[207,2,95],"weight":26},{"colour":[220,35,87],"weight":5},{"colour":[242,63,114],"weight":18},{"colour":[238,111,147],"weight":7},{"colour":[219,212,191],"weight":39},{"colour":[234,227,207],"weight":42},{"colour":[249,242,224],"weight":34},{"colour":[75,98,105],"weight":34}]},{"themeID":28,"road":[236,220,190],"water":[235,226,209],"segments":[{"colour":[33,133,197],"weight":82},{"colour":[126,206,253],"weight":6},{"colour":[91,182,235],"weight":39},{"colour":[126,206,253],"weight":36},{"colour":[62,69,76],"weight":3},{"colour":[46,50,56],"weight":45},{"colour":[62,69,76],"weight":33},{"colour":[255,127,102],"weight":38}]},{"themeID":29,"road":[241,241,226],"water":[55,77,126],"segments":[{"colour":[234,46,73],"weight":27},{"colour":[239,103,71],"weight":24},{"colour":[255,162,0],"weight":29},{"colour":[255,192,0],"weight":44},{"colour":[55,77,126],"weight":54},{"colour":[66,88,137],"weight":37},{"colour":[75,99,151],"weight":33},{"colour":[90,122,165],"weight":32},{"colour":[99,157,195],"weight":16}]},{"themeID":30,"road":[219,219,199],"water":[204,199,176],"segments":[{"colour":[148,188,189],"weight":42},{"colour":[113,171,173],"weight":43},{"colour":[119,165,159],"weight":47},{"colour":[113,161,173],"weight":25},{"colour":[79,117,128],"weight":48},{"colour":[73,76,78],"weight":41},{"colour":[48,59,64],"weight":41}]},{"themeID":31,"road":[62,62,62],"water":[244,244,214],"segments":[{"colour":[68,92,66],"weight":19},{"colour":[140,174,110],"weight":28},{"colour":[188,214,148],"weight":21},{"colour":[36,51,61],"weight":0},{"colour":[47,64,68],"weight":14},{"colour":[45,59,62],"weight":1},{"colour":[56,86,92],"weight":0},{"colour":[64,106,114],"weight":0},{"colour":[62,101,108],"weight":16},{"colour":[59,98,106],"weight":0},{"colour":[74,114,117],"weight":0},{"colour":[84,124,124],"weight":0},{"colour":[81,121,122],"weight":6},{"colour":[77,116,118],"weight":0},{"colour":[109,160,151],"weight":18},{"colour":[222,216,102],"weight":22},{"colour":[247,240,111],"weight":28}]},{"themeID":32,"road":[237,220,192],"water":[240,228,209],"segments":[{"colour":[64,211,194],"weight":12},{"colour":[129,194,184],"weight":57},{"colour":[227,207,98],"weight":37},{"colour":[234,208,65],"weight":36},{"colour":[240,175,61],"weight":16},{"colour":[240,141,61],"weight":30},{"colour":[240,86,61],"weight":56},{"colour":[73,76,78],"weight":37},{"colour":[48,59,64],"weight":41}]},{"themeID":33,"road":[230,217,172],"water":[233,226,200],"segments":[{"colour":[255,70,42],"weight":29},{"colour":[248,87,62],"weight":11},{"colour":[253,110,66],"weight":21},{"colour":[255,127,88],"weight":92},{"colour":[232,162,141],"weight":60},{"colour":[229,177,139],"weight":16},{"colour":[229,188,139],"weight":21},{"colour":[55,51,48],"weight":48}]},{"themeID":34,"road":[76,76,76],"water":[226,226,204],"segments":[{"colour":[246,215,0],"weight":22},{"colour":[232,234,45],"weight":34},{"colour":[232,234,43],"weight":0},{"colour":[232,235,40],"weight":0},{"colour":[232,236,37],"weight":0},{"colour":[232,236,35],"weight":0},{"colour":[235,218,124],"weight":0},{"colour":[235,219,122],"weight":0},{"colour":[235,219,119],"weight":0},{"colour":[235,220,116],"weight":0},{"colour":[235,220,115],"weight":70},{"colour":[76,76,76],"weight":33},{"colour":[241,242,125],"weight":24},{"colour":[181,181,181],"weight":9},{"colour":[216,216,216],"weight":8},{"colour":[217,217,196],"weight":12},{"colour":[240,236,217],"weight":11}]},{"themeID":35,"road":[54,54,54],"water":[99,171,194],"segments":[{"colour":[133,231,219],"weight":6},{"colour":[113,195,209],"weight":8},{"colour":[99,151,167],"weight":20},{"colour":[175,148,102],"weight":8},{"colour":[102,74,27],"weight":8},{"colour":[224,232,128],"weight":26},{"colour":[230,167,203],"weight":22},{"colour":[249,242,224],"weight":177},{"colour":[221,217,205],"weight":23},{"colour":[75,76,71],"weight":22}]},{"themeID":36,"road":[48,43,38],"water":[60,56,52],"segments":[{"colour":[34,34,34],"weight":2},{"colour":[0,45,65],"weight":4},{"colour":[42,82,97],"weight":61},{"colour":[65,186,197],"weight":65},{"colour":[223,239,244],"weight":66},{"colour":[255,105,70],"weight":67},{"colour":[111,197,105],"weight":65}]},{"themeID":37,"road":[128,55,94],"water":[57,140,147],"segments":[{"colour":[239,193,88],"weight":1},{"colour":[222,198,144],"weight":40},{"colour":[239,193,88],"weight":29},{"colour":[240,145,138],"weight":0},{"colour":[229,179,175],"weight":48},{"colour":[240,145,138],"weight":24},{"colour":[234,122,111],"weight":8}]},{"themeID":38,"road":[48,43,38],"water":[167,198,205],"segments":[{"colour":[43,69,140],"weight":65},{"colour":[37,105,166],"weight":68},{"colour":[126,185,198],"weight":69},{"colour":[164,101,95],"weight":69}]},{"themeID":39,"road":[48,43,38],"water":[60,56,52],"segments":[{"colour":[69,177,246],"weight":69},{"colour":[63,233,77],"weight":68},{"colour":[255,241,51],"weight":70},{"colour":[232,102,48],"weight":70}]},{"themeID":40,"road":[32,58,87],"water":[209,207,239],"segments":[{"colour":[114,21,75],"weight":15},{"colour":[179,29,99],"weight":19},{"colour":[213,34,138],"weight":29},{"colour":[219,86,157],"weight":66},{"colour":[100,89,189],"weight":36},{"colour":[175,171,209],"weight":0},{"colour":[127,121,180],"weight":32},{"colour":[166,161,219],"weight":96},{"colour":[83,132,187],"weight":0},{"colour":[23,95,172],"weight":34}]},{"themeID":41,"road":[48,43,38],"water":[163,207,195],"segments":[{"colour":[108,159,178],"weight":2},{"colour":[100,174,185],"weight":61},{"colour":[28,125,136],"weight":67},{"colour":[152,236,199],"weight":69},{"colour":[244,90,102],"weight":69}]},{"themeID":42,"road":[48,43,38],"water":[194,208,228],"segments":[{"colour":[255,230,149],"weight":64},{"colour":[255,239,172],"weight":71},{"colour":[170,178,181],"weight":68},{"colour":[57,69,74],"weight":71}]},{"themeID":43,"road":[124,103,77],"water":[82,144,226],"segments":[{"colour":[129,212,181],"weight":9},{"colour":[142,199,178],"weight":32},{"colour":[129,212,181],"weight":25},{"colour":[251,223,199],"weight":19},{"colour":[243,224,207],"weight":48},{"colour":[188,212,129],"weight":18},{"colour":[97,114,65],"weight":14},{"colour":[101,125,54],"weight":7}]},{"themeID":44,"road":[91,54,82],"water":[245,221,101],"segments":[{"colour":[60,56,52],"weight":11},{"colour":[106,94,84],"weight":22},{"colour":[192,188,187],"weight":1},{"colour":[191,188,187],"weight":29},{"colour":[192,188,187],"weight":1},{"colour":[181,181,181],"weight":18},{"colour":[0,198,113],"weight":14},{"colour":[143,201,163],"weight":35},{"colour":[149,195,165],"weight":26},{"colour":[215,241,216],"weight":13},{"colour":[212,244,213],"weight":31}]},{"themeID":45,"road":[48,43,38],"water":[42,253,172],"segments":[{"colour":[232,67,222],"weight":30},{"colour":[224,75,155],"weight":18},{"colour":[218,42,136],"weight":9},{"colour":[228,33,216],"weight":5},{"colour":[186,98,114],"weight":16},{"colour":[75,33,33],"weight":5},{"colour":[113,60,67],"weight":4},{"colour":[97,21,201],"weight":20},{"colour":[121,57,209],"weight":55},{"colour":[53,124,255],"weight":47},{"colour":[17,100,255],"weight":14},{"colour":[91,160,183],"weight":23},{"colour":[39,59,89],"weight":8},{"colour":[0,41,228],"weight":16}]},{"themeID":46,"road":[95,87,80],"water":[245,245,222],"segments":[{"colour":[244,230,169],"weight":56},{"colour":[239,238,219],"weight":28},{"colour":[198,211,196],"weight":70},{"colour":[209,222,208],"weight":74},{"colour":[255,188,180],"weight":56}]},{"themeID":47,"road":[20,18,17],"water":[60,56,52],"segments":[{"colour":[242,191,194],"weight":63},{"colour":[242,128,137],"weight":68},{"colour":[242,191,194],"weight":69},{"colour":[242,242,242],"weight":67}]},{"themeID":48,"road":[44,44,45],"water":[219,216,204],"segments":[{"colour":[204,112,129],"weight":12},{"colour":[139,144,156],"weight":30},{"colour":[145,164,179],"weight":30},{"colour":[206,206,199],"weight":33},{"colour":[205,167,147],"weight":38}]},{"themeID":49,"road":[48,43,38],"water":[94,69,61],"segments":[{"colour":[87,96,168],"weight":29},{"colour":[106,125,173],"weight":35},{"colour":[63,81,127],"weight":4},{"colour":[39,48,117],"weight":15},{"colour":[63,81,127],"weight":46},{"colour":[39,48,117],"weight":0},{"colour":[135,189,219],"weight":19},{"colour":[150,205,219],"weight":46},{"colour":[224,207,193],"weight":20},{"colour":[225,207,200],"weight":46},{"colour":[224,207,193],"weight":0},{"colour":[163,140,130],"weight":13}]}],
    orientationOptions: [{value:1, label:"Portrait", icon:"mdi-crop-portrait"},{value:2, label:"Landscape", icon:"mdi-crop-landscape"}],
    skus: [
      {
        skuID: 1,
        productTypeID: 1,
        skuDescription: "12x18",
        priceUSD: 35.00,
        priceEUR: 35.00,
        priceGDP: 35.00,
        printSizeID: 1,
        width: 12,
        height: 18
      },
      {
        skuID: 2,
        productTypeID: 1,
        skuDescription: "18x24",
        priceUSD: 65.00,
        priceEUR: 55.00,
        priceGDP: 45.00,
        printSizeID: 2,
        width: 18,
        height: 24
      },
      {
        skuID: 3,
        productTypeID: 1,
        skuDescription: "24x36",
        priceUSD: 75.00,
        priceEUR: 65.00,
        priceGDP: 55.00,
        printSizeID: 3,
        width: 24,
        height: 36
      }
    ],
    printSizes: [
    ],
    cartLoaded: false,

    cart: {
     // currencyID: 1,  // moved outside of cart object
      cartID: "",
      voucherCode: "",
      items:[
        /*
        {
          basemap: {
            basemapID: "BkAyHQK77",
            lat: 51.5275,
            lng: -0.09951,
            zoom: 12,
            printSizeID: 1,
            orientationID: 2
          },
          mapID: 0,
          quantity: 1,
          basemapID: "BkAyHQK71",
          themeID: "abyss",
          waterColour: [255, 0, 0],
          roadColour: [255, 0, 0],
          variation: 0,
          border: false
        }*/
      ]
    },

    basemap:{ // current editing basemap values
      // dont need baseID as we don't edit basemaps?
      searchCountry: "gb",
      searchRegion: "greater london",
      lat: 51.5275,
      lng: -0.09951,
      zoom: 12,
      printSizeID: 4,
      metricUnits: commonGlobals.isPrintSizeMetric(4),
      orientationID: 1,
      cityID: null,
      searchString : "London"
    },
    map: { // current map, these are the defaults when the user first enters (border, styleID etc)
      mapID: null,
      quantity: 1,
      basemapID: null,
      themeID: "lavender forest",  // get overriden if doesnt exist on theme load
      waterColour: [60, 56, 52],
      roadColour: [50, 50, 50],
      variation: 0,
      border: true,    // set the default border setting
      skuID: null,
      text1: "",
      text2: "",
      text3: "",
      styleID : 0  // set the default style setting
    },
    productTypeID: 1, // 1 = poster


},
  //showing things, not mutating state
  getters: {
    hasTotalCost: state =>{
      return (state.totalCost!= null)
    },
    hasTotalDiscounts: state =>{
      return (state.totalDiscounts != null)
    },
    hasShippingCost: state =>{
      return (state.shippingCost != null)
    },
    totalDiscounts: state =>{
      return state.totalDiscounts;
    },
    subTotal: state =>{
      return state.subTotal;
    },
    totalCost: state =>{
      return state.totalCost;
    },
    shippingCost: state =>{
      return state.shippingCost;
    },
    VAT: state =>{
      return state.VAT;
    },
    findMyOrderDataLoading:(state)=>{
      return state.findMyOrderDataLoading;
    },
    isMobileDevice: (state) =>{
      return state.isMobileDevice;
    },
    isBrowserSupported: (state) => {
      if(state.browser == null) return true;
      return (!(state.browser.name === "MSIE" || state.browser.name === "IE"));
    },
    innerHeight : (state)=>{
      return innerHeight;
    },
    contactEmail: (state,getters)=>{
      return commonGlobals.CONTACT_EMAIL;
      //state.contactEmail;
    },
    supportEmail: (state,getters)=>{
      return commonGlobals.SUPPORT_EMAIL;
      //state.supportEmail;
    },
    shippingOfferMessageClosed: (state,getters)=>{
      return state.shippingOfferMessageClosed;
    },
    // shipping offer
    hasShippingOffer:(state,getters)=>{
      return state.shippingOfferID != commonGlobals.SHIPPING_OFFER_ID_NONE;
    },
    shippingOfferID:(state,getters)=>{
      return state.shippingOfferID;
    },

    //// preview map job getters
    isActiveJobLoaded: (state,getters)=>{
      return state.activeJobLoaded;
    },
    isActiveJobWaitingForResponse: (state,getters)=>{
      //return !state.activeJobLoaded;
      return (state.activeJob.status === commonGlobals.PREVIEWMAP_JOB_STATUS_WAITING_FOR_RESPONSE);
    },
    isActiveJobProcessing: (state,getters)=>{
      return (state.activeJob.status === commonGlobals.PREVIEWMAP_JOB_STATUS_PROCESSING);
    },
    isActiveJobQueued: (state,getters)=>{
      return (state.activeJob.status === commonGlobals.PREVIEWMAP_JOB_STATUS_QUEUED);
    },
    isActiveJobComplete: (state,getters)=>{
      return (state.activeJob.status === commonGlobals.PREVIEWMAP_JOB_STATUS_COMPLETE);
    },
    isActiveJobViewed: (state,getters)=>{
      return state.activeJob.viewed;
    },
    isActiveJobError: (state,getters)=>{
      return (state.activeJob.status === commonGlobals.PREVIEWMAP_JOB_STATUS_ERROR);
    },
    activeJobQueuePosition: (state,getters)=>{
      return state.activeJob.queuePosition;
    },
    activeJobEstimatedQueueDuration: (state,getters)=>{
      return state.activeJob.estimatedQueueDuration;
    },
    activeJobQueueProcessPercentage: (state,getters)=>{
      return state.activeJob.processPercentage;
    },
    activeJobBasemapID: (state,getters)=>{
      return state.activeJob.basemapID;
    },
    hasActiveJob: (state,getters)=>{
      return state.activeJob.basemapID !== null;
    },
    getSocketID: (state,getters)=>{
      return state.socketID;
    },
    getSocket: (state,getters)=>{
      return _socket;
    },
    visibleCurrencies : state =>{
      let currencies = [];
      for(let i =0; i< state.currencies.length; ++ i){
        if(state.currencies[i].showing == 1){
          currencies.push(state.currencies[i]);
        }
      }
      return currencies;
    },
    getCurrencyName: (state,getters) =>{
      let currency = getters.getCurrencyObject;
      if(currency)
      {
        return currency.currencyName;
      }
    },
    getCurrencySymbol : (state,getters) =>{
      let currency = getters.getCurrencyObject;
      if(currency)
      {
        return currency.currencySymbol;
      }
    },
    getCurrencyID : state => {
      /*
      let defaultCurrencyID = 1; // USD
      if(state.cart == null) return defaultCurrencyID;
      let currencyID = state.cart.currencyID;
      if(currencyID == null)
      {
        return defaultCurrencyID;
      }
      return currencyID;*/
      return state.currencyID;
    },
    getCurrencyObject : (state, getters) =>{
      let currency =  getters.getCurrencyById(getters.getCurrencyID);
      return currency;
    },
    getCurrencyById : state => currencyID =>{
      for(let i= 0;i < state.currencies.length;++i)
      {
        if(state.currencies[i].currencyID == currencyID)
        {
          return state.currencies[i];
        }
      }
      return null;
    },

    getProductDescriptionFromSkuID: (state, getters) => skuID => {
      let skuObject = getters.getSkuObjectForSkuID(skuID);
      if( skuObject != null){
        return skuObject.skuDescription;
      }
    },
    getSkuObjectForSkuID: state => skuID => {
      for(let i =0; i< state.skus.length;++i)
      {
        if( (state.skus[i].skuID === skuID ) )
        {
          return state.skus[i];
        }
      }
      return null;
    },
    getSkuIDForCurrentProductTypeIDAndPrintSizeID : state =>{
      // base on the productTypeID and the printSizeID
      for(let i =0; i< state.skus.length;++i)
      {
        if( (state.skus[i].printSizeID === state.basemap.printSizeID ) && (state.skus[i].productTypeID === state.productTypeID))
        {
          return state.skus[i].skuID;
        }
      }
      return null;
    },
    /*
    metricUnits: state =>{
      return state.metricUnits;
    },*/
    currentPrintSize : state =>{
    //  console.log("state.basemap.printSizeID", state.basemap.printSizeID);
     // console.log("state.printSizes", state.printSizes);

      for(var i =0; i < state.printSizes.length;++i)
      {
        if( (state.printSizes[i].printSizeID === state.basemap.printSizeID))
        {
          return state.printSizes[i];
        }
      }
      return null;
    },
    printSizeOptions: (state, getters) => {
      var options = [];
      for(var i =0; i < state.skus.length;++i)
      {
        let sku = state.skus[i];
        if((sku.productTypeID === state.productTypeID) && sku.enabled)
        {
          let printSizeObj = getters.getPrintSizeObjectByID(sku.printSizeID);
          options.push(printSizeObj);
        }
      }
      console.log("printSizeOptions", options);
      return options;
      //return [{value: 1, label: "24x18"}, {value: 2, label: "36x24"}, {value: 3, label: "18x18"}];
    },
    getPrintSizeObjectByID: state => printSizeID => {
      for(let i =0; i < state.printSizes.length;++i){
        if(state.printSizes[i].printSizeID == printSizeID){
          return state.printSizes[i];
        }
      }
      return null;
    },
    zoomSizeOptions : state => {
      let options = [];
      for(let i = state.minZoomLevel; i<= state.maxZoomLevel;++i)
      {
        options.push({
          value: i,
          label: i+"",
        });
      }
      return options;
    },
    minZoomLevel: state =>{
      return state.minZoomLevel;
    },
    maxZoomLevel: state =>{
      return state.maxZoomLevel;
    },
    cartID : state =>{
      return state.cart.cartID;
    },
    voucherCode: state =>{
      return state.cart.voucherCode;
    },
    voucherData: state =>{
      return state.voucherData;
    },
    hasVoucherData: state =>{
      return state.voucherData != null;
    },

    hasVoucherDataPercentageOff: state=>{
      return (state.voucherData != null) && (state.voucherData.percentageOff != 0);
    },
    voucherDataPercentageOff: state=>{
      if(state.voucherData == null) return 0;
      return state.voucherData.percentageOff ;
    },
    themes : state => {
      return state.themes;
    },
    nThemes : state => {
      return state.themes.length;
    },
    currentTheme : (state,getters) => {
      console.log("state.map.themeID",state.map.themeID );
      return getters.getThemeByID(state.map.themeID);
    },
    currentThemeDescription : (state,getters) =>{
      var theme = getters.currentTheme;
      if(theme == null) return "";
      return theme.description;

    },
    currentThemeLabel : (state,getters) =>{
      var theme = getters.currentTheme;
      if(theme == null) return "";
      var name = theme.label;

      //camel case
      return  name.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
    },
    currentThemeSegments : (state,getters) => {
      if(getters.currentTheme) {
        return getters.currentTheme.segments;
      }
      return null;
    },
    getThemeByID : state => themeID => {
      var themes = state.themes;
      for(var i = 0; i< themes.length;++i)
      {
        if(themes[i].themeID == themeID) return themes[i];
      }
      return null;
      //return state.themes
    },
    getFirstThemeID: state => {
      var themes = state.themes;
      if(themes && themes.length > 0)
      {
        return themes[0].themeID;
      }
      return null;
    },
    isThemesLoaded : state => {
      return state.themesLoaded;
    },
    isThemesLoading : state => {
      return state.themesLoading;
    },
    isCartLoaded : state => {
      return state.cartLoaded;
    },
    ////////////////////
    // preview map getters

    previewMap_searchString : state => {
      return state.basemap.searchString;
    },
    previewMap_cityID : state => {
      return state.basemap.cityID;
    },
    previewMap_zoom : state => {
      return state.basemap.zoom;
    },
    previewMap_lng : state => {
      return state.basemap.lng;
    },
    previewMap_lat : state => {
      return state.basemap.lat;
    },
    previewMap_searchCountry : state => {
      return state.basemap.searchCountry;
    },
    previewMap_searchRegion : state => {
      return state.basemap.searchRegion;
    },
    previewMap_orientationID : state => {
      return state.basemap.orientationID;
    },
    previewMap_metricUnits : state => {
      return state.basemap.metricUnits;
    },
    previewMap_printSizeID : state => {
      return state.basemap.printSizeID;
    },
    previewMap_themeID : state => {
      return state.map.themeID;
    },
    previewMap_variation : state => {
      return state.map.variation;
    },
    previewMap_border : state => {
      return state.map.border;
    },
    previewMap_text1 : state => {
      return state.map.text1;
    },
    previewMap_text2 : state => {
      return state.map.text2;
    },
    previewMap_text3 : state => {
      return state.map.text3;
    },
    previewMap_styleID : state => {
      return state.map.styleID;
    },
    previewMap_waterColour : (state,getters) => {
      if(state.map.waterColour == null){
        // return the default water colour of the theme
        let currentTheme = getters.currentTheme;
        return (currentTheme !=null) ? currentTheme.water : null;
      }
      return state.map.waterColour;
    },
    previewMap_roadColour : (state,getters) => {
      if(state.map.roadColour == null){
        // return the default colour of the theme if there is no override colour in the map
        let currentTheme = getters.currentTheme;
        return (currentTheme !=null) ? currentTheme.road : null;
      }
      return state.map.roadColour;
    },
    previewMap_basemapID : state => {
      return state.map.basemapID;
    },
    previewMap_mapID : state => {
      return state.map.mapID;
    },
    //////////////////////////////////////////////////
    // helper methods
    getMapLocationDescription: (state, getters) =>  cartMapData =>
    {
      if(getters.isMapACustomRegion( cartMapData))
      {
        var searchString = getters.getMapSearchString(cartMapData);
        return (searchString !=null) ? searchString : "";
      }
      else{
        return getters.getMapCityName( cartMapData) ;
      }
    },

    getMapSearchString : state => cartMapData => {
      return cartMapData.basemap.searchString;
    },
    getMapCityID : state => cartMapData => {
      return cartMapData.basemap.cityID ;
    },
    // can be null if the map is a custom region
    getMapCityName : state => cartMapData => {
      return cartMapData.basemap.cityName ;
    },
    // is the map is a custom region
    isMapACustomRegion : state => cartMapData => {
      return cartMapData.basemap.cityID == null;
    },
    // is the map is city preset
    isMapACityPreset : state => cartMapData => {
      return cartMapData.basemap.cityID != null;
    },
    // todo - change this to invclude mapID
    getMapDataPrintSize : state => cartMapData => {
      return cartMapData.basemap.printSizeID;
    },
    getMapDataOrientationID : state => cartMapData => {
      return cartMapData.basemap.orientationID;
    },
    // get the map in the cart by mapID
    getMapInCartByID : state => mapID => {
      if(state.cart == null || state.cart.items == null)
      {
        return null;
      }
      let items = state.cart.items;
      for(let i =0; i< items.length;++i)
      {
        // LEAVE AS == , for cpomaring string and number
        if(items[i].mapID == mapID) return items[i];
      }
      return null;
    },
    //////////////////////////////////////////////////
    basemap: state => {
      return state.basemap;
    },
    map : state => {
      return state.map;
    },
    orientationOptions: state=> {
      return state.orientationOptions;
    },
    cart : state => {
      return state.cart;
    },
    cartItems : state => {
      return state.cart.items;
    },
    // get an item in the cart by id
    getCartMapByID : state => mapID => {
      for(var i =0 ; i < state.cart.items.length;++i)
      {
        if(state.cart.items[i].mapID == mapID) return state.cart.items[i];
      }
      return null;
    },
    nItemsInCart : state => {
      if(state.cart.items == null) return 0;
      return state.cart.items.reduce((total, cartItem) => {
        return total + cartItem.quantity
      },0);
    },
    subtotalWithDiscountPriceWithCurrency: (state,getters) => {
      let amount =  getters.subTotal;
      if(getters.hasTotalDiscounts) amount -= getters.totalDiscounts;
      return getters.getCurrencySymbol +  getters.convertToPriceString( amount);
    },
    subtotalPriceWithCurrency: (state,getters) => {
      return getters.getCurrencySymbol +  getters.convertToPriceString( getters.subTotal);
    },
    totalDiscountsPriceWithCurrency: (state,getters) => {
      return "-" + getters.getCurrencySymbol +  getters.convertToPriceString( getters.totalDiscounts);
    },
    totalPriceWithCurrency: (state,getters) => {
      return getters.getCurrencySymbol +  getters.convertToPriceString( getters.totalCost);
    },
    shippingCostWithCurrency: (state,getters) => {
      return getters.getCurrencySymbol +  getters.convertToPriceString( getters.shippingCost);
    },
    convertToPriceString:(state,getters) => number => {
      try {
        return ((Math.round(number) - number) === 0) ? number : number.toFixed(2);
      }
      catch(e)
      {
        return number;
      }
    },

    priceForMap : (state,getters) => mapData => {
      console.log("priceForMap", mapData);
      var product = state.skus.find(function (product) { return product.printSizeID === mapData.basemap.printSizeID; });
      if(product) return getters.priceForProduct(product);
      return null;
    },
    priceForProduct : (state,getters) => sku => {
        let priceRowName = "price" + getters.getCurrencyName;
        return sku[priceRowName];
    },
    priceForMapSizeWithCurrencyString : (state,getters) => printSizeID => {
      return getters.getCurrencySymbol + getters.priceForMapSize(printSizeID);
    },
    priceForMapSize : (state,getters) => printSizeID => {
      var product = state.skus.find(function (product) { return product.printSizeID === printSizeID; });
      if(product) return getters.priceForProduct(product);
      return null;
    },
    priceForCurrentMap  : (state,getters) => {
      var product = state.skus.find(function (product) { return product.printSizeID === state.basemap.printSizeID; });
      if(product) return getters.priceForProduct(product);
      return null;
    },
    priceForCurrentMapWithCurrencyString  : (state,getters) => {
      return getters.getCurrencySymbol + getters.priceForCurrentMap;
    },
    labelForCurrentPrintSize : (state, getters) => {
      return getters.labelForPrintSizeID(state.basemap.printSizeID, state.basemap.metricUnits);
    },
    labelForPrintSizeID : state => (printSizeID, metricUnits=false) => {

      if(printSizeID == null) return "";

      /*
      if(state.printSizes == null) return "";
      console.log("labelForPrintSizeID", printSizeID);
      console.log("state.printSizes", state.printSizes);

      var result = state.printSizes.find(function (obj) { return obj.printSizeID == printSizeID; });
      if(result != null) {
        console.log("result", result);


        return result.printSizeName;
      }
      */
      //return "";

      return commonGlobals.getLabelForPrintSizeID(printSizeID, metricUnits);
    },
    labelForOrientationID : state => orientationID => {
      var result = state.orientationOptions.find(function (obj) { return obj.value === orientationID; });
      if(result != null) return result.label;
      return "";
    },


    getMapThumbnailURLForMapID: state =>  mapID => {
      //return "https://map-prints.nyc3.digitaloceanspaces.com/mapsite/thumbs/" + mapID + ".jpg?refresh=" +Date.now();
      return commonGlobals.getMapThumbnailURL( mapID);
    },
    getMapPreviewMapURLForBasemapID: state =>  basemapID => {
      //return "https://map-prints.nyc3.digitaloceanspaces.com/mapsite/maps/" + basemapID  ;
      //let cartID = state.cart.cartID,
      return commonGlobals.getMapPreviewMapURL(basemapID);

    },
    isFirstVisit : (state,getters) =>{
      return state.nVisits == 1;
    },
    nVisits : state =>{
      return state.nVisits;
    },
    localStorageLoaded : state =>{
      return state.localStorageLoaded;
    }
  },
  //mutating the state
  //mutations are always synchronous
  mutations: {

    isMobileDevice: (state, isMobileDevice)=>{
      state.isMobileDevice = isMobileDevice;
      console.log("isMobileDevice", isMobileDevice);
    },
    browserID: (state, browserID)=>{
      state.browserID = browserID
      console.log("browserID", browserID);

    },
    innerHeight: (state, innerHeight)=>{
      state.innerHeight = innerHeight
    },

    loadValuesFromLocalStorage : (state)=>{

      var nVisits = localStore.getItem('nVisits');
      var currencyID = localStore.getItem('currencyID');

      if(nVisits === null) nVisits = 0;
      nVisits++;
      console.log("[loadValuesFromLocalStorage] nVisits:", nVisits , "currencyID:", currencyID);
      localStore.setItem('nVisits', nVisits);
      state.nVisits = nVisits;


      if(currencyID != null) {
        state.currencyID = currencyID;
      }

      state.localStorageLoaded = true;
    },

    setTotalAmountBreakdowns: (state, breakdownData) =>{
      state.subTotal = breakdownData.subTotal;
      state.totalDiscounts = breakdownData.totalDiscounts;
      state.shippingCost = breakdownData.shippingCost;
      state.VAT = breakdownData.VAT;
      state.totalCost = breakdownData.totalCost;
console.log("[setTotalAmountBreakdowns]totalDiscounts " , state.totalDiscounts);
      console.log("[setTotalAmountBreakdowns] subTotal" , state.subTotal);

    },

    setCurrencyID: (state, currencyID) =>{
      state.currencyID = currencyID;
      //save to local storage
      localStore.setItem('currencyID', currencyID);

     // console.log("save currencyID ", window.localStorage.getItem("currencyID"));

    },

    setThemes : (state, data) => {
      var themes = data;
      if((themes == null) || (themes.length == 0) ) return;

      state.themes = themes;
      state.themesLoaded = true;
      state.themesLoading = false;

      /*
      // change themeID to the frist one if the default id doesnt exist
      if(getters.getThemeByID(state.themeID) == null)
      {
        if(themes.length > 0) {
          state.themeID = themes[0].themeID;
        }
      }*/
      console.log("state.themesLoaded", state.themesLoaded);
      console.log("state.themesLoading", state.themesLoading);

    },
    setEditorModeToAddNew : (state) => {
      state.map.mapID = null; // zero out

    },
    /*
    setEditorModeToEditExisting : (state) => {
      state.mapEditorPage.mode = MAPEDITORPAGE_MODE_EDIT;
    },*/
    setCartData : (state, payload) => {

      if((payload != null) && ( payload != "") ) {
        state.cart = payload;
      }
      else{
        state.cart.cartID = null;
        state.cart.items = [];

      }
      state.cartLoaded = true;
    },
    setOfferData : (state, payload)=>{
      if((payload != null)) {
        state.shippingOfferID = payload.shippingOfferID;
        state.shippingOfferDescription = payload.description;
      }
    },
    setSessionDataFromServer: (state, payload) =>{
      console.log("setSessionDataFromServer", payload);
      state.skus = payload.skus;
      state.printSizes = payload.printSizes;
      state.currencies = payload.currencies;

    },
    /*
    metricUnits: (state, payload) =>{
      return state.metricUnits = payload;
    },*/
    ////////////////////
    // preview map mutations
    setPreviewMap_searchString : (state, value) => {
      return state.basemap.searchString = value;
    },
    setPreviewMap_metricUnits : (state, value) => {
      return state.basemap.metricUnits = value;
    },
    setPreviewMap_cityID : (state, value) => {
      return state.basemap.cityID = value;
    },
    setPreviewMap_skuID : (state, value) =>{
      state.map.skuID = value;
    },
    setPreviewMap_zoom : (state, value) => {
      state.basemap.zoom = value;
    },
    setPreviewMap_lng : (state, value) => {
      state.basemap.lng = value;
    },
    setPreviewMap_lat : (state, value) => {
    //  console.log("setPreviewMap_lat", state, value);
      state.basemap.lat = value;
    },
    setPreviewMap_searchCountry : (state, value) => {
      console.log("setPreviewMap_searchCountry", state, value);
      state.basemap.searchCountry = value;
    },
    setPreviewMap_searchRegion : (state, value) => {
      console.log("setPreviewMap_searchRegion", state, value);
      state.basemap.searchRegion = value;
    },
    setPreviewMap_orientationID : (state, value) => {
      state.basemap.orientationID = value;
    },
    setPreviewMap_printSizeID : (state, value) => {
      state.basemap.printSizeID = value;
    },
    setPreviewMap_themeID : (state, value) => {
      state.map.themeID = value;
    },
    setPreviewMap_variation : (state, value) => {
      state.map.variation = value;
    },
    setPreviewMap_border : (state, value) => {
      state.map.border = value;
    },
    setPreviewMap_text1 : (state, value) => {
      state.map.text1 = value;
    },
    setPreviewMap_text2: (state, value) => {
      state.map.text2 = value;
    },
    setPreviewMap_text3 : (state, value) => {
      state.map.text3 = value;
    },
    setPreviewMap_styleID : (state, value) => {
      state.map.styleID = value;
    },
    setPreviewMap_waterColour : (state, value) => {
      state.map.waterColour = value;
    },
    setPreviewMap_roadColour : (state, value) => {
      state.map.roadColour = value;
    },
    setPreviewMap_basemapID : (state, value) => {
      state.map.basemapID = value;
      // get the data from the db
    },
    setPreviewMap_mapID : (state, value) => {
      state.map.mapID = value;
    },
    // set the map data to be edited
    setEditMapData:(state, payload) =>{
      var map = payload.map;
      var dontOverrideText = payload.dontOverrideText;
      // clone all values
      state.map.themeID = map.themeID;
      state.map.border = map.border;
      state.map.variation = map.variation;
      state.map.waterColour = map.waterColour;
      state.map.roadColour = map.roadColour;
      state.map.basemapID = map.basemapID;
      state.map.mapID = map.mapID;
      state.map.skuID = map.skuID;
      state.map.quantity = map.quantity;
      if(!dontOverrideText)
      {
        state.map.text1 = map.text1;
        state.map.text2 = map.text2;
        state.map.text3 = map.text3;
      }
      state.map.styleID = map.styleID;

      console.log(">>>>>>>> setEditMapData", map.basemap);

      var basemap = map.basemap; // coming from cart so it should have basemap data
      if(basemap)
      {
        //? need to update this too ?//
        state.basemap.basemapID = basemap.basemapID;
        state.basemap.lat = basemap.lat;
        state.basemap.lng = basemap.lng;
        state.basemap.orientationID = basemap.orientationID;
        state.basemap.cityID = basemap.cityID;
        state.basemap.zoom = basemap.zoom;
        state.basemap.printSizeID = basemap.printSizeID;
        state.basemap.metricUnits = basemap.metricUnits;
        state.basemap.searchString = basemap.searchString;
      }
    },
    setBasemapData: (state,basemap) =>{
      console.log(">>>>>>>> setBasemapData", basemap);
      if(basemap) {
        state.basemap.basemapID = basemap.basemapID;
        state.basemap.lat = basemap.lat;
        state.basemap.lng = basemap.lng;
        state.basemap.orientationID = basemap.orientationID;
        state.basemap.cityID = basemap.cityID;
        state.basemap.zoom = basemap.zoom;
        state.basemap.printSizeID = basemap.printSizeID;
        state.basemap.metricUnits = basemap.metricUnits;
        state.basemap.searchString = basemap.searchString;
      }

    },
    // reset basemap vlaues for new maps
    resetBasemapAndRetainLocation : (state, payload) => {
      state.basemap.basemapID = null;
      state.map.mapID = null;
      state.map.basemapID = null;
      state.map.quantity = 1;

    },
    resetBasemapValuesToDefault : (state, payload) =>{
      state.basemap.basemapID = null;
      state.map.mapID = null;
      state.map.basemapID = null;
      state.map.quantity = 1;

      state.basemap.lat = 51.5275;
      state.basemap.lng = -0.09951;
      state.basemap.zoom = 12;
      state.basemap.printSizeID = 4;
      state.basemap.metricUnits = commonGlobals.isPrintSizeMetric(state.basemap.printSizeID);
      state.basemap.orientationID = 1;
      state.basemap.cityID = null;
      state.basemap.searchString = 'London';

      state.map.text1 = "London";
      state.map.text2 = "England";
      state.map.text3 = "";

    },
    // set the tagline field back to the default value using basemap lng and lat
    setDefaultTagLine: (state, payload) => {
      state.map.text3 = state.basemap.lat.toFixed(4) + "°N / " + state.basemap.lng.toFixed(4) + "°E";
    },
    // add a specific map  in the cart
    addCurrentMapToCart: (state, payload) => {
      console.log("addCurrentMapToCart mutation", payload);
      //var mapData = payload;
      //mapData.basemap = state.basemap;
      state.cart.items.push(payload);
    },
    // update a new map to the cart
    updateCurrentMapToCart: (state, payload) => {
      console.log("updateCurrentMapToCart mutation", payload);
      var mapData = payload;
      //mapData.basemap = state.basemap;
      //state.cart.items.push(payload);
      var maps = state.cart.items;
      for(var i =0; i < maps.length;++i) {
        if (maps[i].mapID === mapData.mapID) {
          console.log("mapID found");
          // replace any values
          for (var key in mapData) {
            // skip loop if the property is from prototype
            if (!mapData.hasOwnProperty(key)) continue;
            maps[i][key] = mapData[key];
          }
          // replace basemap values
          let basemap = mapData.basemap;
          if(basemap != null)
          {
            for (var kkey in basemap) {
              // skip loop if the property is from prototype
              if (!basemap.hasOwnProperty(kkey)) continue;
              maps[i][key].basemap = basemap[kkey];
            }
          }
          break;
        }
      }
    },
    // remove map
    removeMapFromCart: (state, payload) => {
      var mapID = payload;
      // remove item with matching mapID
      var items = state.cart.items;
      for(var i =0; i< items.length;++i)
      {
        if(items[i].mapID == mapID)
        {
          items.splice(i, 1);
          break;
        }
      }
    },
    updateQuantityForMap : (state, payload) =>{
      let map = payload.map;
      let quantity = payload.quantity;
      if(map != null)
      {
        map.quantity = quantity;
      }
    },

    setActiveJob : (state, payload) =>{
      var jobs = payload;
      console.log("store setActiveJob", jobs,  (jobs.length > 0));

      if((jobs != null) && (jobs.length > 0)) {
        var job = jobs[0];
        console.log("job.basemapID: " + job.basemapID);
        state.activeJob.status = job.status;
        state.activeJob.basemapID = job.basemapID;
        state.activeJob.queuePosition = job.queuePosition;
        state.activeJob.processPercentage = job.processPercentage;
        state.activeJob.viewed = job.viewed;
        state.activeJob.estimatedQueueDuration = job.estimatedQueueDuration;

      }
    },
    setVoucherCode : (state, voucherCode) =>{
      state.cart.voucherCode = voucherCode;
    },
    setVoucherData : (state, voucherData) =>{
      console.log("setVoucherData", voucherData);
      state.voucherData = voucherData
    },

    // save the preview map user options as they change, this gets restored on returning to this page
    /*
    setPreviewMapDataValue : (state, keyValuePairs) => {
      for (var key in keyValuePairs) {
        if (keyValuePairs.hasOwnProperty(key)) {
          state.previewMapData[key] = keyValuePairs[key];
        }
      }
    },*/
    closeSocket : (state)=>{
      if(_socket)  _socket.disconnect();
      _socket = null;
      state.socketID = null;
    }

  },
  //commits the mutation, it's asynchronous
  actions: {


    initSocket : (context, payload) =>{
      return new Promise( ( resolve, reject ) => {

        if (!_socket) {

          var loc = window.location, new_uri;
          if (loc.protocol === "https:") {
            new_uri = "wss:";
          } else {
            new_uri = "ws:";
          }
          new_uri = "https:" + "//" + loc.hostname ;
          //new_uri += loc.pathname + "/to/ws";
          //new_uri += ":3000";
          //new_uri += "/api/socket.io";

          console.log("process.env.VUE_APP_LOCAL_TESTING", process.env);

          let socketpath = "/clientsocket/socket.io";
          console.log("websocket host new: ",new_uri );
          console.log("websocket path: ", socketpath);

          //vue cli environment variables  https://cli.vuejs.org/guide/mode-and-env.html#modes
          // value is specified in .env  / .env.local files
          if(process.env.NODE_ENV == "development" ) {
          //if(process.env.VUE_APP_LOCAL_TESTING ) {
            //if(USE_TEST_SERVER) {
             // _socket = io.connect("https://makemapart.com", {path: socketpath});
            // seee vue.config.js devServer to see where this goes
            _socket = io.connect( "/", {path: socketpath});
            //}
            //else {
            //  _socket = io.connect("http://localhost:3000");
            //}
          }
          else{
            _socket = io.connect(new_uri, {path: socketpath});
          }
          //_socket = io.connect(commonGlobals.MAP_SERVER_URL);

          _socket.on("connect", function () {
            console.log("store - connected to socket");
            _socket.emit("handshake", { accesstoken : null, socketClientTypeID: "website" });

          });
          _socket.on("connectionSuccess", function (data) {
            console.log("on connectionSuccess", data);
            context.state.socketID = data.socketID;

            console.log("on connectionSuccess _socket" , _socket);
            console.log("new socketid" , context.state.socketID);

            resolve(_socket);
          });

          _socket.on("connect_failed", function () {
            console.log("store - failed connecting to socket");
          });


          _socket.on("queueUpdate", function (data) {
            console.log("queueUpdate", data);

            // todo reduce the count by one
            let jobID = data.jobID;
            let nWorkers = data.nWorkers;
            let averageProcessDuration = data.averageProcessDuration;
            //console.log("averageProcessDuration",averageProcessDuration);

            context.state.activeJob.queuePosition = Math.max(0,context.state.activeJob.queuePosition-1);
            context.state.activeJob.estimatedQueueDuration = context.state.activeJob.queuePosition * averageProcessDuration;

            console.log("context.state.activeJob.queuePosition", context.state.activeJob.queuePosition);
            console.log("context.state.activeJob.estimatedQueueDuration", context.state.activeJob.estimatedQueueDuration);

            if(context.state.activeJob.queuePosition != 0) {
              bus.$emit("processingProgress", {
                "queuePosition": context.state.activeJob.queuePosition,
                "progressData": {
                  "progress" : 0,
                  "nextProgress": 0
                }
              });
            }


            //let queuePosition = data.queuePosition;


            /*
            let queuePosition = data.queuePosition;
            context.state.activeJob.queuePosition = queuePosition;
            context.state.activeJob.estimatedQueueDuration = data.estimatedQueueDuration;

            if (queuePosition === 0) {
              context.state.activeJob.status = commonGlobals.PREVIEWMAP_JOB_STATUS_PROCESSING;
            }
            else {
              context.state.activeJob.status = commonGlobals.PREVIEWMAP_JOB_STATUS_QUEUED;
            }*/
          });
          _socket.on("errorEvent", function (data) {
            console.log("socket - received error message");

            context.state.activeJob.status = commonGlobals.PREVIEWMAP_JOB_STATUS_NONE;
            //todo - emit message on bus to be picked up
            bus.$emit("processingProgressError");

          });

          _socket.on("progress", function (data) {

            console.log("progress", data);

            var progressData = data.progressData;
            context.state.activeJob.queuePosition = 0;
            context.state.activeJob.processPercentage = progressData.progress;
            context.state.activeJob.processPercentageNext = progressData.progressNext;

            context.state.activeJob.status = commonGlobals.PREVIEWMAP_JOB_STATUS_PROCESSING;
            bus.$emit("processingProgress", data);


            /*
            if (progress < 100) {
            }
            else {
              //  context.state.activeJob.status = commonGlobals.PREVIEWMAP_JOB_STATUS_COMPLETE;
              // job complete
              //bus.$emit('jobComplete', data.basemapID);

            }*/

          });
          _socket.on("complete", function (data) {
            console.log("_socket.on(\"complete\"" , data);

            if(data.queuePosition == 0) {
              console.log("job for this client is complete - closing socket");
              _socket.disconnect();
              _socket = null;
              context.state.socketID = null;
              context.state.activeJob.status = commonGlobals.PREVIEWMAP_JOB_STATUS_COMPLETE;
              //context.state.activeJob.basemapID = data.basemapID;
              //todo - dispatch processing complete
              context.state.jobID = null;
              bus.$emit("processingCompleted", {});
            }



            //context.state.activeJob.basemapID = data.basemapID;
            // todo - open processing dialog if it is closed - this shows the message that its readt
            // todo - if it is open then automatically go to the page?
          });

        }
        else {
          resolve(_socket);
        }
      });
    },

    emitSocketMessage :(context, payload) =>
    {
      let eventID  = payload.eventID;
      let eventData  = payload.data;

      if(_socket)
      {
        _socket.emit(eventID, eventData); // request status events for the basemapID
      }
    },


    retrieveOrder: (context, payload) =>{
      return new Promise((resolve, reject) => {
        axios.post(apiURL + '/order', payload)
          .then(function (response) {
            console.log("/retrieveOrder response: " ,response.data);
            var data = response.data;
            resolve(data);

          })
          .catch(function (error) {
            console.log(error);
            reject(error);
          });
      });
    },

    // get the cart information from the server
    retrieveJobsWithCartID : context =>{

      context.state.activeJobLoaded = false;
      var data = {};
      return new Promise((resolve, reject) => {
        axios.post(apiURL + '/getJobsWithCartID', data)
          .then(function (response) {
            console.log("/getJobsWithCartID response: " ,response.data);
            var data = response.data;
            var jobs=  data.jobs;
            // save it
            context.state.activeJobLoaded = true;
            context.commit("setActiveJob",jobs);
            resolve(jobs);
          })
          .catch(function (error) {
            console.log(error);
            context.state.activeJobLoaded = true;

            reject();
          });
      });
    },

    refreshTotalAmountBreakdown: (context, payload) =>{
      console.log("refreshTotalAmountBreakdown");
      let cartID = context.state.cart.cartID;
      console.log("refreshTotalAmountBreakdown cartID ", cartID);

      if(cartID == null) {
        return Promise.resolve(null);
      }

      let data ={
        shippingAddress: context.state.checkout.shippingAddress,
        cartID: context.state.cart.cartID,
        shippingRateID: context.state.checkout.shippingRateID,
        currencyID: context.getters.getCurrencyID
      };
      return new Promise((resolve, reject) => {
        axios.post(apiURL + '/totalCostBreakdown', data)
          .then(function (response) {
            console.log("/totalCostBreakdown response: " ,response.data);
            let data = response.data;
            context.commit("setTotalAmountBreakdowns",data);
            resolve(data);
          })
          .catch(function (error) {
            console.log(error);
            // todo send reject error type in the return.
            // todo this may be due to pricing changes, if so notify the user
            reject();
          });
      });
    },

    submitOrder: (context, payload) =>{
      //let token = payload;
      // submit along with checkout details
      // todo - add total price here so it can be validated
      let data ={
       // paymentTypeID :
        totalCost: context.getters.totalCost,
        shippingAddress: context.state.checkout.shippingAddress,
        billingAddress: (context.state.checkout.billingAddressSameAsShippingAddress) ? context.state.checkout.shippingAddress : context.state.checkout.billingAddress,
        cartID: context.state.cart.cartID,
        shippingRateID: context.state.checkout.shippingRateID,
        paymentTypeID: (payload != null) ? payload.paymentTypeID : null,
        token: (payload != null) ? payload.token : null,
        deviceData:  (payload != null) ? payload.deviceData : null, // devicedata for braintree payments
        paymentServiceTypeID: (payload != null) ? payload.paymentServiceTypeID : null,
        currencyID: context.getters.getCurrencyID
      };
      return new Promise((resolve, reject) => {
        axios.post(apiURL + '/submitOrder', data)
          .then(function (response) {
            console.log("/submitOrder response: " ,response.data);
            var data = response.data;
            // assume all themes are loaded together for now
            resolve(data);
          })
          .catch(function (error) {
            console.log(error);
            // todo send reject error type in the return.
            // todo this may be due to pricing changes, if so notify the user
            reject();
          });
      });

    },

    retrieveBasemapFromServer: (context, basemapID) => {
      console.log("retrieveBasemapFromServer", basemapID);
      //if(context.state.citiesLoaded || context.state.citiesLoading) return;
      // context.state.citiesLoading = true;
      var data = {
        basemapID: basemapID
      };
      return new Promise((resolve, reject) => {
        axios.post(apiURL + '/getBasemap', data)
          .then(function (response) {
            console.log("/getBasemap response: " ,response.data);
            var data = response.data;
            var basemap = data;
            // assume all themes are loaded together for now
            resolve(basemap);
          })
          .catch(function (error) {
            console.log(error);
            reject();
          });
      });
    },

    retrieveBasemapsForCityFromServer: (context, payload) => {
      var cityID = payload;
      console.log("retrieveBasemapsForCityFromServer");
      //if(context.state.citiesLoaded || context.state.citiesLoading) return;
     // context.state.citiesLoading = true;
      var data = {
        cityID: cityID
      };
      return new Promise((resolve, reject) => {
        axios.post(apiURL + '/getBasemapsForCity', data)
          .then(function (response) {
            console.log("/getBasemapsForCity response: " ,response.data);
            var data = response.data;
            var basemaps = data;
            // assume all themes are loaded together for now
            resolve(basemaps);
          })
          .catch(function (error) {
            console.log(error);
            reject();
          });
      });
    },


    retrieveThemesFromServer : context => {
      console.log("retrieveThemesFromServer");
      console.log("context.state.themesLoaded", context.state.themesLoaded);
      console.log("context.state.themesLoading", context.state.themesLoading);

      if(context.state.themesLoaded || context.state.themesLoading) return;
      context.state.themesLoading = true;
      var data = {};
      return new Promise((resolve, reject) => {
        axios.post(apiURL + '/themes', data)
          .then(function (response) {
            console.log("/themes response: " ,response.data);
            var data = response.data;
            var themes = data.themes;
            console.log("here: " ,themes);
            // assume all themes are loaded together for now
            context.commit("setThemes",themes);

            // change themeID to the frist one if the default id doesnt exist
            console.log("-------- themeID", context.state.themeID);

            if(context.getters.currentTheme== null)
            {
              if(themes.length > 0) {
                var defaultThemeID = themes[0].themeID;
                context.commit("setPreviewMap_themeID",defaultThemeID);
              }
            }

            resolve(data);
          })
          .catch(function (error) {
            console.log(error);
            reject();
          });
      });
    },


    // get a example preset map from the server
    retrieveMapFromServer : (context,payload) =>{
      var mapID = payload;
      var bodydata = {
        mapID: mapID
      };
      console.log("[retrieveMapFromServer]");
      return new Promise((resolve, reject) => {
        axios.post(apiURL + '/map', bodydata)
          .then(function (response) {
            console.log("/map response: " ,response.data);
            //var data = response.data;
            //context.commit("setCartData",data);
            resolve(response.data);
          })
          .catch(function (error) {
            console.log(error);
            reject();
          });
      });
    },

    // get a example preset map from the server
    retrievePublicMapFromServer : (context,payload) =>{
      var publicUrlID = payload;
      var bodydata = {
        publicUrlID: publicUrlID
      };
      console.log("[retrievePublicMapFromServer]");
      return new Promise((resolve, reject) => {
        axios.post(apiURL + '/publicMap', bodydata)
          .then(function (response) {
            console.log("/publicMap response: " ,response.data);
            //var data = response.data;
            //context.commit("setCartData",data);
            resolve(response.data);
          })
          .catch(function (error) {
            console.log(error);
            reject();
          });
      });
    },

    applyVoucherToCart : ({commit, state , getters, dispatch}, voucherCode) =>{
      return new Promise((resolve, reject) => {
        let data ={
          voucherCode: voucherCode
        };
        axios.post(apiURL + '/applyVoucherToCart', data)
          .then( async (response) =>{
            console.log("/applyVoucherToCart response: " ,response.data);
            var data = response.data;
            commit("setVoucherCode",voucherCode);
            commit("setVoucherData",data);
            await dispatch('refreshTotalAmountBreakdown');
            resolve(data);
          })
          .catch(function (error) {
            console.log(error);
            reject();
          });
      });
    },

    removeVoucherFromCart : ({commit, state , getters, dispatch}, voucherCode) =>{

      commit("setVoucherCode",null);
      commit("setVoucherData",null);

      return new Promise((resolve, reject) => {
        axios.post(apiURL + '/removeVoucherFromCart', {})
          .then(async (response) =>{
            console.log("/removeVoucherFromCart response: " ,response.data);
            var data = response.data;
            await dispatch('refreshTotalAmountBreakdown');
            resolve(data);
          })
          .catch(function (error) {
            console.log(error);
            reject();
          });
      });
    },

    // get the cart information from the server
    retrieveCartFromServer : ({commit, state , getters, dispatch}, payload) =>{

      state.cartLoaded = false;
      state.cart.items = [];
      var data = {};
      return new Promise((resolve, reject) => {
        axios.post(apiURL + '/cart', data)
          .then( async (response) => {
            console.log("/cart response: " ,response.data);
            var data = response.data;
            if(data != null) {
              commit("setCartData", data.cartData);
              if (data.voucherData) commit("setVoucherData", data.voucherData);
              await dispatch('refreshTotalAmountBreakdown');
              resolve(data.cartData);
            }
            else{
              commit("setCartData", null);
              resolve(null);
            }
          })
          .catch(function (error) {
            console.log(error);
            reject();
          });
      });
    },

    // create a basemap preview of the current basemap state
    createBasemapPreview: context => {

      console.log("createBasemapPreview");

      var basemap = context.getters.basemap;
      var basemapData = ({
        // todo add mapID here, if null then its a new basemap, if not then its part of an existing map,
        mapID: context.getters.map.mapID,
        lng: basemap.lng,
        lat: basemap.lat,
        zoom: basemap.zoom,
        metricUnits: basemap.metricUnits,
        printSizeID: basemap.printSizeID,
        orientationID: basemap.orientationID,
        searchString : basemap.searchString,   // used to populate the search field
        searchCountry: basemap.searchCountry,
        searchRegion: basemap.searchRegion

        /*
        width: _mapWidth,
        height: _mapHeight,
        isRetina: true*/
      });
      var bodyData = {
        basemapData: basemapData,
        socketID: context.getters.getSocketID
      };
      console.log(">>>> createBasemapPreview socketID",bodyData.socketID, "basemap", basemapData);

      return new Promise((resolve, reject) => {
        axios.post(apiURL + '/preview', bodyData)
          .then(function (response) {
            console.log("/preview response: " , response.data);
            var data = response.data;

            let basemapExistsAlready = data.exists;
            if(basemapExistsAlready){
              resolve(data);
              return;
            }
            else {
              //

              var jobID = data.jobID;

              context.state.jobID = jobID;
              console.log("/preview jobID: ", jobID);

                console.log("/preview context.state.cart", context.state.cart);

                var cartID = data.cartID;
                // set cartID as it may be null
                if (context.state.cart.cartID == null) {
                  context.state.cart.cartID = cartID;
                }
                console.log("/preview context.state.cart", context.state.cart);

                //context.commit("addCurrentMapToCart",data);
                resolve(data);
            }
          })
          .catch(function (error) {
            // reset status
            context.state.activeJob.status = commonGlobals.PREVIEWMAP_JOB_STATUS_NONE;
            console.log(error);
            reject(error);
          });
      });
    },
    // cancel the preview job if theres one running
    cancelPreview: (context) => {

      return new Promise((resolve, reject) => {

        context.state.activeJob.status = commonGlobals.PREVIEWMAP_JOB_STATUS_NONE;
        if(context.state.jobID == null) resolve();
        console.log("/cancelPreview context.state.jobID", context.state.jobID);

        //context.commit('closeSocket');

        axios.post(apiURL + '/cancelPreview', {"jobID": context.state.jobID} )
          .then(function (response) {
            context.state.jobID = null;
            console.log("/cancelPreview returned.");
            // todo - update state?
            resolve();
          })
          .catch(function (error) {
            console.log(error);
            reject();
          });
      });
    },
    updateQuantities: ({commit, state , getters, dispatch}, payload) => {
      var quantities = payload;
      console.log("updateQuantities:", quantities);
      return new Promise((resolve, reject) => {
        var body = {
          quantities: quantities
        };
        axios.post(apiURL + '/updatequantities', body)
          .then(async (response) => {
            console.log("/updatequantities response: "  , response.data);
            var items = response.data;
            for(var i =0; i < items.length;++i) {
              var map = items[i];

              commit("updateQuantityForMap", {map: getters.getCartMapByID(map.mapID), quantity: map.quantity});
            }

            await dispatch('refreshTotalAmountBreakdown');

            resolve(items);
          })
          .catch(function (error) {
            console.log(error);
            reject();
          });
        /*
         setTimeout(function () {
         context.commit("addCurrentMapToCart");
         resolve();
         }, 2000);*/
      });
    },
    removeMapFromCart: ({commit, state , getters, dispatch}, payload) => {
      var mapID = payload;
      console.log("removeMapFromCart mapID:", mapID);
      return new Promise((resolve, reject) => {
        var body = {
          mapID: mapID
        };
        axios.post(apiURL + '/remove', body)
          .then( async (response) => {
            console.log("/remove response: "  , response.data);
            var data = response.data;
            var mapID = data.mapID;
            commit("removeMapFromCart",mapID);
            await dispatch('refreshTotalAmountBreakdown');
            resolve(data);

            console.log("mapRemovedFromCart");
            // do a call incase its the currentl open map on the editor if so reset it
            bus.$emit("mapRemovedFromCart", {
              mapID: mapID
            });
          })
          .catch(function (error) {
            console.log(error);
            reject();
          });
        /*
         setTimeout(function () {
         context.commit("addCurrentMapToCart");
         resolve();
         }, 2000);*/
      });
    },

    // update the edited map
    updateCurrentMapToCart: (context, payload) =>{
      var thumbnailCanvas = payload.thumbnailCanvas ;
      var basemap = payload.basemap;

      var mapData = context.getters.map;
      if(basemap)
      {
        mapData.basemap = basemap;
      }

      console.log(mapData);

      return new Promise((resolve, reject) => {

        thumbnailCanvas.toBlob((blob) => {
          let data = new FormData();
          data.append('image', blob, "thumb.jpg");
          data.append('map', JSON.stringify(mapData));
          axios
            .post(apiURL + '/update', data, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then(res => {
              var mapData = res.data;
              console.log(mapData);

              context.commit("updateCurrentMapToCart", mapData);
              resolve(mapData);

              // reload all cart?
             // context.dispatch("retrieveCartFromServer");

            })
        .catch((error)=>{
          console.log(error);
            reject();
          });
        }, 'image/jpeg');
      });

      /*
      var body = {map : mapData};
      return new Promise((resolve, reject) => {
        axios.post(apiURL + '/update', body)
          .then(function (response) {
            console.log("/update response: "  , response.data);
            setTimeout(() => {
              var data = response.data;
              context.commit("updateCurrentMapToCart",data);
              resolve(data);
            }, 500); //add a timeout to test
          })
          .catch(function (error) {
            console.log(error);
            reject();
          });

      });*/
    },
    // add the current map to as a new item in the cart
    addCurrentMapToCart: ({commit, state , getters, dispatch},payload) => {

      var thumbnailCanvas = payload.thumbnailCanvas ;
      var mapData = getters.map;
      console.log(mapData);

      return new Promise((resolve, reject) => {

        thumbnailCanvas.toBlob((blob) => {
          let data = new FormData();
          data.append('image', blob, "thumb.jpg");
          data.append('map', JSON.stringify(mapData));
          axios
            .post(apiURL + '/add', data, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then( async res =>  {
              console.log("return obj", res.data);
              let data = res.data;
              let mapItem = data.item ;
              let cartID = data.cartID;
              commit("addCurrentMapToCart", mapItem);
              // this may be the first map added, if there is no cart then a new one will be create, so save the cartID
              if(state.cart.cartID == null){
                state.cart.cartID = cartID;
              }
              await dispatch('refreshTotalAmountBreakdown'); // refreshh totals
              resolve(mapItem);
            }).catch((error)=>{
              console.log(error);
              reject();
            });
        }, 'image/jpeg');

      });


      /*
      var mapData = context.getters.map;
      console.log(mapData);
      return new Promise((resolve, reject) => {
        axios.post(apiURL + '/add', mapData)
          .then(function (response) {
            console.log("/add response: "  , response.data);
            setTimeout(() => {
              var data = response.data;
              context.commit("addCurrentMapToCart",data);
              resolve(data);
            }, 500); //add a timeout to test
          })
          .catch(function (error) {
            console.log(error);
            reject();
          });

      });*/
    },

    // add the current map to as a new item in the cart
    uploadMockup: (context,payload) => {
      var mockupCanvas = payload.mockupCanvas ;
      var cartID = payload.cartID ; //context.getters.map;
      var mapID = payload.mapID ; //context.getters.map;

      return new Promise((resolve, reject) => {

        mockupCanvas.toBlob((blob) => {
          let data = new FormData();
          data.append('image', blob, "mockup.png");
          data.append('mapID', mapID);
          data.append('cartID', cartID);

          axios
            .post(apiURL + '/mockup', data, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then(res => {
              console.log("return obj", res.data);
             // var  = res.data;
             // context.commit("addCurrentMapToCart", fullmapData);
              resolve(res.data); // {url}
            }).catch((error)=>{
            reject();
          });
        }, 'image/jpeg', 0.95);

      });

    },

    retrieveSessionData : (context,payload) => {
      context.state.skusAndPrintSizesLoaded = false;
      return new Promise((resolve, reject) => {
        axios.post(apiURL + '/retrieveSessionData', {})
          .then(function (response) {
            console.log("/retrieveSessionData response: ", response.data);
            console.log("retrieveSessionData", response.data);
            context.state.skusAndPrintSizesLoaded = true;
            context.state.currenciesLoaded = true;
            context.commit("setSessionDataFromServer", response.data);

            context.commit("setOfferData",response.data.shippingOffer);

            // set currencyID if one exists from the server
            if(response.data.currencyID !=null){
              context.commit("setCurrencyID", response.data.currencyID);
            }

            // check if the default currency is valid, if not set it to the first currency in the list
            if(context.getters.getCurrencyById(context.state.currencyID) == null){
              let currenciesLength = context.state.currencies.length;
              if(currenciesLength > 0) {
                context.state.currencyID = context.state.currencies[0].currencyID;
              }
            }

            resolve(response.data);
          })
          .catch(function (error) {
            console.log(error);
            reject();
          });
      });
    }
    ,
    retrieveShippingRates : ({ dispatch, commit, getters, rootGetters }) => {
      return dispatch('retrieveShippingRatesWithCartID', rootGetters.cartID);
    },
    // get the shipping rates for the order
    retrieveShippingRatesWithCartID: (context, payload) => {
      context.state.checkout.shippingRatesRequireUpdating = false; //
      context.state.checkout.shippingRatesLoading = true;
      context.state.checkout.shippingRateID = null;
      context.state.checkout.shippingRates = [];

      var body = {
        address: context.state.checkout.shippingAddress,
        voucherCode: (context.state.voucherData != null) ? context.state.voucherData.voucherCode : null,
        cartID:payload
      };
      console.log(body);
      return new Promise((resolve, reject) => {
        axios.post(apiURL + '/shippingRates', body)
          .then(function (response) {
            console.log("/shippingRates response: "  , response.data);
            context.state.checkout.shippingRatesLoading = false;
            var data = response.data;
            context.commit("updateShippingRates",data);
            resolve(data);
          })
          .catch(function (error) {
            context.state.checkout.shippingRatesLoading = false;
            context.state.checkout.shippingRatesRequireUpdating = true; //
            console.error(error.message);
            reject();
          });
        /*
        setTimeout(function () {
          context.commit("addCurrentMapToCart");
          resolve();
        }, 2000);*/
      });
    },

    // save the email temporarily to the db and notify once complete
    saveBasemapNotifyEmail : (context,payload) => {
      let basemapID = payload.basemapID;
      let email = payload.email;
      return new Promise((resolve, reject) => {
        axios.post(apiURL + '/setBasemapNotifyEmail', {
          basemapID: basemapID,
          email: email
        })
          .then(function (response) {
            console.log("/setBasemapNotifyEmail response: ", response.data);
            resolve(response.data);
          })
          .catch(function (error) {
            console.log(error);
            reject();
          });
      });
    }

  }
});

function roundToNearestCurrencyValue(val){
  return RoundToDecimal(val ,2);
}

function RoundToDecimal(number,decimal) {
  var zeros = new String( 1.0.toFixed(decimal) );
  zeros = zeros.substr(2);
  var mul_div = parseInt( "1"+zeros );
  var increment = parseFloat( "."+zeros+"01" );
  if( ( (number * (mul_div * 10)) % 10) >= 5 )
  { number += increment; }
  return Math.round(number * mul_div) / mul_div;
}
