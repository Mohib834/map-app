/*
 * open after successful server return 'add To cart'
 */

<template>

  <v-dialog
    v-model="showing"
    max-width="400"
    persistent
    no-click-animation
  >

    <v-card>
      <v-card-text
        class="headline "
        style="margin-bottom: 0px; font-weight: 500;margin-left: -15px"
      >
        <div class="text-xs-center" v-if="isAddMode">
          Wonderful!
          <CheckmarkAnimatedForModal></CheckmarkAnimatedForModal>
        </div>
        <div class="text-xs-center" v-else="">
          Map Updated
          <CheckmarkAnimatedForModal></CheckmarkAnimatedForModal>

        </div>
      </v-card-text>

      <template v-if="!isMobile">
        <v-card-text v-if="isAddMode" class="text-xs-center textUnderTitle" >
          This poster has been added to your cart. Next step - create another, or continue to the checkout.
        </v-card-text>
        <v-card-text v-else="" class="text-xs-center textUnderTitle">
          This poster has been updated in your cart. Next step - create another, or continue to the checkout.
        </v-card-text>
        <!-- test adding the thumbnail preview here -->
      </template>


      <v-layout justify-center
                align-center align-content-center row class="innerpadding font-weight-bold">



        <v-flex shrink style="margin-right: 5px">

          <!--
          <div class="content">
            <div class="over">
              <VImage
                      style=""
                      :src="getMapThumbnailURLForMapID(mapID)"
                      :elementWidth="200"
                      :elementHeight="200"
              >
              </VImage>
            </div>
            <v-progress-circular indeterminate color="grey "></v-progress-circular>
          </div>-->

          <!--
          <div class="spinner-holder" style="background: inherit; width: 200px; height: 200px" >
            <v-progress-circular color="secondary" indeterminate size=32 width="2"></v-progress-circular>
          </div>
-->




          <!--
        -->


          <v-card flat tile class="d-flex" >
            <v-img v-if=" imageURL != null"
                    :src="imageURL"
                    :aspect-ratio="imageRatio"
                    class="grey lighten-2 previewImage"
                    :class="imageClasses"
                    style=""
            >
              <template v-slot:placeholder>
                <v-layout
                        v-if="!isMobile"
                        fill-height
                        align-center
                        justify-center
                        ma-0
                >
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-layout>
              </template>
            </v-img>
          </v-card>


        </v-flex>
      </v-layout>



        <div class="modal-icon-container">
          <!--
          <v-icon style="font-size: 90px;" color="create">mdi-check</v-icon>
          -->
          <!--
          <Checkmark></Checkmark>
          -->
        </div>
      <!--
        <v-card-text>
          <div class="text-xs-center subheading">
          <p v-if="hasDiscountOnTwo && hasDiscountOnThree && isStandardDiscountApplicable">
            For a limited time there is a <b> {{getDiscountTwoOrMore}}% </b>discount your second map, and a
            <b> {{getDiscountThreeOrMore}}% </b> discount on the third.
          </p>

          </div>
        </v-card-text>
