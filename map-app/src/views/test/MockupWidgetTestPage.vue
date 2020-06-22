<template>
    <main class="Site">
        <Navbar></Navbar>


        <v-dialog
                v-model="modalShowing"
                persistent
                width="800"
        >
            <v-card
                    color="white"
                    light
            >
                <v-card-actions style="padding-left: 5px; padding-top: 15px" class="text-xs-left">
                    <v-spacer></v-spacer>

                    <div class="headline font-weight-normal text-xs-left" style="margin-left: 5px" >
                        Preview
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn flat icon light @click="modalShowing=false"><v-icon>mdi-close</v-icon></v-btn>
                </v-card-actions>


                <v-card-text style="padding-top: 5px; width: 100%;" >
                        <MockupWidget   ></MockupWidget>
                </v-card-text>

            </v-card>
        </v-dialog>


        <main >
            <section class="site-section">
                <content class="site-section-content">
                    <v-container fluid style="font-size: 16px">
                        <v-layout column wrap align-center justify-center>
                            <v-flex xs12 text-xs-center>
                                <h2 class=" display-2 font-weight-light"  style="padding-top: 20px">Mockup Widget Test page.</h2>
                                <h2 class=" display-1 font-weight-light"  style="padding-top: 00px">Your order was completed successfully.</h2>
                            </v-flex>
                            <v-flex xs12 text-xs-center>
                                <Checkmark></Checkmark>
                            </v-flex>
                            <v-flex xs12 text-xs-center style="width:100%;" >
                                <MockupWidget   ></MockupWidget>
                            </v-flex>
                            <v-btn @click="open(1)"> open </v-btn>
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
  import Checkmark from '../../components/common/CheckmarkAnimated'
  import MapWidget from "../../components/common/MapWidget";
  export default {
    components: {
      MapWidget,
      Checkmark
    },
    data () {
      return {
        modalShowing: true
      }
    },
    props: {
    },
    computed: {
      ...mapGetters([
        'orderID',

      ]),
      getOrderIDLabel: function()
      {
        if(this.orderID == null) return "n/a";
        return this.orderID;
      }
    },
    methods:{
      open: function(mapid){
        this.modalShowing = true;
      },
      gotoHomePage : function(){
        this.$router.push({ name: 'home', params: {} })

      }
    },
    watch:{
    }
  }
</script>

<style scoped>

    .site-section{
        background-color: #fff;
        border-bottom: 1px solid #e4e9ec;
        padding: 2rem 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }


    .Site {
        display: flex;
        min-height: 100vh;
        flex-direction: column;
        justify-content: space-between;

    }

    .Site-content {
        flex: 1;
    }
</style>
