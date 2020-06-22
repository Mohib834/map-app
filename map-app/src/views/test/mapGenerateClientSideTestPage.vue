<template>
    <main class="Site">

        <main >
            <section class="site-section">
                <content class="site-section-content">
                    <v-container fluid style="font-size: 16px">
                        <v-layout column wrap align-center justify-center>
                            <v-flex xs12 text-xs-center>
                                <h2 class=" display-2 font-weight-light"  style="padding-top: 20px">Test page.</h2>
                            </v-flex>

                            <v-flex xs12 text-xs-center style="width:100%;" >
                            </v-flex>
                        </v-layout>
                    </v-container>

                </content>
            </section>
        </main>
        <SiteFooter></SiteFooter>

    </main>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'

  import previewMapCreate from "../../../helper/basemapCreate/previewMapCreate";

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
      ...mapGetters([

      ]),

    },
    methods:{

    },
    watch:{
    },
    mounted(){
      console.log("here");
      previewMapCreate.test();
    }
  }
</script>

<style scoped>

</style>
