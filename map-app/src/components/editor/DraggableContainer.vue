
<template>
    <div v-show="showing" ref="dragContainer" class="container" :style="{'left': initialXPos + 'px','top': initialYPos + 'px', 'width': width + 'px'}" >
        <v-layout column style="margin: 0; padding: 0; " >
            <v-layout ref="dragHandle" row align-center style="margin: 0; padding: 5px; background: #bbbbbb">
                <div  style="" class="title dragHandle">{{title}}</div>
                <v-btn icon style="margin: 0px" @click="minimised = !minimised"> <v-icon size="20">{{ minimised ?   'mdi-window-maximize' : 'mdi-window-minimize'}}</v-icon></v-btn>
                <v-btn icon style="margin: 0px"@click="showing = false" > <v-icon size="20">mdi-close</v-icon></v-btn>
            </v-layout>
            <v-layout v-show="!minimised" column style="margin: 0; padding: 0; margin-top: 5px" >
                <slot ></slot>
            </v-layout>
        </v-layout>
    </div>
</template>

<script>
  import currentMapDataMixin from '../../mixins/currentMapDataMixin'
  import {bus} from "./../../main"

  export default {
    mixins:[
      currentMapDataMixin
    ],
    components:{
    },
    data(){
      return {
        minimised:false
      }
    },
    props:{
      show: {
        type:Boolean,
        default: function() {
          return false;
        }
      },
      containerID: {
        type:String,
        default: function() {
          return "somerefid";
        }
      },
      initialXPos: {
        type:Number,
        default: function() {
          return 300;
        }
      },
      initialYPos: {
        type:Number,
        default: function() {
          return 100;
        }
      },
      title: {
        type:String,
        default: function() {
          return "title";
        }
      },
      width: {
        type:Number,
        default: function() {
          return 240;
        }
      }
    },
    model: {
      prop: 'show',
      event: 'show'
    },
    computed: {
      showing:{
        get: function(){
          return this.show;
        },
        set: function(val){
          this.$emit('show', val);
        }
      }
    },
    watch:{
    },
    methods : {
      initDraggable: function(){
        console.log('initDraggable');

        ////testing for dragging
        var d = {};
        this.$refs.dragHandle.addEventListener("mousedown", e => {
          console.log("dragHandle mousedown");

          d.el = this.$refs.dragContainer; // element which should be moved
          d.mouseStartX = e.clientX;
          d.mouseStartY = e.clientY;
          d.elStartX = d.el.getBoundingClientRect().left;
          d.elStartY = d.el.getBoundingClientRect().top;
          //d.el.style.position = "fixed";
          d.el.style.margin = 0;
          d.oldTransition = d.el.style.transition;
          d.el.style.transition = "none";
          d.el.style['z-index'] = ++ZINDEX_COUNTER;
        });
        document.addEventListener("mousemove", e => {
          if (d.el === undefined) return;
          /*
          d.el.style.left = Math.min(
            Math.max(d.elStartX + e.clientX - d.mouseStartX, 0),
            window.innerWidth - d.el.getBoundingClientRect().width
          ) + "px";
          d.el.style.top = Math.min(
            Math.max(d.elStartY + e.clientY - d.mouseStartY, 0),
            window.innerHeight - d.el.getBoundingClientRect().height
          ) + "px";*/
          d.el.style.left =( d.elStartX + e.clientX - d.mouseStartX
          ) + "px";
          d.el.style.top = (d.elStartY + e.clientY - d.mouseStartY) + "px";

        });
        document.addEventListener("mouseup", () => {
          if (d.el === undefined) return;
          d.el.style.transition = d.oldTransition;
          d.el = undefined
        });
        /*
        setInterval(() => { // prevent out of bounds
         //const dialog = document.querySelector(".v-dialog.v-dialog--active");
          //if (dialog === null) return;
          //dialog.style.left = Math.min(parseInt(dialog.style.left), window.innerWidth - dialog.getBoundingClientRect().width) + "px";
          //dialog.style.top = Math.min(parseInt(dialog.style.top), window.innerHeight - dialog.getBoundingClientRect().height) + "px";
        }, 100);
            */

      },
    },
    mounted(){

      this.initDraggable();
      bus.$on('openContainer', (openContainerID)=>{

        if(openContainerID == this.containerID) {
          this.showing = true;
        }
      });
    }
  }


  var ZINDEX_COUNTER = 100;
</script>

<style scoped>

    .title{
        width: 100%;
        margin: 0px;
        user-select: none;
        cursor: pointer;
    }

    .container{

        z-index: 10;
        position: absolute;
        left: 550px;
        top: 100px;
        background-color: white;
        display: flex;
        margin: 0px;
        padding: 0px;
        box-shadow: 1px 1px 1px #0f0f0f55;
    }

</style>
