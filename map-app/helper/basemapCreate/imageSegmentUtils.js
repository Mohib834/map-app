//var gen = require('random-seed'); // create a generator
//var rand =  require('random-seed').create();

var imageUtils = require('./imageUtils.js');

var SAVE_DEBUG_MAPS = true;
var SEGMENT_GAP_START_INDEX  = -100;// some negiative number larger than -2
var REINDEX_STARTIN_INDEX = 900000000;
var _startreIndex = REINDEX_STARTIN_INDEX;


module.exports = {
  assignSegmentColours,
  processSegments,
  drawPreviewMapRoadAndWater,
  /*doSegmentingFullMap,*/
  getSegmentMap,
  setSegmentColourMap,
  /* fillInGapsOnFullMap,*/
  createSegmentMap,
  init,
  saveDebugMapToFile,
  drawRoadToIDMap,
  growRoad,
  drawWaterToIDMap,
  doFloodFillSegmenting,
  replaceIDs,
  removeSmallSegments,
  growSegments,
  growSegment,
  erodeSegment,
  floodFillGapsInExistingSegments,
  findGapsBetweenTwoOrMoreSegments,
  fill1pxGaps,
  clearGapIds,
  clearDebugPixelColourMap,
  straightenSegmentBoundaryLines,
  getRandomIntInRange,
  getSegmentCount,
  getSegmentCountMap,
  getSegmentThickess,
  getSmallSegments,
  clearRoadLessThanThreshold,
  drawSmoothCutLines,
  connectDiagonalLandMasses,
  connectDiagonalsForSpecificSegmentsAndClear,
  removeSmallIslandSegments,
  fillInWaterPixels,
  findCountsForSegmentsAndErode,
  findMainIdForSegment,
  findIdCountMapForSegment,
  findIdOrderedCountsForSegment,
  clearSegmentsAroundCut,
  overlayRoadPixels,
  overlayWaterPixels,
  findThinLandPixelsXAxis,
  findThinLandPixelsYAxis,
  findThinLandPixelsDiagonal1,
  findThinLandPixelsDiagonal2,
  replaceIDsForIndexArray,
  do2x2SearchForLandWaterRoad,
  drawToCutPixelsUsingMixedColour
};


var segmentColourMap = {};
var segmentMap = {};
var _idmap = [];
var _w;
var _h;
var _nextSegmentID = 1;


function init(imageData)
{
  _startreIndex = REINDEX_STARTIN_INDEX;
  _nextSegmentID = 1;

  // initialise empty
  _idmap = [];
  _w = imageData.width;
  _h = imageData.height;
  //let data = imageData.data;
  // zero out values

  let n = _w*_h;
  for(let i =0; i< n; ++i)
  {
    _idmap[i] = 0;
  }
}

function getSegmentMap(){
  return segmentMap;
}

function setSegmentColourMap(map){
  segmentColourMap = map;
}

// assign colours for the preview map
function assignSegmentColours(seed) {

  /*
   rand = gen.create(seed);
   // reset the ran number generator
   //rand.initState();
   segmentColourMap = {};
   for (let segmentID in segmentMap) {
   if (segmentMap.hasOwnProperty(segmentID)) {

   let col1 = getNextColour();
   let col2 = getNextColour();
   let lerpVal =  0.1*rand.random(); // use the seed value
   //let lerpVal = 0;
   let col = lerpColour(col1,col2, lerpVal);
   segmentColourMap[segmentID] = col;
   }
   }*/

  // encode the id in the colour, try r
// TODO switch rand with one that compatible with j
//  rand = gen.create(seed);
  //reset the ran number generator
 // rand.initState();


  segmentColourMap = {};
  for (let segmentID in segmentMap) {
    if (segmentMap.hasOwnProperty(segmentID)) {

      let r = 1 + getRandomIntInRange(254);
      let g = 1 + getRandomIntInRange(254);
      let b = 1 + getRandomIntInRange(254);
      segmentColourMap[segmentID] = [r,g,b];
    }
  }
}

function processSegments(srcImageData, imageData, roadcolour,watercolour)
{
  console.log("processing segments..");
  // test
  // add a random colour per segment
  for(let segmentID in segmentMap) {
    if (segmentMap.hasOwnProperty(segmentID)) {
      let pixelIds = segmentMap[segmentID];
      if(segmentID > 0) {
        // regular segment
        /*
         let col1 = getNextColour();
         let col2 = getNextColour();
         let lerpVal =  0.1*Math.random();
         //let lerpVal = 0;
         let col = lerpColour(col1,col2, lerpVal);
         */
        let col = segmentColourMap[segmentID];
        if(col == null) col = [255,0,0];

        fillSegmentWithColour(pixelIds, srcImageData, imageData,col);

        // fill some with pattern texture
        /*
         if(Math.random() < 0.7) {
         let patternImageData = patternImageDataList[getRandomIntInRange(patternImageDataList.length )];
         fillSegmentWithPattern(pixelIds, imageData, col1, col2, patternImageData);
         }
         else{
         // standard solid fill
         fillSegmentWithColour(pixelIds, imageData,col);
         }*/
      }
      else if(segmentID == -1){//road pixels
        fillSegmentWithColour(pixelIds,srcImageData, imageData,roadcolour);
      }
      else if(segmentID == -2){// water pixels
        // this is handled by the inversecolour function  - it adds anti aliasing too
        /*
         let patternCol = getNextColour();
         let patternImageData = patternImageDataList[0];
         fillSegmentWithPattern(pixelIds, imageData, watercolour, patternCol, patternImageData);
         // */
        fillSegmentWithColour(pixelIds, srcImageData, imageData,watercolour);

      }
    }
  }
}

// set the colours
function fillSegmentWithColour(pixelIds,srcImageData, imageData, col)
{
  let d = imageData.data;
  let w = srcImageData.width;
  let h = srcImageData.height;

  let n = pixelIds.length;
  let ix,x,y;

  let r = col[0];
  let g = col[1];
  let b = col[2];

  for(let i =0; i< n;++i)
  {
    ix = pixelIds[i];
    x = ix % w ;
    y = Math.floor( ix / w ) ;
    d[4*ix + 0] = r;
    d[4*ix + 1] = g;
    d[4*ix + 2] = b;
    d[4*ix + 3] = 255;
  }
}

function getRandomIntInRange(n)
{
  //let ranFloat = Math.random();
  let ranFloat = Math.random(); // rand.random();
  return Math.min(n-1, Math.floor(ranFloat*n));
}

// preview segmenting
function drawPreviewMapRoadAndWater(d)
{
  console.log("do segmenting...", d.width, d.height);


  // d is imageData
  _idmap = [];
  _w = d.width;
  _h = d.height;
  let data = d.data;
  // zero out values

  let n = _w*_h;
  for(let i =0; i< n; ++i)
  {
    _idmap[i] = 0;
  }

  // let roadpixelcound = 0;
  let x,y;
  // fill in boundary pixels on map
  for(let i = 0; i < n;++i)
  {
    x = i % _w;
    y = Math.floor( i / _w );
    // incrase to 90
    if(isRoadPixel(x,y,_w,data, 90))
    //if(isRoadPixel(x,y,_w,data, 254))
    {
      _idmap[i] = -1; // -1 signals a road
      //  roadpixelcound++;
    }
    else if(isWaterPixel(x,y,_w,data, false))
    {
      _idmap[i] = -2; // -2 signals water
      // roadpixelcound++;

      // if water pxiel then
      // check if a neighbour is land

      // this will erodes the thinner rivers, but it helps to keep colours consistent
      if(isNeighbourToRoad(x,y,_w,data)){
        //_idmap[i]= 0;// set as land
      }
    }
  }

  //todo create a debug map to export


  //console.log("road pixel count " + roadpixelcound);
  // walk the map and flood fill
//    doFloodFillSegmenting();

  // todo - get segment counts ?
  // for each segment
  // todo overwrite road with lower threshold
  // drawRoadToIDMap(data , 90);
  /*
    for(let i = 0; i < n;++i)
    {
      x = i % _w;
      y = Math.floor( i / _w );
      if(isRoadPixel(x,y,_w,data, 254))
      {
        _idmap[i] = -1; // -1 signals a road
      }
    }*/


  // todo remove any segments that have thin lines (1px)

  // create segmentList
  //   createSegmentMap();
  console.log("done" );
}

//
function fill1pxGaps()
{
  console.log("fill1pxGaps");
  for(let x =1; x < _w-1 ; ++x)
  {
    for(let y =1; y < _h-1 ; ++y)
    {
      let ix = y*_w + x;
      let segmentID = _idmap[ix];
      if(segmentID != 0)
      {
        // console.log("segmentID ", segmentID);

      }
      else{ // id 0, look for 4 sides that are not 0
//        console.log("segmentID ", segmentID);
        let result = checkFor1pxGap(x,y);
        if(result.found)
        {
          let replaceID = result.segmentID;
          _idmap[ix] = replaceID;
          //   console.log("1px gap found - replaceID", replaceID);
        }
      }
    }
  }
}

function checkFor1pxGap(basex,basey)
{
  let baseix  =y*_w + x;
  let offsets = [[0,-1],[1,0],[0,1],[-1,0]];
  // let offsets = [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];
  let segmentID = -1; // default as road
  for(let k =0; k < offsets.length;++k){
    x = basex +  offsets[k][0];
    y = basey +  offsets[k][1];
    let ix = _w*y + x;

    //console.log(_idmap[ix]);
    if(_idmap[ix] == 0) {
      return {
        found : false
      };
    }
    else if (_idmap[ix] >0 ){
      segmentID = _idmap[ix];
    }
  }
  return {
    found:true,
    segmentID: segmentID
  };
}


//debug
function saveDebugMapToFile(filename)
{
  console.log("saveDebugMapToFile _w,_h", _w,_h);

  let temp = imageUtils.createImageData(_w,_h);
  let tempdata = temp.data;

  let n = _w*_h;
  for(let i =0; i< n; ++i)
  {
    let id = _idmap[i];
    let ix = 4*i;
    if(id == -1) {  //road
      tempdata[ix ] = 255;
      tempdata[ix+1 ] = 0;
      tempdata[ix+2 ] = 0;
      tempdata[ix+3 ] = 255;
    }
    else if(id== -2)// water
    {
      tempdata[ix ] = 0;
      tempdata[ix+1 ] = 0;
      tempdata[ix+2 ] = 255;
      tempdata[ix+3 ] = 255;

    }
    else if(id== -3)// cuts
    {
      tempdata[ix ] = 0;
      tempdata[ix+1 ] = 0;
      tempdata[ix+2 ] = 0;
      tempdata[ix+3 ] = 255;

    }
    else if(id <= SEGMENT_GAP_START_INDEX) {
      tempdata[ix ] = 0;
      tempdata[ix+1 ] = 0;
      tempdata[ix+2 ] = 0;
      tempdata[ix+3 ] = 255;
    }
    else if(id == 0){
      tempdata[ix ] = 0;
      tempdata[ix+1 ] = 255;
      tempdata[ix+2 ] = 0;
      tempdata[ix+3 ] = 255;

    }
  }

  for (let segmentID in segmentMap) {
    if (segmentMap.hasOwnProperty(segmentID)) {
      let pixelIds = segmentMap[segmentID];
      if(segmentID > 0) {
        let col = segmentColourMap[segmentID];
        if(col ==null)
        {
          let r = 100 + getRandomIntInRange(255 - 100);
          let g = 100 + getRandomIntInRange(255 - 100);
          let b = 100 + getRandomIntInRange(255 - 100);
          col = [r,g,b];
        }
        fillSegmentWithColour(pixelIds, temp, temp,col);

      }
    }
  }
  // draw extra ontop
  let ALPHA = 0.80;
  let debugPixelIndicies = Object.keys(_debugPixelColourMap);
  for(let i =0; i< debugPixelIndicies .length;++i)
  {
    let ix = debugPixelIndicies [i];
    let col = _debugPixelColourMap[ix];
    tempdata[4*ix + 0] = tempdata[4*ix + 0]*(1-ALPHA) +  col[0]*ALPHA ;
    tempdata[4*ix + 1] = tempdata[4*ix + 1]*(1-ALPHA) +  col[1]*ALPHA;
    tempdata[4*ix + 2] = tempdata[4*ix + 2]*(1-ALPHA) +  col[2]*ALPHA;
    tempdata[4*ix + 3] = 255;
  }


  return imageUtils.savePixelDataToPNG(tempdata, _w, _h, filename);

}

// moveed to the processFullmap1
/*
function doSegmentingFullMap(imagedata, niterationsRoad)
{
    let data =imagedata.data;
  // todo
  // craeate index map
  // draw road to index map
  // grow it
  // draw water
  // do segmenting

  console.log("do segmenting heree..");
  // choose a low threshold for better alignment?
    drawRoadToIDMap(data, 40);

    // inflate the road out to try separate out regions to match the preview, this is main around where roads are close to water
    growRoad(niterationsRoad);

    drawWaterToIDMap(data);

    // walk the map and flood fill to find initial segments
    doFloodFillSegmenting();
    // create segmentList
    createSegmentMap();
    console.log("done" );
}*/

function drawWaterToIDMap(data)
{
  let x,y;
  let n = _w*_h;
  for(let i = 0; i < n;++i)
  {
    x = i % _w;
    y = Math.floor( i / _w );
    if(isWaterPixel(x,y,_w,data, true))
    {
      _idmap[i] = -2; // -2 signals water
    }
  }
}


function doFloodFillSegmenting(searchid =0)
{
  console.log("doFloodFillSegmenting" , searchid, _w, _h );

  let n = _w*_h;
  for(let i =0; i < n;++i) {
    if(_idmap[i] == searchid) {
      x = i % _w;
      y = Math.floor(i / _w);
      doFloodFill(x, y, _w, _h, _nextSegmentID, searchid);
      _nextSegmentID++;
      if(_nextSegmentID % 1000 == 0)
      {
        console.log("processing segment..  " + _nextSegmentID );
      }
    }
  }
  console.log("nSegments found: " + _nextSegmentID);

}




function removeSmallSegmentsByCount(minSegmentCount)
{
  createSegmentMap();
  console.log("removeSmallSegmentsByCount ..");
  let segmentIDs = Object.keys(segmentMap);
  for(let i =0; i < segmentIDs.length;++i) {
    let segmentID = segmentIDs[i];

    if((segmentMap[segmentID] != null ) && (segmentID != -1)  && (segmentID != -2) && (segmentID != -3)) {
      let count = getSegmentCount(segmentID);
      console.log("count ix", segmentID, count);

      if (count <= minSegmentCount) {
        console.log("clear");
        clearIndexArray(segmentMap[segmentID]);
      }
    }
  }
  //createSegmentMap();

}

function getSmallSegments(minSegmentCount, minBoundingboxSize, minThickness)
{

  // recreate segment count
  createSegmentMap();
  let n = _w*_h;

  console.log("getSmallSegments ..");
  let smallSegments = [];
  let countBB = 0;
  let countLength = 0;
  let countThickness = 0;
  let segmentIDs = Object.keys(segmentMap);
  for(let i =0; i < segmentIDs.length;++i) {
    let segmentID = segmentIDs[i];
    if(segmentID <= 0 ) continue;

    if(segmentMap[segmentID]) {
      let bb = getSegmentBoundingBox(segmentMap[segmentID]);

      //
      if(getSegmentThickess(segmentID) <= minThickness)
      {
        smallSegments.push(segmentID);
        //clearIndexArray(segmentMap[segmentID]);
        countThickness++;

      }
      else if (getSegmentCount(segmentID) <= minSegmentCount) {
        smallSegments.push(segmentID);
        //clearIndexArray(segmentMap[segmentID]);
        countLength++;
      }
      else if((bb.width < minBoundingboxSize) && (bb.height < minBoundingboxSize)) {
        countBB++;
        smallSegments.push(segmentID);
        //clearIndexArray(segmentMap[segmentID]);
        countBB++;
      }

    }
  }
  console.log(" segments by bounding box:", countBB);
  console.log(" segments by length", countLength);
  console.log(" segments by thickness:", countThickness);
  return smallSegments;

}

function removeSmallSegments(minSegmentCount, minBoundingboxSize,minThickness)
{
  let smallSegments = getSmallSegments(minSegmentCount, minBoundingboxSize, minThickness);

  for(let i =0; i < smallSegments.length;++i) {
    clearIndexArray(segmentMap[smallSegments[i]]);
  }
}

// fill in pixels that were cleared from the removeSmallIslandSegments method, otherwise is shows as white
function fillInWaterPixels(destImageData, colour)
{
  let d =       destImageData.data;
  let n = _w*_h;
  for(let i = 0 ; i < n;++i)
  {
    if(_idmap[i]==-2)
    {
      d[4*i + 0] = colour[0];
      d[4*i + 1] = colour[1];
      d[4*i + 2] = colour[2];
      d[4*i + 3] = 255;

    }
  }
}


function cloneIdMap()
{
  return _idmap.slice(0);
  // return Object.assign({},_idmap);
}

function getSegmentCountMap()
{
  let countmap = [];
  let segmentIDs = Object.keys(segmentMap);
  for(let i =0; i < segmentIDs.length;++i) {
    let segmentID = segmentIDs[i];
    let count = getSegmentCount(segmentID);
    countmap[segmentID] = count;
  }
  return countmap;
}

//- islandsegments- remove all small segments that are within a bigger water segment only (like the sea),
// as small isalnds in the sea are more likely to be errors.
// small islands in lakes seem to be quite common (e.g tokyo)
function removeSmallIslandSegments(minSegmentCount, minBoundingboxSize,minThickness)
{

  //-- save _idmap as a cloned obj (landIdMap) and reset
  let landIdmap = cloneIdMap();
  replaceIDsEqualAndMoreThan(1,0 );

  //-- dofloodfill on water -2
  doFloodFillSegmenting(-2);
  createSegmentMap();
  console.log("segments", segmentMap);
  // -- save _idmap as a clone obj - waterIdMap
  let waterIdmap = cloneIdMap();
  // -- get all segment counts as a map obj (waterSegmentCounts) so that count value can be queried against id
  let waterSegmentCountMap = getSegmentCountMap();
  // -- reestore saved landIDMap as _idmap
  _idmap = landIdmap;
  createSegmentMap();

  // todo change to get all islands (large and small)
  // -- get small semgents island
  //let smallSegments = getSmallSegments(minSegmentCount, minBoundingboxSize, minThickness);
  let allSegmentIDs = Object.keys(segmentMap);

  let islandSegmentsToTest = [];
  let islandSegmentSizeMap = {};
  let islandSegmentCenterMap = {};


  console.log("removeSmallIslandSegments");
  for(let i =0; i < allSegmentIDs.length;++i) {
    if(i % 10 ==0 ) {
      console.log("removeSmallIslandSegments processing ", i , "/", allSegmentIDs.length);
    }
    let segmentID = allSegmentIDs[i];
    let pixelIDs = segmentMap[segmentID];
    //   - get the border pixels
    let borderPixelIndexes = getBorderPixelsAlt(segmentID, pixelIDs);
    //debugDrawIndices(borderPixelIndexes, [255,0,255]);
    //
    let borderIDs = getSegmentIdsForBorderPixels(borderPixelIndexes , waterIdmap);
    let segmentIds = getAllIdsInBorder(borderIDs, segmentID);


    console.log("removeSmallIslandSegments segmentIds",segmentIds );
    if(segmentIds.length == 1)
    {
      let waterSegmentID = segmentIds[0];
      if(waterSegmentID > 0) //within a water segmnet
      {
        let waterSegmentSize = waterSegmentCountMap[waterSegmentID];
        console.log("waterSegmentSize: ", waterSegmentSize);
        let LARGE_WATER_AREA_COUNT = 50000;
        // only focused on islands if they are in the sea, as more likely to be a basemap error, so collect the large and small one for porcessing
        if(waterSegmentSize > LARGE_WATER_AREA_COUNT){
          // fill in island with water pixels to remove it
          //replaceIDs(segmentID, -2);

          //  calc center point and add to a map
          islandSegmentsToTest.push(segmentID);
          islandSegmentCenterMap[segmentID] =  getSegmentMidPoint(segmentID);
          //  calc segment count and add to a map
          islandSegmentSizeMap[segmentID] =  getSegmentThickess(segmentID);

          debugDrawIndices(borderPixelIndexes, [255,0,255]);
          debugDrawPoint(islandSegmentCenterMap[segmentID], [255,255,255]);
        }
      }
    }
  }


  console.log("islandSegmentCenterMap ", islandSegmentCenterMap);
  console.log("islandSegmentSizeMap ", islandSegmentSizeMap);

  // todo process islands to see which ones to remove
  for(let i =0; i< islandSegmentsToTest.length;++i)
  {
    let islandSegmentId = islandSegmentsToTest[i];
    // see if this is small
    let segmentSize = islandSegmentSizeMap[islandSegmentId];
    let SMALL_ISLAND_THRESHOLD = 6;
    let isSmall =  segmentSize <= SMALL_ISLAND_THRESHOLD;
    let bb = getSegmentBoundingBox(segmentMap[ islandSegmentId]);

    let removeIsland = false;
    if(isSmall)
    {
      // test if it is close to another small island, and a big one
      let closestSmallIslandDist = getClosestSegment(islandSegmentId, 0, SMALL_ISLAND_THRESHOLD,islandSegmentsToTest, islandSegmentSizeMap, islandSegmentCenterMap);
      console.log("closestSmallIslandDist", closestSmallIslandDist);

      let closestLargeIslandDist = getClosestSegment(islandSegmentId, SMALL_ISLAND_THRESHOLD, 9999999 ,islandSegmentsToTest, islandSegmentSizeMap, islandSegmentCenterMap);
      console.log("closestLargeIslandDist", closestLargeIslandDist);

      if(closestSmallIslandDist && closestLargeIslandDist){
        let closeSmallisland = closestSmallIslandDist.dist <  100;
        let largeislandClose = closestLargeIslandDist.dist < 100;
        if( !largeislandClose  /*closeSmallisland*/  /*&& largeislandFarAway*/)
        {
          console.log("remove island");
          removeIsland = true;
        }
      }
    }

    ////// check if its long and thin
    // todo
    let diagonal = Math.sqrt(bb.width*bb.width + bb.height*bb.height);
    let boundSize = Math.max( Math.max( bb.width,bb.height) , diagonal);
    console.log("ratio" ,  boundSize / segmentSize);
    console.log("boundSize" ,  boundSize);
    console.log("segmentSize" ,  segmentSize);
    console.log("bb" ,  bb);
    console.log("center" ,  islandSegmentCenterMap[islandSegmentId] );

    /*
    if( (segmentSize <= 6)  &&   ((boundSize / segmentSize) > 6) ){
    //  removeIsland = true;
    }*/


    if( (segmentSize <= 4)  ){
      removeIsland = true;
    }

    if(removeIsland)
    {
      // replace with water pixels
      replaceIDs(islandSegmentId, -2);
    }
  }

  console.log("removeSmallIslandSegments complete");
}


