<template>
    <div >
        <v-layout column wrap justify-center align-center >
            <h2 class="display-4 font-weight-light text-xs-center"  style="margin-top: 20px;">Oops!</h2>
            <h3 class="display-1 font-weight-light text-xs-center">
                We're sorry, this page cannot be found.
            </h3>
            <v-btn dark large color="hero" class=" title font-weight-light " style="margin-top: 30px; border-radius: 30px; height: 50px; text-transform: none" @click="gotoHomePage()">Home Page</v-btn>
        </v-layout>
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
    .flex{
        display: flex;
    }


</style>
