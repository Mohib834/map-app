<!--
view-source:https://lokeshdhakar.com/projects/color-thief/#api
-->
<template>
    <DraggableContainer containerID="colourExtract" title="Colour Extract" :initialXPos="1110" :initialYPos="100" v-model="show">
            <!--
        <v-btn @click="randomtest()">test</v-btn>-->


            <v-layout row style="margin-bottom: 10px" align-center>
                <div style="margin-right: 10px">Count</div>
                <v-text-field
                        v-model="colourCount"
                        class="mt-0 pt-0"
                        hide-details
                        type="number"
                        min="1"
                        max="20"
                        style="width: 70px; border: 1px solid #aaaaaa; font-size: 1em ;padding-left: 5px; border-radius: 4px"

                ></v-text-field>
                <div style="margin-right: 10px; margin-left: 10px">Quality</div>
                <v-text-field
                        v-model="quality"
                        class="mt-0 pt-0"
                        hide-details
                        type="number"
                        min="1"
                        max="20"
                        step="1"
                        style="width: 70px; border: 1px solid #aaaaaa; font-size: 1em ;padding-left: 5px; border-radius: 4px"

                ></v-text-field>
            </v-layout>


            <div id="drop-zone" class="drop-zone">
                <div class="drop-zone-label default-label">Drag an image here / click to refresh</div>
                <div class="drop-zone-label dragging-label">Drop it!</div>
            </div>

            <div>
                <img class="previewimage" id="previewimage" />
            </div>
            <div>
                <canvas width="100" height="100" id="smallCanvas"></canvas>
            </div>
            <v-layout row align-center style="margin: 5px; padding: 0">
                <div style="margin-right: 10px">Sampled Colour</div>
                <ColourButton style="width:100%" @click.native="swatchColourSelected(sampledColour)"  :parentObject="sampledColour" ></ColourButton>
            </v-layout>

            <v-layout row wrap style="margin: 5px; padding: 0; margin-bottom: 10px">
                <template
                        v-for="(colour, index) in swatches"
                        @click=""
                >
                    <ColourButton @click.native="swatchColourSelected(colour)"  :parentObject="colour"  style="margin-right: 2px;margin-bottom: 2px"></ColourButton>
                </template>
            </v-layout>
            <v-layout row align-center style="margin: 5px; padding: 0">
                <v-btn block color="primary" style="text-transform: capitalize" dark @click="createFromPalette()" v-if="swatches.length > 0" >Create From Palette</v-btn>
            </v-layout>

        <v-checkbox v-model="mCutUseDynamic" class="mx-2" label="MCut Dynamic Mode"></v-checkbox>
        <v-layout v-if="mCutUseDynamic" row style="margin-bottom: 10px" align-center>
            <div style="margin-right: 10px" >MCut Dynamic Thres</div>
            <v-text-field
                    v-model="mCutDynamicThreshold"
                    class="mt-0 pt-0"
                    hide-details
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    style="width: 70px; border: 1px solid #aaaaaa; font-size: 1em ;padding-left: 5px; border-radius: 4px"

            ></v-text-field>
        </v-layout>
        <v-layout v-else="" row style="margin-bottom: 10px" align-center>

            <div style="margin-right: 10px; margin-left: 10px">MCut Fixed Count</div>
            <v-text-field
                    v-model="mCutFixedCount"
                    class="mt-0 pt-0"
                    hide-details
                    type="number"
                    min="1"
                    max="50"
                    step="1"
                    style="width: 70px; border: 1px solid #aaaaaa; font-size: 1em ;padding-left: 5px; border-radius: 4px"
            ></v-text-field>
        </v-layout>


        <v-layout row wrap style="margin: 5px; padding: 0; margin-bottom: 10px">
                <template
                        v-for="(segment, index) in colourSegmentsMCut"
                        @click=""
                >
                    <ColourButton @click.native="swatchColourSelected(segment.colour)"  :parentObject="segment.colour"  style="margin-right: 2px;margin-bottom: 2px"></ColourButton>
                </template>
            </v-layout>
            <v-layout row align-center style="margin: 5px; padding: 0">
                <v-btn block color="primary" style="text-transform: capitalize" dark @click="createFromPaletteMCut()" v-if="colourSegmentsMCut.length > 0" >Create From Palette</v-btn>
            </v-layout>


    </DraggableContainer>