// helper method, get the closest segment that between minSize and maxSize
function getClosestSegment(islandSegmentId, minSize, maxSize, segmentIDs, islandSegmentSizeMap, islandSegmentCenterMap)
{
  let closestDist = 999999999999;
  let closestSegmentId = null;
  let targetCenter = islandSegmentCenterMap[islandSegmentId];
  for(let i =0; i< segmentIDs.length;++i){
    let segmentID = segmentIDs[i];
    let size = islandSegmentSizeMap[segmentID];
    if( (size >= minSize ) && (size <= maxSize)  &&  (segmentID != islandSegmentId) )
    {
      // todo calc the dist between the segment and the target
      let dist = distBetweenPoints(targetCenter, islandSegmentCenterMap[segmentID] );
      if(closestSegmentId == null){
        closestSegmentId = segmentID;
        closestDist = dist;
      }
      else if(dist < closestDist){
        closestSegmentId = segmentID;
        closestDist = dist;
      }
    }
  }
  return (closestSegmentId == null) ? null : {
    dist: closestDist,
    segmentID : closestSegmentId
  }
}

function findAnyNeighbouringPixelIndex(pixelIndex,segmentID)
{
  let x = pixelIndex % _w;
  let y = Math.floor( pixelIndex / _w);

  //  let offsets = [[-1,0],[1,0],[0,1],[0,-1], [-1,1],[1,-1],[-1,-1],[1,1]];
  const offsets = [[-1,0],[1,0],[0,1],[0,-1]];
  for(let i = 0; i< offsets.length;++i)
  {
    //let c = getColourAsHex(x + offsets[i][0], y + offsets[i][1],src,w,h);
    let ix  = x + offsets[i][0];
    let iy  = y + offsets[i][1];
    ix = Math.max(Math.min(ix,_w-1),0);
    iy = Math.max(Math.min(iy,_h-1),0);
    let id = _idmap[iy*_w + ix];
    if( id != segmentID) return  iy*_w + ix;
  }
  return null;
}

function getSegmentBoundingBox(segment)
{
  let n = segment.length;
  let minx = 9999999;
  let miny = 9999999;
  let maxx = -99999999;
  let maxy = -99999999;

  for(let i =0; i < n;++i)
  {
    let ix = segment[i];
    let x = ix % _w;
    let y = Math.floor(ix / _w);
    minx = Math.min(minx,x);
    miny = Math.min(miny,y);
    maxx = Math.max(maxx,x);
    maxy = Math.max(maxy,y);


  }
  return {x: minx, y: miny, width: maxx- minx + 1, height: maxy- miny + 1};
}

// starting at startp,
function getThicknessAlongADirection(boundingBox, segmentID, sliceStartp, sliceDelta, delta)
{
  let count;
  let nextSliceAvailable = true;
  let maxThickness = 0;
  //console.log("getThicknessAlongADirection", boundingBox, segmentID);

  while(nextSliceAvailable)
  {
    let reachedTheEnd = false;
    let p ={x: sliceStartp.x, y: sliceStartp.y};
    count = 0;
    while(!reachedTheEnd)
    {
      let ix = p.x + p.y*_w;
      if(boundingBox.width < 10){
        //  console.log("p" ,p );

      }
      if(_idmap[ix] == segmentID){
        count++;
      }
      else if(count > 0)
      {
        // reached the end, test it and then reset count
        maxThickness = Math.max(maxThickness, count);
        count = 0;
      }
      p.x += delta.x;
      p.y += delta.y;
      // test if out of bounds
      if(!isPointInsideBoundingBox(p, boundingBox))
      {
        if(boundingBox.width < 10){
          // console.log("!isPointInsideBoundingBox", p );
        }
        // reached the end, test it and then reset count
        reachedTheEnd = true;
        maxThickness = Math.max(maxThickness, count);
        count = 0;
      }

    }

    // test
    sliceStartp.x += sliceDelta.x;
    sliceStartp.y += sliceDelta.y;
    if(!isPointInsideBoundingBox(sliceStartp, boundingBox))
    {
      // reached the end, test it and then reset count
      nextSliceAvailable = false;
    }
  }
  return maxThickness;
}

function isPointInsideBoundingBox(p, boundingBox)
{
  return(p.x >= boundingBox.x) &&
    (p.x < (boundingBox.x + boundingBox.width)) &&
    (p.y >= boundingBox.y) &&
    (p.y < (boundingBox.y + boundingBox.height))
}

// get the maximum length in x or y
function getSegmentThickess(segmentID, skipDiagonalSearch = false)
{
  let segmentIndexList = segmentMap[segmentID];
  let bb = getSegmentBoundingBox(segmentIndexList);

  let vals = [];
  let across = getThicknessAlongADirection(bb, segmentID, {x:bb.x, y:bb.y},{x:0, y:1}, {x:1, y:0});
  vals.push(across);
  let down = getThicknessAlongADirection(bb, segmentID, {x:bb.x, y:bb.y}, {x:1, y:0}, {x:0, y:1});
  vals.push(down);

  if(!skipDiagonalSearch)
  {
    let diagonalDownLeftSide = getThicknessAlongADirection(bb, segmentID, {x:bb.x, y:bb.y}, {x:0, y:1}, {x:1, y:1});
    diagonalDownLeftSide = Math.sqrt( 2*diagonalDownLeftSide*diagonalDownLeftSide);
    let diagonalDownTopSide = getThicknessAlongADirection(bb, segmentID, {x:bb.x, y:bb.y}, {x:1, y:0}, {x:1, y:1});
    diagonalDownTopSide = Math.sqrt( 2*diagonalDownTopSide*diagonalDownTopSide);
    vals.push(Math.max( diagonalDownTopSide, diagonalDownLeftSide));
    let diagonalUpLeftSide = getThicknessAlongADirection(bb, segmentID, {x:bb.x, y:bb.y}, {x:0, y:1}, {x:1, y:-1});
    diagonalUpLeftSide = Math.sqrt( 2*diagonalUpLeftSide*diagonalUpLeftSide);
    let diagonalUpBottomSide = getThicknessAlongADirection(bb, segmentID, {x:bb.x, y:bb.y + bb.height-1}, {x:1, y:0}, {x:1, y:-1});
    diagonalUpBottomSide = Math.sqrt( 2*diagonalUpBottomSide*diagonalUpBottomSide);
    vals.push(Math.max( diagonalUpLeftSide, diagonalUpBottomSide));
  }

  let resultVal = across;
  for(let i =0; i < vals.length;++i)
  {
    resultVal = Math.min(resultVal, vals[i]);
  }
  /*
console.log("getSegmentThickess bb", segmentID,  bb);
console.log("getSegmentThickess across", segmentID,  across);
console.log("getSegmentThickess down", segmentID,  down);
console.log("getSegmentThickess diagonalDownLeftSide", segmentID,  diagonalDownLeftSide);
console.log("getSegmentThickess diagonalDownTopSide", segmentID,  diagonalDownTopSide);
console.log("getSegmentThickess diagonalUpLeftSide", segmentID,  diagonalUpLeftSide);
console.log("getSegmentThickess diagonalUpBottomSide", segmentID,  diagonalUpBottomSide);
*/
  return resultVal;

  /*
  let maxlenDown = 0;
  let maxlenAcross = 0;




  // do each column
  for(let x = bb.x; x < bb.x + bb.width ;++x) {
      let count = 0;
      for(let y = bb.y; y < bb.y + bb.height ;++y) {
          if( _idmap[x + y*_w] == segmentID) count++;
      }
      maxlenDown = Math.max(maxlenDown, count);
  }

  // do each row
  for(let y = bb.y; y < bb.y + bb.height ;++y) {
      let count = 0;
      for(let x = bb.x; x < bb.x + bb.width ;++x) {
          if( _idmap[x + y*_w] == segmentID) count++;
      }
      maxlenAcross = Math.max(maxlenAcross, count);
  }

  // do a diagonal
  for(let y = bb.y; y < bb.y + bb.height ;++y) {
    let count = 0;
    for(let x = bb.x; x < bb.x + bb.width ;++x) {
      if( _idmap[x + y*_w] == segmentID) count++;
    }
    maxlenAcross = Math.max(maxlenAcross, count);
  }

  return Math.min(maxlenAcross, maxlenDown);

   */
}

// clears all the ids from a segment
// assumes segment map is up to date
function clearIndexArray(ixs, clearID = 0)
{
  if(ixs)
  {
    for(let i =0; i < ixs.length;++i)
    {
      let ix= ixs[i];
      //let x = ix % _w;
      //let y = Math.floor(ix / _w);
      _idmap[ix] =clearID;
    }
  }
}

function getSegmentCount(id)
{
  if(segmentMap[id]) {
    return segmentMap[id].length;
  }
  return 0;
}

/*
function fillInGapsOnFullMap(basemapImageData, extraRoadThickness)
{
    let data = basemapImageData.data;

    // clear fatter roads
    replaceIDs(-1, 0);
    // set the orginal thin roads, use the colour which covers a thin line with non full red values??
    drawRoadToIDMap(data , 40);
    drawWaterToIDMap(data);
    //
    removeSmallSegments();
    //
    // inflate segments to close gaps
    growSegments(extraRoadThickness + 2);

  // rerdraw roads without antialiasing
  replaceIDs(-1, 0);
  drawRoadToIDMap(data , 255);

 removeSmallSegments(); // remove all the small bits

  // try growing segment here to ?
  growSegments(1);

  // Fill in gaps
  floodFillGapsInExistingSegments();


    // fill in remaining segments
   doFloodFillSegmenting();


    // applyfinal  grow to overlap anti aliasing
    //replaceIDs(-1, 0);
    //growSegments(2);

}
 */



// do flood fill in the gaps on existing segments
function floodFillGapsInExistingSegments(){
  console.log("floodFillGapsInExistingSegments");
  let n = _w*_h;
  for(let i =0; i < n;++i) {
    x = i % _w;
    y = Math.floor(i / _w);
    let neighbourSegmentID = isNeighbourToASegment(x,y);
    if(  (_idmap[i] == 0) && (neighbourSegmentID != null ) && (neighbourSegmentID > 0 )) {
      doFloodFill(x, y, _w, _h, neighbourSegmentID, 0);
    }
  }
}

let _gapsidmap = []; //temp map for drawing gaps between segments too. requires an extra map as we do a 1 pixel expand and help trace the outside
let _debugPixelColourMap = []; // debug colour map ontop to test extra processing

function clearGapsIdMap(){
  let n = _w * _h;
  let gapix = 0;
  for (let i = 0; i < n; ++i) {
    _gapsidmap[i] = 0;
  }
}

function clearDebugPixelColourMap(){
  _debugPixelColourMap = [];
}

function clearGapIds(){
  let n = _w * _h;
  for (let i = 0; i < n; ++i) {
    if(_idmap[i]  <= SEGMENT_GAP_START_INDEX){
      _idmap[i] = 0;
    }
  }
}


function findGapsBetweenTwoOrMoreSegments() {

  console.log("findGapsBetweenTwoOrMoreSegments");
  //_startreIndex = REINDEX_STARTIN_INDEX;
  //do floodFill of the remaining gaps
  clearGapsIdMap();
  let n = _w * _h;
  let gapix = 0;
  for (let i = 0; i < n; ++i) {
    x = i % _w;
    y = Math.floor(i / _w);
    if ((_idmap[i] == 0)) {
      let tempid = SEGMENT_GAP_START_INDEX - gapix;
      gapix++;
      doFloodFill(x, y, _w, _h, tempid, 0);
      console.log("tempid", tempid);
    }
  }

  //
  //createSegmentMap();
  removeSmallSegmentsByCount(3);

  // find gaps that touch 2 or more segments
  createSegmentMap();
  let segmentIDs = Object.keys(segmentMap);

  // count how many are required to be processed
  let debugcountTotal =0;
  for (let i = 0; i < segmentIDs.length; ++i) {
    let segmentID = segmentIDs[i];
    if ((segmentID <= SEGMENT_GAP_START_INDEX) &&  segmentMap[segmentID]) {
      debugcountTotal++;
    }
  }

  // copy ids across to temp idmap - use this one to expand by 1 pixel
  n = _w * _h;
  for (let i = 0; i < n; ++i) {
    _gapsidmap[i] = _idmap[i];
  }

  // go through each pixel and see if theres any gap that neighbours a segment, capture the count.
  // we are intereted in counts of 2 or more. a count of 0 = standalone segment.
  let neighbourCountMap = {};
  for(let x =1; x < _w -1; ++x)
  {
    for(let y =1; y < _h -1; ++y)
    {
      let ix = x +y*_w;
      let segmentID= _idmap[ix];
      if ((segmentID <= SEGMENT_GAP_START_INDEX) ) {
        let neighbourSegmentID = isNeighbourToASegment(x,y);
        if((neighbourSegmentID != null) && (neighbourSegmentID > 0))
        {
          if(neighbourCountMap[segmentID] == null)
          {
            neighbourCountMap[segmentID] = {};
          }
          if(neighbourCountMap[segmentID][neighbourSegmentID] == null)
          {
            neighbourCountMap[segmentID][neighbourSegmentID] = 0;
          }
          neighbourCountMap[segmentID][neighbourSegmentID]++;
        }
        else if( (neighbourSegmentID == 0) || (neighbourSegmentID == null))
        {
          if(neighbourCountMap[segmentID] == null )
          {
            neighbourCountMap[segmentID] = {};
          }
        }

      }
    }
  }

  // go through each one and make a list of gaps to process, these neighbour 2 or more segments
  let gapsToProcess = [];
  let neighbourCountMapKeys = Object.keys(neighbourCountMap);
  for(let i =0; i< neighbourCountMapKeys.length;++i) {
    let segmentID = Number.parseInt(neighbourCountMapKeys[i]);
    console.log("segmentID: ", segmentID);
    let counts = neighbourCountMap[segmentID];
    let countsKeys = Object.keys(counts);
    console.log("countsKeys: ", countsKeys);

    if (countsKeys.length <= 1) {
      console.log("clear: ", segmentID);
      clearIndexArray(segmentMap[segmentID]);

    } else if (countsKeys.length >= 2) {
      gapsToProcess.push(segmentID);
    }
  }
  console.log("gapsToProcess count", gapsToProcess.length);




  for(let i =0; i< gapsToProcess.length;++i){
    let segmentID = gapsToProcess[i];
    // grow the segment so that the outer pixels can be captured
    growSingleSegment(segmentID, _gapsidmap);
    // get the pixel indicies of the outr border
    let borderPixelIndexes = getBorderPixels(segmentID, _gapsidmap);
    // get the segment ids that lies on the border
    let borderIDs = getSegmentIdsForBorderPixels(borderPixelIndexes , _idmap);
    //// get the number of segments (not road or water) that lies on the pixel border. 0 = road/water,  1 = hole , 2 or more = gap between segments
    console.log("segmentID", segmentID);
    let segmentIds = getSegmentIdsInBorder(borderIDs, segmentID);
    let segmentCount =segmentIds.length;

    if (segmentCount == 2){ // >= 2
      //  indicates a gap between 2 segments
      // get the 2 road/water lines
      let edgelines = getEdgeLinesBetweenSegments(borderIDs , borderPixelIndexes, segmentID);
      console.log("edglines.length", edgelines.length);
      if(edgelines.length == 2)
      {
        // should be 2 in the common case
        //reverse the second line so we can trace down 2 lines in the same direction
        edgelines[1].reverse();
        let line0 = edgelines[0];
        let line1 = edgelines[1];
        debugDrawIndices(line0,[100,100,100]);
        debugDrawIndices(line1, [100,100,0]);
        // aim to find the smallest distance between the lines
        let shortestLine =  findShortestDistanceBetween2Paths(line0,line1);
        console.log("shortestLine",shortestLine);
        let p0 = shortestLine.p0;
        let p1 = shortestLine.p1;
        // debug draw line
        // debugDrawLineBetween2Points(p0,p1, [255,255,255]);

        //clear it
        clearIndexArray(segmentMap[segmentID]);
        // draw line for cut
        let linepixelIds = getLinePixels(p0.x, p0.y,p1.x, p1.y);
        drawPixelArrayOnMapExcludingRoadWater(linepixelIds, -3);
        // draw back the

        _startreIndex = reIndexSegmentsAroundCut(linepixelIds , _startreIndex);
        // clear the segmetns
        //clearSegmentsAroundCut(linepixelIds , 0);
      }
      else if(edgelines.length == 1)
      {
        // this is a traiangle
      }
    }

    //console.log("---------------borderPixelIds length", debugcount + "/" + debugcountTotal , borderPixelIndexes.length, "segmentCount:" , segmentCount );
    //debugcount++;
  }


  // id -3, now contains the cuts.
  // now check if theres any small parts of the segments that have been cut off and remove them.
  // to do this, first find the pixels on the outside edge of the cut.


  // todo - look into this, if its too small, it doesnt remove the cut overlap correctly
  // remove any small bleed overlaps in the cut
  removeSmallSegmentsByCount(20);



  //remove any other non processed gaps

}

function clearSegmentsAroundCut(pixelIds , clearId = 0)
{

  console.log("clearSegmentsAroundCut");

  let offsets = [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];
  for(let i = 0; i < pixelIds.length;++i)
  {
    let baseix = pixelIds[i];
    for(let j = 0 ; j < offsets.length;++j)
    {
      let offset = offsets[j];
      let basex = baseix % _w;
      let basey = Math.floor(baseix / _w);
      let x = basex + offset[0];
      let y = basey + offset[1];
      let ix = x + y*_w;
      if((_idmap[ix] > 0) /*&& (_idmap[ix] < START)*/ )
      {
        console.log("clearSegmentsAroundCut", ix);
        // refill this
        doFloodFill(x,y, _w,_h, clearId, _idmap[ix] );
        // startreIndex++;
      }
    }
  }
//  return startreIndex;
}


function reIndexSegmentsAroundCut(pixelIds , startreIndex)
{
  let START = startreIndex;

  let offsets = [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];
  for(let i = 0; i < pixelIds.length;++i)
  {
    let baseix = pixelIds[i];
    for(let j = 0 ; j < offsets.length;++j)
    {
      let offset = offsets[j];
      let basex = baseix % _w;
      let basey = Math.floor(baseix / _w);
      let x = basex + offset[0];
      let y = basey + offset[1];
      let ix = x + y*_w;
      if((_idmap[ix] > 0) && (_idmap[ix] < START) )
      {
        // refill this
        doFloodFill(x,y, _w,_h, startreIndex,_idmap[ix] );
        startreIndex++;
      }
    }
  }
  return startreIndex;
}


function  removeOverlappingCornerPixels(cornerMap) {
  let pixels = Object.keys(cornerMap);
  for(let i = 0; i< pixels.length;++i)
  {
    let corners = cornerMap[pixels[i]];
    if(corners.length > 1)
    {
      for(let j = 0; j < corners.length;++j)
      {
        let corner = corners[j];
        console.log("remove corner", corner);
        removeSegmentsFromCorner(corner);
      }
      delete cornerMap[pixels[i]];

    }
  }
  return cornerMap;
}

function removeSegmentsFromCorner(corner, clearID = 0)
{
  let pixels = getCorner4Grid(corner.topleftIndex);
  for(let i =0; i < pixels.length;++i)
  {
    let ix = pixels[i];
    if(_idmap[ix] > 0 )
    {
      _idmap[ix] = 0;
    }
  }
}

