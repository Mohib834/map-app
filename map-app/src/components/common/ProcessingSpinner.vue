<template>

    <div class="spinnerContainer" :style="{width: radius*2 + 'px', height: radius*2+ 'px'}">

        <svg
                :height="radius * 2"
                :width="radius * 2"
                xmlns="http://www.w3.org/2000/svg">

            <circle fill="none" stroke-linecap="round"
                    :cx="radius"
                    :cy="radius"
                    :r="normalizedRadius"
                    :stroke-width="strokeThickness"
                    :style="{  'stroke': colour0, 'opacity': 0.2 }"
                    class="spinner-col1"
            ></circle>

            <circle fill="none" stroke-linecap="round"
                    :cx="radius"
                    :cy="radius"
                    :r="normalizedRadius"
                    :stroke-width="strokeThickness"
                    :stroke-dasharray="circumference + ' ' + circumference"
                    :style="{ 'strokeDashoffset':strokeDashoffset0 , 'stroke': colour0 }"
                    class="spinner-col1"
            ></circle>

            <circle fill="none" stroke-linecap="round"
                    :cx="radius"
                    :cy="radius"
                    :r="normalizedRadius"
                    :stroke-width="strokeThickness+0.25"
                    :stroke-dasharray="circumference + ' ' + circumference"
                    :style="{ 'strokeDashoffset':strokeDashoffset1 , 'stroke': colour1 }"
                    class="spinner-col1"
            ></circle>

            <circle fill="none" stroke-linecap="round"
                    :cx="radius"
                    :cy="radius"
                    :r="normalizedRadius"
                    :stroke-width="strokeThickness+0.5"
                    :stroke-dasharray="circumference + ' ' + circumference"
                    :style="{ 'strokeDashoffset':strokeDashoffset2 , 'stroke': colour2 }"
                    class="spinner-col1"
            ></circle>

            <circle fill="none" stroke-linecap="round"
                    :cx="radius"
                    :cy="radius"
                    :r="normalizedRadius"
                    :stroke-width="strokeThickness+0.75"
                    :stroke-dasharray="circumference + ' ' + circumference"
                    :style="{ 'strokeDashoffset':strokeDashoffset3 , 'stroke': colour3 }"
                    class="spinner-col1"
            ></circle>

        </svg>

        <div class="centerSlotContainer">
            <slot></slot>
        </div>
    </div>
</template>

<script>

  export default {
    props: {
      progress: {
        type:Number,
        default: 50
      },

    },
    data () {
      return {
        strokeThickness: 4,
        radius: 80,
        colours: ['#e3cf62','#e84d5b','#594e7a','#2bacb5']
      }
    },
    computed: {
      normalizedRadius : function(){
        return this.radius - this.strokeThickness * 2;
      },
      circumference: function(){
        return this.normalizedRadius * 2 * Math.PI;
      },
      strokeDashoffset: function(){
        return this.circumference - this.progress / 100 * this.circumference;
      },
      strokeDashoffset0: function(){
        let val = this.progress*1.00;
       // let val = Math.min(this.progress, 100.0);
        return this.circumference - (val) / 100 * this.circumference;
      },
      strokeDashoffset1: function(){
        let val = this.progress*0.75;
       // let val = Math.min(this.progress, 75);
        return this.circumference - (val) / 100 * this.circumference;
      },
      strokeDashoffset2: function(){
        let val = this.progress*0.50;
        //let val = Math.min(this.progress, 50);

        return this.circumference - (val) / 100 * this.circumference;
      },
      strokeDashoffset3: function(){
        let val = this.progress*0.25;
      //  let val = Math.min(this.progress, 25);
        return this.circumference - (val) / 100 * this.circumference;
      },

      colour0: function(){
        if(this.colours[0]) return this.colours[0];
        return '#888888';
      },
      colour1: function(){
        if(this.colours[1]) return this.colours[1];
        return '#888888';
      },
      colour2: function(){
        if(this.colours[2]) return this.colours[2];
        return '#888888';
      },
      colour3: function(){
        if(this.colours[3]) return this.colours[3];
        return '#888888';
      }
    },
    methods:{
      // gets called from mapEditor
        setRandomColours:function(){
          var ranix =  Math.min(Math.floor( Math.random()*_cols.length), _cols.length - 1);
          this.colours = _cols[ranix];
          console.log("setRandomColours", ranix, _cols);

        },
      setColoursFromTheme: function(themeObject)
      {
        let cols = themeObject.previewcolours;
        console.log("--------------------- themeObject" , themeObject);
        this.colours = [];

        if(cols[0] != null ){
          this.colours.push( this.toHTMLColourFill(cols[0].colour));
        }
        if(cols[1] != null ){
          this.colours.push( this.toHTMLColourFill(cols[1].colour));
        }
        if(cols[2] != null ){
          this.colours.push( this.toHTMLColourFill(cols[2].colour));
        }
        if(cols[3] != null ){
          this.colours.push( this.toHTMLColourFill(cols[3].colour));
        }

        console.log("--------------------- this.colours" , this.colours);

      },
      toHTMLColourFill(arrayCol){
        return 'rgb('+arrayCol[0] + ',' + arrayCol[1] + ', ' + arrayCol[2] + ')'
      },
    },
    watch:{
    }
  }

  const _cols = [
    ['#6aa6a6' ,'#402b3c', '#f2b263','#f26835'],
    ['#d6c754' ,'#d6c754', '#5eccc6','#1198c8'],
    ['#ef6747' ,'#ffc000', '#374d7e','#8bb3cc'],
    ['#6dd6a6' ,'#12ad91', '#fe2354','#315662'],
    ['#706a58' ,'#f41c54', '#05a7b3','#cad047'],
    ['#0196cf' ,'#40d3c2', '#ead041','#e9739a'],
    ['#afbe3f' ,'#9aceb7', '#cbc4ac','#636388'],
    ['#a6949f' ,'#515151', '#abd9e8','#f2f2f2'],
    ['#4f666a' ,'#75c5d1', '#b2ab9a','#dad5ab'],
    ['#ce7ba4' ,'#3a3a63', '#78c7cb','#5ea760'],
    ['#ff554d' ,'#156cb2', '#e8d4c2','#b0cadf'],
    ['#8996a3' ,'#d1daf1', '#175f88','#1198c8']
  ]

</script>

<style scoped>

    .centerSlotContainer{
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    .spinnerContainer {
        position: relative;
        display: -webkit-inline-box;
        display: -ms-inline-flexbox;
        display: inline-flex;
        vertical-align: middle;
    }
    .spinnerContainer svg {
        animation: contanim 2s linear infinite;
        width: 100%;
        height: 100%;
        margin: auto;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 0;
    }
    circle{
        transition: all 0.75s ease;


    }

    .spinner-col0{

    }
    .spinner-col1{

    }
    .spinner-col2{

    }
    .spinner-col3{
    }
    @keyframes strokeanim {


    }



    @keyframes contanim {
        100% {
            transform: rotate(360deg)
        }
    }
</style>
