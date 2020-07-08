
<template>
    <div class="sitelogo" >
        <img :src="require('@/assets/img/map-logo2.png')" style="height: 24px; margin-right: 4px"> </img>

        <div v-if="light" class="font-weight-medium subheading" style="color: #222222; display: inline-block" >
            Map<span style="color:#888888">Art</span>
        </div>
        <div v-else="" class="font-weight-medium subheading" style="color: #cccccc; display: inline-block" >
            Map<span style="color:#666666">Art</span>
        </div>
        <!--
            <div class="show-mobile-only">

            </div>-->
    </div>
</template>

<script>
  export default {
    name: 'HelpButton',
    data() {
      return {
      }
    },
    methods: {

    },
    props: {

      dark: {
        type: [Boolean],
        default: null
      },
      light:{
        type: [Boolean],
        default: null
      }
    },
    computed: {},
    mounted() {}
  }
</script>

<style scoped>
    .sitelogo{
        display: flex;
        align-content: center;
        color: #ffffff;
        font-size: 1.4em;
        cursor: pointer;
    }
</style>



