
<template>
  <div >
    <button :id="buttonID" :class="buttonClasses" class="header" ref="button"  @click="click">
      <div class="left">{{heading}}</div>
      <div class="right">

        <v-icon v-if="opened" size="36" color="grey">
          mdi-chevron-up
        </v-icon>
        <v-icon v-else="" size="36" color="black">
          mdi-chevron-down
        </v-icon>
      </div>
    </button>
    <div :class="panelClasses" ref="panel">
      <slot name="content"> </slot>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'AccordianPanel',
    props:{
      heading:{
        type: String,
        default: "heading"
      },
      buttonID: {
        type: [String],
        default: null
      }
    },
    data(){
      return {
        opened: false,
      }
    },
    methods : {
      click : function(){
        this.$emit('click', this);
       // this.open();

      },
      close : function(){
        this.opened = false;
        this.$refs.panel.style.maxHeight = null;

      },
      open : function(){
        console.log("AccordianPanel open");
        this.opened = true;
        // apply new hieght after the class has taken affect on the next tick
        this.$nextTick(() => {
          let panel = this.$refs.panel;
          console.log("panel.scrollHeight", panel.scrollHeight);
          panel.style.maxHeight = panel.scrollHeight + "px";
        });
      }
    },
    computed: {
      buttonClasses: function(){
       return {
         "accordion" : true,
         "active" : this.opened
       }
      },
      panelClasses: function(){
        return {
          "editpanel": true,
          "panelactive" : this.opened
        }
      }
    },
    mounted : function(){
      // init here

    }
  }
</script>

<style scoped>


  .accordion {
    background-color: white;
    color: #000;
    cursor: pointer;
    padding: 13px;
    width: 100%;
    text-align: left;
    outline: none;
    transition: 0.4s;

    min-width: 30px;
    align-items: center;
    align-content: center;
    justify-content: center;
    border-radius: 0px;
    font-weight: normal;
    font-size: 1.7em;
  }

  .active, .accordion:hover {
    background-color: #FFFFFF;
  }


  .header {
    display: inline-block;
    width: 100%;


  }
  .left {
    float: right;
  }
  .right{
    float: left;
  }


  .editpanel {
    padding: 0 10px;
    background-color: white;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease-out;
    border-bottom: 0px solid #ccc;
    border-top: 1px solid #ccc;
  }

  .panelactive{
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;

  }


</style>
