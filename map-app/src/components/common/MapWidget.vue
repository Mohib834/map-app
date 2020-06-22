<template>

    <canvas ref="canvas" id="scaledCanvas"  class="map-canvas" :class="{'demo-widget': useDemoWidgetCSS, fadeInMap: fadeIn, 'shadow-framed': showFrame , 'shadow-unframed': !showFrame}"></canvas>

</template>

<script>
    /*
    import '../../../public/static/maptest/glfx';
    import '../../../public/static/maptest/webgl-utils';
    import '../../../public/static/maptest/webgl-lessons-helper';
*/
    import commonGlobals  from '../../../../common/commonGlobals';
    var  opentype = require('opentype.js');
    import canvasUtils  from '../../../helper/canvasUtils';
    import utilsMixin from "../../mixins/utilsMixin";
    var UPNG = require('upng-js');
    import styleRenderer  from '../../../../common/styleRenderer';

    export default {
      name: "MapWidget",
      mixins:[utilsMixin],
      props: {

        printSizeID:{
          default: 1,
          type:Number
        },
        orientationID:{
          default: 1,
          type:Number
        },
        styleID:{
          default: 0,
          type: Number
        },
        text1:{
          default: "",
          type: String
        },
        text2:{
          default: "",
          type: String
        },
        text3:{
          default: "",
          type: String
        },

        useDemoWidgetCSS:{
          default: false,
          bool: Boolean
        },
        bgColour:{
          default: '#ffffff',
          type: String
        },
        // variation index for randomising the segment colour distibution, value between [0,255]
        variation:{
          default: 0,
          type: Number
        },
        // segment colour array, each colour has a weight value
        segmentColours:{
          default: [{"colour":[233,221,195],"weight":13},{"colour":[234,212,173],"weight":35},{"colour":[224,202,164],"weight":10},{"colour":[201,184,155],"weight":6},{"colour":[190,173,145],"weight":12},{"colour":[179,163,137],"weight":14},{"colour":[106,191,172],"weight":6},{"colour":[80,173,152],"weight":15},{"colour":[48,139,130],"weight":13},{"colour":[39,168,163],"weight":20},{"colour":[43,156,150],"weight":16},{"colour":[54,198,193],"weight":7},{"colour":[19,106,113],"weight":15},{"colour":[0,72,84],"weight":8},{"colour":[0,36,60],"weight":14},{"colour":[1,24,42],"weight":12},{"colour":[2,68,90],"weight":12}],
          type: Array
        },
        // water colour, format [r,g,b] where values are between 0-255
        waterColour:{
          default: [0,0,0],
          type:Array
        },
        // road colour, format [r,g,b] where values are between 0-255
        roadColour:{
          default: [255,255,255],
          type:Array
        },
        // show white inner border on the print
        border:{
          default: true,
          type: [Boolean, Number]
        },
        // show a preview of what a framed print might look like
        showFrame:{
          default: true,
          type: Boolean
        },
        // show only a amount of the segments , value between [0,1], where one is full colour, 0 = all empty, used for animations
        segmentShowPercentage:{
          default: 1.0,
          type: Number
        },
        // fade the road colour, value [0,1], used for animating
        roadAlpha:{
          default: 1.0,
          type: Number
        },
        // fade the water, value [0,1], used for animating
        waterAlpha:{
          default: 1.0,
          type: Number
        },
        // fade the segments, value [0,1], used for animating
        segmentAlpha:{
          default: 1.0,
          type: Number
        },
        // show bottom gradient fade above the image - this is for any intro versions
        showBottomFade:{
          default: false,
          type: Boolean
        },
        // height in pixels of the gradient fade image if its showing
        bottomFadeHeight:{
          default: 200,
          type: Number
        }
      },
      data(){
        return {

          initDone : false,
          fadeIn: false, // css fade transition trigger
          dirty: false, // needs to be false for setDirty to work
          basemapID : "",
          assetsLoading: true,
          showRoad: true,
          showSegments: true,
          showWater: true,
          gl: null,
          previewProgram: null,
          colourmapProgram: null,
          uniforms: null,

          basemapTexture:null,  // this is the basemap

          textureNoisemap: null,
          previewPositionLocation:null,
          previewPositionBuffer:null,
          previewTexcoordLocation:null,
          previewTexcoordBuffer:null,
          tempCanvasTexture:null,  // holds the temporary texture for sharpen filter

          // colour map
          colourmapuniforms: {},
          colourmapTexture:null,
          colourmapTexWidth:null,
          colourmapTexHeight:null,
          colourmapFBO:null,
          colourmapPositionBuffer:null,
          colourmapPositionLocation:null,

          fxcanvas: null,
          canvas: null
        }
      },
      computed:{
        // turn off for mobile as it creates textures, might have an impact on mobile browsers crashing afte awhile
        doSharpenPostEffect: function(){
          return !this.$store.getters.isMobileDevice;
        },
        textcolours: function(){
          return this.$store.getters.currentTheme.textcolours  ;
        }// [[255,0,0],[23,23,0]];

    },
      methods:{
        getCanvas: function(){
          return this.$refs.canvas;
        },
        getThumbnailCanvas : function(){
          // todo don't show the border, add an optional overlay?
          // rerender the thumbnail version temporarily
          let renderThumbnail = true;
          this.previewMapRenderUpdate(this, renderThumbnail);
          let thumbCanvas = this.getCanvasResized(this.$refs.canvas, 500,500);
          // restore previous state
          this.previewMapRenderUpdate(false);
          //return this.$refs.canvas;
          return thumbCanvas;
        },

        init: function(){
          console.log("MapWidget init");

          this.assetsLoading = true;
          loadCommonAssets(this)
            .then(() => {

              if(!this.initDone) {
                this.initDone = true;

                // init canvas and gl, loads shaders
                this.setupPreviewRendering();
                //creates a texture and fbo to draw to - when theme is selects, we draw the colours here
                this.setColourmapRendering();


              }
              // set the defaults
              this.manualUpdate();
              this.dispatchInitDone();

            });

        },
        // part of the initialisation step - gl setup
        setupPreviewRendering: function()
        {
          try {
            if(this.doSharpenPostEffect)  this.fxcanvas = fx.canvas();
          } catch (e) {
            this.doSharpenPostEffect = false;
           // alert(e);
           // return;

          }

          // init offscreen canvas
          this.canvas = document.createElement('canvas');

          this.gl = this.canvas.getContext("webgl", {
            antialias: false,
            depth: false
          });
          if (!this.gl) {
            return;
          }

          // setup GLSL this.previewProgram
          this.previewProgram = webglUtils.createProgramFromScripts(this.gl, ["map-vertex-shader", "map-fragment-shader"]);
          this.gl.useProgram(this.previewProgram);

          // uniform lookup
          this.uniforms = {
            //roadmap: this.gl.getUniformLocation(this.previewProgram, 'roadmap'),
            u_image: this.gl.getUniformLocation(this.previewProgram, 'u_image'),
            noisemap: this.gl.getUniformLocation(this.previewProgram, 'noisemap'),
            noisemapHeight: this.gl.getUniformLocation(this.previewProgram, 'noisemapHeight'),
            colourmap: this.gl.getUniformLocation(this.previewProgram, 'colourmap'),
            u_resolution: this.gl.getUniformLocation(this.previewProgram, "u_resolution"),
            watercolour: this.gl.getUniformLocation(this.previewProgram, "watercolour"),
            roadcolour: this.gl.getUniformLocation(this.previewProgram, "roadcolour"),
            u_segmentShowPercentage: this.gl.getUniformLocation(this.previewProgram, "u_segmentShowPercentage"),

          };
          /////////NOISE MAP
          this.textureNoisemap = this.createTextureFromImage(this.uniforms.noisemap, _commonNoiseMapImage, 2);
          this.gl.uniform1f(this.uniforms.noisemapHeight, _commonNoiseMapImage.height);


          // look up where the vertex data needs to go.
          this.previewPositionLocation = this.gl.getAttribLocation(this.previewProgram, "a_position");
          this.previewTexcoordLocation = this.gl.getAttribLocation(this.previewProgram, "a_texCoord");

          // provide texture coordinates for the rectangle.
          this.previewTexcoordBuffer = this.gl.createBuffer();
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.previewTexcoordBuffer );
          this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0,
          ]), this.gl.STATIC_DRAW);

          // set some defaults
          this.setSegmentShowPercentage(1.0);
          this.setRoadAlpha(1.0);
          this.setWaterAlpha(1.0);
          this.setSegmentAlpha(1.0);

        },
        // if null load sample map
        loadSampleBasemap: function(sampleMapUrl = "/static/assets/mapwidget/samplemap.png")
        {
            this.loadBasemapWithUrl(sampleMapUrl, null);
        },
        loadBasemap: function(basemapID)
        {
          var previewMapUrl =  this.$store.getters.getMapPreviewMapURLForBasemapID(basemapID);
          this.loadBasemapWithUrl(previewMapUrl, basemapID);
        },
        /// genereted from client side
        loadBasemapWithImageData: function(imageData)
        {
          this.assetsLoading = true;
          console.log("loadBasemapWithImageData" );
          let newTexture = this.createTextureFromImageData(this.uniforms.u_image, imageData, 0);
          this.handleBasemapTextureInit(newTexture, imageData.width, imageData.height);
        },
        loadBasemapWithUrl: function(previewMapUrl, basemapID)
        {
          console.log("--------onModelChanged basemapID", basemapID);
          this.basemapID = basemapID;
          this.assetsLoading = true;
          console.log("loadBasemap: ", previewMapUrl);
          loadPreviewMapPixels(previewMapUrl).then((upngimage)=>{

            let newTexture = this.createTextureFromUPNGImage(this.uniforms.u_image, upngimage, 0);
            this.handleBasemapTextureInit(newTexture, upngimage.width, upngimage.height);
            //    })
          });
        },
        handleBasemapTextureInit: function(newTexture, width, height){

          // loadBasemap, setup gl with the loaded textures

          // var upngimage = indexmap;
          // Get A WebGL context
          /** @type {HTMLCanvasElement} */

          this.canvas.width = width;
          this.canvas.height = height;
          //  console.log("canvas.width" , canvas.width);
          //  console.log("canvas.height" , canvas.height);

          this.gl.useProgram(this.previewProgram);

          //this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
          //this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

// todo optimse this, no need to keep  creating the gl resources each time?
          // Create a buffer to put three 2d clip space points in
          if(this.previewPositionBuffer )
          {
            this.gl.deleteBuffer(this.previewPositionBuffer);
            this.previewPositionBuffer = null;
          }
          this.previewPositionBuffer = this.gl.createBuffer();
          // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.previewPositionBuffer);
          // Set a rectangle the same size as the image.
          this.setRectangle(this.gl, 0, 0, width, height);

          ////////// MAP SEGMENTS
          // if(segmentsTexture == null) {
          if(this.basemapTexture )
          {
            this.gl.deleteTexture(this.basemapTexture);
            this.basemapTexture = null;
          }
          this.basemapTexture = newTexture;
          //}
          // else{
          //  bindTextureFromImage(this.uniforms.u_image, segmentsTexture, 0);
          //}
          ////////// ROAD AND WATER MAP
          //textureRoadmap = createTextureFromImage(this.uniforms.roadmap, roadmap, 1);


//    webglUtils.resizeCanvasToDisplaySize(this.gl.canvas);

          // console.log("creating canvas texture");
          //create initial texture for effects
          if(this.doSharpenPostEffect)
            this.tempCanvasTexture = this.fxcanvas.texture(this.gl.canvas);
          //  console.log("this.tempCanvasTexture",this.tempCanvasTexture);





          // update the colourmap for now as it got recreated in onMapLoaded - shouldnt need to
          // updateColourmap(model.segmentColours);
          // setRoadColour(model.roadColour);
          //  setWaterColour(model.waterColour);
          //setTheme(model.$store.getters.currentTheme, model.roadColour, model.waterColour);
          console.log("[Mawdiget ]loadBasemap here");

          this.assetsLoading = false;
          this.$emit("mapLoaded");
          //previewMapRenderUpdate(model);
          this.setDirty();

          // fade in map
          setTimeout(()=>{
            this.fadeIn = true;
          },100);


        },
        // update the view based on the state (theme, water)
        // this gets called after something is changed
        // renderThumbnail = true, draws the thumbnail version as-is - without the frame
        // renderThumbnail = false, draws the full preview version
        previewMapRenderUpdate: function(renderThumbnail = false)
        {
       //   console.log("[MapWidget] previewMapRenderUpdate");

          if(this.assetsLoading){
            console.log("previewMapRenderUpdate assets not loaded yet, stopping.");
            return false;
          }

          var scaledCanvas =  this.$refs.canvas; //document.getElementById("scaledCanvas");
          if(scaledCanvas == null)
          {
            console.log("scaledCanvas not availailble yet. stopping");
            return false;
          }

          // console.log("previewMapRenderUpdate assets  loaded , continue.");

          // render to the canvas
          this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
          // Tell WebGL how to convert from clip space to pixels
          this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
          // Clear the canvas
          this.gl.clearColor(0, 0, 0, 0);
          this.gl.clear(this.gl.COLOR_BUFFER_BIT);
          // Tell it to use our this.previewProgram (pair of shaders)
          this.gl.useProgram(this.previewProgram);

          // Turn on the position attribute
          this.gl.enableVertexAttribArray(this.previewPositionLocation);
          // Bind the position buffer.
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.previewPositionBuffer);

          // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
          var size = 2;          // 2 components per iteration
          var type = this.gl.FLOAT;   // the data is 32bit floats
          var normalize = false; // don't normalize the data
          var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
          var offset = 0;        // start at the beginning of the buffer
          this.gl.vertexAttribPointer(
            this.previewPositionLocation, size, type, normalize, stride, offset)

          // Turn on the teccord attribute
          this.gl.enableVertexAttribArray(this.previewTexcoordLocation);

          // Bind the position buffer.
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.previewTexcoordBuffer );

          // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
          var size = 2;          // 2 components per iteration
          var type = this.gl.FLOAT;   // the data is 32bit floats
          var normalize = false; // don't normalize the data
          var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
          var offset = 0;        // start at the beginning of the buffer
          this.gl.vertexAttribPointer(
            this.previewTexcoordLocation, size, type, normalize, stride, offset)

          // set the resolution
          this.gl.uniform2f(this.uniforms.u_resolution, this.gl.canvas.width, this.gl.canvas.height);

          // Draw the rectangle.

          //  setColourmapRendering();
          /*
           onVariationChange(0);
           setWaterColour(theme.water);
           setRoadColour(theme.road);
           */


          this.gl.activeTexture(this.getGLTextureID(0));
          this.gl.bindTexture(this.gl.TEXTURE_2D, this.basemapTexture);
          this.gl.uniform1i(this.uniforms.u_image, 0);

          //this.gl.activeTexture(getGLTextureID(1));
          //this.gl.bindTexture(this.gl.TEXTURE_2D, textureRoadmap);
          //this.gl.uniform1i(this.uniforms.colourmap, 1);

          this.gl.activeTexture(this.getGLTextureID(1));
          this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureNoisemap);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST); // MAKE SURE THIS IS NEAR NEIGHBOUR FOR THE COLOURMAP
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST); // MAKE SURE THIS IS NEAR NEIGHBOUR FOR THE COLOURMAP
          this.gl.uniform1i(this.uniforms.noisemap, 1);

          this.gl.activeTexture(this.getGLTextureID(2));
          this.gl.bindTexture(this.gl.TEXTURE_2D, this.colourmapTexture);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST); // MAKE SURE THIS IS NEAR NEIGHBOUR FOR THE COLOURMAP
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST); // MAKE SURE THIS IS NEAR NEIGHBOUR FOR THE COLOURMAP
          this.gl.uniform1i(this.uniforms.colourmap, 2);

          var primitiveType = this.gl.TRIANGLES;
          var offset = 0;
          var count = 6;
          this.gl.drawArrays(primitiveType, offset, count);


          var showFrame = this.showFrame ;
          if(renderThumbnail) showFrame = false;

          // update fx
          // console.log("canvas", canvas);
          // console.log("this.tempCanvasTexture", this.tempCanvasTexture);
          /*
          if(this.doSharpenPostEffect && this.tempCanvasTexture) {
           // this.tempCanvasTexture.loadContentsOf(this.canvas);
          //  this.fxcanvas.draw(this.tempCanvasTexture).unsharpMask(1.0, 1.4).update();
          }*/
          let drawcanvas = /*(this.doSharpenPostEffect) ? this.fxcanvas : */this.canvas;

          //canvas.parentNode.appendChild(this.fxcanvas);

          // scale, test drawing the border
          const BASE_SCALE = 0.7; // MUST BE THE SAME AS THE SERVER SIDE
          const renderScale = 1.0; // render scale


          var mapWidth = Math.ceil( drawcanvas.width*renderScale);
          var mapHeight =Math.ceil( drawcanvas.height*renderScale);
          var ppi = commonGlobals.getPPI(mapWidth, this.printSizeID, this.orientationID);

          //////////////////////////////////////////////////////////////////////////////////////////////

            // inner border pixel coords for the frame png
            let tInnerBorder = 23; // from the top  of the image to the inner border (Ydirection )
            let lInnerBorder = 23; // from the left of the image to the inner border of the frame (x direction)
            let rInnerBorder = 23; // from the right of the image to the inner border of the frame (x direction)
            let bInnerBorder = 23; // from the bottom of the image to the inner border (y direction)

            // todo - want to hide the correct amount of frame overlap,  e.g 1/4in / 5mm  converted using the correct PPI
            let overlapInPixels = Math.round(ppi * commonGlobals.PICTURE_FRAME_OVERLAP_GAP);

            console.log("overlapInPixels", overlapInPixels);
            // scale9 divisons, offset for inner shadows
            let tBorder = tInnerBorder + 20;
            let bBorder = bInnerBorder + 20;
            let lBorder = lInnerBorder + 20;
            let rBorder = rInnerBorder + 20;

            let BORDER_IN_INCHES = 0.4; // 0.4in = 1cm
            let BORDER_IN_PIXELS = 23;
            let borderScale = ppi / (BORDER_IN_PIXELS / BORDER_IN_INCHES);
            let overlapIntoMap = overlapInPixels;
            let framex = Math.round(-lInnerBorder * borderScale + overlapIntoMap);
            let framey = Math.round(-tInnerBorder * borderScale + overlapIntoMap);
            let framew = Math.round(lInnerBorder * borderScale + mapWidth + (rInnerBorder * borderScale) - overlapIntoMap * 2);
            let frameh = Math.round(tInnerBorder * borderScale + mapHeight + (bInnerBorder * borderScale) - overlapIntoMap * 2);

