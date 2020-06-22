
<template>
    <div style="position: relative; height: 5em">
        <div class="checkmark draw"></div>
    </div>
</template>

<script>
  export default {
    name: 'ProcessingCheckmarkAnimated',
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
        height: 4em;
        width: 1.5em;
        transform-origin: left top;
        border-right: 6px solid #fff5f5;
        border-top: 6px solid #ffffff;
        content: '';
        left: -2.1em;
        top: 3em;
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
            width: 1.5em;
            opacity: 1;
        }
        40% {
            height: 4em;
            width: 1.5em;
            opacity: 1;
        }
        100% {
            height: 4em;
            width: 1.5em;
            opacity: 1;
        }
    }
</style>
