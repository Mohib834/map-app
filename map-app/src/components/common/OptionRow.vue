<!--
Row of option buttons
-->
<template>
  <!--
    <v-btn-toggle v-model="showFrameToggle">
      <v-btn flat>
        18 x24
      </v-btn>
      <v-btn flat>
        18 x24
      </v-btn>
      <v-btn flat>
        18 x24
      </v-btn>
      <v-btn flat>
        18 x36
      </v-btn>
    </v-btn-toggle>
  -->

    <div class="rowcontainer">
      <template v-for="(option, index) in options">
        <div  class="button" v-bind:class="{ active: (value == option.value), primary: (value == option.value)}" v-on:click="onClick(option.value)" >
          <v-layout column class="text-xs-center justify-center">
            <v-flex v-if="option.title" class="text-xs-center justify-center font-weight-bold" style="font-size: 0.9em" >
              {{option.title}}
            </v-flex>
            <v-layout row class="text-xs-center justify-center">
              {{option.label}}
              <v-icon v-if="option.icon" style="margin-left: 5px;" :dark="value == option.value" :light="value != option.value" >{{option.icon}}</v-icon>
            </v-layout>
            <v-flex  v-if="option.subtitle" class="text-xs-center justify-center" style="font-size: 0.8em; font-style: italic" >
              {{option.subtitle}}
            </v-flex>
            <v-flex   v-if="option.svgIcon">
              <div :style="{'background': (value == option.value) ? 'white' : '#444444' }" style="width: 24px; height: 24px; margin-top: 5px" :class="option.svgIcon"></div>
            </v-flex>


          </v-layout>
        </div>
        <div v-if="index < (options.length - 1)" class="gap"></div>
      </template>
    </div>

</template>

<script>
  export default {
    props: {
      value: {
        type: [Number, String, Boolean],
        default: function () {
          return 1;
        }
      },
      options: {
        type: Array,
        default: function () {
          return [{value: 1, label: "DEFAULT1"},{value: 2, label: "DEFAULT2"}];
        }
      }
    },
    data () {
      return {
        showFrameToggle :1
      }
    },
    methods:{
        onClick : function(selectedValue)
        {
          //this.value= selectedValue;
          this.$emit('input', selectedValue); // this will update the value prop (v-model).
        }
    },
    watch:{

    }
  }
</script>

<style scoped>

  .icon-style-bar {

    mask-size: cover;
    margin: 0 auto;
    mask: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!-- Generator: Adobe Illustrator 19.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 58 58' style='enable-background:new 0 0 58 58;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:none;stroke:%23000000;stroke-width:2;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:10;%7D .st1%7Bfill:url(%23SVGID_1_);%7D%0A%3C/style%3E%3Cpolyline class='st0' points='3.4,13.2 3.4,51.3 54.6,51.3 54.6,13.2 '/%3E%3Crect x='69' y='-7' width='29.4' height='19.4'/%3E%3Crect x='3.4' y='34.7' width='51.2' height='16.6'/%3E%3C/svg%3E%0A");
  }

  .icon-style-fade {

    mask-size: cover;
    margin: 0 auto;
    mask: url("data:image/svg+xml,%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 58 58' style='enable-background:new 0 0 58 58;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:none;stroke:%23000000;stroke-width:2;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:10;%7D .st1%7Bfill:url(%23SVGID_1_);%7D%0A%3C/style%3E%3Cpolyline class='st0' points='3.4,13.2 3.4,51.3 54.6,51.3 54.6,13.2 '/%3E%3Crect x='69' y='-7' width='29.4' height='19.4'/%3E%3Crect x='78' y='24.4' width='48.9' height='15.6'/%3E%3ClinearGradient id='SVGID_1_' gradientUnits='userSpaceOnUse' x1='29' y1='18.3333' x2='29' y2='51.3333'%3E%3Cstop offset='0' style='stop-color:%23000000;stop-opacity:0'/%3E%3Cstop offset='0.7092' style='stop-color:%23000000'/%3E%3C/linearGradient%3E%3Crect x='3.4' y='18.3' class='st1' width='51.2' height='33'/%3E%3C/svg%3E%0A");
  }

  .icon-style-float {

    mask-size: cover;
    margin: 0 auto;
    mask: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!-- Generator: Adobe Illustrator 19.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 58 58' style='enable-background:new 0 0 58 58;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:none;stroke:%23000000;stroke-width:2;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:10;%7D .st1%7Bfill:url(%23SVGID_1_);%7D%0A%3C/style%3E%3Cpolyline class='st0' points='3.4,13.2 3.4,51.3 54.6,51.3 54.6,13.2 '/%3E%3Crect x='14.3' y='24.8' width='29.4' height='16.3'/%3E%3C/svg%3E%0A");
  }





  svg {
  }

  .rowcontainer{
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
    margin: 5px 0px;
  }

  .button{
    margin: 0px;
    padding-top: 10px;
    padding-bottom: 10px;
  //height: 3px;
    flex-basis: 100%;
    display: flex;
    flex-grow: 1;
    align-items: center;
    align-content: center;
    background: #eeeeee;
    justify-content: center;
    color: #222222;
    border-radius: 4px;
    font-size: 1.1em;

    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;

  }
  .button:hover{
    background: #dddddd;
    cursor: pointer;
  }

  .active{

    color: #FFFFFF;
  }
  .active:hover {
    background: #07a3e5;
  }

  .gap{
    margin-left: 5px;
  }

</style>
