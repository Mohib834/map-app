// WebGL - 2D Image Swap Red and Blue
// from https://webglfundamentals.org/webgl/webgl-2d-image-red2blue.html

"use strict";

var frameImage;
var paperShadowImage;
var innerBorderImage;

var indexmap;
var colourmap;
var noisemap;
var map;
var roadmap;
var gl;
var previewProgram;
var colourmapProgram;
var uniforms ;

var _nextTextureIndex = 0;

////// colour picker test
$("#waterColourInput").spectrum({
    color: "#ffffff"
});
$("#waterColourInput").on("move.spectrum", function(e, color) {
    setWaterColour([color._r,color._g,color._b]);
    previewMapRenderUpdate();
});
$("#roadColourInput").spectrum({
    color: "#ffffff"
});
$("#roadColourInput").on("move.spectrum", function(e, color) {
    setRoadColour([color._r,color._g,color._b]);
    previewMapRenderUpdate();
});
for(var i =0; i< 11;++i)
{
    (function(ii) {
        $("#colourInput" + ii).spectrum({
            color: "#ffffff"
        });
        $("#colourInput" + ii).on("move.spectrum", function (e, color) {

            var themeColours = themes[curThemeID].segments;
            console.log("ii:" + ii);
            console.log("themeColours:" + themeColours);
            themeColours[ii].colour = [color._r, color._g, color._b];
            updateColourmap(themeColours);
            previewMapRenderUpdate();
        });
    })(i);
}

function loadImages(list, done)
{
    var nImages = list.length;
    var nImagesLoaded = 0;
    var loadedImages = {};
    for(var i =0 ;i <nImages;++i)
    {
        loadImage(list[i], function(image, url) {
            loadedImages[url] = image;
            if(++nImagesLoaded == nImages)
            {
                done(loadedImages);
            }
        });
    }
}

function main()
{
    var noiseMapURL = "image/noisemap1.png";
    var frameURL = "image/frame.png";
    var paperShadowURL = "image/paperShadow.png";
    var innerBorderURL = "image/innerBorder.png";
    var imageURLs = [noiseMapURL, frameURL, paperShadowURL, innerBorderURL];

    loadImages(imageURLs, function(images){
        noisemap = images[noiseMapURL];
        frameImage = images[frameURL];
        paperShadowImage = images[paperShadowURL];
        innerBorderImage = images[innerBorderURL];
        //noisemap = image;
        setupPreviewRendering();
        setColourmapRendering();
        loadMap(1);
    });

}


function loadMap(mapID)
{
    var mapfolder = "image/" + mapID;
    loadImage(mapfolder + "/abyss_0_line.png", function(image) {
        roadmap = image;
        loadImage(mapfolder + "/abyss_0_full.png", function (image) {
            indexmap = image;

            onMapLoaded();
            applyTheme(theme);
        })
    });
}

function loadImage(url, callback)
{
    var image = new Image();
    image.src = url;
    image.onload = function() {
        callback(image, url);
    }
}
var segmentsTexture;
var colourmapTex;
var colourmapTexWidth;
var colourmapTexHeight;


var textureRoadmap;
var textureNoisemap;
var previewPositionLocation;
var previewPositionBuffer;
var previewTexcoordLocation;
var previewTexcoordBuffer;
var canvas;
var fxcanvas;
var canvastexture;

function setupPreviewRendering()
{
    try {
        fxcanvas = fx.canvas();
    } catch (e) {
        alert(e);
        return;
    }

    canvas = document.getElementById("canvas");

    gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // setup GLSL previewProgram
    previewProgram = webglUtils.createProgramFromScripts(gl, ["map-vertex-shader", "map-fragment-shader"]);
    gl.useProgram(previewProgram);

    // uniform lookup
    uniforms = {
        roadmap: gl.getUniformLocation(previewProgram, 'roadmap'),
        u_image: gl.getUniformLocation(previewProgram, 'u_image'),
        noisemap: gl.getUniformLocation(previewProgram, 'noisemap'),
        colourmap: gl.getUniformLocation(previewProgram, 'colourmap'),
        u_resolution: gl.getUniformLocation(previewProgram, "u_resolution"),
        watercolour: gl.getUniformLocation(previewProgram, "watercolour"),
        roadcolour: gl.getUniformLocation(previewProgram, "roadcolour"),

    };
    /////////NOISE MAP
    textureNoisemap = createTextureFromImage(uniforms.noisemap, noisemap, 2);

    // look up where the vertex data needs to go.
    previewPositionLocation = gl.getAttribLocation(previewProgram, "a_position");
    previewTexcoordLocation = gl.getAttribLocation(previewProgram, "a_texCoord");

    // provide texture coordinates for the rectangle.
    previewTexcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, previewTexcoordBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0,
    ]), gl.STATIC_DRAW);

}

function onMapLoaded() {
    var image = indexmap;
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */

    canvas.width = image.width;
    canvas.height = image.height;
    gl.useProgram(previewProgram);

// todo optimse this, no need to keep  creating the gl resources each time?
    // Create a buffer to put three 2d clip space points in
    previewPositionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, previewPositionBuffer);
    // Set a rectangle the same size as the image.
    setRectangle(gl, 0, 0, image.width, image.height);

    ////////// MAP SEGMENTS
    // todo just upload?
    segmentsTexture = createTextureFromImage(uniforms.u_image, image, 0);
    ////////// ROAD AND WATER MAP
    textureRoadmap = createTextureFromImage(uniforms.roadmap, roadmap, 1);


    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    //create initial texture for effects
    canvastexture = fxcanvas.texture(gl.canvas);

}

