<template>
    <div class="bottomsheet">
        <div class="glass" :class="{ open: showing }" @click="close()"></div>
        <div class="bottomsheet-body" :class="{ open: showing }" :style="{left: left + 'px', width: width + 'px'}">

            <!--<div class="bottomsheet-header">

                <span>
				<slot name="buttons"></slot>

                    <v-btn icon @click="close()"><v-icon>mdi-close</v-icon></v-btn>

			</span>
            </div>-->
            <div class="bottomsheet-content">
                <slot></slot>
            </div>
        </div>

    </div>
</template>

<script>

  export default {
    components: {

    },
    props:{
      // v-model
      value: {
        required: true,
        default: true,
      }
    },
    data () {
      return {
        left: 0,
        width: 350
      }
    },
    computed: {
      showing: {
        get() {
          console.log("this.value", this.value);

          return this.value;
        },
        set(v) {
          this.$emit('input', v)
        }
      },
    },
    methods:{
      open: function(){
        console.log("open");
        this.showing = true;
      },
      close : function () {
        //console.log("here");
        this.showing = false;
      },
      onResize: function(){
        if(window) {
          var w = $('body').innerWidth(); // window.innerWidth;
          this.width = Math.min(450, w) ;
          this.left = ((w - this.width)/2) ;
          console.log(w, this.width);
        }
      }
    },
    watch:{
    },
    mounted(){
       $( window ).resize(this.onResize);
       this.onResize();
    }
  }
</script>

<style scoped>

    .glass {
        z-index: 0;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: hsla(0, 0%, 0%, 0.0);
        opacity: 0;
        pointer-events: none;
        transition: opacity .3s ease;
    //will-change: opacity;
    }
    .glass.open {
        pointer-events: initial;
        opacity: 1;
    }

    .bottomsheet-body {
        position: fixed;
        bottom: 55px;
        left: 0px; /* set by onResize*/
        width: 400px; /* set by onResize*/
        opacity: 1;
        background: #fff;
        box-shadow: 0 0px 16px rgba(0, 0, 0, .5);
        transform: translateY(calc(100% + 20px)) ;
        z-index: 100;
        transition: opacity .3s ease, transform .5s ease;
    //will-change: opacity, transform; display: flex;
        flex-direction: column;
        overflow: hidden;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;

    }

    .bottomsheet-body.open {
        opacity: 1;
        transform: translateY(0) ;
    }

    .bottomsheet-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 3rem;
        flex: 0 0 3rem;
        padding: 0 2rem .5rem 1rem;
    }

    .bottomsheet-title {
        font-size: 1.35rem;
        line-height: 1.6rem;
    }

    .bottomsheet-content {
        flex: 1;
        overflow: auto;
      /* padding-right: 1rem; */
    }



</style>
