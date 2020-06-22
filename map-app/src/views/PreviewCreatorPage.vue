<template>

  <div >

    <!--
    <Navbar :siteLogoShowing="false" ></Navbar>
    -->
    <ProcessingModal></ProcessingModal>



    <WaitOverlay v-if="assetsLoading  /*|| (!activeJobLoaded )*/ ">
    </WaitOverlay>

    <ErrorModal
            v-model="errorModalShowing"
            message="Sorry, something went wrong. Please try again later."
    ></ErrorModal>



    <EditorBase ref="editorbase" id="root" :showBottom="!assetsLoading">
      <template slot="underMapCenter">
        <v-layout row style="width:100%; padding-top: 10px" align-center v-if="mapLoaded" >
          <v-spacer></v-spacer>
          <!--
          <HelpButton v-if="isMobile" @click.native="runTour" :size="36" ></HelpButton>
          -->
        </v-layout>
      </template>

      <template slot="sidebar-main">

        <!-- todo add search here -->

        <PanelHeader  step=1 :text="(isEditMode) ? 'Edit Area' : 'Edit Area'" icon="" :clickable="panelContentOutroActive">
          <template slot="right">
            <v-icon v-if="panelContentOutroActive" dark color="grey">mdi-check</v-icon>
            <!--
            <HelpButton v-else="" @click.native="runTour" ></HelpButton>
            -->
          </template>
        </PanelHeader>

        <div class="editpanel-open" :class="{fadeIn:panelContentIntroActive, fadeOut:panelContentOutroActive} ">
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

            <div id="searchHelp">
              <SearchInput ref="searchComponentDesktop"  v-model="searchString" @onLocationChanged="updateCenter()" ></SearchInput>
            </div>
            <div id="zoomlevelHelp" >
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
                          :min="minZoomLevel"
                          :max="maxZoomLevel"
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
              <div style="padding-bottom: 40px; padding-top: 10px">
                <label class="labelblock" style="float: left">Print Size </label>
                <!--
                <v-switch color="primary"
                          v-model="metricUnits"
                          label=""
                          style="margin: 0px; margin-top: 5px; float: right"
                ></v-switch>
                -->
                <!--
                <ToggleButton
                          v-model="metricUnits"
                          style="margin: 0px; margin-top: 11px; float: right"
                ></ToggleButton>

                <label @click="metricUnits = !metricUnits" class="noselect  labelblock" style="font-size: 14px; margin-right: 8px; float: right;  cursor: pointer; font-weight: normal; font-style: normal;  text-decoration: underline;">{{ (metricUnits)? 'Switch to inches': 'Switch to cm' }}</label>
-->
              </div>
   <!--
              <OptionRow  :options="(metricUnits) ? printSizeOptionsMetric: printSizeOptionsImperial" v-model="printSizeID"> </OptionRow>
       -->
              <OptionRow  :options="printSizeOptionsAll" v-model="printSizeID"> </OptionRow>


            <div id="orientationHelp">
            <label class="labelblock" style="margin-top: 35px">Orientation</label>
            <OptionRow slot="activator" :options="orientationOptions" v-model="orientationID"> </OptionRow>
            </div>
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
        <div id="nextbuttonHelp" class="" style="width: 100%">

          <!-- changed this to custom loading state with clickable button  -->

          <PanelHeader rightClass="shake-hover" :topBorder="panelContentOutroActive" :step="2" text="Edit Style" :bottomButton="!panelContentOutroActive" :rainbow-bg="true" @click.native="checkLoadingAndSendRequest()">
            <template slot="right">

              <v-progress-circular v-if="nextButtonDisabled" indeterminate color='grey darken-2' :size="24"  :width="2" ></v-progress-circular>
              <!--
              <div v-else="">{{$store.getters.priceForCurrentMapWithCurrencyString}}</div>
