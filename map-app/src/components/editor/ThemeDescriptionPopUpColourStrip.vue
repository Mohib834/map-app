<template>
    <div  class="colourStrip" :class="classes"    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"  >

            <g >
                <rect :style="previewColour0Style" width="126" x="-100" y="-50" height="200"/>
                <rect :style="previewColour1Style" width="26" x="25" y="-50" height="200"/>
                <rect :style="previewColour2Style" width="26" x="50" y="-50" height="200"/>
                <rect :style="previewColour3Style" width="126" x="75" y="-50" height="200"/>
            </g>

        </svg>

    </div>
</template>

<script>

  let _defaultFill = "fill:rgb(0,0,0)";

  export default {
    name:"ThemeDescriptionPopUpColourStrip",
    props: {

      theme: {
        type: Object,
        default: function(){
          return {"themeID":"abyss","road":[1,24,42],"water":[222,206,183],
            "previewcolours": [{"colour":[255,0,0]},{"colour":[0,250,20]},{"colour":[10,0,250]},{"colour":[255,0,250]}],
            "segments":[{"colour":[233,221,195],"weight":13}]};
        }
      }
    },
    data () {
      return {
      }
    },
    computed:{
      classes : function(){
        let list = {
        };
        list[this.svgClass] = true;
        // console.log("svgClass", this.svgClass);
        return list;
      },
      svgClass: function(){
        return  (this.themeID) ? "theme-" +this.themeID.split(" ").join("-")  : "";
      },
      themeID: function(){
        return (this.theme) ? this.theme.themeID : null;
      },
      previewColour0Style: function(){
        if(this.theme == null) return _defaultFill;
        // console.log("this.theme.previewcolours[0].colour", this.theme.previewcolours[0].colour);
        return this.toHTMLColourFill( this.theme.previewcolours[0].colour);
      },
      previewColour1Style: function(){
        if(this.theme == null) return _defaultFill;
        return this.toHTMLColourFill(this.theme.previewcolours[1].colour);
      },
      previewColour2Style: function(){
        if(this.theme == null) return _defaultFill;

        return this.toHTMLColourFill(this.theme.previewcolours[2].colour);
      },
      previewColour3Style: function(){
        if(this.theme == null) return _defaultFill;

        return this.toHTMLColourFill(this.theme.previewcolours[3].colour);
      }

    },
    methods:{
      toHTMLColourFill(arrayCol){
        return 'fill:rgb('+arrayCol[0] + ',' + arrayCol[1] + ', ' + arrayCol[2] + ')'
      },
    },
    watch:{

    },

  }
</script>

<style scoped>

    .colourStrip {
        overflow: hidden;
        height: 75px;
    }
</style>