//////////////////////////////////////////////////////////////////////////////////////////////

          var borderSize = (showFrame) ? - framex - 1  : 0;

//          var hBorderSize = borderSize/2;
          scaledCanvas .width  = drawcanvas.width*renderScale + borderSize*2;
          scaledCanvas .height = drawcanvas.height*renderScale + borderSize*2;
          var ctx=scaledCanvas .getContext("2d");

          // draw wall background

          if(renderThumbnail) {
            ctx.fillStyle = '#ffffff';
          }else {
            ctx.fillStyle  = this.bgColour;
            //ctx.fillStyle = '#eeeeee';
          }

          ctx.fillRect(0, 0, scaledCanvas .width, scaledCanvas .height);


          var printBound = {x: borderSize, y:borderSize, w : mapWidth, h: mapHeight}; /// getPrintBound(model, scale);
          console.log("printBound", printBound);

          // draw map
          var bordersizeInPixels = commonGlobals.BORDER_SIZE_IN_INCHES*ppi;
          if(this.border) {
            // draw scaled image inside the border
            var innerBound = styleRenderer.getBorderBound(bordersizeInPixels, mapWidth, mapHeight);
            var scaledBound = styleRenderer.getScaleToFillBound(mapWidth, mapHeight ,innerBound);
            ctx.drawImage(drawcanvas, printBound.x + scaledBound.x, printBound.y + scaledBound.y, scaledBound.w, scaledBound.h);
            // draw border over
            //styleRenderer.drawBorder(ctx, bordersizeInPixels,mapWidth, mapHeight );
          }
          else{
            ctx.drawImage(drawcanvas, printBound.x, printBound.x, printBound.w, printBound.h);
          }

          if(this.border)
          {
            styleRenderer.drawBorder(ctx, bordersizeInPixels, mapWidth,mapHeight, printBound.x,printBound.y);
          }


          if(this.doSharpenPostEffect && this.tempCanvasTexture) {
              this.tempCanvasTexture.loadContentsOf(scaledCanvas);
              this.fxcanvas.draw(this.tempCanvasTexture).unsharpMask((this.border)? 1.2 : 1.0, (this.border)? 2.6 : 1.4).update();
              ctx.drawImage(this.fxcanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
          }


          //drawScale9Grid(ctx,innerBorderImage, hBorderSize,hBorderSize, mapWidth ,mapHeight , 1,1,1,1,innerBorderSize);


          ///////////////////////////////////////////////////
          /// STYLES

          // style base rect


          console.log("--------MapWidget styleID", this.styleID);


          // debug bound
          var DRAW_DEBUG_BOUND= false;
          if(DRAW_DEBUG_BOUND) {
            ctx.strokeStyle = "#FF0000";
            ctx.rect(printBound.x, printBound.y, printBound.w, printBound.h);
            ctx.stroke();
          }
         // var fontFamily = "Roboto";


          var ratio = commonGlobals.getStyleBaseRatio(this.printSizeID, this.orientationID)*(renderScale/BASE_SCALE);
          var baseSize = Math.min(mapWidth,mapHeight);


          // test todo text colours

          //console.log(text1, this.text1);
          if(this.styleID == 0)
          {
            // no style layer, just the map
          }
          else if(this.styleID == 1) // full bottom
          {
            styleRenderer.createBarStyle1(ctx, printBound.w, printBound.h, this, printBound.x, printBound.y);
          }
          else if(this.styleID == 2) // floating
          {
            styleRenderer.createFloatingCardStyle2(ctx, printBound.w, printBound.h, this, printBound.x, printBound.y);

          }
          else if(this.styleID == 3) // fade bottom
          {
            styleRenderer.createGradientStyle3(ctx, printBound.w, printBound.h, this, printBound.x, printBound.y);
          }

          if(!renderThumbnail) {
            // render a slight shaded gradient over the entire map
            this.drawGradientShading(ctx, printBound.x, printBound.y, printBound.w, printBound.h);
          }


          if(showFrame){
            drawScale9Grid(ctx, _commonFrameImage, printBound.x+ framex, printBound.y+framey, framew, frameh, tBorder, bBorder, lBorder, rBorder, borderScale)
          }



          this.$emit("resize");

          //this.$refs.editorbase.resizeContentToFit();



          //return previewMapRenderUpdate(this, false);
        },


        drawGradientShading(ctx, x,y , w,h){
          let fadeY2 = h;
          var grd = ctx.createLinearGradient(w, 0, 0, fadeY2);
          grd.addColorStop(0, 'rgba(0,0,0,0)');
          grd.addColorStop(1.0, 'rgba(0,0,0,0.13)');
          ctx.fillStyle = grd;
          ctx.fillRect(x ,y , w,h);
        },

        createBarStyle1(ctx, canvasw, canvash, model)
        {
          var styleParams = commonGlobals.style1Params;

          var textcolours = model.textcolours;
          console.log("textcolours", textcolours);
          var printBound =  {x:0,y:0, w: canvasw, h:canvash};// getPrintBound(imageData);
         // var previewbound = commonGlobals.getPreviewStyleBound(model);
          var ppi = commonGlobals.getPPI(printBound.w, model.printSizeID,model.orientationID);

          var baseRatio = commonGlobals.getStyleBaseRatio(model.printSizeID,model.orientationID);
          var baseSize = Math.min(printBound.h,printBound.w);
          //var bordersize = Math.round(baseSize*commonGlobals.BORDER_RATIO);  // this ratio should match with the preview ratio on the site mapWidget
          var bordersize = ppi * commonGlobals.BORDER_SIZE_IN_INCHES;
          //var ratio =(printBound.w / previewbound.w) * baseRatio ;
          var ratio = ppi * baseRatio;

          var sideMargin = (model.border) ? bordersize :  styleParams.textMarginBottomTextLeft*ratio ;
          // draw
          var posLeft = getPositionFromRatioInBound(printBound, 0, 1);
          var posRight = getPositionFromRatioInBound(printBound, 1, 1);
          posLeft.x += sideMargin;
          posRight.x -= sideMargin;

          var bottomH = 0;
          //posLeft.y -= bottomH; // bottom of the card
          //posRight.y -= bottomH; // bottom of the card


          // draw from the bottom
          var textMarginBottomTextLeft = styleParams.textMarginBottomTextLeft*ratio;
          // var textMarginTop = styleParams.textMarginTopInInches*ratio;
          var textMarginBottomTextRight = styleParams.textMarginBottomTextRight*ratio;
          //var text1H = styleParams.text1H*ratio;
//  var text2H = styleParams.text2H*ratio;
          var text3H = styleParams.text3H*ratio;
          var text1FontSize = styleParams.text1FontSize*ratio;
          var text2FontSize = styleParams.text2FontSize*ratio;
          var text3FontSize = styleParams.text3FontSize*ratio;
          var cardHeight = styleParams.cardHeightInInches*ratio; //textMarginBottomTop + textMarginBottomTop + 30;
          var tempText1Pos = null;
          var tempText2Pos = null;
          var tempText3Pos = null;

          var uppercase = styleParams.uppercase;
          var text1 = transformText(model.text1, uppercase);
          var text2 = transformText(model.text2, uppercase);
          var text3 = transformText(model.text3, uppercase);
          var text1FontWeight = styleParams.text1FontWeight;
          var text2FontWeight = styleParams.text2FontWeight;
          var text3FontWeight = styleParams.text3FontWeight;
          var font1 = getFont(text1FontWeight);
          var font2 = getFont(text2FontWeight);
          var font3 = getFont(text3FontWeight);

          var leftColumnHeight = 0;
          var rightColumnHeight = 0;

          // go from the bottom up
          let textBaseline = "bottom";
          // LEFT COLUMN HAS TEXT1
          var tempy = posLeft.y - textMarginBottomTextLeft;
          if(model.text1 != "") {
            //ctx.font = text1FontSize + 'px ' + fontFamily;
            tempText1Pos = {x:posLeft.x, y: tempy};
            //  tempy -= text1H;
            // leftColumnHeight += text1H;
          }

          // RIGHT COLUMN HAS TEXT2, TEXT3
          tempy = posLeft.y - textMarginBottomTextRight;

          if(model.text3 != "") {
            //ctx.font = text3FontSize + 'px ' + fontFamily;
            tempText3Pos = {x:posRight.x, y: tempy};
            tempy -= text3H;
            rightColumnHeight += text3H;
          }
          if(model.text2 != "") {
            //ctx.font = text2FontSize + 'px ' + fontFamily;
            tempText2Pos = {x:posRight.x, y: tempy};
            // tempy -= text2H;
            // rightColumnHeight += text2H;
          }
          //cardHeight += Math.max(leftColumnHeight, rightColumnHeight);
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(printBound.x , printBound.y + printBound.h - cardHeight, printBound.w, cardHeight);
          //

          if(DEBUG_DRAW) {
            // test debug
            debugDrawLineY(ctx,posLeft.y - textMarginBottomTextLeft, "orange");
            debugDrawLineY(ctx,printBound.y + printBound.h - 1, "red");
            debugDrawLineY(ctx,tempText1Pos.y, "blue");
            debugDrawFrameOverlap(ctx, printBound, ppi);
          }

          ctx.fillStyle = 'black';
          if(tempText1Pos) {
            //ctx.textAlign = 'left';
            //ctx.font = text1FontSize + 'px ' + fontFamily;
            //ctx.fillText(model.text1, tempText1Pos.x, tempText1Pos.y);
            canvasUtils.fillText(ctx, text1, tempText1Pos.x, tempText1Pos.y, font1, text1FontSize, 'left', textBaseline, [textcolours[0].colour]);

          }
          if(tempText2Pos){
            //ctx.textAlign = 'right';
            //ctx.font = text2FontSize + 'px ' + fontFamily;
            /// ctx.fillText(model.text2, tempText2Pos.x, tempText2Pos.y);
            canvasUtils.fillText(ctx, text2, tempText2Pos.x, tempText2Pos.y, font2, text2FontSize, 'right', textBaseline, [textcolours[1].colour]);

          }
          if(tempText3Pos){
            // ctx.textAlign = 'right';
            // ctx.font = text3FontSize + 'px ' + fontFamily;
            // ctx.fillText(model.text3, tempText3Pos.x, tempText3Pos.y);
            canvasUtils.fillText(ctx, text3, tempText3Pos.x, tempText3Pos.y, font3, text3FontSize, 'right', textBaseline, [textcolours[2].colour]);
          }
        },


        transformText(text,uppercase)
        {
          if(text == null) return null;
          if(uppercase) return text.toUpperCase();
            return text;
        },
        getFont(fontWeight)
        {
          if(fontWeight == 'regular') return _commonFontObject_regular;
          return _commonFontObject_light;
        },
        // another init method, sets up gl ready for a theme
        // the colourmap is then used to sample from in the shader
        setColourmapRendering: function() {
          this.colourmapTexWidth = 100;
          this.colourmapTexHeight  = 8;
          this.colourmapTexture =  this.createTexture(this.colourmapTexWidth,this.colourmapTexHeight);

          this.colourmapFBO = this.createFramebuffer(this.colourmapTexture);
          this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.colourmapFBO);

          // setup GLSL this.previewProgram
          this.colourmapProgram = webglUtils.createProgramFromScripts(this.gl, ["colourmap-vertex-shader", "colourmap-fragment-shader"]);
          this.gl.useProgram(this.colourmapProgram);

          // uniform lookup
          this.colourmapuniforms = {
            u_colour: this.gl.getUniformLocation(this.colourmapProgram, 'u_colour'),
            u_resolution: this.gl.getUniformLocation(this.colourmapProgram, 'u_resolution'),
            u_x: this.gl.getUniformLocation(this.colourmapProgram, 'u_x'),
            u_w: this.gl.getUniformLocation(this.colourmapProgram, 'u_w'),

          };

          this.colourmapPositionLocation = this.gl.getAttribLocation(this.colourmapProgram, "a_position")     // look up where the vertex data needs to go.

          // Create a buffer to put three 2d clip space points in
          this.colourmapPositionBuffer = this.gl.createBuffer();

          // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colourmapPositionBuffer);
          // Set a rectangle the same size as the image.
          this.setRectangle(this.gl, 0, 0,1, 1);

          // Tell WebGL how to convert from clip space to pixels
          this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

          // Clear the canvas
          this.gl.clearColor(0, 0, 0, 0);
          this.gl.clear(this.gl.COLOR_BUFFER_BIT);

          // Tell it to use our this.previewProgram (pair of shaders)


