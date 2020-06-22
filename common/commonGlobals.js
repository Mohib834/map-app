/* eslint no-use-before-define: 0 */  // --> OFF
/* eslint-disable */

//var API_IP = 'https://makemapart.com'; //  testing from another machine, e.g  on mobile
//var API_IP = 'http://localhost:3000'; // local testing
var API_IP = "";
module.exports = {

  // should match db
  PAYMENT_TYPE_ID_CREDIT_CARD: 0,
  PAYMENT_TYPE_ID_PAYPAL: 1,

  // should match db
  CURRENCY_ID_USD: 1,
  CURRENCY_ID_EUR: 2,
  CURRENCY_ID_GBP: 3,

  getCurrencySymbol: function (currencyID) {
    const map = {1: '$', 2: '€', 3: '£'};
    return map[currencyID];
  },

  PRODUCT_TYPE_ID_POSTER: 1,

  COMPANY_NAME: "makemapart",
  SUPPORT_EMAIL: "support@makemapart.com",
  CONTACT_EMAIL: "hello@makemapart.com",

  // anything public facing
  SHIPPING_RATE_ID_BUDGET: 1,
  SHIPPING_RATE_ID_STANDARD: 2,
  SHIPPING_RATE_ID_EXPRESS: 3,


  SHIPPING_OFFER_ID_NONE: 0,
  SHIPPING_OFFER_ID_US_STANDARD_ONLY: 1,
  SHIPPING_OFFER_ID_WORLDWIDE_STANDARD: 2,

  PREVIEWMAP_JOB_STATUS_NONE: null,
  PREVIEWMAP_JOB_STATUS_WAITING_FOR_RESPONSE: 5,
  PREVIEWMAP_JOB_STATUS_QUEUED: 0,
  PREVIEWMAP_JOB_STATUS_PROCESSING: 1,
  PREVIEWMAP_JOB_STATUS_COMPLETE: 2,
  PREVIEWMAP_JOB_STATUS_ERROR: 10,

  //this.WEBSITE_URL = "https://minicloudstudio.com/map-app"; //live db/php
  //this.WEBSITE_URL = "http://localhost"; //test local db/php
  //API_URL: '/api',
  // MAP_SERVER_URL: API_IP + "",
  STORAGE_FOLDER_BASE_CART: "cart",
  STORAGE_FOLDER_BASE_ORDERS: "order",
  STORAGE_FOLDER_THUMBNAILS: "thumbs",
  STORAGE_FOLDER_PREVIEWS: "previews",
  STORAGE_FOLDER_BASEMAPS: "basemap",
  STORAGE_FOLDER_MOCKUPS: "mockups",
  STORAGE_BASE_URL: "https://mapartdata.s3.amazonaws.com", //"https://map-prints.nyc3.digitaloceanspaces.com", //static assets
  // PREVIEW_IDMAP_FILENAME: "preview_full.png",
  //PREVIEW_ROADMAP_FILENAME: "preview_line.png",

  /**
   * @return {string}
   */

  getMapPreviewMapURL: function (basemapID) {
    return this.STORAGE_BASE_URL + "/" + this.getMapPreviewMapStorageLocation( basemapID);
  },

  getMapThumbnailURL: function ( mapID) {
    return this.STORAGE_BASE_URL + "/" + this.getMapThumbnailStorageLocation( mapID) + "?refresh=" + Date.now();
  },

  getMapMockupURL: function ( mapID) {
    return this.STORAGE_BASE_URL + "/" + this.getMapMockupStorageLocation( mapID);
  },

  getMapPreviewMapStorageLocation: function (basemapID) {
    return this.STORAGE_FOLDER_BASEMAPS + "/" + basemapID + ".png";
    //return "https://map-prints.nyc3.digitaloceanspaces.com/mapsite/maps/" + basemapID  ;
  },

  getMapThumbnailStorageLocation: function ( mapID) {
    //return this.STORAGE_FOLDER_BASE_CART + "/" + cartID + "/" + this.STORAGE_FOLDER_THUMBNAILS + "/" + mapID + ".jpg";
    return  this.STORAGE_FOLDER_THUMBNAILS + "/" + mapID + ".jpg";
  },

  getMapMockupStorageLocation: function (mapID) {
    //return this.STORAGE_FOLDER_BASE_CART + "/" + cartID + "/" + this.STORAGE_FOLDER_MOCKUPS + "/" + mapID + ".jpg";
    return this.STORAGE_FOLDER_MOCKUPS + "/" + mapID + ".jpg";
  },

  getCartFolder: function (cartID) {
    return this.STORAGE_FOLDER_BASE_CART + "/" + cartID + "/";
  },

  /*
  getBasemapURL: function(basemapID)
  {
    return this.STORAGE_BASE_URL  + "/" + this.STORAGE_FOLDER_BASE + "/" + this.STORAGE_FOLDER_MAPS + "/" + basemapID;
  },

  getIdMapURL: function(basemapID)
  {
      return this.getBasemapURL(basemapID) + "/" + this.PREVIEW_IDMAP_FILENAME;
  },

  getRoadmapURL: function(basemapID)
  {
      return this.getBasemapURL(basemapID) + "/" + this.PREVIEW_ROADMAP_FILENAME;
  },
  */

  PRINT_DPI_TARGET: 300,
  BORDER_SIZE_IN_INCHES: 0.8,
  PICTURE_FRAME_OVERLAP_GAP: 0.25, // common US frame overlap is 1/4in.  UK is 5mm which is simliar

  STYLE_ID_NONE: 0,
  STYLE_ID_BAR: 1,
  STYLE_ID_FLOAT: 2,
  STYLE_ID_FADE: 3,

  //
  // todo - should match the printsizeID in the sku table  and print size table- should get from sql?
  PAPERSIZE_12x18: 1,
  PAPERSIZE_16x20: 2,
  PAPERSIZE_20x20: 3,
  PAPERSIZE_18x24: 4,
  PAPERSIZE_24x36: 5,
  PAPERSIZE_20x28: 6,

  METRIC_PRINTSIZES: [this.PAPERSIZE_20x20,this.PAPERSIZE_20x28,this.PAPERSIZE_24x36],
  IMPERIAL_PRINTSIZES: [this.PAPERSIZE_20x20,this.PAPERSIZE_18x24,this.PAPERSIZE_24x36],


  // should match the values in the table
  ORIENTATION_ID_PORTRAIT: 1,
  ORIENTATION_ID_LANDSCAPE: 2,

  /*
    // should match the values in customer_order_status table
    ORDERSTATUSID_PENDING: 0,
    ORDERSTATUSID_SENT_TO_FUFILMENT: 1,
    ORDERSTATUSID_SENT_FOR_DELIVERY: 2,
    ORDERSTATUSID_SENT_DELIVERY_ERROR: 3,
*/
  BORDER_RATIO: 0.025,

  // style 1 params : bar style
  style1Params: {
    cardSideMarginWhenNoBorder: 0.6,
    cardBottomMarginWhenNoBorder: 0.5,  // bottom spacing when theres no border, when theres a border then use this border gap as the spacing so it looks even
    textMarginBottomTextLeft: 0.15, // optional text offset on the left
    textMarginBottomTextRight: 0.1, // optional text offset on the right
    text3H: 0.45, // text height that pushes the text2 field up. change this to adjust the gap between them
    text1FontSize: 0.81,
    text2FontSize: 0.35,
    text3FontSize: 0.35,
    cardHeightInInches: 1.1, //change this to adjust the top padding
    uppercase: false,
    text1FontWeight: 'light',
    text2FontWeight: 'light',
    text3FontWeight: 'light'
  },

  // style 2 params, centered floating cart from the bottom
  // coords are in preview space, todo change to print scale?
  style2Params: {
    cardBottomMargin: 1,  // doesnt include border
    textMarginBottomTop: 0.6,
    textMarginLeftRight: 0.3,
    text1H: 0.55,
    text2H: 0.7,
    text3H: 0.7 ,
    text1FontSize: 0.8,
    text2FontSize: 0.5,
    text3FontSize: 0.5,
    uppercase: false,
    text1FontWeight: 'light',
    text2FontWeight: 'light',
    text3FontWeight: 'light'
  },

  // style 2 params: fade
  style3Params: {
    cardBottomMargin: 0.75,
    cardTopMargin: 2.25,
    textMarginBottomTop: 0.0,
    textMarginLeftRight: 0.8,
    text1H: 0.8,
    text2H: 0.6,
    text3H: 0.8,
    text1FontSize: 0.8,
    text2FontSize: 0.5,
    text3FontSize: 0.5,
    uppercase: false,
    text1FontWeight: 'light',
    text2FontWeight: 'light',
    text3FontWeight: 'light'
  },

  // get pixels per inch
  getPPI: function (width,printSizeID, orientationID) {
    var size = this.getPrintMapSizeInInches(printSizeID, orientationID);
    return width/size.width;
  },

  getStyleBaseRatio: function (printSizeID, orientationID) {

    var size = this.getPrintMapSizeInInches(printSizeID, orientationID);
    // todo try the average of the width and height
    var targetWidth = (size.width  + size.height) / 2;
    // todo try the minimum of the width and height
    //var targetWidth = Math.min (size.width, size.height );

    //var extraScale = 1;
    // todo adjust this to rescale properly to the target Width...?
    // todo test without first..
    var extraScale = 1; //  targetWidth / size.width;
    var GLOBAL_SCALE_ADJUST = 0.8;
    extraScale *= GLOBAL_SCALE_ADJUST;

    if (printSizeID === this.PAPERSIZE_18x24) {
      return 1 * extraScale;
    }
    else if (printSizeID === this.PAPERSIZE_24x36) {
      return 1.3 * extraScale;
    }
    else if (printSizeID === this.PAPERSIZE_20x20) {
      return 0.9 * extraScale;
    }
    else if (printSizeID === this.PAPERSIZE_12x18) {
      return 0.65 * extraScale;
    }
    else if (printSizeID === this.PAPERSIZE_20x28) {
      return 1.1 * extraScale;
    }
    return 1 * extraScale;
  },

  getPreviewStyleBound: function (model) {
    let w = 20, h;

    console.log("this.printSizeID", model.printSizeID);
    console.log("this.orientationID", model.orientationID);
    h = 716;

    if (model.printSizeID == this.PAPERSIZE_20x28) {
      w = 514 - 2;
    }
    else if (model.printSizeID == this.PAPERSIZE_18x24) {
      w = 540 - 2;
    }
    else if (model.printSizeID == this.PAPERSIZE_24x36) {
      w = 480 - 2;

    }
    else if (model.printSizeID == this.PAPERSIZE_20x20) {
      w = 720;
    }


    if (model.orientationID == this.ORIENTATION_ID_LANDSCAPE) {
      let temp = h;
      h = w;
      w = temp;
    }
    return {x: 0, y: 0, w: w, h: h}
  },

// calcualte the paper size given the printSizeID and orientationID
  getPreviewMapSize: function (printSizeID, orientationID) {
    console.log("getPreviewMapSize");
    var w, h;
    var ratio;
    if (printSizeID === this.PAPERSIZE_18x24) {
      //24x18
      h = 1324;  // 1200?
      ratio = 24 / 18;
    }
    else if (printSizeID === this.PAPERSIZE_24x36) {
      h = 2008;  // 1800?
      ratio = 36 / 24;
    }
    else if (printSizeID === this.PAPERSIZE_16x20) {
      h = 1024;  // 1000?
      ratio = 20 / 16;
    }
    else if (printSizeID === this.PAPERSIZE_12x18) {
      h = 768;  // 900?
      ratio = 18 / 12;
    }
    else if (printSizeID === this.PAPERSIZE_20x28) {
      h = 1560;  // 900?
      ratio = 28 / 20;
    }
    else {  // PAPERSIZE 20x20
      h = 1024;  // 900?
      ratio = 20 / 20;
    }
    w = h / ratio;
    if (orientationID == 2) {
      var temp = h;
      h = w;
      w = temp;
    }
    return {width: Math.floor(w), height: Math.floor(h)};
  },

  getPrintMapSizeInInches: function (printSizeID, orientationID = 1) {
    console.log("printSizeID", printSizeID, "PAPERSIZE_20x20", this.PAPERSIZE_20x20);

    if (printSizeID === this.PAPERSIZE_18x24) {
      wInches = 18;
      hInches = 24;
    }
    else if (printSizeID === this.PAPERSIZE_24x36) {
      wInches = 24;
      hInches = 36;
    }
    else if (printSizeID === this.PAPERSIZE_16x20) {
      wInches = 16;
      hInches = 20;
    }
    else if (printSizeID === this.PAPERSIZE_12x18) {
      wInches = 12;
      hInches = 18;
    }
    else if (printSizeID === this.PAPERSIZE_20x28) {
      wInches = 20;
      hInches = 28;
    }
    else {  // PAPERSIZE 20x20
      wInches = 20;
      hInches = 20;

    }
    if (orientationID == 2) {
      var temp = wInches;
      wInches = hInches;
      hInches = temp;
    }
    return {width: wInches, height: hInches};

  },
  getPrintMapSize: function (printSizeID, orientationID, dpi = 300) {
    var size = this.getPrintMapSizeInInches(printSizeID, orientationID);
    size.width *= dpi;
    size.height *= dpi;
    return size;
  },


  isPrintSizeMetric,
  isPrintSizeImperial,
  getMetricLabelForPrintSizeID,
  getImperialLabelForPrintSizeID,
  getLabelForPrintSizeID

};


