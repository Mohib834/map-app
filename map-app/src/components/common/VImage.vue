
<template>
  <div :class="className" class="vue-image__container"  >
    <div v-if='!loaded' class="spinner-holder" >
      <v-progress-circular v-if='mounted' indeterminate :color='this.spinnerColor' :size='spinnerSize' :width="spinnerSize / 12"></v-progress-circular>
      <!-- <slot name="loading">

      </slot> -->
    </div>
    <!--
    <div v-else-if='loaded && error'>
      <v-icon :size='elementWidth / 10'>{{this.errorIcon}}</v-icon>
    </div>
    -->
    <img :src="this.src" :style='"max-width: " + elementWidth + "px; max-height: " + elementHeight + "px"' v-show='imageReady' @error="loaded = true; error = true" @load="loaded = true; error = false;">
  </div>
</template>

<script>
  //https://github.com/Hkh12/vuetify-image/blob/master/src/components/VImage.vue

  export default {
    name: 'v-image',
    data(){
      return {
        mounted: false,
        loaded: false,
        error: false
      }
    },
    mounted(){
      this.mounted = true
    },
    props: {
      src: {
        type: String,
        required: true
      },
      errorColor: {
        type: String,
        default: 'error'
      },
      loadingColor: {
        type: String,
        default: 'grey lighten-5'
      },
      spinnerColor: {
        type: String,
        default: 'grey lighten-1'
      },
      errorIcon: {
        type: String,
        default: 'broken_image'
      },
      aspectRatio: {
        type: String,
        default: '16:9',
        validator: e => !!e.match(/^\d+:\d+$/)
      },
      elementWidth: {
        type: Number,
        default: 150
        //return this.mounted ? this.$el.offsetWidth : 0
      },
      elementHeight : {
        type: Number,
        default: 150
        //return this.elementWidth * this.parsedAspectRatio
      }
    },
    computed: {
      parsedAspectRatio(){
        const [, x, y] = this.aspectRatio.match(/^(\d+):(\d+)$/)
        return y/x
      },
      className(){
        return {
       //   [this.errorColor]: this.loaded && this.error,
      //    [this.loadingColor]: !this.loaded
        }
      },
      imageReady(){
        return this.loaded && !this.error
      },

      spinnerSize(){
        return Math.round(this.elementHeight / 4)
      },
      heightCSS(){
        return this.imageReady ? 'auto' : this.elementHeight + 'px'
      }
    }
  }
</script>

<style scoped>
  .spinner-holder{
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
  }

  .vue-image__container{

    transition: .2s cubic-bezier(.2,0,.4,1);
    transition-property: background-color;
    overflow: hidden;

  }

  .vue-image__container img {
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.4);
    margin: 4px;
  }
</style>