function straightenSegmentBoundaryLines(srcImageData)
{
  console.log("straightenSegmentBoundaryLines");
  let corners= findCornersBetween2SegmentsAndRoad();
  console.log("corners, " ,corners);
  let cornerMap = createCornerMap(corners);
  console.log("cornerMap, " ,cornerMap);

  // remove any overlapping pixels that causes prolbems when walking around the segments and refresh
  removeOverlappingCornerPixels(cornerMap);
  createSegmentMap();
  corners= findCornersBetween2SegmentsAndRoad();
  cornerMap = createCornerMap(corners);
  console.log("corners after reemoveoverlaps, " ,corners);
  console.log("cornerMap, " ,cornerMap);


  // group the corners with the same segmentID.  These are usually pairs, but may also include groups of 3 or more
  let groups = groupCornersTogether(cornerMap, corners);
  console.log("groups ", groups);




  let cuts = [];
  // process each group, if it a pair, then leave it alone
  // if its 3 or more then it forms a loop so find one of the lines in the loop to remove.  The segment behind this line will fill the gap.
  //for(let k =4; k < 5;++k) // test with one for now
  for(let k =0; k< groups.length;++k)
  {
    console.log("cutgroup " + k + "/ " + groups.length);
    let cornerPairs = groups[k];
    if(cornerPairs.length <= 2)
    {

      let pair = cornerPairs[0];
      console.log("cutgroup pair before process: ", pair);

      let cut = processCornerPair(pair.corner0,pair.corner1, true);
      if(cut) {
        cuts.push({
          line: cut,
          segmentID: pair.segmentID,
          otherSegmentID: pair.otherSegmentID,
          corner0: pair.corner0,
          corner1: pair.corner1,

        });
      }
    }
    else if(cornerPairs.length >= 3)
    {
      // process the first one to test
      //for(let i =0; i< 1;++i) {
      let cutobjs = [];

      for(let i =0; i< cornerPairs.length;++i) {

        let pair = cornerPairs[i];
        let cut = processCornerPair(pair.corner0, pair.corner1, true);

        if(cut) {
          // segmentID behind this cut:
          // debug draw
          let linepixelIds = getLinePixels(cut.p0.x, cut.p0.y, cut.p1.x, cut.p1.y);
          debugDrawIndices(linepixelIds, [0, 0, 100]);

          //-------------------------------------
          // try do a walk from the new segment
          let startPixelIndex0 = linepixelIds[0];
          debugDrawIndices([startPixelIndex0], [0, 200, 0]);
          // this pixel should be on onthe road
          // look for the start offset pixel that surrounds this
          let offset9grid0 = find9GridOffsetForNonRoadPixel(startPixelIndex0);
          // do walk
          // console.log("---------------- offset9grid", offset9grid0);
          //   console.log("---------------- startPixelIndex", startPixelIndex0);
          let roadpath0 = null;
          if (offset9grid0 != null) {
            roadpath0 = walkAlongRoadWaterAntiClockwise(startPixelIndex0, offset9grid0, 7);
            debugDrawIndices(roadpath0, [100, 0, 0]);
          }
          //-------------------------------------

          //-------------------------------------
          // try do a walk from the new segment
          let startPixelIndex1 = linepixelIds[linepixelIds.length - 1];
          // this pixel should be on onthe road
          // look for the start offset pixel that surrounds this
          let offset9grid1 = find9GridOffsetForNonRoadPixel(startPixelIndex1);
          // do walk
          let roadpath1 = null;
          if (offset9grid1 != null) {
            roadpath1 = walkAlongRoadWaterClockwise(startPixelIndex1, offset9grid1, 7);
            debugDrawIndices(roadpath1, [150, 0, 0]);
          }

          let cutObj = {
            cut: cut,
            roadpath0: roadpath0,
            roadpath1: roadpath1,
            segmentID: pair.cornerID,
            otherSegmentID: pair.otherSegmentID,
            corner0: pair.corner0,
            corner1: pair.corner1,
          };
          cutobjs.push(cutObj);
        }
      }

      // now we have a list of cut objects
      // simulate removing each cut, to test which one is best to remove.
      // the ones with the highest angles at the cut edges will appear as a visual notch, so keep these cuts to prevent this.
      // remove the cut that has lowest angles, this will appear smoother.

      let cutToRemoveIndex = null;
      let highestDotProduct = null;
      //for(let i =0; i < 1;++i)
      for(let i =0; i < cutobjs.length;++i)
      {
        let cutobj = cutobjs[i];
        let cut = cutobj.cut;

        let p0 = cut.p0;
        debugDrawPoint(p0,[0,0,255]);
        let lastp0index = cutobj.roadpath0[cutobj.roadpath0.length - 1];
        let lastp0 = convertIndexToPoint( lastp0index);
        debugDrawPoint(lastp0,[0,0,255]);
        let delta0Left = normalisedDeltaBetweenPoints(  lastp0, p0);
        let p0OtherCutIndex = (i + 1) % cutobjs.length;
        let p0OtherCut = cutobjs[p0OtherCutIndex].cut;
        let p0OtherSide = ( distBetweenPoints(p0, p0OtherCut.p1) < 5 ) ? p0OtherCut.p0 : p0OtherCut.p1;
        debugDrawPoint(p0OtherSide,[0,0,255]);
        let delta0Right = normalisedDeltaBetweenPoints(p0OtherSide, p0);
        let dotProduct0 = Math.abs( dotProduct(delta0Left, delta0Right));
        console.log("dotProduct0", dotProduct0);


        let p1 = cut.p1;
        debugDrawPoint(p1,[0,0,255]);
        let lastp1index = cutobj.roadpath1[cutobj.roadpath1.length - 1];
        let lastp1 = convertIndexToPoint( lastp1index);
        debugDrawPoint(lastp1,[0,0,255]);
        let delta1Left = normalisedDeltaBetweenPoints(  lastp1, p1);
        let p1OtherCutIndex = (i - 1 + cutobjs.length) % cutobjs.length;
        let p1OtherCut = cutobjs[p1OtherCutIndex].cut;
        let p1OtherSide = ( distBetweenPoints(p1, p1OtherCut.p0) < 5 ) ? p1OtherCut.p1 : p1OtherCut.p0;
        debugDrawPoint(p1OtherSide,[0,0,255]);
        let delta1Right = normalisedDeltaBetweenPoints(p1OtherSide, p1);
        let dotProduct1 = Math.abs(dotProduct(delta1Left, delta1Right));
        console.log("dotProduct1", dotProduct1);

        let averageDotProduct =  (dotProduct0 + dotProduct1) /2.0;
        if(cutToRemoveIndex == null)
        {
          cutToRemoveIndex = i;
          highestDotProduct = averageDotProduct;
        }
        else{
          if(averageDotProduct > highestDotProduct)
          {
            cutToRemoveIndex = i;
            highestDotProduct = averageDotProduct;
          }
        }

      }


      for(let i = 0; i < cutobjs.length;++i)
      {
        if(i != cutToRemoveIndex)
        {
          cuts.push(
            {
              line: cutobjs[i].cut,
              segmentID: cutobjs[i].segmentID,
              otherSegmentID: cutobjs[i].otherSegmentID,
            });
        }
      }
      if(cutToRemoveIndex != null)
      {
        console.log("cutToRemoveIndex", cutToRemoveIndex);
        console.log("highestDotProduct", highestDotProduct);
      }
    }
  }

  // todo do any final adjusting of the cuts here, before drawing it
  // todo - look for a sharp point around each cut point
  console.log("cuts", cuts);

  let extraLines = [];
  //
  // test with first cut
  //if(false){
  for(let k = 0; k< cuts.length;++k ){
    let initialCutObj = cuts[k];
    let initialCutp0 = initialCutObj.line.p0;
    let initialCutp1 = initialCutObj.line.p1;
    console.log("initialCutObj", initialCutObj);
    console.log("initialCutp0", initialCutp0);
    console.log("initialCutp1", initialCutp1);

    // todo find the segmentIds at a corner, find whats on the elft and right
    let corner0 = initialCutObj.corner0;
    let corner1 = initialCutObj.corner1;



    let initialCutDist = distBetweenPoints(initialCutp0,initialCutp1);
    let roadpath0 = getRoadPathAroundRoadPoint(initialCutp0, 30);
    let roadpath1 = getRoadPathAroundRoadPoint(initialCutp1, 30);
    let roadPoints0 = convertIndexesToPoints(roadpath0);
    let roadPoints1 = convertIndexesToPoints(roadpath1);

    debugDrawIndices(roadpath0, [0,0,200]);
    debugDrawIndices(roadpath1, [0,200,200]);
    //console.log("roadpath0", roadpath0);

    let angles0 =  getAnglesForPathPoints(roadPoints0);
    // angles = [-0.2,-0.2,-0.2,-0.2,-0.2,2,2,2,2,0,0,0,2,2,2,2,2,0,0,-2,2,2,2,2,0,2,2,0,0,0,0,-1,-1,-1,-1,-1,null,null,null];
    let curveSections0 =  findCurveSections(angles0);
    // console.log("curveSections0", curveSections0);
    let endOfRoadShapes0 = findEndOfRoadShapes(curveSections0, roadPoints0, srcImageData);
    // console.log("endOfRoadShapes0", endOfRoadShapes0);

    let angles1 =  getAnglesForPathPoints(roadPoints1);
    let curveSections1 =  findCurveSections(angles1);
    let endOfRoadShapes1 = findEndOfRoadShapes(curveSections1, roadPoints1, srcImageData);

    // todo 3 cases: End->Straight, Straight->Straight ,  ( End->End?)
    // todo detect straight edge (sample at point, delta vector, )
    // todo find a close end of road point if one exists, if not use as it.
    // todo on the other side: find a end of road point, thats close by. otherwise start sampling along close road points

    //  find if theres a sharp corner nearby one
    let MAX_CORNER_DIST = 8;
    let closeEndOfRoadShape0 = findClosestEndOfRoadPoint(initialCutp0, endOfRoadShapes0, MAX_CORNER_DIST);
    let closeEndOfRoadShape1 = findClosestEndOfRoadPoint(initialCutp1, endOfRoadShapes1, MAX_CORNER_DIST);
    //console.log("closeEndOfRoadShape0",closeEndOfRoadShape0);
    //console.log("closeEndOfRoadShape1",closeEndOfRoadShape1);

//    return;

    if((closeEndOfRoadShape0 == null) && (closeEndOfRoadShape1 == null))
    {
      //CASE: NO CORNERS, TRY STRAIGHTENING UP

      console.log("2 straight edges. initialCutObj" , initialCutObj);
      //console.log("roadPoints0" , roadPoints0);

      // todo the direction vector at initialCutp0, initialCutp1
      let directionVector0 = getDirectionVectorOnPath(Math.floor(roadPoints0.length/2), roadPoints0, 8);
      let directionVector1 = getDirectionVectorOnPath(Math.floor(roadPoints1.length/2), roadPoints1, 8);
      directionVector1 = getReversedVector(directionVector1);

      console.log("directionVector0" , directionVector0);
      console.log("directionVector1" , directionVector1);

      let averageDirection = getAverageVector(directionVector0, directionVector1);

      averageDirection = get90degreeNormalVector(averageDirection);
      console.log("averageDirection" , averageDirection);

      //getDirectionVectorOnPath()
      // todo do a cut from one of the points to the next
      let newcut = getCutLineClosestToDirection(initialCutp0, averageDirection, roadPoints1);
      if (newcut != null) {
        let p0 = newcut.line.p0;
        let p1 = newcut.line.p1;

        if(distBetweenPoints(p0,p1) <= initialCutDist*1.3 ){
          debugDrawLineBetween2Points(p0, p1, [255, 255, 0]);
          // todo switch out line points
          initialCutObj.line.p0 = p0;
          initialCutObj.line.p1 = p1;
        }


      }
      //let p0 = roadPoints0[endOfRoadStraightPart0.startIndex];
      //let p1 = roadPoints0[endOfRoadStraightPart0.endIndex];

    }
    else if(((closeEndOfRoadShape0 != null) && (closeEndOfRoadShape1 == null)) || ((closeEndOfRoadShape0 == null) && (closeEndOfRoadShape1 != null)))   // one corner
    {
      // let lineSegmentID = leftSegmentID0; // left side of the line, from the end of road side

      // CASE: ONE CORNER
      // do a new line cut from the corner point

      if(closeEndOfRoadShape0 == null)
      {
        // swap it so the closeEndOfRoadShape0 is the corner one
        let temp = closeEndOfRoadShape0;
        closeEndOfRoadShape0 = closeEndOfRoadShape1;
        closeEndOfRoadShape1 = temp;

        temp = roadPoints0;
        roadPoints0 = roadPoints1;
        roadPoints1 = temp;

        temp = roadpath0;
        roadpath0 = roadpath1;
        roadpath1 = temp;

        // lineSegmentID = leftSegmentID1;
      }


      let newcut = doCornerToRoadCut(closeEndOfRoadShape0.midPoint, closeEndOfRoadShape0.left, closeEndOfRoadShape0.center, closeEndOfRoadShape0.right, roadPoints0, roadPoints1);
      console.log("newcut", newcut);
      if (newcut != null) {
        let p0 = newcut.line.p0;
        let p1 = newcut.line.p1;

        if(distBetweenPoints(p0,p1) <= initialCutDist*1.3 ){
          debugDrawLineBetween2Points(p0, p1, [255, 255, 100]);
          // todo switch out line points
          initialCutObj.line.p0 = p0;
          initialCutObj.line.p1 = p1;
          // initialCutObj.lineSegmentID = lineSegmentID; // set the lineSegmentID to draw

          // mid point may non be touching the edge of the road so make another line to close the potential gap between midPoint and the closest roadpoints
          let closestRoadPoint = getClosestRoadPoint(closeEndOfRoadShape0.midPoint, roadPoints0);
          console.log("closestRoadPoint", closestRoadPoint);
          let extralinepixelIds = getLinePixels(closestRoadPoint.x, closestRoadPoint.y, closeEndOfRoadShape0.midPoint.x, closeEndOfRoadShape0.midPoint.y);
          let linepixelIds = getLinePixels(p0.x, p0.y,p1.x, p1.y);
          // console.log("extralinepixelIds", extralinepixelIds);
          // console.log("linepixelIds", linepixelIds);
          linepixelIds = extralinepixelIds.concat(linepixelIds);
          //console.log("linepixelIds", linepixelIds);
          let cleanedlinePixelIDs = [];
          for(let ii = 0; ii < linepixelIds.length;++ii)
          {
            if(ii ==0 )
            {
              cleanedlinePixelIDs.push(linepixelIds[ii]);
            }
            else if(cleanedlinePixelIDs[cleanedlinePixelIDs.length-1] != linepixelIds[ii]) {
              cleanedlinePixelIDs.push(linepixelIds[ii]);
            }
          }
          console.log("cleanedlinePixelIDs", cleanedlinePixelIDs);
          initialCutObj.overridelinePixelIDs = cleanedlinePixelIDs;

        }


      }
    }
    else{
      // both sides have a end of road point, gap between between between
      console.log("here 2 endofroadshapes exists..");
      // todo check if they face each other..?

    }
  }

  //return;


  console.log("here");

  //todo - once adjusted, for each endpoint.  do a search along the other path for a right angle.

  // clearDebugPixelColourMap();


  //for(let i =2; i < 3;++i)
  for(let i =0; i < cuts.length;++i)
  {
    let cutline = cuts[i];
    let p0 = cutline.line.p0;
    let p1 = cutline.line.p1;
    let linepixelIds = (cutline.overridelinePixelIDs != null) ? cutline.overridelinePixelIDs: getLinePixels(p0.x, p0.y,p1.x, p1.y);
    drawPixelArrayOnMapExcludingRoadWater(linepixelIds, -3);

    debugDrawIndices(linepixelIds, [255,0,255]);
    // todo - instead of/additional to reindexing, remove all segments around the cut?
    _startreIndex = reIndexSegmentsAroundCut(linepixelIds , _startreIndex);
    // clearSegmentsAroundCut(linepixelIds, 0); // test this

  }


// todo - check if needed? this is currently used to remove the overlaps
  removeSmallSegmentsByCount(250);

  console.log("here 1");
  floodFillGapsInExistingSegments();
  console.log("here 2");
  console.log("cuts", cuts);

  //clearDebugPixelColourMap();

  createSegmentMap();
  // get the segmentIDs around the gap - do this after floodfill
  for(let i =0; i < cuts.length;++i){
    if(i % 10==0){
      console.log("cut" , i , "/" , cuts.length);
    }
    let cut = cuts[i];
    let p0 = cut.line.p0;
    let p1 = cut.line.p1;
    let linepixelIds = (cut.overridelinePixelIDs != null) ? cut.overridelinePixelIDs: getLinePixels(p0.x, p0.y,p1.x, p1.y);
    // append to object for later
    let segments = getSegmentIDsAroundCut(linepixelIds);
    cut.segmentIDs = segments;
    if(cut.segmentIDs.length > 0) {
      let segmentID = segments[0].segmentID;
      // fill it in
      drawPixelArrayOnMapExcludingRoadWater(linepixelIds, -3);

      // later on we will draw the antialised line over it
    }
    //createSegmentMap();
    // added this
    for(let k =0; k < cut.segmentIDs.length;++k){
      console.log("segmentIDs around cut k", k,"/",cut.segmentIDs.length ,  "id:", cut.segmentIDs[k]  );
      let indexArray = segmentMap[cut.segmentIDs[k].segmentID];
      console.log("indexArray null", indexArray == null );

      if(indexArray ) {
        replaceIDsForIndexArray(indexArray , 0);
      }
    }
  }
  //return;
  console.log("here 3");

  // do this first to patch an neighbouring gaps
  floodFillGapsInExistingSegments();
  // then do this to fill in any isolated gaps beside cuts
  doFloodFillSegmenting();

  console.log("here 4");

  //remove the cuts in the map
  replaceIDs(-3, 0);
  clearGapIds();
  console.log("here 5");

  // replace cuts with the neighbour segment values
  floodFillGapsInExistingSegments();
  console.log("here 6");

  // add back anything missing
  doFloodFillSegmenting();

  // draw the cuts in the segment ID colour if it exists (this is mainly for endOfRoadpoints)
  for(let i =0; i < cuts.length;++i) {
    let cut = cuts[i];
    let p0 = cut.line.p0;
    let p1 = cut.line.p1;
    //console.log("cut.line.p0", cut.line.p0);
    //console.log("cut.line.p1", cut.line.p1);

    //let segmentID = findLeftSegmentClockwise(corner);
    let linepixelIds = (cut.overridelinePixelIDs != null) ? cut.overridelinePixelIDs : getLinePixels(p0.x, p0.y, p1.x, p1.y);
    // todo try to find the new corner around the point
    let newlineCorner = null;

    if(linepixelIds.length>= 1) {
      let pixelId = linepixelIds[1];
      // search the 4 options around this point
      let offsets = [[-1,-1],[0,-1],[0,0],[-1,0]];
      let basex = pixelId % _w;
      let basey =Math.floor( pixelId / _w);
      for(let j = 0; j < offsets.length;++j )
      {
        let x = basex + offsets[j][0];
        let y = basey + offsets[j][1];
        let cornerToCheck = isCornerBetween2SegmentsAndRoad(x,y, 0); // doesnt matter what the corner id is



        if(cornerToCheck.isCorner)
        {
          let cornerIDsDebug = createIdGridForCorner(cornerToCheck);
          console.log("cornerIDsDebug" , cornerIDsDebug);

          newlineCorner = cornerToCheck;
          break;
        }
      }
    }

    console.log("newlineCorner", newlineCorner);
    if(newlineCorner)
    {

      //debugDrawIndices([newlineCorner.topleftIndex],[255,255,255]);
      let lineSegmentID = findLeftSegmentClockwise(newlineCorner);
      if(lineSegmentID != null)
      {
        // fill in with the segment
        // drawPixelArrayOnMapExcludingRoadWater(linepixelIds, lineSegmentID);
        cut.segmentID = lineSegmentID;
        cut.otherSegmentID = findOtherSegmentIDInCorner(newlineCorner, lineSegmentID);
        console.log("here1 otherSegmentID ", cut.otherSegmentID);
      }
    }
    else{
      // use the original corner to update the segmentID and othersegmentID
      let corner = cut.corner0;
      let lineSegmentID = findLeftSegmentClockwise(corner);
      cut.segmentID = lineSegmentID;
      cut.otherSegmentID = findOtherSegmentIDInCorner(corner, lineSegmentID);
      console.log("here use orginal corner, cut.otherSegmentID", cut.otherSegmentID);

    }

    // todo find segmentID

    // drawPixelArrayOnMapExcludingRoadWater(linepixelIds, segmentID);
  }

  return cuts;
}

// step through clockwise to find the segmentIDs on the left and right of line
function findLeftSegmentClockwise(corner){
  let ids = createIdGridForCorner(corner);
  // find the frist segmentID thats infront of a non segment
  for(let i = 0; i < ids.length;++i){
    let id0 = ids[i];
    let id1 = ids[(i + 1) % ids.length];
    if((id0 <= 0)  && (id1 > 0))
    {
      return id1;
    }
  }
}

function findOtherSegmentIDInCorner(corner, excludeSegmentID){
  let ids = createIdGridForCorner(corner);
  console.log("findOtherSegmentIDInCorner" , ids , " excludeSegmentID:", excludeSegmentID);
  for(let i = 0; i < ids.length;++i){
    let id = ids[i];
    if((id > 0) && (excludeSegmentID != id)){
      return id;
    }
  }
  return null;
}


// get the direction vector on path at a particular index
function getDirectionVectorOnPath(ix, pathPoints, sampleOffset){
  let p0 = pathPoints[ Math.max(0,ix - sampleOffset)];

  let p1 = pathPoints[Math.min( pathPoints.length-1 , ix + sampleOffset)];
  return normalisedDeltaBetweenPoints(p0,p1);
}

function convertIndexesToPoints(roadPixels)
{
  let points = [];
  for(let i = 0; i < roadPixels.length; ++i)
  {
    let ix = roadPixels[i];
    let p = {x:ix % _w, y: Math.floor( ix / _w ) };
    points.push(p);
  }
  return points;
}

function getReversedVector(v)
{
  return {x: -v.x, y: -v.y};
}

function get90degreeNormalVector(v)
{
  return {x: -v.y, y: v.x};
}

function getAverageVector(v0,v1)
{
  return  {x: (v0.x +v1.x) /2, y: (v0.y +v1.y)/2 };
}


function findClosestEndOfRoadPoint(initialCutp0, endOfRoadShapes0, maxDistanceAway)
{
  if(endOfRoadShapes0 == null) return null;

  let closestCornerShape0 = null;
  let closestCornerDist = null;
  for(let i =0; i< endOfRoadShapes0.length; ++i) {
    let endOfRoadShape = endOfRoadShapes0[i];
    let cornerPoint = endOfRoadShape.midPoint;
    let dist = distBetweenPoints(cornerPoint, initialCutp0);
    if (dist < maxDistanceAway) {
      if (closestCornerShape0 == null) {
        closestCornerShape0 = endOfRoadShape;
        closestCornerDist = dist;
      }
      else if (dist < closestCornerDist) {
        closestCornerDist = dist;
        closestCornerShape0 = endOfRoadShape;
      }
    }
  }
  return closestCornerShape0;
}

