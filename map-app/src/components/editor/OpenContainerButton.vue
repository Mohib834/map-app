<!--
Row of option buttons
-->
<template>
    <v-btn small @click="click()" > {{label}}</v-btn>
</template>

<script>
  import {bus} from "./../../main"

  export default {
    props: {
      label:{
        type: String,
        default: function(){
          return "open";
        }
      },
      containerID:{
        type: String,
        default: function(){
          return "someid";
        }
      }
    },
    computed: {

    },
    data () {
      return {
      }
    },
    methods:{
      click: function () {
        bus.$emit('openContainer', this.containerID);
      }
    },
    watch:{
    }
  }
</script>

<style scoped>


</style>
