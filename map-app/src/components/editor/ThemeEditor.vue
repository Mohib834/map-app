
<template>
    <DraggableContainer containerID="themeEditor" title="Theme Editor" :initialXPos="310" :initialYPos="100" v-model="show">

        <OpenContainerButton containerID="colourExtract" label="Colour Extract Tool"></OpenContainerButton>
        <OpenContainerButton containerID="blendTool" label="Blend Tool"></OpenContainerButton>

        <v-layout class="row-section" row align-center style="margin-right: 10px;" v-if="previewColours != null">
            <ThemeIconDynamic :theme="currentTheme"></ThemeIconDynamic>
            <v-spacer></v-spacer>
            <ColourButton @colourSelected="previewColourSelected"  :parentObject="previewColours[0]" paramName="colour"></ColourButton>
            <ColourButton @colourSelected="previewColourSelected"  :parentObject="previewColours[1]" paramName="colour"></ColourButton>
            <ColourButton @colourSelected="previewColourSelected"  :parentObject="previewColours[2]" paramName="colour"></ColourButton>
            <ColourButton @colourSelected="previewColourSelected"  :parentObject="previewColours[3]" paramName="colour"></ColourButton>
        </v-layout>


        <v-layout class="row-section" row align-center style="margin-right: 10px;" v-if="textColours != null">
            <div class="left-label">Text Cols</div>
            <v-spacer></v-spacer>
            <ColourButton @colourSelected="textColourSelected"  :parentObject="textColours[0]" paramName="colour"></ColourButton>
            <ColourButton @colourSelected="textColourSelected"  :parentObject="textColours[1]" paramName="colour"></ColourButton>
            <ColourButton @colourSelected="textColourSelected"  :parentObject="textColours[2]" paramName="colour"></ColourButton>
        </v-layout>

        <v-layout class="row-section" row align-center>
            <div class="left-label">Road</div>
            <ColourButton @click.native="roadColourSelected()"  :parentObject="currentTheme" paramName="road"></ColourButton>
            <v-spacer></v-spacer>
            <!-- quick swatches -->
            <ColourButton class="quickswatch" @click.native="roadColourSelected(quickSwatches['black'])"  :parentObject="quickSwatches" paramName="black"></ColourButton>
            <ColourButton class="quickswatch" @click.native="roadColourSelected(quickSwatches['white'])"  :parentObject="quickSwatches" paramName="white"></ColourButton>
            <ColourButton class="quickswatch" @click.native="roadColourSelected(quickSwatches['cream'])"  :parentObject="quickSwatches" paramName="cream"></ColourButton>
            <ColourButton class="quickswatch" @click.native="roadColourSelected(averagedThemeColour)"  :parentObject="averagedThemeColour" ></ColourButton>

        </v-layout>
        <v-layout class="row-section" row align-center>
            <div class="left-label">Water</div>
            <ColourButton @click.native="waterColourSelected()"  :parentObject="currentTheme" paramName="water"></ColourButton>
            <v-spacer></v-spacer>
            <!-- quick swatches -->
            <ColourButton class="quickswatch" @click.native="waterColourSelected(quickSwatches['black'])"  :parentObject="quickSwatches" paramName="black"></ColourButton>
            <ColourButton class="quickswatch" @click.native="waterColourSelected(quickSwatches['white'])"  :parentObject="quickSwatches" paramName="white"></ColourButton>
            <ColourButton class="quickswatch" @click.native="waterColourSelected(quickSwatches['cream'])"  :parentObject="quickSwatches" paramName="cream"></ColourButton>
            <ColourButton class="quickswatch" @click.native="waterColourSelected(averagedThemeColour)"  :parentObject="averagedThemeColour" ></ColourButton>

        </v-layout>
        <template
                v-for="(segment, index) in segmentColours"
                @click=""
        >
            <ThemeEditorSegment :selected="currentSelectedSegmentIndex == index" :key="index" :index="index"  :segment="segment"></ThemeEditorSegment>
        </template>
        <v-btn outline  dark color="grey darken-2" @click="addColour()"><v-icon>mdi-plus</v-icon></v-btn>
        <v-btn class="actionbutton" dark color="primary" @click="normaliseWeights()">normalise</v-btn>
        <v-btn class="actionbutton" dark color="primary" @click="exportAsImage()">export</v-btn>


    </DraggableContainer>
</template>