// find the angles between 2 vectors (left and right) of each point. This helps to detect if there is a sharp edge in the road or the a straight portion
// the angle represents the curve. angle 0 = straight, angle PI/2 = right angle
function getAnglesForPathPoints(pathPoints)
{
  // go find a straight path section on each side
  // with a curve inbetween -   path section should be a dot product of -1
  console.log("searchForSharpCornerOnRoad-----");
  let sampleOffsetix = 6;
  let THRESHOLD  = Math.PI/4;
  //let maxix = null;
//  let maxAngle = 0;
  let SAMPLE_OFFSET = 0; // min is 0
  let angles = [];

  for(let i = 0 ; i < pathPoints.length; ++i)
    //for(let i = 4 + SAMPLE_OFFSET; i < pathPoints.length - 4 - SAMPLE_OFFSET; ++i)
  {
    if((i < 4 + SAMPLE_OFFSET) || (i >= pathPoints.length - 4 - SAMPLE_OFFSET) ){
      // not enough points on either side, so do calculate the angle for the end bits
      angles.push(null);
    }
    else {

      // find the angle at this point
      let p0 = getAveragePoint([pathPoints[i - 2 - SAMPLE_OFFSET], pathPoints[i - 3 - SAMPLE_OFFSET], pathPoints[i - 4 - SAMPLE_OFFSET]]);
      let p = getAveragePoint([pathPoints[i + 1], pathPoints[i], pathPoints[i - 1]]);
      let p1 = getAveragePoint([pathPoints[i + 2 + SAMPLE_OFFSET], pathPoints[i + 3 + SAMPLE_OFFSET], pathPoints[i + 4 + SAMPLE_OFFSET]]);
      //  console.log(p0, p, p1);

      let delta0 = normalisedDeltaBetweenPoints(p0, p);
      let delta1 = normalisedDeltaBetweenPoints(p, p1);
      let angle = getSignedAngleBetweenVectors(delta0, delta1);
      angles.push(angle);
      //console.log("deltas", delta0, delta1);
      /*
      console.log("i", i, "angle",  angle);
      if(angle > THRESHOLD)
      {
        debugDrawPoint(pathPoints[i], [255,0,255]);
        angles.push()
      }*/
    }
  }
  return angles;

  //console.log("sharp corner minix found" ,maxix);
  //return maxix;

  // found the points do some clean up to connect
}

let CURVE_TYPE_STRAIGHT = 0;
let CURVE_TYPE_CONCAVE_CURVE = -1;
let CURVE_TYPE_CONVEX_CURVE = 1;

function getCurveType(angle)
{
  let CURVE_THRESHOLD = Math.PI/4; //
  let curveType = null;
  if(angle == null){
    curveType = null;
  }
  else if(angle >= CURVE_THRESHOLD)
  {
    curveType = CURVE_TYPE_CONVEX_CURVE;
  }
  else if(angle <= -CURVE_THRESHOLD)
  {
    curveType = CURVE_TYPE_CONCAVE_CURVE;
  }
  else {
    curveType = CURVE_TYPE_STRAIGHT;
  }
  return curveType;
}

function createIndexRoadMap(roadPoints)
{
  let map = {};
  for(let i = 0; i < roadPoints.length;++i)
  {
    let p = roadPoints[i];
    let ix = p.x + _w*p.y;
    map[ix] = true;
  }
  return map;
}

// get the number of times a potenttial line intersects with a road path.
// this is used to determine if a cut is valid as it shouldnt interesect through the road
// count only the clusters,
function getIntersectionCountWithLineAndRoad(p0,p1)
{
  let count = 0;
  let linePixels = getLinePixels(p0.x, p0.y, p1.x, p1.y);
  let prevIsRoad = false;
  for(let i =0; i< linePixels.length;++i)
  {
    let isRoad = isInsideRoad(linePixels[i]);
    if(isRoad && !prevIsRoad)
    {
      count++;
    }
    prevIsRoad = isRoad;
  }
  return count;
}

// check if a pixel is inside road
function isInsideRoad(baseix)
{
  let offsets = [[-1,0],[1,0],[0,1],[0,-1],[0,0]];
  for(let j = 0 ; j < offsets.length;++j) {
    let offset = offsets[j];
    let basex = baseix % _w;
    let basey = Math.floor(baseix / _w);
    let x = basex + offset[0];
    let y = basey + offset[1];
    let ix = x + y * _w;
    let segmentID = _idmap[ix];
    let isRoadOrWater = (segmentID == -1) || (segmentID == -2);
    if(!isRoadOrWater ){
      return false;
    }
  }
  return true;
}

// get the closet point
function getClosestRoadPoint(targetp, roadPathPoints){
  let minDist = null;
  let minPoint = null;
  for(let i =0; i < roadPathPoints.length;++i)
  {
    let p =roadPathPoints[i];
    let dist = distBetweenPoints(targetp, p);
    if(minDist == null)
    {
      minPoint = p;
      minDist = dist;
    }
    else if(dist < minDist){
      minDist = dist;
      minPoint = p;
    }
  }
  return minPoint;
}

//  create a cut from a corner point to the other Road
function doCornerToRoadCut(midPoint, endOfRoadStraightPart0, endOfRoadCurveSection, endOfRoadStraightPart1, roadPathPoints, otherRoadPathPoints) {


  console.log("doCornerToRoadCut");
  console.log("midPoint" , midPoint);
  // midPoint.x -= 2;


  let cornerPoint =   roadPathPoints[ Math.floor( (endOfRoadCurveSection.startIndex + endOfRoadCurveSection.endIndex) / 2 ) ];
  console.log("cornerPoint" , cornerPoint);


  //get the vector of the  stragith part.  get the average of the 2 sides
  let SAMPLE_OFFSET= 10;
  let p0 = roadPathPoints[ Math.max( endOfRoadStraightPart0.endIndex - SAMPLE_OFFSET,  endOfRoadStraightPart0.startIndex) ];
  let p1 = roadPathPoints[endOfRoadStraightPart0.endIndex];
  let q1 = roadPathPoints[endOfRoadStraightPart1.startIndex];
  let q0 = roadPathPoints[Math.min(endOfRoadStraightPart1.startIndex + SAMPLE_OFFSET, endOfRoadStraightPart1.endIndex) ];
   p0 = getAverageVector(p0,q0);
   p1 = getAverageVector(p1,q1);
  console.log("p1", p1, "p0", p0);

  let targetVector = normalisedDeltaBetweenPoints(p1,p0);
  // todo get the average Vector of the 2 straight part.
  let cut =  getCutLineClosestToDirection(midPoint, targetVector, otherRoadPathPoints);
  return cut;

}

// find a line between curStartPoint and a point on the other road, that aligns most closely with the target vector
function getCutLineClosestToDirection(cutStartPoint, targetVector, otherRoadPathPoints)
{
  let THRESHOLD_DELTA = 1;
  let minDelta = null;
  let minIndex = null;

  // console.log("[getCutLineClosestToDirection] cutStartPoint", cutStartPoint);
  // console.log("[getCutLineClosestToDirection] targetVector", targetVector);

  let tempIndexMap = createIndexRoadMap(otherRoadPathPoints);

  // todo for each point on the other roadpath
  for(let i =0; i < otherRoadPathPoints.length;++i)
  {
    let p = otherRoadPathPoints[i];
    // todo check if there are any collisions with part of the road, if no line-of-sight then ignore
    let nIntersections = getIntersectionCountWithLineAndRoad(p, cutStartPoint, tempIndexMap);
    //console.log("i" , i, "nIntersections", nIntersections);

    if(nIntersections == 0) //
    {
      debugDrawPoint(p, [100,255,255]);
      let checkv = normalisedDeltaBetweenPoints(p, cutStartPoint);
      let angleDelta = Math.abs( getSignedAngleBetweenVectors(checkv, targetVector)) ;

      //  console.log("[getCutLineClosestToDirection] checkv", checkv, "angleDelta", angleDelta);


      if(angleDelta < THRESHOLD_DELTA){
        if(minDelta == null){
          minIndex = i;
          minDelta = angleDelta;
        }
        else if(angleDelta < minDelta){
          minIndex = i;
          minDelta = angleDelta;
        }
      }
    }
  }

  if(minIndex != null){
    return {
      minIndex : minIndex,
      minDelta : minDelta,
      line:  {p0: cutStartPoint, p1: otherRoadPathPoints[minIndex]}
    };
  }
  return null;
}

// look for a convex curve between 2 straight lines
function findEndOfRoadShapes(curveSections, roadPathPoints, srcImageData)
{
  console.log("findEndOfRoadShapes");

  let STRAIGHT_SAMPLE_INDEX_OFFSET = 10; // distance from end of path the point should be sampled to take the direction vector
  let THRESHOLD_PARRALLEL_ANGLE = Math.PI/4;  // max threshold angle for which it can be classified a parralel, ideally this would be 0

  let endsFound = [];
  for(let i = 1; i < curveSections.length-1;++i)
  {
    let left = curveSections[i-1];
    let center = curveSections[i];
    let right = curveSections[i+1];
    if( /*(center.count < CURVE_GAP_FILL_DIST) && */
      (center.curveType == CURVE_TYPE_CONVEX_CURVE) &&
      (left.curveType == CURVE_TYPE_STRAIGHT) &&
      (right.curveType == CURVE_TYPE_STRAIGHT) )
    {

      // check if the angles of the straight parts are simliar, but at 180 degrees to one another
      let leftp0 = roadPathPoints[ left.endIndex];
      let leftp1 = roadPathPoints[ Math.max(0,left.endIndex - STRAIGHT_SAMPLE_INDEX_OFFSET) ];
      let rightp0 = roadPathPoints[  Math.min(roadPathPoints.length -1,right.startIndex + STRAIGHT_SAMPLE_INDEX_OFFSET)];
      let rightp1 = roadPathPoints[ right.startIndex];
      let leftDelta = normalisedDeltaBetweenPoints(leftp0,leftp1);
      let rightDelta = normalisedDeltaBetweenPoints(rightp1,rightp0); // opposite direction
      let angleDiff = getSignedAngleBetweenVectors(leftDelta, rightDelta);
      console.log("angleDiff betwen left and right:", angleDiff);

      debugDrawIndices( getLinePixels(leftp0.x,leftp0.y,leftp1.x,leftp1.y),[255,200,0]);
      debugDrawIndices( getLinePixels(rightp0.x,rightp0.y,rightp1.x,rightp1.y),[255,100,0]);
      if(angleDiff < THRESHOLD_PARRALLEL_ANGLE )
      {

        //   console.log("angles are close to parrellel");
        //
        let SEARCH_DIST = 5;
        let lineLeft = shiftLineToFitRoadEdgeOnSrcImage(srcImageData, lerpPoints(leftp0,leftp1, 0.2 ), leftp1, SEARCH_DIST);
        let lineRight = shiftLineToFitRoadEdgeOnSrcImage(srcImageData, lerpPoints(rightp0,rightp1, 0.2 ), rightp1, SEARCH_DIST);
        let midLine =  { p0: getAverageVector(lineLeft.p0,lineRight.p1), p1: getAverageVector(lineLeft.p1,lineRight.p0)} ;
        // console.log("midline", midLine);

        let DIST = 20;
        let searchvNormal = normalisedDeltaBetweenPoints(midLine.p0,midLine.p1);
        let endSearchP = addVector(midLine.p0,multiplyScalar( searchvNormal, DIST));
        console.log("endSearchP",endSearchP);
        let centerPoint = findRoadEdgePointOnSrcImage(srcImageData, midLine.p0, endSearchP, false );
        console.log("centerPoint",centerPoint);

        // DO 1px offset (1 pixel offset) off center

        // remember to round the pixel value
        if(centerPoint != null) {
          // calculate the centerpoint offset by 1 pixel along the tangent.  this is because the antialaised line will take up about 1 pixel so it sohuldnt be in the center
          let nv = {x: searchvNormal.y * 0, y: -searchvNormal.x* 0};
          centerPoint = {x: Math.round(centerPoint.x + nv.x), y: Math.round(centerPoint.y + nv.y)};
          //console.log("centerPoint offset", centerPoint);
        }


        endsFound.push({
          left: left,
          center: center,
          right: right,
          midPoint: (centerPoint != null)? centerPoint : getMidPointOfCurveSection(center, roadPathPoints)
        });
      }


    }
  }
  return endsFound;
}

// todo - shift the line (along the tangent vector) to better match the edge of the actual road on the srcimage
// will be the same if none are found
function shiftLineToFitRoadEdgeOnSrcImage(srcImageData, p0,p1, SEARCH_DIST = 5){

  console.log("shiftLineToFitRoadEdgeOnSrcImage p0", p0,"p1",p1 );
  // todo sample a few points
  let nsamples = 6; // min is 2
  let points = [];
  for(let i = 0; i < nsamples; ++i){
    let r = i/(nsamples - 1);
    let p = lerpPoints(p0,p1,r);
    console.log("base sample point: ", p );

    let v = normalisedDeltaBetweenPoints(p0,p1);
    let vx = v.x;
    let vy = v.y;
    v.x = -vy;
    v.y = vx;
    v.x *= SEARCH_DIST;
    v.y *= SEARCH_DIST;

    let searchStartp = addVector(p, v);
    let searchEndp = subtractVector(p, v);
    console.log("searchStartp " ,searchStartp );
    console.log("searchEndp " ,searchEndp );

    let gradientGoingUp = false; // todo - make sure this is correct ??
    let point =  findRoadEdgePointOnSrcImage(srcImageData, searchStartp, searchEndp, gradientGoingUp);
    console.log("edgePoint found " ,point );

    points.push(point);

  }

  // console.log("points", points);

  // get angles between points
  console.log("angles between points on line----");
  let vectors = [];
  for(let i = 0 ; i < points.length-1;++i){
    let ep0 = points[i];
    let ep1 = points[i+1];
    if( (ep0 != null) && (ep1 != null) ) {
      let v0 = subtractVector(ep0, ep1);
      vectors.push(v0);
      console.log("v0", v0);
    }
  }

  // cull any points that bend too much - since we only want the straight  part, cull the rest
  let lastStraightIndex = 1;
  for(let i = 1 ; i < vectors.length;++i){
    let a = getSignedAngleBetweenVectors(vectors[0],vectors[i]);
    console.log("a", a);
    if(a <= Math.PI/4){
      lastStraightIndex += 1;
    }
    else{
      break;
    }
  }
  console.log("lastStraightIndex", lastStraightIndex);

  // test with the end points for now,
  // todo change this to finding the line between points - try linear regression algo
  let edgep0 = points[0];
  let edgep1 =  points[lastStraightIndex]; //points[Math.floor(points.length/2)];  // the last edge may


  let edgesFound = (edgep0 != null) && (edgep1 != null);
  if(edgesFound) {
    return {
      p0: edgep0,
      p1: edgep1
    }
  }
  else{
    return {
      p0: p0,
      p1: p1
    }
  }
}

// todo

// todo - find the point on the line where the interpolated road value is 128, this shouuld be the edge
// if none is found then return null
function findRoadEdgePointOnSrcImage(srcImageData, p0, p1, gradientGoingUp=true, TARGET_VALUE = 128)
{
  // todo get a sample of points between p0,p1
  let nsamples = Math.ceil( distBetweenPoints(p0,p1) ) * 2;
  let ROAD_CHANNEL = 0; // r channel
  let values = [];
  for(let i =0; i < nsamples; ++i ){
    // get the bilinearly interpolated value
    let r = i / nsamples;
    let x = p0.x + (p1.x - p0.x)*r;
    let y = p0.y + (p1.y - p0.y)*r;
    let val = getBilinearInterpolatedValue(srcImageData,x,y, ROAD_CHANNEL, true );
    values.push({
      x: x,
      y: y,
      val: val
    });
  }

  //console.log("findRoadEdgePointOnSrcImage values", values);

  // run through the map and find the pixels between 128
  if(gradientGoingUp) {
    for (let i = 0; i < values.length - 1; ++i) {
      if ((values[i].val <= TARGET_VALUE) && (values[i + 1].val >= TARGET_VALUE)) {
        // interpolate the point where the TARGET_VALUE might lie
        let ratio = (TARGET_VALUE - values[i].val )/(values[i+1].val - values[i].val);
        let x = values[i].x + (values[i+1].x - values[i].x)*ratio;
        let y = values[i].y + (values[i+1].y - values[i].y)*ratio;
        return {x:x, y:y};

      }
    }
  }
  else{ // gradient going down
    for (let i = 0; i < values.length - 1; ++i) {
      if ((values[i].val >= TARGET_VALUE) && (values[i + 1].val <= TARGET_VALUE)) {
        // interpolate the point where the TARGET_VALUE might lie
        let ratio = (TARGET_VALUE - values[i+1].val )/(values[i].val - values[i+1].val);
        let x = values[i+1].x + (values[i].x - values[i+1].x)*ratio;
        let y = values[i+1].y + (values[i].y - values[i+1].y)*ratio;
        return {x:x, y:y};
      }
    }
  }
  return null;
}

function getBoxBlurredValue(srcImageData, basex,basey, channelIndex){
  let d= srcImageData.data;
  let offsets = [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];
  let val = 0;
  for(let i =0; i < offsets.length;++i){
    let offset = offsets[i];
    let x =  basex  + offset[0];
    let y = basey  + offset[1];
    x = Math.max(Math.min(x, _w - 1), 0);
    y = Math.max(Math.min(y, _h - 1), 0);
    val += d[4*(y*_w + x) + channelIndex];
  }
  return val/offsets.length;
}

// todo - get interpolated value
function getBilinearInterpolatedValue(srcImageData, x,y, channelIndex, applyBlur = false)
{
  let d = srcImageData.data;
  //console.log("getBilinearInterpolatedValue", x,y, channelIndex);

  let basex = Math.floor(x);
  let basey = Math.floor(y);

  let v00;
  let v10;
  let v01;
  let v11;

  if(applyBlur){
    v00 = getBoxBlurredValue( srcImageData, basex, basey, channelIndex);
    v10 = getBoxBlurredValue( srcImageData, basex+1, basey, channelIndex);
    v01 = getBoxBlurredValue( srcImageData, basex, basey+1, channelIndex);
    v11 = getBoxBlurredValue( srcImageData, basex+1, basey+1, channelIndex);
  }
  else{
    v00 = d[4*( (basey) * _w + basex ) + channelIndex];
    v10 = d[4*( (basey) * _w + basex +1 ) + channelIndex];
    v01 = d[4*( (basey+1) * _w + basex ) + channelIndex];
    v11 = d[4*( (basey+1) * _w + basex +1 ) + channelIndex];
  }

//  console.log("4 pixels", v00, v10,v01, v11 );

  let rx = x - basex;
  let ry = y - basey;
  let a = v00 + (v10 - v00)*rx;
  let b = v01 + (v11 - v01)*rx;
  let ivalue =  a + (b-a)*ry;
  return Math.round( ivalue);
}

function getMidPointOfCurveSection(curveSection, roadPathPoints)
{
  return roadPathPoints[ Math.floor( (curveSection.startIndex + curveSection.endIndex) / 2 ) ];

}

// simplify down the angles to a few types:  -1 = concave curve, 0 = straighter part, 1 = concex curve
function findCurveSections(angles)
{

  console.log("angles.length", angles.length);
  let groups = [];
  ///let curves = [];
  let count = 0;
  let prev = null;
  let startIndex  = 0;
  for(let i =0; i < angles.length;++i)
  {
    let curve = getCurveType(angles[i]);
    count++;
    // console.log("i", i, curve, prev);

    if(((i > 0) && (prev != curve)) || (i == angles.length -1)  ){
      groups.push({
        curveType: prev,
        count: count,
        startIndex: startIndex,
        endIndex: i-1
      });
      count = 0;
      startIndex = i;
      curves = [];
    }
    prev = curve;
  }

  console.log("pre merged groups", groups);

  // straight line gap to fill between 2 curve parts to merge with (as these may be corners)
  let CURVE_GAP_FILL_DIST = 13; //5;
  // go through the groups to find any small straight gaps between curvres, assume this is the center of a curve, if so want to merge it
  for(let i =1; i< groups.length -1;++i)
  {
    let left = groups[i-1];
    let center = groups[i];
    let right = groups[i+1];
    if( (center.count < CURVE_GAP_FILL_DIST) &&
      (center.curveType == CURVE_TYPE_STRAIGHT) &&
      (left.curveType == CURVE_TYPE_CONVEX_CURVE) &&
      (right.curveType == CURVE_TYPE_CONVEX_CURVE) )
    {
      console.log("merge", left,center,right);
      // merge all 3 into one
      let merged = {
        curveType: CURVE_TYPE_CONVEX_CURVE,
        count: left.count + center.count + right.count,
        startIndex: left.startIndex,
        endIndex: right.endIndex
      };
      groups[i-1] = merged;
      groups.splice(i, 2);
      i--;
    }
    else{
      // continue
    }
  }
  return groups;
}

function doAngleListProcessingFor()
{
  for(let i =0; i < 10;++i)
  {

  }
}


function getSignedAngleBetweenVectors(v1,v2)
{
  let angle =  Math.atan2(v2.y,v2.x) - Math.atan2(v1.y,v1.x);
  if (angle > Math.PI)        { angle -= 2 * Math.PI }
  else if (angle <= -Math.PI) { angle += 2 * Math.PI; }
  return angle;
}

function getAveragePoint(points)
{
  let a = {x:0,y:0};
  for(let i =0; i < points.length;++i)
  {
    a.x += points[i].x;
    a.y += points[i].y;
  }
  a.x /= points.length;
  a.y /= points.length;
  return a;
}

