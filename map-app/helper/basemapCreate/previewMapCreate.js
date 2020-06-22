var fs = require('fs');
var imageUtils = require('../../helper/basemapCreate/imageUtils');
var imageSegmentUtils = require('../../helper/basemapCreate/imageSegmentUtils');
var mapTilerAPI = require('../../helper/basemapCreate/mapTilerAPI');

module.exports = {
  createPreviewMapAssets,
  createPreviewMapAssetsFromMapData,
  test,
  generatePreview
};
//////////////////////////////////////////
// specific

var DEBUG = false;
var SAVE_DEBUG_MAPS = false;

function getMapCountOfIDsNew(srcImageData,nIDsMax,basex,basey,dx,dy) {
  // todo - map - count all the ids in this rectangle,
  let s = srcImageData.data;
  let imagew = srcImageData.width;
  let map = {};

  let sx = Math.floor(basex);
  let sy = Math.floor(basey);
  let minx,miny,maxx,maxy, ratiox,ratioy;
  let weight,id,ix;

  for(let x = sx; x < basex + dx;++x)
  {
    minx = Math.max(basex - x, 0);
    maxx = Math.min(basex + dx - x, 1);
    ratiox = maxx - minx;
    //  console.log("ratiox", ratiox);
    for(let y = sy; y < basey + dy;++y)
    {
      miny = Math.max(basey - y, 0);
      maxy = Math.min(basey + dy - y, 1);
      ratioy = maxy - miny;
      //   console.log("ratioy", ratioy);

      weight = ratioy*ratiox;
      ix = 4*(y*imagew + x);
      id = s[ix];
      if(map[id] == null) map[id] = 0;
      map[id]+= weight;
    }
  }


  //console.log(x,y,dx,dy, map);

  // convert to array,
  let array = [];
  for(let id in map) {
    if (map.hasOwnProperty(id)) {
      array.push([id, map[id]]);
    }
  }
  // reorder
  //reorder, largest first
  let n;
  n = array.length;
  for(let i = 0; i<n-1 ; ++i)
  {
    for(let j = i; j<n-1 ; ++j)
    {
      if(array[j][1] < array[j+1][1] )
      {
        let t = array[j];
        array[j] = array[j+1];
        array[j+1] = t;
      }
    }
  }
  // calculate top ratios
  let sum = 0;
  n = Math.min(nIDsMax, array.length);
  for(let i =0 ;i <n ; ++i)
  {
    sum += array[i][1];
  }
  for(let i =0 ;i < n; ++i)
  {
    array[i][1] /= (sum*1.0);
  }

  return array;
}


function downSampleNearestNeighbour(srcImageData, perc)
{
  let imageData = imageUtils.createImageData(Math.round( srcImageData.width*perc), Math.round( srcImageData.height*perc) );

  let s = srcImageData.data;
  let d = imageData.data;
  let w = imageData.width;
  let h = imageData.height;
  let sw  = srcImageData.width;

  let srcx,srcy;
  let destix, srcix;

  for(let x =0; x< w;++x)
  {
    for(let y =0; y< h;++y)
    {
      srcx = Math.round( x / perc);
      srcy = Math.round(y / perc);
      srcix = 4*(srcx + srcy*sw);

      destix = 4*(x + y*w);

      d[destix + 0] = s[srcix + 0];
      d[destix + 1] = s[srcix + 1];
      d[destix + 2] = s[srcix + 2];
      d[destix + 3] = 255;
    }
  }

  return imageData;
}


