
<template>
  <v-dialog
    v-model="modalShowing"
    persistent
    width="275"
    no-click-animation
    content-class="dialogcustomscroll"
  >
    <v-card
      style="background: #292c2f"
      dark
    >
      <v-card-text style="padding-top: 10px; "  >
        <v-layout row fill-height align-center style="margin: 0px; padding: 0px">
          <v-spacer></v-spacer>

          <div class="headline font-weight-normal text-xs-center" :style="{'margin-left': (showCloseButton) ? '30px' : 0}" >
            Preparing Map
          <!--
          <template  v-if="isActiveJobComplete ">
            Your map is ready!
          </template>
          -->

        </div>
        <v-spacer></v-spacer>

        <v-btn v-if="showCloseButton" flat icon light @click="cancelProcessing()" style="margin: 0px; margin-right: -5px" ><v-icon>mdi-close</v-icon></v-btn>

        </v-layout>
      </v-card-text>

      <v-card-text style="margin-top: 5px; " >
        <!--
        <v-progress-linear
          v-if=" (!isActiveJobComplete && !isActiveJobError ) "
          indeterminate
          color="primary"
          height="2"
        ></v-progress-linear>
        -->

        <template v-if="isActiveJobError">
          <div class="text-xs-center">
            <v-icon x-large>mdi-alert-circle-outline</v-icon>

          </div>

          <div class="text-xs-center">
            Oops, something went wrong, please try again later.
          </div>
        </template>


        <template >
          <div  class="text-xs-center">
            <div style="margin-bottom: 20px; font-size: 16px">
              Hold tight while we create your map preview
            </div>
            <div style="margin-bottom: 20px; font-style: italic">
              Estimated time: {{Math.round(estimatedWaitTimeToShow/1000)}} seconds
            </div>
            <div v-if="(queuePosition != null) && (queuePosition != 0)" style="margin-bottom: 20px; font-style: italic">
              Queue Number : {{ queuePosition}}
            </div>

          </div>
        </template >
        <div  class="text-xs-center">
          <ProcessingSpinner
                  ref="progressSpinner"
                  :progress="curProcessPercentage"
          >
            <div v-if="waitingForFirstProgressUpdate">
            </div>
            <div v-else-if="processPercentage < 99" style="font-size: 24px">
              {{ Math.floor(curProcessPercentage)  }}%
            </div>
            <div v-else="">
              <ProcessingCheckmarkAnimated></ProcessingCheckmarkAnimated>

            </div>

          </ProcessingSpinner>
        </div>
        <!--
        <div  class="text-xs-center">
          <v-progress-circular
            :rotate="0"
            :size="95"
            :width="6"
            :value="curProcessPercentage"
            :color="(waitingForFirstProgressUpdate) ? 'secondary' : 'hero'"
            :indeterminate="waitingForFirstProgressUpdate"
            style="stroke-linecap:round "
          >

            <div v-if="waitingForFirstProgressUpdate">
            </div>
            <div v-else-if="processPercentage < 99" style="font-size: 20px">
              {{ Math.floor(curProcessPercentage)  }}%
            </div>
            <div v-else="">
              <ProcessingCheckmarkAnimated></ProcessingCheckmarkAnimated>

            </div>

          </v-progress-circular>
        </div>
        -->

      </v-card-text>

      <div style="background-color: #fff; padding-top: 10px; padding-bottom: 0px" v-if="showThemeSection" >
        <div  class="text-xs-center" style="padding: 10px; color: black">
          Explore some themes while you wait..
        </div>
        <v-layout row wrap align-center justify-center style="margin-top: -10px">
          <v-flex xs12 class="text-xs-center">

            <div style="margin-left: 10px">
            <ThemeSelectorGrid :tooltips="isDesktop"  slot="activator" ref="themeSelectorGrid" style="margin-top: 0px; margin-bottom: 0px" :themeID="themeID" @input="changeTheme($event, true)" :themePageRows="3" :themePageCols="5" :showNavigation="false" ></ThemeSelectorGrid>
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
                    :border="false"
                    :showFrame="false"
                    :segmentShowPercentage="1.0"
                    :roadAlpha="1.0"
                    :waterAlpha="1.0"
                    :segmentAlpha="1.0"
                    :bgColour="'#f9f9f9'"
                    :showBottomFade="false"
                    :bottomFadeHeight="0.0"
                    v-on:resize="onMapWidgetResize"
                    v-on:init="onMapWidgetInit"
                    v-on:mapLoaded="onMapWidgetLoaded"
            ></MapWidget>
            <!--
            <div style="padding: 10px">
              <label style=" color: #666666;  font-size: 1.2em; font-weight: normal">{{ currentThemeLabel }} </label>
            </div>
            -->
          </v-flex>
        </v-layout>
      </div>
      <v-card-text v-else="" style="margin-top: 0px">
      </v-card-text>
      <!--
      <v-divider v-if="isActiveJobComplete || isActiveJobError"></v-divider>

      <v-card-actions >
        <template v-if="isActiveJobComplete">
          <v-spacer></v-spacer>
          <v-btn color="primary" style="margin: 0px ; text-transform: none"  @click="onJobComplete">View</v-btn>
        </template >
        <template v-if="isActiveJobError">
          <v-spacer></v-spacer>
          <v-btn color="primary" style="margin: 0px ; text-transform: none"  @click="onErrorClose">Close</v-btn>
        </template >
      </v-card-actions>
