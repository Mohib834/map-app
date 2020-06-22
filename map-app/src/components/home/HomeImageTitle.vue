<template>
    <v-layout  row class="font-weight-medium headline"  style="padding: 20px; margin-bottom: 50px; box-shadow:  0 1px 1px 0 #00000033; margin-left: 1px; margin-right:  1px" :style="" >

        <v-flex > {{location}} </v-flex>
        <!--<v-icon size="24" color="grey lighten-1" style=" margin-left: 10px; margin-right: 10px">mdi-close </v-icon> -->
        <span style="" class="font-weight-light">{{themeName}} <img  class="themebutton" style="" :src="themeSvgPath"> </span>
    </v-layout>
</template>

<script>
  export default {
    name: "HomeImageTitle",
    props: {
      location:{
        type:String
      },
      themeName:{
        type:String
      },
      themeSvg: {
        type:String
      }

    },
    computed:{
      themeSvgPath: function(){
        return "/static/assets/colourschemes/" + this.themeSvg;
      }
    },
    mounted: function () {
    }
  }
</script>


<style scoped>
    .themebutton {
        margin-left: 3px;
        margin-right: 4px;
        margin-bottom: -4px;

        width: 25px;

        -webkit-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.1);
        -moz-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.1);
        box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.3);
        border-radius: 50px;
        transform: rotate(45deg);
    }

</style>