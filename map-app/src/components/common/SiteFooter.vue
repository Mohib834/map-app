<template>



  <div class="footer-bg">


      <v-layout row wrap>
        <v-flex xs12 >
          <!--
          <h3 class="font-weight-light text-xs-center"  style="margin-bottom: 20px; margin-top: 20px; color: #aaaaaa" >Made with <v-icon size=18 color="grey">mdi-heart</v-icon> in London</h3>
          -->
        </v-flex>
        <v-flex xs12 class=" text-xs-center" style="margin-top: 20px; margin-bottom: 20px">
          <!--
          <div class="footer-links" @click="goto('home')"> Home </div>
          <div class="linkdivider">|</div>
          -->
          <div  class="footer-links" @click="goto('privacy')">Privacy Policy</div>
          <div class="linkdivider">|</div>
          <div  class="footer-links" @click="goto('terms')">Terms</div>
          <div class="linkdivider">|</div>
          <div  class="footer-links" @click="goto('faq')">FAQ</div>
          <div class="linkdivider">|</div>
          <div class="footer-links" @click="goto('contact')">Contact</div>
          <div class="linkdivider">|</div>
          <div class="footer-links" @click="goto('findmyorder')">Find My Order</div>
        </v-flex>
        <v-flex xs12 class="text-xs-center" style="color: #888888">
          <p class="footer-company-name">MakeMapArt &copy; 2020</p>
        </v-flex>

      </v-layout>





  </div>
</template>

<script>

  export default {
    components: {

    },
    data () {
      return {
      }
    },
    props: {
    },
    computed: {
    },
    methods:{
      goto: function (pageID)
      {
        this.$router.push({ name: pageID, params: {}})
      }
    },
    watch:{
    }
  }
</script>

<style scoped>

  .linkdivider{
    color: #888888;
    display:inline-block;
    margin-left: 5px;
    margin-right: 5px;

  }

  .footer-links{
    display:inline-block;
    cursor: pointer;
  }

  .footer-bg{
    color: #cccccc;
    display: flex;
    flex-direction: row;
    background-color: #292c2f;
    justify-content: center ;
    padding-top: 20px;
    padding-bottom: 30px;
  }



</style>
