<template>
    <div class="spinner-container">
        <SpinnerLoader :size="120"></SpinnerLoader>
    </div>
</template>

<script>
    import SpinnerLoader from './SpinnerLoader'

  export default {
    components:{
      SpinnerLoader
    },
    props: {
    },
    computed: {

    },
    data () {
      return {
      }
    },
    methods:{
    },
    watch:{
    }
  }
</script>

<style scoped>

    .spinner-container {
        width: 100%; height: 100%;
        position: absolute;
        display: flex;
        margin: 0; padding: 0;
        align-items: center;
        justify-content: center;
    }

</style>
