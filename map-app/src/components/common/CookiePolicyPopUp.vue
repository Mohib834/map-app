
<template>


  <!-- inset param = not full width -->
  <v-bottom-sheet
    v-model="showing"
    hide-overlay
    persistent
    inset
    :max-width="1200"
  >


    <v-list class="text-xs-center primary" style=" color: white;font-size: 1.1em">
      <v-container class="text-xs-center" style="margin-top: 0; padding: 0; padding-left: 20px; padding-right: 4px">
        <v-layout class="text-xs-left" justify-center align-center >
          <v-flex>
            <div>
              By using our site, you acknowledge that you have read and understand our
              <div @click="gotoPrivacyPage()" class="linktext">Privacy Policy</div>
              , including cookie policy.
            </div>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex shrink :style="{'margin-top': (isMobile) ? '20px' : '0px' }">
            <v-btn
                    class="agreebtn"
                    slot="activator"
                    flat
                    icon
                    dark
                    @click="acceptClicked()"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-list>
  </v-bottom-sheet>


</template>

<script>
  //https://github.com/Hkh12/vuetify-image/blob/master/src/components/VImage.vue
  const localStore = require('../../utils/localStore');

  export default {
    name: 'CookiePolicyPopUp',
    data(){
      return {
        showing: false
      }
    },
    methods:{
      acceptClicked : function()
      {
        this.showing = false;
        localStore.setItem('cookiesAccepted', true);
      },
      gotoCookiePage : function()
      {
        this.$router.push({ name: 'privacy', params: {} })
      },
      gotoPrivacyPage : function()
      {
        this.$router.push({ name: 'privacy', params: {} })
      }
    },
    mounted(){
        // check if cookies is accepted and don't display otherwise
      var cookiesAccepted = localStore.getItem('cookiesAccepted');
      if(cookiesAccepted === null)
      {
        this.showing = true;
      }
    },
    props: {

    },
    computed: {
      isMobile: function(){
        return this.$mq == 'mobile';
      }
    }
  }
</script>

<style scoped>

  .linktext{
    display: inline;
    text-decoration: underline;
    cursor: pointer;
  }

  .agreebtn{

  }

</style>
