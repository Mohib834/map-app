
<template>
    <v-btn outline icon dark class="helpbtn pulse" :style="{width: size+ 'px', height: size+ 'px'}" color="grey"><v-icon size="12">mdi-help</v-icon></v-btn>
</template>

<script>
  export default {
    name: 'HelpButton',
    data() {
      return {
      }
    },
    methods: {},
    props: {
      size:{
        type:Number,
        default: function(){
          return 20;
        }
      }
    },
    computed: {},
    mounted() {}
  }
</script>

<style scoped>
.helpbtn{
    margin-top: 2px;
    margin-left: 0px;
    margin-right: 0px;
    margin-bottom: 0px;

}
</style>
