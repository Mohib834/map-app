<template>

    <div class="HolyGrail">

        <!--
        <Navbar :siteLogoShowing="false" ></Navbar>
        -->
        <WaitOverlay v-if="assetsLoading || (!activeJobLoaded ) ">
        </WaitOverlay>


        <EditorBase ref="editorbase">
            <template slot="sidebar-main">

                <!-- todo add search here -->

                <PanelHeader  step=1 :text="(isEditMode) ? 'Choose Area' : 'Choose Area'" icon="mdi-earth">
                    <template slot="right">
                        <HelpButton @click.native="runTour" ></HelpButton>
                    </template>
                </PanelHeader>

                <div class="editpanel-open">
                    <!--
                      <label class="labelblock" >Search </label>
            -->


                    <!--
                        <div class="form-group has-feedback">
                          <input id="searchbox" type="text" placeholder="Philadelphia, PA" class="form-control">
                          <span id="searchicon" class="fa fa-search form-control-feedback" style="font-size: 24px; padding-top: 3px"></span>
                        </div>
              -->
                    <div style="height: 10px"></div>


                    <template v-if="assetsLoading">
                        <v-progress-linear :indeterminate="true" background-color="grey"
                                           color="grey lighten-3"></v-progress-linear>

                    </template>
                    <template v-show="!assetsLoading">  <!-- make this v-show so the address-input element is there when it loads to initilaise the places input field -->

                        <input ref="address-input"  type="search" id="address-input" placeholder="Search" v-model="searchString" />
                        <div id="zoomlevelHelp">
                            <label class="labelblock">Zoom Level <v-icon> </v-icon> </label>
                            <v-layout>
                                <v-flex>
                                    <v-btn depressed fab small color="primary"  @click="zoomOut()"  :light="zoom == minZoomLevel" :dark="zoom != minZoomLevel"  :disabled="zoom == minZoomLevel">
                                        <v-icon>mdi-minus</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex>
                                    <v-slider
                                            style="margin-left:10px; margin-right: 10px; margin-top: 10px"
                                            v-model="zoom"
                                            always-dirty
                                            min="11"
                                            max="15"
                                            width="50px"
                                            thumb-color="grey darken-2"
                                            track-color="grey lighten-2"
                                            color="grey darken-2"
                                    >
                                        <template
                                                slot="thumb-label"
                                                slot-scope="props"
                                        >
            <span>
              {{zoom }}
            </span>
                                        </template>
                                    </v-slider>
                                </v-flex>

                                <v-flex>

                                    <v-btn depressed fab small  color="primary" @click="zoomIn()"  :light="zoom == maxZoomLevel" :dark="zoom != maxZoomLevel" :disabled="zoom == maxZoomLevel">
                                        <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </div>
                        <!--
                          <OptionRow :options="zoomSizeOptions" v-model="zoom"> </OptionRow>
                        -->

                        <div id="printsizeHelp">
                            <label class="labelblock">Print Size </label>
                            <OptionRow :options="(metricUnits) ? printSizeOptionsMetric: printSizeOptionsImperial" v-model="printSizeID"> </OptionRow>
                            <v-switch color="primary"
                                      v-model="metricUnits"
                                      label="Metric Units"
                                      style="margin: 0px; margin-bottom: -20px"
                            ></v-switch>
                        </div>
                        <div id="orientationHelp">
                            <label class="labelblock" style="margin-top: 25px">Orientation</label>
                            <OptionRow slot="activator" :options="orientationOptions" v-model="orientationID"> </OptionRow>
                        </div>
                    </template>
                </div>



                <!--
                <button class="accordion">Custom Map Coordinates</button>
                <div class="editpanel">
                  <label class="labelblock">Longitude </label>
                  <input type="number" step="any" v-model.number="lng" @change="updateCenter" >
                  <label class="labelblock">Latitude </label>
                  <input type="number" step="any" min="-90" max="90" v-model.number="lat" @change="updateCenter"  >
                  <label class="labelblock">Zoom </label>
                  <input type="number" :min="minZoomLevel" :max="maxZoomLevel" step="1" v-model.number="zoom" @change="updateZoom"
                </div>
        -->

            </template>
            <template slot="sidebar-bottom">
                <div class="pulse" style="width: 100%">

                    <!-- changed this to custom loading state with clickable button  -->
                    <v-btn id="nextbuttonHelp" class="nextbutton primary title font-weight-light " block large dark @click="checkLoadingAndSendRequest()">
                        <template v-if="nextButtonDisabled" >

                            <v-progress-circular indeterminate color='white' :size="24"  :width="2" ></v-progress-circular>
                        </template>
                        <template v-else="" >
                            <div style="display: inline-block; margin-right: 20px; ">
                                <template v-if="isEditMode">
                                    Customize
                                    <v-icon>mdi-palette</v-icon>
                                </template>
                                <template v-else="">
                                    Customize
                                    <v-icon>mdi-palette</v-icon>
                                </template>

                            </div>
                            <div style="display: inline-block; ">{{$store.getters.priceForCurrentMapWithCurrencyString}}</div>
                            <!--
                            <v-icon  right>mdi-chevron-right</v-icon>
                            -->
                        </template>
                    </v-btn>


                </div>
            </template>
            <template slot="content" >


                <div id='map' class="map"  style="position: relative; " v-show="!assetsLoading"></div>

            </template>
            <template slot="content-map-controls" v-if="!assetsLoading">
                <!-- ZOOM CONTROLS -->
                <!--
                <div >
                  <div class="zoombtn top" v-on:click="zoomIn()"> + </div>
                  <div class="zoombtn-divider"></div>
                  <div class="zoombtn bottom" v-on:click="zoomOut()"> - </div>
                </div>
                -->
            </template>

            <template slot="content-bottom" >

                <v-layout column>

                    <MobileTabBar :tabData="tabData" v-model="activeTabIndex" :style="{'margin-top': tabbarYPosition + 'px'}">
                        <template slot="right">
                            <v-btn @click="checkLoadingAndSendRequest()" style="height: 100%; text-transform: none; margin: 0px; border-radius: 0px" class="primary">
                                <template v-if="nextButtonDisabled" >

                                    <v-progress-circular indeterminate color='white' :size="24"  :width="2" ></v-progress-circular>
                                </template>
                                <template v-else="" >
                                    <div style="display: inline-block; margin-right: 0px; ">
                                        <template v-if="isEditMode">
                                            seffesf
                                            <v-icon>mdi-palette</v-icon>
                                        </template>
                                        <template v-else="">
                                            ssef
                                            <v-icon>mdi-palette</v-icon>
                                        </template>

                                    </div>

                                </template>
                            </v-btn>
                        </template>
                    </MobileTabBar>


                    <v-tabs-items v-model="activeTabIndex" vertical>
                        <v-tab-item key="0">
                            <v-card flat id="tabcontent0">
                                <v-card-text>{{ text }}</v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item key="1">
                            <v-card flat id="tabcontent1">
                                <v-card-text>{{ text1 }}</v-card-text>
                            </v-card>
                        </v-tab-item>

                    </v-tabs-items>
                </v-layout>
            </template>

        </EditorBase>

        <!-- MOBILE BOTTOM TABS -->
        <template v-if="isMobile">
            <!--
            <BottomSheet v-model="mobileSheetOpen_Location" style="z-index: 0">
              <v-layout column>

                <input ref="address-input-mobile"  type="search" id="address-input-mobile" placeholder="Search" v-model="searchString" />
                <div id="zoomlevelHelpMobile">
                  <label class="labelblock">Zoom Level <v-icon> </v-icon> </label>
                  <v-layout>
                    <v-flex>
                      <v-btn depressed fab small color="primary"  @click="zoomOut()"  :light="zoom == minZoomLevel" :dark="zoom != minZoomLevel"  :disabled="zoom == minZoomLevel">
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>
                    </v-flex>
                    <v-flex>
                      <v-slider
                              style="margin-left:10px; margin-right: 10px; margin-top: 10px"
                              v-model="zoom"
                              always-dirty
                              min="11"
                              max="15"
                              width="50px"
                              thumb-color="grey darken-2"
                              track-color="grey lighten-2"
                              color="grey darken-2"
                      >
                        <template
                                slot="thumb-label"
                                slot-scope="props"
                        >
                  <span>
                    {{zoom }}
                  </span>
                        </template>
                      </v-slider>
                    </v-flex>

                    <v-flex>

                      <v-btn depressed fab small  color="primary" @click="zoomIn()"  :light="zoom == maxZoomLevel" :dark="zoom != maxZoomLevel" :disabled="zoom == maxZoomLevel">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </div>

              </v-layout>
            </BottomSheet>
            <BottomSheet v-model="mobileSheetOpen_Paper" style="z-index: 0">
              <v-layout column >
                <div id="printsizeHelpMobile">
                  <label class="labelblock">Print Size </label>
                  <OptionRow :options="(metricUnits) ? printSizeOptionsMetric: printSizeOptionsImperial" v-model="printSizeID"> </OptionRow>
                  <v-switch color="primary"
                            v-model="metricUnits"
                            label="Metric Units"
                            style="margin: 0px; margin-bottom: -20px"
                  ></v-switch>
                </div>
                <div id="orientationHelpMobile">
                  <label class="labelblock" style="margin-top: 25px">Orientation</label>
                  <OptionRow slot="activator" :options="orientationOptions" v-model="orientationID"> </OptionRow>
                </div>


              </v-layout>
            </BottomSheet>
      -->


        </template>

    </div>




