<template>
  <div >

    <div >
      <section class="site-section"    >
        <content class="work-section-container">
          <v-container fluid style="font-size: 16px" >


            <OrderDetails :status="false" :route_orderReferenceID="route_orderReferenceID">
              <template slot="prepend">
                <v-layout column wrap style="font-size: 20px">
                  <v-flex xs12 >
                    <v-layout row`>
                      <Checkmark></Checkmark>
                      <h2 class=" display-2 font-weight-light"  style="padding-top: 20px; padding-left: 70px">Thank you!</h2>
                    </v-layout>
                    <h3 class="subheading font-weight-normal">
                      Your order is confirmed.  Come back to this page for updates on your shipment status.
                    </h3>
                  </v-flex>
                  <v-flex xs12 text-xs-center>
                  </v-flex>

                  <v-flex shrink style="margin-top: 20px">
                    <v-btn dark large color="hero" class=" title font-weight-light " style="border-radius: 30px; height: 50px; text-transform: none" @click="gotoHomePage()">Go To Home Page</v-btn>
                  </v-flex>
                </v-layout>
                <v-divider style="margin-top: 40px"></v-divider>
              </template>
            </OrderDetails>

          </v-container>

        </content>
      </section>
    </div>
    <SiteFooter></SiteFooter>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'
  import Checkmark from '../components/common/CheckmarkAnimated'
  import OrderDetails from '../components/common/OrderDetails'


  export default {
    components: {
      Checkmark,
      OrderDetails
    },
    data () {
      return {
      }
    },
    props: {
      route_orderReferenceID: {
        type: [String, Number],
        default: null
      },
    },
    computed: {
      ...mapGetters([
        'orderID',

      ]),
      getOrderIDLabel: function()
      {
        if(this.orderID == null) return "n/a";
        return this.orderID;
      }
    },
    methods:{
      gotoHomePage : function(){
        this.$router.push({ name: 'home', params: {} })

      }
    },
    watch:{
    }
  }
</script>

<style scoped>

  .site-section{
    background-color: #fff;
    border-bottom: 1px solid #e4e9ec;
    padding: 2rem 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }


  .Site {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    justify-content: space-between;

  }

  .Site-content {
    flex: 1;
  }
</style>
