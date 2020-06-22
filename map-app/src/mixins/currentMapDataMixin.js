export default {
  methods:{
    getMapDataOrientationID: function (mapData) {
      return mapData.basemap.orientationID;
    },
    setMapDataOrientationID: function (mapData, orientationID) {
       mapData.basemap.orientationID = orientationID;
    },
    getMapDataPrintSizeID: function (mapData) {
      return mapData.basemap.printSizeID;
    }
  },
  computed:{
    
    searchString: {
      get: function () {
        console.log("searchString " ,this.$store.state.previewMap_searchString);
        return this.$store.getters.previewMap_searchString;
      },
      set: function (newValue) {
        this.$store.commit('setPreviewMap_searchString', newValue)
      }
    },
    zoom: {
      get: function () {
        console.log("zoom " ,this.$store.state.previewMap_zoom);
        return this.$store.getters.previewMap_zoom;
      },
      set: function (newValue) {
        this.$store.commit('setPreviewMap_zoom', newValue)
      }
    },
    lng: {
      get: function () {
        return this.$store.getters.previewMap_lng;
      },
      set: function (newValue) {
        this.$store.commit('setPreviewMap_lng', newValue)

      }
    },
    lat: {
      get: function () {
        return this.$store.getters.previewMap_lat;
      },
      set: function (newValue) {
        this.$store.commit('setPreviewMap_lat',  newValue)
      }
    },
    searchCountry: {
      get: function () {
        return this.$store.getters.previewMap_searchCountry;
      },
      set: function (newValue) {
        this.$store.commit('setPreviewMap_searchCountry',  newValue)
      }
    },
    searchRegion: {
      get: function () {
        return this.$store.getters.previewMap_searchRegion;
      },
      set: function (newValue) {
        this.$store.commit('setPreviewMap_searchRegion',  newValue)
      }
    },
    orientationID: {
      get: function () {
        return this.$store.getters.previewMap_orientationID;
      },
      set: function (newValue) {
        this.$store.commit('setPreviewMap_orientationID',  newValue)
      }
    },
    metricUnits: {
      get: function () {
        //console.log("metricUnits", this.$store.getters.metricUnits);
        return this.$store.getters.previewMap_metricUnits;
      },
      set: function (newValue) {
        this.$store.commit('setPreviewMap_metricUnits', newValue)
      }
    },
    printSizeID: {
      get: function () {
       // console.log("printSizeID", this.$store.getters.printSizeID);
        return this.$store.getters.previewMap_printSizeID;
      },
      set: function (newValue) {
        this.$store.commit('setPreviewMap_printSizeID', newValue)
      }
    },
    themeID: {
      get: function () {
        return this.$store.getters.previewMap_themeID;
      },
      set: function (newValue) {
        this.$store.commit('setPreviewMap_themeID',  newValue)
      }
    },
    variation: {
      get: function () {
        return this.$store.getters.previewMap_variation;
      },
      set: function (newValue) {
        this.$store.commit('setPreviewMap_variation', newValue)
      }
    },
    border: {
      get: function () {
        return this.$store.getters.previewMap_border;
      },
      set: function (newValue) {
        this.$store.commit('setPreviewMap_border', newValue)
      }
    },
    text1: {
      get: function () {
        return this.$store.getters.previewMap_text1;
      },
      set: function (newValue) {
        this.$store.commit('setPreviewMap_text1', newValue)
      }
    },
    text2: {
      get: function () {
        return this.$store.getters.previewMap_text2;
      },
      set: function (newValue) {
        this.$store.commit('setPreviewMap_text2', newValue)
      }
    },
    text3: {
      get: function () {
        return this.$store.getters.previewMap_text3;
      },
      set: function (newValue) {
        this.$store.commit('setPreviewMap_text3', newValue)
      }
    },
    styleID: {
      get: function () {
        return this.$store.getters.previewMap_styleID;
      },
      set: function (newValue) {
        this.$store.commit('setPreviewMap_styleID', newValue)
      }
    },
    waterColour: {
      get: function () {
        return this.$store.getters.previewMap_waterColour;
      },
      set: function (newValue) {
        this.$store.commit('setPreviewMap_waterColour', newValue)
      }
    },
    roadColour: {
      get: function () {
        return this.$store.getters.previewMap_roadColour;
      },
      set: function (newValue) {
        this.$store.commit('setPreviewMap_roadColour', newValue)
      }
    },
    basemapID: {
      get: function () {
        return this.$store.getters.previewMap_basemapID;
      },
      set: function (newValue) {
        console.log("set basemapID", newValue);
        this.$store.commit('setPreviewMap_basemapID', newValue)
      }
    },
    mapID: {
      get: function () {
        return this.$store.getters.previewMap_mapID;
      },
      set: function (newValue) {
        console.log("set mapID", newValue);
        this.$store.commit('setPreviewMap_mapID', newValue)
      }
    }
  }
}