// basemapdata contains the road and water pixels
// scrImageData contains the segment ids
async function downSampleAndEncodeID(srcImageData, perc, basemapData)
{
  // create downsampled basemapData
  let downsampleData=  imageUtils.scaleImageData(basemapData, perc );
  ///let downsampleInfo = downsampleObject.info;
  //let downsampleData;

  //console.log("[downSampleAndEncodeID]downsampleInfo", downsampleInfo);

  let nIDsMax = 2;
  let imageData = imageUtils.createImageData(Math.round( srcImageData.width*perc), Math.round( srcImageData.height*perc) );
  console.log("[downSampleAndEncodeID]imageData", imageData.width, imageData.height);

  let sw = srcImageData.width;
  let sh = srcImageData.height;

  // todo - for each source pixel (x,y) get
  let s = srcImageData.data;
  let d = imageData.data;
  let w = imageData.width;
  let h = imageData.height;

  let srcx,srcy;
  let destix, srcix;

  let rectw = Math.round( 1.0 / perc);
  let recth = Math.round(1.0 / perc);
  let DebugCount = 0;

  // basemap data
  let bs = basemapData.data;

  // split 8bits into 2 for the water and segment ratio data to share a colour channel
  let waterBits = 4;
  let segmentBits = 4;
  let segmentMax = Math.pow(2, segmentBits) - 1;
  let waterMax = Math.pow(2, waterBits) - 1;

  for(let x =0; x< w;++x)
  {
    for(let y =0; y< h;++y)
    {
      //todo find the rect (x,y,w,h), and do a count of the ids in this set of pixels.
      //todo find the top X and the ratios.
      let rectx = Math.round(x / perc);
      let recty = Math.round(y / perc);

      // console.log("rectw, recth", rectw, recth);
      let idRatios = getMapCountOfIDsNew(srcImageData, nIDsMax,  x/perc,y/perc,1.0/perc, 1.0/perc);
      //let idRatios = getMapCountOfIDs(srcImageData, nIDsMax, rectx,recty,rectw, recth);
      //encode the ratios
      if(DebugCount ++ < 10)
      {
        //console.log(idRatios);
      }
      /*
       srcx = Math.round( x / perc);
       srcy = Math.round(y / perc);
       srcix = 4*(srcx + srcy*sw);
       */
      destix = 4*(x + y*w);
      let ratio = idRatios[0][1];
      let id0 = idRatios[0][0];
      let id1 = (idRatios.length > 1) ? idRatios[1][0] : 0;
      d[destix + 0] = id0;
      d[destix + 1] = id1;

      //  d[destix + 2] = ratio * 255;
      // d[destix + 3] = 255;

      //d[destix + 3] = downsampleData[destix + 0];
      //  d[destix + 1] = downsampleData[destix + 1];
      //   d[destix + 0] = downsampleData[destix + 0];

      let roadCol =  downsampleData.data[destix + 0]; // red
      let waterCol =  downsampleData.data[destix + 2]; // blue
      //d[destix + 3] = Math.min(255, 1 + roadCol);
      d[destix + 3] =  roadCol;
      // test
      // d[destix + 3] = 255;

      // 2 numbers to share a single channel - split the last 8 bits for water & interpolation, 0-15 each
      let water = Math.round(waterCol /255 * waterMax);
      let segmentRatio = Math.round(ratio * segmentMax);
      let channelA = ( (water ) << (waterBits ) ) +  ( segmentRatio );
      d[destix + 2] = channelA;

      //if(true)
      if(DEBUG)
      {
        d[destix + 0] = id0;
        d[destix + 1] = waterCol; // id1;
        d[destix + 2] = Math.min(255,roadCol*1);
        d[destix + 3] = 255;

      }
      /*
      // debug testing

      if(road != 0)
      {
          let t_bit16 = (d[destix + 2] << 8 ) + d[destix + 3];
          let t_road = (t_bit16 >> (waterBits + segmentBits)) & roadMax;
          console.log("road", t_road*255/roadMax , road, roadCol);
      }
      if(water != 0)
      {
          let t_bit16 = (d[destix + 2] << 8 ) + d[destix + 3];
          let t_water = (t_bit16 >> (waterBits )) & waterMax;
          console.log("water", t_water, water);
      }
      if(segmentRatio != 0)
      {
          let t_bit16 = (d[destix + 2] << 8 ) + d[destix + 3];
          let t_segment = (t_bit16 ) & segmentMax;
          console.log("segmentRatio", t_segment, segmentRatio);
      }
          */
      // let roadCol =
      // (/255)*roadMax;
    }
  }

  return imageData;
}


function applyGrowFilter(srcImageData, destImageData)
{
  let dest = destImageData.data;
  let w = destImageData.width;
  let h = destImageData.height;
  let src = srcImageData.data;

  for(let x =0; x< w;++x)
  {
    for(let y =0; y< h;++y)
    {

      growFilterProcessPixel(x,y,src,dest,w,h);
    }
  }
  return destImageData;
}