-->
      <v-card-actions class="bottomActions">
      <v-btn   color="black" block class="subheading"  style="border: 0px; margin: 0px ; text-transform: none; height: 50px" dark  outline depressed  @click="gotoCreatePage()">
        <div style="margin-right: 0px; text-decoration: underline; ">
          Create Another Map +
        </div>
        <!--
        <v-icon right>mdi-plus</v-icon>
        -->
      </v-btn>
      </v-card-actions>
      <v-divider></v-divider>

      <v-card-actions style="padding: 10px">
        <v-layout row wrap>

          <v-btn block   color="hero" class="subheading" style="margin: 0px ; text-transform: none; height: 50px" dark  depressed  @click="gotoCheckoutPage()">
            <div style="margin-right: 0px">
            Continue to Checkout
            </div>
            <v-icon right>mdi-credit-card</v-icon>
          </v-btn>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script>
  import  commonGlobals from '../../../../common/commonGlobals'
  import currentMapDataMixin from '../../mixins/currentMapDataMixin.js'
  import {mapGetters} from 'vuex'
  import CheckmarkAnimatedForModal from '../common/CheckmarkAnimatedForModal'
  export default {
    components: {
      CheckmarkAnimatedForModal
    },
    mixins: [currentMapDataMixin],
    data(){
      return {
        imageClasses: {"previewImage-landscape" : true},
        imageRatio: 1.5,
        imageURL: null,
        itemMapID: null,
        showing: false,
        isAddMode: false
      }
    },
    props:{
    },
    computed: {
      ...mapGetters([
        'getDiscountOneOrMore',
        'getDiscountTwoOrMore',
        'getDiscountThreeOrMore',
        'hasDiscountOnOne',
        'hasDiscountOnTwo',
        'hasDiscountOnThree',
        'nItemsInCart',
        'isStandardDiscountApplicable'
      ]),
      isMobile : function(){
        return this.$mq == 'mobile';
      },

    },
    watch:{
      showing : function(val)
      {
        if(val == true)
        {
          $(".trigger").toggleClass("drawn")

        }
      }
    },
    methods : {
      getThumbnailRatio(mapData){
        let orientationID = mapData.basemap.orientationID;
        let printSizeID = mapData.basemap.printSizeID;
        let size = commonGlobals.getPrintMapSizeInInches(printSizeID, orientationID);
        console.log("getThumbnailRatio ", mapData, size);
        return size.width/ size.height;
      },

      //gets called from the parent
      showAddMode: function(mapData)
      {
        this.itemMapID = mapData.mapID;
        console.log("[Model showAddMode] mapID", this.itemMapID);
        this.showing = true;
        this.isAddMode = true;
        // todo  set the mapID
        this.imageURL = this.$store.getters.getMapThumbnailURLForMapID(mapData.mapID);
        this.imageRatio = this.getThumbnailRatio(mapData);
        this.updateImageClasses(mapData);

      },
      showUpdateMode: function(mapData)
      {
        this.itemMapID = mapData.mapID;
        console.log("[Model showUpdateMode] mapID", this.itemMapID);
        this.showing = true;
        this.isAddMode = false;
        //$(".trigger").toggleClass("drawn")
        // todo  set the mapID
        this.imageURL = this.$store.getters.getMapThumbnailURLForMapID(mapData.mapID);
        this.imageRatio = this.getThumbnailRatio(mapData);
        this.updateImageClasses(mapData);

      },
      updateImageClasses: function(mapData){
        let orientationID = mapData.basemap.orientationID;
        if(orientationID == commonGlobals.ORIENTATION_ID_LANDSCAPE){
          this.imageClasses = {"previewImage-landscape": true};
        }
        else{
          this.imageClasses = {"previewImage-portrait": true};
        }
      },
      gotoCartPage : function (){
        this.$router.push({ name: 'cart', params: {}})
      },
      gotoCheckoutPage : function (){
        this.$router.push({ name: 'checkout', params: {}})
      },
      gotoCreatePage : function (){
        this.$router.push({ name: 'create', params: {}})
      }
    },
    mounted(){

    }
  }
</script>

<style>

  .v-image__image{
    z-index: 10;
  }
</style>

<style scoped>
/deep/ .v-image__image{
  z-index: 10000 !important;
}
  .previewImage{
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.4);
  }

  .previewImage-landscape{
    width: 300px !important;
  }
  .previewImage-portrait{
    width: 220px !important;
  }

  .bottomActions{
    padding: 10px;
    margin-top: 20px;
  }
  @media only screen and (max-width: 600px) {
    .previewImage-landscape{
      width: 250px !important;
    }
    .previewImage-portrait{
      width: 150px !important;
    }

    .previewImage {
      width: 150px;
    }

    .textUnderTitle{
      padding-top: 10px;
      padding-bottom: 10px;
    }
    .bottomActions{
      margin-top: 0px;
    }

  }


  .content {
    display: inline-flex;
    position:relative;
  }

  .over {
    position:absolute;

    background-color: rgba(255, 0, 0, 0.8);
  }

  .spinner-holder{
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
  }


  .modal-icon-container{
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  color: lightseagreen;

}


//https://codepen.io/houbly/pen/yyzajr
  ///tick

.circ{
  opacity: 0;
  stroke-dasharray: 130;
  stroke-dashoffset: 130;
  -webkit-transition: all 1s;
  -moz-transition: all 1s;
  -ms-transition: all 1s;
  -o-transition: all 1s;
  transition: all 1s;
}
.tick{
  stroke-dasharray: 50;
  stroke-dashoffset: 50;
  -webkit-transition: stroke-dashoffset 1s 0.5s ease-out;
  -moz-transition: stroke-dashoffset 1s 0.5s ease-out;
  -ms-transition: stroke-dashoffset 1s 0.5s ease-out;
  -o-transition: stroke-dashoffset 3s 1.5s ease-out;
  transition: stroke-dashoffset 3s 1.5s ease-out;
}
.drawn + svg .path{
  opacity: 1;
  stroke-dashoffset: 0;
}


</style>
