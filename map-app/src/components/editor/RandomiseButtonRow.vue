<!--
Row of option buttons
-->
<template>
    <div style="padding-left: 10px; padding-right: 10px">
        <div style="width:100%;display: flex; ">
        <template
                v-for="(variationID, index) in variationIDs"
                @click=""
        >
            <v-btn :ripple="false" icon depressed light    class="button" :class="{'selected': index == variation , 'unselected': index != variation }" :color="( index == variation) ?  'primary': 'white'" v-on:click="onClick(variationID)" >
                <div style="display: inline; ">{{ 1+ index}}  </div>
            </v-btn>
        </template>
    </div>
    </div>
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
        variationIDs: [0,1,2,3,4],
        doShake: false
      }
    },
    methods:{
      onClick : function(variationID)
      {
        this.doShake = false;
        setTimeout(()=>{
          this.doShake = true// this will update the value prop (v-model).
        },50);
        //this.value= selectedValue;
        setTimeout(()=>{
          this.$emit('click', variationID); // this will update the value prop (v-model).
        },0);
      }
    },
    watch:{
      variationID:function(){

      }
    }
  }
</script>

<style scoped>


    .button{
        text-transform: none;
        font-size: 1.2em;

    }

    .button:hover{
        /*animation: shake 0.4s;*/
        /*font-size: 1.3em;*/
        border: none !important;
    }

    .selected{
    }

    .unselected{
        border: 1px solid lightgrey !important;
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
