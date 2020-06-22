
// this is the id in the url in maptiler cloud , e.g https://api.maptiler.com/maps/1f2c3dfc-3554-465a-bb6b-34dd26cdc666/style.json?key=QrAJ6Qj4kLYkZ6l90BKB
let _styleJSONID_preview = "1f2c3dfc-3554-465a-bb6b-34dd26cdc666";
let _styleJSONID_zoom12 = "d7aa8aa6-f351-4139-b392-575763aec635";
let _styleJSONID_zoom13 = "05155514-12ab-4a86-b0e4-858a4c77ff50";
let _styleJSONID_zoom14 = "abebde0d-6aa5-427d-8ed8-a7d5f63bb3b7";
let _styleJSONID_zoom15 = "1e6f513d-0e21-4f68-964a-5b318f22c94d";

var _accesstoken = "tXMrAM363r8LCjMsRjMP"; //  this should  be the private access token, separate from that of the website one


module.exports = {
  createStaticMapURL,
  createStaticMapURLForPreview,
  getStyleJSONForZoomLevel,
  getStyleJSONForPreview,
  getStyleJSONIDforPreview,
  getStyleJSONIDforZoomLevel,
  constructStyleJsonUrl
};

function getStyleJSONIDforPreview()
{
  return _styleJSONID_preview;
}

function getStyleJSONIDforZoomLevel(zoomLevel)
{
  if(zoomLevel == 12) return _styleJSONID_zoom12;
  if(zoomLevel == 13) return _styleJSONID_zoom13;
  if(zoomLevel == 14) return _styleJSONID_zoom14;
  return _styleJSONID_zoom15;
}

function constructStyleJsonUrl(styleID)
{
  return "https://api.maptiler.com/maps/" + styleID + "/style.json?key=" + _accesstoken;
}

function getStyleJSONForPreview()
{
  return constructStyleJsonUrl( _styleJSONID_preview);
}

function getStyleJSONForZoomLevel(zoomLevel)
{
  let styleID = getStyleJSONIDforZoomLevel(zoomLevel);
  let url = constructStyleJsonUrl(styleID );
  console.log("getStyleJSONForZoomLevel zoomLevel", zoomLevel, url);
  return url;
}

//example
// http://178.128.160.185/styles/test/static/-0.11400,51.50507,11/600x800@2x.png?access_token=QrAJ6Qj4kLYkZ6l90BKB
//


function createStaticMapURL(lng,lat,zoom,width,height, scaleFactor, styleJSONID = null)
{
  if(styleJSONID == null)
  {
    styleJSONID = _styleJSONID_preview;
  }

  let useMapTilerCloudService = true;
  if(useMapTilerCloudService)
  {
    // clamp to limits to avoid errors
    scaleFactor = Math.min(scaleFactor,2);
  }

  //styleID example 1f2c3dfc-3554-465a-bb6b-34dd26cdc666
  var _apiBaseURL = (useMapTilerCloudService) ? "https://api.maptiler.com/maps/"+ styleJSONID +"/" : "http://178.128.160.185/styles/test/"; // custom

  var url = _apiBaseURL + "static/";
  zoom = Math.round(zoom);
  width = Math.round(width);
  height = Math.round(height);
  if(useMapTilerCloudService) {
    url += lng + "," + lat + "," + zoom + "/" + width + "x" + height + (((scaleFactor > 1) ? "@" + scaleFactor + "x" : "") + ".png");
    url += "?key=" + _accesstoken;
    url += "&clearcache=" + new Date().getTime();
  }
  else{
    url += lng + "," + lat + "," + zoom + "/" + width + "x" + height + (((scaleFactor > 1) ? "@" + scaleFactor + "x" : "") + ".png");
    url += "?clearcache=" + new Date().getTime();

  }

  return url;
  //static/-0.11400,51.50507,11.1,0,0/600x800@2x?access_token=pk.eyJ1IjoiZGF2aWRoMDMiLCJhIjoiY2phZnduOTdxMThwNzJ3cXVyY2RubDhlMyJ9.Io4YkfT4pvr-740FppvYMg
}

function createStaticMapURLForPreview(lng,lat,zoom,width,height, scaleFactor)
{
  return createStaticMapURL(lng,lat,zoom,width,height, scaleFactor, null);
}