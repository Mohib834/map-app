<template>
      <div class="mockup-container"  :style="containerStyle">
          <v-flex xs12 md8 class="text-xs-center" style="z-index:  1; margin: 0">
              <img data-aos="fade-up" :src="require('@/assets/img/example/' + image)"  class="section-image" style="" alt="">
          </v-flex>
          <v-layout column  xs12 md4 class="text-xs-center " :style="{'z-index': 1 , 'color': themeNameColour}">
              <h2 class=" font-weight-normal heading locationHeading" style="margin-bottom: 0" :style="locationTextStyle"> {{locationName}} </h2>
              <h2 v-if="countryName != null" class=" font-weight-light heading locationHeading" style="font-size: 24px; margin-top: 0px; padding: 0" :style="locationTextStyle"> {{countryName}} </h2>
              <v-layout v-if="showTheme" row justify-center align-center  >
                  <h2 class=" font-weight-normal heading themeHeading" style=""> {{themeName}}  </h2>
                  <div data-aos="zoom-in" data-aos-anchor-placement="top-bottom" style="">
                      <img  class="themebutton" style="" :src="'/static/assets/colourschemes/' + themeSVG">
                  </div>
              </v-layout>
              <v-flex shrink class="text-xs-center" style="margin-top: 30px" v-if="showCustomizeButton">
                  <v-btn round dark  large color="hero" @click="editThisMap()">
                      <div style="text-transform: none; font-size: 16px">Customize & Buy </div>
                      <v-icon right size="18">mdi-brush</v-icon>
                  </v-btn>
              </v-flex>
          </v-layout>
      </div>
</template>

<script>
  export default {
    props:{
      mapData:{
        default: function () {
          return {
            searchString : 'Stockholm',
            locationName:"Stockholm",
            countryName:"Sweden",
            lat :59.3251,
            lng : 18.0711,
            zoom : 12,
            printSizeID : 4,
            orientationID : 2,
            variation: 0,
            themeID: "04 91_vintage caribbean",
            themeName:"Vintage Caribbean",
            image:"stockholm.jpg",
            themeNameColour:'#e2c951'
          }
        }
      },
      showCustomizeButton: {
        default: function () {
          return true;
        }
      },
      showTheme: {
        default: function () {
          return false;
        }
      },
      light:{
        default: function(){
          return false;
        }
      },
      reversed:{
        default: function(){
          return false;
        }
      },
      isTop: {
        default: function(){
          return false;
        }
      }
    },
    data () {
      return {
      }
    },
    computed: {
      locationName: function(){
        return this.mapData.locationName;
      },
      countryName: function(){
        return this.mapData.countryName;
      },
      searchString: function(){
        return this.mapData.searchString;
      },
      image: function(){
        return this.mapData.image;
      },
      themeSVG: function(){
        return this.mapData.themeID + ".svg";
      },
      themeName: function(){
        return this.mapData.themeName;
      },
      themeNameColour: function(){
        return this.mapData.themeNameColour;
      },
      locationTextStyle: function(){
        let col = '#eeeeeee';
        if((this.light == "") ||(this.light == true) ) col = '#000000';
        return {
          color:  col
        };
      },
      bgStyle:function(){
        let col = this.bgColour;
        console.log("------------------this.light", this.light);
        if((this.light == "") ||(this.light == true) ) col = '#eeeeeee';
        var style = {background:  col};
        if(this.isTop) style['margin-top'] = '50px';
        return style;
      },
      containerStyle:function(){
        var style = {};
        if(this.reversed) style['flex-direction'] =  'row-reverse';
        if(this.isTop) style['margin-top'] = '0px';
        return style;


      }
    },
    methods:{
      editThisMap: function(){
        // set basemapdata
        this.$store.commit('setBasemapData', {
          basemapID: null,
          lat : this.mapData.lat,
          lng : this.mapData.lng,
          zoom : this.mapData.zoom,
          printSizeID : this.mapData.printSizeID,
          orientationID : this.mapData.orientationID,
          searchString : this.mapData.searchString,
          metricUnits: false
        });
        // set mapdata
        this.$store.commit('setPreviewMap_themeID', this.mapData.themeID);
        this.$store.commit('setPreviewMap_variation', this.mapData.variation);
        this.$store.commit('setPreviewMap_text1', this.mapData.locationName);
        this.$store.commit('setPreviewMap_text2', this.mapData.countryName);
        this.$store.commit('setDefaultTagLine'); // do this after the lng and lat set

        // todo
        this.$router.push({name:'create'});

      }
    },
    mounted() {
    },
  }
</script>


<style scoped>

    .mockup-container{
        align-items: center;
        justify-content: center;
        flex-direction: row;
        flex-wrap: wrap;
        display: flex;
        margin-bottom: 50px;
        margin-top: 50px;
        width: 100%;

    }

    .section-image{
        max-width: 95vh;
        width:100%;
    }

    .work-section-bg {
        position: absolute;
        min-width: 100%;
        height: 100%;
    }

    work-section.full-width-only .work-section-bg {
        position: absolute;
        min-width: 100%;
        height: 100%;
    }

    .work-section-bg {
        height: 100%;
    }


    .work-section .work-section-bg img {
        max-width: 100%;
        min-width: 100%;
    }

    .work-section{
        font-size: 0;
        position: absolute;

        background-size: cover;
        background-position: 50%;
        overflow: hidden;
        position: relative;
        background-color: #272726;
        width: 100%;
        margin: 0 auto;
        padding-left: 0%;
        padding-right: 0%;
        margin-top: 00px;

    }

    .work-section-container{
        position: relative;
        max-width: 1400px;
        width: 100%;
        align-items: center;
        max-width: 1400px;
        justify-content: space-between;
        flex-direction: row;
        flex-wrap: wrap;
        display: flex;
        margin: 0 auto;
        padding-left: 50px;
        padding-right: 50px;
        margin-bottom: 50px;
        margin-top: 50px;

    }

    @media only screen and (max-width: 960px){
        .section-image{
            margin-bottom: 25px;
        }
    }

    @media only screen and (max-width: 600px){
        .work-section-container{
            margin-top: 25px;
            margin-bottom: 25px;
            padding-left: 25px;
            padding-right: 25px;

        }
    }
    @media only screen and (min-width: 600px){

        .section-image{
            min-width: 500px;
        }
    }


    .locationHeading{
        margin: 0;
        color: #eeeeee;
        font-size: 2.5rem;
        margin-bottom: 10px;
    }
    .themeHeading{
        margin-bottom: 0; margin-right: 10px
    }


    .themebutton {
        margin-left: 0px;
        margin-right: 0px;
        width: 35px;
        height: 100%;

        -webkit-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.5);
        -moz-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.5);
        box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.59);
        border-radius: 50px;
        transform: rotate(45deg);
    }

</style>