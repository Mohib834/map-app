
<template>
  <div class="HolyGrail-body" id="holyGrailbody" ref="baseRoot">




    <div id="sidenav" class="HolyGrail-nav-container" v-if="isDesktop">

      <nav  class="HolyGrail-nav" >
        <div class="sidenav-base">
          <div>
            <div class="sidenavtop">
              <!--
              <button class="menu-button" @click="closeNav()" >
                <v-icon color="white">mdi-chevron-left</v-icon>
              </button>
              -->
            </div>
          </div>

          <div class="sidenav-scrollcontentholder" >


            <div class ="sidenav-scrollcontent customscroll"  >
              <div class ="sidenav-scrollcontentinner"  >

                <!--   MAIN SIDE BAR CONTENT GOES HERE -->
                <slot name="sidebar-main"></slot>
              </div>
            </div>
          </div>
          <div class="sidenav-bottom" :style="sidenavBottomStyle">
            <!--   BOTTOM SIDEBAR CONTENT GOES HERE -->
            <slot name="sidebar-bottom"></slot>

          </div>

          <div id="editorBase-sidenavOverlay" class="editorBase-sidenavOverlay" v-show="sidenavOverlayShowing" :style="{opacity: sidenavOverlayOpacity}">
          </div>
        </div>
      </nav>


    </div>

    <div id="editorBase-mapAreaDarkOverlay" class="editorBase-mapAreaDarkOverlay" v-show="mapOverlayShowing" :style="{opacity: mapOverlayOpacity}">
    </div>

    <main class="HolyGrail-content" id="contentBase" ref="contentBase">

      <!--
      <div class="centered-content-top-row" :class="{'centered-content-top-row-mobile' : isMobile }" style="z-index:2">

        <v-layout row align-center fill-height style="width: 100%;">
          <v-flex shrink >
            <SiteLogo light></SiteLogo>
          </v-flex>
          <v-spacer></v-spacer>
          <NavBarRightSection light></NavBarRightSection>
        </v-layout>
      </div>
      -->

      <div class="centered-content-bottom-row" v-if="showBottom && isDesktop" >
        <!--
        <v-layout row align-center fill-height style="">
          <v-flex shrink style="margin-top: 3px">
            <img :style="pencilStyle"  src="/static/assets/mapwidget/pencil-horizontal.png">
          </v-flex>
        </v-layout>
        -->
        <slot name="underMapCenter"></slot>

      </div>


      <div v-show="isMobile" class="content-bottom-row" :style="{'margin-top': tabbarYPosition + 'px'  }">
        <slot name="content-bottom">
        </slot>


      </div>





      <div id="holder" :class="{holder:true, 'holder-desktop':  ($mq != 'mobile') &&  navShowing } ">


        <div class="design-holder-padding">
          <div   id="design-holder" class="design-holder">
            <!--
            <canvas id="scaledCanvas"  class="map-canvas"></canvas>
            -->
            <div id="paddingDiv" >
              <slot name="content"></slot>
            </div>
          </div>


          <div   id="under-map-center" class="under-map-center" >
            <!--
              <slot name="underMapCenter"></slot>
              -->
          </div>


        </div>
        <!--
        <div   id="map-controls" class="map-controls">

          <slot name="content-map-controls"></slot>
        </div>
-->
        <button class="menu-button" @click="openNav()" v-if="!navShowing">
          <v-icon color="white">mdi-chevron-right</v-icon>
        </button>

          <!--
          <div class="centered-content-bottom-row" v-if="!navShowing">
            <button class="addtocart rounded-version" > Add To Cart </button>
          </div>
          -->
      </div>

      <slot name="contentOverlay"></slot>


    </main>



    </div>
</template>

