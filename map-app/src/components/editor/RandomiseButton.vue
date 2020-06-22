<!--
Row of option buttons
-->
<template>
  <v-btn :ripple="false" block depressed dark   class="button" color="primary" v-on:click="onClick()">
    <div class="shuffletext" style="display: inline; margin-right: 20px" :class='{shake:doShake}'> Shuffle Colors </div>
    <div style="display: inline; color: #cadde7">{{ 1+ variation}} of {{maxVariation}} </div>
    <!--
    <img class="aicon" style="margin-left: 10px; width: 20px; color: white;" src="/static/assets/dice.png"/>
    -->
  </v-btn>
</template>

<script>
  export default {
    props: {
      maxVariation:{
      },
      variation: {
        type: [Number],
        default: function(){
          return 1;
        }
      },
      colour: {
        type: [Array],
        default: function () {
          return [50,50,50];
        }
      }
    },
    computed: {
      bgColourStyle : function()
      {
        return {
          background: this.htmlcolour
        }
      },
      htmlcolour: function()
      {
        return 'rgb('+this.colour[0] + ',' + this.colour[1] + ', ' + this.colour[2] + ')';
      }
    },
    data () {
      return {
        doShake: false
      }
    },
    methods:{
      onClick : function()
      {
        setTimeout(()=>{
          this.$emit('click', this.variation); // this will update the value prop (v-model).
        },0);
      }
    },
    watch:{
    }
  }
</script>

<style scoped>


  .button{
    text-transform: none;
    height: 50px;
    font-size: 1.2em;
  }

  .button:hover{
    /*animation: shake 0.4s;*/
    font-size: 1.3em;

  }

  .shake {
    animation: shake 0.4s;
  }

  @keyframes shakeSideToSide {
    10%, 90% {transform: translate3d(-1px, 0, 0);}
    20%, 80% {transform: translate3d(2px, 0, 0);}
    30%, 50%, 70% {transform: translate3d(-4px, 0, 0);}
    40%, 60% {transform: translate3d(4px, 0, 0);}
  }

  @keyframes shake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-2px, 0px) rotate(1deg); }
    30% { transform: translate(1px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-1px, 1px) rotate(0deg); }
    70% { transform: translate(0px, 0px) rotate(0deg); }

  }

</style>
