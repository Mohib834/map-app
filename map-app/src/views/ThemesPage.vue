<template>
    <main class="Site">

        <Navbar :floating="true" ></Navbar>
        <main style="margin-top: 100px">
            <div class="work-section" style=" background: inherit; margin-top: 50px; margin-bottom: 50px">
                <div class="work-section-container "  >
                    <v-layout  row class=" justify-left align-left align-content-left "   >
                        <v-flex xs12 sm10 >
                            <h2 class=" font-weight-bold display-2"> Themes. </h2>
                            <h2 class="font-weight-medium heading no-bottom-margin" style="color: gray;"> Browse through our hand-picked curated themes. </h2>
                        </v-flex>
                    </v-layout>
                </div>
            </div>
        </main>

        <main >

        </main>

        <SiteFooter></SiteFooter>
    </main>
</template>
<script>
  // import DemoMapWidget from './DemoMapWidget.vue'
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'
  import MockupSection from '../components/home/MockupSection';

  export default {
    components:{

      MockupSection,
      //   DemoMapWidget
    },
    props: {
    },
    computed: {
      ...mapGetters([
      ]),
      isMobile : function(){
        return this.$mq == 'mobile';
      },
      isDesktop : function(){
        return !this.isMobile;
      },

      headerHeightStyle()
      {
        return this.headerHeight + 'px';
        //return 'calc(100vh - 55px)';
      }
    },
    data () {
      return {
      }
    },
    methods:{

      gotoCreatePage : function( resetLocation = false ){
        if(resetLocation) {
          this.$router.push({name: 'createnew', params: {}})
        }
        else{
          this.$router.push({name: 'create', params: {}})

        }
      },

    },
    watch:{
    },
    mounted: function()
    {



    },
    activated: function()
    {

    },
    deactivated: function(){

    }
  }
</script>

<style>

</style>

<style scoped>

    b{
        color:#2A2A2A;
    }


    work-section.full-width-only .work-section-bg {
        position: absolute;
        min-width: 100%;
        height: 100%;
    }


    .work-section .work-section-bg img {
        max-width: 100%;
        min-width: 100%;
    }



</style>