function getSegmentIDsOverCut(p0,p1)
{
  let segmentIDCounts = {};
  let pixelIds = getLinePixels(p0.x,p0.y,p1.x,p1.y);
  for(let i = 0; i < pixelIds.length; ++i ){
    let segmentID = _idmap[pixelIds[i]];
    if(segmentIDCounts[segmentID] == null){
      segmentIDCounts[segmentID]= 0;
    }
    segmentIDCounts[segmentID]++;
  }

  // order by most first
  let segments = [];
  let keys = Object.keys(segmentIDCounts);
  for(let i =0; i< keys.length;++i)
  {
    segments.push({
      count: segmentIDCounts[keys[i]],
      segmentID: Number.parseInt( keys[i])
    })
  }
  segments.sort(function (a, b) {
    return b.count - a.count;
  });
  return segments;
}



function getSegmentIDsAroundCut(pixelIds)
{
  let offsets = [[-1,0],[1,0],[0,1],[0,-1]];
  //let offsets = [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];
  let segmentIDCounts = {};
  let visited = {};
  for(let i = 0; i < pixelIds.length;++i)
  {
    let baseix = pixelIds[i];
    for(let j = 0 ; j < offsets.length;++j)
    {
      let offset = offsets[j];
      let basex = baseix % _w;
      let basey = Math.floor(baseix / _w);
      let x = basex + offset[0];
      let y = basey + offset[1];
      let ix = x + y*_w;
      let segmentID = _idmap[ix];
      if((visited[ix] == null) && (segmentID > 0)  )
      {
        visited[ix] = true;
        if(segmentIDCounts[segmentID] == null){
          segmentIDCounts[segmentID]= 0;
        }
        segmentIDCounts[segmentID]++;
      }
    }
  }

  // order by most first
  let segments = [];
  let keys = Object.keys(segmentIDCounts);
  for(let i =0; i< keys.length;++i)
  {
    segments.push({
      count: segmentIDCounts[keys[i]],
      segmentID: Number.parseInt( keys[i])
    })
  }
  segments.sort(function (a, b) {
    return b.count - a.count;
  });


  return segments;
}


function dotProduct(p0,p1)
{
  return ( p0.x*p1.x + p0.y*p1.y );
}

function distBetweenPoints(p0,p1)
{
  let dx = p0.x - p1.x;
  let dy = p0.y - p1.y;
  return Math.sqrt(dx*dx +dy*dy);
}

function lerpPoints(p0,p1,r){
  let x = p0.x + (p1.x - p0.x)*r;
  let y = p0.y + (p1.y - p0.y)*r;
  return {x:x,y:y};
}

function addVector(p,v){
  return {x: p.x + v.x, y: p.y + v.y}
}

function multiplyScalar(v,multiplyAmount){
  return {x:v.x*multiplyAmount, y: v.y*multiplyAmount}
}

function subtractVector(p,v){
  return {x: p.x - v.x, y: p.y - v.y}
}

// normalised
function normalisedDeltaBetweenPoints(p0,p1)
{
  let dx = p0.x - p1.x;
  let dy = p0.y - p1.y;
  let dist = distBetweenPoints(p0,p1);
  if(dist != 0) {
    return {x: dx / dist, y: dy / dist};
  }
  return {x:0,y:0}
}

function convertIndexToPoint(ix)
{
  return {x: ix % _w, y: Math.floor( ix / _w) };
}

function find9GridOffsetForNonRoadPixel(centerix)
{
  let basex = centerix % _w;
  let basey = Math.floor(centerix / _w);
  let offsets = [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];
  for(let i =0; i < offsets.length;++i){
    let offset = offsets[i];
    let x =  basex  + offset[0];
    let y = basey  + offset[1];
    if((x < 0) || (x >= _w)) continue;
    if((y < 0) || (y >= _h)) continue;
    let checkix = x + y*_w;
    if( (_idmap[checkix] != -1) && (_idmap[checkix] != -2) )
    {
      // not road or water
      return i;
    }
  }
  return null;
}

function hasOverlapBetweenPaths(path0Obj, path1Obj)
{
  let path0 = path0Obj.path;
  let path1 = path1Obj.path;
  for(let i = 0; i < path0.length;++i)
  {
    if(path1.indexOf(path0[i]) >= 0){
      return true;
    }
  }
  return false;
}

function reducePathOnEachSide(pathObj, reduceAmountOnEachSide)
{
  let path = pathObj.path;
  let cutIndex = pathObj.startPixelIndex;
  let starti = Math.max(cutIndex, reduceAmountOnEachSide);
  let endi = Math.min(cutIndex, pathObj.length-1 - reduceAmountOnEachSide);
  let newpath = [];
  for(let i =starti; i < endi; ++i)
  {
    newpath.push(path[i]);
  }
  pathObj.path = path;
  return pathObj;
}

// create paths along the edges of the road/water
function processCornerPair(corner0,corner1, doSegmentMidPointCheck = true)
{
  // todo - get the segmentIDs on the corners, there should be at least 2

  console.log("processCornerPair", corner0, corner1);
  let segmentIDs0 = corner0.segmentIDs;
  let segmentIDs1 = corner1.segmentIDs;
  // todo - get the mid point of the segment



  // create paths along the edges of the road/water
  let corner0_4grid = getCorner4Grid( corner0.topleftIndex);
  let corner1_4grid = getCorner4Grid( corner1.topleftIndex);
  let walkdistEachSide= 40;
  let path0Obj = getCornerRoadPath(corner0_4grid, walkdistEachSide);
  let path1Obj = getCornerRoadPath(corner1_4grid, walkdistEachSide);

  let hasOverlap = hasOverlapBetweenPaths(path0Obj, path1Obj);
  //
  console.log("hasOverlap for walk dist",walkdistEachSide, hasOverlap);

  if(hasOverlap) {
    // shorten the walk dist
    console.log("overlap exists for walk dist",walkdistEachSide,  "try shorterning ");
    walkdistEachSide= 10;
    path0Obj = getCornerRoadPath(corner0_4grid, walkdistEachSide);
    path1Obj = getCornerRoadPath(corner1_4grid, walkdistEachSide);
    hasOverlap = hasOverlapBetweenPaths(path0Obj, path1Obj);
    console.log("hasOverlap for walk dist",walkdistEachSide, hasOverlap);
  }


  if(!hasOverlap)
  {
    // reduce down on each side by 5
    path0Obj = reducePathOnEachSide(path0Obj, 8);
    path1Obj = reducePathOnEachSide(path1Obj, 8);

  }
  //console.log("path0 null:", path0 == null, "path1 null:", path1 == null);

  if(!hasOverlap && (path0Obj != null) && (path1Obj != null)) {
    let path0 = path0Obj.path;
    let path1 = path1Obj.path;
    let orig_p0 = {x: path0Obj.startPixelIndex % _w, y: Math.floor(path0Obj.startPixelIndex/ _w)};
    let orig_p1 = {x: path1Obj.startPixelIndex % _w, y: Math.floor(path1Obj.startPixelIndex/ _w)};

    let shortestLine = null;
    if(doSegmentMidPointCheck) {
      let midpoint00 =  getSegmentMidPoint( segmentIDs0[0]);
      let midpoint01 =  getSegmentMidPoint( segmentIDs0[1]);
      //  console.log("midpoint00", midpoint00);
      //  console.log("midpoint01", midpoint01);
      let cutmidpoint = getAverageVector(orig_p0, orig_p1);
      let normalp00 = {x : midpoint00.x +( cutmidpoint.y - midpoint00.y), y:midpoint00.y - ( cutmidpoint.x - midpoint00.x) };
      let normalp01 = {x : midpoint01.x +( cutmidpoint.y - midpoint01.y), y:midpoint01.y - ( cutmidpoint.x - midpoint01.x) };
      // console.log("normalp00", normalp00);
      // console.log("normalp01", normalp01);
      let sign01 = getSideOfTheLinePointIsOn(midpoint01, normalp01, cutmidpoint) ;
      //console.log("sign01",orig_p0, orig_p1, sign01);
      let sign00 = getSideOfTheLinePointIsOn(midpoint00, normalp00, cutmidpoint) ;
      //  console.log("sign00",orig_p0, orig_p1, sign00);


      let bb00 = getSegmentBoundingBox(segmentMap[  segmentIDs0[0] ]);
      let bb01 = getSegmentBoundingBox(segmentMap[ segmentIDs0[1] ]);
      let MIDPOINT_SEGMENT_SIZE_THRESHOLD = 50;
      let large00 = (bb00.width > MIDPOINT_SEGMENT_SIZE_THRESHOLD) || (bb00.height > MIDPOINT_SEGMENT_SIZE_THRESHOLD);
      let large01 =  (bb01.width > MIDPOINT_SEGMENT_SIZE_THRESHOLD) || (bb01.height > MIDPOINT_SEGMENT_SIZE_THRESHOLD);
      // console.log("bb00",bb00);
      // console.log("bb01",bb01);
      // console.log("segmentIDs0[1]",segmentIDs0[1]);
      // console.log("large01",large01);
      large00 = false;
      large01 = false;

      shortestLine = findShortestDistanceBetween2Paths(path0, path1,  (large00) ? null : midpoint00, (large01) ? null : midpoint01, normalp00,normalp01, sign00, sign01);
    }

    if (shortestLine == null) {
      shortestLine = findShortestDistanceBetween2Paths(path0, path1);
    }
    if(shortestLine == null){
      return {
        p0:orig_p0,
        p1:orig_p1
      }
    }
    return shortestLine;
  }

  //default
  if(path0Obj && path1Obj) {
    let orig_p0 = {x: path0Obj.startPixelIndex % _w, y: Math.floor(path0Obj.startPixelIndex / _w)};
    let orig_p1 = {x: path1Obj.startPixelIndex % _w, y: Math.floor(path1Obj.startPixelIndex / _w)};
    return {
      p0: orig_p0,
      p1: orig_p1
    }
  }
  return null;
}

function getSegmentMidPoint(segmentID)
{
  let segment = segmentMap[segmentID];
  let n = segment.length;
  let averageX = 0;
  let averageY = 0;

  for(let i =0; i < n;++i)
  {
    let ix = segment[i];
    let x = ix % _w;
    let y = Math.floor(ix / _w);
    averageX += x;
    averageY += y;
  }
  averageX /= n;
  averageY /= n;
  return {x: averageX , y: averageY};
}

function getCornerRoadPath(corner0_4grid, walkDistEachSide)
{
  // find a road that has a segment as th next value (clickwise)
  let startFound = false;
  let startix, searchix;
  let startPixelIndex;
  for(let i =0; i < corner0_4grid.length;++i)
  {
    let val = _idmap[ corner0_4grid[i]];
    let nextval = _idmap[ corner0_4grid[(i+1) % corner0_4grid.length]];
    if(( (val == -1) || (val == -2))  && (nextval > 0)  )
    {
      startPixelIndex = corner0_4grid[i];
      startix = i;
      searchix = (i+1) % corner0_4grid.length;
      startFound = true;
      break;
    }
  }
  if(startFound)
  {
    // console.log("startFound startix:" , startix, "searchix:", searchix);
    // walk clockwise
    let offset9grid = getMappingOffsetFrom4gridTo9grid(startix, searchix);
    //console.log("startFound startix:" , startix, ", searchix:", searchix, ", offset9grid:" , offset9grid);

    if(offset9grid != null)
    {
      let path = getRoadPathEitherSideOfPixel(startPixelIndex, offset9grid, walkDistEachSide);
      debugDrawIndices(path, [50,0,0]);
      return {path: path, startPixelIndex: startPixelIndex};
    }
  }
  return null;
}

function getRoadPathAroundRoadPoint(p, travelDistanceEitherSide)
{
  let startPixelIndex = _w*p.y + p.x;
  let offset9grid = find9GridOffsetForNonRoadPixel(startPixelIndex);
  return getRoadPathEitherSideOfPixel(startPixelIndex, offset9grid, travelDistanceEitherSide);
}

function getRoadPathEitherSideOfPixel(startPixelIndex, offset9grid, travelDistanceEitherSide)
{
  // walk path in one direction
  let indexPathAnti = walkAlongRoadWaterAntiClockwise(startPixelIndex, offset9grid, travelDistanceEitherSide);
  // and then the other direction
  let indexPath = walkAlongRoadWaterClockwise(startPixelIndex, offset9grid, travelDistanceEitherSide);
  //console.log("indexPathAnti", indexPathAnti);
  //console.log("indexPath", indexPath);
  // reverse path and stick them together to form on long path
  indexPathAnti.reverse();
  indexPathAnti.push(startPixelIndex);
  let path = indexPathAnti.concat(indexPath);
  return path;
}



// walk along the road/water and collect points anti clockwise
function walkAlongRoadWaterAntiClockwise(startPixelIndex, offset9grid, maxPoints)
{
  // start from top,left go clockwise
  let offsets = [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];
  let result = [];
  let startoffsetix = offset9grid;
  let ix = startPixelIndex;

  let MAX_ITERATION = 1000;
  let iteration = 0;
  while( (result.length < maxPoints) && (iteration < MAX_ITERATION) )
  {
    iteration++;
    let basex = ix % _w;
    let basey = Math.floor(ix / _w);

    for(let i =offsets.length-1; i >=0 ;--i){
      let id = (startoffsetix + (i) ) % offsets.length;
      let offset = offsets[id];
      let x =  basex  + offset[0];
      let y = basey  + offset[1];
      if((x < 0) || (x >= _w)) continue;
      if((y < 0) || (y >= _h)) continue;
      //   console.log("offset", offset[0],offset[1]);
      // console.log("check", x,y);
      let checkix = x + y*_w;
      if(checkix == startPixelIndex)
      {
        break;
      }
      else if( (_idmap[checkix] ==  -1) || (_idmap[checkix] ==  -2))
      {
        // console.log("next found");
        result.push(checkix);
        ix =checkix;
        startoffsetix = (id - 5 + offsets.length) % offsets.length;
        break;
      }
    }
  }
  return result;
}

// new method to find groups
function groupCornersTogether(cornerMap, corners)
{
  let groups = [];
  console.log("--- groupCornersTogether");
  // create a temp map so we dont repeat processing
  let cornersMatchedMap = {};
  // for each corner
  for(let i =0; i < corners.length;++i){
    let startCorner = corners[i];
    console.log("check corner ", startCorner, cornersMatchedMap[startCorner.cornerID]);


    // check if its matched already
    //if(true){

    if (cornersMatchedMap[startCorner.cornerID] == null) {
      let groupPairs = [];
      let corner = startCorner;
      let iterations = 0;
      let MAX_ITERATIONS = 6;

      while(iterations++ < MAX_ITERATIONS) {

        console.log("- walk corner ", corner);
        // try do a walk to the next corner to complete a cut
        let res = findStartingPixelAndDoWalkToNextCorner(corner, cornerMap);
        console.log("res ", res);

        if (res != null) {

          let otherCorner = res.corner;

          console.log("- matching corner found:", otherCorner);
          let pixels = res.pixels;
          cornersMatchedMap[corner.cornerID] = true;
          let segmentID = res.segmentID;
          // todo find if the corner contains both the segment Ids, if so its a pair. stop here.
          //
          let otherSegmentID2 = getOtherCornerSegmentID(segmentID, corner);
          let otherSegmentID = getOtherCornerSegmentID(segmentID, otherCorner);

          let isPair = (otherSegmentID == otherSegmentID2);

          //  console.log("isPair", isPair);

          // debug draw the line
          debugDrawIndices(pixels, [0, 20, 0]);

          let pair = {
            corner0 : otherCorner,
            corner1 :  corner,
            segmentID : segmentID,
            otherSegmentID : otherSegmentID
          };
          groupPairs.push(pair);
          console.log("-----------------------");
          console.log("corner0pair", pair.corner0);
          console.log("corner1pair", pair.corner1);
          console.log("-----------------------");


          if (isPair) {
            //group = [corner, otherCorner];
            groups.push(groupPairs);
            console.log("groupPairs pair: ", groupPairs);
            // set as checked so we dont double up
            cornersMatchedMap[otherCorner.cornerID] = true;
            break;
          }
          else if  (startCorner == otherCorner){
            //  loop is complete
            groups.push(groupPairs);
            console.log("groupPairs here: ", groupPairs);

            break;
          }

          corner = otherCorner;
          //group.push(otherCorner);

        }
      }
    }
  }
  return groups;

// if  corner  contains the same segmentIDs, set as done no need to process second corner
// if it contains only 1 segmentID, then it means we should continue on, and walk down from the next corner
// ?

// add to pairs array  [a, b],  corner b comes along, check its contained in pair?
// cornersCompleteMap[cornerIndex] = true
// end up with pairs [a,b],[b,c][c,d][d,b]
// form into groups like before
}

function getOtherCornerSegmentID(segmentID, corner)
{
  let segmentIDs = corner.segmentIDs;
  for(let i =0 ; i < segmentIDs.length;++i){
    let id = segmentIDs[i];
    if(id != segmentID){
      return id;
    }
  }
  return null;
}


// starting at one corner, walk along the segment edge until we reach another corner
// it should be with a certain dist, fail it we reach back at the same start point
function findStartingPixelAndDoWalkToNextCorner(corner, cornerMap)
{
  let cornerIndex4Grid = getCorner4Grid( corner.topleftIndex);
  let cornerIdMap = createIdGridForCorner(corner);
  // find the index of the 2 segments that are nex to each other
  let intersectionIndex = null;
  let segmentID = null;
  console.log("cornerIdMap", cornerIdMap);

  for(let i =0; i < cornerIdMap.length;++i)
  {
    let id0 = cornerIdMap[i];
    let id1 = cornerIdMap[(i+1)% cornerIdMap.length];
    if((id0 > 0) && (id1 > 0) && (id0 != id1) )
    {
      intersectionIndex = i;
      segmentID = id1;

      console.log("intersectionIndex", intersectionIndex);
      console.log("id0", id0);
      console.log("id1", id1);

      break;
    }
  }


  if(intersectionIndex != null)
  {
    // there exists an intersection of 2 segments next to each other
    let searchix = intersectionIndex;
    let startix =  (intersectionIndex + 1) % cornerIdMap.length;
    let offset9grid = getMappingOffsetFrom4gridTo9grid(startix, searchix);
    let startPixelIndex = cornerIndex4Grid[startix];
    console.log("startix", startix);
    console.log("searchix", searchix);
    console.log("offset9grid", offset9grid);
    console.log("segmentID", segmentID);

    return walkAlongSegmentClockwiseToCorner(cornerMap, corner, startPixelIndex, offset9grid, segmentID);
  }
  return null;
}

// walk along the road/water and stop when it reaches a corner
function walkAlongSegmentClockwiseToCorner(cornerMap,startCorner, startPixelIndex, offset9grid, segmentID)
{
  // start from top,left go clockwise
  let offsets = [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];
  let result = [startPixelIndex];
  let startoffsetix = offset9grid;
  let ix = startPixelIndex;

  let MAX_ITERATION = 100;
  let iteration = 0;
  while( (iteration < MAX_ITERATION) )
  {
    iteration++;
    let basex = ix % _w;
    let basey = Math.floor(ix / _w);

    console.log(iteration, "basex,basey:", basex, basey);

    for(let i =0; i < offsets.length;++i){
      let id = (startoffsetix + (i) ) % offsets.length;
      let offset = offsets[id];
      let x =  basex  + offset[0];
      let y = basey  + offset[1];
      if((x < 0) || (x >= _w)) continue;
      if((y < 0) || (y >= _h)) continue;
      //   console.log("offset", offset[0],offset[1]);
      // console.log("check", x,y);
      let checkix = x + y*_w;
      if(checkix == startPixelIndex)
      {
        break;
      }
      else if( _idmap[checkix] == segmentID)
      {
        // console.log("next found");
        result.push(checkix);
        //   console.log("x,y ", x,y);
        // check to see if it matches a corner
        let matchedCornerFound = checkForMatchingCorner(cornerMap, checkix, segmentID);
        //s console.log("matchedCornerFound", matchedCornerFound);
        if( (matchedCornerFound != null) && (matchedCornerFound !=  startCorner) )
        {
          return {
            segmentID :segmentID,
            pixels: result,
            corner: matchedCornerFound
          };
        }

        ix =checkix;
        startoffsetix = (id +5) % offsets.length;

        break;
      }
    }
  }
  return null;
}



// checkForMatchingCorner -   lookup corners from a cornerMap
// return corner with the matching segmentID, that is being walking along
function checkForMatchingCorner(cornerMap, checkix, segmentID)
{
  //
  let corners = cornerMap[checkix];
  if(corners != null)
  {

    // for each corner check if it contains at least one matching segmentID.
    for(let i = 0 ;i < corners.length;++i)
    {

      let corner = corners[i];
      console.log("check corner here: ", corner);
      console.log("segmentID: ", segmentID);
      let segmentIDs = corner.segmentIDs;
      if(segmentIDs.indexOf(segmentID ) != -1){

        // do extra check
        return corner;
      }
    }
  }
  return null;
}

// walk along the road/water and collect points clockwise
function walkAlongRoadWaterClockwise(startPixelIndex, offset9grid, maxPoints)
{
  // start from top,left go clockwise
  let offsets = [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];
  let result = [];
  let startoffsetix = offset9grid;
  let ix = startPixelIndex;

  let MAX_ITERATION = 1000;
  let iteration = 0;
  while( (result.length < maxPoints) && (iteration < MAX_ITERATION) )
  {
    iteration++;
    let basex = ix % _w;
    let basey = Math.floor(ix / _w);

    for(let i =0; i < offsets.length;++i){
      let id = (startoffsetix + (i) ) % offsets.length;
      let offset = offsets[id];
      let x =  basex  + offset[0];
      let y = basey  + offset[1];
      if((x < 0) || (x >= _w)) continue;
      if((y < 0) || (y >= _h)) continue;
      //   console.log("offset", offset[0],offset[1]);
      // console.log("check", x,y);
      let checkix = x + y*_w;
      if(checkix == startPixelIndex)
      {
        break;
      }
      else if( (_idmap[checkix] ==  -1) || (_idmap[checkix] ==  -2))
      {
        // console.log("next found");
        result.push(checkix);
        ix =checkix;
        startoffsetix = (id +5) % offsets.length;
        break;
      }
    }
  }
  return result;

}


