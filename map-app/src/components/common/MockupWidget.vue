
<template>

    <div class="maxcontainer">
    <div class="scaling-svg-container"
         style="padding-bottom: 99%">
        <svg class="scaling-svg"
             version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 500 712">
            <defs>
                <clipPath :id="clipID">
                    <rect width="100%" height="100%" fill="none" stroke="blue" />
                </clipPath>
            </defs>
            <g  :clip-path="'url(#' + clipID + ')'" >
                <image  width="500" height="712" :xlink:href="backgroundImage"  transform="matrix(1 0 0 1 0 0)">
                </image>
                <image  :width="foregroundWidth" :height="foregroundHeight" :xlink:href="image"  transform="matrix(1.1502 -0.3097 0.3097 1.1502 -25.4624 153.7944)">
                </image>
            </g>

        </svg>

    </div>
    </div>

</template>

<script>
  export default {
    name: 'MockupWidget',
    data() {
      return {
        backgroundImage: "/static/assets/mocks/table-mock.jpg",
        foregroundWidth:  375,
        foregroundHeight:  500,
        clipID: "1"
      }
    },
    methods: {
    },
    props: {
      image: {
        default:"/static/assets/mocks/105.jpg"
      },
    },
    computed: {},
    created() {
      this.clipID = ++_nextID;
    }
  }

  var _nextID  = 0;
</script>

<style scoped>

    .maxcontainer{
        max-width:600px;
        width: 100%;
        margin: auto;
    }
    .scaling-svg-container {
        overflow: hidden;
        position: relative;
        height:0;
        width: 100%;
        padding: 0;
        padding-bottom: 100%;
        /* over-ride this inline for aspect ratio other than square */
    }
    .scaling-svg {
        overflow: hidden;
        position: absolute;
        height: 100%;
        width: 100%;

        left: 0;
        top:0;
    }

</style>