-->
    </v-card>
  </v-dialog>
</template>

<script>
  //https://github.com/Hkh12/vuetify-image/blob/master/src/components/VImage.vue
  import commonGlobals from '../../../../common/commonGlobals'
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'
  import {bus} from "./../../main"
  import { validationMixin } from 'vuelidate'
  import { required, maxLength, email } from 'vuelidate/lib/validators'
  import ThemeSelectorGrid from '../editor/ThemeSelectorGrid.vue'
  import MapWidget from '../common/MapWidget.vue'
  import ProcessingCheckmarkAnimated from '../common/ProcessingCheckmarkAnimated.vue'
  import ProcessingSpinner from './ProcessingSpinner.vue'

  var timerID = null;

  export default {
    name: 'processingModal',
    components: {
      ProcessingSpinner,
      ThemeSelectorGrid,
      ProcessingCheckmarkAnimated,
      MapWidget
    },
    validations() {
      return {
        email: {required, email}
      }
    },
    data(){
      return {
        waterColour: [0,0,0],
        roadColour: [50,50,50],
        segmentColours: [{"colour":[233,221,195],"weight":13},{"colour":[234,212,173],"weight":35},{"colour":[224,202,164],"weight":10},{"colour":[201,184,155],"weight":6},{"colour":[190,173,145],"weight":12},{"colour":[179,163,137],"weight":14},{"colour":[106,191,172],"weight":6},{"colour":[80,173,152],"weight":15},{"colour":[48,139,130],"weight":13},{"colour":[39,168,163],"weight":20},{"colour":[43,156,150],"weight":16},{"colour":[54,198,193],"weight":7},{"colour":[19,106,113],"weight":15},{"colour":[0,72,84],"weight":8},{"colour":[0,36,60],"weight":14},{"colour":[1,24,42],"weight":12},{"colour":[2,68,90],"weight":12}],
        variation: 0,

        themeID: null,

        estimatedDurationToFillRatio: 0,
        startRatio: 0,
        endRatio : 1,
        startTime: null,
        nQueueSegments: null,
        averageProcessDuration : null,
        nWorkers : null,
        queueStartPosition: null,
        estimatedWaitTimeToShow: null,

        curProcessPercentage: 0,
        emailRequestLoading: true,
        emailAdded: false,
        email: "",
        modalShowing : false,
        showCloseButton: false,
        waitingForFirstProgressUpdate: true,
        processingUpdateTimerStarted: false,
        queueRatio : 0,
        queuePosition: null,
        startProgressData:{
          progress: 0,
          queuePosition: 0
        },
        processPercentage: 0
      }
    },
    mounted(){



      bus.$on('showProcessingModal', (params)=> {

        //this.startUpdateInterval();
        this.waitingForFirstProgressUpdate = true;
        this.processingUpdateTimerStarted = false;
        console.log("showProcessingModal", this.waitingForFirstProgressUpdate );
        this.curProcessPercentage = 0;
        this.processPercentage = 0;

       //this.showCloseButton = (params) ? !params.hideCloseButton: true;
        this.showCloseButton = false;
        this.modalShowing = true;


        // load themes
        //this.$store.dispatch("retrieveThemesFromServer").then(()=>{
        //});

        // move scrollbar to the top
        this.$nextTick(() =>{
          let elem = $(".dialogcustomscroll");
          if(elem) elem.scrollTop(0);
          console.log("showProcessingModal dialogcustomscroll", elem);

        });

        if( this.$refs.mapWidget) this.$refs.mapWidget.init();

      });

      bus.$on("processingStarted", (data)=> {
        console.log("processingStarted here" , data);
        this.queuePosition = data.queuePosition;
        let queuePosition = data.queuePosition;
        let nWorkers = data.nWorkers;
        let averageProcessDuration = data.averageProcessDuration;
        // calculate the estimated queue time
        this.averageProcessDuration = averageProcessDuration;
        this.nWorkers = nWorkers;

        this.waitingForFirstProgressUpdate = false;
        this.queueStartPosition = queuePosition;
        this.startTime = Date.now();

        if(queuePosition > 0) {
          // job is queued so setup progress bar to fill up based on an estimated queue time
          //let estimatedQueueTime = estimatedQueueTime;
          this.nQueueSegments = Math.ceil(queuePosition/nWorkers);
          this.estimatedDurationToFillRatio = averageProcessDuration;
          this.startRatio = 0; // start at this beginning of the progress bar
          this.endRatio = 1.0 / (this.nQueueSegments + 1) ;
          //        estimatedQueueTime/ (estimatedQueueTime + averageProcessDuration ); // leave a bit of a gap in the ar for the actual job processing

          this.estimatedWaitTimeToShow = this.nQueueSegments*averageProcessDuration + averageProcessDuration;
        }
        else{
          // no queue, so setup progress bar to the normal progress
          this.estimatedDurationToFillRatio = averageProcessDuration;
          this.startRatio = 0;
          this.endRatio = 1;
          this.nQueueSegments = 0;

          this.estimatedWaitTimeToShow = averageProcessDuration;
        }

        console.log("ratios update: ", this.startRatio, this.endRatio, this.estimatedDurationToFillRatio);

      });

      bus.$on("processingProgress", (data)=> {


        console.log("processingProgress here" , data);
        if(this.waitingForFirstProgressUpdate){
          console.log("waitingForFirstProgressUpdate stop here" );
          return;
        }
        data.progressData = (data.progressData != null) ? data.progressData : {"progress": 0, "nextProgress": 0} ;
        data.progressData.progress = (data.progressData.progress != null) ? data.progressData.progress : 0;
        data.progressData.nextProgress = (data.progressData.nextProgress != null) ? data.progressData.nextProgress : data.progressData.progress;
        data.queuePosition = (data.queuePosition != null)? data.queuePosition : 0;
        this.queuePosition =  data.queuePosition;

        console.log("this.waitingForFirstProgressUpdate ", this.waitingForFirstProgressUpdate );

        if(this.queuePosition  > 0 ){
          // basemap is still queued
          // todo test show the queue number
          // todo update accordingly?
          if(this.queuePosition % this.nWorkers == 0) {
            //let estimatedQueueTime = this.queuePosition * this.averageProcessDuration / this.nWorkers;
            //
            let queueSegmentsLeft = this.queuePosition/ this.nWorkers;
            this.startRatio = this.endRatio;
            //this.startRatio = (this.nQueueSegments - queueSegmentsLeft) / (this.nQueueSegments  + 1);
            this.endRatio = (this.nQueueSegments - queueSegmentsLeft + 1) / (this.nQueueSegments  + 1);

            //this.nQueueSegments = Math.ceil(queuePosition/nWorkers);

            //this.startRatio = this.endRatio;
            //this.endRatio = this.startRatio  +
            this.startTime = Date.now();
            this.estimatedDurationToFillRatio = this.averageProcessDuration;

            this.estimatedWaitTimeToShow = queueSegmentsLeft*this.averageProcessDuration + this.averageProcessDuration;
          }
        }
        else{

          {

            this.startTime = Date.now();
            this.startRatio = (this.nQueueSegments + (data.progressData.progress) ) / (this.nQueueSegments + 1 );

            let processingSegmentRatio = data.progressData.nextProgress - data.progressData.progress;
            console.log(" data.progressData.progress",  data.progressData.progress);
            console.log(" data.progressData.nextProgress",  data.progressData.nextProgress);
            console.log("processingSegmentRatio", processingSegmentRatio);
            this.endRatio =  this.startRatio + (1.0 - this.startRatio ) * processingSegmentRatio;

            this.estimatedDurationToFillRatio = (processingSegmentRatio)* this.averageProcessDuration;
          }
          //this.startTime = Date.now();
          //this.startRatio = data.progressData.progress * 100;
          //this.endRatio = 1.0;

        }

        console.log("ratios update: ", this.startRatio, this.endRatio, this.estimatedDurationToFillRatio);



        //this.processPercentage = this.queueRatio 100.0*jobPerc

        /*
        // calculate position
        let jobPerc = 1.0/ (this.startProgressData.queuePosition + 1);
        console.log("this.startProgressData.queuePosition", this.startProgressData.queuePosition );
        console.log("data.queuePosition", data.queuePosition );

        this.processPercentage  = 100.0*jobPerc * ( this.startProgressData.queuePosition -  data.queuePosition)+  jobPerc * data.progress;
        console.log("this.processPercentage",this.processPercentage );
        */


      });

      bus.$on('hideProcessingModal', ()=> {
        this.modalShowing = false;
      });

      bus.$on("processingCompleted", ()=>{
        console.log("processingCompleted ");


        if(this.modalShowing) {
          // go straight to the map editor page
         this.onJobComplete();
        }
        else{
         console.log("processingCompleted here");
         // this.modalShowing = true;
         // this.showCloseButton = true;
        }
      });

      // test
      //bus.$emit('showProcessingModal');


      // start loading themes
      if(this.$store.getters.isThemesLoaded){
        this.onThemesLoaded();
      }
      else {
        this.$store.dispatch("retrieveThemesFromServer").then(() => {
        });
      }

    },
    props: {

    },
    methods:{
      stopUpdateInterval: function(){
        if(timerID !=null) clearInterval(timerID);
        timerID = null;
      },
      startUpdateInterval: function(){
        this.stopUpdateInterval();
        timerID = setInterval(() => {
          //var target = this.activeJobQueueProcessPercentage;
          let deltaTime = Date.now() - this.startTime;
          let timeRatio = (this.estimatedDurationToFillRatio > 0) ? deltaTime/this.estimatedDurationToFillRatio : deltaTime;
          timeRatio = Math.min(1, timeRatio);
          this.processPercentage = (this.startRatio + timeRatio*(this.endRatio - this.startRatio))*100;
          //console.log("timeRatio", timeRatio , this.startRatio, this.endRatio);
          // console.log("processPercentage",this.processPercentage);

          var target = this.processPercentage;
          this.curProcessPercentage += (target - this.curProcessPercentage) *0.1 ;
          // console.log("curProcessPercentage",this.curProcessPercentage);

          if(target >= 100)
          {
            // jump to complete
            this.curProcessPercentage = target;
          }
        }, 100);
      },
      changeTheme: function(newThemeID, clicked=false){
        var theme = this.$store.getters.getThemeByID(newThemeID);
        console.log("theme", theme);
        if(theme) {
          this.themeID = newThemeID;
          this.segmentColours = theme.segments;
          this.waterColour = theme.water;
          this.roadColour = theme.road;

          this.$refs.progressSpinner.setColoursFromTheme(theme);
        }

        //  autoscroll to the bottom (helps for mobile)
        if(clicked) {
          let elem = $(".dialogcustomscroll");
          let bottomY = elem[0].scrollHeight - elem.height();
          elem.animate({scrollTop: bottomY + "px"}, 500);
        }
      },
      //
      gotoExplorePage : function(){
        this.$router.push({ name: 'explore', params: {}})
      },
      saveEmailToNotify : function(){
        // todo - check
        this.emailRequestLoading = true;
        this.$store.dispatch("saveBasemapNotifyEmail",{
          email: this.email,
          basemapID: this.activeJobBasemapID
        }).then((res)=>{
          this.emailRequestLoading = false;
          this.emailAdded = true;
        }).catch((e)=>{
          this.emailRequestLoading = false;
        });

      },
      onJobComplete: function(){
        console.log("processing complete, can now load preview map: " + this.activeJobBasemapID);
        // wait one second for the bar to complete
        var _this = this;
        var delay = setTimeout(()=>{
          this.modalShowing = false;
          let mapID = this.$store.getters.previewMap_mapID;
          console.log("onJobComplete mapID: ", mapID);

          let editExisting = mapID != null;
          console.log("editExisting: ",editExisting);

          if(editExisting) {
            // go to customisiation page to update an existing map
            this.$router.push({ name: 'editMapWithBasemap', params: {route_mapID: mapID , route_basemapID: _this.activeJobBasemapID} })
          }
          else{
            // go to customisiation page to add a new map
            _this.$router.push({name: 'createMap', params: {route_basemapID: _this.activeJobBasemapID}})
          }
        },500);// hold for a bit to let tick logo complete

      },
      onErrorClose : function(){
        this.$router.push({ name: 'home', params: { }})
        this.modalShowing = false;
      },
      cancelProcessing : function(){
        this.$store.dispatch('cancelPreview').then(()=>{
          this.modalShowing = false;
        });
        bus.$emit('onCancelPreviewProcessing');
      },

      onMapWidgetResize : function(){

      },
      onMapWidgetInit: function(){

        console.log("onMapWidgetInit");
        this.$refs.mapWidget.loadSampleBasemap();

      },

      onMapWidgetLoaded: function(){
        console.log("onMapWidgetLoaded");

        // this.mapWidgetLoaded = true;
        this.$refs.mapWidget.manualUpdate();

        //check if themes are loaded
        this.changeTheme(this.themeID);
      },

      onThemesLoaded: function(){
        this.themeID = this.$store.getters.getFirstThemeID;

      }

    },
    computed: {
      ...mapGetters([
        'isThemesLoaded',
        'printSizeOptions',
        'orientationOptions',
        'activeJobEstimatedQueueDuration',
        'isActiveJobLoaded',
        'isActiveJobWaitingForResponse', 'isActiveJobProcessing', 'isActiveJobQueued', 'isActiveJobComplete', 'isActiveJobError', 'isActiveJobViewed', 'activeJobBasemapID', 'hasActiveJob',
        'activeJobQueueProcessPercentage', 'activeJobQueuePosition'
      ]),

      currentThemeLabel: function(){
        var name= this.themeID;
        if(name)
        {
          return  name.toLowerCase()
                  .split(' ')
                  .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                  .join(' ');
        }
        return "";
      },

      showThemeSection: function(){
        return true;
        //return this.isDesktop;
      },
      isDesktop: function(){
        return this.$mq == 'desktop';
      },
      isMobile: function(){
        return this.$mq == 'mobile';
      },
      errors_email: function(){
        const errors = [];
        if (!this.$v.email.$dirty) return errors;
        !this.$v.email && errors.push('Must be valid e-mail');
        !this.$v.email.required && errors.push('E-mail is required');
        return errors;
      },
      queueUpdateText : function(){
        let queueDuration = this.activeJobEstimatedQueueDuration;
        let queuePosition = this.activeJobQueuePosition;
        if(queuePosition === 0)
        {
          return "Estimated processing time is less than 30 seconds, hold tight!";
        }
        else if(queuePosition === 1)
        {
          return "You're at the front of the queue, nearly there! Estimated queue time is less than " + queueDuration + " s";
        }
        else if(queuePosition <= 4)
        {
            return "Queue position " + queuePosition + ", estimated time is " + queueDuration + "s";
        }
        else{
          // long queue time?
          return  "Things are busy here! "
            + "You are queue position " + queuePosition + "."
            + "Estimated queue time is " + queueDuration + "s"
        }
        //  Estimated queue time is: {{ activeJobEstimatedQueueDuration }}

      }
    },
    watch:{
      modalShowing: function(showing){
        if(showing){
          this.startUpdateInterval();
        }
        else{
          this.stopUpdateInterval();
        }
      },
      isThemesLoaded: function(loaded)
      {
        if(loaded)
        {
          this.onThemesLoaded();
        }
      },
      isActiveJobQueued: function(newVal)
      {
        console.log("watch isActiveJobQueued----------------------", newVal);
        if(newVal)
        {
   //       this.modalShowing = true;
        }
      },
      isActiveJobProcessing: function(newVal, oldVal)
      {
        console.log("watch isActiveJobProcessing----------------------", newVal);
        if(newVal )
        {
          //this.curProcessPercentage = 0;

     //     this.modalShowing = true;
        }
      },
      activeJobQueuePosition: function(val){
        console.log("(watch) processingModal activeJobQueuePosition updated" + val);

      }
    },



  }
</script>

<style scoped>
  /*
   spin
  */

  /deep/ .v-progress-circular >  svg {
    -webkit-animation:spin 2s linear infinite;
    -moz-animation:spin 2s linear infinite;
    animation:spin 2s linear infinite;
  }


</style>

<style>
  @-moz-keyframes spin { 100% { -moz-transform: rotate(360deg) !important; } }
  @-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg) !important; } }
  @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg) !important;} }

  .dialogcustomscroll::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  .dialogcustomscroll::-webkit-scrollbar {
    width: 7px;
  }
  .dialogcustomscroll:focus::-webkit-scrollbar,
  .dialogcustomscroll:hover::-webkit-scrollbar {
    width: 7px;
  }

  /* Handle */
  .dialogcustomscroll::-webkit-scrollbar-thumb {
    background: #999999;
    border-radius: 0px;
  }

  /* Handle on hover */
  .dialogcustomscroll::-webkit-scrollbar-thumb:hover {
    background: #999999;
  }
</style>