// map from 4grid cornerix val to a 3x3grid value for doing a walk
function getMappingOffsetFrom4gridTo9grid(startix, searchix)
{
  let map = null;
  if(startix == 0)
  {
    // maps 4grid to the bottom right
    map = {0:null, 1:3, 2:4, 3:5}
  }
  else if(startix == 1)
  {
    // bottom left
    map = {0:7, 1:null, 2:5, 3:6}
  }
  else if(startix == 2)
  {
    // top left
    map = {0:0, 1:1, 2:null, 3:7}
  }
  else if(startix == 3)
  {
    // top right
    map = {0:1, 1:2, 2:3, 3:null}

  }

  if(map != null)
  {
    return map[searchix];
  }
  return null;
}

function createIdGridForCorner(corner){
  let ixGrid = getCorner4Grid(corner.topleftIndex);
  console.log("createIdGridForCorner ixGrid", ixGrid);
  idGrid = [];
  // convert from ix grid to index grid
  for(let i = 0; i < ixGrid.length;++i){
    idGrid[i] = _idmap[ixGrid[i]];
  }
  return idGrid;
}

// get the pixel indexes for the corner
function getCorner4Grid(topleftix)
{
  let basex = topleftix % _w ;
  let basey = Math.floor( topleftix / _w ) ;
  // clockwise order
  let offsets = [[0,0],[1,0],[1,1],[0,1]];
  let ids = [];
  for(let j =0; j < offsets.length;++j) {
    x = basex + offsets[j][0];
    y = basey + offsets[j][1];
    let ix = y * _w + x;
    ids.push(ix);
  }
  return ids;
}

// extract all the pairs to process.  Each pair would be a corner
function getCornerPairs(orderedGroups)
{
  let pairs = [];
  for(let i =0; i < orderedGroups.length;++i)
  {
    let corners = orderedGroups[i];

    //console.log("corners" , corners.length);
    if(corners.length == 2)
    {
      pairs.push([corners[0],corners[1]]);
    }
    else if(corners.length > 2)
    {
      for(let j = 0; j < corners.length;++j)
      {
        pairs.push( [corners[j], corners[(j +1) % corners.length ]]);
      }
    }
  }
  return pairs;
}

// order each group so that the corners connect from one corner to the next - this is important then theres 3 or more
function reorderEachCornerGroup(groups)
{
  for(let i = 0; i< groups.length;++i)
  {
    let corners = groups[i];
    if(corners.length > 2)
    {
      let temp = [corners[0]];
      for(let j = 0 ; j <corners.length ;++j )
      {
        let corner = corners[j];
        // console.log("corner segmenmentID", corner.segmentIDs);
        for(let k = j+1 ; k <corners.length ;++k )
        {
          let checkCorner = corners[k];
          if(isNeighbourCorner(corner,checkCorner)){
            temp.push(checkCorner);
            break;
          }
        }
      }
      // replace group
      groups[i] = temp;
      //console.log("temp", temp);

    }
  }
  return groups;
}

// helper - returns true if the 2 corners share the same segment
// this means that they are on either side of the segment
function isNeighbourCorner(corner0,corner1)
{
  let segments0 = corner0.segmentIDs;
  let segments1 = corner1.segmentIDs;
  for(let i =0; i < segments0.length;++i)
  {
    if(segments1.indexOf(segments0[i]) != -1) return true;
  }
  return false;
}

/*
// group the corners with the same segmentID.  These are usually pairs, but may also include groups of 3 or more
function groupCornersTogether(corners)
{
  let groupMap = {};
  let groups = [];
  let groupIX;
  //console.log("corners:");
  //console.log(corners);
  for(let i = 0; i < corners.length;++i)
  {
    let corner = corners[i];
   // console.log("process corner " + i , corner);

    // try to add to group
    let cornerSegmentIDs = corner.segmentIDs;
   // console.log("cornerSegmentIDs" , cornerSegmentIDs);

    let groupFound = false;
    for(let j = 0; j <cornerSegmentIDs.length;++j ) {
      let cornerSegmentID = cornerSegmentIDs[j];
      if (groupMap[cornerSegmentID] != null)
      {
        groupIX = groupMap[cornerSegmentID];
       // console.log("group found");
        groupFound = true;
        let g = groups[groupIX];
        g.push(corner);
        break;
      }
    }
    if(!groupFound)
    {
     // console.log("group not found");

      // create a new group for it

      let g = [corner];
      groups.push(g);
      groupIX = groups.length-1;
    }

    // update map
    for(let j = 0; j <cornerSegmentIDs.length;++j ) {
      {
        let cornerSegmentID = cornerSegmentIDs[j];
        groupMap[cornerSegmentID] = groupIX;
      }
    }
  }
  console.log("groupMap:");
  console.log(groupMap);
  console.log("groups:");
  console.log( groups);

  return groups;
}
*/

// create a cornerMap by saving the cornerIx to each 4grid slot
function createCornerMap(corners)
{
  let offsets = [[0,0],[0,1],[1,1],[1,0]];
  let x,y, basex, basey, baseix;
  _tempMap = {};
  for(let cornerID =0; cornerID< corners.length; ++cornerID)
  {
    let corner = corners[cornerID];
    baseix = corner.topleftIndex;
    basex = baseix % _w;
    basey = Math.floor( baseix / _w );
    for(let j =0; j < offsets.length;++j) {
      x = basex + offsets[j][0];
      y = basey + offsets[j][1];
      let ix = y*_w + x;
      console.log("ix", ix);
      if(_tempMap[ix] == null){
        _tempMap[ix] = [corner];
      }
      else{
        _tempMap[ix].push(corner);
      }
      //_tempMap[ix] = cornerID;
    }
  }
  return _tempMap;
}

// 2x2 convolution filter search.  Look for at least one road/water, and 2 different segment ids
function findCornersBetween2SegmentsAndRoad()
{

  let corners = [];
  let debugCol = [0,0,0];

  for(let x = 0; x < _w-1;++x)
  {
    for(let y = 0; y < _h-1;++y)
    {
      let nextCornerID = corners.length;
      let cornerResult = isCornerBetween2SegmentsAndRoad(x,y,nextCornerID);
      // mark it in on the
      if(cornerResult.isCorner) {
        let ix = y * _w + x;
        corners.push(cornerResult);
        _debugPixelColourMap[ix] = debugCol;

      }

    }
  }
  return corners;
}
// create corner
// 2x2 convolution filter search.  Look for at least one road/water, and 2 different segment ids
function isCornerBetween2SegmentsAndRoad(basex,basey, nextCornerID)
{
  // clockwise
  let offsets = [[0,0],[0,1],[1,1],[1,0]];
  let roadwaterFound = false;
  let tempSegmentIdMap  = {};
  let x,y;
  for(let i =0; i < offsets.length;++i)
  {
    x = basex + offsets[i][0];
    y = basey + offsets[i][1];
    let ix = y*_w + x;
    if((_idmap[ix] == -1) || (_idmap[ix] == -2) )
    {
      roadwaterFound = true;
    }
    else if(_idmap[ix] > 0)
    {
      tempSegmentIdMap[_idmap[ix]] = 1;
    }
  }

  /*
  // include edges
  if(!roadwaterFound)
  {
    let testedge = false;
    if( (basex == 0) )
    {
      testedge = true;
      offsets = [[0,0],[0,1]];
    }
    else if( (basey == 0) )
    {
      testedge = true;
      offsets = [[0,0],[1,0]];
    }
    else if( (basex == _w -2) )
    {
      testedge = true;
      offsets = [[1,0],[1,1]];
    }
    else if( (basey == _h -2) )
    {
      testedge = true;
      offsets = [[0,1],[1,1]];
    }
    if(testedge)
    {
      roadwaterFound = true; // act like an water edge
      tempSegmentIdMap  = {};
      for(let i =0; i < offsets.length;++i)
      {
        x = basex + offsets[i][0];
        y = basey + offsets[i][1];
        let ix = y*_w + x;
        if(_idmap[ix] > 0)
        {
          tempSegmentIdMap[_idmap[ix]] = 1;
        }
      }
    }
  }*/

  let segmentIDs = Object.keys(tempSegmentIdMap);
  let count = segmentIDs.length;
  // convert
  for(let i =0; i < count;++i)
  {
    segmentIDs[i] = Number.parseInt(segmentIDs[i]);
  }

  if((count >= 2) && roadwaterFound){
    return {
      isCorner: true,
      topleftIndex: basex + basey*_w,
      topleft: {x: basex, y: basey},
      segmentIDs: segmentIDs,
      cornerID: nextCornerID
    }
  }
  return {
    cornerID: nextCornerID,
    isCorner: false,
    segmentIDs: null
  };
}
/*
function findShortestDistanceBetween2PathsWithFlipTest(path0Indicies, path1Indicies)
{
  let lineA = findShortestDistanceBetween2Paths(path0Indicies, path1Indicies);
  let path0IndiciesReverse = path0Indicies.slice(0);
  path0IndiciesReverse.reverse();
  let lineB = findShortestDistanceBetween2Paths(path0IndiciesReverse, path1Indicies);

  let dx,dy;
  dx = lineA.p0.x - lineA.p1.x;
  dy = lineA.p0.y - lineA.p1.y;
  let deltaA = dx*dx +dy*dy;
  dx = lineB.p0.x - lineB.p1.x;
  dy = lineB.p0.y - lineB.p1.y;
  let deltaB = dx*dx +dy*dy;
  if(deltaA < deltaB) return lineA;
  return lineB;
}
*/

// d < 0, then its on one side, else its on the other side
function getSideOfTheLinePointIsOn(linep1,linep2,p)
{
  let x = p.x;
  let y = p.y;
  let x1 = linep1.x;
  let y1 = linep1.y;
  let x2 = linep2.x;
  let y2 = linep2.y;
  let d =  (x - x1)*(y2 - y1) - (y - y1)*(x2- x1) ;
  return (d >=0 ) ? 1: -1;
}


function findShortestDistanceBetween2Paths(path0Indicies, path1Indicies, segmentCenterp0 = null, segmentCenterp1= null, normalp00,normalp01 ,sign0,sign1) {
  if ((path0Indicies.length == 0) || (path1Indicies.length == 0)) return null;

  let startj = 0;
  let p0x, p0y, ix0, delta, p1x, p1y;
  let mindelta = null;
  let minp0x, minp0y, minp1x, minp1y;
  let minlines = [];

  let SIMILIAR_THRES = 0;
  let lineInfos = [];
  for (let i = 0; i < path0Indicies.length; ++i) {
    ix0 = path0Indicies[i];
    p0x = ix0 % _w;
    p0y = Math.floor(ix0 / _w);

    // NEW - force full search, as it fixes some cases
    startj = 0;
    let lineInfo = getShortestLineBetweenPointAndPath(p0x, p0y, startj, path1Indicies);
    delta = lineInfo.mindelta;
    startj = lineInfo.startj; // save the next starting point

    let doPushLine = true;
    if(segmentCenterp0 != null) {
      // todo
      let midp = getAverageVector(lineInfo.p0, lineInfo.p1);
      let d0 = getSideOfTheLinePointIsOn( segmentCenterp0, normalp00, midp);
      //    console.log("d0", d0, lineInfo.p0, lineInfo.p1, segmentCenterp0);
      if (d0 != sign0) {
        doPushLine = false;
      }
    }
    if(segmentCenterp1 != null) {
      // todo
      let midp = getAverageVector(lineInfo.p0, lineInfo.p1);
      let d1 = getSideOfTheLinePointIsOn( segmentCenterp1, normalp01, midp);

      //    console.log("d1", d1, lineInfo.p0, lineInfo.p1, segmentCenterp1);
      if (d1 != sign1) {
        doPushLine = false;
      }
    }
    if(doPushLine){
      lineInfos.push(lineInfo);

    }


  }

  // take the average to help smooth things out


  for (let i = 0; i < lineInfos.length; ++i) {
    let averageDist  = 0;
    let nSamples = 0;
    let offsets = [-2,-1,0,1,2];
    let weights = [0.6,1,2,1,0.6];
    let SAMPLE_SPACING = 1; // min is 1
    for (let offseti = 0; offseti < offsets.length; ++offseti)
    {
      let offset = offsets[offseti];
      let weight = weights[offseti];
      let ix = Math.max(Math.min(i+offset*SAMPLE_SPACING , lineInfos.length-1 ), 0);
      let lineInfo = lineInfos[ix];
      averageDist += lineInfo.mindelta * weight;
      nSamples++;
    }
    //averageDist /= nSamples;
    if(mindelta == null)
    {
      mindelta = averageDist;
      minlines = [lineInfos[i]];
    }
    else if(averageDist < mindelta )
    {
      mindelta = averageDist;
      minlines = [lineInfos[i]];
    }
  }
  //console.log("minlines.length " , minlines.length);
  //console.log("minlines " , minlines);

  // get the middle line from the results

  if(minlines.length > 0) {
    let line = minlines[Math.floor( minlines.length/ 2 )];
    return {
      p0: line.p0,
      p1: line.p1
    }
  }

}

function getShortestLineBetweenPointAndPath(p0x,p0y, startj,path1Indicies, segmentCenterp0= null, segmentCenterp1= null)
{
  let  ix1,dx,dy,delta,p1x,p1y;
  let mindelta;
  let minp0x,minp0y,minp1x,minp1y;

  ix1 = path1Indicies[startj];
  minp0x = p0x;
  minp0y = p0y;

  minp1x = ix1 % _w;
  minp1y = Math.floor( ix1 / _w );
  dx = minp1x - minp0x;
  dy = minp1y - minp0y;
  mindelta = dx*dx +dy*dy;

  for(let j =startj; j < path1Indicies.length;++j)
  {
    ix1 = path1Indicies[j];
    p1x = ix1 % _w;
    p1y = Math.floor( ix1 / _w );

    dx = p1x - p0x;
    dy = p1y - p0y;
    delta = dx * dx + dy * dy;
    if (delta < mindelta) {
      minp0x = p0x;
      minp0y = p0y;
      minp1x = p1x;
      minp1y = p1y;
      mindelta = delta;
      startj = j;
    }

  }
  return {
    startj : startj,
    mindelta: mindelta,
    p0: {x: p0x, y: p0y},
    p1: {x: minp1x, y: minp1y}
  };
}

function drawPixelArrayOnMap(pixels, id)
{
  for(let i =0; i < pixels.length;++i)
  {
    _idmap[pixels[i]] = id;
  }
}

function drawPixelArrayOnMapExcludingRoadWater(pixels, id)
{
  for(let i =0; i < pixels.length;++i)
  {
    let curval = _idmap[pixels[i]];
    if((curval != -1) && (curval != -2)) {
      _idmap[pixels[i]] = id;
    }
  }
}

//https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
function getLinePixels(x0,y0, x1,y1) {
  if (Math.abs(y1 - y0) < Math.abs(x1 - x0)) {
    if (x0 > x1) {
      let pixels =  getLinePixelsLow(x1, y1, x0, y0);
      pixels.reverse();
      return pixels;
    } else {
      return getLinePixelsLow(x0, y0, x1, y1);
    }
  } else {
    if (y0 > y1) {
      let pixels = getLinePixelsHigh(x1, y1, x0, y0);
      pixels.reverse();
      return pixels;
    } else {
      return getLinePixelsHigh(x0, y0, x1, y1)
    }
  }
}


//https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
function getLinePixelsLow(x0,y0, x1,y1) {
  let points = [];
  let dx = x1 - x0;
  let dy = y1 - y0;
  let yi = 1;
  if (dy < 0)
  {
    yi = -1;
    dy = -dy;
  }
  let D = 2 * dy - dx;
  let  y = y0;

  for(let x =x0; x<=x1;++x ){
    //  plot(x, y)
    //_idmap[x+y*_w] = idval;
    points.push(x+y*_w);
    if (D > 0) {
      y = y + yi;
      D = D - 2 * dx;
    }
    D = D + 2 * dy;
  }
  return points;
}
//https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
function getLinePixelsHigh(x0,y0, x1,y1) {
  let points = [];
  let dx = x1 - x0;
  let dy = y1 - y0;
  let xi = 1;
  if (dx < 0)
  {
    xi = -1;
    dx = -dx;
  }
  let D = 2 * dx - dy;
  let  x = x0;

  for(let y =y0; y<=y1;++y ){
    //  plot(x, y)
//   _idmap[x+y*_w] = idval;
    points.push(x+y*_w);

    if (D > 0) {
      x = x + xi;
      D = D - 2 * dy;
    }
    D = D + 2 * dx;
  }
  return points;
}

function debugDrawLineBetween2Points(p1,p2,col)
{
  if(p2.x < p1.x)
  {
    let temp = p2;
    p2 = p1;
    p1 = temp;
  }
  let x1 = p1.x;
  let x2 = p2.x;
  let y1 = p1.y;
  let y2 = p2.y;
  let dx = x2 - x1;
  let dy = y2 - y1;

  _debugPixelColourMap[x1 + y1*_w] = col;
  _debugPixelColourMap[x2 + y2*_w] = col;

  for(let x = x1; x <= x2; ++x)
  {
    let y = Math.round( y1 + dy * (x - x1) / dx);
    _debugPixelColourMap[x + y*_w] = col;

  }
}

function debugDrawIndices(indices,col)
{
  // console.log('debugDrawIndices', indices.length);
  for(let i =0; i < indices.length;++i) {
    _debugPixelColourMap[indices[i]] = col;
  }
}

function debugDrawPoint(p,col)
{
  let x = Math.round(p.x);
  let y = Math.round(p.y);
  _debugPixelColourMap[x + y*_w] = col;
}

function drawToCutPixelsUsingMixedColour(imageData, cuts)
{
  // todo override non-antialised line pixels with a mixed colour, before applying the smooth lines
  let idata = imageData.data;

  for(let i =0 ;  i< cuts.length;++i) {

    console.log("drawToCutPixelsUsingMixedColour cut ", i, cuts[i]);
    let cut = cuts[i];
    let p0 = cut.line.p0;
    let p1 = cut.line.p1;

    let linePixels = getLinePixels(p0.x,p0.y,p1.x,p1.y);
    let segmentID0 = cut.segmentID;
    let segmentID1 = cut.otherSegmentID;
    let segmentCol0 = segmentColourMap[segmentID0];
    let segmentCol1 = segmentColourMap[segmentID1];
    if (segmentCol0 && segmentCol1) {
      let middleCol = lerpColour(segmentCol0, segmentCol1, 0.5);
      drawPixelsToImageData(imageData, linePixels, middleCol);
    }
  }
}

function lerpColour(col0,col1, ratio){
  let r = col0[0] + (col1[0] - col0[0])*ratio;
  let g = col0[1] + (col1[1] - col0[1])*ratio;
  let b = col0[2] + (col1[2] - col0[2])*ratio;
  return [ Math.round(r),Math.round(g),Math.round(b)  ];
}

function drawPixelsToImageData(imageData, pixelIds, col){
  let d = imageData.data;
  for(let i =0; i < pixelIds.length;++i){
    let baseix = 4*pixelIds[i];
    d[baseix + 0] = col[0];
    d[baseix + 1] = col[1];
    d[baseix + 2] = col[2];
  }
}

function drawSmoothCutLines( imageData, cuts)
{


  let idata = imageData.data;

  // create temp canvas
  let canvas = new Canvas(_w,_h);
  let ctx = canvas.getContext('2d');
  ctx.fillStyle ='rgba(0,0,0,0)';
  ctx.fillRect(0, 0, _w, _h);
  //console.log("segmentColourMap ", segmentColourMap );
  console.log("drawSmoothCutLines cuts.length ", cuts.length );

  for(let i =0 ;  i< cuts.length;++i) {

    console.log("drawSmoothCutLines cut ", i , cuts[i] );

    let cut = cuts[i];
    let p0 = cut.line.p0;
    let p1 = cut.line.p1;

    let segmentID0 = cut.segmentID;
    let segmentID1 = cut.otherSegmentID;
    let segmentCol0 = segmentColourMap[segmentID0];
    let segmentCol1 = segmentColourMap[segmentID1];
    console.log("segmentID0, segmentID1",segmentID0, segmentID1 );
    console.log("segmentCol0, segmentCol1",segmentCol0, segmentCol1 );


    if (segmentCol0 && segmentCol1) {
      let middleCol = lerpColour(segmentCol0, segmentCol1, 0.5);
      // test
      //middleCol = [255,0,0];

      ctx.strokeStyle = 'rgba(' + middleCol[0] + ',' + middleCol[1] + ',' + middleCol[2] + ',1)';
      console.log("ctx.strokeStyle ", ctx.strokeStyle);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.lineTo(p0.x + 0.5, p0.y + 0.5);
      ctx.lineTo(p1.x + 0.5, p1.y + 0.5);
      ctx.stroke();
    }

    /*
    let segmentIDs = getSegmentIDsOverCut(p0,p1);
    //console.log("cut segmentIDs", segmentIDs);
    if(segmentIDs && (segmentIDs.length >= 1)) {
      let segmentID0 = segmentIDs[0].segmentID;
      if (segmentID0 > 0) {
        let col0 = segmentColourMap[segmentID0];
        if (col0) {
          ctx.strokeStyle = 'rgba(' + col0[0] + ',' + col0[1] + ',' + col0[2] + ',1)';
          console.log("ctx.strokeStyle ", ctx.strokeStyle);
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.lineTo(p0.x + 0.5, p0.y + 0.5);
          ctx.lineTo(p1.x + 0.5, p1.y + 0.5);
          ctx.stroke();
        }
      }
    }*/
  }
  /////
  let canvasImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let cdata = canvasImageData.data;
  //console.log(cdata);
  for(let x =0; x< _w; ++x )
  {
    for(let y =0; y< _h; ++y )
    {
      let ix = y*_w + x;
      let canvasR = cdata[4*ix + 0];
      let canvasG = cdata[4*ix + 1];
      let canvasB = cdata[4*ix + 2];
      let canvasA = cdata[4*ix + 3] / 255;
      //console.log("draw ", canvasR, canvasG,canvasB, canvasA);

      if(canvasA != 0){
        //console.log(canvasR, canvasG, canvasB, canvasA);
        //

        let imageR = idata[4*ix + 0];
        let imageG = idata[4*ix + 1];
        let imageB = idata[4*ix + 2];

        idata[4*ix + 0] = Math.floor( imageR  + (canvasR - imageR)*canvasA);
        idata[4*ix + 1] = Math.floor( imageG  + (canvasG - imageG)*canvasA);
        idata[4*ix + 2] =  Math.floor( imageB  + (canvasB - imageB)*canvasA);
      }
    }
  }
}


