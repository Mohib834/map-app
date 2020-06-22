<template>
  <button :class="classes" class="cartbutton" @click="openCartDrawer()">

    <v-badge
            :value="nItemsInCart > 0"
            right  color="hero" style="margin-right: 20px;">
      <span  slot="badge" style="">{{nItemsInCart}}</span>
      <v-icon
              style="margin-top: 5px"
              size="30"
        :color="cartColour"
      >
        mdi-cart
      </v-icon>
    </v-badge>

  </button>
</template>

<script>
  import {bus} from "./../../main"

  export default {
    components: {

    },
    data () {
      return {
      }
    },
    props: {
      dark: {
        type: [Boolean],
        default: null
      },
      light:{
        type: [Boolean],
        default: null
      }
    },
    computed: {
      cartColour(){

        if(this.light) {
          if(this.nItemsInCart == 0) return 'grey';
          return  'black darken-1';
        }
        else{
          if(this.nItemsInCart == 0) return 'grey';
          return 'white darken-1';
        }



      },
      nItemsInCart()
      {
        return this.$store.getters.nItemsInCart;
      },
      classes(){

        console.log("classes ", this.dark);

        return {
          dark : this.dark,
          light: this.light
        };
      }
    },
    methods:{
      openCartDrawer:function(){
        bus.$emit("openCartDrawer");
      }
    },
    watch:{
    }
  }
</script>

<style scoped>
  /deep/ .v-badge__badge{
    top: -5px;
    right: -12px;
    transform: scale(1.0);

  }

  .cartbutton:hover > /deep/ .v-badge >  .v-badge__badge{
    transform: scale(1.2);
  }

  .cartbutton{
    padding: 0px;
    border: 0px solid ;
    width: 46px;
    height: 46px;
    border-radius: 50px;
  }

  .light{
    background-color: inherit;
    /*background-color: #eeeeee;*/
    color: black;
  }

  .dark{
    background-color: inherit;
    color: white;
  }

</style>
