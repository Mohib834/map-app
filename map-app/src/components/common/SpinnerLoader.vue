<template>

    <div class="spinner" :style="{width: size + 'px', height: size+ 'px'}">
        <svg :style="{'stroke': colour0}" class="spinner-col0" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle class="length" fill="none" stroke-width="2.25" stroke-linecap="round" cx="33" cy="33" r="28"></circle>
        </svg>
        <svg :style="{'stroke': colour1}" class="spinner-col1" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle fill="none" stroke-width="2.5" stroke-linecap="round" cx="33" cy="33" r="28"></circle>
        </svg>
        <svg :style="{'stroke': colour2}" class="spinner-col2" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle fill="none" stroke-width="2.75" stroke-linecap="round" cx="33" cy="33" r="28"></circle>
        </svg>
        <svg :style="{'stroke': colour3}" class="spinner-col3" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle fill="none" stroke-width="3" stroke-linecap="round" cx="33" cy="33" r="28"></circle>
        </svg>
    </div>
</template>

<script>

  export default {
    props: {
      size:{
        type: Number,
        default: 130
      }
    },
    data () {
      return {
        colours: ['#e3cf62','#e84d5b','#594e7a','#2bacb5']
      }
    },
    computed: {
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

    .spinner {
        animation: contanim 2s linear infinite;
    }
    svg {
        display: block;
        margin: 0; padding: 0;
        width: 100%; height: 100%;
        left: 0; top: 0;
        position: absolute;
        transform: rotate(-90deg);
        stroke-dasharray: 1, 300;
        stroke-dashoffset: 0;
        transform-origin: center center;
    }

    .spinner-col0{
        animation: strokeanim 3s calc(.3s * 0) ease infinite;
    }
    .spinner-col1{

        animation: strokeanim 3s calc(.3s * 1) ease infinite;
    }
    .spinner-col2{
        animation: strokeanim 3s calc(.3s * 2) ease infinite;
    }
    .spinner-col3{
        animation: strokeanim 3s calc(.3s * 3) ease infinite;
    }
    @keyframes strokeanim {
        0% {
            stroke-dasharray: 1, 300;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 120, 300;
            stroke-dashoffset: -58;
        }
        100% {
            stroke-dasharray: 120, 300;
            stroke-dashoffset: -175;
        }
    }



    @keyframes contanim {
        100% {
            transform: rotate(360deg)
        }
    }
</style>