// get pixel indexies of lines between segments
function getEdgeLinesBetweenSegments(borderIDs , borderPixelIndexes, ignoreSegmentId)
{
  let lines = [];
  let line = [];
  for(let i = 0; i< borderIDs.length;++i)
  {
    let id = borderIDs[i];
    console.log(borderIDs[i]);
    if((id == 0) || (id == -1) || (id == -2) || (id == -3) || (id == ignoreSegmentId) ) // look for road/water/ empty..
    {
      line.push(borderPixelIndexes[i]);
    }
    else{
      if(line.length > 0) {
        lines.push(line);
        line = [];
      }
    }
  }

  if(line.length > 0) {
    let isFirstPixelNotASegment = (borderIDs[0] == 0) || (borderIDs[0] == -1) || (borderIDs[0] == -2);
    if((lines.length > 0) && isFirstPixelNotASegment) {
      // join the head and remaining tail
      lines[0] = line.concat(lines[0]);
    }
    else{
      lines.push(line);
    }
  }
  return lines;
}

// get the number of segments (not road or water) that lies on the pixel border
function getSegmentIdsInBorder(borderIDs, excludeThisSegmentID){
  let segmentIDMap =[];
  for(let i =0; i <borderIDs.length;++i)
  {
    segmentIDMap[borderIDs[i]] = 1;
  }

  let count = 0;
  let segmentIDs = Object.keys(segmentIDMap);
  let resultids =[];
  for(let i=0; i< segmentIDs.length;++i)
  {
    let id = segmentIDs[i];
    if( (id != 0) && (id != -1) && (id != -2) && (id != -3)  && (id != excludeThisSegmentID))
    {
      resultids.push(id);
      count++;
    }
  }

  return resultids ;
}


function getAllIdsInBorder(borderIDs, excludeThisSegmentID){
  let segmentIDMap =[];
  for(let i =0; i <borderIDs.length;++i)
  {
    segmentIDMap[borderIDs[i]] = 1;
  }

  let count = 0;
  let segmentIDs = Object.keys(segmentIDMap);
  let resultids =[];
  for(let i=0; i< segmentIDs.length;++i)
  {
    let id = segmentIDs[i];
    if(  (id != excludeThisSegmentID))
    {
      resultids.push(id);
      count++;
    }
  }

  return resultids ;
}



function getSegmentIdsForBorderPixels(borderPixelIndexes, idmap)
{
  let ids = [];
  for(let i=0; i< borderPixelIndexes.length;++i)
  {
    ids.push(idmap[borderPixelIndexes[i]]);
  }
  return ids;
}

// grow single element, used for finding the outer pixels to trace around (used for gaps)
function growSingleSegment(segmentID, idmap)
{
  let ids = segmentMap[segmentID];
  for(let i =0; i < ids.length;++i)
  {
    let id = ids[i];
    let x = id % _w;
    let y = Math.floor( id / _w );
    growSegmentsPixelProcess4NeighbourForce(idmap, x, y, segmentID);
  }
}



//  walk around the edges of the segment -, more optimised alt version, try it
function getBorderPixelsAlt(segmentID, pixelIDs)
{
  // find edgePixelId
  //
  let offsets = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]];

  let startoffsetix;
  let startPixelIndex = -1;

  let pixelAbove = findPixelAboveTopEdgePixelIndex(pixelIDs, segmentID, _idmap);
  if(pixelAbove >=0) {
    startoffsetix = 6; // this is the pixel below
    ix = pixelAbove;
    startPixelIndex = ix;
    // do a trace around the edge until we get back to the same pixel
    // start from top,left go clockwise
  }
  else{
    ix = findAnyPixelOnTheTopRow(pixelIDs);
    startPixelIndex = ix;
    startoffsetix = 6;
  }


  if(ix >= 0){
    let edgeIndexes = [ix];

    let MAX = 100000;
    let tempix = 0;
    let loopDone = false;
    while(!loopDone && (tempix++ < MAX) )
    {

      //  console.log("--- startoffsetix", startoffsetix);

      let basex = ix % _w;
      let basey = Math.floor(ix / _w);

      //   console.log("--- basex,basey", basex,basey);

      for(let i =0; i < offsets.length;++i){
        let id = (startoffsetix + (i) ) % offsets.length;
        let offset = offsets[id];
        let x =  basex  + offset[0];
        let y = basey  + offset[1];
        if((x < 0) || (x >= _w)) continue;
        if((y < 0) || (y >= _h)) continue;
        //   console.log("offset", offset[0],offset[1]);
        //   console.log("check", x,y);

        let checkix = x + y*_w;

        let nextid = (startoffsetix + (i + 1) ) % offsets.length;
        let nextoffset = offsets[nextid];
        let nextx =  basex  + nextoffset[0];
        let nexty = basey  + nextoffset[1];
        let nextcheckix = nextx + nexty*_w;

        let nextcheckixInBounds = (nextx >= 0) && (nextx < _w ) && (nexty >= 0) && (nexty < _h );

        if(checkix == startPixelIndex)
        {
          // console.log("loop done ",  checkix, startPixelIndex, edgeIndexes);
          loopDone = true;
          break;
        }
        else if( ((_idmap[checkix] !=  segmentID)
          && nextcheckixInBounds && (_idmap[nextcheckix] == segmentID)  )  )
        {

          //   console.log("push here2 ", x,y);

          // console.log("next found");
          edgeIndexes.push(checkix);
          ix =checkix;
          startoffsetix = (id +5) % offsets.length;
          break;
        }
        else if(  ((x >= _w-1) || (x == 0) ||
            (y >= _h-1) || (y == 0)
          )
          && _idmap[checkix] == segmentID
        )
        {
          //   console.log("push here1 ", x,y);
          // at the edge so move through it
          edgeIndexes.push(checkix);
          ix =checkix;
          startoffsetix = (id +5) % offsets.length;
          break;
        }
      }
    }
    // console.log("edgeIndexes.length ", edgeIndexes.length);
    return edgeIndexes;
  }
  return [];
}

// find the first pixel
function findPixelAboveTopEdgePixelIndex(pixelIDs, segmentIX, idmap)
{
  for(let i =0; i< pixelIDs.length;++i)
  {
    let index = pixelIDs[i];
    let x = index % _w;
    let y = Math.floor(index / _w);
    let ix = x ;
    let iy = y - 1;
    ix = Math.max(Math.min(ix, _w - 1), 0);
    iy = Math.max(Math.min(iy, _h - 1), 0);
    //console.log("idmap[iy*_w + ix]", idmap[iy * _w + ix]);
    let pixelAbove = iy * _w + ix;
    if ((idmap[pixelAbove] != segmentIX) && (idmap[y * _w + x] == segmentIX) ) {
      return pixelAbove;
    }
  }
  return -1;
}

function findAnyPixelOnTheTopRow(pixelIDs)
{
  for(let i =0; i< pixelIDs.length;++i)
  {
    let index = pixelIDs[i];
    let x = index % _w;
    let y = Math.floor(index / _w);
    if (y == 0 ) {
      return index;
    }
  }
  return -1;
}



// walk around the edges of the segment
function getBorderPixels(segmentID, idmap)
{
  let ids = segmentMap[segmentID];
  // find edgePixelId
  let firstPixelIndex = findAnyEdgePixelIndex(ids, segmentID, idmap);
  if(firstPixelIndex >=0)
  {
    let ix = firstPixelIndex;
    // do a trace around the edge until we get back to the same pixel
    // start from top,left go clockwise
    let offsets = [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];

    let edgeIndexes = [ix];
    let startoffsetix = 0;

    let loopDone = false;
    while(!loopDone)
    {
      //  console.log("--- startoffsetix", startoffsetix);

      let basex = ix % _w;
      let basey = Math.floor(ix / _w);

      for(let i =0; i < offsets.length;++i){
        let id = (startoffsetix + (i) ) % offsets.length;
        let offset = offsets[id];
        let x =  basex  + offset[0];
        let y = basey  + offset[1];
        if((x < 0) || (x >= _w)) continue;
        if((y < 0) || (y >= _h)) continue;
        //   console.log("offset", offset[0],offset[1]);

        // console.log("check", x,y);

        let checkix = x + y*_w;
        if(checkix == firstPixelIndex)
        {
          loopDone = true;
          break;
        }
        else if( idmap[checkix] ==  segmentID)
        {
          // console.log("next found");
          edgeIndexes.push(checkix);
          ix =checkix;
          startoffsetix = (id +5) % offsets.length;
          break;
        }
      }
    }
    // console.log("edgeIndexes.length ", edgeIndexes.length);
    return edgeIndexes;
  }
  return [];
}

// find the first pixel
function findAnyEdgePixelIndex(unInflatedPixelIds, segmentIX, idmap)
{
  // innflate by one as this list is old
  let bb = getSegmentBoundingBox(unInflatedPixelIds);
  bb.x = Math.max(bb.x - 1,0);
  bb.y = Math.max(bb.y - 1,0);
  bb.width += 2;
  bb.height += 2;
  let ix, iy;
  //console.log("bb", bb);

  for (let x = bb.x;x < bb.x + bb.width; ++x) {

    for (let y = bb.y;y < bb.y + bb.height; ++y) {

      let ix = x - 1;
      let iy = y;
      ix = Math.max(Math.min(ix, _w - 1), 0);
      iy = Math.max(Math.min(iy, _h - 1), 0);
      //console.log("idmap[iy*_w + ix]", idmap[iy * _w + ix]);
      if ((idmap[iy * _w + ix] != segmentIX) && (idmap[y * _w + x] == segmentIX) ) {
        return y * _w + x;
      }
    }
  }
  return -1;
}

function isNeighbourToRoad(x,y,w,data)
{
  let offsets = [[-1,0],[1,0],[0,1],[0,-1], [-1,1],[1,-1],[-1,-1],[1,1],[0,0]];
  //const offsets = [[-1,0],[1,0],[0,1],[0,-1]];
  for(let i = 0; i< offsets.length;++i)
  {
    //let c = getColourAsHex(x + offsets[i][0], y + offsets[i][1],src,w,h);
    let ix  = x + offsets[i][0];
    let iy  = y + offsets[i][1];
    ix = Math.max(Math.min(ix,_w-1),0);
    iy = Math.max(Math.min(iy,_h-1),0);

    let index = 4*(iy*_w + ix);
    let r = data[index ];
    let g = data[index +1];
    let b = data[index +2];
    if( r > 10 ) return true;
  }
  return false;
}

function isNeighbourToASegment(x,y)
{
  //  let offsets = [[-1,0],[1,0],[0,1],[0,-1], [-1,1],[1,-1],[-1,-1],[1,1]];
  const offsets = [[-1,0],[1,0],[0,1],[0,-1]];

  for(let i = 0; i< offsets.length;++i)
  {
    //let c = getColourAsHex(x + offsets[i][0], y + offsets[i][1],src,w,h);
    let ix  = x + offsets[i][0];
    let iy  = y + offsets[i][1];
    ix = Math.max(Math.min(ix,_w-1),0);
    iy = Math.max(Math.min(iy,_h-1),0);
    let id = _idmap[iy*_w + ix];
    if( id > 0) return  id;
  }
  return null;
}

function growSegment(ninterations, segmentID)
{
  // create temp clone
  let idmapResult = _idmap.slice(0);

  for(let k =0; k< ninterations;++k)
  {
    console.log("grow segments", (k+1) + "/" + ninterations);
    console.log("clone done");
    for(let x =0; x < _w;++x)
    {
      for(let y =0; y < _h;++y)
      {
        let id = _idmap[y*_w + x];
        if( id == segmentID ) {
          growSegmentsPixelProcess4Neighbour(idmapResult, x, y, id);
        }
      }
    }

    copyIDMapValues(idmapResult,_idmap);

    // switch
    //let temp = idmapResult;
    // idmapResult = _idmap;
    // _idmap =  temp;
  }
}

function growSegments(ninterations)
{
  // create temp clone
  let idmapResult = _idmap.slice(0);

  for(let k =0; k< ninterations;++k)
  {
    console.log("grow segments", (k+1) + "/" + ninterations);
    console.log("clone done");
    for(let x =0; x < _w;++x)
    {
      for(let y =0; y < _h;++y)
      {
        let id = _idmap[y*_w + x];
        if( (id > 0) || (id <= -4) ) {
          growSegmentsPixelProcess4Neighbour(idmapResult, x, y, id);
        }
      }
    }

    copyIDMapValues(idmapResult,_idmap);
  }
}

function copyIDMapValues(from, to)
{
  let n = _w*_h;
  for(let i =0; i < n;++i){
    to[i] = from[i];
  }
}

function erodeSegment(ninterations, segmentID)
{
  // create temp clone
  let idmapResult = _idmap.slice(0);

  for(let k =0; k< ninterations;++k)
  {
    console.log("grow segments", (k+1) + "/" + ninterations);
    console.log("clone done");
    for(let x =0; x < _w;++x)
    {
      for(let y =0; y < _h;++y)
      {
        let id = _idmap[y*_w + x];
        if( id != segmentID ) {
          erodeSegmentsPixelProcess4Neighbour(idmapResult, x, y, segmentID);
        }
      }
    }

    // switch
    let temp = idmapResult;
    idmapResult = _idmap;
    _idmap =  temp;
  }
}

function growSegmentsPixelProcess9Neighbour(idmapResult, x,y, growid)
{
  const offsets = [[-1,0],[1,0],[0,1],[0,-1], [-1,1],[1,-1],[-1,-1],[1,1]];
  for(let i = 0; i< offsets.length;++i)
  {
    //let c = getColourAsHex(x + offsets[i][0], y + offsets[i][1],src,w,h);
    let ix  = x + offsets[i][0];
    let iy  = y + offsets[i][1];
    ix = Math.max(Math.min(ix,_w-1),0);
    iy = Math.max(Math.min(iy,_h-1),0);
    let index = iy*_w + ix;
    let id = idmapResult[index];
    if( id == 0 )
    {
      // console.log("growid");
      idmapResult[index ] = growid;
    }

  }
  return 0;
}

function erodeSegmentsPixelProcess4Neighbour(idmapResult, x,y, erodeid)
{
  //console.log("erodeid", erodeid);
  const offsets = [[-1,0],[1,0],[0,1],[0,-1]];
  for(let i = 0; i< offsets.length;++i)
  {
    //let c = getColourAsHex(x + offsets[i][0], y + offsets[i][1],src,w,h);
    let ix  = x + offsets[i][0];
    let iy  = y + offsets[i][1];
    ix = Math.max(Math.min(ix,_w-1),0);
    iy = Math.max(Math.min(iy,_h-1),0);
    let index = iy*_w + ix;
    let id = idmapResult[index];
    if( id == erodeid )
    {
      // console.log("growid");
      idmapResult[index ] = 0;
    }

  }
  return 0;
}


function growSegmentsPixelProcess4Neighbour(idmapResult, x,y, growid)
{
  const offsets = [[-1,0],[1,0],[0,1],[0,-1]];
  for(let i = 0; i< offsets.length;++i)
  {
    //let c = getColourAsHex(x + offsets[i][0], y + offsets[i][1],src,w,h);
    let ix  = x + offsets[i][0];
    let iy  = y + offsets[i][1];
    ix = Math.max(Math.min(ix,_w-1),0);
    iy = Math.max(Math.min(iy,_h-1),0);
    let index = iy*_w + ix;
    let id = idmapResult[index];
    if( id == 0 )
    {
      // console.log("growid");
      idmapResult[index ] = growid;
    }

  }
  return 0;
}

function growSegmentsPixelProcess4NeighbourForce(idmapResult, x,y, growid)
{
  const offsets = [[-1,0],[1,0],[0,1],[0,-1]];
  for(let i = 0; i< offsets.length;++i)
  {
    //let c = getColourAsHex(x + offsets[i][0], y + offsets[i][1],src,w,h);
    let ix  = x + offsets[i][0];
    let iy  = y + offsets[i][1];
    ix = Math.max(Math.min(ix,_w-1),0);
    iy = Math.max(Math.min(iy,_h-1),0);
    let index = iy*_w + ix;
    // console.log(index ,growid);
    idmapResult[index ] = growid;
  }
  return 0;
}

function growRoad(ninterations, targetID = 0)
{
  for(let k =0; k< ninterations;++k)
  {
    console.log("grow road", (k+1) + "/" + ninterations);
    let idmapResult = _idmap.slice(0);
    for(let x =0; x < _w;++x)
    {
      for(let y =0; y < _h;++y)
      {
        let id = _idmap[y*_w + x];
        if( id == -1 ) { // road pixel
          growRoadPixelProcess(idmapResult, x, y, targetID);
        }
      }
    }

    // switch
    let temp = idmapResult;
    idmapResult = _idmap;
    _idmap =  temp;
  }
}

function growRoadPixelProcess(idmapResult, x,y , targetID= 0 )
{
  //const offsets = [[-1,0],[1,0],[0,1],[0,-1], [-1,1],[1,-1],[-1,-1],[1,1]];
  const offsets = [[-1,0],[1,0],[0,1],[0,-1]];

  for(let i = 0; i< offsets.length;++i)
  {
    //let c = getColourAsHex(x + offsets[i][0], y + offsets[i][1],src,w,h);
    let ix  = x + offsets[i][0];
    let iy  = y + offsets[i][1];
    ix = Math.max(Math.min(ix,_w-1),0);
    iy = Math.max(Math.min(iy,_h-1),0);
    let index = iy*_w + ix;
    let id = idmapResult[index];
    if( id == targetID )
    {
      // console.log("growid");
      idmapResult[index ] = -1;
    }

  }
  return 0;
}

function replaceIDsEqualAndMoreThan(oldid,newid)
{
  let n = _w*_h;
  for(let i =0; i< n; ++i)
  {
    if(_idmap[i] >= oldid) _idmap[i] = newid;
  }
}


function replaceIDs(oldid,newid)
{
  let n = _w*_h;
  for(let i =0; i< n; ++i)
  {
    if(_idmap[i] == oldid) _idmap[i] = newid;
  }
}

function replaceIDsForIndexArray(segmentPixelIndexArray,newid)
{
  let n = segmentPixelIndexArray.length;
  for(let i =0; i< n; ++i)
  {
    _idmap[segmentPixelIndexArray[i]] = newid;
  }
}

function drawRoadToIDMap(data, threshold)
{
  let roadpixelcount = 0;
  let x,y;
  let n = _w*_h;
  for(let i = 0; i < n;++i)
  {
    x = i % _w;
    y = Math.floor( i / _w );
    if(isRoadPixel(x,y,_w,data, threshold))
    {
      _idmap[i] = -1; // -1 signals a road
      roadpixelcount++;
    }
  }
  console.log("roadpixelcount",roadpixelcount);
}

// clears road overthreshold
function clearRoadLessThanThreshold(data, threshold)
{
  let n = _w*_h;

  for(let i = 0; i < n;++i)
  {
    x = i % _w;
    y = Math.floor( i / _w );
    if(!isRoadPixel(x,y,_w,data, threshold))
    {
      if(_idmap[i] == -1) {
        _idmap[i] = 0; // -1 signals a road
      }
    }
  }
}



function createSegmentMap()
{
  segmentMap = {};
  let n = _w*_h;

  let id;
  for(let i =0; i< n;++i)
  {
    id = _idmap[i];
    if(segmentMap[id] == null)
    {
      segmentMap[id] = [];
    }
    segmentMap[ id ].push(i);
  }
  //console.log("[createSegmentMap] segmentMap",segmentMap == null);
}

function doFloodFill(x, y, width, h, id, searchId)
{


  //let length = data.length;
  let Q = [];
  let i = (x+y*width);
  let e = i, w = i, me, mw, w2 = width;
  let length = width*h;

  // console.log(i, id, length);

  if(!pixelCompare(i,searchId,length)) { return false; }

  Q.push(i);
  while(Q.length) {
    i = Q.pop();
    //  console.log("pop ", i);
    if(pixelCompareAndSet(i,id,searchId,length)) {
      e = i;
      w = i;
      mw = parseInt(i/w2)*w2; //left bound
      me = mw+w2;	//right bound
      while(mw<=(w-=1) && pixelCompareAndSet(w,id,searchId,length)); //go left until edge hit
      //console.log("h1");
      w +=1;
      if(w < mw) w = mw ;
      //
      while(me>(e+=1) && pixelCompareAndSet(e,id,searchId,length)); //go right until edge hit


      e -=1;
      if(e > me) e = me ;
      //
      //    console.log("h2 w ", w);
      //    console.log("h2 e ", e);
      for(let j=w;j<=e;j+=1) {
        //   console.log("h3 j" , j);

        //   if(!pixelCompare(j,id,length)) continue;

        if(j-w2>=0 		&& pixelCompare(j-w2,searchId,length)) {
          //    console.log("push", j - w2);

          Q.push(j - w2); //queue y-1
        }
        // console.log("h4");

        if(j+w2<length	&& pixelCompare(j+w2,searchId,length)){
          Q.push(j+w2);
          //      console.log("push", j + w2);

        } //queue y+1
      }
    }
  }

}

