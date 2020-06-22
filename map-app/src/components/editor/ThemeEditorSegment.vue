

<template>
    <v-layout  row class="row" :class="{'selected' :selected}" align-center>
        <div style="width: 30px">{{(index+1)+'.'}}</div>
        <colourbutton style="margin-right: 15px" @click.native="segmentColourSelected()"  :parentObject="segment" paramName="colour"></colourbutton>
        <!--
        <div>{{"weight:" + segment.weight}}</div>
           -->
         <input class="weightInput" type="number" min="0" name="weight" v-model="weight" @change="onWeightChange()" @focus.native="segmentColourSelected()">
        <v-spacer></v-spacer>
        <v-btn icon small @click="remove()" style="margin: 0"> <v-icon size="16">mdi-close</v-icon></v-btn>
    </v-layout>
</template>

<script>
    // colour picker
    //https://github.com/xiaokaike/vue-color
    import {bus} from "./../../main"
    import  colourbutton from './ColourButton'

  export default {
    mixins:[
    ],
    components:{
      colourbutton : colourbutton
    },
    data(){
      return {
      }
    },
    props:{
      selected:{
        type: Boolean,
        default: false
      },
      index:{
        type:Number,
        default: 0
      },
      segment : {
        type: Object,
        default: function(){
          return {"colour":[233,221,195],"weight":13}
        }
      },

    },
    computed: {
        weight:{
          get: function () {
            return this.segment.weight;
          },
          set: function(val){

            try {
              var w = Number.parseFloat(val);
              this.segment.weight = w;
              console.log("weight set" , this.segment, this.segment.weight);
              bus.$emit("refreshMapWidget");
            }
            catch(e){

            }
          }
        }
    },
    watch:{

    },
    methods : {
      segmentColourSelected: function(){
        console.log("segmentColourSelected");
        bus.$emit('segmentColourSelected', this.index);
      },
      onWeightChange: function(){

      },
      remove: function(){
        // remove this
        this.$store.getters.currentTheme.segments.splice(this.index, 1);
      }
    },
    mounted(){

    }
  }
</script>

<style scoped>

    .weightInput{
        border-radius: 4px;
        width:50px;
        border: 1px solid #aaaaaa;
        padding-left: 3px;
        padding-right: 3px;
        height: 30px;

    }

    .row{
        padding-left: 7px;
        padding-right: 7px;
        padding-top: 4px;
        padding-bottom: 4px;
        border-bottom: 1px solid #dddddd;
        margin: 0px;
    }

    .selected{
        background-color: lightgrey;
    }

</style>