<script>
  import SiteLogo from './SiteLogo.vue'
  import NavBarRightSection from '../navbar/NavBarRightSection.vue'
  import BottomSheet from "./BottomSheet";
  import currentMapDataMixin from '../../mixins/currentMapDataMixin'
  import commonGlobals from '../../../../common/commonGlobals'

  export default {
    mixins: [currentMapDataMixin],
    components:{
      BottomSheet,
      SiteLogo,
      NavBarRightSection,
      BottomSheet
    },
    props: {
      contentBackgroundColour: {
        type: String,
        default: '#eeeeee'
      },
      showBottom: {
        type: Boolean,
        default: false
      }

    },
    data () {
      return {

        mapScaleValue: 1,
        bottomButtonAnimationUpActive : false,
        tabbarYPosition: 0,
        canvasPPI: 0,
        sidenavOverlayTimeoutID : null,
        mapOverlayTimeoutID : null,
        navShowing: true,
        mapOverlayOpacity: 0,
        sidenavOverlayOpacity: 0,
        mapOverlayShowing: false,
        sidenavOverlayShowing: false
      }
    },
    computed: {
      isMobile : function(){
        return this.$mq == 'mobile';
      },
      isDesktop : function(){
        return !this.isMobile;
      },
      sidenavBottomStyle: function(){
        return {
          top: (this.bottomButtonAnimationUpActive) ? '121px' :  'calc(100% - 65px)'
        }
      },
      pencilStyle: function(){
        const PencilLengthInInches = 7.5;
        return {
          width: Math.round(this.canvasPPI*PencilLengthInInches ) + 'px'
        }
      },

    },
    methods:{

      // auto scroll the side menu, used in tour to make elements are in range
      // move position such that the minY and maxY position are in frame
      scrollSideMenuToShowBound : function(minY, maxY){
        var element = $("div.sidenav-scrollcontent");
        var viewMinY =element.scrollTop();
        var windowHeight = $( window ).height();
        var viewMaxY = viewMinY + windowHeight - 70; // minus the fix bottom button height
        // try maxY first
       // console.log("minY", minY, "maxY", maxY);
      //  console.log("viewMinY", viewMinY, "windowHeight", windowHeight, "viewMaxY", viewMaxY);


        var doMove = false;
        var positionY = null;
        if(maxY > viewMaxY)
        {
          doMove = true;
          positionY = maxY;
        }
        if(minY < viewMinY)
        {
          doMove = true;
          positionY = minY;
        }

      //  console.log("doMove", doMove, "positionY", positionY);

        //var scrollOffset =positionY - windowHeight;
        if(doMove) {
          $("div.sidenav-scrollcontent").animate({scrollTop: positionY + "px"}, 500);
        }
        //}
      },

      fadeInSidenavOverlay: function()
      {
        if(this.sidenavOverlayTimeoutID != null) clearTimeout(this.sidenavOverlayTimeoutID );
        this.sidenavOverlayShowing = true;
        this.sidenavOverlayTimeoutID  =setTimeout(()=>{
          this.sidenavOverlayOpacity = 0.5;
          this.sidenavOverlayTimeoutID = null;

        },100);
      },
      fadeOutSidenavOverlay: function()
      {
        if(this.sidenavOverlayTimeoutID != null) clearTimeout(this.sidenavOverlayTimeoutID );
        this.sidenavOverlayOpacity= 0;
        this.sidenavOverlayTimeoutID  = setTimeout(()=>{
          this.sidenavOverlayShowing = false;
          this.sidenavOverlayTimeoutID = null;
        },500);
      },

      fadeInMapOverlay: function()
      {
        if(this.mapOverlayTimeoutID != null) clearTimeout(this.mapOverlayTimeoutID);
        this.mapOverlayShowing = true;
        this.mapOverlayTimeoutID = setTimeout(()=>{
          this.mapOverlayOpacity = 0.5;
          this.mapOverlayTimeoutID = null;
        },100);
      },
      fadeOutMapOverlay: function()
      {
        if(this.mapOverlayTimeoutID != null) clearTimeout(this.mapOverlayTimeoutID);

        this.mapOverlayOpacity= 0;
        this.mapOverlayTimeoutID =setTimeout(()=>{
          this.mapOverlayShowing = false;
          this.mapOverlayTimeoutID = null;
        },500);
      },
      closeNav: function()
      {
        this.navShowing = false;
        console.log("close nav");
        document.getElementById("sidenav").style.left = "-300px";
        //document.getElementById("holder").style.left = "0px";

        var _this = this;
        this.$nextTick(function() {
          _this.resizeContentToFit();
        });
      },
      openNav: function()
      {
        this.navShowing = true;
        console.log("open nav");
        document.getElementById("sidenav").style.left = "0px";
        /*
         if(this.$mq != 'mobile') {
         document.getElementById("holder").style.left = "300px";
         }*/
        var _this = this;
        this.$nextTick(function() {
          _this.resizeContentToFit();
        });

      },
      toggleNav: function()
      {
        if(this.navShowing){
          // if(document.getElementById("sidenav").style.left == "0px") {
          this.closeNav();
        }
        else{
          this.openNav();
        }
      },

      /*
      addToCart: function()
      {
        console.log("addToCart");
        // add the current item to the cart
        // todo - show pop
        this.$store.commit("addCurrentMapToCart");

      },
      getPagedThemeID: function(ix)
      {
        var nThemesPerPage = this.themePageRows * this.themePageCols;
        return ix + this.themePageID*(nThemesPerPage);
      },
      nextThemePage: function()
      {
        //var nPages = nThemes/
        this.themePageID = (this.themePageID + 1);
        console.log("----themePageID", this.themePageID);

      },
      prevThemePage: function()
      {
        this.themePageID = (this.themePageID - 1);
      },
      changeTheme: function(newThemeID)
      {
        this.themeID = newThemeID;
        onThemeIDChange(newThemeID);
        previewMapRenderUpdate(this);
      },
      getTheme : function(i){
        if(i < this.nThemes) {
          return themes[i];
        }return null;
      },
      getThemes : function(i)
      {
        return themes;
      },
*/
      /*
      setWaterColourEvent : function(colour){
        console.log("setWaterColourEvent: " + colour);
        setWaterColour(colour);
        previewMapRenderUpdate(_model); // todo add model
      },

      onPreviewMapChangeEvent: function(evt){
        previewMapRenderUpdate(this);
      },
      onVariationChangeEvent : function(evt){
        console.log("onVariation change", evt.target.value);
        onVariationChange(evt.target.value);
        previewMapRenderUpdate(this);
      },*/
      /*
      randomiseThemeColours: function()
      {
        var val = Math.floor( Math.random()*255);
        onVariationChange(val);
        previewMapRenderUpdate(this);
      },
      onThemeIDChangeEvent : function(evt){
        console.log("onVariation change", evt.target.value);
        onThemeIDChange(evt.target.value);
        previewMapRenderUpdate(this);

      },*/
      /*
      onMapChangeEvent : function(evt)
      {
        console.log("onMapChange Event", evt.target.value);
        loadMap(this);
      },*/
      resizeContentToFit : function()
      {
        //console.log("resizeContentToFit");
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;

        //console.log("resizeContentToFit", windowWidth);
        //console.log("this.orientationID", this.orientationID);

        var previewSize = commonGlobals.getPreviewMapSize(this.printSizeID, this.orientationID);
        var ratio = previewSize.width / previewSize.height;
        var expandedMapHeight = windowHeight - 60;
        var expandedMapWidth = expandedMapHeight * ratio;
      //  console.log("width,height:", expandedMapWidth, expandedMapHeight);



        const SIDE_PADDING = 15;
        var orgBoundWidth = $('#holder').width() - 2*SIDE_PADDING;
        var orgBoundHeight = $('#holder').height();
        var scale;
        var width  = $('#design-holder').width();
        var height = $('#design-holder').height();




        //  todo offset traslae y by +scale/2

        const MAPPREVIEWPROCESS_downsampleDimension = 1024; // value in previewMapProcess.js server side
        const MAPWIDGET_renderScale = 1.0; // renderScale value in MapWiget.vue
        var maxDimension =  MAPPREVIEWPROCESS_downsampleDimension * MAPWIDGET_renderScale;
        var boundWidth = Math.min(orgBoundWidth, maxDimension);
        var boundHeight = Math.min(orgBoundHeight, maxDimension);


        scale = Math.min(boundWidth/width , boundHeight/height);
        var maxScale = 1.0;
      scale = Math.min(scale,maxScale);


        this.mapScaleValue = scale;
        var centerIt = true;

        var translatePercX = (centerIt) ? -0.5 :  -0.5 + scale/2.0 ;

        //$( "#design-holder" ).css({ transform: 'scale(.5)' });
        var css = {
        'transform': 'translate(-50%,calc( '+ (translatePercX*100) +'% - 30px ) ) ' + 'scale(' + scale + ')',  // px X offset should be half the amount of design-holder-padding css value
          'top' :  (centerIt) ? '50%' :  '0px'
        };

        $('#design-holder').css(css);


      ////////////////////////////////////////

        var SIDEBAR_WIDTH = 300;
        var LEFTANDRIGHT_NAVBARELEMENT_WIDTH = 320;
        //let takeUpFullHeight = expandedMapWidth < windowWidth - SIDEBAR_WIDTH - LEFTANDRIGHT_NAVBARELEMENT_WIDTH;
        let takeUpFullHeight = false;

        if(this.isMobile) {
          $('#holder').css({
            height: (this.tabbarYPosition - 126) + "px",
            bottom: "65px",
            top: "65px"
          });
        }else if( takeUpFullHeight    ){
          $('#holder').css({
            height: "calc(100% - 0px)",
            bottom: "0px",
            top: "0px"
          });

          let expandedViewPaddingAmount = 30;
          $('#paddingDiv').css({
            'padding-top': Math.round(expandedViewPaddingAmount/scale) + "px",   //
            'padding-bottom': Math.round(expandedViewPaddingAmount/scale) + "px",   //

          });
        }
        else{
          $('#holder').css({
            height: "calc(100% - 0px)",
            bottom: "0px",
            top: "0px"
          });

          let paddingAmountToFitInsideTopBar = 60;
          $('#paddingDiv').css({
            'padding-top': Math.round(paddingAmountToFitInsideTopBar/scale) + "px",
            'padding-bottom': Math.round(paddingAmountToFitInsideTopBar/scale) + "px"
          });
        }


       // console.log(boundWidth,boundHeight , width, height, scale );
        //console.log("boundWidth", boundWidth, "width", width);
        // optional unscaled dvi on the topright - this is for any optional map controls that sits ontop of the content
       /*
        var tlx = (boundWidth - width*scale)/2;
        var trx = tlx + width*scale - 40;
        var tly = (boundHeight - height*scale)/2 + 10;
       // var topry = tly + height*scale - 30;
        $('#map-controls').css({'transform': 'translate(' + Math.round( trx )+'px,'+ Math.round(tly) + 'px) ' + 'scale(' + (1.0) + ')'});
*/
        var bmx = SIDE_PADDING;
        var bmy = (orgBoundHeight/2 + height*scale/2) ;
        //console.log("orgBoundHeight", orgBoundHeight ,"height", height, "scale", scale);
       $('#under-map-center').css({'width': orgBoundWidth + "px" , 'transform': 'translate(' + Math.round( bmx )+'px,'+ Math.round(bmy) + 'px) ' + 'scale(' + (1.0) + ')'});


       //////////////////////////////////
        // pencil at the bottom

        let scaledWidth = scale*width;
        console.log("w ", scaledWidth);
        console.log("this.orientationID", this.orientationID);
        console.log("this.printSizeID", this.printSizeID);
        var ppi = commonGlobals.getPPI(scaledWidth, this.printSizeID, this.orientationID);
        console.log("ppi", ppi);
        this.canvasPPI = ppi;

        this.$emit("onResizeContentToFit", this);

      },
      goto: function (pageID)
      {
        this.$router.push({ name: pageID, params: {}})
      },

      // called from the PreviewEditorPAge to lift the buttom to the next position
      setBottomButtonAnimationUpActive: function(active){
        this.bottomButtonAnimationUpActive = active;
        console.log("setBottomButtonAnimationUpActive", active);
      }
    },
    watch: {
      // on mobile /desktop switch
      $mq : function(newval)
      {
      //  console.log("$mq", this.$mq);
      }
      ,orientationID: function(newVal, oldVal)
      {
        this.resizeContentToFit();
      }
  },
    mounted: function(){

    },
    deactivated: function(){
      console.log("Editorbase deactivated");
      window.removeEventListener("resize", this.resizeContentToFit);

    },
    activated: function() {
      console.log("Editorbase activated");

      // hack
      this.$nextTick( ()=> {

        this.resizeContentToFit();
        window.addEventListener("resize", this.resizeContentToFit);

        // custom scroll bar test
        //The first argument are the elements to which the plugin shall be initialized
        //The second argument has to be at least a empty object or a object with your desired options
       // console.log("ovelayscrollbars", document.querySelectorAll(".sidenav-scrollcontent"));
       // OverlayScrollbars(document.querySelectorAll(".sidenav-scrollcontentholder"), {});

     //     this.fadeInMapOverlay();

       // this.fadeInSidenavOverlay();
      });

      let tabBarHeight = 56;
      //let windowHeight =  window.innerHeight;
      let windowHeight  =  this.$store.getters.innerHeight;

      let navBarHeight = 56;
      this.tabbarYPosition  = windowHeight - tabBarHeight - navBarHeight;

      // try hack to get the ios browser UI back to the default
      $('html').addClass('noscroll');
      setTimeout(()=>{
        $('html').removeClass('noscroll');
      },10);

    }
  }




