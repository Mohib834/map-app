var UPNG = require('upng-js');

module.exports = {
  downloadImage,
  loadImage,
  loadPreviewMapPixels,
  downloadImageAndGetImageData,
  getPixelData,
  createImageData,
  cloneImageData,
  createImageWithSameSize,
  test,
  scaleImageData,
  applySharpenFilterToImageData,
  getColourAsHex,
  applyGrowFilter,
  applyGrowFilterToRoadChannel,
  fillRectPixels,
  fillWithColour,
  saveImageDataToPNG,
  savePixelDataToPNG

};

function saveImageDataToPNG(imageData,name){
  console.log("saveImageDataToPNG", imageData);
  let useUPNG = true;

  if(useUPNG) {
    let pngArrayBuffer = UPNG.encode([imageData.data.buffer], imageData.width, imageData.height, 0 );
    console.log("UPNG ",pngArrayBuffer);
    let blob = new Blob( [ pngArrayBuffer ], { type: "image/png" } );

    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = name + ".png";
    link.click();
  }
  else{ // use standard way
    let canvas = document.createElement("canvas");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    let ctx = canvas.getContext("2d")
    ctx.putImageData(imageData, 0, 0);
    let image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
    let link = document.createElement('a');
    link.download = name + ".png";
    link.href = image;
    link.click();
  }
}


function savePixelDataToPNG(data,w,h,name){
  console.log("savePixelDataToPNG", data);

  let canvas = document.createElement("canvas");
  canvas.width  = w;
  canvas.height = h;
  let ctx = canvas.getContext("2d")
  let imageData = {
    data:data,
    width:w,
    height:h
  };
  putImageData(ctx, imageData,0,0);
  let image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
  let link = document.createElement('a');
 // let text1= this.$store.getters.previewMap_text1;
  link.download =  name + ".png";
  link.href = image;
  link.click();
}