function isPrintSizeMetric(printSizeID)
{
  for(var i =0; i < this.METRIC_PRINTSIZES.length;++i)
  {
    if(this.METRIC_PRINTSIZES[i]== printSizeID) return true;
  }
  return false;
}

function isPrintSizeImperial(printSizeID)
{
  for(var i =0; i < this.IMPERIAL_PRINTSIZES.length;++i)
  {
    if(this.IMPERIAL_PRINTSIZES[i]== printSizeID) return true;
  }
  return false;
}

function getMetricLabelForPrintSizeID(printSizeID)
{
  if(printSizeID == this.PAPERSIZE_20x20) return '50cm x 50cm';
  if(printSizeID == this.PAPERSIZE_20x28) return '50cm x 70cm';
  if(printSizeID == this.PAPERSIZE_24x36) return '61cm x 91cm';
  return '45cm x 61cm';  // 18 x 24"
}

function getImperialLabelForPrintSizeID(printSizeID)
{
  if(printSizeID == this.PAPERSIZE_20x20) return '20" x 20"';
  if(printSizeID == this.PAPERSIZE_18x24) return '18" x 24"';
  if(printSizeID == this.PAPERSIZE_24x36) return '24" x 36"';
  return '20" x 28"';
}

function getLabelForPrintSizeID(printSizeID, metricUnits)
{
  let poster = " Poster";
  if(metricUnits) return this.getMetricLabelForPrintSizeID(printSizeID) + poster;
  return this.getImperialLabelForPrintSizeID(printSizeID) + poster;
}