let debugdone = false;

function growFilterProcessPixel(x,y,src, dest,w,h)
{
  let ix = 4*(y*w + x);
  let col = [src[ix+0],src[ix+1],src[ix+2]];
  let isWhite = (col[0] ==255) && (col[1] ==255) &&(col[2] ==255);
  let offsets = [[-1,0],[1,0],[0,1],[0,-1], [-1,1],[1,-1],[-1,-1],[1,1]];



  if(isWhite )
  {
    // col[0] =
    // get the 4 neighbours
    let map = {};

    let maxCol= 0;
    let maxCount = 0;

    let whitehex = (255 << 16) + (255 << 8) + 255;


    if(!debugdone)
    {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      console.log(x,y);
    }

    for(let i = 0; i< offsets.length;++i)
    {
      let xx = x+ offsets[i][0];
      let yy = y+ offsets[i][1];
      if(xx <0 || xx >= w || yy < 0 || yy >=h ) continue;
      let c = imageUtils.getColourAsHex(xx, yy,src,w,h);

      if(!debugdone)
      {

        console.log("c: " , c);
      }


      if(c != whitehex) {

        if (map[c] == null) map[c] = 1;
        else map[c]++;

        if (maxCount == 0){
          maxCol = c;
          maxCount = 1;
        }
        else if (map[c] > maxCol) {
          maxCol = c;
          maxCount = map[c];
        }
      }

      if(!debugdone)
      {

        console.log(map);
      }
    }


    // get most popular colour
    if(maxCount > 0)
    {

      // set the colour
      let r =  (maxCol >> 16)&255;
      let g =  (maxCol >> 8)&255;
      let b =  (maxCol >> 0)&255;
      dest[ix + 0] = r;
      dest[ix + 1] = g;
      dest[ix + 2] = b;
      dest[ix + 3] = 255;

      if(!debugdone)
      {

        console.log(r,g,b);
      }
    }

    if(!debugdone)
    {
      debugdone = true;
    }
  }
}

// helper method, get teh downsampled scale required to fit the source demension into the targetDemension.
function getScaleForTargetDimension(srcWidth,srcHeight, targetDimension)
{
  if(targetDimension == 0) return 1;
  if(srcWidth > srcHeight)
  {
    // image wider, scale to width
    return targetDimension / srcWidth;
  }
  else{
    // image taller, scale to height
    return targetDimension / srcHeight;
  }
}