</template>

<script>
  import MedianCut from '../../../public/static/lib/median-cut/median-cut'
  import ColorThief from '../../../node_modules/colorthief/dist/color-thief.mjs'

  import currentMapDataMixin from '../../mixins/currentMapDataMixin'
  import {bus} from "./../../main"
  import ColourButton from "./ColourButton";
  import DraggableContainer from "./DraggableContainer";

  var colorThief = new ColorThief();

  import Vibrant from 'node-vibrant'

  export default {
    mixins:[
      currentMapDataMixin
    ],
    components:{
      DraggableContainer,
      ColourButton
    },
    data(){
      return {
        uploadedImgElement: null,
        show: false,
        sampledColour:[200,200,200],
        autoApplyPicker :true,
        quality: 10,
        colourCount: 10,
        swatches:[],
        colourSegmentsMCut:[],

        mCutDynamicThreshold: 0.85, // higher means more colours are included
        mCutUseDynamic:true,
        mCutFixedCount: 15
      }
    },
    props:{

    },
    computed: {
      textColours: function(){
        if(this.$store.getters.currentTheme) {
          return this.$store.getters.currentTheme.textcolours;
        }
        return null;
      },
      previewColours: function(){
        if(this.$store.getters.currentTheme) {
          return this.$store.getters.currentTheme.previewcolours;
        }
        return null;
      },
      segmentColours : function(){
        if(this.$store.getters.currentTheme) {
          return this.$store.getters.currentTheme.segments;
        }
        return null;
      },
      currentTheme: function(){
        return this.$store.getters.currentTheme;
      },

    },
    watch:{
      sampledColour: function(){

      },
      mCutDynamicThreshold: function(val){
        this.processImage();
        this.createFromPaletteMCut();
      },
      mCutUseDynamic:function(){
        this.processImage();
        this.createFromPaletteMCut();
      },
      mCutFixedCount: function(){
        this.processImage();
        this.createFromPaletteMCut();
      }

    },
    methods : {
      createFromPaletteMCut: function(){
        // remove all existing from the current theme
        this.segmentColours.splice(0, this.segmentColours.length);
        // add from the palette
        for(var i =0; i< this.colourSegmentsMCut.length;++i) {
          this.segmentColours.push(this.colourSegmentsMCut[i]);
        }
      },
      createFromPalette: function(){
        // remove all existing from the current theme
        this.segmentColours.splice(0, this.segmentColours.length);
        // add from the palette
        for(var i =0; i< this.swatches.length;++i) {
          this.segmentColours.push({
            colour: this.swatches[i],
            weight: 10
          });
        }
      },
      doColourSampleFromCanvas: function(mouseevent, ctx_small){
        // getting user coordinates
        var x = mouseevent.offsetX;
        var y = mouseevent.offsetY;
        // getting image data and RGB values
        console.log("event",mouseevent, x,y);
        var img_data = ctx_small.getImageData(x, y, 1, 1).data;
        var R = img_data[0];
        var G = img_data[1];
        var B = img_data[2];
        var col = [R,G,B];
        this.sampledColour = col;
        console.log("picked col", col);

        if(this.autoApplyPicker){
            bus.$emit("setThemeColour", col);
        }
      },



      // this is so it can be sampled from with a eye dropper, but also used for faster analysis
      createLowResCanvas: function(img){

        var ctx,
          ctx_small,
          canvas,
          canvas_small,
          mc,
          img_width           = 0,
          img_height          = 0,
          max_canvas_width    = 200;

        canvas_small        = document.getElementById("smallCanvas");
       // canvas_small        = document.createElement("canvas");
        ctx_small           = canvas_small.getContext("2d");

        var img_ratio     = img.width / img.height;

        var maxWidth = 200;
        if(img.width  > maxWidth)
        {
        }
        var canvas_width  = ( img.width  > max_canvas_width  ) ? ( img_ratio > 1 ) ? max_canvas_width  : max_canvas_width*img_ratio  : img.width;
        var canvas_height = Math.floor( canvas_width / img_ratio );

        canvas_small.width = canvas_width;
        canvas_small.height = canvas_height;
        // Clear the small canvas context
        ctx_small.clearRect( 0, 0, canvas_width, canvas_height );
        // Draw the downsized image inside the canvas
        ctx_small.drawImage( img, 0, 0, canvas_width, canvas_height );


        ///////////////
        // colour sampling  on click

        $('#smallCanvas').click((e) =>{
          this.doColourSampleFromCanvas(e, ctx_small);
        });
        var _this = this;
        $('#smallCanvas').mousedown(function(e){
          $(this).on("mousemove",function(e){
            _this.doColourSampleFromCanvas(e, ctx_small);
          });
        })
          .mouseup(function(){
            $(this).off("mousemove");
          });

        ////---------------------
        // mcut test

        console.log("MedianCut", MedianCut);
        var mcut =  MedianCut.MedianCut();

        //var rgb_array = [[1,1,1],[100,100,100],[155,155,155]];
        var data = ctx_small.getImageData( 0, 0, canvas_width, canvas_height );
        var rgb_array = imagedata_to_rgb(data);
        mcut.init( rgb_array );

        var boxes = (this.mCutUseDynamic) ? mcut.get_dynamic_size_boxes( this.mCutDynamicThreshold ) : mcut.get_fixed_size_boxes(this.mCutFixedCount);
        console.log("mcut boxes",  boxes);
        this.colourSegmentsMCut = mcut.getColourSegmentsMean(boxes);
        console.log("this.colourSegmentsMCut",  this.colourSegmentsMCut);


        //   var palette = mcut.get_dynamic_size_paletteMedian( 0.7 );

        var vibrant = new Vibrant(img);

        Vibrant.from(img).getPalette(function(err, palette) {
          console.log("Vibrant palette", palette);
        });


      },
      swatchColourSelected: function(col){
        bus.$emit("colourSwatchSelected", col);
      },
      extractColoursFromImage: function(image) {
        var start                    = Date.now();
        var color                    = colorThief.getColor(image);
        var elapsedTimeForGetColor   = Date.now() - start;
        var palette                  = colorThief.getPalette(image, Number.parseInt( this.colourCount), Number.parseInt(this.quality));
        var elapsedTimeForGetPalette = Date.now() - start + elapsedTimeForGetColor;
        var colorThiefOutput = {
          color: color,
          palette: palette,
          elapsedTimeForGetColor: elapsedTimeForGetColor,
          elapsedTimeForGetPalette: elapsedTimeForGetPalette
        };
        console.log("colorThiefOutput", colorThiefOutput);

        //colorThiefOutput.palette.push(colorThiefOutput.color);
        this.swatches = colorThiefOutput.palette;


      },
      autoApplyPalette : function(){
        this.createFromPaletteMCut();
        //this.createFromPalette();

      },

      // this is the properly encoded version that is in bars
      processThemeStripImage : function(img){
        var ctx,
          canvas;
        canvas        = document.createElement("canvas");
        ctx           = canvas.getContext("2d");

        console.log("processThemeStripImage----");
        var w = img.width;
        var h = img.height;
        console.log(w,h);

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage( img, 0, 0, w, h);

        // read the first row of pixels
        var firstRowPixels = ctx.getImageData(0, 0,w , 1).data;
        var secondRowPixels = ctx.getImageData(0, 1,w , 1).data;
        var lastRowPixels = ctx.getImageData(0, h-1,w , 1).data;

        var cols = this.getUniqueColoursFromPixelRow(firstRowPixels, w);
        console.log("cols", cols);
        // the first 2 cols are the water and the land
        var water = cols[0].colour;
        var road = cols[1].colour;


        // remove all existing from the current theme
        this.segmentColours.splice(0, this.segmentColours.length);
        // add from the palette
        for(var i =2; i< cols.length;++i) {
          this.segmentColours.push(cols[i]);
        }

        this.$store.getters.currentTheme.water  = water;
        this.$store.getters.currentTheme.road  = road;


        // process the text colour , this is the frist 3 pixels of the second row
        this.textColours[0].colour= this.getColourAtPosition(secondRowPixels, w, 0, 0);
        this.textColours[1].colour = this.getColourAtPosition(secondRowPixels, w, 1, 0);
        this.textColours[2].colour = this.getColourAtPosition(secondRowPixels, w, 2, 0);

        // process the preview colours - this is the bottom row of pixels
        var lastRowCols = this.getUniqueColoursFromPixelRow(lastRowPixels, w);
        console.log("lastRowCols", lastRowCols);
        this.previewColours[0].colour  = (lastRowCols.length > 0 ) ? lastRowCols[0].colour : [0,0,0];
        this.previewColours[1].colour = (lastRowCols.length > 1 ) ? lastRowCols[1].colour : [0,0,0];
        this.previewColours[2].colour = (lastRowCols.length > 2 ) ? lastRowCols[2].colour : [0,0,0];
        this.previewColours[3].colour = (lastRowCols.length > 3 ) ? lastRowCols[3].colour : [0,0,0];

      },
      getUniqueColoursFromPixelRow: function(pixels, w, MIN_PIXEL_WIDTH = 1){
        var cols = [];
        var curcol = null;
        var weight = 0;
        for(var i =0; i < w; ++i){
          var r =  pixels[4*i + 0];
          var g =  pixels[4*i + 1];
          var b =  pixels[4*i + 2];
          console.log(r,g,b);

          if(curcol == null ) {
            curcol = [];
            curcol[0] = r;
            curcol[1] = g;
            curcol[2] = b;
            weight = 0;
          }
          if((curcol[0] != r) || (curcol[1] != g) || (curcol[2] != b) )
          {
            if(weight >= MIN_PIXEL_WIDTH) {
              cols.push({
                colour: curcol,
                weight: weight
              });
            }
            curcol = [];
            curcol[0] = r;
            curcol[1] = g;
            curcol[2] = b;
            weight = 1;
          }
          else{
            weight++;
          }
        }
        if(weight >= MIN_PIXEL_WIDTH) {
          cols.push({
            colour: curcol,
            weight: weight
          });
        }
        return cols;
      },
      getColourAtPosition : function(pixelData, w, x,y){
        var index = 4*(y*w + x);
        return [
          pixelData[index + 0],
          pixelData[index + 1],
          pixelData[index + 2]
        ];
      },
      processImageAndDoAutoApply : function(){
        this.processImage();
        this.autoApplyPalette();
      },
      processImage: function(){
        console.log("loaded");
        if(this.uploadedImgElement) {
          this.createLowResCanvas(this.uploadedImgElement);
          this.extractColoursFromImage(this.uploadedImgElement);

          //this.createFromPalette();
          //this.createFromPaletteMCut();
        }
      },

      handleFiles : function(files) {
        var $draggedImages = $('#dragged-images');
        var imageType      = /image.*/;
        var fileCount      = files.length;

        var file = files[0];
        if (file.type.match(imageType)) {

          var fr = new FileReader();
          fr.onload = () => {
            var imgElement = document.createElement('img');
           // var imgElement = document.getElementById('previewimage');
            imgElement.onload = () =>{
              this.uploadedImgElement = imgElement;
              var ratio = imgElement.width/ imgElement.height;

             // var isNarrowImage = false;
              var isNarrowImage = ratio > 3.5;
              console.log("ratio ", ratio , " isNarrowImage: " + isNarrowImage);
              if(isNarrowImage) {
                // if its long assume its a theme strip
                this.processThemeStripImage(imgElement);
              }
              else{
                this.processImageAndDoAutoApply();

              }
            };
            imgElement.src = fr.result;
          };
          fr.readAsDataURL(file);
        }else {
          alert('File must be a supported image type.');
        }



      }
    },
    mounted(){
      //bus.$on("openColourEditor", this.openColourEditor);
      //us.$on("onSegmentColourSelected", this.onSegmentColourSelected);


      $('#drag-drop').show();
      var $dropZone = $('#drop-zone');
      var handleDragEnter = function(event){
        $dropZone.addClass('dragging');
        return false;
      };
      var handleDragLeave = function(event){
        $dropZone.removeClass('dragging');
        return false;
      };
      var handleDragOver = function(event){
        return false;
      };
      var _this= this;
      var handleDrop = function(event){
        $dropZone.removeClass('dragging');

        if( event.stopPropagation ) {
          event.stopPropagation();
        }
        if( event.preventDefault ) {
          event.preventDefault();
        }

        _this.handleFiles(event.originalEvent.dataTransfer.files);
        return false;
      };
      $dropZone
        .on('dragenter', handleDragEnter)
        .on('dragleave', handleDragLeave)
        .on('dragover', handleDragOver)
        .on('drop', handleDrop)
        .on('click', _this.processImageAndDoAutoApply);

    }
  }

  function imagedata_to_rgb( _image_data ) {

    // Translates an ImageData object's CanvasPixelArray into
    // an RGB array of the form:
    //
    //      [
    //          [ r1, g1, b1 ],
    //          [ r2, g2, b2 ],
    //          ...
    //          [ rN, gN, bN ]
    //      ]

    var rgb_array = [];
    var rgb_color;

    for( var i = _image_data.data.length - 1; i > 1; i -= 4 ) {

      rgb_color = [
        _image_data.data[ i - 3 ],
        _image_data.data[ i - 2 ],
        _image_data.data[ i - 1 ]
      ] ;

      rgb_array.push( rgb_color );

    }

    return rgb_array;

  }


