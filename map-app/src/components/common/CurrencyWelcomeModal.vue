
<template>
  <v-dialog
    v-model="modalShowing"
    persistent
    width="400"
  >
    <v-card
      color="white"
      light
    >
      <v-card-actions style="padding-left: 5px; padding-top: 15px" class="text-xs-left">
        <v-spacer></v-spacer>

        <div class="headline font-weight-normal text-xs-left" style="margin-left: 5px" >
            Welcome!
        </div>
        <v-spacer></v-spacer>
        <v-btn flat icon light @click="modalShowing=false"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-actions>

      <v-card-text style="padding-top: 5px; " >

        <div class="text-xs-left" style="margin-bottom: 20px">
          Please select the currency that is most appropriate to you
        </div>


        <v-list>
          <div v-for="(location, index) in locations" :key="index">

            <v-divider v-if="index == 0"></v-divider>
            <v-list-tile
              @click="setCurrencyID(location.currencyID)" >
              <v-list-tile-title>
                <v-layout row wrap>
                  <v-flex xs6 class="font-weight-bold">
                    {{ getCurrencyName(location.currencyID) + " " + getCurrencySymbol(location.currencyID) }}
                  </v-flex>
                  <v-flex xs6>
                    {{location.location}}
                  </v-flex>
                </v-layout>

              </v-list-tile-title>

            </v-list-tile>
            <v-divider></v-divider>
          </div>

        </v-list>




      </v-card-text>

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


  export default {
    name: 'CurrencyWelcomeModal',
    data(){
      return {
        modalShowing : false,
        locations : [
          {
            "currencyID": 1,
            "location": "United States"
          },
          {
            "currencyID": 2,
            "location": "Europe"
          },
          {
            "currencyID": 3,
            "location": "United Kingdom"
          },
          {
            "currencyID": 1,
            "location": "International"
          }
        ]
      }
    },
    mounted(){
      bus.$on('showWelcomeModal', (params)=> {
        this.showCloseButton = (params) ? !params.hideCloseButton: true;
        this.modalShowing = true;
      });
      bus.$on('hideWelcomeModal', ()=> {
        this.modalShowing = false;
      });
    },
    props: {

    },
    methods:{
      getCurrencyName : function(currencyID)
      {
        let currency = this.getCurrencyById(currencyID);
        return currency.currencyName;
      },
      getCurrencySymbol : function(currencyID)
      {
        let currency = this.getCurrencyById(currencyID);
        return currency.currencySymbol;
      },
      getCurrencyById : function(currencyID)
      {
        return this.$store.getters.getCurrencyById(currencyID);
      },
      setCurrencyID: function(newCurrencyID)
      {
        this.$store.commit('setCurrencyID', newCurrencyID);
        this.modalShowing = false;
      },
    },
    computed: {
      ...mapGetters([
        'printSizeOptions',
        'orientationOptions',
        'activeJobEstimatedQueueDuration',
        'isActiveJobLoaded',
        'isActiveJobWaitingForResponse', 'isActiveJobProcessing', 'isActiveJobQueued', 'isActiveJobComplete', 'isActiveJobError', 'isActiveJobViewed', 'activeJobBasemapID', 'hasActiveJob',
        'activeJobQueueProcessPercentage', 'activeJobQueuePosition'
      ]),
      currencies: function()
      {
        return this.$store.state.currencies;
      }

    },
    watch:{

    }
  }
</script>

<style scoped>

</style>