// calcualte the paper size given the printSizeID and orientationID
function getPreviewMapSize(printSizeID, orientationID )
{
  console.log("getPreviewMapSize");
  var w,h;
  var ratio;
  if(printSizeID === this.PAPERSIZE_18x24)
  {
    //24x18
    h = 1324;  // 1200?
    ratio = 24/18;
  }
  else if(printSizeID === this.PAPERSIZE_24x36)
  {
    h = 2008;  // 1800?
    ratio = 36/24;
  }
  else if(printSizeID === this.PAPERSIZE_16x20)
  {
    h = 1024;  // 1000?
    ratio = 20/16;
  }
  else if(printSizeID === this.PAPERSIZE_12x18)
  {
    h = 768;  // 900?
    ratio = 18/12;
  }
  else if(printSizeID === this.PAPERSIZE_20x28){
    h = 1560;  // 900?
    ratio = 28/20;
  }
  else {  // PAPERSIZE 20x20
    h = 1024;  // 900?
    ratio = 20/20;
  }
  w = h/ratio;
  if(orientationID == 2)
  {
    var temp = h;
    h = w;
    w = temp;
  }
  return  {width:Math.floor(w), height:Math.floor(h)};
}

function getPrintMapSize(printSizeID, orientationID, dpi = 300)
{
  var w,h;
  var ratio;
  var wInches;
  var hInches;
  if(printSizeID === this.PAPERSIZE_18x24)
  {
    wInches  = 18;
    hInches = 24;
  }
  else if(printSizeID === this.PAPERSIZE_24x36)
  {
    wInches  = 24;
    hInches = 36;
  }
  else if(printSizeID === this.PAPERSIZE_16x20)
  {
    wInches  = 16;
    hInches = 20;
  }
  else if(printSizeID === this.PAPERSIZE_12x18)
  {
    wInches  = 12;
    hInches = 18;
  }
  else if(printSizeID === this.PAPERSIZE_20x28)
  {
    wInches  = 20;
    hInches = 28;
  }
  else {  // PAPERSIZE 20x20
    wInches  = 20;
    hInches = 20;

  }
  if(orientationID == 2)
  {
    var temp = wInches;
    wInches = hInches;
    hInches = temp;
  }
  return  {width:wInches * dpi, height: hInches * dpi};
}


