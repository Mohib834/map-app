<template>
    <div >
        <div class="work-section-container">
            <HeroTextSection>
                <template slot="title">
                    Find My Order.
                </template>
                <template slot="subtitle">
                    Enter your details below to check the status of your order.  Your Order Reference ID can be found in the confirmation email.
                </template>
            </HeroTextSection>
            <v-container fluid>
                <v-layout row wrap style="max-width: 800px; justify-content: flex-start" >
                    <v-flex xs6 >
                        <v-text-field
                                solo
                                ref="orderReference"
                                v-model.sync="orderReferenceID"
                                label="Order Reference ID *"
                                required
                                placeholder=""
                                persistent-hint
                                style="margin: 0; border-top-right-radius: 0 ; border-bottom-right-radius: 0px !important;"
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs6 >
                        <v-btn style="height: 49px; margin: 0; border-top-left-radius: 0; border-bottom-left-radius: 0; text-transform: capitalize" @click="findMyOrderLogin()" color="primary" :loading="loading">
                            Find My Order
                        </v-btn>
                    </v-flex>
                    <v-flex xs12 >
                        <v-alert
                                v-show="errorMessage"
                                :value="true"
                                color="error"
                                icon="mdi-alert-circle"
                                outline
                        >
                            {{errorMessage}}
                        </v-alert>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>
        <SiteFooter></SiteFooter>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    props: {
    },
    data () {
      return {
        loading : false,
        orderReferenceID: "",
        errorMessage:null
      }
    },
    computed: {
      ...mapGetters([
        'supportEmail'
      ]),
    },
    methods:{
      validateForm: function(){
        return (this.orderReferenceID != "") ;
      },
      findMyOrderLogin: function(){

        console.log('findMyOrderLogin');

        if(!this.validateForm())
        {
          this.errorMessage = "please enter order reference";
        }
        else {
          console.log(this.orderReferenceID);
          this.$router.push({name: 'order', params: {route_orderReferenceID: this.orderReferenceID}});
        }
      },
      getFormattedAnswer : function(str)
      {
        return str.replace("{{supportemail}}", "<i>"+ this.supportEmail +"</i>");
      }
    },
    watch:{
    }
  }
</script>

<style scoped>

</style>