-->
              <v-icon class="shake" v-else="" dark>mdi-arrow-right</v-icon>

            </template>
          </PanelHeader>



        </div>
      </template>
      <template slot="content" >

        <div class="text-xs-center" v-if="showLoader && !mapLoaded" style="margin-top:10px"  >
          <v-progress-circular
                  :size="(isMobile) ? 60 : 80"
                  indeterminate
                  color="primary"
          ></v-progress-circular>
        </div>
        <div id='map' class="map"  style="position: relative; width: 0px;height: 0px;" v-show="!assetsLoading"></div>

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


        <template v-if="isMobile">  <!-- keep element rendered -->

          <v-layout column>

            <MobileTabBar :tabData="tabData" v-model="activeTabIndex">
              <template slot="right">
                <!--
                <v-layout row align-center justify-end>
                  <v-flex shrink>
                  <HelpButton shrink @click.native="runTour" ></HelpButton>
                  </v-flex>
                </v-layout>
                -->
                <v-btn id="nextbuttonHelpMobile" @click="checkLoadingAndSendRequest()" class="hero nextbuttonmobile">
                  <template v-if="nextButtonDisabled" >

                    <v-progress-circular indeterminate color='white' :size="24"  :width="2" ></v-progress-circular>
                  </template>
                  <template v-else="" >
                    <div style="display: inline-block; margin-right: 0px; color: white">
                      <template v-if="isEditMode">
                        Customize
                        <!--
                        <v-icon>mdi-palette</v-icon>
                        -->
                      </template>
                      <template v-else="">
                        Customize
                        <!--
                        <v-icon>mdi-palette</v-icon>
                        -->
                      </template>

                    </div>
                    <!--
                    <div style="display: inline-block; ">{{$store.getters.priceForCurrentMapWithCurrencyString}}</div>
                    -->
                    <!--
                    <v-icon  right>mdi-chevron-right</v-icon>
                    -->
                  </template>
                </v-btn>
              </template>
            </MobileTabBar>


            <v-tabs-items v-model="activeTabIndex" vertical style="z-index: 1">
              <v-tab-item key="0">
                <!-- empty item for when nothing is selected, 0 height so it collapses itself -->
                <v-card flat ref="tabcontent0" style="height: 0; visibility: collapse"></v-card>
              </v-tab-item>
              <v-tab-item key="1">
                <v-card flat ref="tabcontent1">
                  <v-card-text>
                    <v-layout column style="height: 200px">

                      <div id="searchHelpMobile">
                        <SearchInput :hitsPerPage="2" ref="searchComponentMobile" elementID="search-input-mobile" v-model="searchString" @onLocationChanged="updateCenter()" ></SearchInput>
                      </div>
                      <div id="zoomlevelHelpMobile">
                        <label class="labelblock">Zoom Level <v-icon> </v-icon> </label>
                        <v-layout>
                          <v-flex >
                            <v-btn style="margin-left:0px" depressed fab small color="primary"  @click="zoomOut()"  :light="zoom == minZoomLevel" :dark="zoom != minZoomLevel"  :disabled="zoom == minZoomLevel">
                              <v-icon>mdi-minus</v-icon>
                            </v-btn>
                          </v-flex>
                          <v-flex>
                            <v-slider
                                    style="margin-left:0px; margin-right: 10px; margin-top: 10px"
                                    v-model="zoom"
                                    always-dirty
                                    :min="minZoomLevel"
                                    :max="maxZoomLevel"
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

                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item key="2">
                <v-card flat ref="tabcontent2">
                  <v-card-text>

                    <v-layout column >
                      <div id="printsizeHelpMobile">
                        <label class="labelblock">Print Size </label>
                        <OptionRow :options="printSizeOptionsAll" v-model="printSizeID"> </OptionRow>
                        <!--
                        <v-switch color="primary"
                                  v-model="metricUnits"
                                  label="Metric Units"
                                  style="margin: 0px; margin-bottom: -20px"
                        ></v-switch>-->
                      </div>
                      <div id="orientationHelpMobile">
                        <label class="labelblock" style="margin-top: 25px">Orientation</label>
                        <OptionRow slot="activator" :options="orientationOptions" v-model="orientationID"> </OptionRow>
                      </div>


                    </v-layout>

                  </v-card-text>
                </v-card>

              </v-tab-item>

            </v-tabs-items>

          </v-layout>
        </template>


        <!--
        <button class="nextbutton rounded-version" @click="checkLoadingAndSendRequest()"> Next </button>
        -->
        <!--
        <v-btn class="nextbutton primary title font-weight-light " style="max-width: 200px" round block dark @click="checkLoadingAndSendRequest()">
          <template v-if="nextButtonDisabled" >
            <v-progress-circular indeterminate color='white' size=24  width="2" ></v-progress-circular>
          </template>
          <template v-else="" >
            Next
            <v-icon  right>mdi-chevron-right</v-icon>
          </template>
        </v-btn>
        -->
      </template>

    </EditorBase>

    <!-- MOBILE BOTTOM TABS -->

  </div>




</template>

