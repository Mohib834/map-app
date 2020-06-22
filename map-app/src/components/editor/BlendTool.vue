
<template>
    <DraggableContainer containerID="blendTool" title="Blend Tool" :initialXPos="510" :initialYPos="600" v-model="show">
            <!--
        <v-btn @click="randomtest()">test</v-btn>-->
            <v-layout row align-center style="margin: 5px; padding: 0">
                <div style="margin-right: 10px">Original</div>
                <ColourButton style="width:100%" @click.native="swatchColourSelected(orginalColour)"  :parentObject="orginalColour" ></ColourButton>
            </v-layout>
            <v-layout row align-center style="margin: 5px; margin-bottom: 0px; padding: 0; height: 40px">
                <ColourButton style="width:50px;height: 100%" @click.native="colourSelected(colour1)" paramName="colour" :parentObject="colour1" ></ColourButton>
                <v-icon size="20" style="margin-left:5px; margin-right:5px">mdi-plus</v-icon>
                <ColourButton style="width:50px;height: 100%" @click.native="colourSelected(colour2)" paramName="colour" :parentObject="colour2" ></ColourButton>
                <v-icon size="20" style="margin-left:5px; margin-right:5px">mdi-equal</v-icon>
                <ColourButton style="width: 50px; height:50px; border-radius: 50px; pointer-events: none; box-shadow: none; -webkit-box-shadow: none"  :parentObject="blendCol" ></ColourButton>

            </v-layout>
            <v-layout row align-center style="margin: 5px; padding: 0">
                <v-slider
                        label="Ratio"
                        v-model="blendRatio"
                        thumb-label
                        min="0"
                        max="1"
                        step="0.01"
                        style="margin-right: 15px"
                >
                </v-slider>
                <v-text-field
                        v-model="blendRatio"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        style="width: 70px; border: 1px solid #aaaaaa; font-size: 1em ;padding-left: 5px; border-radius: 4px"

                ></v-text-field>
            </v-layout>
            <v-layout row align-center style="padding: 5px; padding: 0; border-top: 1px solid #aaaaaa">
                <v-checkbox  color="primary" v-model="autoApply" label="auto-apply"></v-checkbox>
                <v-btn v-if="!autoApply" dark color="primary" @click="apply()">Apply</v-btn>
            </v-layout>

    </DraggableContainer>
</template>

<script>
  import currentMapDataMixin from '../../mixins/currentMapDataMixin'
  import {bus} from "./../../main"
  import ColourButton from "./ColourButton";
  import DraggableContainer from "./DraggableContainer";

  export default {
    mixins:[
      currentMapDataMixin
    ],
    components:{
      DraggableContainer,
      ColourButton
    },
    data(){
      return {
        show: false,
        orginalColour: [100,100,100],
        autoApply : true,
        blendRatio: 0.5,
        colour1: {colour:[100,100,100]},
        colour2: {colour:[100,100,100]},

      }
    },
    props:{

    },
    computed: {
      blendCol: function() {
        var a = this.colour1.colour;
        var b = this.colour2.colour;
        var r = this.blendRatio;
        return [
          r*b[0]+ (1-r)*a[0],
          r*b[1]+ (1-r)*a[1],
          r*b[2]+ (1-r)*a[2],
        ];
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

    },
    watch:{
      blendCol: function(){
        if( this.autoApply) this.apply();
      },

    },
    methods : {
      apply: function(){
        // apply the colour
        bus.$emit("setThemeColour", this.blendCol);
      },
      colourSelected: function(colobj){
        bus.$emit("openColourEditor", {
          parentObject: colobj ,
          paramName: "colour"
        });
      },
      onSegmentColourSelected: function(obj){
        var col = obj.parentObject[obj.paramName];
        this.colour1.colour = col;
        this.colour2.colour = col;
        this.orginalColour = col;
      },
      swatchColourSelected: function(col){
        bus.$emit("setThemeColour", col);
      }
    },
    mounted(){
      //bus.$on("openColourEditor", this.openColourEditor);
      bus.$on("onSegmentColourSelected", this.onSegmentColourSelected);

    }
  }
</script>

<style scoped>


</style>
