

<template>

  <v-menu  bottom offset-y  content-class="menu">
    <template slot="activator">
      <slot name="activator"> </slot>
    </template>

    <v-list >
      <v-list-tile
        v-for="(currency, index) in currencies"
        :key="index"
        @click="setCurrencyID(currency.currencyID)"
      >
        <v-list-tile-title class="item">{{currency.currencyName + " " + currency.currencySymbol + ""  }}</v-list-tile-title>

      </v-list-tile>

    </v-list>

  </v-menu>

  <!--
    <v-dialog
      v-model="showing"
      width="400"
      :persistent="false"
    >
      <v-card>
        <v-card-title
          class="headline"
          primary-title
        >
          Change Currency
        </v-card-title>
        <v-card-text>

          <v-container fluid grid-list-md style="padding: 0px">

            <v-layout row wrap v-for="(currency, index) in currencies" :key="index" >
              <v-flex d-flex  xs12  >
                <v-btn color="primary" block @click="setCurrencyID(currency.currencyID)">
                  {{currency.currencyName + " (" + currency.currencySymbol + ")"  }}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>

      </v-card>
    </v-dialog>
  -->
</template>

<script>

  export default {
    data(){
      return {
      }
    },
    props:{
      showing : {
        type: Boolean,
        default: true
      }
    },
    computed: {
      currencies: function()
      {
        return this.$store.getters.visibleCurrencies;
      }
    },
    watch:{
      showing : function(val)
      {
        if(val == true)
        {
          // $(".trigger").toggleClass("drawn")
        }
      }
    },
    methods : {
      setCurrencyID: function(newCurrencyID)
      {
        this.close();
        this.$store.commit('setCurrencyID', newCurrencyID);
      },
      //gets called from the parent

      close : function (){
        // hide for onw
        //this.showing = false;
        //this.$router.push({ name: 'create', params: {}})
        // todo emit
        this.$emit('update:showing', false); // this will update the value prop (v-model).

      }
    },
    mounted(){

    }
  }
</script>

<style scoped>

  .v-list{
    padding: 0px;
  }
  .menu{
    border-radius: 10px;
    margin-left: -5px;
    margin-top: 5px;
    padding: 0px;
  }

  .item{
    font-size: 14px;
  }

  .modal-icon-container{
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    color: lightseagreen;
  }


</style>
