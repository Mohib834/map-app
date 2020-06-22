<template>
  <div>
    <div class="text-xs-center">
      <v-progress-circular
        v-if="!mapWidgetLoaded"
        :size="40"
        :width="3"
        color="secondary"
        indeterminate
      ></v-progress-circular>
    </div>

    <MapWidget
               ref="mapWidget" id="scaledCanvas"
               style="transform: scale(1.0)"
               class="map-canvas"
               :useDemoWidgetCSS ="true"
               :variation="variation"
               :segmentColours="segmentColours"
               :waterColour="waterColour"
               :roadColour="roadColour"
               :border="border"
               :showFrame="showFrame"

               :segmentShowPercentage="segmentShowPercentage"
                :roadAlpha="roadAlpha"
               :waterAlpha="waterAlpha"
               :segmentAlpha="segmentAlpha"
               :bgColour="bgColour"
               :showBottomFade="showBottomFade"
               :bottomFadeHeight="bottomFadeHeight"
               v-on:resize="onMapWidgetResize"
               v-on:init="onMapWidgetInit"
               v-on:mapLoaded="onMapWidgetLoaded"

    ></MapWidget>
  </div>
</template>

<script>
  import MapWidget from '../common/MapWidget.vue'

  export default {
    components:{
      MapWidget
    },
    props: {
    },
    computed: {
    },
    data () {
      return {
        currentThemeIndex: 0,
        themeIDs : ['multi grey', 'untitled 1', 'sea sunset', 'salmon at sea', 'lavender forest'],

        mapWidgetLoaded : false,

        // map props
        variation: 0,
        border: false,
        showFrame: false,
        waterColour: [0,0,0],
        roadColour: [50,50,50],
        segmentColours: [{"colour":[233,221,195],"weight":13},{"colour":[234,212,173],"weight":35},{"colour":[224,202,164],"weight":10},{"colour":[201,184,155],"weight":6},{"colour":[190,173,145],"weight":12},{"colour":[179,163,137],"weight":14},{"colour":[106,191,172],"weight":6},{"colour":[80,173,152],"weight":15},{"colour":[48,139,130],"weight":13},{"colour":[39,168,163],"weight":20},{"colour":[43,156,150],"weight":16},{"colour":[54,198,193],"weight":7},{"colour":[19,106,113],"weight":15},{"colour":[0,72,84],"weight":8},{"colour":[0,36,60],"weight":14},{"colour":[1,24,42],"weight":12},{"colour":[2,68,90],"weight":12}],
        segmentShowPercentage : 0.0,
        roadAlpha: 0.0,
        waterAlpha: 0.0,
        segmentAlpha: 0.0,
        showBottomFade : true,
        bottomFadeHeight: 200,
        bgColour: '#f9f9f9'
      }
    },
    methods:{
      onMapWidgetResize : function(){

      },
      onMapWidgetInit: function(){
        // loadBasemap
        //"LkKd0_Wzv"
        //var id = "J8l9LOJp-";
        //  var id = "2os5sxMZC";
        //var id = "3Ksc4MB27";
        var id = "Yw9qV-P8W";
        //var id = "5Ho_k4xPF";

        this.$refs.mapWidget.loadBasemap(id);
      },
      nextTheme: function()
      {
        /*
        this.themeID = themeID;
        console.log("changeTheme themeID: ", themeID);

        var theme = this.$store.getters.getThemeByID(themeID);
*/
        var themes = this.$store.state.demoThemes;
        var nThemes = themes.length;
        var theme = themes[this.currentThemeIndex]; // this.themeIDs[this.currentThemeIndex];
        this.currentThemeIndex = (this.currentThemeIndex + 1) % nThemes;

        console.log("theme: ", theme);

        this.waterColour = theme.water;
        this.roadColour = theme.road;
        this.segmentColours = theme.segments;
        //console.log(this.segmentColours);
        //
      },
      onMapWidgetLoaded: function(){
        this.mapWidgetLoaded = true;
        // loadBasemap
        this.$refs.mapWidget.manualUpdate();

/*
        var myVar = setInterval(()=>{
          console.log("change theme");
          this.variation ++;
          this.changeTheme(++this.themeID);
        }, 2000);
*/
        this.onAnimationComplete();
      },
      onAnimationComplete : function(){
        this.doAnimation();
      },
      clearIntervals : function(){
        window.clearInterval(_animateInInterval);
        _animateInInterval = null;
        window.clearInterval(_holdInterval);
        _holdInterval = null;
      },
      doAnimation : function(){

        this.clearIntervals();
        this.variation ++;

        // loop through the themes

         this.nextTheme();

        //this.waterColour = [255,255,255];
        //this.roadColour = [255,255,255];

        this.segmentShowPercentage  = 0;
        this.segmentAlpha =this.segmentShowPercentage;
        this.roadAlpha = this.segmentShowPercentage;
        this.waterAlpha = this.segmentShowPercentage;

        this.$refs.mapWidget.manualUpdate();
        _animateInInterval = setInterval(()=>{
          console.log("change theme");
          //this.variation ++;
          //this.changeTheme(++this.themeID);
          this.segmentShowPercentage += 0.05;
          this.roadAlpha = Math.max(0.0, 2*this.segmentShowPercentage - 0.5);
          this.waterAlpha = this.segmentShowPercentage;
            this.segmentAlpha = Math.min(1.0, this.segmentShowPercentage*2.0);

          if (this.segmentShowPercentage >= 1) {
            window.clearInterval(_animateInInterval);


            //this.waterColour = theme.water;
            //this.roadColour = theme.road;

            _holdInterval = setTimeout(()=>{
              // hold time
              _holdInterval = null;
              this.nextTheme();

              this.onAnimationComplete();
            }, 2500);
          }

        }, 250);
      }
    },
    watch:{
    }
    ,
    mounted(){
      this.$refs.mapWidget.init();

    },
    beforeDestroy()
    {
      this.clearIntervals();
    }
  }

  var _theme;
  var _holdInterval = null;
  var _animateInInterval = null;
</script>


<style scoped>
</style>