// colour the segment pixels with the segment ID values
async function createPreviewMapAssetsFromMapData(srcImageData, downsampleDimension, callback, progressCallback, errorCallback)
{
  // todo - change downsampleScaleFactor with a targetDimension, and calc the scalefactor?
  let downsampleScaleFactor = getScaleForTargetDimension(srcImageData.width, srcImageData.height, downsampleDimension);
  downsampleScaleFactor = 1;
  console.log("downsampleScaleFactor", downsampleScaleFactor);
  // downsampleScaleFactor = 1;


  // do segmentation first
  console.log("segment...");
  imageSegmentUtils.drawPreviewMapRoadAndWater(srcImageData); // create segment id
  doProgressCallback(progressCallback,1.0);



  console.log("here 1...");

  imageSegmentUtils.findThinLandPixelsXAxis(srcImageData);
  imageSegmentUtils.findThinLandPixelsYAxis(srcImageData);
  console.log("here 2...");

  imageSegmentUtils.findThinLandPixelsDiagonal1(srcImageData);
  imageSegmentUtils.findThinLandPixelsDiagonal2(srcImageData);

  imageSegmentUtils.do2x2SearchForLandWaterRoad();
  console.log("here 3...");

  imageSegmentUtils.doFloodFillSegmenting();
  console.log("here 4...");

  imageSegmentUtils.createSegmentMap();

  if(SAVE_DEBUG_MAPS) {
    await imageSegmentUtils.saveDebugMapToFile("idmap2");
  }

  console.log("remmove small segments");

  // get segment counts and remove segments smaller than 3
  let segmentCounts = imageSegmentUtils.getSegmentCountMap();
  let segmentIDs = Object.keys(segmentCounts);
  let segmentMap = imageSegmentUtils.getSegmentMap();
  for(let i = 0; i < segmentIDs.length; ++i) {
    let segmentID = segmentIDs[i];
    let count = segmentCounts[segmentID];
    if(count <= 3){
      imageSegmentUtils.replaceIDsForIndexArray(segmentMap[segmentID], -1);
    }
  }
  console.log("remmove small segments done");

  imageSegmentUtils.createSegmentMap();

  /*
  // get segment count
  let segmentCounts = imageSegmentUtils.getSegmentCountMap();
  let segmentIDs = Object.keys(segmentCounts);
  let thinLineMap = [];
  for(let i = 0; i < segmentIDs.length;++i){
      let segmentID = segmentIDs[i];
      let count = segmentCounts[segmentID];
      //  - if between [min,max] count, then get segment thickness along x,y.
      if( (count <= 4)){
          thinLineMap[segmentID] = true;
      }
      else if( count < 100)
      {
         // thinLineMap[segmentID] = true;


          let thickness = imageSegmentUtils.getSegmentThickess(segmentID, true);
          let isThinLine = thickness <= 2;
          if(isThinLine){
              // create a map for any between 1 -2 pixels
              thinLineMap[segmentID] = true;
          }
      }
  }
  console.log("thinLineMap", thinLineMap);

  imageSegmentUtils.connectDiagonalsForSpecificSegmentsAndClear(thinLineMap);
  //- connectDiagonalLandMasses if one segment is in the above map
  */
  //imageSegmentUtils.createSegmentMap();



  // create a dest image buffer
  imageData = imageUtils.createImageData(srcImageData.width, srcImageData.height);
  console.log("imageData.width", imageData.width);
  // this is all white as the base colour

  // process the segments : assign a random segmentID to each segment and encode as a colour
  console.log("processImage..");
  let watercol = [255, 255, 255]; // colourTheme["waterColour"]; //; coloursets[ix][0]; // water is the first colour
  let roadcolour = [255, 255, 255];
  let seedID = 0;
  imageSegmentUtils.assignSegmentColours(seedID);
//test




  console.log("processImage 2..");


  /*
  imageSegmentUtils.replaceIDs(-2,0);
  imageSegmentUtils.replaceIDs(-1,0);
  imageSegmentUtils.growSegments(2);
  imageSegmentUtils.drawRoadToIDMap(srcImageData.data, 1);
  imageSegmentUtils.drawWaterToIDMap(srcImageData.data);

  imageSegmentUtils.floodFillGapsInExistingSegments();
  imageSegmentUtils.doFloodFillSegmenting();

  imageSegmentUtils.replaceIDs(-1,0);
  imageSegmentUtils.drawRoadToIDMap(srcImageData.data, 254);
  imageSegmentUtils.floodFillGapsInExistingSegments();

  imageSegmentUtils.replaceIDs(-1,0);
   */

  // imageSegmentUtils.growSegments(2);

  imageSegmentUtils.createSegmentMap();


  // set imageData pixels with the segment colours,
  // todo process segments to idmap instead?
  imageSegmentUtils.processSegments(srcImageData, imageData, roadcolour, watercol);
  doProgressCallback(progressCallback,2);

  console.log("processImage 3..");


  // todo - do grow on idmap instead?
  // grow out segments to fill in the road gaps, this is so that it shows up under the road antialising

  let imageData2 = imageUtils.cloneImageData(imageData);
  console.log("processImage 4..");

  let niterations = 2; // test the optimum number of iterations, should be just enough to remove antialiasing issues
  for (let i = 0; i < niterations; ++i)
  {
    console.log("applyGrowFilter " + i + "/ " + niterations);
    imageData2 = applyGrowFilter(imageData, imageData2);
    imageData.data.set(imageData2.data);

    let t = imageData;
    imageData = imageData2;
    imageData2 = t;
    doProgressCallback(progressCallback,2 + (i/niterations));
  }
  doProgressCallback(progressCallback,3);

  if(SAVE_DEBUG_MAPS) {
    let imageDataClone = imageUtils.cloneImageData(imageData);
    imageUtils.saveImageDataToPNG(imageDataClone,"idmap-debug-withoutroad");
  }

  if(SAVE_DEBUG_MAPS) {
    let imageDataClone = imageUtils.cloneImageData(imageData);
    imageSegmentUtils.overlayWaterPixels(srcImageData, imageDataClone, [0,0,255]);
    imageSegmentUtils.overlayRoadPixels(srcImageData, imageDataClone, [255,0,0]);
    imageUtils.saveImageDataToPNG(imageDataClone,"idmap-debug");

  }

  console.log("imageData", imageData.width, imageData.height);

  // downsample the result to smooth out with antialiasing
//        imageData = downSampleNearestNeighbour(imageData,downsampleScaleFactor);
  imageData = await downSampleAndEncodeID(imageData,downsampleScaleFactor,srcImageData);
  doProgressCallback(progressCallback,4);
  console.log("imageData", imageData.width, imageData.height);

  ///////////////////////////////////////////////////////////////////////

  if(SAVE_DEBUG_MAPS) {
    imageUtils.saveImageDataToPNG(imageData, "output");
  };

  doProgressCallback(progressCallback,5);
  if(callback)callback (imageData);


  // File 1: save out the result to file
 /// let outputSettings = {resize: 0, appendToFilename:"_full", quality:90, format:"png" };
  //imageUtils.saveFile(imageData, outputBaseFilePath, outputSettings, ()=> {



// File  2:  save a scaled copy of the original base map.  This has the data for the road, and water.
//   saveImageDataToFiles(srcImageData, outputfilenames[ix] + "_line", function(){  });
    /*
imageUtils.saveFileScaled(srcImageData, outputBaseFilePath,    downsampleScaleFactor , function(){
doProgressCallback(progressCallback,5);
if(callback)callback();
} );*/


}