</template>

<script>
  /////////////////////////
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'
  import OptionRow from '../../components/common/OptionRow.vue'
  import PanelHeader from '../../components/common/PanelHeader.vue'
  import HelpButton from '../../components/common/HelpButton.vue'
  import currentMapDataMixin from '../../mixins/currentMapDataMixin.js'
  import BottomSheet from "../../components/common/BottomSheet";
  import MobileTabBar from "../../components/common/MobileTabBar";

  import io from 'socket.io-client';
  import EditorBase from '../../components/common/EditorBase.vue'
  var commonGlobals = require('../../../../common/commonGlobals');
  import {bus} from "../../main"

  //import Bloodhound from 'bloodhound-js';
  var _basemapID;

  var _socket;

  export default {
    mixins: [currentMapDataMixin],
    components: {
      OptionRow,
      EditorBase,
      PanelHeader,
      HelpButton,
      BottomSheet,
      MobileTabBar
    },
    props: {
      editRoute_mapID: {
        type: [String,Number],
        default: null
      },
    },
    data () {
      return {
        tabbarYPosition : 500, /// updated from onresize
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequatsesefsefsekfbskjebfsese.',
        text1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore e elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercfsesef se fsnse nsm ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercfsesef se fsnse nsm ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercfsesef se fsnse ns ullamco laboris nisi ut aliquip ex ea commodo consequatsesefsefsekfbskjebfsese.',


        tabData:[
          {
            text: "Location",
            icon: "mdi-earth"
          },
          {
            text: "Paper",
            icon: "mdi-crop"
          }
        ],
        mobileSheetOpen_Location: false,
        mobileSheetOpen_Paper: false,
        activeTabIndex: -1,

        map: null,
        mapWidth: 0,
        mapHeight: 0,

        searchInputText: "",
        tourRunning: false,

        initDone : false,
        maxProgress : 100,
        progress: 0,
        markers: [],
        places: [],
        currentPlace: null,
        zoomSizeTicks: [1,2,3,4,5]
      }
    },
    methods:{
      showProcessingModal: function()
      {
        bus.$emit("showProcessingModal", {
          hideCloseButton:false
        });
        // close the tour pop ups if showing
        this.closeTour();
      },
      gotoMapEditorPage : function(basemapID)
      {
        this.$router.push({ name: 'edit', params: { basemapIDRoute: basemapID }});
      },
      resetActiveJobValues: function ()
      {
        this.$store.state.activeJob.basemapID = null;
        this.$store.state.activeJob.queuePosition = null;
        this.$store.state.activeJob.status = null;
        this.$store.state.activeJob.viewed = false;
      },
      checkLoadingAndSendRequest : function()
      {
        // open the processing pop-up if its still processing otherwise send the new request to the server
        if(this.nextButtonDisabled)
        {
          this.showProcessingModal();
        }
        else{
          this.sendRequestToMapServer();
        }
      },
      sendRequestToMapServer: function()
      {
        // todo - when the modal shows reset the activejob values
        //
        this.showProcessingModal();
        this.resetActiveJobValues();

        //todo- show waiting symbol on the next button
        //todo - if error 400 (preview server down?) , then show error message - Oops sorry, please try again later.
        //todo -

        // create the basemap
        this.$store.dispatch("createBasemapPreview").then( (response) => {
          console.log("returned from promise here response, ", response);
          let basemapAlreadyExists = response.exists;
          let basemapID = response.basemapID;
          console.log("basemapID:", basemapID);

          if(basemapAlreadyExists)
          {
            // restet
            //this.resetActiveJobValues();
            // basemap exists so go stragiht to the edtiorpage
            this.gotoMapEditorPage(basemapID);
          }
          else{
            // basemap doesnt exist so start listening to events and open pop-up
            _basemapID = basemapID;
            this.connectToProgressSocket(_basemapID);
          }
        });

        /*
        console.log("sendRequestToMapServer");
        var xhr = new XMLHttpRequest();
        var url = globals.PREVIEWMAP_SERVER_URL +"/preview";
        xhr.open("POST", url, true);
        var _this = this;
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
          console.log("xhr.status", xhr.status);

          if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            _previewID = json.previewID;
            console.log("previewID",_previewID );

            function onConnectionSuccess() {
              console.log("send initial request to listen recieve status updates for ID:", _previewID);
              _socket.emit('receiveStatus', _previewID);
            }
            _this.connectToProgressSocket(onConnectionSuccess);
          }
        };
        var data = JSON.stringify({
          lng: this.lng,
          lat: this.lat,
          zoom: this.zoom,
          printSizeID: this.printSizeID,
          orientationID: this.orientationID,
          width: mapWidth,
          height: _mapHeight,
          isRetina: true
        });
        xhr.send(data);
        */
      },
      onPrintSizeChange: function()
      {
        console.log("onPrintSizeChange " + this.printSizeID);

        var printSize = this.$store.getters.currentPrintSize;
        if(printSize == null) return;


        console.log("current printSize:", printSize);
        var hInches = printSize.height;
        var wInches = printSize.width;
        var ratio = hInches/wInches;
        var previewZoomScale  = 1;
        var previewH;

        var previewSize = commonGlobals.getPreviewMapSize(this.printSizeID, this.orientationID);
        this.mapWidth = previewSize.width;
        this.mapHeight = previewSize.height;

        /*
        // todo should match commoonglboals getPReviewMapSize
        if(this.printSizeID === commonGlobals.PAPERSIZE_18x24)
        {
          //24x18
          previewH = 1324 * previewZoomScale;
        }
        else if(this.printSizeID=== commonGlobals.PAPERSIZE_24x36)
        {
          previewH  = 2024 * previewZoomScale;
        }
        else if(this.printSizeID === commonGlobals.PAPERSIZE_16x20)
        {
          previewH = 768 * previewZoomScale;
        }
        else{
          previewH = 768 * previewZoomScale;
        }

        this.mapWidth = previewH/ratio;
        this.mapHeight = previewH;
        if(this.orientationID == 2)
        {
          var temp = this.mapHeight;
          this.mapHeight = this.mapWidth;
          this.mapWidth = temp;
        }*/


        $('#map').width(this.mapWidth);
        $('#map').height(this.mapHeight);
        if(this.map) this.map.resize();
        this.$refs.editorbase.resizeContentToFit();
      },
      updateZoom: function ()
      {
        if(this.map) this.map.setZoom(this.zoom);

        console.log("updateZoom",this.lng, this.lat);
      },
      updateCenter: function ()
      {
        console.log("updateCenter",this.lng, this.lat);
        if(this.map) this.map.setCenter(new mapboxgl.LngLat(this.lng, this.lat));

      },
      zoomIn : function(){

        this.zoom = Math.round( Math.min(this.zoom + 1, this.maxZoomLevel));
        if(this.map) this.map.zoomTo(this.zoom);
      },
      zoomOut: function(){
        this.zoom = Math.round(Math.max(this.zoom - 1, this.minZoomLevel));
        if(this.map) this.map.zoomTo(this.zoom);
      },
      onMapUpdate: function(){
        //console.log("onMapUpdate",this.lng, this.lat);

        var lnglat = this.map.getCenter();
        console.log("here: " , lnglat);
        this.lng = lnglat.lng;
        this.lat = lnglat.lat;
        this.zoom = this.map.getZoom();
        //
      },
      connectToProgressSocket: function(basemapID){
        console.log(' connecting to socket');

        // connect to the progress socket with basemapID via global socket
        // check if the socket is open (if not connect), then send listen message

        // watch the activeJob.progressPercentage -> update the progress bar
        // watch the activeJob.queuePosition ->
        // let isQueued = queuePosition > 0
        // let isProcessing = queuePosition == 0 &&  progressPercentage > 0
        // let isComplete = progressPertange = 1
        // if (isQueued) -> v-if show queuedUI ->
        // if (queuePosition > X)  -> show email UI
        // if (isProcessing) // processing -> show processing UI, this is the progress bar
        //  if(isComplete) // if complete then navigate to page

        this.$store.dispatch("initSocket").then(socket =>{
          console.log("socket connected callback");
          socket.emit('receiveStatus', basemapID); // request status events for the basemapID
          this.$store.state.activeJob.basemapID = basemapID;
        });


        /*
        _socket = io.connect(commonGlobals.MAP_SERVER_URL);
        var _this  = this;
        return new Promise( ( resolve, reject ) => {
          _socket.on("connect", function () {
            console.log("connected to socket");
            _socket.emit('receiveStatus', basemapID); // request status events for the basemapID
            resolve();
          });
          _socket.on("connect_failed", function () {
            console.log("failed connecting to socket");
            return reject();
          });
          _socket.on("disconnect", function () {
            console.log("discoonected from socket");
            return reject();
          });
          _socket.on('progress', function (data) {
            _this.onProgress(data);
          });
        });
        */

      },



      initMap: function(){
        if(!this.isCartLoaded) return;
        if(this.initDone || this.assetsLoading) return;
        this.initDone = true;


        if(this.isEditMode)
        {
          // edit existing map
          var map = this.$store.getters.getMapInCartByID(this.editRoute_mapID);
          if(map) {
            //console.log("this.editRoute_mapID", this.editRoute_mapID);
            this.$store.commit("setBasemapData", map.basemap);
            this.mapID = this.editRoute_mapID;
          }
          else{
            console.error("no map exists with id in cart", this.editRoute_mapID);
          }
        }
        else{
          // new creation
          this.mapID = null;
          // reset values?
        }

        /*
                mapboxgl.setRTLTextPlugin('/static/lib/map/mapbox-gl-rtl-text.js');
                var map = new mapboxgl.Map({
                  container: 'map',
                  style: '/static/lib/map/style.json',
                  hash: true
                });
                this.map.addControl(new mapboxgl.NavigationControl());
        */
        console.log(">>>> initMap", this.lng, this.lat, this.zoom);

        mapboxgl.accessToken = 'pk.eyJ1IjoiZGF2aWRoMDMiLCJhIjoiY2phZnduOTdxMThwNzJ3cXVyY2RubDhlMyJ9.Io4YkfT4pvr-740FppvYMg';
        if(this.map != null)
        {
          this.map.off('moveend',this.onMapUpdate);
          this.map = null;
        }

        this.map = new mapboxgl.Map({
          container: 'map',
          // style: 'mapbox://styles/davidh03/cjjcwa8je7f1u2sp8wopr1na2',
          style: 'https://maps.tilehosting.com/c/12915062-7dfa-4102-b526-fbd601d7472f/styles/userpreview/style.json?key=QrAJ6Qj4kLYkZ6l90BKB',
          center: [ this.lng, this.lat],
          zoom: this.zoom,
        });
        var _this = this;
        //https://www.mapbox.com/mapbox-gl-js/api/#this.map.event:moveend
        // _this.map.on('zoomend',this.onMapUpdate);
        this.map.on('moveend',this.onMapUpdate);

        // restore the input field to the saved value

        this.map.scrollZoom.disable();


        this.onPrintSizeChange();


        //// run tour on start
        this.runTourOnFirstVisit();


      },
      switchMetricImperialEquivalent: function()
      {
        if(this.metricUnits == true)
        {
          if(this.printSizeID == commonGlobals.PAPERSIZE_18x24){
            this.printSizeID = commonGlobals.PAPERSIZE_20x28;
          }
        }
        else{
          if(this.printSizeID == commonGlobals.PAPERSIZE_20x28){
            this.printSizeID = commonGlobals.PAPERSIZE_18x24;
          }
        }
      },
      fadeOutMapOverlay: function()
      {
        if(this.$refs.editorbase) this.$refs.editorbase.fadeOutMapOverlay();
      },
      fadeInMapOverlay: function()
      {
        if(this.$refs.editorbase) this.$refs.editorbase.fadeInMapOverlay();
      },
      fadeOutSidenavOverlay: function()
      {
        if(this.$refs.editorbase) this.$refs.editorbase.fadeOutSidenavOverlay();
      },
      fadeInSidenavOverlay: function()
      {
        if(this.$refs.editorbase) this.$refs.editorbase.fadeInSidenavOverlay();
      },
      scrollSideMenuToShowBound : function(minY, maxY){
        this.$refs.editorbase.scrollSideMenuToShowBound(minY,maxY);
      },
      handleNextTourStep : function(stepIndex){
        console.log("handleNextTourStep", stepIndex);

        var steps = $.ptJs('info').steps;
        console.log("steps", steps);
        if(stepIndex >= steps.length ) return;

        var stepID = steps[stepIndex][0].id;
        console.log("stepID", stepID);
        if(stepID == "address-input" )
        {
          this.scrollSideMenuToShowBound(0, 0);
          this.fadeInMapOverlay();
        }
        else if(stepID == "zoomlevelHelp" )
        {
          this.scrollSideMenuToShowBound(100,250);
          this.fadeInMapOverlay();
        }
        else if(stepID == "printsizeHelp" )
        {
          this.scrollSideMenuToShowBound(250,380);
          this.fadeInMapOverlay();
          this.fadeOutSidenavOverlay();

        }
        else if(stepID == "orientationHelp" )
        {
          this.scrollSideMenuToShowBound(380,450);
          this.fadeInMapOverlay();
          this.fadeOutSidenavOverlay();

        }
        else if(stepID == "design-holder" )
        {
          this.fadeOutMapOverlay();
          this.fadeInSidenavOverlay();
        }
        else if(stepID == "nextbuttonHelp" )
        {
          this.fadeInMapOverlay();
          this.fadeOutSidenavOverlay();

        }
      },
      closeTour: function()
      {
        if(this.tourRunning) {
          this.tourRunning = false;
          $.ptJs('end');
        }
      },
      runTourOnFirstVisit : function()
      {

      },
      runTour : function()
      {
        if(this.tourRunning){
          //  this.closeTour();
          return;
        }
        this.tourRunning = true;

        var steps = [

          {
            el: '#address-input',
            templateData: {
              title: "Search",
              content: 'Search for your favorite place, this could be a city, town or zipcode'
            },
            overlay: {
              enable: false
            },
          },
          {
            el: '#zoomlevelHelp',
            templateData: {
              title: "Map Zoom",
              content: 'Choose from 1 of 5 zoom levels. Zoom out for maximum detail or zoom in to focus on a specific area.'
            }
          },
          {
            el: '#printsizeHelp',
            templateData: {
              title: "Print Options",
              content: 'Select the print size and orientation,  choose between common European sizes (imperial), or US sizes (metric).'
            }
          },
          {
            el: '#design-holder',
            overlay: {
              enable: false
            },
            templateData: {
              title: "Drag",
              content: 'Drag the map around to adjust the area.'
            },
            position:{
              location: 'tl-b'
            },
          },
          {
            el: '#nextbuttonHelp',
            overlay: {
              padding: 0
            },
            position:{
              location: 'rm-t'
            },
            templateData: {
              content: 'Continue to the next step when you are ready'
            }
          }
        ];

        $.ptJs({
          autoDestroy:true,
          templateClass: {
            root: ['one']
          },
          templateViewWindow: '' +
            '<div class="step-container" ptjs-id="ptjs-step-container">\n' +
            '<span class="step-button-close" ptjs-id="button-close" >&#10006;</span>\n' +
            '<div class="step-header" ptjs-id="header">\n' +
            '<div class="title" ptjs-data="title"></div></div>\n' +
            '<div class="step-body" ptjs-id="body">\n' +
            '<div class="content" ptjs-data="content"></div></div><br>\n' +
            '<div class="step-footer" ptjs-id="footer">\n' +
            '<span class="step-pagination" ptjs-id="pagination" ptjs-data="pagination"></span>\n' +
            '<div class="step-buttons">\n' +
            '<span ptjs-id="button-start" >next</span>\n' +
            '<span ptjs-id="button-previous" ptjs-data="button-previous" class="step-button-previous-custom"></span>\n' +
            '<span ptjs-id="button-next" ptjs-data="button-next"></span>\n' +
            '<span ptjs-id="button-end" >Done</span>\n' +
            '</div>\n' +
            '</div>\n' +
            '</div>'
          ,
          keyboardNavigation: false,
          overlay: {
            enable: false
          },
          position:{
            relocate: true,
            location: 'rm'
          },
          animation: {
            enableOnOpen: true,
            enableOnClose: true,
            duration : 0.7
          },
          autoStart: true,
          templateData: {
            title: 'Area Editor Tour'
          },
          steps: steps,
          onButtonPreviousClick: (event, data)=>{
            console.log("onButtonPreviousClick");

            this.handleNextTourStep(data.index - 1);
          },
          onButtonNextClick: (event,data)=>{
            console.log("onButtonNextClick");
            this.handleNextTourStep(data.index + 1);
          },
          onButtonStartClick: (event,data)=>{
            console.log("onButtonStartClick");
            this.handleNextTourStep(data.index + 1);
          },
          onButtonEndClick: (event,data)=>{
            console.log("onButtonEndClick");
            this.fadeOutMapOverlay();
            this.fadeOutSidenavOverlay();

            var timeout = setTimeout(()=>{
              this.scrollSideMenuToShowBound(0,0);
            },500);
            //  this.tourRunning = false;
          },
          onButtonCloseClick: (event,data)=>{
            this.fadeOutMapOverlay();
            // this.tourRunning = false;
          },
          onStart :(event, data)=>{
            console.log("onStart");
            this.handleNextTourStep(0 );
            this.tourRunning = true;
          },
          onDestroy:(event,data)=>{
            console.log("onDestroy");
            this.fadeOutMapOverlay();
            this.fadeOutSidenavOverlay();
            this.tourRunning = false;

          }
        });

      }

    },
    computed: {
      ...mapGetters([
        'isCartLoaded',
        'minZoomLevel',
        'maxZoomLevel',
        'zoomSizeOptions',
        'printSizeOptions',
        'orientationOptions',
        'activeJobEstimatedQueueDuration',
        'isActiveJobWaitingForResponse', 'isActiveJobProcessing', 'isActiveJobQueued', 'isActiveJobComplete', 'isActiveJobViewed', 'activeJobBasemapID', 'hasActiveJob',
        'activeJobQueueProcessPercentage', 'activeJobQueuePosition'
      ]),
      isMobile : function(){
        return this.$mq == 'mobile';
      },
      isDesktop : function(){
        return !this.isMobile;
      },

      isEditMode: function(){
        return this.editRoute_mapID != null
      },
      metricUnits: {
        get: function () {
          return this.$store.getters.metricUnits;
        },
        set: function (newValue) {
          this.$store.commit('metricUnits', newValue)
        },
      },
      printSizeOptionsMetric: function(){
        return [
          {value: commonGlobals.PAPERSIZE_20x20 ,label: '50 x 50cm' , title: 'Square'},
          {value: commonGlobals.PAPERSIZE_20x28 ,label: '50 x 70cm',title: 'Standard'},
          {value: commonGlobals.PAPERSIZE_24x36 ,label: '61 x 91cm', title: 'Large'}
        ];
      },
      printSizeOptionsImperial: function(){
        return [
          {value: commonGlobals.PAPERSIZE_20x20 ,label: '20 x 20"', title: 'Square'},
          {value: commonGlobals.PAPERSIZE_18x24 ,label: '18 x 24"', title: 'Standard'},
          {value: commonGlobals.PAPERSIZE_24x36 ,label: '24 x 36"',title: 'Large'}
        ];
      },
      nextButtonDisabled: function(){
        return this.isActiveJobProcessing  || this.isActiveJobQueued || this.isActiveJobWaitingForResponse;
      },

      assetsLoading: function(){
        return !this.$store.state.skusAndPrintSizesLoaded;
      },
      activeJobLoaded: function(){
        return this.$store.state.activeJobLoaded;
      },

    },
    watch:{
      activeTabIndex: function(newTabIndex)
      {
        if(newTabIndex == -1)
        {
          this.mobileSheetOpen_Paper = false;
          this.mobileSheetOpen_Location = false;
        }
        else if(newTabIndex == 0)
        {
          this.mobileSheetOpen_Paper = true;
          this.mobileSheetOpen_Location = false;
        }
        else if(newTabIndex == 1)
        {
          this.mobileSheetOpen_Paper = false;
          this.mobileSheetOpen_Location = true;
        }

        // scroll to bottom
        if(newTabIndex >=0) {
          var h = $("#tabcontent" + newTabIndex).height();
          console.log("h", h);
          $("html, body").animate({ scrollTop: h }, {easing :"easeOutQuad", duration:300});
        }
      },
      isCartLoaded : function(newVal, oldVal)
      {
        var loaded = newVal;
        if(!this.initDone && loaded)
        {
          //if(this.isUpdateMode) this.initUpdateMode();
          //else if(this.isAddMode) this.initAddMode();
          this.initMap();
        }
      },
      metricUnits: function(val)
      {
        // switch to the metric/imperial equalivent
        this.switchMetricImperialEquivalent();
      },
      zoom: function(val)
      {
        this.zoom = Math.round(val);
        this.updateZoom();
      },

      printSizeOptions: function(newVal)
      {
        console.log("watch printSizeOptions: ", newVal);
      },
      printSizeID: function(newVal, oldVal)
      {
        this.onPrintSizeChange();
      }
      ,orientationID: function(newVal, oldVal)
      {
        this.onPrintSizeChange();
      },
      assetsLoading: function(newVal)
      {
        var done = !newVal;
        console.log("assetLoading", newVal);
        if(done)
        {
          this.$nextTick(() => {
            this.initMap();
          });
        }
      },
      isActiveJobWaitingForResponse: function(newVal)
      {
        var done = !newVal;
        console.log("isActiveJobWaitingForResponse", newVal);
        if(done)
        {
          if(this.isActiveJobProcessing || this.isActiveJobQueued)
          {
            // show pop to not allow
            this.showProcessingModal();
          }

        }
      }

    },
    mounted: function(){

      $(window).resize(()=>{
      //  this.tabbarYPosition = window.innerHeight - 56;
      });
      this.tabbarYPosition = window.innerHeight - 56;


      bus.$on('mapRemovedFromCart', (args)=> {
        var mapID = args.mapID;
        console.log("PreviewCreatorPage mapRemovedFromCart event", mapID, this.mapID);
        if(mapID == this.mapID)
        {
          // reset back to create
          this.$router.push({ name: 'create', params: {createNewRoute: true}})
        }

      });

      this.switchMetricImperialEquivalent();


      // zero out the city ID, as this is a custom map
      this.$store.state.basemap.cityID = null;

      console.log("^^^^^^^^^^^^^^^^ mounted hasActiveJob", this.hasActiveJob);
      console.log("^^^^^^^^^^^^^^^^ mounted isActiveJobProcessing", this.isActiveJobProcessing);
      console.log("^^^^^^^^^^^^^^^^ mounted isActiveJobQueued", this.isActiveJobQueued);
      console.log("^^^^^^^^^^^^^^^^ mounted isActiveJobWaitingForResponse", this.isActiveJobWaitingForResponse);


      if(this.hasActiveJob )
      {
        if(this.isActiveJobComplete)
        {
          if(this.isActiveJobViewed)
          {
            // view so dont do naytinhg
          }
          else{
            // not viewed yet
            // todo - show message that map is ready
          }
        }
        else if(this.isActiveJobProcessing || this.isActiveJobQueued)
        {
          // show pop to not allow
          this.showProcessingModal();
        }
      }
      initAccordian();

      // settings https://community.algolia.com/places/examples.html#advanced

      // this.$nextTick(() => {
      var inputElement = this.$refs['address-input'];
      console.log(" this.$refs['address-input']", inputElement);
      if(inputElement) {
        var placesAutocomplete = places({
          container: this.$refs['address-input']  // document.querySelector('#address-input')
        }).configure({
          //  type: 'address'
          type: 'city',
          language: 'en',
          hitsPerPage: 5
        });

        //hack to show to X icon on the input box
        if ((this.searchString != null) || (this.searchString != "")) {
          this.$nextTick(() => {
            $("button.ap-icon-pin").css("display", "none");
            $("button.ap-icon-clear").css("display", "");

          });
        }


        placesAutocomplete.on('change', e => {
          var obj = e.suggestion;
          console.log('placesAutocomplete change', obj);
          var latlng = obj.latlng;

          this.lat = latlng.lat;
          this.lng = latlng.lng;

          this.searchString = obj.value; // searchString is the v-model so its set automatically
          this.text1 = obj.name;
          this.text2 = obj.country;
          this.text3 = obj.latlng.lat + "°N / " + obj.latlng.lng + "°E";


          console.log("seach suggestion obj", obj);
          this.updateCenter();

        });
        // });
      }

      if(!this.assetsLoading)
      {

        this.$nextTick(() => {

          this.initMap();


        });
      }

    },
    beforeDestroy(){
      console.log("---- beforeDestroy");
      this.map.off('moveend',this.onMapUpdate);

    },
    beforeRouteLeave (to, from, next) {
      // called when the route that renders this component is about to
      // be navigated away from.
      // has access to `this` component instance.
      this.closeTour();
      next();
    },
    name: 'Hello'
  }



  //////////////////////
  // acordian
  var _acc = document.getElementsByClassName("accordion");
  var _panels = document.getElementsByClassName("editpanel");

  function initAccordian()
  {
    _acc = document.getElementsByClassName("accordion");
    _panels = document.getElementsByClassName("editpanel");

    var i;
    for (i = 0; i < _acc.length; i++) {
      _acc[i].index = i;
      _acc[i].addEventListener("click",function(){
        openAccordian(this.index);
      });
    }


    //openThemeAccordian();
  }

  function openThemeAccordian()
  {
    openAccordian(0);

  }

  function openAccordian(index)
  {
    console.log("index " + index);
    // close
    var closeOthers = false;
    if(closeOthers)
    {
      for (var j = 0; j < _acc.length; j++) {
        _panels[j].classList.remove("panelactive");
        _acc[j].classList.remove("active");
        _acc[j].nextElementSibling.style.maxHeight = null;
      }
    }
    _acc[index].classList.toggle("active");
    var panel = _acc[index].nextElementSibling;
    if (panel.style.maxHeight){
      // open so close
      _panels[index].classList.remove("panelactive");
      panel.style.maxHeight = null;
    } else {
      _panels[index].classList.add("panelactive");
      panel.style.maxHeight = panel.scrollHeight + "px";

    }

  }