function previewMapRenderUpdate()
{
    // render to the canvas
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Tell it to use our previewProgram (pair of shaders)
    gl.useProgram(previewProgram);

    // Turn on the position attribute
    gl.enableVertexAttribArray(previewPositionLocation);
    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, previewPositionBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        previewPositionLocation, size, type, normalize, stride, offset)

    // Turn on the teccord attribute
    gl.enableVertexAttribArray(previewTexcoordLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, previewTexcoordBuffer );

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        previewTexcoordLocation, size, type, normalize, stride, offset)

    // set the resolution
    gl.uniform2f(uniforms.u_resolution, gl.canvas.width, gl.canvas.height);

    // Draw the rectangle.

  //  setColourmapRendering();
    /*
    onVariationChange(0);
    setWaterColour(theme.water);
    setRoadColour(theme.road);
*/


    gl.activeTexture(getGLTextureID(0));
    gl.bindTexture(gl.TEXTURE_2D, segmentsTexture);
    gl.uniform1i(uniforms.colourmap, 0);
    gl.activeTexture(getGLTextureID(1));
    gl.bindTexture(gl.TEXTURE_2D, textureRoadmap);
    gl.uniform1i(uniforms.colourmap, 1);
    gl.activeTexture(getGLTextureID(2));
    gl.bindTexture(gl.TEXTURE_2D, textureNoisemap);
    gl.uniform1i(uniforms.colourmap, 2);
    gl.activeTexture(getGLTextureID(3));
    gl.bindTexture(gl.TEXTURE_2D, colourmapTexture);
    gl.uniform1i(uniforms.colourmap, 3);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);

    // update fx
    canvastexture.loadContentsOf(canvas);
    fxcanvas.draw(canvastexture).unsharpMask(1.3,3).update();
    canvas.parentNode.appendChild(fxcanvas);

    // scale, test drawing the border
    var scale = 0.9;
    var c=document.getElementById("scaledCanvas");
    var borderSize = 100;
    c.width  = fxcanvas.width*scale + borderSize;
    c.height = fxcanvas.height*scale + borderSize;
    var ctx=c.getContext("2d");

    // draw wall background
   // ctx.fillStyle = '#ffffff';
    ctx.fillStyle = '#f5ece3';
    ctx.fillRect(0, 0, c.width, c.height);

    // draw map
    ctx.drawImage(fxcanvas,50,50,fxcanvas.width*scale,fxcanvas.height*scale);


    //draw paperShadowImage
    drawScale9Grid(ctx,paperShadowImage, 35,35, fxcanvas.width*scale + 29,fxcanvas.height*scale + 29, 40,40,40,40,0.6);

    // draw inner border
    var innerBorderSize = 0;
   drawScale9Grid(ctx,innerBorderImage, 50,50, fxcanvas.width*scale ,fxcanvas.height*scale , 1,1,1,1,innerBorderSize);

    // draw bottom text background
    var textBgHeight = 60;
    ctx.drawImage(innerBorderImage,50, 50 + fxcanvas.height*scale - textBgHeight,fxcanvas.width*scale,textBgHeight);
    // draw text example
    var textLeftAlign = 10;
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Paris, France', 50 + textLeftAlign - 1, 50 + fxcanvas.height*scale - 34 );
    ctx.font = '10px Arial';
    ctx.fillText('23.334, 12.45', 50 + textLeftAlign - 1, 50 + fxcanvas.height*scale - 15);

    // draw frame
 //   drawScale9Grid(ctx,frameImage, 31,36, fxcanvas.width*scale + 36,fxcanvas.height*scale + 43, 50,70,50,50,0.6);

}

function drawScale9Grid(ctx, image, x,y,w,h, tBorder, bBorder, lBorder, rBorder, borderScale)
{
    var ih = image.height;
    drawScale9GridRow(ctx, image,x,w,lBorder,rBorder,0,tBorder, y,tBorder*borderScale, borderScale, true);
    drawScale9GridRow(ctx, image,x,w,lBorder,rBorder,tBorder,ih-bBorder-tBorder, y + tBorder*borderScale,h - (bBorder + tBorder)*borderScale, borderScale, false);
    drawScale9GridRow(ctx, image,x,w,lBorder,rBorder,ih- bBorder,bBorder, y + h - bBorder*borderScale,bBorder*borderScale, borderScale, true);

}

function drawScale9GridRow(ctx, image, x,w, lBorder, rBorder, srowy, srowh, rowy, rowh, borderScale, drawMiddle)
{
    var iw = image.width;
    ctx.drawImage(image, 0,srowy,lBorder, srowh , x,rowy,lBorder*borderScale, rowh);
    if(drawMiddle)ctx.drawImage(image, lBorder,srowy,iw - (rBorder + lBorder), srowh , x + lBorder*borderScale,rowy, w - (rBorder +lBorder)*borderScale , rowh);
    ctx.drawImage(image, iw - rBorder ,srowy,rBorder , srowh , x + (w - rBorder*borderScale),rowy, rBorder*borderScale, rowh);

}

/////////////////////////////////////////////////////////////////////////////////////////////