</script>

<style scoped>

    .previewimage{
        margin-top: 10px;
        max-width:100%;
        max-height:205px;
        width: auto;
        height: auto;
    }

    .container {
        --color: #000;
        --bg-color: #f9f9f9;
        --hover-bg-color: #e9e9e9;
        --primary-color: #e66622;
        --muted-color: #999;
        --link-color: #17f;
        --code-color: var(--primary-color);
        --code-bg-color: #fff;
        --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        --code-font: Menlo, Consolas, Monaco, Lucida Console, monospace;
        --code-font-size: 0.75rem;
        --bold: 700;
        --x-bold: 900;
        --line-height: 1.5em;
        --line-height-heading: 1.3em;
        --text-transform-heading: uppercase;
        --border-color: #000;
        --border-color-light: #ccc;
        --border-radius: 6px;
        --border-radius-large: 8px;
        --border-radius-xl: 12px;
        --page-width: 56rem;
        --sm-screen: 720px;
    }


    .drag-drop-section {
        display: none;
    }

    .drop-zone {
        height: 10rem;
        margin-bottom: 0rem;
        background-color: white;
        border: 4px solid var(--link-color);
        border-radius: var(--border-radius-xl);
        font-weight: var(--bold);
    }
    .drop-zone.dragging {
        background-color: var(--link-color);
    }

    .drop-zone.dragging .default-label {
        display: none;
        color: var(--link-color);
    }

    .drop-zone.dragging .dragging-label {
        color: white;
        display: block;
    }

    .drop-zone-label {
        position: relative;
        top: 4rem;
        color: var(--link-color);
        font-size: 1.2em;
        text-align: center;
        pointer-events: none;
        text-transform: uppercase;
        border-radius: var(--border-radius-xl);
    }

    .dragging-label {
        display: none;
    }

    .dropped-image .run-functions-button {
        display: none;
    }



</style>
