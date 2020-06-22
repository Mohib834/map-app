
<template>
    <div style="position: relative; height: 0em">
        <div class="checkmark draw"></div>
    </div>
</template>

<script>
  export default {
    name: 'CheckmarkAnimatedForModal',
    data() {
      return {
      }
    },
    methods: {},
    props: {},
    computed: {},
    mounted() {}
  }
</script>

<style scoped>

    .checkmark.draw:after {
        animation-duration: 2000ms;
        animation-timing-function: ease;
        animation-name: checkmark;
        transform: scaleX(-1) rotate(135deg);
    }

    .checkmark:after {
        opacity: 1;
        height: 1.0em;
        width: 0.4em;
        transform-origin: left top;
        border-right: 2px solid #3d83ee;
        border-top: 2px solid #3d83ee;
        content: '';
        left: calc(50% + 90px);
        top: -0.6em;
        position: absolute;

    }


    @keyframes checkmark {
        0% {
            height: 0;
            width: 0;
            opacity: 1;
        }
        20% {
            height: 0;
            width: 0.4em;
            opacity: 1;
        }
        40% {
            height: 1.0em;
            width: 0.4em;
            opacity: 1;
        }
        100% {
            height: 1.0em;
            width: 0.4em;
            opacity: 1;
        }
    }
</style>