var colourmapUniforms = {};
var colourmapTexture;
var colourmapFBO;
var colourmapPositionBuffer;
var colourmapPositionLocation;

function setColourmapRendering() {
    colourmapTexWidth = 512;
    colourmapTexHeight  = 8;
    colourmapTexture =  createTexture(colourmapTexWidth,colourmapTexHeight);

    colourmapFBO = createFramebuffer(colourmapTexture);
    gl.bindFramebuffer(gl.FRAMEBUFFER, colourmapFBO);

    // setup GLSL previewProgram
    colourmapProgram = webglUtils.createProgramFromScripts(gl, ["colourmap-vertex-shader", "colourmap-fragment-shader"]);
    gl.useProgram(colourmapProgram);

    // uniform lookup
    colourmapUniforms = {
        u_colour: gl.getUniformLocation(colourmapProgram, 'u_colour'),
        u_resolution: gl.getUniformLocation(colourmapProgram, 'u_resolution'),
        u_x: gl.getUniformLocation(colourmapProgram, 'u_x'),
        u_w: gl.getUniformLocation(colourmapProgram, 'u_w'),

    };

    colourmapPositionLocation = gl.getAttribLocation(colourmapProgram, "a_position")     // look up where the vertex data needs to go.

    // Create a buffer to put three 2d clip space points in
    colourmapPositionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, colourmapPositionBuffer);
    // Set a rectangle the same size as the image.
    setRectangle(gl, 0, 0,1, 1);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our previewProgram (pair of shaders)


//  gl.vertexAttribPointer(
    //    previewPositionLocation, size, type, normalize, stride, offset);
    // set the resolution
//    gl.uniform2f(colourmapUniforms.u_resolution, gl.canvas.width, gl.canvas.height);

    // Draw the rectangle.
    gl.uniform1f(colourmapUniforms.u_x, 0.1);
    gl.uniform1f(colourmapUniforms.u_w, 0.1);

    // Turn on the position attribute
    gl.enableVertexAttribArray(colourmapPositionLocation);
    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, colourmapPositionBuffer);

 // return;

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer( colourmapPositionLocation, size, type, normalize, stride, offset);
}

function beginRenderToColourmap()
{
    // render to the colour map texture
    gl.bindFramebuffer(gl.FRAMEBUFFER, colourmapFBO);
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, colourmapTexWidth,colourmapTexHeight);
    // Clear the canvas
    gl.clearColor(0, 1, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our colourmapProgram (pair of shaders)
    gl.useProgram(colourmapProgram);

    // Turn on the position attribute
    gl.enableVertexAttribArray(colourmapPositionLocation);
    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, colourmapPositionBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        colourmapPositionLocation, size, type, normalize, stride, offset)

    // set the resolution
    gl.uniform2f(colourmapUniforms.u_resolution, colourmapTexWidth, colourmapTexHeight);

}

// draw a rectangle to the colourmap, x,width are normalised values [0,1]
function drawRectToColourmap(x,width, colour)
{
    console.log("x", x ,"width", width, colour);
    // Draw the rectangle.
    gl.uniform1f(colourmapUniforms.u_x, x);
    gl.uniform1f(colourmapUniforms.u_w, width);
    const f = 1.0/255.0;
    gl.uniform3f(colourmapUniforms.u_colour, colour[0]*f,colour[1]*f,colour[2]*f);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
}

function normaliseThemeWeights(themeSegments)
{
    var sum = 0;
    for(var i =0; i< themeSegments.length;++i)
    {
        sum += themeSegments[i].weight ;
    }
    for(var i =0; i< themeSegments.length;++i)
    {
        themeSegments[i].weight *= 1.0/sum ;
    }
    return themeSegments;
}

function updateColourmap(themeSegments)
{
    beginRenderToColourmap();
    themeSegments = normaliseThemeWeights(themeSegments);
    var x = 0;
    var w;
    for(var i =0; i < themeSegments.length;++i)
    {
        w = themeSegments[i].weight;
        drawRectToColourmap(x,w, themeSegments[i].colour);
        x += w;
    }
}

function createTexture(w,h)
{
    var targetTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);
    {
        // define size and format of level 0
        const level = 0;
        const internalFormat = gl.RGBA;
        const border = 0;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
        const data = null;
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            w, h, border,
            format, type, data);

        // set the filtering so we don't need mips
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    return targetTexture;
}

function createFramebuffer(tex)
{
    const level = 0;
    //Create and bind the framebuffer
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

// attach the texture as the first color attachment
    const attachmentPoint = gl.COLOR_ATTACHMENT0;
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, tex, level);
    return fb;
}


// create a GL texture and bind it to the uniform on the active shader previewProgram
function createTextureFromImage(uniform, image, textureID)
{
    var texture = gl.createTexture();
    gl.activeTexture(getGLTextureID(textureID));
    // Bind the texture to the texture unit
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.useProgram(previewProgram);
    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(uniform, textureID);
// Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    return texture;
}

function getGLTextureID(ix)
{
    if(ix == 0) return gl.TEXTURE0;
    if(ix == 1) return gl.TEXTURE1;
    if(ix == 2) return gl.TEXTURE2;
    if(ix == 3) return gl.TEXTURE3;
    if(ix == 4) return gl.TEXTURE4;
    if(ix == 5) return gl.TEXTURE5;
    return gl.TEXTURE6;
}



