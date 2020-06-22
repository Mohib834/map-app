
<template>
    <div style="position: relative; height: 5em">
        <div class="checkmark draw"></div>
    </div>
</template>

<script>
  export default {
    name: 'CheckmarkAnimated',
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
        height: 2.5em;
        width: 1.1em;
        transform-origin: left top;
        border-right: 4px solid #5cb85c;
        border-top: 4px solid #5cb85c;
        content: '';
        left: 0.1em;
        top: 2.3em;
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
            width: 1.1em;
            opacity: 1;
        }
        40% {
            height: 2.5em;
            width: 1.1em;
            opacity: 1;
        }
        100% {
            height: 2.5em;
            width: 1.1em;
            opacity: 1;
        }
    }
</style>
