
<template>
  <div >
    <div class="loading-overlay">
    </div>
    <div class="loader-container">
      <v-progress-circular
        :size="80"
        :width="5"
        color="blue"
        indeterminate
      ></v-progress-circular>
    </div>
  </div>
</template>

<script>
  //https://github.com/Hkh12/vuetify-image/blob/master/src/components/VImage.vue

  export default {
    name: 'wait-overlay',
    data(){
      return {

      }
    },
    mounted(){

    },
    props: {

    },
    computed: {

    }
  }
</script>

<style scoped>

  .loading-overlay{
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0.2;
    background-color: #222222;
    z-index: 3;
  }
  .loader-container{
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 4;
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>