function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]), gl.STATIC_DRAW);
}

main();


function onVariationChange(ix)
{
    gl.useProgram(previewProgram);

    var variationLocation = gl.getUniformLocation(previewProgram, "u_variation");
    gl.uniform1f(variationLocation, ix);

    console.log("onVariationChange",ix);

    previewMapRenderUpdate();
}

// This is needed if the images are not on the same domain
// NOTE: The server providing the images must give CORS permissions
// in order to be able to use the image with WebGL. Most sites
// do NOT give permission.
// See: http://webglfundamentals.org/webgl/lessons/webgl-cors-permission.html
function requestCORSIfNotSameOrigin(img, url) {
    if ((new URL(url)).origin !== window.location.origin) {
        img.crossOrigin = "";
    }
}

/////////////////////////////////////////////////////////////////
// colour map test

function applyTheme(theme)
{
    // update the colourmap - this texture is used to sample from and picks colours for the segments
    updateColourmap(theme.segments);
    // set the uniforms for the water and road colour
    setWaterColour(theme.water);
    setRoadColour(theme.road);

    previewMapRenderUpdate();
}


// col = [r,g,b]
function setWaterColour(col)
{
    gl.useProgram(previewProgram);

    const f = 1.0/255.0;
    gl.uniform3f(uniforms.watercolour, col[0]*f,col[1]*f,col[2]*f);

    //
    $("#waterColourInput").spectrum("set", 'rgb('+col[0]+','+col[1]+', '+col[2]+')');

}

// col = [r,g,b]
function setRoadColour(col)
{
    gl.useProgram(previewProgram);

    const f = 1.0/255.0;
    gl.uniform3f(uniforms.roadcolour, col[0]*f,col[1]*f,col[2]*f);

    //
    $("#roadColourInput").spectrum("set", 'rgb('+col[0]+','+col[1]+', '+col[2]+')');

}