function pixelCompare(i,searchId,length)
{
  let x = i % _w;
  let y = Math.floor( i / _w );
  if(x < 0 || x >= _w) return false;
  if(y < 0 || y >= _h) return false;
  if (i<0||i>=length) return false; //out of bounds
  //return _idmap[i] == id;
  return _idmap[i] == searchId;
}

function pixelCompareAndSet(i,id,searchId,length)
{
  if(pixelCompare(i,searchId,length))
  {
    // let x = i % _w;
    //  let y = Math.floor( i / _w );
    //    console.log("(" + x + "," + y +  ")", id) ;
    _idmap[i] = id;
    return true;
  }
  return false;
}

// check for red
function isRoadPixel(x,y,w,data, threshold)
{
  let ix = 4*(y*w + x);
  // 50-100
  let r= data[ix + 0];
  let g = data[ix + 1];
  let b = data[ix + 2];


  return (r >= threshold) /*&& (r > g) && (r > b)*/;
  /*
   let ix = 4*(y*w + x);
   // 50-100
   let r= data[ix + 0];
   let g = data[ix + 1];
   let b = data[ix + 2];
   let THRES = (includeAntiAliasing) ?  230 : 70;

   if(includeAntiAliasing &&( r<= 2) && (g <= 2) && (b <= 2) )
   {
   return false;
   }
   if(includeAntiAliasing && (r == 0) && (g== 0) && (b < 200))
   {
   return true;
   }
   return ( Math.abs(r-g) < 2  &&  Math.abs(g-b) < 2 ) && (r < THRES && g < THRES && b < THRES); //lower the threshold the larger the segments, as it will jukmps borders more easily
   */
}

// draw a land pixel to connect up land pieces that only shared a pixel diagonally. This will later help the floodfill algo which doesnt work with diagonals
// do this after the land & water is drawn to the idmap
function connectDiagonalLandMasses()
{
  for(let x = 0; x < _w-1;++x)
  {
    for(let y = 0; y < _h-1;++y)
    {
      let ix_tl = x + y*_w;
      let ix_tr = (x+1) + y*_w;
      let ix_bl = x + (y+1)*_w;
      let ix_br = (x+1) + (y+1)*_w;
      let tl =  _idmap[ix_tl] == 0; // land
      let tr =  _idmap[ix_tr]== 0;
      let bl =  _idmap[ix_bl]== 0;
      let br =  _idmap[ix_br]== 0;
      if(tl && !tr && !bl && br)
      {
        // fill in  to connect
        _idmap[ix_tr] = 0;
      }
      else if(!tl && tr && bl && !br)
      {
        // fill in  to connect
        _idmap[ix_tl] = 0;
      }
    }
  }
}

// todo
function connectDiagonalsForSpecificSegmentsAndClear(segmentsToCheckMap)
{

  let segmentToClear = [];
  for(let x = 0; x < _w-1;++x)
  {
    for(let y = 0; y < _h-1;++y)
    {
      let ix_tl = x + y*_w;
      let ix_tr = (x+1) + y*_w;
      let ix_bl = x + (y+1)*_w;
      let ix_br = (x+1) + (y+1)*_w;



      let tl =  _idmap[ix_tl] > 0; //  segment
      let tr =  _idmap[ix_tr] > 0;
      let bl =  _idmap[ix_bl] > 0;
      let br =  _idmap[ix_br] > 0;


      if( (segmentsToCheckMap[ _idmap[ ix_tl] ] || segmentsToCheckMap[_idmap[ix_br]])  && tl && !tr && !bl && br )
      {
        console.log("-----here1");

        // fill in  to connect
        _idmap[ix_tr] = 0;
        //  segmentToClear.push(_idmap[ix_tl]);
        //  segmentToClear.push(_idmap[ix_br]);
      }
      else if((segmentsToCheckMap[_idmap[ix_tr]] || segmentsToCheckMap[_idmap[ix_bl]])  &&  !tl && tr && bl && !br)
      {
        console.log("-----here2");

        // fill in  to connect
        _idmap[ix_tl] = 0;
        //  console.log("connect diagonal", ix_tl);
        // todo clear the segments that in
        // get the segments ids, tr, bl
        //  segmentToClear.push(_idmap[ix_tr]);
        // segmentToClear.push(_idmap[ix_bl]);
      }
    }
  }

  //console.log("segmentMap", segmentMap);
  /*
  for(let i =0; i < segmentToClear.length;++i){
    clearIndexArray(segmentMap[segmentToClear[i]]);
  }*/

//  let keys = Object.keys(segmentsToCheckMap);
  //for(let i =0; i < keys.length;++i){
  //  let seg = keys[i];
  //console.log("seg", seg);
  //clearIndexArray(segmentMap[seg]);
  //}
}


// do a 4 pixel row search for blurry thin segments that are not captured by the initial thresholding
function findThinLandPixelsDiagonal2(srcImageData)
{
  let LAND_CHANNEL = 1;
  let EDGE_THRESHOLD = 60; // sum that the 2 middle values need to add to be recognised
  let SUM_THRESHOLD = 120; // sum that the 2 middle values need to add to be recognised
  let FILL_THRESHOLD = 10; // threshold to fill in a pixel
  let OUTER_EDGE_THRESHOLD = 0;  // edge pixel

  let d = srcImageData.data;
  let c0,c1,c2,c3;
  for(let y = 0; y < _h-3 ; ++ y){
    for(let x = 3; x < _w ; ++ x){
      c0 = d[4*( y*_w + x - 0 ) + LAND_CHANNEL];
      c1 = d[4*( (y+1)*_w + x - 1 ) + LAND_CHANNEL];
      c2 = d[4*( (y+2)*_w + x - 2 ) + LAND_CHANNEL];

      c3 = d[4*( (y+2)*_w + x - 0 ) + LAND_CHANNEL];
      if((c0 <= OUTER_EDGE_THRESHOLD) && (c2 <= OUTER_EDGE_THRESHOLD))
      {
        if( (c1 > EDGE_THRESHOLD) && (c3 > EDGE_THRESHOLD) )
        {
          // console.log("here------");

          // fill in the pixel to form a right angle
          _idmap[(y+2)*_w + x - 1] = 0;

          // fill the diagonal,c1,c3
          _idmap[(y+1)*_w + x - 1] = 0;
          _idmap[(y+2)*_w + x - 0] = 0;

          //if(c3 >= FILL_THRESHOLD){
          // _idmap[(y+1)*_w + x - 1] = 0;
          // }

          //if(c2 >= FILL_THRESHOLD){
          // _idmap[(y+2)*_w + x - 2] = 0;
          //}
        }
      }
    }
  }

}

// do a 4 pixel row search for blurry thin segments that are not captured by the initial thresholding
function findThinLandPixelsDiagonal1(srcImageData)
{
  let LAND_CHANNEL = 1;
  let EDGE_THRESHOLD = 60; // sum that the 2 middle values need to add to be recognised
  let SUM_THRESHOLD = 120; // sum that the 2 middle values need to add to be recognised
  let FILL_THRESHOLD = 10; // threshold to fill in a pixel
  let OUTER_EDGE_THRESHOLD = 0;  // edge pixel

  let d = srcImageData.data;
  let c0,c1,c2,c3;
  for(let y = 3; y < _h ; ++ y){
    for(let x = 3; x < _w ; ++ x){
      c0 = d[4*( y*_w + x + 0 ) + LAND_CHANNEL];
      c1 = d[4*( (y+1)*_w + x + 1 ) + LAND_CHANNEL];
      c2 = d[4*( (y+2)*_w + x + 2 ) + LAND_CHANNEL];

      c3 = d[4*( (y+2)*_w + x + 0 ) + LAND_CHANNEL];
      if((c0 <= OUTER_EDGE_THRESHOLD) && (c2 <= OUTER_EDGE_THRESHOLD))
      {
        if( (c1 > EDGE_THRESHOLD) && (c3 > EDGE_THRESHOLD) )
        {
          // console.log("here------");

          // fill in the pixel to form a right angle
          _idmap[(y+2)*_w + x + 1] = 0;

          // fill the diagonal,c1,c3
          _idmap[(y+1)*_w + x + 1] = 0;
          _idmap[(y+2)*_w + x + 0] = 0;

          //if(c3 >= FILL_THRESHOLD){
          // _idmap[(y+1)*_w + x - 1] = 0;
          // }

          //if(c2 >= FILL_THRESHOLD){
          // _idmap[(y+2)*_w + x - 2] = 0;
          //}
        }
      }
    }
  }
}

// do a 4 pixel row search for blurry thin segments that are not captured by the initial thresholding
function findThinLandPixelsXAxis(srcImageData)
{
  let LAND_CHANNEL = 1;
  let SUM_THRESHOLD = 120; // sum that the 2 middle values need to add to be recognised
  let FILL_THRESHOLD = 10; // threshold to fill in a pixel
  let OUTER_EDGE_THRESHOLD = 0;  // edge pixel

  let d = srcImageData.data;
  let c0,c1,c2,c3;
  for(let y = 0; y < _h ; ++ y){

    for(let x = 0; x < _w-3 ; ++ x){

      c0 = d[4*( y*_w + x + 0 ) + LAND_CHANNEL];
      c1 = d[4*( y*_w + x + 1 ) + LAND_CHANNEL];
      c2 = d[4*( y*_w + x + 2 ) + LAND_CHANNEL];
      c3 = d[4*( y*_w + x + 3 ) + LAND_CHANNEL];
      if((c0 <= OUTER_EDGE_THRESHOLD) && (c3 <= OUTER_EDGE_THRESHOLD))
      {
        if( (c1 +c2) > SUM_THRESHOLD )
        {
          //   console.log("here------");

          if(c1 >= FILL_THRESHOLD){
            _idmap[y*_w + x + 1] = 0;
          }
          if(c2 >= FILL_THRESHOLD){
            _idmap[y*_w + x + 2] = 0;
          }
        }
      }
    }
  }

}

// do a 4 pixel row search for blurry thin segments that are not captured by the initial thresholding
function findThinLandPixelsYAxis(srcImageData)
{
  let LAND_CHANNEL = 1;
  let SUM_THRESHOLD = 120; // sum that the 2 middle values need to add to be recognised
  let FILL_THRESHOLD = 10; // threshold to fill in a pixel
  let OUTER_EDGE_THRESHOLD = 0;  // edge pixel
  let d = srcImageData.data;
  let c0,c1,c2,c3;

  for(let x = 0; x < _w ; ++ x){
    for(let y= 0;  y < _h ; ++ y){
      c0 = d[4*( y*_w + x  ) + LAND_CHANNEL];
      c1 = d[4*( (y+1)*_w + x  ) + LAND_CHANNEL];
      c2 = d[4*( (y+2)*_w + x  ) + LAND_CHANNEL];
      c3 = d[4*( (y+3)*_w + x  ) + LAND_CHANNEL];
      if((c0 <= OUTER_EDGE_THRESHOLD) && (c3 <= OUTER_EDGE_THRESHOLD))
      {
        if( (c1 +c2) > SUM_THRESHOLD )
        {
          if(c1 >= FILL_THRESHOLD){
            _idmap[ (y+1)*_w + x] = 0;
            //   console.log("fill here", x, y+1);
          }
          if(c2 >= FILL_THRESHOLD){
            _idmap[ (y+2)*_w + x] = 0;
            // console.log("fill here", x, y+2);

          }
        }
      }
    }
  }

}

function isWaterPixel(x,y,w,data, includeAntiAliasing = false)
{
  let ix = 4*(y*w + x);
  // 50-100
  let r= data[ix + 0];
  let g = data[ix + 1];
  let b = data[ix + 2];
  //  return (b >10 )  && (b > g) ;//&& (b > r)  ;
  return (b >10 )  && (g < 10) ; // want to exclude land parts over the sea,  e.g [0,100,155]

  //let THRES =  (includeAntiAliasing) ? 230 : 70;
  //let BTHRES = (includeAntiAliasing) ? 40 : 40;
  //return (r < b) &&  (Math.abs(r-g) < 2 )  &&  (r < THRES) && (g < THRES) && (b >= BTHRES); //lower the threshold the larger the segments, as it will jukmps borders more easily
}

////////////////////////////////////////////////

function findIdCountMapForSegment(srcImageData, idmapImageData, segment) {
  let w = srcImageData.width;
  let d = idmapImageData.data;
  let id, ix, x, y;
  let n = segment.length;

  let scale = srcImageData.width / idmapImageData.width;
  let idval;
  let idMap = {};

  //console.log("scale: " + scale);
  for (let i = 0; i < n; ++i) {
    ix = segment[i];
    x = ix % w;
    y = Math.floor(ix / w);
    x /= scale;
    y /= scale;
    x = Math.round(x);
    y = Math.round(y);

    ix = y * idmapImageData.width + x;
    idval = d[4 * ix + 0];
    //console.log( x, y,  d[4*ix + 0], d[4*ix + 1], d[4*ix + 2], d[4*ix + 3]);

    if (idMap[idval] == null) idMap[idval] = 0;
    idMap[idval]++;
  }

  return idMap;
}

// convert to array, ordered by most first
function findIdOrderedCountsForSegment(srcImageData, idmapImageData, segment) {
  let idMap = findIdCountMapForSegment(srcImageData, idmapImageData, segment);

  let counts = [];
  let ids = Object.keys(idMap);
  for (let i = 0; i < ids.length; ++i) {
    let id = ids[i];
    if((id != null) ) {
      counts.push({id: id, count: idMap[id]});
    }
  }
  counts.sort(function (a, b) {
    return b.count - a.count;
  });
  return counts;
}

// common method to get the ID counts over a particular segment
function findMainIdForSegment(srcImageData, idmapImageData, segment) {

  let idMap = findIdCountMapForSegment(srcImageData, idmapImageData, segment);

  // get highest
  let highestCount = 0;
  let highestID = -10000;
  for (let id in idMap) {
    if (idMap.hasOwnProperty(id) && (id != null)) {
      let count = idMap[id];
      if(count > highestCount  ) {
        highestCount = count;
        highestID = id;
      }
    }
  }
  console.log("highestCount:" + highestCount + " highestID: "+ highestID);

  console.log("here---------" + (Number.parseInt( highestID) == NaN));

  if(Number.parseInt( highestID) === NaN) {
    console.log("here---------");
    for (let i = 0; i < n; ++i) {
      ix = segment[i];
      x = ix % w;
      y = Math.floor(ix / w);
      x /= scale;
      y /= scale;
      x = Math.round(x);
      y = Math.round(y);
      console.log("x:" + x + ",y:" + y);
    }
  }
  return highestID;
}

// split segments
function findCountsForSegmentsAndErode(srcImageData, idmapImageData) {
  // for each segment race out counts
  let segmentsToSplit = [];

  for (let segmentID in segmentMap) {
    if (segmentMap.hasOwnProperty(segmentID)) {
      if (segmentID > 0) {
        let segment = segmentMap[segmentID];
        let orderedCounts = findIdOrderedCountsForSegment(srcImageData, idmapImageData, segment);
        console.log("segmentID", segmentID, "orderedCounts", orderedCounts);
        if(orderedCounts.length > 2){
          let c1 = orderedCounts[0].count;
          let c2 = orderedCounts[1].count;
          if(c2 > 1000)
          {
            segmentsToSplit.push(segmentID);
          }
        }
      }
    }
  }
  console.log("segmentsToSplit", segmentsToSplit);

  let SOME_TEMP_NEGATIVE_ID = -10000000;
  for(let i =0; i < segmentsToSplit.length;++i)
  {
    let segmentID = segmentsToSplit[i];
    replaceIDs(segmentID, SOME_TEMP_NEGATIVE_ID );

  }
  erodeSegment(2, SOME_TEMP_NEGATIVE_ID);
  doFloodFillSegmenting(SOME_TEMP_NEGATIVE_ID);
  removeSmallSegments(10, 10, 2);

  growSegments(2);
  //replaceIDs(SOME_TEMP_NEGATIVE_ID,0);
  // growRoad(2, SOME_TEMP_NEGATIVE_ID);

//  replaceIDs(-1,0);
//  growSegment(2, SOME_TEMP_NEGATIVE_ID);

  //doFloodFillSegmenting();
  // createSegmentMap();
}
//


function overlayRoadPixels(srcImageData, destImageData, colour)
{
  let srcChannelIndex = 0; // road is the red channel
  let d = destImageData.data;
  let s = srcImageData.data;

  // road is in re
  let w = srcImageData.width;
  let h = srcImageData.height;
  for(let x = 0; x < w; ++x)
  {
    for(let y = 0; y < h; ++y)
    {
      let ix = y*w + x;
      let roadAlpha = s[ 4*ix + srcChannelIndex ] /255; // roadAlpha
      let destAlpha =  d[4*ix + 3] / 255;
      let r = roadAlpha;

      // logic is if destAlpha = 0, then blendR = 1
      // logic is if destAlpha = 1, then blendR = roadAlpha
      // blendR = (1- destAlpha) * roadAlpha?
      let blendR = (destAlpha == 0 ) ? 1: roadAlpha;
      //let blendR = roadAlpha / ( roadAlpha +  destAlpha ); // blend it
      let blendAlpha = roadAlpha * ( 1 -  destAlpha ); // blend it
      d[4*ix + 0] = Math.round( colour[0]*blendR + d[4*ix + 0]*(1.0-blendR));
      d[4*ix + 1] = Math.round( colour[1]*blendR + d[4*ix + 1]*(1.0-blendR));
      d[4*ix + 2] = Math.round( colour[2]*blendR + d[4*ix + 2]*(1.0-blendR));
      //d[4 * ix + 3] = Math.round( blendAlpha*255 )  ;
      d[4 * ix + 3] =  Math.min(255, Math.round(r*255) + d[4*ix  + 3] );

    }
  }
}

function overlayWaterPixels(srcImageData, destImageData, colour)
{
  let srcChannelIndex = 2; // blue channel
  let d = destImageData.data;
  let s = srcImageData.data;
  // road is in re
  let w = srcImageData.width;
  let h = srcImageData.height;
  for(let x = 0; x < w; ++x)
  {
    for(let y = 0; y < h; ++y)
    {
      let ix = y*w + x;
      let r = s[ 4*ix + srcChannelIndex ];
      let rr =  s[ 4*ix + 0 ];
      let gg =  s[ 4*ix + 1 ];

      let bb =  s[ 4*ix + 2 ];
      let waterAlpha = bb;
      let destAlpha = d[ 4*ix + 3 ];
      let isRoadOverWaterPixel = false; //(rr > 0) && (bb > 0);
      if(bb < 255)
      {
        if((bb > gg) && (rr > gg) )
        {
          // theres a bit of red, and mainly sea colour compared to land
          // there should also a strong red in the neighbour

          isRoadOverWaterPixel = true;
        }
        // check if its a road pixel
      }

      let blendR = (destAlpha == 0 ) ? 1: waterAlpha / 255;
      //let blendR = waterAlpha / ( waterAlpha +  destAlpha ); // blend it

      if(isRoadOverWaterPixel) blendR = 1.0; // make it full colour to not show the background, road then goes over
      else {
        //r = r / 255.0;
      }
      // blend with existing colour
      /*
      d[4 * ix + 0] = Math.round(colour[0] * r + d[4 * ix + 0] * (1.0 - r));
      d[4 * ix + 1] = Math.round(colour[1] * r + d[4 * ix + 1] * (1.0 - r));
      d[4 * ix + 2] = Math.round(colour[2] * r + d[4 * ix + 2] * (1.0 - r));
      d[4 * ix + 3] = Math.min(255, Math.round(r*255) + d[4*ix  + 3] );
*/
      d[4*ix + 0] = Math.round( colour[0]*blendR + d[4*ix + 0]*(1.0-blendR));
      d[4*ix + 1] = Math.round( colour[1]*blendR + d[4*ix + 1]*(1.0-blendR));
      d[4*ix + 2] = Math.round( colour[2]*blendR + d[4*ix + 2]*(1.0-blendR));
      //d[4 * ix + 3] = Math.round( blendAlpha*255 )  ;
      d[4 * ix + 3] =  Math.min(255, Math.round(r) + d[4*ix  + 3] );


    }
  }
}

// used by the preview map to add extra land pixels to the water near roads on the edge of the water.
// this helps to combine segment colours that might be one continous segment for the full version
function do2x2SearchForLandWaterRoad()
{
  let _temp = _idmap.slice(0); // make a copy for this to be correct, otherwise brdiges are fully covered
  for(let x = 0; x < _w-1;++x) {
    for (let y = 0; y < _h - 1; ++y) {
      let id0 = _temp[y*_w + x];
      let id1 = _temp[(y+1)*_w + x];
      let id2 = _temp[y*_w + x + 1];
      let id3 = _temp[(y+1)*_w + x + 1];
      let vals = [id0,id1,id2,id3];
      // contains water, road, water
      if(vals.includes(-1) && vals.includes(-2) && vals.includes(0))
      {
        //
        if(_temp[y*_w + x] == -2) _idmap[y*_w + x] = 0;
        if(_temp[(y+1)*_w + x] == -2) _idmap[(y+1)*_w + x] = 0;
        if(_temp[y*_w + x + 1] == -2) _idmap[y*_w + x + 1] = 0;
        if(_temp[(y +1)*_w + x + 1] == -2) _idmap[(y +1)*_w + x + 1] = 0;

      }
    }
  }
}