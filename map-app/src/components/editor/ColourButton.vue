<!--
Row of option buttons
-->
<template>

  <div @click="onClick()" class="button" :style="bgColourStyle"  ></div>
</template>

<script>
  import {bus} from "./../../main"

  export default {
    props: {
      parentObject: {
        type: [Object,Array],
        default: function () {
          return {colour:[255,100,0]}
        }
      },
      paramName:{
        type: String,
        default: function(){
          return null;
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
      colour: function(){
        if(this.parentObject == null) return [0,0,0];
        if(this.paramName == null) return this.parentObject;
        return this.parentObject[this.paramName];
      },
      htmlcolour: function()
      {
        return 'rgb('+this.colour[0] + ',' + this.colour[1] + ', ' + this.colour[2] + ')';
      }
    },
    data () {
      return {
      }
    },
    methods:{
      onClick: function(){
        this.$emit("colourSelected", {
          parentObject: this.parentObject,
          paramName: this.paramName,
          colour: this.colour
        } );
      }
    },
    watch:{
    }
  }
</script>

<style scoped>
  .innerbox{
    height: 100%;
    width: 100%;
    display: flex;
    background: #ff00ff;
  }
  .button{
    margin: 1px 1px 1px 1px;
    padding: 3px;
    width: 28px;
    height: 28px;
    display: flex;
    flex-grow: 0;
    align-items: center;
    align-content: center;
    background: #ffffff;
    border: 0px solid gray;
    border-radius: 4px;
    justify-content: center;
    color: #777777;
    -webkit-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.3);
    -moz-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.3);
    box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.3);
  }
  .button:hover{
    background: #eeeeee;
    cursor: pointer;
    border: 2px solid gray;

  }


</style>
