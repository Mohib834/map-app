<template>
    <div>
        <div class="work-section-container">
            <HeroTextSection>
                <template slot="title">
                    Inspire Me.
                </template>
                <template slot="subtitle">
                    Browse through some popular destinations around the world. <br>
                </template>
            </HeroTextSection>

        <MockupSection
                v-for="(map, index) in maps" :key="index"
                :mapData = "map"
                :isTop="false"
                light
                :showTheme = "true"
                :reversed='index % 2 == 1'
        ></MockupSection>

            <!--
        <MockupSection
                locationName="Jerusalem"
                countryName="Isarel"
                themeName="Jade Forest"
                themeSVG="jade forest.svg"
                image="jerusalem.png"
                themeNameColour='#f4a8b7'
                :reversed='true'
        ></MockupSection>

        <MockupSection
                locationName="Istanbul"
                themeName="Marine"
                themeSVG="marine.svg"
                image="istanbul.png"
                themeNameColour='rgb(255, 216, 97)'
                :reversed='true'
        >
        </MockupSection>
          -->
        </div>


        <!--
        </template>
  -->
        <!--
        <v-layout v-if="!showMoreExamples"  shrink column wrap align-center justify-center style="padding-top: 0px; padding-bottom: 0px; background: inherit">
          <v-btn round large dark color="grey darken-4" dark @click="showMoreExamples = true" class=" title font-weight-light  " style="margin-top: -25px; height: 50px; text-transform: none">
            View More Examples  <v-icon right> mdi-chevron-down </v-icon>
          </v-btn>
        </v-layout>
  -->



        <SiteFooter></SiteFooter>
    </div>
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
        maps:[
          {
            searchString : 'Stockholm',
            locationName:"Stockholm",
            countryName:"Sweden",
            lat :59.3251,
            lng : 18.0711,
            zoom : 12,
            printSizeID : 4,
            orientationID : 2,
            variation: 0,
            themeID: "04 91_vintage caribbean",
            themeName:"Vintage Caribbean",
            image:"Stockholm.png",
            themeNameColour:'#e2c951'
          },
          {
            searchString : 'New York',
            locationName:"New York",
            countryName:"United States",
            lat : 40.735044,
            lng : -73.99037,
            zoom : 13,
            printSizeID : 4,
            orientationID : 1,
            variation: 0,
            themeID: "28 31_coral bay",
            themeName:"Coral Bay",
            image:"New York.png",
            themeNameColour:'#fdbe9c'
          },
          {
            searchString : 'Paris',
            locationName:"Paris",
            countryName:"France",
            lat : 48.876342,
            lng : 2.296441,
            zoom : 12,
            printSizeID : 4,
            orientationID : 1,
            variation: 0,
            themeID: "03 122_beach time",
            themeName:"Beach Time",
            image:"Paris.png",
            themeNameColour:'#fcc652'
          },
          {
            searchString : 'London',
            locationName:"London",
            countryName:"United Kingdom",
            lat : 51.509020,
            lng : -0.041651,
            zoom : 12,
            printSizeID : 4,
            orientationID : 1,
            variation: 0,
            themeID: "silver mist",
            themeName:"Silver Mist",
            image:"London.png",
            themeNameColour:'#d0c3b5'
          },
          {
            searchString : 'Moscow',
            locationName:"Moscow",
            countryName:"Russia",
            lat : 55.7524999,
            lng : 37.62000,
            zoom : 13,
            printSizeID : 4,
            orientationID : 1,
            variation: 0,
            themeID: "Iris",
            themeName:"Iris",
            image:"Moscow.png",
            themeNameColour:'#d38bbe'
          },
          {
            searchString : 'Helsinki',
            locationName:"Helsinki",
            countryName:"Finland",
            lat : 60.168280,
            lng : 24.94480,
            zoom : 12,
            printSizeID : 4,
            orientationID : 2,
            variation: 1,
            themeID: "zinnia",
            themeName:"Zinnia",
            image:"Helsinki.png",
            themeNameColour:'#13325d'
          },
          {
            searchString : 'Hanoi',
            locationName:"Hanoi",
            countryName:"Vietnam",
            lat :  21.04499,
            lng : 105.8680,
            zoom : 13,
            printSizeID : 4,
            orientationID : 1,
            variation: 2,
            themeID: "_goldhawk",
            themeName:"Gold Hawk",
            image:"Hanoi.png",
            themeNameColour:'#0097ba'
          },
          {
            searchString : 'Delhi',
            locationName:"Delhi",
            countryName:"India",
            lat : 28.6358178,
            lng : 77.222936,
            zoom : 13,
            printSizeID : 4,
            orientationID : 1,
            variation: 1,
            themeID: "dewdrop",
            themeName:"Dewdrop",
            image:"Delhi.png",
            themeNameColour:'#95c6c7'
          },
          {
            searchString : 'Auckland',
            locationName:"Auckland",
            countryName:"New Zealand",
            lat : -36.880000,
            lng : 174.789313,
            zoom : 12,
            printSizeID : 4,
            orientationID : 2,
            variation: 1,
            themeID: "autumn gold",
            themeName:"Autumn Gold",
            image:"Kyoto.png",
            themeNameColour:'#fdc957'
          },
          {
            searchString : 'San Jose',
            locationName:"San Jose",
            countryName:"United States",
            lat : 37.3425000,
            lng : -121.87857,
            zoom : 14,
            printSizeID : 4,
            orientationID : 1,
            variation: 1,
            themeID: "_modernist",
            themeName:"Modernist",
            image:"SAn Jose.png",
            themeNameColour:'#1b4985'
          },
          {
            searchString : 'Rome',
            locationName:"Rome",
            countryName:"Italy",
            lat : 41.89742,
            lng : 12.4803651,
            zoom : 11,
            printSizeID : 4,
            orientationID : 1,
            variation: 0,
            themeID: "11 63_classic coffee",
            themeName:"Classic Coffee",
            image:"Rome.png",
            themeNameColour:'rgb(211, 158, 113)'
          },
          {
            searchString : 'Hong Kong',
            locationName:"Hong Kong",
            countryName:"",
            lat : 22.305794,
            lng : 114.19323,
            zoom : 11,
            printSizeID : 4,
            orientationID : 2,
            variation: 2,
            themeID: "_blue steel",
            themeName:"Blue Steel",
            image:"Hong Kong.png",
            themeNameColour:'#9cc2d6'
          }
        ]
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