function putImageData(ctx, imageData, dx, dy,
                      dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
  let data = imageData.data;
  let height = imageData.height;
  let width = imageData.width;
  dirtyX = dirtyX || 0;
  dirtyY = dirtyY || 0;
  dirtyWidth = dirtyWidth !== undefined? dirtyWidth: width;
  dirtyHeight = dirtyHeight !== undefined? dirtyHeight: height;
  let limitBottom = dirtyY + dirtyHeight;
  let limitRight = dirtyX + dirtyWidth;
  for (let y = dirtyY; y < limitBottom; y++) {
    for (let x = dirtyX; x < limitRight; x++) {
      let pos = y * width + x;
      ctx.fillStyle = 'rgba(' + data[pos*4+0]
        + ',' + data[pos*4+1]
        + ',' + data[pos*4+2]
        + ',' + (data[pos*4+3]/255) + ')';
      ctx.fillRect(x + dx, y + dy, 1, 1);
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// common
function fillWithColour(imageData, rgbaArray)
{
  let ix;
  let data = imageData.data;
  let w = imageData.width;
  let h = imageData.height;
  for(let i =0; i < w; ++i)
  {
    for(let j =0; j <  h; ++j) {
      ix = j*w + i;
      data[ 4*ix + 0 ] = rgbaArray[0];
      data[ 4*ix + 1 ] = rgbaArray[1];
      data[ 4*ix + 2 ] = rgbaArray[2];
      data[ 4*ix + 3 ] = rgbaArray[3];
    }
  }
}

function fillRectPixels(imageData, x,y,w,h, rgbArray)
{
  let ix;
  let data = imageData.data;
  let sw = imageData.width;
  let sh = imageData.height;

  for(let i =x; i < x+ w; ++i)
  {
    for(let j =y; j < y + h; ++j) {
      ix = j*sw + i;
      data[ 4*ix + 0 ] = rgbArray[0];
      data[ 4*ix + 1 ] = rgbArray[1];
      data[ 4*ix + 2 ] = rgbArray[2];
    }
  }
}



// helpr method - load pixels into upng image
function loadPreviewMapPixels(url)
{
  return new Promise(function(resolve, reject) {
    let oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";
    console.log("loadPreviewMapPixels", url);

    oReq.onload = function (oEvent) {
      console.log("loadPreviewMapPixels loaded", url);
      let arrayBuffer = oReq.response; // Note: not oReq.responseText
      if (arrayBuffer) {
        setTimeout(() => {
          let img = UPNG.decode(arrayBuffer);
          console.log("decoded", img.width, img.height, img.depth);
          let data = img.data;
          console.log("data", data[0], data[1], data[2], data[3]);
          //  img.arrayBuffer = arrayBuffer;
          resolve(img);
        }, 10);
      }
      else{
        reject();
      }
    };

    oReq.send(null);
  });
}

// helper
function loadImage(url)
{
  return new Promise(function(resolve, reject) {
    console.log("loadImage: " + url);
    let image = new Image();
    //  requestCORSIfNotSameOrigin(image, url);
    image.crossOrigin = "anonymous";
    image.src = url;
    image.onload = function () {
      console.log("image loaded " + url + " w: " + image.width);
      resolve(image);
    };
    image.onError = function(){
      reject();
    }
  });
}


async function downloadImageAndGetImageData(url)
{
  //TODO
  let img = await loadImage(url);
  let canvas = document.createElement("canvas");
  canvas.width  = img.width;
  canvas.height = img.height;
  let ctx = canvas.getContext("2d");
  let imageData;
  ctx.drawImage(img, 0, 0);
  imageData = ctx.getImageData(0, 0, img.width, img.height);
  return imageData;
}


// return promise
//TODO
function downloadImage(uri, outputpath)
{
  return new Promise(function(resolve, reject) {

  });
}


//TODO
// sigma  - the sigma of the Gaussian mask, where sigma = 1 + radius / 2.
// amount -  the level of sharpening  (optional, default 1.0)
async function applySharpenFilterToImageData(imageData, sigma = 1, amount = 1.0)
{
  //sigma = (sigma- 1)*2 ;
  console.log("applySharpenFilterToImageData applying...");
  if(sigma <=0.3) return;

// resize to fit the max dimension
  let w =imageData.width;
  let h = imageData.height;

  /*
  let imageProcessor = sharp(new Buffer(imageData.data.buffer), {raw: {width: w, height: h, channels: 4}});
  const { data, info } = await imageProcessor.blur(sigma)
    .toBuffer({ resolveWithObject: true });

  let n = 4 * w*h;
  for(let i =0; i < n; ++i) {
    //console.log(imageData.data[i], data[i]);
    let o = imageData.data[i];
    let gb = data[i];
    imageData.data[i] =  o + amount*(o- gb);
  }
*/


}

// TODO
function scaleImageData(imageData, perc) {
  let w = imageData.width;
  let h = imageData.height;
  // resize to fit the max dimension
  let rw, rh;
  rw = Math.round(w * perc);
  rh = Math.round(h * perc);
  console.log(rw, rh);

  // todo
  return imageData;
}

// tile is an image
function getPixelData(image)
{
  let w = image.width;
  let h = image.height;
  let canvas = document.createElement('canvas');
  canvas.width  = w;
  canvas.height = h;
  let ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, w, h, 0,0, w,h);
  let data = ctx.getImageData(0,0,w,h);
  return data;
}

function createImageData(w,h)
{
  console.log("creating image data: " + w + "," + h);
  let canvas = document.createElement('canvas');
  canvas.width  = w;
  canvas.height = h;
  let ctx = canvas.getContext('2d');
  return ctx.createImageData(w, h);
  //let data = ctx.getImageData(0,0,w,h);
  //return data;
}

function cloneImageData(src)
{
  console.log("cloneImageData", src);
  let dst = createImageData(src.width, src.height);
  dst.data.set(src.data);
  return dst;
}

function createImageWithSameSize(src)
{
  return createImageData(src.width, src.height);
}

// test creating an image and putting the buffer back
function test()
{
  let w = 100;
  let h = 100;
  let canvas = new Canvas(w, h)
  let ctx = canvas.getContext('2d');
  let imageData = ctx.getImageData(0,0,w,h);

  imageData.data[0] = 255;
  imageData.data[3] = 255; // alpha
  imageData.data[4 + 1] = 255;
  imageData.data[4 + 3] = 0; // alpha
  //imageData.data[4 + 1] = 255;

  ctx.putImageData(imageData,0,0);

  saveToFile(canvas, "test.png");
}


function getColourAsHex(x,y,d,w,h)
{

  x = Math.min(w-1,x);
  y = Math.min(h-1,y);
  x = Math.max(0,x);
  y = Math.max(0,y);
  let ix = 4*(y*w + x);



  return (d[ix + 0] << 16) + (d[ix + 1] << 8) + d[ix + 2];
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

// apply a  grow filter to a specific channel - this is meant for expanding out the road
function applyGrowFilterToRoadChannel(srcImageData, destImageData, channel)
{
  let dest = destImageData.data;
  let w = destImageData.width;
  let h = destImageData.height;
  let src = srcImageData.data;

  for(let x =0; x< w;++x)
  {
    for(let y =0; y< h;++y)
    {
      growFilterRoadProcessPixel(x,y,src,dest,w,h,channel);
    }
  }
  return destImageData;
}

// grow out the neighbour pixels if pixel (x,y)
function growFilterRoadProcessPixel(x,y,src, dest,w,h, channel)
{
  let ROADCOL = 255;

  let ix = 4*(y*w + x);
  //  let offsets = [[-1,0],[1,0],[0,1],[0,-1]];
  let offsets = [[-1,0],[1,0],[0,1],[0,-1], [-1,1],[1,-1],[-1,-1],[1,1]];
  let isRoad = src[ix + channel] > 30 ;

  if(isRoad )
  {
    dest[ix + channel] =  ROADCOL;

    // col[0] =
    // get the 4 neighbours
    let map = {};

    let whitehex = (255 << 16) + (255 << 8) + 255;

    for(let i = 0; i< offsets.length;++i)
    {
      let yy =Math.min(  Math.max(y+  offsets[i][1],0),h-1);
      let xx =Math.min(  Math.max(x+  offsets[i][0],0),w-1);

      //let c = getColourAsHex(x + offsets[i][0], y + offsets[i][1],src,w,h);
      ix = 4*(yy*w + xx);
      dest[ix + channel] =  ROADCOL;
    }

  }
}



function growFilterProcessPixel(x,y,src, dest,w,h)
{
  let ix = 4*(y*w + x);
  let col = [src[ix+0],src[ix+1],src[ix+2]];
  let isWhite = (col[0] ==255) && (col[1] ==255) &&(col[2] ==255);
  let offsets = [[-1,0],[1,0],[0,1],[0,-1], [-1,1],[1,-1],[-1,-1],[1,1]];


  let debugdone = true;


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
      let c = getColourAsHex(x + offsets[i][0], y + offsets[i][1],src,w,h);

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