function doProgressCallback(callback, step)
{
  if(callback){
    callback(step / 5.0);
  }
}



// load the map data from file and call the createPreview method to process it
function createPreviewMapAssets(mapPath , outputFolderPath, outputBaseFilename, downsampleDimension, callback, progressCallback, errorCallback)
{
  console.log("outputFolderPath: ", outputFolderPath);
  console.log("mapPath: ", mapPath);
  console.log("load map ----------------------------------------");
  console.log(mapPath);

  imageUtils.loadImage(mapPath, function (srcImage) {
    if(srcImage !=null) {
      let srcImageData = imageUtils.getPixelData(srcImage);
      createPreviewMapAssetsFromMapData(srcImageData, outputFolderPath, outputBaseFilename, downsampleDimension, callback, progressCallback, errorCallback);
    }
    else{
      console.log("error invalid image");
      // srcimage is null - not load
      if(errorCallback) errorCallback();
    }
  });

}

async function test(){
  console.log("test");
  let srcImageData = await imageUtils.downloadImageAndGetImageData("/test/basemapTest.png");
  let w = srcImageData.width;
  let h =  srcImageData.height;
  console.log("w,h", w,h);
  console.log("data", srcImageData);

  let progressCallback = function(){};
  let errorCallback = function(){};
  let callback = function(){};
  createPreviewMapAssetsFromMapData(srcImageData, 1000, callback, progressCallback, errorCallback);

}

async function generatePreview(lng,lat,zoom,width,height, scaleFactor){

  console.log("generatePreview", lng,lat,zoom,width,height, scaleFactor);
  //let url ="/test/basemapTest.png";
  let url = mapTilerAPI.createStaticMapURLForPreview(lng,lat,zoom,width,height, scaleFactor);
  let srcImageData = await imageUtils.downloadImageAndGetImageData(url);

  let w = srcImageData.width;
  let h =  srcImageData.height;
  console.log("w,h", w,h);
  console.log("data", srcImageData);

  return new Promise((resolve, reject)=>{
    let progressCallback = (progress) => {
      console.log("progress", progress);
    };
    let errorCallback = ()=> {
      reject();
    };
    let callback = (imageData) => {
      console.log("done callback", imageData);
      resolve(imageData);
    };
    createPreviewMapAssetsFromMapData(srcImageData, 1000, callback, progressCallback, errorCallback);
  });
}