<script>

  const MAPLIBRARY_MAPBOX = "mapbox";
  const MAPLIBRARY_LEAFLET = "leaflet";
  const MAPLIBRARY = MAPLIBRARY_MAPBOX;

  const TILETYPE_VECTOR = "vector";
  const TILETYPE_RASTER = "raster";
  const TILETYPE = TILETYPE_RASTER;

  /////////////////////////
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'
  import OptionRow from '../components/common/OptionRow.vue'
  import PanelHeader from '../components/common/PanelHeader.vue'
  import HelpButton from '../components/common/HelpButton.vue'
  import currentMapDataMixin from '../mixins/currentMapDataMixin.js'
  import BottomSheet from "../components/common/BottomSheet";
  import MobileTabBar from "../components/common/MobileTabBar";
  import SearchInput from "../components/previewcreator/SearchInput";
  import ErrorModal from '../components/common/ErrorModal'
  import ProcessingModal from '../components/common/ProcessingModal.vue'
  import AccordianPanel from '../components/common/AccordianPanel.vue'
  import ToggleButton from "../components/common/ToggleButton";

  import io from 'socket.io-client';
  import EditorBase from '../components/common/EditorBase.vue'
  var commonGlobals = require('../../../common/commonGlobals');
  import {bus} from "../main"
  import utilsMixin from "../mixins/utilsMixin";
  var previewMapCreate = require('../../helper/basemapCreate/previewMapCreate');
  const localStore = require('../utils/localStore');

  var _cachedMap; // cachedmap


  export default {
    mixins: [currentMapDataMixin, utilsMixin],
    components: {
      ToggleButton,
      SearchInput,
      OptionRow,
      EditorBase,
      PanelHeader,
      HelpButton,
      BottomSheet,
      MobileTabBar,
      ErrorModal,
      ProcessingModal,
      AccordianPanel

    },
    props: {
      routeProp_createNew :{
        type: [String,Boolean],
        default: null
      },
      editRoute_mapID: {
        type: [String,Number],
        default: null
      },
      editRoute_basemapID: {
        type: [String,Number],
        default: null
      },
    },
    data () {
      return {
        nextMapEventDisabled: false,

        panelContentOutroActive: false,
        panelContentIntroActive: true,

        currentlyActivated: false,
        errorModalShowing : false,

        searchBoxMobileInitDone: false,
        searchBoxDesktopInitDone: false,
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

        activeTabIndex: 0,

        mapWidth: 0,
        mapHeight: 0,

        searchInputText: "",
        tourRunning: false,

        showLoader : false,
        mapLoaded : false,
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
      deactivated: function(){

        if(!this.currentlyActivated) return;
        this.currentlyActivated = false;



        console.log("deactivated");
        if(_cachedMap) _cachedMap.off('moveend',this.onMapUpdate);

        this.initDone = false;
        bus.$off('mapRemovedFromCart',this.onMapRemovedFromCart);
      },
      activated: function(){
        // call deactivate first if not done
        if(this.currentlyActivated){
          this.deactivated();
        }
        this.currentlyActivated = true;

        // reset animaitons
        this.panelContentIntroActive = true;
        this.panelContentOutroActive = false;
        this.setBottomButtonAnimationUpActive(false);

        // reset tab index
        this.activeTabIndex = 0;
        console.log("activated");

        bus.$on('mapRemovedFromCart',this.onMapRemovedFromCart);

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

        // settings https://community.algolia.com/places/examples.html#advanced

        // this.$nextTick(() => {


        if(!this.assetsLoading)
        {

          this.$nextTick(() => {

            this.initMap();


          });
        }

        // update center as it may have changed location
        this.updateCenter();
        // redraw as it may need refreshing when nanivating back
        this.redrawMap();
      },
      onMapRemovedFromCart: function() {
        var mapID = args.mapID;
        console.log(" mapRemovedFromCart event", mapID, this.mapID);

        if(mapID == this.mapID)
        {
          // reset back to create
          this.$router.push({ name: 'create', params: {}})
        }
      },
      showProcessingModal: function()
      {
        bus.$emit("showProcessingModal", {
          hideCloseButton:false
        });
        // close the tour pop ups if showing
        this.closeTour();
      },
      hideProcessingModal: function()
      {
        bus.$emit("hideProcessingModal");
      },
      gotoMapEditorPage : function(basemapID)
      {
        //this.$router.push({ name: 'edit', params: { basemapIDRoute: basemapID }});

        let mapID = this.$store.getters.previewMap_mapID;
        console.log("onJobComplete mapID: ", mapID);

        let editExisting = mapID != null;
        console.log("editExisting: ",editExisting);

        if(editExisting) {
          // go to customisiation page to update an existing map
          this.$router.push({ name: 'editMapWithBasemap', params: {route_mapID: mapID , route_basemapID:basemapID} })
        }
        else{
          // go to customisiation page to add a new map
          this.$router.push({name: 'createMap', params: {route_basemapID:basemapID}})
        }


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
          setTimeout( ()=> {
            this.sendRequestToMapServer();
          }, (this.isDesktop) ? 1000: 100);  // wait a bit to let to animation slide up animation finish, as its a bit jerky
          //reset
          this.panelContentOutroActive  = true;
          this.panelContentIntroActive  = false;
          this.setBottomButtonAnimationUpActive(true);

        }
      },
      sendRequestToMapServer: async function()
      {
        console.log("sendRequestToMapServer ");

        let generateClientSide = false;
        if(generateClientSide) {// generate on the client , needs testing
          var printSize = commonGlobals.getPreviewMapSize(this.printSizeID, this.orientationID);
          console.log("printSize", printSize);
          let scaleFactor = 1;
          let imageData = await previewMapCreate.generatePreview(this.lng, this.lat, this.zoom , Math.floor(printSize.width), Math.floor(printSize.height), scaleFactor );
          // todo load it into map and goto editor page

          this.$router.push( {"name":"editMapGenerated", "params":{route_basemapImageData: imageData}});
        }
        //return;



        this.$store.state.activeJob.status = commonGlobals.PREVIEWMAP_JOB_STATUS_WAITING_FOR_RESPONSE;

        // get the socket id, this is currently used in createBasemapPreview
        await this.connectToProgressSocket();


        // create the basemap
        this.$store.dispatch("createBasemapPreview").then( async (data) => {
          console.log("returned from promise here data, ", data);
          let basemapAlreadyExists = data.exists;
          // this data is sent in controller/basemap preview method
          let basemapID = data.basemapID;
          let queueCount = data.queueCount;
          let nWorkers = data.nWorkers;
          let averageProcessDuration = data.averageProcessDuration;

          this.$store.state.activeJob.status = commonGlobals.PREVIEWMAP_JOB_STATUS_QUEUED;
          this.$store.state.activeJob.queuePosition =queueCount;
          this.$store.state.activeJob.estimatedQueueDuration = queueCount*averageProcessDuration;


          console.log("basemapID:", basemapID);
          console.log("queueCount:", queueCount);
          console.log("this.$store.state.activeJob.queuePosition:", this.$store.state.activeJob.queuePosition);

          console.log("nWorkers:", nWorkers);
          console.log("averageProcessDuration:", averageProcessDuration);

          console.log("basemapAlreadyExists:", basemapAlreadyExists);

          // todo set the default tagline
          this.$store.commit('setDefaultTagLine');

          if(basemapAlreadyExists)
          {
            // disconnect socket
            this.$store.commit('closeSocket');
            this.resetActiveJobValues();

            // restet
            //this.resetActiveJobValues();
            // basemap exists so go stragiht to the edtiorpage
            this.gotoMapEditorPage(basemapID);
          }
          else{
            if(generateClientSide) {// generate on the client , needs testing
              var printSize = commonGlobals.getPreviewMapSize(this.printSizeID, this.orientationID);
              console.log("printSize", printSize);
              let scaleFactor = 1;
              let imageData = await previewMapCreate.generatePreview(this.lng, this.lat, this.zoom , Math.floor(printSize.width), Math.floor(printSize.height), scaleFactor );
                // todo load it into map and goto editor page

              this.$router.push( {"name":"editMapGenerated", "params":{route_basemapImageData: imageData}});
            }
            else{ // load using server side worker

              console.log("here ");

              this.showProcessingModal();
              // this.resetActiveJobValues();
              // basemap doesnt exist so start listening to events and open pop-up
              // this.connectToProgressSocket(basemapID);
              this.$store.state.activeJob.basemapID = basemapID;
              // send to processing Modal
              bus.$emit("processingStarted", {
                progress: 0,
                queuePosition: this.$store.state.activeJob.queuePosition,
                nWorkers: nWorkers,
                averageProcessDuration: averageProcessDuration
              });
            }
          }
        }).catch((e)=>{
            //  show error modal]
          console.error(e);
          this.errorModalShowing = true;
          // todo reset UI back to the start
          this.onCancelPreviewProcessing();
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

        if(_cachedMap) {
        $('#map').width(this.mapWidth);
        $('#map').height(this.mapHeight);

          this.redrawMap();
        }

        this.$refs.editorbase.resizeContentToFit();
        this.$refs.editorbase.resizeContentToFit(); // hack call a second time to fit it properly

      },
      redrawMap : function()
      {
        if(!_cachedMap) return;

        if(MAPLIBRARY == MAPLIBRARY_MAPBOX) _cachedMap.resize();
        else _cachedMap.invalidateSize();
      },
      updateZoom: function ()
      {
        //if(_cachedMap) _cachedMap.setZoom(this.zoom);
        if(MAPLIBRARY == MAPLIBRARY_MAPBOX) _cachedMap.setZoom(this.zoom);
        else  _cachedMap.setZoom(this.zoom + 1);
        console.log("updateZoom",this.lng, this.lat);
      },
      updateCenterAndEaseToIt: function ()
      {
        console.log("updateCenter",this.lng, this.lat);
        if(!_cachedMap) return;
        if(MAPLIBRARY == MAPLIBRARY_MAPBOX)
        {
          //ease options https://docs.mapbox.com/mapbox-gl-js/api/#animationoptions
          _cachedMap.easeTo({
            center: new mapboxgl.LngLat(this.lng, this.lat),
            duration: 1200,
          });
        }
        else{
          _cachedMap.setView(new L.LatLng(this.lat, this.lng), this.zoom +1);
        }
      },
      updateCenter: function ()
      {
        console.log("updateCenter",this.lng, this.lat);
        if(!_cachedMap) return;
        if(MAPLIBRARY == MAPLIBRARY_MAPBOX)
        {
          _cachedMap.setCenter(new mapboxgl.LngLat(this.lng, this.lat));
        }
        else{
          _cachedMap.setView(new L.LatLng(this.lat, this.lng), this.zoom +1);
        }
      },
      zoomIn : function(){
        this.zoom = Math.round( Math.min(this.zoom + 1, this.maxZoomLevel));
        console.log("zoomIn", this.zoom);
      },
      zoomOut: function(){
        this.zoom = Math.round(Math.max(this.zoom - 1, this.minZoomLevel));
        console.log("zoomOut", this.zoom);
      },

      getMapZoom : function(){
        if(!_cachedMap) return 14;
        if(MAPLIBRARY == MAPLIBRARY_MAPBOX) return _cachedMap.getZoom();
        else  return _cachedMap.getZoom() - 1;
      },
      getMapCenter : function(){
        return _cachedMap.getCenter();
      },

      onMapUpdate: function(){

        if(this.nextMapEventDisabled){
          this.nextMapEventDisabled = false;
          return;
        }
        var lnglat = this.getMapCenter();
        console.log("here: " , lnglat);
        let snapToPrecisionMap = {
          12: 200,
          13: 400,
          14: 800,
          15: 1600
        };
        let snapToPrecision = snapToPrecisionMap[this.zoom];
        this.lng =  Math.round(lnglat.lng * snapToPrecision) / snapToPrecision;
        this.lat = Math.round(lnglat.lat * snapToPrecision) / snapToPrecision;
        console.log("onMapUpdate", this.zoom, this.lng, this.lat);
        this.zoom = this.getMapZoom();

        this.disableNextMapEvent();
        //this.updateCenterAndEaseToIt();  // easing is currently causing problems when moving to the map -dsiale for now
        this.updateCenter();
      },
      disableNextMapEvent : function(){
        this.nextMapEventDisabled = true;
      },
      cancelPreviewProcessing : function(){
        this.$store.dispatch('cancelPreview').then(()=>{
          this.hideProcessingModal();
        });
        this.onCancelPreviewProcessing();
      },
      onCancelPreviewProcessing: function(){
        // rset
        console.log("cancelPreviewProcessing");
        this.panelContentOutroActive  = false;
        this.panelContentIntroActive  = true;
        this.setBottomButtonAnimationUpActive(false);
      },
      connectToProgressSocket:  function(){
        console.log(' connecting to socket ' );

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

        return this.$store.dispatch("initSocket").then(socket =>{
          console.log("socket connected callback");
         // socket.emit('receiveStatus', basemapID); // request status events for the basemapID
         // this.$store.state.activeJob.basemapID = basemapID;



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

      searchBoxMobileMounted : function(){
        console.log("searchBoxMobileMounted");
      },

      initMap: async function(){
        if(!this.isCartLoaded) return;
        if(this.initDone || this.assetsLoading) return;
        this.initDone = true;

        console.log("initMap");



        /*
                mapboxgl.setRTLTextPlugin('/static/lib/map/mapbox-gl-rtl-text.js');
                var map = new mapboxgl.Map({
                  container: 'map',
                  style: '/static/lib/map/style.json',
                  hash: true
                });
                _cachedMap.addControl(new mapboxgl.NavigationControl());
        */
        console.log(">>>> initMap", this.lng, this.lat, this.zoom);

        // MAPBOX GL
        var mapbox_mapJSFile = "https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.1/mapbox-gl.js";
        var mapbox_mapCSSFile = 'https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.1/mapbox-gl.css';
        // LEAFLET
        var leaflet_mapJSFile = "https://unpkg.com/leaflet@1.4.0/dist/leaflet.js";
        var leaflet_mapCSSFile = "https://unpkg.com/leaflet@1.4.0/dist/leaflet.css" ;

        var mapboxLeafletPluginJSFile = "https://cdn.klokantech.com/mapbox-gl-leaflet/latest/leaflet-mapbox-gl.js";

        /*
        if(this.map != null)
        {
          _cachedMap.off('moveend',this.onMapUpdate);
          _cachedMap = null;
        }*/

        // load map if not created
        if(_cachedMap == null) {

          // load css first, then js files
          if(MAPLIBRARY == MAPLIBRARY_LEAFLET) {
            await this.loadExternalScript(leaflet_mapJSFile);
            await this.loadExternalScript(mapbox_mapJSFile);
            await this.loadExternalScript(mapboxLeafletPluginJSFile);
            await this.loadStyleSheet(leaflet_mapCSSFile);
            await this.loadStyleSheet(mapbox_mapCSSFile);
          }
          else{ // MAPBOX
            await this.loadExternalScript(mapbox_mapJSFile);
            await this.loadStyleSheet(mapbox_mapCSSFile);
          }

          let apikey = process.env.VUE_APP_MAPTILER_API_KEY;
          console.log("process.env.VUE_APP_MAPTILER_API_KEY", apikey);
          console.log("process.env", process.env);

          if (MAPLIBRARY == MAPLIBRARY_LEAFLET) {
            _cachedMap = L.map('map', {zoomControl: false}).setView([this.lat, this.lng], this.zoom + 1);

            if (TILETYPE == TILETYPE_VECTOR) {

              let style = 'https://api.maptiler.com/maps/907ff35f-97f3-4c8e-990d-ba5322eff1c0/style.json?key=' + apikey;
              var gl = L.mapboxGL({
                attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
                accessToken: 'not-needed',
                style: style,
              }).addTo(_cachedMap);
            }
            else { // TILETYPE == TILETYPE_RASTER
              L.tileLayer('https://api.maptiler.com/maps/907ff35f-97f3-4c8e-990d-ba5322eff1c0/{z}/{x}/{y}.png?key='+ apikey, {
                attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
                crossOrigin: true
              }).addTo(_cachedMap);
            }
            _cachedMap.scrollWheelZoom.disable();
            console.log("^^^^^^^^^ cachedMap created",_cachedMap);


          }
          else { // MAPLIBRARY == MAPLIBRARY_MAPBOX
            mapboxgl.accessToken = 'pk.eyJ1IjoiZGF2aWRoMDMiLCJhIjoiY2phZnduOTdxMThwNzJ3cXVyY2RubDhlMyJ9.Io4YkfT4pvr-740FppvYMg';



            _cachedMap = new mapboxgl.Map({
              container: 'map',
              // style: 'mapbox://styles/davidh03/cjjcwa8je7f1u2sp8wopr1na2',
             // style: '/static/assets/mapjson/preview-myserver.json',
              //style: '/static/assets/mapjson/preview-geoapify.json',
            style: '/static/assets/mapjson/preview-openmaptiler.json',

              // style: 'https://api.maptiler.com/maps/907ff35f-97f3-4c8e-990d-ba5322eff1c0/style.json?key=' + apikey,
              center: [this.lng, this.lat],
              zoom: this.zoom,
            });
            _cachedMap.dragRotate.disable();

            console.log("^^^^^^^^^ cachedMap created",_cachedMap);
            _cachedMap.scrollZoom.disable();

          }
          _cachedMap.on('moveend', this.onMapUpdate);

          /*
        mapboxgl.accessToken = 'pk.eyJ1IjoiZGF2aWRoMDMiLCJhIjoiY2phZnduOTdxMThwNzJ3cXVyY2RubDhlMyJ9.Io4YkfT4pvr-740FppvYMg';
        if(this.map != null)
        {
          _cachedMap.off('moveend',this.onMapUpdate);
          _cachedMap = null;
        }

        _cachedMap = new mapboxgl.Map({
          container: 'map',
          // style: 'mapbox://styles/davidh03/cjjcwa8je7f1u2sp8wopr1na2',
          style: 'https://maps.tilehosting.com/c/12915062-7dfa-4102-b526-fbd601d7472f/styles/userpreview/style.json?key=QrAJ6Qj4kLYkZ6l90BKB',
          center: [ this.lng, this.lat],
          zoom: this.zoom,
        });
        var _this = this;
        _cachedMap.on('moveend',this.onMapUpdate);
        // restore the input field to the saved value
        _cachedMap.scrollZoom.disable();
*/
        }


    /*
        if(this.isEditMode)
        {
          // edit existing map
          var map = this.$store.getters.getMapInCartByID(this.editRoute_mapID);
          if(map) {
            //console.log("this.editRoute_mapID", this.editRoute_mapID);
            //this.$store.commit("setBasemapData", map.basemap);
            this.mapID = this.editRoute_mapID;
          }
          else{
            console.error("no map exists with id in cart", this.editRoute_mapID);
          }
        }
        else if(this.routeProp_createNew){
          // new creation

        }else{
          // user has gone back to edit the map after geenrating a preview
          // keep existing state
        }*/

        if(this.routeProp_createNew)
        {
          this.$store.commit('resetBasemapValuesToDefault');

          // newcreation
          this.$store.state.basemap.basemapID = null;
          this.updateCenter();
          this.updateZoom();
          //this.mapID = null;
          // this.basemapID = null;
          // reset ids values

        }
        else if( this.editRoute_mapID != null)
        {
          var mapID = this.editRoute_mapID;
          var map = this.$store.getters.getMapInCartByID(this.editRoute_mapID);
          if(map){
            if(this.$store.state.map.mapID !=  mapID) {
              //   this.$store.commit("setEditMapData", {map: map, dontOverrideText: false});
            }
            // this.$store.commit("setBasemapData", map.basemap);
            this.mapID = this.editRoute_mapID;
          }

          console.log("init here", this.editRoute_basemapID, this.$store.state.basemap.basemapID);

          if(this.editRoute_basemapID != null)
          {
            if(this.$store.state.basemap.basemapID != this.editRoute_basemapID)
            {
              if(map.basemap.basemapID == this.editRoute_basemapID) {
                console.log("setBasemapData", map.basemap);

                this.$store.commit("setBasemapData", map.basemap);
              }
              else{


                //fetch it from the server?
                this.$store.dispatch("retrieveBasemapFromServer", this.editRoute_basemapID).then((data) => {
                  this.$store.commit("setBasemapData", data);
                }).catch((err) => {
                  // none exists
                });
              }
              //this.$store.state.map.basemapID = this.route_basemapID;
            }
          }
          else{

          }
          this.updateCenter();
          this.updateZoom();
        }
        else
        {
          //this.$store.state.basemap.basemapID = null;

          // create new from search on home page 
          this.$store.commit('resetBasemapAndRetainLocation'); // clear the mapID so we dont get into the wrong state
          this.updateCenter();
          this.updateZoom();
        }

        this.onPrintSizeChange();

        // turn this on after basemapdata has been set
        if(_cachedMap) _cachedMap.on('moveend',this.onMapUpdate);


        this.mapLoaded = true;
        this.showLoader = false;
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
        /*
        var steps = $.ptJs('info').steps;
        console.log("steps", steps);
        if(stepIndex >= steps.length ) return;

        var stepID = steps[stepIndex][0].id;
        console.log("stepID", stepID);

        /// DKESTOP
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

        /// MOBILE
        if(stepID == "zoomlevelHelpMobile" )
        {
          this.activeTabIndex = 1;
        }
        else if(stepID == "tabButton0" )
        {
          this.activeTabIndex = 1;
        }
        else if(stepID == "tabButton1" )
        {
          this.activeTabIndex = 2;
        }
        */
      },
      closeTour: function()
      {
        if($('body').itour) $('body').itour('destroy');

        /*
        if(this.tourRunning) {
          this.tourRunning = false;
          $.ptJs('end');
        }*/

      },
      runTourOnFirstVisit : function()
      {
        const storageKey = "firstPreviewTourDone";
        console.log("localStore", storageKey, localStore.getItem(storageKey));
        if(!localStore.getItem(storageKey))
        {
          localStore.setItem(storageKey,"true");
         // this.runTour();
        }
      },
      runTour : async function()
      {

        await this.loadITourScripts();

        //if(this.tourRunning) return;
        //this.tourRunning = true;

        //http://demo.masscode.ru/itour/documentation.html
        var steps;
        if(this.isDesktop) {

          steps = [{
            title: "Search",
            content: 'Search for your favorite place, this could be a city, town or zipcode',
            name:'#address-input',
            contentPosition: 'rcb'
          },{
            title: "Map Zoom",
            content: 'Zoom out for more detail or zoom in to focus on an area.',
            name:'#zoomlevelHelp'
          },{
            title: "Size Options",
            content: 'Select the print size and orientation. The pencil at the bottom helps to give you a feel of the actual poster size.',
            name:'#printsizeHelp',
            /*contentPosition: 'centerAndFocus'*/
          },{
            title: "Adjust Area",
            content: 'Drag the map around to adjust the area.',
            name:'#holder',
            /*contentPosition: 'centerAndFocus'*/
          },{
            title: "Step 2",
            content: 'Continue to the next step when you are ready.  This completes the tutorial, let\'s begin!',
            name:'#nextbuttonHelp',
            // contentPosition: 'tcc'
          }];

        }
        else{
          //isMobile

          steps = [{
            title: "Location Tab",
            content: 'Search for your favorite place, and choose a zoom level',
            name:'#tabButton0',
            contentPosition: 'tcr'
          },{
            title: "Paper Options Tab",
            content: 'Select the print size and orientation,  choose between common European sizes (imperial), or US sizes (metric).',
            name:'#tabButton1',
            contentPosition: 'tcr'
          },{
            title: "Adjust Area",
            content: 'Drag the map around to adjust the area.',
            name:'#holder',
             contentPosition: 'centerAndFocus'
          },{
            title: "Step 2",
            content: 'Continue to customize map colors when you are ready.',
            name:'#nextbuttonHelpMobile',
             contentPosition: 'tcl'
          }];
        }

        $('body').itour({
          localStore: localStore,
          CSSClass:'customitourtheme',
          introShow:true,
          introCover:'/static/assets/home/mock3.jpg',
          tourTitle:'Example «intro»',
          tourMapEnable:false,
          modalCancelVisible:true,
          tourContinue:false,
          steps:steps,
          overlayClickable: false,
          lang: {									//Default language settings
            cancelText:	'Cancel Tour',			//The text in the cancel tour button
            hideText: 'Hide Tour Map',			//The text in the hidden tour map button
            tourMapText:'•••',					//The text in the show tour button
            tourMapTitle: 'Tour Map',			//Title of Tour map button
            nextTextDefault:'Next',				//The text in the Next Button
            prevTextDefault:'Previous',				//The text in the Prev Button
            endText:'End Tour',					//sets the text for the close button in the last step of the tour
            contDialogTitle:'Continue the unfinished tour?',										//Title of continue dialog
            contDialogContent:'Click "Continue" to start with step on which finished last time.',	//Content of continue dialog
            contDialogBtnBegin:'Start from beginning',												//Text in the start button of continue dialog
            contDialogBtnContinue:'Continue',														//Text in the continue button of continue dialog
            introTitle:'Welcome', 											//Title of introduction dialog
            introContent:'This tour will tell you about the main options for Step 1.',				//Content of introduction dialog
            introDialogBtnStart:'Start Tour',															//Text in the start button of introduction dialog
            introDialogBtnCancel:'Skip'//Text in the cancel button of introduction dialog
          }
        });
      },
      setBottomButtonAnimationUpActive:function(active)
      {
        this.$refs.editorbase.setBottomButtonAnimationUpActive(active);
      }

    },
    computed: {
      ...mapGetters([
        'priceForMapSizeWithCurrencyString',
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
      printSizeOptionsAll: function(){
        let options  =[];
        let printSizes = this.$store.getters.printSizeOptions;
        for(let i =0; i< printSizes.length;++i){
          let printSizeObj = printSizes[i];
          options.push({
            value: printSizeObj.printSizeID,
            label: printSizeObj.printSizeName,
            title: '',
            subtitle: this.priceForMapSizeWithCurrencyString(printSizeObj.printSizeID)
          })
        }
        return options;
      },

      nextButtonDisabled: function(){
        return this.panelContentOutroActive;
        //return this.isActiveJobComplete || this.isActiveJobProcessing  || this.isActiveJobQueued || this.isActiveJobWaitingForResponse;
      },

      assetsLoading: function(){
        return !this.$store.state.skusAndPrintSizesLoaded;
      },
      activeJobLoaded: function(){
        return this.$store.state.activeJobLoaded;
      },

    },
    watch:{
      '$route' (to, from) {

        if(!this.currentlyActivated) return;
        // react to route changes...
        console.log("route change", to, from);
      //  this.cancelPreviewProcessing();
      },
      $mq: function(val)
      {

        // desktop <-> mobile switch
        console.log("watch: $mq ", val);
        // close tour if open to avoid issues
        this.closeTour();
      },

      activeTabIndex: function(newTabIndex)
      {

      // scrooll to bottom test
        setTimeout(()=> {
          if (newTabIndex >= 0) {
            let elem = this.$refs["tabcontent" + newTabIndex];
            console.log("elem" , elem);

            var h = $(elem.$el).height();
            //console.log("activeTabIndex elem h", h);
            if(newTabIndex == 0) h = 0;
            $("html, body").animate({scrollTop: h} /*, {easing: "easeOutQuad", duration: 300}*/);
          }
        }, 10);
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
        console.log("watch metricUnits", val);
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
          //  this.showProcessingModal();
          }

        }
      }

    },
    created: function(){
      console.log("PreviewCreatorPage created");


    },
    mounted: async function() {

      // start loader timeout to show after a delay - this is to stop it from flashing for quick loads
      const LOADER_SHOW_DELAY = 400;
      var _timeout = setTimeout(()=>{
        if(!this.mapLoaded) {
          this.showLoader = true;
        }
      }, LOADER_SHOW_DELAY);

      console.log("PreviewCreatorPage mounted");

      this.switchMetricImperialEquivalent();
      initAccordian();


      bus.$on('onCancelPreviewProcessing', ()=>{
        this.onCancelPreviewProcessing();
      });

      bus.$on("processingProgressError", ()=>{
        this.errorModalShowing  = true;
        // hide
        this.hideProcessingModal();
      });

      // load themes in advanced
      this.$store.dispatch("retrieveThemesFromServer").then(()=>{
      });

      this.activated();

      // TESTING - show processing mdoal -  coment this out
     // bus.$emit("showProcessingModal");
    },
    deactivated: function(){
      console.log("^^^ PreviewCreatorPage deactivated");
      this.deactivated();
    },
    // moved from mounted for as keep-alive means mounted is only called once
    activated: function(){

      this.activated();
    },
    beforeDestroy(){
      console.log("---- beforeDestroy");
      if(_cachedMap) _cachedMap.off('moveend',this.onMapUpdate);

    },
    beforeRouteLeave (to, from, next) {
      // called when the route that renders this component is about to
      // be navigated away from.
      // has access to `this` component instance.
      this.closeTour();

      // cancel preview processing if running

      next();
    },
    name: 'PreviewCreatorPage'
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


  .shake {
    animation: shakeAnimation 2s infinite cubic-bezier(.36,.07,.19,.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  @keyframes shakeAnimation {
    10%, 90% {
      transform: translate3d(-1px, 0, 0);
    }
    20%, 80% {
      transform: translate3d(2px, 0, 0);
    }
    30%, 50%, 70% {
      transform: translate3d(-4px, 0, 0);
    }
    40%, 60% {
      transform: translate3d(4px, 0, 0);
    }
  }


  /* USED FOR NEXT ARROW */
  .shake-hover:hover {
    animation: shakeAnimation 2s infinite cubic-bezier(.36,.07,.19,.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  @keyframes shakeAnimation {
    10%, 90% {
      transform: translate3d(-1px, 0, 0);
    }
    20%, 80% {
      transform: translate3d(2px, 0, 0);
    }
    30%, 50%, 70% {
      transform: translate3d(-4px, 0, 0);
    }
    40%, 60% {
      transform: translate3d(4px, 0, 0);
    }
  }



  .map{
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .v-label{
    color: #222222 !important;
  }

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


  /*  hide pin icon*/
  .ap-icon-pin{
    opacity: 0;
  }
  /* PLaces automplete  https://community.algolia.com/places/documentation.html#styling */



  .nextbutton{
    margin: 0px;
    text-transform: none;
    height: 65px;
    border-radius: 0px;
  }

  .nextbuttonmobile{
    padding-right: 20px;
    padding-left: 20px;
    border-radius: 0px;
    border-top-left-radius: 4px;
    text-transform:none;
    height: calc( 100% + 7px );
    bottom: 7px;
    margin: 0px;
    font-size: 16px;
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

  .content {
    flex-direction: column;
    display: flex;
    overflow: hidden;
    height: 100%;
    flex: 1 1 auto;
  }

  .HolyGrail-body {
    display: flex;
    flex: 1;
  }

  .HolyGrail-content {
    flex: 1;
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


  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
  }

</style>