var themes = [{"road":[1,24,42],"water":[222,206,183],"segments":[{"colour":[233,221,195],"weight":13},{"colour":[234,212,173],"weight":35},{"colour":[224,202,164],"weight":10},{"colour":[201,184,155],"weight":6},{"colour":[190,173,145],"weight":12},{"colour":[179,163,137],"weight":14},{"colour":[106,191,172],"weight":6},{"colour":[80,173,152],"weight":15},{"colour":[48,139,130],"weight":13},{"colour":[39,168,163],"weight":20},{"colour":[43,156,150],"weight":16},{"colour":[54,198,193],"weight":7},{"colour":[19,106,113],"weight":15},{"colour":[0,72,84],"weight":8},{"colour":[0,36,60],"weight":14},{"colour":[1,24,42],"weight":12},{"colour":[2,68,90],"weight":12}]},{"road":[212,202,166],"water":[209,140,102],"segments":[{"colour":[233,221,195],"weight":13},{"colour":[182,132,104],"weight":5},{"colour":[217,184,141],"weight":13},{"colour":[234,212,173],"weight":15},{"colour":[224,202,164],"weight":10},{"colour":[201,184,155],"weight":6},{"colour":[190,173,145],"weight":12},{"colour":[179,163,137],"weight":14},{"colour":[106,191,172],"weight":6},{"colour":[80,173,152],"weight":15},{"colour":[48,139,130],"weight":13},{"colour":[39,168,163],"weight":20},{"colour":[43,156,150],"weight":16},{"colour":[54,198,193],"weight":7},{"colour":[19,106,113],"weight":15},{"colour":[0,72,84],"weight":8},{"colour":[0,36,60],"weight":14},{"colour":[1,24,42],"weight":12},{"colour":[2,68,90],"weight":12}]},{"road":[243,236,215],"water":[112,173,145],"segments":[{"colour":[98,153,128],"weight":36},{"colour":[164,210,170],"weight":69},{"colour":[255,77,68],"weight":24},{"colour":[252,198,82],"weight":40},{"colour":[216,192,126],"weight":0},{"colour":[215,192,128],"weight":25},{"colour":[255,231,164],"weight":32}]},{"road":[50,50,50],"water":[204,212,213],"segments":[{"colour":[204,212,213],"weight":201},{"colour":[25,164,193],"weight":6},{"colour":[69,194,220],"weight":19},{"colour":[116,193,209],"weight":8},{"colour":[76,76,76],"weight":21},{"colour":[139,139,139],"weight":22},{"colour":[181,181,181],"weight":21}]},{"road":[105,130,138],"water":[155,200,215],"segments":[{"colour":[29,26,24],"weight":38},{"colour":[128,128,128],"weight":18},{"colour":[249,249,249],"weight":21},{"colour":[139,139,139],"weight":31},{"colour":[216,216,216],"weight":42},{"colour":[76,76,76],"weight":51},{"colour":[181,181,181],"weight":25},{"colour":[216,216,216],"weight":33}]},{"road":[29,26,24],"water":[185,185,185],"segments":[{"colour":[128,128,128],"weight":18},{"colour":[249,249,249],"weight":21},{"colour":[139,139,139],"weight":31},{"colour":[216,216,216],"weight":42},{"colour":[76,76,76],"weight":51},{"colour":[181,181,181],"weight":25},{"colour":[216,216,216],"weight":33}]},{"road":[29,26,24],"water":[202,165,132],"segments":[{"colour":[128,128,128],"weight":18},{"colour":[249,249,249],"weight":21},{"colour":[139,139,139],"weight":31},{"colour":[216,216,216],"weight":42},{"colour":[76,76,76],"weight":51},{"colour":[181,181,181],"weight":25},{"colour":[216,216,216],"weight":33}]},{"road":[29,26,24],"water":[67,171,160],"segments":[{"colour":[138,190,185],"weight":18},{"colour":[249,249,249],"weight":21},{"colour":[142,160,158],"weight":16},{"colour":[139,139,139],"weight":14},{"colour":[163,191,189],"weight":18},{"colour":[216,216,216],"weight":23},{"colour":[76,76,76],"weight":51},{"colour":[181,181,181],"weight":25},{"colour":[216,216,216],"weight":33}]},{"road":[29,26,24],"water":[160,194,131],"segments":[{"colour":[128,128,128],"weight":18},{"colour":[249,249,249],"weight":21},{"colour":[139,139,139],"weight":31},{"colour":[216,216,216],"weight":42},{"colour":[76,76,76],"weight":51},{"colour":[181,181,181],"weight":25},{"colour":[216,216,216],"weight":33}]},{"road":[29,26,24],"water":[241,117,138],"segments":[{"colour":[128,128,128],"weight":18},{"colour":[249,249,249],"weight":21},{"colour":[139,139,139],"weight":31},{"colour":[216,216,216],"weight":42},{"colour":[76,76,76],"weight":51},{"colour":[181,181,181],"weight":25},{"colour":[216,216,216],"weight":33}]},{"road":[29,26,24],"water":[240,241,117],"segments":[{"colour":[228,228,161],"weight":25},{"colour":[249,249,249],"weight":21},{"colour":[139,139,139],"weight":31},{"colour":[216,216,216],"weight":42},{"colour":[76,76,76],"weight":51},{"colour":[181,181,181],"weight":25},{"colour":[216,216,216],"weight":33}]},{"road":[72,82,89],"water":[101,164,205],"segments":[{"colour":[204,212,213],"weight":201},{"colour":[111,162,198],"weight":6},{"colour":[160,184,201],"weight":19},{"colour":[185,210,229],"weight":8},{"colour":[76,76,76],"weight":21},{"colour":[103,117,127],"weight":22},{"colour":[176,176,176],"weight":21}]},{"road":[255,255,255],"water":[200,116,93],"segments":[{"colour":[28,33,56],"weight":46},{"colour":[200,116,93],"weight":3},{"colour":[66,73,103],"weight":37},{"colour":[143,144,177],"weight":66},{"colour":[182,183,196],"weight":119},{"colour":[228,228,230],"weight":56},{"colour":[255,255,255],"weight":24},{"colour":[228,228,230],"weight":1},{"colour":[255,255,255],"weight":6}]},{"road":[239,234,224],"water":[82,173,207],"segments":[{"colour":[4,88,147],"weight":21},{"colour":[13,100,147],"weight":32},{"colour":[14,131,175],"weight":25},{"colour":[1,150,207],"weight":70},{"colour":[20,188,208],"weight":24},{"colour":[64,211,194],"weight":52},{"colour":[172,226,220],"weight":55},{"colour":[234,208,65],"weight":32},{"colour":[240,141,61],"weight":10},{"colour":[240,86,61],"weight":8},{"colour":[221,153,166],"weight":5}]},{"road":[232,226,204],"water":[68,68,68],"segments":[{"colour":[237,233,217],"weight":32},{"colour":[0,0,0],"weight":12},{"colour":[70,67,59],"weight":23},{"colour":[112,106,88],"weight":29},{"colour":[230,32,82],"weight":25},{"colour":[244,28,84],"weight":13},{"colour":[44,176,180],"weight":14},{"colour":[47,142,162],"weight":14},{"colour":[44,175,158],"weight":17},{"colour":[5,167,179],"weight":25},{"colour":[229,192,169],"weight":11},{"colour":[184,188,74],"weight":11},{"colour":[202,208,71],"weight":41}]},{"road":[30,55,63],"water":[231,213,222],"segments":[{"colour":[43,72,82],"weight":40},{"colour":[195,140,168],"weight":6},{"colour":[200,174,187],"weight":28},{"colour":[212,199,206],"weight":15},{"colour":[70,107,115],"weight":21},{"colour":[99,123,136],"weight":33},{"colour":[139,163,176],"weight":59},{"colour":[177,194,203],"weight":54},{"colour":[226,210,218],"weight":40}]},{"road":[29,26,24],"water":[225,195,153],"segments":[{"colour":[232,234,45],"weight":25},{"colour":[241,123,81],"weight":30},{"colour":[241,190,117],"weight":39},{"colour":[241,211,117],"weight":33},{"colour":[29,26,24],"weight":13},{"colour":[76,76,76],"weight":25},{"colour":[186,177,165],"weight":8},{"colour":[181,181,181],"weight":14},{"colour":[231,219,180],"weight":12},{"colour":[214,214,214],"weight":18},{"colour":[244,240,219],"weight":11}]},{"road":[111,82,67],"water":[235,221,213],"segments":[{"colour":[190,158,141],"weight":18},{"colour":[128,93,75],"weight":5},{"colour":[130,104,91],"weight":15},{"colour":[181,168,161],"weight":35},{"colour":[109,174,166],"weight":5},{"colour":[128,201,192],"weight":32},{"colour":[166,206,200],"weight":92},{"colour":[190,219,215],"weight":54}]},{"road":[205,205,205],"water":[214,220,221],"segments":[{"colour":[54,179,205],"weight":39},{"colour":[94,202,225],"weight":48},{"colour":[76,195,220],"weight":121},{"colour":[25,164,193],"weight":10},{"colour":[229,226,122],"weight":1},{"colour":[215,115,145],"weight":3},{"colour":[225,124,154],"weight":9},{"colour":[76,76,76],"weight":21},{"colour":[139,139,139],"weight":22},{"colour":[181,181,181],"weight":21}]},{"road":[217,204,167],"water":[224,217,198],"segments":[{"colour":[218,204,167],"weight":0},{"colour":[213,203,167],"weight":0},{"colour":[110,167,166],"weight":0},{"colour":[105,166,166],"weight":0},{"colour":[106,166,166],"weight":94},{"colour":[106,167,167],"weight":0},{"colour":[104,161,162],"weight":0},{"colour":[66,48,64],"weight":0},{"colour":[64,42,59],"weight":0},{"colour":[64,43,60],"weight":56},{"colour":[63,42,60],"weight":0},{"colour":[242,178,99],"weight":56},{"colour":[242,104,53],"weight":49}]},{"road":[48,43,38],"water":[60,56,52],"segments":[{"colour":[175,190,63],"weight":46},{"colour":[179,187,117],"weight":36},{"colour":[203,196,172],"weight":31},{"colour":[233,229,217],"weight":26},{"colour":[237,233,221],"weight":24},{"colour":[154,206,183],"weight":25},{"colour":[152,211,212],"weight":33},{"colour":[103,97,107],"weight":22},{"colour":[99,99,136],"weight":29}]},{"road":[238,242,210],"water":[209,211,194],"segments":[{"colour":[109,214,166],"weight":31},{"colour":[18,173,145],"weight":83},{"colour":[49,86,98],"weight":82},{"colour":[31,18,38],"weight":47},{"colour":[60,41,69],"weight":35}]},{"road":[189,196,169],"water":[233,229,210],"segments":[{"colour":[230,219,173],"weight":32},{"colour":[231,225,196],"weight":5},{"colour":[85,210,187],"weight":5},{"colour":[77,217,192],"weight":7},{"colour":[141,196,176],"weight":40},{"colour":[23,140,119],"weight":21},{"colour":[81,169,153],"weight":27},{"colour":[33,145,124],"weight":21},{"colour":[37,152,99],"weight":5},{"colour":[27,178,151],"weight":52},{"colour":[0,163,133],"weight":36},{"colour":[32,18,2],"weight":3},{"colour":[60,37,10],"weight":22},{"colour":[96,62,23],"weight":4},{"colour":[230,219,173],"weight":11},{"colour":[189,196,169],"weight":0},{"colour":[233,229,210],"weight":6},{"colour":[114,132,123],"weight":0},{"colour":[76,82,69],"weight":17}]},{"road":[50,50,50],"water":[183,178,182],"segments":[{"colour":[204,212,213],"weight":184},{"colour":[233,229,158],"weight":7},{"colour":[223,143,162],"weight":8},{"colour":[25,164,193],"weight":9},{"colour":[69,194,220],"weight":13},{"colour":[116,193,209],"weight":11},{"colour":[76,76,76],"weight":21},{"colour":[139,139,139],"weight":22},{"colour":[181,181,181],"weight":21}]},{"road":[10,28,42],"water":[137,150,163],"segments":[{"colour":[176,188,219],"weight":18},{"colour":[121,166,201],"weight":21},{"colour":[209,218,241],"weight":31},{"colour":[14,79,129],"weight":42},{"colour":[8,63,106],"weight":51},{"colour":[23,95,136],"weight":59}]},{"road":[234,217,224],"water":[212,171,188],"segments":[{"colour":[194,0,92],"weight":21},{"colour":[231,103,159],"weight":37},{"colour":[212,171,188],"weight":48},{"colour":[232,234,45],"weight":12},{"colour":[31,27,27],"weight":16},{"colour":[63,32,46],"weight":13},{"colour":[145,121,129],"weight":21},{"colour":[156,158,165],"weight":19},{"colour":[166,196,209],"weight":32}]},{"road":[234,217,224],"water":[154,142,148],"segments":[{"colour":[194,0,92],"weight":21},{"colour":[231,103,159],"weight":37},{"colour":[212,171,188],"weight":48},{"colour":[232,234,45],"weight":12},{"colour":[31,27,27],"weight":16},{"colour":[63,32,46],"weight":13},{"colour":[118,129,144],"weight":21},{"colour":[156,158,165],"weight":19},{"colour":[95,175,209],"weight":6},{"colour":[140,182,200],"weight":25}]},{"road":[19,26,64],"water":[41,46,75],"segments":[{"colour":[65,208,250],"weight":13},{"colour":[44,173,215],"weight":11},{"colour":[23,219,192],"weight":17},{"colour":[121,230,219],"weight":32},{"colour":[78,92,167],"weight":60},{"colour":[144,154,204],"weight":14},{"colour":[207,2,95],"weight":26},{"colour":[220,35,87],"weight":5},{"colour":[242,63,114],"weight":18},{"colour":[238,111,147],"weight":7},{"colour":[219,212,191],"weight":39},{"colour":[234,227,207],"weight":42},{"colour":[249,242,224],"weight":34},{"colour":[75,98,105],"weight":34}]},{"road":[236,220,190],"water":[235,226,209],"segments":[{"colour":[33,133,197],"weight":82},{"colour":[126,206,253],"weight":6},{"colour":[91,182,235],"weight":39},{"colour":[126,206,253],"weight":36},{"colour":[62,69,76],"weight":3},{"colour":[46,50,56],"weight":45},{"colour":[62,69,76],"weight":33},{"colour":[255,127,102],"weight":38}]},{"road":[241,241,226],"water":[55,77,126],"segments":[{"colour":[234,46,73],"weight":27},{"colour":[239,103,71],"weight":24},{"colour":[255,162,0],"weight":29},{"colour":[255,192,0],"weight":44},{"colour":[55,77,126],"weight":54},{"colour":[66,88,137],"weight":37},{"colour":[75,99,151],"weight":33},{"colour":[90,122,165],"weight":32},{"colour":[99,157,195],"weight":16}]},{"road":[219,219,199],"water":[204,199,176],"segments":[{"colour":[148,188,189],"weight":42},{"colour":[113,171,173],"weight":43},{"colour":[119,165,159],"weight":47},{"colour":[113,161,173],"weight":25},{"colour":[79,117,128],"weight":48},{"colour":[73,76,78],"weight":41},{"colour":[48,59,64],"weight":41}]},{"road":[62,62,62],"water":[244,244,214],"segments":[{"colour":[68,92,66],"weight":19},{"colour":[140,174,110],"weight":28},{"colour":[188,214,148],"weight":21},{"colour":[36,51,61],"weight":0},{"colour":[47,64,68],"weight":14},{"colour":[45,59,62],"weight":1},{"colour":[56,86,92],"weight":0},{"colour":[64,106,114],"weight":0},{"colour":[62,101,108],"weight":16},{"colour":[59,98,106],"weight":0},{"colour":[74,114,117],"weight":0},{"colour":[84,124,124],"weight":0},{"colour":[81,121,122],"weight":6},{"colour":[77,116,118],"weight":0},{"colour":[109,160,151],"weight":18},{"colour":[222,216,102],"weight":22},{"colour":[247,240,111],"weight":28}]},{"road":[237,220,192],"water":[240,228,209],"segments":[{"colour":[64,211,194],"weight":12},{"colour":[129,194,184],"weight":57},{"colour":[227,207,98],"weight":37},{"colour":[234,208,65],"weight":36},{"colour":[240,175,61],"weight":16},{"colour":[240,141,61],"weight":30},{"colour":[240,86,61],"weight":56},{"colour":[73,76,78],"weight":37},{"colour":[48,59,64],"weight":41}]},{"road":[230,217,172],"water":[233,226,200],"segments":[{"colour":[255,70,42],"weight":29},{"colour":[248,87,62],"weight":11},{"colour":[253,110,66],"weight":21},{"colour":[255,127,88],"weight":92},{"colour":[232,162,141],"weight":60},{"colour":[229,177,139],"weight":16},{"colour":[229,188,139],"weight":21},{"colour":[55,51,48],"weight":48}]},{"road":[76,76,76],"water":[226,226,204],"segments":[{"colour":[246,215,0],"weight":22},{"colour":[232,234,45],"weight":34},{"colour":[232,234,43],"weight":0},{"colour":[232,235,40],"weight":0},{"colour":[232,236,37],"weight":0},{"colour":[232,236,35],"weight":0},{"colour":[235,218,124],"weight":0},{"colour":[235,219,122],"weight":0},{"colour":[235,219,119],"weight":0},{"colour":[235,220,116],"weight":0},{"colour":[235,220,115],"weight":70},{"colour":[76,76,76],"weight":33},{"colour":[241,242,125],"weight":24},{"colour":[181,181,181],"weight":9},{"colour":[216,216,216],"weight":8},{"colour":[217,217,196],"weight":12},{"colour":[240,236,217],"weight":11}]},{"road":[54,54,54],"water":[99,171,194],"segments":[{"colour":[133,231,219],"weight":6},{"colour":[113,195,209],"weight":8},{"colour":[99,151,167],"weight":20},{"colour":[175,148,102],"weight":8},{"colour":[102,74,27],"weight":8},{"colour":[224,232,128],"weight":26},{"colour":[230,167,203],"weight":22},{"colour":[249,242,224],"weight":177},{"colour":[221,217,205],"weight":23},{"colour":[75,76,71],"weight":22}]},{"road":[48,43,38],"water":[60,56,52],"segments":[{"colour":[34,34,34],"weight":2},{"colour":[0,45,65],"weight":4},{"colour":[42,82,97],"weight":61},{"colour":[65,186,197],"weight":65},{"colour":[223,239,244],"weight":66},{"colour":[255,105,70],"weight":67},{"colour":[111,197,105],"weight":65}]},{"road":[128,55,94],"water":[57,140,147],"segments":[{"colour":[239,193,88],"weight":1},{"colour":[222,198,144],"weight":40},{"colour":[239,193,88],"weight":29},{"colour":[240,145,138],"weight":0},{"colour":[229,179,175],"weight":48},{"colour":[240,145,138],"weight":24},{"colour":[234,122,111],"weight":8}]},{"road":[48,43,38],"water":[167,198,205],"segments":[{"colour":[43,69,140],"weight":65},{"colour":[37,105,166],"weight":68},{"colour":[126,185,198],"weight":69},{"colour":[164,101,95],"weight":69}]},{"road":[48,43,38],"water":[60,56,52],"segments":[{"colour":[69,177,246],"weight":69},{"colour":[63,233,77],"weight":68},{"colour":[255,241,51],"weight":70},{"colour":[232,102,48],"weight":70}]},{"road":[32,58,87],"water":[209,207,239],"segments":[{"colour":[114,21,75],"weight":15},{"colour":[179,29,99],"weight":19},{"colour":[213,34,138],"weight":29},{"colour":[219,86,157],"weight":66},{"colour":[100,89,189],"weight":36},{"colour":[175,171,209],"weight":0},{"colour":[127,121,180],"weight":32},{"colour":[166,161,219],"weight":96},{"colour":[83,132,187],"weight":0},{"colour":[23,95,172],"weight":34}]},{"road":[48,43,38],"water":[163,207,195],"segments":[{"colour":[108,159,178],"weight":2},{"colour":[100,174,185],"weight":61},{"colour":[28,125,136],"weight":67},{"colour":[152,236,199],"weight":69},{"colour":[244,90,102],"weight":69}]},{"road":[48,43,38],"water":[194,208,228],"segments":[{"colour":[255,230,149],"weight":64},{"colour":[255,239,172],"weight":71},{"colour":[170,178,181],"weight":68},{"colour":[57,69,74],"weight":71}]},{"road":[124,103,77],"water":[82,144,226],"segments":[{"colour":[129,212,181],"weight":9},{"colour":[142,199,178],"weight":32},{"colour":[129,212,181],"weight":25},{"colour":[251,223,199],"weight":19},{"colour":[243,224,207],"weight":48},{"colour":[188,212,129],"weight":18},{"colour":[97,114,65],"weight":14},{"colour":[101,125,54],"weight":7}]},{"road":[91,54,82],"water":[245,221,101],"segments":[{"colour":[60,56,52],"weight":11},{"colour":[106,94,84],"weight":22},{"colour":[192,188,187],"weight":1},{"colour":[191,188,187],"weight":29},{"colour":[192,188,187],"weight":1},{"colour":[181,181,181],"weight":18},{"colour":[0,198,113],"weight":14},{"colour":[143,201,163],"weight":35},{"colour":[149,195,165],"weight":26},{"colour":[215,241,216],"weight":13},{"colour":[212,244,213],"weight":31}]},{"road":[48,43,38],"water":[42,253,172],"segments":[{"colour":[232,67,222],"weight":30},{"colour":[224,75,155],"weight":18},{"colour":[218,42,136],"weight":9},{"colour":[228,33,216],"weight":5},{"colour":[186,98,114],"weight":16},{"colour":[75,33,33],"weight":5},{"colour":[113,60,67],"weight":4},{"colour":[97,21,201],"weight":20},{"colour":[121,57,209],"weight":55},{"colour":[53,124,255],"weight":47},{"colour":[17,100,255],"weight":14},{"colour":[91,160,183],"weight":23},{"colour":[39,59,89],"weight":8},{"colour":[0,41,228],"weight":16}]},{"road":[95,87,80],"water":[245,245,222],"segments":[{"colour":[244,230,169],"weight":56},{"colour":[239,238,219],"weight":28},{"colour":[198,211,196],"weight":70},{"colour":[209,222,208],"weight":74},{"colour":[255,188,180],"weight":56}]},{"road":[20,18,17],"water":[60,56,52],"segments":[{"colour":[242,191,194],"weight":63},{"colour":[242,128,137],"weight":68},{"colour":[242,191,194],"weight":69},{"colour":[242,242,242],"weight":67}]},{"road":[44,44,45],"water":[219,216,204],"segments":[{"colour":[204,112,129],"weight":12},{"colour":[139,144,156],"weight":30},{"colour":[145,164,179],"weight":30},{"colour":[206,206,199],"weight":33},{"colour":[205,167,147],"weight":38}]},{"road":[48,43,38],"water":[94,69,61],"segments":[{"colour":[87,96,168],"weight":29},{"colour":[106,125,173],"weight":35},{"colour":[63,81,127],"weight":4},{"colour":[39,48,117],"weight":15},{"colour":[63,81,127],"weight":46},{"colour":[39,48,117],"weight":0},{"colour":[135,189,219],"weight":19},{"colour":[150,205,219],"weight":46},{"colour":[224,207,193],"weight":20},{"colour":[225,207,200],"weight":46},{"colour":[224,207,193],"weight":0},{"colour":[163,140,130],"weight":13}]}];

var theme = themes[0];

var curThemeID = 0;
function onThemeIDChange(themeid)
{
    curThemeID = themeid;
    theme = themes[themeid];
    applyTheme(theme);
    console.log("segments",theme.segments);
    for(var i =0; i< theme.segments.length;++i) {
        var col = theme.segments[i].colour;
        $("#colourInput" + i).spectrum("set", 'rgb(' + col[0] + ',' + col[1] + ', ' + col[2] + ')');
    }
    for(var i =0; i< 11;++i) {
        console.log( $("#colourInput" + i).spectrum('container'));
        $("#colourInput" + i).spectrum('container').addClass("hidden");
    }
}
