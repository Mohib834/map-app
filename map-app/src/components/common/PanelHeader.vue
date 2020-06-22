
<template>
    <div  ref="container" class="panelheader noselect headline" :class="{'top-border': topBorder,  hero:  bottomButton,  'panelheader-clickable': clickable, 'rainbow-bg': rainbowBg && bottomButton}"  >
        <v-layout row align-center justify-end fill-height style="margin-left: auto; width:100%">
            <v-flex block >

                <div v-if="step" class="step"> {{step + "." }}</div>

                {{text}}
                <v-icon style="margin-left: 5px" dark size="28">{{ icon }}</v-icon>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex shrink :class="rightClass" class="">
                <v-icon v-if='clickableMouseOver' style="margin-left: 5px" dark size="26">mdi-pencil</v-icon>
                <slot v-else=""   name="right">
                </slot>



            </v-flex>

        </v-layout>
    </div>
</template>

<script>
  export default {
    props: {
      rainbowBg:{
        default: false
      },
      rightClass:{
        type:[String],
        default: ""
      },
      topBorder:{
        type: [Boolean],
        default: function () {
          return false;
        }
      },

      bottomButton:{
        type: [Boolean],
        default: function () {
          return false;
        }
      },
      clickable:{
        type: [Boolean],
        default: function () {
          return false;
        }
      },
      step: {
        default: function () {
          return null;
        }
      },
      text: {
        type: [String],
        default: function () {
          return "";
        }
      },
      icon: {
        type: [String],
        default: function () {
          return "";
        }
      }
    },
    data () {
      return {
        clickableMouseOver : false
      }
    },
    methods:{
      clicktest: function(e){
        console.log("clicktest");

      },

      mouseover: function(e) {
        console.log("mouseover");

      },
      mouseleave: function(e) {
        console.log("mouseleave");
      }
    },
    watch:{

    },
    mounted(){
      console.log("Panelheader mounted");
      if(this.clickable) {
        this.$refs['container'].onmouseover = (e) => {
          this.clickableMouseOver = true;
        };
        this.$refs['container'].onmouseout = (e) => {
          this.clickableMouseOver = false;
        };
      }
    },
    activated(){
      this.clickableMouseOver = false;

    }
  }
</script>

<style scoped>


    /* USED FOR NEXT ARROW */
    .shake-hover:hover {
        animation: shakeAnimation 2s infinite cubic-bezier(.36,.07,.19,.97) both;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        perspective: 1000px;
    }

    @keyframes shakeAnimation {
        10%, 90% {
            transform: translate3d(-1px, 0, 0);
        }
        20%, 80% {
            transform: translate3d(2px, 0, 0);
        }
        30%, 50%, 70% {
            transform: translate3d(-4px, 0, 0);
        }
        40%, 60% {
            transform: translate3d(4px, 0, 0);
        }
    }



    .noselect {
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
    }

    .panelheader{
        background-color: #292c2f;
        color: white;
        width:100%;
        height: 65px;
        margin-left: auto;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 0px;
        padding-bottom: 0px;
        text-align: left;
        transition-property: background-color;
        transition-duration: 1s;
    }

    .top-border{
        border-top: 1px solid #999999 !important;
    }

    .rainbow-bg {

        /*
       background: linear-gradient(to right, #FDDE5C 0%, #F8AB5E calc(100% / 6), #F56A62 calc(100% / 6 * 2), #A176C8 calc(100% / 6 * 3), #759BEB calc(100% / 6 * 4), #65BEB3 calc(100% / 6 * 5), #70DB96 100%) !important;
       */
        background: rgb(61,131,238);
        background: linear-gradient(90deg, rgba(61,131,238,1) 0%, rgba(61,131,238,1) 6%, rgba(198,85,232,1) 31%, rgba(255,150,57,1) 55%, rgba(255,218,25,1) 77%, rgba(85,219,203,1) 100%) !important;
    }
    /* BOTTOM BUTTON STYLE */
    .hero{
        cursor: pointer;
        transition: all .15s ease-in-out;
    }

    .hero:hover{
        transform: scale(1.05,1.05);
        /*
        -webkit-animation-name: bounce;
        animation-name: bounce;
        animation: bounce 1s normal forwards;
        -webkit-transform-origin: center bottom;
        transform-origin: center bottom;
        */
    }

    .panelheader-clickable{
        cursor: pointer;
        color: #aaaaaa;
    }

    .panelheader-clickable:hover{
        background-color: #333333;
        color: #ffffff;

    }

    /* remove cihld pointer events */
    .panelheader-clickable * {
        pointer-events: none;
    }

    .step {
        background: inherit;
        border-radius: 1.8em;
        -moz-border-radius: 1.8em;
        -webkit-border-radius: 1.8em;
        color: #ffffff;
        opacity: 0.5;
        display: inline-block;
        font-weight: normal;
        line-height: 1.8em;
        margin-right: 5px;
        text-align: center;
        width: 0.8em;
    }

    /*  animation  */


    @-webkit-keyframes bounce {
        from,
        20%,
        53%,
        80%,
        to {
            -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }

        40%,
        43% {
            -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
            animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
            -webkit-transform: translate3d(0, -10px, 0);
            transform: translate3d(0, -10px, 0);
        }

        70% {
            -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
            animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
            -webkit-transform: translate3d(0, -5px, 0);
            transform: translate3d(0, -5px, 0);
        }

        90% {
            -webkit-transform: translate3d(0, -3px, 0);
            transform: translate3d(0, -3px, 0);
        }
    }

    @keyframes bounce {
        from,
        20%,
        53%,
        80%,
        to {
            -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }

        40%,
        43% {
            -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
            animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
            -webkit-transform: translate3d(0, -30px, 0);
            transform: translate3d(0, -10px, 0);
        }

        70% {
            -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
            animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
            -webkit-transform: translate3d(0, -15px, 0);
            transform: translate3d(0, -5px, 0);
        }

        90% {
            -webkit-transform: translate3d(0, -3px, 0);
            transform: translate3d(0, -3px, 0);
        }
    }

    .bounce {
        -webkit-animation-name: bounce;
        animation-name: bounce;
        animation: bounce 1s normal forwards;
        -webkit-transform-origin: center bottom;
        transform-origin: center bottom;
    }

</style>
