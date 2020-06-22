
<template>
    <v-dialog
            v-model="modalShowing"
            persistent
            no-click-animation
            max-width="920"
    >
        <v-card
                color="white"
                light
        >
            <v-card-actions style="padding-left: 5px; padding-top: 15px" class="text-xs-left">
                <v-spacer></v-spacer>

                <div class="subheading font-weight-normal text-xs-left" style="margin-left: 5px" >
                    Example preview when mounted in a black frame
                </div>
                <v-spacer></v-spacer>
                <v-btn flat icon light @click="modalShowing=false"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-actions>

            <v-card-text style="padding-top: 5px; padding-bottom: 5px; width: 100%;" >
                <!--
                <MockupWidget :image="image"  ></MockupWidget>
                -->

                <!--
                <v-progress-circular v-if="!isSceneLoaded" style="display: flex; position: relative; z-index: 1;top: 0px; left: 0px"  indeterminate color='primary' :size="24"  :width="2" ></v-progress-circular>
                -->
                <canvas style="display: flex; border:0px solid #d3d3d3; width: 100%; max-width: 1000px;position: relative"  ref="myCanvas" id="myCanvas" width="500" height="712" >
                    Your browser does not support the HTML5 canvas tag.
                </canvas>
                <v-layout justify-center style="width: 100%">


                </v-layout>
                <!--
                <v-btn @click="previous()">previous </v-btn>
                <v-btn @click="next()">next </v-btn>
                -->
            </v-card-text>
            <v-card-actions >
                <div style="margin: auto; padding-bottom: 5px">
                <v-btn :loading="sharedloading"  depressed dark  @click="share()" style="background-color:#2f55a4; text-transform: capitalize; font-size: 18px; padding-left: 25px; height: 45px">
                    <template v-if="shared">
                        shared
                        <v-icon>mdi-check</v-icon>
                    </template>
                    <template v-else="">
                        share
                        <img style="width: 24px; margin-left: 10px" src="/static/assets/mocks/facebook-icon.png">
                    </template>
                </v-btn>
                </div>
            </v-card-actions>
        </v-card>
    </v-dialog>


</template>

