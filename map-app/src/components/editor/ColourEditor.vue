
<template>
    <DraggableContainer containerID="colourEditor" title="Colour Editor" :initialXPos="810" :initialYPos="100" v-model="show">
        <!--
    <v-btn @click="randomtest()">test</v-btn>-->
        <v-layout row align-center style="margin: 5px; padding: 0">
            <div style="margin-right: 10px">Original</div>
            <ColourButton style="width:100%" @click.native="swatchColourSelected(orginalColour)"  :parentObject="orginalColour" ></ColourButton>
        </v-layout>
        <v-layout row wrap style="margin: 5px; padding: 0; margin-bottom: 10px">
            <template
                    v-for="(colour, index) in otherSwatchColours"
                    @click=""
            >
                <ColourButton @click.native="swatchColourSelected(colour)"  :parentObject="colour"  style="margin-right: 2px;margin-bottom: 2px"></ColourButton>
            </template>
        </v-layout>
        <v-layout row wrap style="margin: 5px; padding: 0; margin-bottom: 10px">
            <template
                    v-for="(segment, index) in segmentColours"
                    @click=""
            >
                <ColourButton @click.native="swatchColourSelected(segment['colour'])"  :parentObject="segment" paramName="colour" style="margin-right: 2px;margin-bottom: 2px"></ColourButton>
            </template>
        </v-layout>


        <Picker v-model="pickercolor"></Picker>
    </DraggableContainer>
</template>

<script>
  import currentMapDataMixin from '../../mixins/currentMapDataMixin'
  import {bus} from "./../../main"
  import { Chrome } from 'vue-color'
  import ColourButton from "./ColourButton";
  import DraggableContainer from "./DraggableContainer";
 // import { Photoshop } from 'vue-color'


  export default {
    mixins:[
      currentMapDataMixin
    ],
    components:{
      DraggableContainer,
      ColourButton,
      'Picker': Chrome,

    },
    data(){
      return {
        show: false,
        orginalColour: [100,100,100],
        parentObject: {col:[100,100,100]},
        paramName: "col",
        pickercolor: {rgba:{ r: 51, g: 51, b: 51 }},
      }
    },
    props:{

      showing : {
        type: Boolean,
        default: true
      }
    },
    computed: {
      otherSwatchColours: function(){
        // black/white and the average of the swatches
        var cols = [[0,0,0], [255,255,255],[217,204,167]];
        cols.push(this.averageColour);
        return cols;
      },
      averageColour: function(){
        var segments = this.segmentColours;
        if(!segments) return [0,0,0];

        var n = segments.length;
        var average = [0,0,0];
        var sum = 0;
        for(var i =0; i < n;++i){
          var segment = segments[i].colour;
          var weight = segments[i].weight;
          average[0] += segment[0]*weight;
          average[1] += segment[1]*weight;
          average[2] += segment[2]*weight;
          sum += weight;
        }
        average[0] /= sum;
        average[1] /= sum;
        average[2] /= sum;
        average[0] = Math.floor(average[0]);
        average[1] = Math.floor(average[1]);
        average[2] = Math.floor(average[2]);
        return average;
      },
      segmentColours : function(){
        if(this.$store.getters.currentTheme) {
          return this.$store.getters.currentTheme.segments;
        }
        return null;
      },
      currentTheme: function(){
        return this.$store.getters.currentTheme;
      },
      colour : {
        get: function () {
            /*
         var obj = this.$store.getters.editingColourParentObject;
          var param =  this.$store.getters.editingColourParamName;
          console.log("obj", obj, "param", param, obj[param]);
          return obj[param];
          */

          return this.parentObject[this.paramName];
        },
        set: function (newValue) {
          /*
          var obj = this.$store.getters.editingColourParentObject;
          var param =  this.$store.getters.editingColourParamName;
          obj[param] = newValue;
           */
          this.parentObject[this.paramName] = newValue;
        }
      },
    },
    watch:{


        colour:function(val){
          // set the colour
          this.pickercolor = { r:val[0],g:val[1],b:val[2]};
          console.log("this.pickercolor", this.pickercolor);
          bus.$emit("refreshMapWidget");
        },
        pickercolor:function(val, old) {
          console.log("pickercolor", val, old);
          var rgba = val.rgba;
          var oldrgba = old.rgba;
          if(rgba && oldrgba) {
            var isSame = (rgba.r == oldrgba.r) && (rgba.g == oldrgba.g) && (rgba.b == oldrgba.b);
            if (!isSame) {
              this.colour = [rgba.r, rgba.g, rgba.b];
              console.log("pickercolor", rgba, this.colour);
            }
          }
        }
    },
    methods : {
      swatchColourSelected: function(col){
        this.colour = col;
      },
      randomtest:function(){
        this.colour = [Math.round(Math.random()*255),Math.round(Math.random()*255),Math.round(Math.random()*255)];
      },
      openColourEditor: function(obj){
        this.parentObject = obj.parentObject;
        this.paramName = obj.paramName;

        //save the current colour
        this.orginalColour = this.parentObject[this.paramName];
        console.log('openColourEditor');
        bus.$emit('openContainer', 'colourEditor');
      },

    },
    mounted(){
      bus.$on("openColourEditor", this.openColourEditor);
      bus.$on("colourSwatchSelected", this.swatchColourSelected);

    }
  }
</script>

<style scoped>
</style>