<script>
  import currentMapDataMixin from '../../mixins/currentMapDataMixin'
  import ThemeEditorSegment from "./ThemeEditorSegment";
  import {bus} from "./../../main"
  import ColourButton from "./ColourButton";
  import DraggableContainer from "./DraggableContainer";
  import OpenContainerButton from "./OpenContainerButton";
  import ThemeIconDynamic from "./ThemeIconDynamic";


  export default {
    mixins:[
      currentMapDataMixin
    ],
    components:{
      ThemeIconDynamic,
      OpenContainerButton,
      DraggableContainer,
      ColourButton,
      ThemeEditorSegment
    },
    data(){
      return {
        show: false,
        previewColour1:{colour: [0,0,0]},
        previewColour2:{colour: [0,0,0]},
        previewColour3:{colour: [0,0,0]},
        previewColour4:{colour: [0,0,0]},

        quickSwatches: {
          'black': [0,0,0],
          'white': [255,255,255],
          'cream': [251,233,181]
        },
        currentColourObject:null,
        currentSelectedSegmentIndex: 1,
        showMenu: true
      }
    },
    props:{

      showing : {
        type: Boolean,
        default: true
      }
    },
    computed: {
      averagedThemeColour: function(){
        var segments = this.segmentColours;
        if(segments==null) return [0,0,0];
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
      textColours: function(){
        if(this.$store.getters.currentTheme) {
          return this.$store.getters.currentTheme.textcolours;
        }
        return null;
      },
      previewColours: function(){
        if(this.$store.getters.currentTheme) {
          return this.$store.getters.currentTheme.previewcolours;
        }
        return null;
      },
      currentTheme: function(){
        return this.$store.getters.currentTheme;
      },
      segmentColours : function(){
        if(this.$store.getters.currentTheme) {
          return this.$store.getters.currentTheme.segments;
        }
        return null;
      },
      roadColour : function(){
        if(this.$store.getters.currentTheme) {
          return this.$store.getters.currentTheme.road;
        }
        return null;
      },
      waterColour : function(){
        if(this.$store.getters.currentTheme) {
          return this.$store.getters.currentTheme.water;
        }
        return null;
      }
    },
    watch:{
      currentTheme: function(val){
        console.log("ThemeEditor currentTheme watch..");
        //this.setSegmentSelected(0);
        this.roadColourSelected(); // default as the road


      }
    },
    methods : {
      setThemeColour: function(col){
        // set a new colour to the selected option, this might be road,water or segment
        if(this.currentColourObject){
          this.currentColourObject.parentObject[this.currentColourObject.paramName] = [col[0],col[1],col[2]];
          bus.$emit("refreshMapWidget");
        }
      },
      addColour: function(){
        // add a new colour
        var segment =  this.$store.getters.currentTheme.segments[this.currentSelectedSegmentIndex];
        var col = (segment) ? segment.colour : [100,100,100];
        var weight = (segment) ? segment.weight : 10;

        var newIndex = this.currentSelectedSegmentIndex+1;
        this.$store.getters.currentTheme.segments.splice(newIndex,null,{
          "colour":[col[0],col[1],col[2]],
          "weight": weight
        });

        // set the new colour as the selected one
        this.segmentColourSelected(newIndex);
      },
      segmentColourSelected: function(selectedIndex){
        var newsegment = this.segmentColours[selectedIndex];
        this.currentColourObject = {
          parentObject: newsegment,
            paramName: "colour",
        };
        this.currentSelectedSegmentIndex  = selectedIndex;
        this.openEditorPanels();

      },
      previewColourSelected: function(btnEvent){
        console.log("previewColourSelected", btnEvent);
        this.currentSelectedSegmentIndex = -1;
        this.currentColourObject = {
          parentObject: btnEvent.parentObject,
          paramName: btnEvent.paramName,
        };
        this.openEditorPanels();
      },
      textColourSelected: function(btnEvent){
        console.log("textColourSelected", btnEvent);
        this.currentSelectedSegmentIndex = -1;
        this.currentColourObject = {
          parentObject: btnEvent.parentObject,
          paramName: btnEvent.paramName,
        };
        this.openEditorPanels();
      },
      roadColourSelected: function(optionalCol = null){
        this.currentSelectedSegmentIndex = -1;
        this.currentColourObject ={
          parentObject: this.currentTheme,
          paramName: "road"
        };
        if(optionalCol){
          this.currentTheme["road"] = optionalCol;
        }
        this.openEditorPanels();
      },
      waterColourSelected: function(optionalCol = null){
        this.currentSelectedSegmentIndex = -1;
        this.currentColourObject={
          parentObject: this.currentTheme,
          paramName: "water"
        };
        if(optionalCol){
          this.currentTheme["water"] = optionalCol;
        }
        this.openEditorPanels();

      },

      openEditorPanels: function(){
        if(this.show){
          bus.$emit('onSegmentColourSelected', this.currentColourObject);
          bus.$emit('openColourEditor',this.currentColourObject );
        }
      },
      // normalise back to 100
      normaliseWeights: function(){

        // this is the same as the roundweights method in uploadThemeToBD script in the server side
        var colours = this.$store.getters.currentTheme.segments;
        var total= 100;

        // get sum
        var sum = 0;
        for(var i =0; i < colours.length;++i)
        {
          sum += colours[i].weight;
        }
        console.log("sum", sum);
        var cur = 0;
        var dists = [0];
        for(var i =0; i < colours.length;++i)
        {
          var w = colours[i].weight;
          w = (w/sum) * total;
          cur += w;
          dists.push(Math.round(cur));
        }
        console.log("dists" , dists);
        for(var i =0; i < colours.length;++i)
        {
          colours[i].weight = dists[i+1] - dists[i];
        }
        console.log(colours);

      },
      toHTMLColour(arrayCol){
          return 'rgb('+arrayCol[0] + ',' + arrayCol[1] + ', ' + arrayCol[2] + ')'
      },
      //
      exportAsImage: function(){
        var waterWidth = 50;
        var roadWidth = 50; //
        var segmentWidth = 800;
        var w = roadWidth + waterWidth + segmentWidth;
        var h = 100;

        var road = this.roadColour;
        var water = this.waterColour;
        // if road = water, then make one slightly offset from the other, as these are drawn next to each other
        if( (road[0] == water[0]) && (road[1] == water[1]) &&(road[2] == water[2]) ) {
          var offset = (road[0] > 0) ? -1 : 1;
          road[0] = Math.max(0, Math.min(255, road[0] + offset));
          road[1] = Math.max(0, Math.min(255, road[1] + offset));
          road[2] = Math.max(0, Math.min(255, road[2]+ offset));
        }

        var canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        var x = 0;
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = this.toHTMLColour(water);
        ctx.fillRect(x, 0, roadWidth, h);
        x += roadWidth;

        ctx.fillStyle = this.toHTMLColour(road);
        ctx.fillRect(x, 0, waterWidth, h);
        x += waterWidth;

        this.normaliseWeights();
        var segments = this.segmentColours;
        var total = 100;
        for(var i =0; i <segments.length;++i ){
          var segment = segments[i];
          var delta = segment.weight*(segmentWidth/total);
          ctx.fillStyle = this.toHTMLColour(segment.colour);
          ctx.fillRect(x, 0, delta, h);
          x += delta;
        }

        // draw the text colours, on the second row
        ctx.fillStyle = this.toHTMLColour(this.textColours[0].colour);
        ctx.fillRect(0, 1, 1, 1);
        ctx.fillStyle = this.toHTMLColour(this.textColours[1].colour);
        ctx.fillRect(1, 1, 1, 1);
        ctx.fillStyle = this.toHTMLColour(this.textColours[2].colour);
        ctx.fillRect(2, 1, 1, 1);

        // draw the preview colour as a row of pixels on the bottom
        var previewh = 3;
        var previewy = h - previewh;
        var previewDelta = Math.floor(w / 4);
        ctx.fillStyle = this.toHTMLColour(this.previewColours[0].colour);
        ctx.fillRect(0*previewDelta, previewy, previewDelta, previewh);
        ctx.fillStyle = this.toHTMLColour(this.previewColours[1].colour);
        ctx.fillRect(1*previewDelta, previewy, previewDelta, previewh);
        ctx.fillStyle = this.toHTMLColour(this.previewColours[2].colour);
        ctx.fillRect(2*previewDelta, previewy, previewDelta, previewh);
        ctx.fillStyle = this.toHTMLColour(this.previewColours[3].colour);
        ctx.fillRect(3*previewDelta, previewy, w - 3*previewDelta, previewh);



        var image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
        var link = document.createElement('a');
        link.download =  "theme" + ".png";
        link.href = image;
        link.click();
      }

    },
    mounted(){
        bus.$on("segmentColourSelected", this.segmentColourSelected);
      bus.$on("setThemeColour", this.setThemeColour);

    }
  }
</script>

<style scoped>

    .quickswatch{
        margin-right: 4px;
        width: 15px
    }

    .row-section{
        padding-left: 5px;
        padding-bottom: 4px;
        padding-top: 4px;
        border-bottom: 1px solid #DDDDDD;
    }

    .left-label{
        width:50px;
    }

    .actionbutton{
       text-transform: capitalize;
    }

    .container{
        min-width: 100px;
        max-width: 200px;

    }
</style>