</script>

<style>



    .map{
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
    .v-label{
        color: #222222 !important;
    }
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


    .algolia-places {
    }

    .ap-input {
        font-size: 1.2em;
        border: solid 2px #555555;
        box-shadow: 0 0px 0px rgba(0,0,0,0.4);
        color: #000000;
        height: 56px;
        padding-left: 16px;
        padding-right: 48px;
        border-radius: 4px;
    }
    /* PLaces automplete  https://community.algolia.com/places/documentation.html#styling */



    .nextbutton{
        margin: 0px;
        text-transform: none;
        height: 65px;
        border-radius: 0px;
    }

    .rounded-version{
        border-radius: 35px;
        height: 50px;
        width: 200px;
        color: white;
        margin: 0px;

    }


    .sidenavspacer{
        display: flex;
        flex: 1;
    }

    .sidenavtop {
        background-color: cornflowerblue;
        padding: 20px 20px;
        color: hsla(0,0%,100%,.75);
        font-size: 1.2rem;
        line-height: 1.0;
        flex-shrink: 0;
        display: flex;
    }

    .sidenav-bottom {
        height: 70px;
        background-color: royalblue;
        align-items: center;
        padding: 20px;
        flex-shrink: 0;
        flex-grow: 0;
        display: flex;
        min-height: 25px;
        align-content: center;
        border-radius:2px;
        justify-content: center;
        color: #fff;
        margin: 10px;
        font-size: 1.2rem;

    }

    .sidenav-bottom:hover{
        background: cornflowerblue;
        cursor: pointer;
    }

    .outerholder {
        flex: 0 1 100%;
        display:flex;
        height: 100vh;
        background-color: #eee;
    }

    .holder {
        flex: 0 1 100%;
        display:flex;
        height: calc(100% - 30px);
        position: absolute;
        top: 30px;
        bottom:0;
        left:400px;
        right:0;
        background-color: #eee;
        padding: 40px;
    }

    .design-holder{
        position: absolute;
        left: 50%;
        transform-origin: 50% 50% 0px;
        top: 50%;
        transform: translate(-50%,-50%) scale(0.4);
        box-shadow: 2px 5px 20px rgba(0,0,0,.45);
        -webkit-box-shadow: 2px 5px 20px rgba(0,0,0,.45);

    }

    .map{
        width: 853px;
        height: 1280px;
        position: relative;

    }

    .content {
        max-width: 100%;
        max-height: 100%;
        position: absolute;
        margin:auto;
        top:0;
        bottom:0;
        left:0;
        right:0;
    }

    .flexrow {
        display: flex;
        flex-direction: row;
        margin: 8px 0px;
    }

    .flexrow-wrap {
        flex-wrap: wrap;
        display: flex;
        flex-direction: row;
    }

    .item {
        flex: 1;
    }

    .accordion {
        background-color: #f8f8f8;
        color: #444;
        cursor: pointer;
        padding: 13px;
        width: 100%;
        text-align: left;
        outline: none;
        font-size: 17px;
        transition: 0.4s;

        min-width: 30px;
        align-items: center;
        align-content: center;
        justify-content: center;
        border-radius: 0px;
        font-size: 1em;

    }

    .active, .accordion:hover {
        background-color: #ddd;
    }

    .accordion:after {
        content: '\002B';
        color: #777;
        font-weight: bold;
        float: right;
        margin-left: 5px;
    }

    .active:after {
        content: "\2212";
    }

    .editpanel {
        padding: 0 10px;
        background-color: white;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.2s ease-out;
        border-bottom: 0px solid #ccc;
        border-top: 1px solid #ccc;
    }

    .panelactive{
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px;

    }


    .labelblock{
        margin: 10px 15px 0px 0px;
        font-weight: bold;
    }

    .editpanel-open {
        padding: 0 10px;

    }

    input {
        width: 100%;
        padding: 5px 5px;
        margin: 8px 0;
        box-sizing: border-box;
        border: 1px solid gray;
    }

    label{
        display: flex;
        flex: 0 0 auto;
        margin: 0px 15px 0px 0px;
        justify-content: center;
        flex-direction: column;
        font-size: 16px;
    }


    header{
        height: 30px;
    }

    .HolyGrail {
        display: flex;
        min-height: 100vh;
        flex-direction: column;

    }

    .HolyGrail-body {
        display: flex;
        flex: 1;
    }

    .HolyGrail-content {
        flex: 1;
        background: blue;
        display: flex;

    }

    .HolyGrail-nav {
        /* 12em is the width of the columns */
        display: flex;
        flex: 0 0 400px;
        flex-direction: column;
        order: -1;
        background-color: #fff;
        box-shadow: 0px 0px 3px 3px rgba(0, 0, 0, 0.1);
        z-index: 1;
    }




    body1 {
        position: relative;;
        font-family: 'Hind', sans-serif;
        color: #444;
        background: #1d1f20;
        display: flex;
        flex-direction:row;
    }

    .sidebar1 {
        background:#ff0000;
        flex: 0 0 300px;
        flex-direction:column;
        display: flex;
    }

    .content1 {
        background:#111;
    // align-content: stretch;
        order: 1;
        flex: 0 1 100%;
        min-height: 100vh;
        padding:20px;
        flex-direction: row;
    }

    hr {
        display: block;
        height: 1px;
        border: 0;
        border-top: 1px solid #ccc;
        margin: 1em 0;
        padding: 0;
    }

    .zoombtn{
        width: 30px;
        height: 30px;
        line-height: 30px;
        background: white;
        font-size: 1.6em;
        font-weight: bold;
        cursor: pointer;
        text-align: center;
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .zoombtn:hover{
        background: #dddddd;
    }

    .zoombtn-divider{
        width: 30px;
        height: 1px;
        background: #dddddd ;
    }

    .zoombtn.top{
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }

    .zoombtn.bottom{
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .tooltiptext-arrow {
        content: "";
        position: absolute;
        right: -10px;
        margin-top: -0px;
        border-width: 10px;
        border-style: solid;
        border-color: transparent black transparent transparent;
    }



</style>