//  this.gl.vertexAttribPointer(
          //    this.previewPositionLocation, size, type, normalize, stride, offset);
          // set the resolution
//    this.gl.uniform2f(this.colourmapuniforms.u_resolution, this.gl.canvas.width, this.gl.canvas.height);

          // Draw the rectangle.
          this.gl.uniform1f(this.colourmapuniforms.u_x, 0.1);
          this.gl.uniform1f(this.colourmapuniforms.u_w, 0.1);

          // Turn on the position attribute
          this.gl.enableVertexAttribArray(this.colourmapPositionLocation);
          // Bind the position buffer.
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colourmapPositionBuffer);

          // return;

          // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
          var size = 2;          // 2 components per iteration
          var type = this.gl.FLOAT;   // the data is 32bit floats
          var normalize = false; // don't normalize the data
          var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
          var offset = 0;        // start at the beginning of the buffer
          this.gl.vertexAttribPointer( this.colourmapPositionLocation, size, type, normalize, stride, offset);
        },
        // update method
        beginRenderToColourmap:function()
        {
          if(!this.gl)return;

          // render to the colour map texture
          this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.colourmapFBO);
          // Tell WebGL how to convert from clip space to pixels
          this.gl.viewport(0, 0, this.colourmapTexWidth,this.colourmapTexHeight);
          // Clear the canvas
          this.gl.clearColor(0, 1, 0, 1);
          this.gl.clear(this.gl.COLOR_BUFFER_BIT);

          // Tell it to use our this.colourmapProgram (pair of shaders)
          this.gl.useProgram(this.colourmapProgram);

          // Turn on the position attribute
          this.gl.enableVertexAttribArray(this.colourmapPositionLocation);
          // Bind the position buffer.
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colourmapPositionBuffer);

          // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
          var size = 2;          // 2 components per iteration
          var type = this.gl.FLOAT;   // the data is 32bit floats
          var normalize = false; // don't normalize the data
          var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
          var offset = 0;        // start at the beginning of the buffer
          this.gl.vertexAttribPointer(
            this.colourmapPositionLocation, size, type, normalize, stride, offset)

          // set the resolution
          this.gl.uniform2f(this.colourmapuniforms.u_resolution, this.colourmapTexWidth, this.colourmapTexHeight);

        },

        // update helper - draw a rectangle to the colourmap, x,width are normalised values [0,1]
        drawRectToColourmap: function(x,width, colour)
        {
          if(!this.gl)return;

          //  console.log("x", x ,"width", width, colour);
          // Draw the rectangle.
          this.gl.uniform1f(this.colourmapuniforms.u_x, x);
          this.gl.uniform1f(this.colourmapuniforms.u_w, width);
          const f = 1.0/255.0;
          this.gl.uniform3f(this.colourmapuniforms.u_colour, colour[0]*f,colour[1]*f,colour[2]*f);

          var primitiveType = this.gl.TRIANGLES;
          var offset = 0;
          var count = 6;
          this.gl.drawArrays(primitiveType, offset, count);
        },
        // update helper
        normaliseThemeWeights: function(themeSegments)
        {
          console.log("normaliseThemeWeights");
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
        },
        getThemeWeightSum: function(themeSegments)
        {
          console.log("getThemeWeightSum");
          var sum = 0;
          for(var i =0; i< themeSegments.length;++i)
          {
            sum += themeSegments[i].weight ;
          }
          return sum;
        },
        // update method - renders the theme colour palette to the colourmap
        updateColourmap: function(themeSegments)
        {
          this.beginRenderToColourmap();
          //themeSegments = this.normaliseThemeWeights(themeSegments);
          var sum = this.getThemeWeightSum(themeSegments);
          var x = 0;
          var w;
          for(var i =0; i < themeSegments.length;++i)
          {
            w = ( themeSegments[i].weight /sum);
            this.drawRectToColourmap(x,w, themeSegments[i].colour);
            x += w;
          }

          // debug read back
          /*
          console.log("themeSegments",themeSegments); // Uint8Array

          var pixels = new Uint8Array(100 * 1 * 4);
         this.gl.readPixels(0, 0, 100, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixels);
         //console.log("colourmap pixels",pixels); // Uint8Array
          var cols = [];
          for(var i =0; i< 100;++i)
          {
            cols.push([pixels[4*i],pixels[4*i + 1],pixels[4*i + 2]]);
          }
          console.log("cols",cols); // Uint8Array
          */
        },
        // gl - helper method
        createTexture: function(w,h)
        {
          if(!this.gl)return;

          var targetTexture = this.gl.createTexture();
          this.gl.bindTexture(this.gl.TEXTURE_2D, targetTexture);
          {
            // define size and format of level 0
            const level = 0;
            const internalFormat = this.gl.RGBA;
            const border = 0;
            const format = this.gl.RGBA;
            const type = this.gl.UNSIGNED_BYTE;
            const data = null;
            this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat,
              w, h, border,
              format, type, data);

            // set the filtering so we don't need mips
            //this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST); // MAKE SURE THIS IS NEAR NEIGHBOUR FOR THE COLOURMAP
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST); // MAKE SURE THIS IS NEAR NEIGHBOUR FOR THE COLOURMAP

            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
          }
          return targetTexture;
        },
        // gl- helper method
        createFramebuffer: function(tex)
        {
          if(!this.gl)return;

          const level = 0;
          //Create and bind the framebuffer
          const fb = this.gl.createFramebuffer();
          this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb);

