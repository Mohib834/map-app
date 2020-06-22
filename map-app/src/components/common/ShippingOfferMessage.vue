/*
* shipping offer toast notification
*/

<template>

  <v-alert

    v-if="hasShippingOffer"
    v-model="shippingOfferMessageShowing"
    color="primary"
    class="alert-container"
    dark


  >
    <v-layout row style="width:100%; padding: 0;" align-center>
      <v-flex>
    <div class="text-xs-center" v-html="textString">
    </div>
      </v-flex>
    <!--
    <v-btn
      color="white"
      flat
      icon
      large
      @click="close()"
    >
      <v-icon dark>mdi-close</v-icon>
    </v-btn>
    -->
    </v-layout>

  </v-alert>

</template>

<script>
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'
  //import commonGlobals from '../../../../common/commonGlobals'
  var commonGlobals = require('../../../../common/commonGlobals');

  export default {
    data(){
      return {
      }
    },
    props:{

    },
    computed: {
      ...mapGetters([
        'hasShippingOffer','shippingOfferID' ,'shippingOfferMessageClosed'
      ]),
      shippingOfferMessageShowing:{
        get : function (){
          return !this.$store.state.shippingOfferMessageClosed;
        },
        set : function(val){
           this.$store.state.shippingOfferMessageClosed = !val;

        }
      },
      textString: function (){
        let offerID = this.shippingOfferID;
        let str = "<b> FREE </b> shipping on all orders ";

        console.log("---------------offerID", offerID, commonGlobals.SHIPPING_OFFER_ID_US_STANDARD_ONLY);

        if(offerID == commonGlobals.SHIPPING_OFFER_ID_US_STANDARD_ONLY)
        {
          str += " to the US!";
          return str;
        }
        else if(offerID == commonGlobals.SHIPPING_OFFER_ID_WORLDWIDE_STANDARD)
        {
          str += " worldwide";
          return str;
        }
        return "";
      }
    },
    watch:{

    },
    methods : {
      close: function(){
        this.shippingOfferMessageShowing = false;
      }
    },
    mounted(){

    }
  }
</script>

<style scoped>
  .alert-container{
    background: #cfbda5 !important;
    position: absolute;
    width: 100% ;
    height: 40px;
    top:56px;
    margin-top: 0px;
    margin: 0;
    font-size:1.0em;
    padding: 0;
    border-color: inherit;
    border-width: 0;
    z-index:2;
  }
</style>