<script>
  //https://github.com/Hkh12/vuetify-image/blob/master/src/components/VImage.vue
  import {mapGetters} from 'vuex'
  import {bus} from "./../../main"
  import MapWidget from "../common/MapWidget";
  import commonGlobals from "../../../../common/commonGlobals"

  var SCENE_TRIANGLE_BG = 0;
 // var SCENE_WHITEFRAME = 1;
 // var SCENE_TABLETOP = 2;
  var NSCENES = 1;



  export default {
    name: 'MockupModal',
    components: {
      MapWidget
    },
    data(){
      return {
        sharedloading: false,
        shared: false,
        map: null,
        basemap:null,

        // scene table
       // bgImage: null,
       // sceneTableLoaded: false,
       // sceneTablePromise: null,

        // scene white border
       // bg2: null,
       // whiteFrameImage: null,
       // sceneWhiteBorderLoaded: false,
       // sceneWhiteBorderPromise: null,

        // scene tri
        blackFrameImage : null,
        sceneTriangleBgLoaded: false,
        sceneTriangleBgPromise: null,
        photoMockupBg: null,
        photoMockupFg: null,
        photoMockupLoaded: false,
        photoMockupPromise: null,

        image : null,
       // modalShowing : true,
        modalShowing : false,
        fxcanvas: null,

        sceneID : 0
      }
    },
    mounted(){




        // todo computed isLoaded() sceneTableLoaded
        // todo show the loading graphic if not loaded
        // todo when base assets have loaded show the scene
        // todo if map has not loaded yet then show a holding image at the correct dimension?

        /*
        this.sceneWhiteBorderPromise.then((img)=>{
          this.bgImage = img;
          this.sceneTableLoaded  = true;
          if(this.sceneID == SCENE_TABLETOP) this.redraw();
        });
      }*/

      /*
        // scene triangle  bg
        var blackFrameImagePromise = loadImage("/static/assets/mocks/blackframe.png");

        // scene white border
        var whiteFrameImagePromise = loadImage("/static/assets/mocks/whiteframe.png");
        var bg2Promise = loadImage("/static/assets/mocks/bg2.png");


        var promises = Promise.all([mockPromise, blackFrameImagePromise, whiteFrameImagePromise,bg2Promise]);
        promises.then((values)=>{
          this.bgImage = values[0];
          this.blackFrameImage = values[1];
          this.whiteFrameImage = values[2];
          this.bg2 = values[3];

        });
        */

        //this.redraw();
            this.loadSceneTriangles();
    },
    props: {

    },
    methods:{
      previous: function(){
        this.sceneID = (this.sceneID - 1 + NSCENES) % NSCENES;
        this.redraw();
      },
      next: function(){
        this.sceneID = (this.sceneID + 1) % NSCENES;
        this.redraw();
      },
        share: function(){

        this.sharedloading =true;

          var c = this.$refs.myCanvas;
          //var image = c.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
          //window.location.href=image; // it will save locally
          this.$store.dispatch("uploadMockup", {
            mockupCanvas: c,
            cartID: this.$store.getters.cartID,
            mapID: this.$store.getters.previewMap_mapID
          }).then((response)=> {
            console.log(response);
            var imageurl = response.url;
            this.sharedloading = false;


            // use this for facebook share
            FB.ui({
                method: 'share_open_graph',
//                action_type: 'og.shares',
                action_type: 'og.likes',
                action_properties: JSON.stringify({
                  object: {
                    'og:url': "https://www.makemapart.com",
                    'og:title': "MakeMapArt",
                    'og:description': "Create your own colorful map art of anywhere in the world",
                    'og:image': imageurl
                  }
                })
              },
              function (response) {
//your code goes here
                // todo disable button for this and show shared state
                this.shared = true;
                // set as shared to db
                this.$store.dispatch("setFBShared", {
                  cartID: this.$store.getters.cartID,
                  mapID: this.$store.getters.previewMap_mapID
                }).then((sharedresponse) => {
                  console.log(sharedresponse);
                });
              }
            );
          });
        },
        openWithImage: function(image, map, basemap)
        {
          this.sharedloading = false;
          this.shared = false ; //
          this.map = map;
          this.basemap = basemap;
          this.image = image;
          this.modalShowing = true;
          this.redraw();
        },
        redraw : function()
        {
          console.log("redraw");
          //if(this.sceneID == SCENE_TRIANGLE_BG)
            this.drawSceneTriangleBg();
        },

      loadScenePhotoMockup: function() {
        return new Promise((resolve, reject) => {
          if (!this.photoMockupPromise) {
            this.photoMockupPromise = Promise.all(
              [
                loadImage("/static/assets/mocks/blackframe.png"),
                loadImage("/static/assets/mocks/bg2.png")
              ]);
            this.photoMockupPromise.then((results) => {
              this.blackFrameImage = results[0];
              this.photoMockupBg = results[1];
              //this.photoMockupFg = results[2];
              //console.log("loaded");
              //if (this.sceneID == SCENE_TRIANGLE_BG){
                //setTimeout(()=>{
                //},10); //test
             // }
              this.phoneMockupLoaded = true;
              resolve();
            });
          }
          else if(this.sceneTriangleBgLoaded){
            resolve();
          }
        })
      },
      drawScenePhotoMockup()
      {
        // set the canvas dimension to the correct size first, this is so it shows correctly when loading
        var c = this.$refs.myCanvas;
        //c.width = 1200;
        //c.height = 630;
        //c.width = 600;
        //c.height = 315;
        c.width = 900;
        c.height = 600;

        this.loadScenePhotoMockup().then(()=> {
          console.log("assets loaded");
          console.log(c);
          var ctx = c.getContext("2d");
          //ctx.imageSmoothingQuality = "low|medium|high"
          //c.width = 875;
          //c.height = 550;
          ctx.save();
          if(this.photoMockupBg)ctx.drawImage(this.photoMockupBg,0,0);
          this.drawMap(this.blackFrameImage, 0.6,0.9);
        });
      },

      loadSceneTriangles: function() {
          return new Promise((resolve, reject) => {

            if (!this.sceneTriangleBgPromise) {
              this.sceneTriangleBgPromise = loadImage("/static/assets/mocks/blackframe.png");
              this.sceneTriangleBgPromise.then((img) => {
                this.blackFrameImage = img;
                console.log("loaded");

                if (this.sceneID == SCENE_TRIANGLE_BG){
                  setTimeout(()=>{
                    this.sceneTriangleBgLoaded = true;
                    resolve();
                  },10); //test
                }
              });
            }
            else if(this.sceneTriangleBgLoaded){
              resolve();
            }
          })

      },
        drawSceneTriangleBg()
        {
          // set the canvas dimension to the correct size first, this is so it shows correctly when loading
          var c = this.$refs.myCanvas;
          //c.width = 1200;
          //c.height = 630;
          //c.width = 600;
          //c.height = 315;
          c.width = 900;
          c.height = 600;

          this.loadSceneTriangles().then(()=> {
            console.log("assets loaded");
            console.log(c);
            var ctx = c.getContext("2d");
            //ctx.imageSmoothingQuality = "low|medium|high"
            //c.width = 875;
            //c.height = 550;
            ctx.save();
            //  if(this.bgImage)ctx.drawImage(this.bgImage,0,0);

            var canvasw = c.width;
            var canvash = c.height;

            var theme = this.$store.getters.getThemeByID(this.map.themeID);
            console.log(theme);
            var col0 = theme.segments[0].colour;
            var col1 = theme.segments[ Math.floor(theme.segments.length/2)].colour;
            var col2 = theme.segments[theme.segments.length-1].colour;

            ctx.beginPath();
            ctx.rect(0, 0, canvasw, canvash);
            //ctx.fillStyle = `rgb(${col0[0]},${col0[1]},${col0[2]})`;
            ctx.fillStyle = '#f5f1e9';
            ctx.fill();

            // draw triangle

            /*
            ctx.beginPath();
            ctx.moveTo(0, canvash);
            ctx.lineTo(0, 0);
            ctx.lineTo(canvasw, 0);
            ctx.closePath();
            ctx.fillStyle = `rgb(${col2[0]},${col2[1]},${col2[2]})`;
            ctx.fill();
*/
            /*
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, canvash);
            ctx.lineTo(canvasw, canvash);
            ctx.closePath();
            ctx.fillStyle = `rgb(${col1[0]},${col1[1]},${col1[2]})`;
            ctx.fill();
*/
            ctx.restore();

            this.drawMap(this.blackFrameImage, 0.6,0.9);

          });
        },
        drawMap: function(frameImage = null, maxWidthDelta = 0.9, maxHeightDelta = 0.9, angle=0, dx=0.5,dy=0.5, offsetYRatio = 0.5){

          var c = this.$refs.myCanvas;
          var canvasw = c.width;
          var canvash = c.height;
          var scale = Math.min(maxWidthDelta*canvasw/this.image.width , maxHeightDelta*canvash/this.image.height);

          var ctx = c.getContext("2d");
            ctx.save();
          //ctx.transform(1, 0.5, -0.5, 1, 30, 10);
          //ctx.transform(1.1502, -0.3097, 0.3097, 1.1502, -25.4624, 153.7944);
          ctx.translate(canvasw*dx, canvash*dy);
           ctx.rotate(-angle/180*Math.PI);
          ctx.scale(scale,scale);
          ctx.translate(-this.image.width/2, -this.image.height*offsetYRatio);

          // step 1
          const oc = document.createElement('canvas');
          const octx = oc.getContext('2d');
          oc.width = this.image.width;
          oc.height = this.image.height;

          // steo 2: pre-filter image using steps as radius
          const steps = (oc.width / this.image.width)>>1;
          octx.filter = `blur(0.8px)`;
          octx.drawImage(this.image, 0, 0);

          // step 3, draw scaled
          ctx.drawImage(oc, 0, 0, oc.width, oc.height, 0, 0, this.image.width, this.image.height);

          if(frameImage) {
            // inner border pixel coords for the frame png
            let tInnerBorder = 42; // from the top  of the image to the inner border (Ydirection )
            let lInnerBorder = 113; // from the left of the image to the inner border of the frame (x direction)
            let rInnerBorder = 49; // from the right of the image to the inner border of the frame (x direction)
            let bInnerBorder = 115; // from the bottom of the image to the inner border (y direction)

            // todo - want to hide the correct amount of frame overlap,  e.g 1/4in / 5mm  converted using the correct PPI
            let ppi = commonGlobals.getPPI(this.image.width, this.basemap.printSizeID, this.basemap.orientationID);
            let overlapInPixels = Math.round( ppi*commonGlobals.PICTURE_FRAME_OVERLAP_GAP);

            console.log("overlapInPixels",overlapInPixels);
            // scale9 divisons, offset for inner shadows
            let tBorder = tInnerBorder + 10;
            let bBorder = bInnerBorder + 10;
            let lBorder = lInnerBorder + 10;
            let rBorder = rInnerBorder + 10;

            let BORDER_IN_INCHES = 0.4; // 0.4in = 1cm
            let BORDER_IN_PIXELS = 23;
            let borderScale = ppi/(BORDER_IN_PIXELS/BORDER_IN_INCHES);
            let overlapIntoMap = overlapInPixels;
            let framex = Math.round( -lInnerBorder*borderScale + overlapIntoMap);
            let framey = Math.round( -tInnerBorder*borderScale + overlapIntoMap);
            let framew = Math.round( lInnerBorder*borderScale + this.image.width + ( rInnerBorder*borderScale) - overlapIntoMap * 2 ) ;
            let frameh = Math.round( tInnerBorder*borderScale + this.image.height + ( bInnerBorder*borderScale) - overlapIntoMap * 2 ) ;

            drawScale9Grid(ctx, frameImage, framex, framey, framew, frameh, tBorder, bBorder, lBorder, rBorder, borderScale)

            //ctx.drawImage(image, 0, 0);
            // ctx.rect(0, 0, 375, 500);
            //ctx.stroke();
          }
          ctx.restore();

          if(true) {
            this.fxcanvas = fx.canvas();

            var tempCanvasTexture = this.fxcanvas.texture(c);
            this.fxcanvas.draw(tempCanvasTexture).unsharpMask(1.0, 2.4).update();
            ctx.drawImage(this.fxcanvas,0,0);
          }
        },

    },
    computed: {
        isSceneLoaded: function(){
         // if( this.sceneID == SCENE_TABLETOP) return this.sceneTableLoaded;
        //  if( this.sceneID == SCENE_WHITEFRAME) return this.sceneWhiteBorderLoaded;
        if( this.sceneID == SCENE_TRIANGLE_BG) return this.sceneTriangleBgLoaded;
          return false;
        }


    },
    watch:{

    }
  }

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


  function loadImage(url)
  {
    return new Promise((resolve, reject) => {

      console.log("loadImage: " + url);
      var image = new Image();
      //  requestCORSIfNotSameOrigin(image, url);
      image.crossOrigin = "anonymous";
      image.src = url;
      image.onload = function () {
        console.log("image loaded " + url + " w: " + image.width);
        resolve(image);

      }
    });
  }

</script>

<style scoped>

</style>