// attach the texture as the first color attachment
          const attachmentPoint = this.gl.COLOR_ATTACHMENT0;
          this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, attachmentPoint, this.gl.TEXTURE_2D, tex, level);
          return fb;
        },
        bindTextureFromImage: function(uniform, texture, textureID)
        {
          if(!this.gl)return;

          this.gl.activeTexture(this.getGLTextureID(textureID));
          // Bind the texture to the texture unit
          this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
          this.gl.useProgram(this.previewProgram);
          // Tell the shader we bound the texture to texture unit 0
          this.gl.uniform1i(uniform, textureID);
// Set the parameters so we can render any size image.
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
          // Upload the image into the texture.

        },
        // gl- helper method
        // create a GL texture and bind it to the uniform on the active shader this.previewProgram
        createTextureFromImage: function(uniform, image, textureID)
        {
          if(!this.gl)return;

          var texture = this.gl.createTexture();
          this.gl.activeTexture(this.getGLTextureID(textureID));
          // Bind the texture to the texture unit
          this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
          this.gl.useProgram(this.previewProgram);
          // Tell the shader we bound the texture to texture unit 0
          this.gl.uniform1i(uniform, textureID);
// Set the parameters so we can render any size image.
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
          // Upload the image into the texture.
          this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
          return texture;
        },
        createTextureFromUPNGImage: function(uniform, upngimage, textureID)
        {
          if(!this.gl)return;
          var data = new Uint8Array(upngimage.data);
          return this.createTextureFromUint8Array(uniform, data, upngimage.width, upngimage.height, textureID);
        },
        createTextureFromImageData: function(uniform, imageData, textureID)
        {
          if(!this.gl)return;
          var data = new Uint8Array(imageData.data.buffer);
          return this.createTextureFromUint8Array(uniform, data, imageData.width, imageData.height, textureID);
        },
        createTextureFromUint8Array: function(uniform, data ,width,height, textureID)
        {
          if(!this.gl)return;


          var texture = this.gl.createTexture();
          this.gl.activeTexture(this.getGLTextureID(textureID));
          // Bind the texture to the texture unit
          this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
          this.gl.useProgram(this.previewProgram);
          // Tell the shader we bound the texture to texture unit 0
          this.gl.uniform1i(uniform, textureID);
// Set the parameters so we can render any size image.
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
          // Upload the image into the texture.
          this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width,height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
          return texture;
        },
        // gl helper
        getGLTextureID : function(ix)
        {
          if(!this.gl)return;

          if(ix == 0) return this.gl.TEXTURE0;
          if(ix == 1) return this.gl.TEXTURE1;
          if(ix == 2) return this.gl.TEXTURE2;
          if(ix == 3) return this.gl.TEXTURE3;
          if(ix == 4) return this.gl.TEXTURE4;
          if(ix == 5) return this.gl.TEXTURE5;
          return this.gl.TEXTURE6;
        },

        // gl helper
        setRectangle :function(gl, x, y, width, height) {
          if(!this.gl)return;

          var x1 = x;
          var x2 = x + width;
          var y1 = y;
          var y2 = y + height;
          this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2,
          ]), this.gl.STATIC_DRAW);
        },

        // updateGL - called when variation changes, this can be before the new basemap is loaded
        onVariationChange: function(ix)
        {
          if(!this.gl)return;

          this.gl.useProgram(this.previewProgram);

          var variationLocation = this.gl.getUniformLocation(this.previewProgram, "u_variation");
          this.gl.uniform1f(variationLocation, ix);

          //  console.log("onVariationChange",ix);

          //previewMapRenderUpdate();
        },
        setSegmentShowPercentage:function(value)
        {
          if(!this.gl)return;

          this.gl.useProgram(this.previewProgram);
          var loc = this.gl.getUniformLocation(this.previewProgram, "u_segmentShowPercentage");
          this.gl.uniform1f(loc, value);
        },
        setRoadAlpha:function(value)
        {
          if(!this.gl)return;

          this.gl.useProgram(this.previewProgram);
          var loc = this.gl.getUniformLocation(this.previewProgram, "u_roadAlpha");
          this.gl.uniform1f(loc, value);
        },
        setWaterAlpha:function(value)
        {
          if(!this.gl)return;

          this.gl.useProgram(this.previewProgram);
          var loc = this.gl.getUniformLocation(this.previewProgram, "u_waterAlpha");
          this.gl.uniform1f(loc, value);
        },
        setSegmentAlpha: function(value)
        {
          if(!this.gl)return;

          this.gl.useProgram(this.previewProgram);
          var loc = this.gl.getUniformLocation(this.previewProgram, "u_segmentAlpha");
          this.gl.uniform1f(loc, value);
        },
        // update - set the theme colours and defaults for the water and road
        setTheme: function(segments, road, water)
        {
          console.log("mapWidget setTheme", segments, water, road);

          // update the colourmap - this texture is used to sample from and picks colours for the segments
          this.updateColourmap(segments);
          // set the defaults water and road colour
          this.setWaterColour(water);
          this.setRoadColour(road);

        },
        //gl update method
        // col = [r,g,b]
        setWaterColour: function(col)
        {
          if(!this.gl)return;

          // console.log("setWaterColour", col);
          this.gl.useProgram(this.previewProgram);

          const f = 1.0/255.0;
          this.gl.uniform3f(this.uniforms.watercolour, col[0]*f,col[1]*f,col[2]*f);

          //

        },
        // update method
        // col = [r,g,b]
        setRoadColour:function(col)
        {
          if(!this.gl)return;

          this.gl.useProgram(this.previewProgram);

          const f = 1.0/255.0;
          this.gl.uniform3f(this.uniforms.roadcolour, col[0]*f,col[1]*f,col[2]*f);

          //
          //$("#roadColourInput").spectrum("set", 'rgb('+col[0]+','+col[1]+', '+col[2]+')');

        },
        // not used
        onThemeChange : function(theme, road, water)
        {
          //curThemeID = themeid;
          //theme = themes[themeid];
          this.setTheme(theme, road,water );
          //previewMapRenderUpdate();
        },
        // This is needed if the images are not on the same domain
        // NOTE: The server providing the images must give CORS permissions
        // in order to be able to use the image with Webthis.gl. Most sites
        // do NOT give permission.
        // See: http://webglfundamentals.org/webgl/lessons/webgl-cors-permission.html
        requestCORSIfNotSameOrigin:function(img, url) {
          if ((new URL(url)).origin !== window.location.origin) {
            img.crossOrigin = "";
          }
        },

        // helper

        getCanvasResized:function(canvas, MAX_WIDTH, MAX_HEIGHT)
        {
          var width = canvas.width;
          var height = canvas.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          var thumbnailCanvas = document.createElement("canvas");

          thumbnailCanvas.width = width;
          thumbnailCanvas.height = height;
          var ctx = thumbnailCanvas.getContext("2d");
          ctx.mozImageSmoothingEnabled = true;
          ctx.webkitImageSmoothingEnabled = true;
          ctx.msImageSmoothingEnabled = true;
          ctx.imageSmoothingEnabled = true;
          ctx.drawImage(canvas, 0, 0, width, height);
          return thumbnailCanvas;
        },



        getThemeByID: function(themeID){
          return this.$store.getters.getThemeByID(themeID);
        },
        dispatchInitDone: function(){

          this.$emit("init");
        },
        setDirty: function(){


          if(!this.dirty)
          {
          //  console.log("[MapWidget ] setDirty");

            this.dirty = true;
            this.$nextTick(() =>
            {
              this.dirty = false;
              this.previewMapRenderUpdate(false);
            });
          }
        },
        manualUpdate : function(){
          if(this.variation != null)this.onVariationChange(this.variation);
          if(this.segmentColours != null) this.updateColourmap(this.segmentColours);
          if(this.waterColour != null) this.setWaterColour(this.waterColour);
          if(this.roadColour != null) this.setRoadColour(this.roadColour);
          this.setSegmentShowPercentage(this.segmentShowPercentage);
          this.setWaterAlpha(this.waterAlpha);
          this.setRoadAlpha(this.roadAlpha);
          this.setSegmentAlpha(this.segmentAlpha);

          this.setDirty();
        }
      },
      watch:{
        styleID: function(value){
          this.setDirty();
        },
        text1: function(value){
          this.setDirty();
        },
        text2: function(value){
          this.setDirty();
        },
        text3: function(value){
          this.setDirty();
        },

        variation: function(value){
          this.onVariationChange(value);
          this.setDirty();
        },
        segmentColours: function(value){
         // console.log("[MapWidget] segmentColours watch", value);
          this.updateColourmap(value);
          this.setDirty();

        },
        waterColour: function(value){
         // console.log("[MapWidget] waterColour watch");
          this.setWaterColour(value);
          this.setDirty();
        },
        roadColour: function(value){
         // console.log("[MapWidget] roadColour watch");
          this.setRoadColour(value);
          this.setDirty();

        },
        border : function(value)
        {
          this.setDirty();

        },
        showFrame: function(value)
        {
          this.setDirty();

        },
        segmentShowPercentage: function(value)
        {
          this.setSegmentShowPercentage(value);
          this.setDirty();
        },
        roadAlpha: function(value)
        {
          this.setRoadAlpha(value);
          this.setDirty();
        },
        waterAlpha: function(value)
        {
          this.setWaterAlpha(value);
          this.setDirty();
        },
        segmentAlpha: function(value)
        {
          this.setSegmentAlpha(value);
          this.setDirty();
        },
        showBottomFade : function(value)
        {
          this.setDirty();
        },
        bottomFadeHeight : function(value)
        {
          this.setDirty();
        }
      },
      mounted(){
        _model = this;
      },
      updated()
      {
        console.log("[MapWdiget] udpated");
      }
    }



    var _model;

    // WebGL - 2D Image Swap Red and Blue
    // from https://webglfundamentals.org/webgl/webgl-2d-image-red2blue.html

    "use strict";
    var BASE_URL = "/static/";

    var _commonAssetsLoaded = false;
    var _commonAssetsPromise = null;
    var _commonNoiseMapImage;
    var _commonFrameImage;
    var _commonFontObject_light;
    var _commonFontObject_regular;

   // var this.textureNoisemap;

    //var gl;  //specific to canvas
    //var previewProgram; //
    //var colourmapProgram; // sp

    //var canvas;

    function loadImages(list)
    {
      return new Promise((resolve, reject) => {
        var nImages = list.length;
        var nImagesLoaded = 0;
        var loadedImages = {};
        for (var i = 0; i < nImages; ++i) {
          loadImage(list[i], function (image, url) {
            loadedImages[url] = image;
            if (++nImagesLoaded == nImages) {
              resolve(loadedImages);
            }
          });
        }
      });
    }

    function loadFont(url)
    {
      return new Promise((resolve, reject) => {
        opentype.load(url, function (err, loadedfont) {
          resolve(loadedfont);
        });
      });
    }

    function loadCommonAssets(model)
    {
      if(_commonAssetsPromise == null) {
        console.log("MapWidget common assets not loaded yet so load them");

        //var noiseMapURL =BASE_URL +  "image/noisemap1.png";
        var noiseMapURL =BASE_URL +  "assets/mapwidget/noisemap.png";
        //var frameURL =BASE_URL +  "image/frame.png";
        //var paperShadowURL =BASE_URL +  "image/paperShadow.png";
        var frameImageURL =BASE_URL +  "assets/mapwidget/blackframe.png";
        //var textBgFadeURL = BASE_URL +  "image/textBgFade.png";
        var imageURLs = [noiseMapURL, frameImageURL /*frameURL,*/  /*innerBorderURL,textBgFadeURL*/];

        var p0 = loadImages(imageURLs);
        var p1 = model.loadExternalScript('/static/maptest/glfx.js');
        var p2 = model.loadExternalScript('/static/maptest/webgl-utils.js');
        var p3 = loadFont('/static/assets/fonts/roboto/Roboto-Light.ttf');
        var p4 = loadFont('/static/assets/fonts/roboto/Roboto-Regular.ttf');

        _commonAssetsPromise  = Promise.all([p0, p1, p2, p3,p4]);
        _commonAssetsPromise.then((values)=>{
          _commonAssetsLoaded = true;
          let images = values[0];
          _commonNoiseMapImage = images[noiseMapURL];
          _commonFrameImage = images[frameImageURL];
          _commonFontObject_light = values[3];
          _commonFontObject_regular = values[4];
          styleRenderer.setFonts(_commonFontObject_light, _commonFontObject_regular);

        })
      }

      if(_commonAssetsLoaded)
      {
        console.log("MapWidget common assets loaded already so return");
        return Promise.resolve();
      }
      else{
        return _commonAssetsPromise;
      }
    }

    // helpr method - load pixels into upng image
    function loadPreviewMapPixels(url)
    {
      return new Promise(function(resolve, reject) {
        var oReq = new XMLHttpRequest();
        oReq.open("GET", url, true);
        oReq.responseType = "arraybuffer";
        console.log("loadPreviewMapPixels", url);

        oReq.onload = function (oEvent) {
          console.log("loadPreviewMapPixels loaded", url);
          var arrayBuffer = oReq.response; // Note: not oReq.responseText
          if (arrayBuffer) {
            setTimeout(() => {
              var img = UPNG.decode(arrayBuffer);
              console.log("decoded", img.width, img.height, img.depth);
              var data = img.data;
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
    function loadImage(url, callback)
    {
      console.log("loadImage: " + url);
      var image = new Image();
     //  requestCORSIfNotSameOrigin(image, url);
      image.crossOrigin = "anonymous";
      image.src = url;
      image.onload = function() {
        console.log("image loaded " + url + " w: " + image.width);
        callback(image, url);

      }
    }

    // helper
    function hline(ctx,y) {
      ctx.beginPath();
      ctx.moveTo(-9999, Math.round(y)-0.5);
      ctx.lineTo(9999, Math.round(y)-0.5);
      ctx.stroke();
    }

    // helper
    function getPositionFromRatioInBound(bound,rx,ry)
    {
      return {x: bound.x + bound.w*rx, y: bound.y + bound.h*ry}
    }
    /*
    function getPrintBound(model, scale)
    {
      let w = 20,h ;

      console.log("this.printSizeID", model.printSizeID);
      console.log("this.orientationID", model.orientationID);
      h = 720;

      if(model.printSizeID == commonGlobals.PAPERSIZE_20x28)
      {
        w = 514 - 2;
      }
      else if(model.printSizeID == commonGlobals.PAPERSIZE_18x24)
      {
        w = 540 - 2;
      }
      else if(model.printSizeID == commonGlobals.PAPERSIZE_24x36)
      {
        w = 480 - 2;

      }
      else if(model.printSizeID == commonGlobals.PAPERSIZE_20x20)
      {
        w = 720;
      }

      if(model.orientationID == commonGlobals.ORIENTATION_ID_LANDSCAPE)
      {
        let temp = h;
        h = w;
        w = temp;
      }

      let BASESCALE = 0.7;
      w*= scale/BASESCALE;
      h*= scale/BASESCALE;
      w = Math.ceil(w);
      h = Math.ceil(h);

      return {x:0,y:0,w:w,h:h}
    }*/

    ///////////////////////////////////////////////////////////////////////////
    // helper draw methods

    function getRectBound(height,outerBorderSize, innerBorderSize, marginLeft, marginRight, marginBottom, paperWidth, paperHeight)
    {
      var x =   innerBorderSize*1 + outerBorderSize + marginLeft;
      var y =  - innerBorderSize*1  + outerBorderSize + paperHeight - height - marginBottom;
      var width = paperWidth - innerBorderSize*2 - marginLeft - marginRight;
      var height = height;
      return {x:x,y:y, width:width, height: height}
    }

    /*
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
    }*/

    function drawScale9Grid(ctx, image, x,y,w,h, tBorder, bBorder, lBorder, rBorder, borderScale)
    {
      var ih = image.height;
      var smalloffset = 0;
      // top row
      drawScale9GridRow(ctx, image,x,w,lBorder,rBorder,0,tBorder, y,tBorder*borderScale, borderScale, true);
      // middle row
      drawScale9GridRow(ctx, image,x,w,lBorder,rBorder,-smalloffset+ tBorder,ih-bBorder-tBorder, smalloffset+ y + tBorder*borderScale,h - (bBorder + tBorder)*borderScale, borderScale, false);
      // bottom row
      drawScale9GridRow(ctx, image,x,w,lBorder,rBorder,ih- bBorder,bBorder, y + h - bBorder*borderScale,bBorder*borderScale, borderScale, true);
    }

    function drawScale9GridRow(ctx, image, x,w, lBorder, rBorder, srowy, srowh, rowy, rowh, borderScale, drawMiddle)
    {
      console.log("drawScale9GridRow", x,w,lBorder, rBorder, srowy, srowh, rowy, rowh);
      var iw = image.width;
      // left
      ctx.drawImage(image, 0,srowy,lBorder, srowh , x,rowy,lBorder*borderScale, rowh);
      // middle
      if(drawMiddle)ctx.drawImage(image, lBorder,srowy,iw - (rBorder + lBorder), srowh , x + lBorder*borderScale,rowy, w - (rBorder +lBorder)*borderScale , rowh);
      // right
      ctx.drawImage(image, iw - rBorder ,srowy, rBorder , srowh , x + (w - rBorder*borderScale),rowy, rBorder*borderScale, rowh);
    }


    /////////////////////////////////////////////////////////////////////////////////////////////
    // COLOUR MAPPING





    /////////////////////////////////////////////////////////////////////

    /*
    // update - main method called when loading a new basemap, along with its props
    function onModelChanged(model)
    {
      console.log("onModelChanged");

      setTheme(model.getThemeByID( model.themeID), model.roadColour, model.waterColour);
      //onThemeChange(model.getThemeByID( model.themeID), model.roadColour, model.waterColour);

      onVariationChange(model.variation);
      loadBasemap(model);
    }
*/


</script>

<style scoped>

    .map-canvas {
        position: relative;
        transition: opacity 0.9s;
        opacity: 0;
    }

    .shadow-framed{
        box-shadow: -12px 7px 12px 0 rgba(0, 0, 0, 0.3)
    }

    .shadow-unframed{
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.45);
    }

    .fadeInMap{
        opacity: 1;
    }

    .demo-widget {
        max-width:100%;
        max-height:100%;
    }

</style>