</script>

<style>
  /*  animations used for the sidebar */
  @-webkit-keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  .fadeIn {
    animation: fadeIn 1s normal forwards;
    -webkit-animation-name: fadeIn;
    animation-name: fadeIn;
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }


  .fadeOut {
    animation: fadeOut 1s normal forwards;
  }

  @-webkit-keyframes fadeInUp {
    from {
      opacity: 0;
      -webkit-transform: translate3d(0, 10%, 0);
      transform: translate3d(0, 10%, 0);
    }

    to {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      -webkit-transform: translate3d(0, 10%, 0);
      transform: translate3d(0, 10%, 0);
    }

    to {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }

  .fadeInUp {
    animation: fadeInUp 1s normal forwards;
    -webkit-animation-name: fadeInUp;
    animation-name: fadeInUp;
  }



  @-webkit-keyframes bounce {
    from,
    20%,
    53%,
    80%,
    to {
      -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }

    40%,
    43% {
      -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
      animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
      -webkit-transform: translate3d(0, -20px, 0);
      transform: translate3d(0, -20px, 0);
    }

    70% {
      -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
      animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
      -webkit-transform: translate3d(0, -10px, 0);
      transform: translate3d(0, -10px, 0);
    }

    90% {
      -webkit-transform: translate3d(0, -3px, 0);
      transform: translate3d(0, -3px, 0);
    }
  }

  @keyframes bounce {
    from,
    20%,
    53%,
    80%,
    to {
      -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }

    40%,
    43% {
      -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
      animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
      -webkit-transform: translate3d(0, -30px, 0);
      transform: translate3d(0, -30px, 0);
    }

    70% {
      -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
      animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
      -webkit-transform: translate3d(0, -15px, 0);
      transform: translate3d(0, -15px, 0);
    }

    90% {
      -webkit-transform: translate3d(0, -4px, 0);
      transform: translate3d(0, -4px, 0);
    }
  }

  .bounce {
    -webkit-animation-name: bounce;
    animation-name: bounce;
    animation: bounce 1s normal forwards;
    -webkit-transform-origin: center bottom;
    transform-origin: center bottom;
  }


</style>
<style scoped>


  .linkdivider{
    color: #888888;
    display:inline-block;
    margin-left: 5px;
    margin-right: 5px;
  }

  .footer-links{
    display:inline-block;
    cursor: pointer;
  }


  .editorBase-sidenavOverlay{
    transition: opacity 0.5s ease-in-out;
    -moz-transition: opacity 0.5s ease-in-out;
    -webkit-transition: opacity 0.5s ease-in-out;
    z-index:100;
    background-color: #000000;
    height: 100%;
    width: 300px;
    top:0;
    left:0;
    opacity: 0;
    position: absolute;
  }

  .editorBase-mapAreaDarkOverlay{
    transition: opacity 0.5s ease-in-out;
    -moz-transition: opacity 0.5s ease-in-out;
    -webkit-transition: opacity 0.5s ease-in-out;
    z-index:1;
    background-color: #000000;
    height: 100%;
    width: 100%;
    top:0;
    left:0;
    opacity: 0;
    position: fixed;
  }

  .HolyGrail {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    overflow: hidden;
    height: 100%;

  }

  .HolyGrail-body {
    display: flex;
    flex: 1;

  }

  .HolyGrail-content {
    flex: 1;
    background: rgb(237,236,236);
    background: linear-gradient(200deg, rgba(237,236,236,1) 0%, rgba(233,230,228,1) 38%, rgba(222,220,218,1) 100%);
    display: flex;
    position: relative;
  }

  .HolyGrail-nav-container {
   /* position: fixed;
    height: calc(100% - 0px);
   */
    left: 0px;
    top: 0px;

   /* overflow-x: hidden; */
    position: 100px;
    transition: 0.5s;
    z-index: 2;
  }

  .HolyGrail-nav {
    /* 12em is the width of the columns */
    display: flex;
    height: 100%;
    width: 300px;
    /*flex: 0 0 300px;*/
    flex-direction: column;
    order: 3;
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
    margin-right: 0px;
    position: relative;
  }

  .sidenav-base{
    position: absolute;
    height: 100%;
  }

  .sidenavtop {
    position: absolute;
    top: 0px;
    left: 300px;
    display: flex;
    z-index: 1;
  }

  .sidenav-scrollcontentholder{
    padding-top: 0px;
    padding-bottom: 65px; /* should match the fix bottum height*/
    height: 100%;
    position: relative;
    z-index: 2;

  }

  .sidenav-scrollcontentinner{
    width: 300px;

  }

  .sidenav-scrollcontent{
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    -ms-overflow-style: -ms-autohiding-scrollbar;
    width: 100%;  /* so that the scrollbar fits inside */
  }

  .sidenav-bottom {

    width: 300px;
    position:fixed;
    background-color: #eeeeee;
    /*border-top: 1px solid lightgrey;*/
    padding: 0px;
    z-index: 100;
    transition-property: top;
    -webkit-transition-property: top; /* Safari */
    transition-duration: 1s;
    -webkit-transition-duration: 1s; /* Safari */

    /* y position dfined by computed prop sidenavBottomStyle */
  }


  .holder {
    /*overflow: hidden;*/
    flex: 0 1 100%;
    display:flex;
    position: absolute;
    height: calc(100% - 130px);
    top: 65px;
    bottom:65px;
    left: 0px;
    right:0;
    padding: 0px;
    overflow: hidden;

  }


  .centered-content-top-row{
    position: relative;
    top: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    left:00px;
    width: calc(100% );
    height: 65px;
    padding-right: 15px;
    padding-left: 15px;
  }

  .centered-content-top-row-mobile{
    left:0px !important;
    width: 100% !important;
  }

  .content-bottom-row{
    display: flex;
    width: calc(100% );
    margin-top: 0px; /* calculdated  on mounted */


  }

  .centered-content-bottom-row{
    z-index: 2;   /* put it above the leaf  */
    position: relative;
    top: calc(100% - 65px);
    display: flex;
    align-items: center;
    justify-content: center;
    left:50%;
    height: 65px;
    transform: translateX(-50%);
  }

  .under-map-center{
    display: flex;
  }

  .holder-desktop{
    /* left: 300px; */
  }

  .design-holder-padding{
    overflow: hidden;
    width: 100%;
    height: calc(100% + 60px);  /* the px offset should be double the amount on the desgin holder css translate x amount */
    position: relative;
  }

  .design-holder{
    position: absolute;
    left: 50%;
    transform-origin: 50% 50% 0px;
    top: 50%;
    transform: translate(-50%,-50%) scale(0.4);
  }



  .menu-button{
    background-color:#666666;
    color: white;
    height: 50px;
    width: 30px;
    left: 0px;
    top: 20px;
    border-radius: 0px;
    position: absolute;
    font-size: 2em;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    box-shadow: 0px 0px 13px 1px rgba(0, 0, 0, 0.25);

  }


  /* ----------------------------------------------------------------------------  */
  /* LOADER */

  .loading-overlay{
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0.2;
    background-color: #222222;
    z-index: 3;
  }
  .loader-container{
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 4;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .aloader {
    border: 5px solid #636363; /* Light grey */
    border-top: 5px solid #ecf0f7; /* Blue */
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1.5s linear infinite;

  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

</style>
