<template>
    <div >

        <!-- temp remove this-->
        <ShippingOfferMessage></ShippingOfferMessage>





        <div class="heighttransition" style="z-index:1;" :style="{height: headerHeightStyle}" >

            <section class="site-section " style="background: none ; height: 100%;" >
                <!--
                  <v-img position="50% center"
                         max-width="26 00px"
                         src="/static/assets/home/headertest.png"
                         srcset="/static/assets/home/header-mobile.jpg 200w, /static/assets/home/headertest.png 700w"
                         sizes="(max-width: 600px) 200px, 50vw"
                         lazy-src="/static/assets/home/header-lazy.jpg"
                         class="headerimage heighttransition" style="z-index: 0;height:100% "></v-img>
                -->
                <v-layout justify-center align-center row style="position: absolute; width: 100%; height: 100%; ">

                    <div style="z-index:1; margin-top: auto">
                        <ScrollingIcon style="margin-bottom: 20px"></ScrollingIcon>
                    </div>
                </v-layout>


                <div class="hero__container" >
                    <div class="hero__img hero__img--large" style="background-position:60% center" :style="`background-image: url(${require('@/assets/img/home/headertest.webp')})`">
                        <div class="hero__body hero__body--center fill-height" id='hero-body'>
                            <v-layout column style="position:relative; color: black; margin-left: 10px; margin-right: 0px; padding-left: 254px;" align-left  justify-center fill-height>

                                <!-- <div style="position: relative">
                                  <img class="header-image"  src="/static/assets/home/header-right-test.png">
                                </div> -->
                                <v-flex shrink style="z-index: 1">
                                    <h3 data-aos="fade" data-aos-delay="0" data-aos-duration="1500" class="font-weight-medium display-3 text-xs-left" style="padding-top: 0px; margin-left:-3px">Maps Meet Art.</h3>
                                </v-flex>
                                <v-flex shrink style="z-index: 1;margin-bottom: 5px">
                                    <h2  data-aos="fade" data-aos-delay="000" data-aos-duration="1500" class="header-subtitle font-weight-medium heading text-xs-left">
                                        Create beautiful map prints of a place close to your heart.
                                    </h2>
                                </v-flex>
                                <v-flex  shrink style="z-index: 1; margin-top: 30px">
                                    <div data-aos="fade" data-aos-delay="400" data-aos-duration="1500">
                                        <HomeSearchInput @go="gotoCreatePage(false)"></HomeSearchInput>
                                    </div>
                                </v-flex>
                            </v-layout>
                        </div>
                    </div>

                    <!-- shows up only on mobile view -->
                    <div class="mbl-image" id="mbl-image"></div>

                    <div class="hero__body hero__body--center" id='text-body'>
                        <v-layout column style="position:relative; color: black; margin-left: 10px; margin-right: 0px;" align-left  justify-center fill-height>

                            <!-- <div style="position: relative">
                              <img class="header-image"  src="/static/assets/home/header-right-test.png">
                            </div> -->
                            <v-flex shrink style="z-index: 1">
                                <h3 data-aos="fade" data-aos-delay="0" data-aos-duration="1500" class="font-weight-medium display-3 text-xs-left" id="mbl-h-3" style="padding-top: 0px; margin-left:-3px">Maps Meet Art.</h3>
                            </v-flex>
                            <v-flex shrink style="z-index: 1;margin-bottom: 5px">
                                <h2  data-aos="fade" data-aos-delay="000" data-aos-duration="1500" class="header-subtitle font-weight-medium heading text-xs-left" id="mbl-h-2">
                                    Create beautiful map prints of a place close to your heart.
                                </h2>
                            </v-flex>
                            <v-flex  shrink style="z-index: 1; margin-top: 30px" class='search-input-wrap'>
                                <div data-aos="fade" data-aos-delay="400" data-aos-duration="1500">
                                    <HomeSearchInput @go="gotoCreatePage(false)"></HomeSearchInput>
                                </div>
                            </v-flex>
                        </v-layout>
                    </div>

                </div>
            </section>
        </div>



        <main >
            <div class="work-section" style=" background: inherit; margin-top: 50px; margin-bottom: 50px">
                <div class="work-section-container "  >
                    <v-layout  row class=" justify-left align-left align-content-left "   >
                        <v-flex xs12 sm10 >
                            <h2 class=" font-weight-bold display-2"> Your Style. Your Story. </h2>
                            <h2 class="font-weight-medium heading no-bottom-margin" style="color: gray;"> Apply a range of hand crafted color themes to complement any room. Choose between bright, vibrant themes or more muted themes to blend into your space. </h2>
                        </v-flex>
                    </v-layout>
                </div>
            </div>
        </main>

        <!-- test -->
        <main>
            <div class="work-section-container "  >
                <MockupSection
                        v-for="(map, index) in maps" :key="index"
                        :mapData = "map"
                        :isTop="index == 0"
                        light
                        :showTheme = "true"
                        :reversed='index % 2 == 1'
                ></MockupSection>
            </div>
        </main>


        <!-- data-aos="fade-up" data-aos-duration="600" data-aos-offset="100"  -->
        <!--
         <main>
           <div data-aos="fade-up" data-aos-duration="600" data-aos-offset="100" class="work-section full-width-only" style="max-width: 800px">

             <slick ref="slick"  :options="slickOptions">
              <div><img data-lazy="static/assets/home/mock4 full alt.jpg" alt=""></div>
              <div><img data-lazy="static/assets/home/paris.jpg" alt=""></div>
              <div><img data-lazy="static/assets/home/jerusalem.png" alt=""></div>
              <div><img data-lazy="static/assets/home/mock5 full.jpg" alt=""></div>
              <div><img data-lazy="static/assets/home/mock3 full.jpg" alt=""></div>
              <div><img data-lazy="static/assets/home/stockholm.jpg" alt=""></div>
              <div><img data-lazy="static/assets/home/istanbul.png" alt=""></div>
            </slick>
          </div>
         </main>
      -->
        <!--
        <main >
          <div data-aos="fade-up"  class="site-section">
            <content class="site-section-content">
              <v-container  fluid style="padding: 0px !important;">

                <v-layout  row class="theme-container justify-left align-left align-content-left "  style="padding: 4rem" >
                  <v-flex xs12 md10>
                    <h2 class=" font-weight-bold display-1"> Your Style. Your Story. </h2>
                    <h2 class="font-weight-medium heading" style="color: gray"> Apply a range of hand crafted color themes to complement any room. Choose between bright, vibrant themes or more muted themes to blend into your space. </h2>
                  </v-flex>
                </v-layout>
              </v-container>
            </content>
          </div>
        </main>

        -->

        <div  class="widesection" style="">
            <v-container>

                <v-layout  shrink column wrap align-center justify-center style="margin-top: 0px; margin-bottom: 50px">
                    <!--
                    <h4 class="font-weight-medium display-2 text-xs-center" style="padding-top: 0px">
                      Ready to begin?
                    </h4> -->
                    <v-btn  outline round large color="grey darken-2" dark @click="gotoExamplesPage()" class=" title font-weight-normal  " style="margin-top: 0px; height: 50px; text-transform: none">
                        Explore More Examples
                    </v-btn>
                </v-layout>
            </v-container>
        </div>


        <!--  paypal credit-card section --->
        <main >
            <div class="work-section " style=" background: inherit; border-bottom: 1px #DDDDDD solid; border-top: 1px #DDDDDD solid">
                <div  class="work-section-container-row " >

                    <v-layout  row wrap class="justify-center align-center" style="margin-top: 10px; margin-bottom: 10px"  >
                        <v-flex xs5 md2 class="text-xs-center" >
                            <img src="/static/assets/cards/svg/visa-logo.svg" class="cardimage" />
                        </v-flex>
                        <v-flex xs5 md2 class="text-xs-center">
                            <img src="/static/assets/cards/svg/mastercard-logo.svg" class="cardimage"/>
                        </v-flex>
                        <v-flex xs5 md2 class="text-xs-center">
                            <img src="/static/assets/cards/svg/maestro-logo.svg" class="cardimage"/>
                        </v-flex>
                        <v-flex xs5 md2 class="text-xs-center">
                            <img src="/static/assets/cards/svg/amex-logo.svg" class="cardimage"/>
                        </v-flex>
                        <v-flex xs5 md2 class="text-xs-center">
                            <img src="/static/assets/cards/svg/paypal-logo.svg" class="cardimage" />
                        </v-flex>
                    </v-layout>
                </div>
            </div>
        </main>


        <main >
            <div class="work-section " style=" background: inherit;">
                <div data-aos="fade-up" class="work-section-container no-bottom-margin" >
                    <!--
                  <ImageGallery ></ImageGallery>
          -->
                    <v-layout  row class=" justify-left align-left align-content-left "   >
                        <v-flex xs12 sm10 >
                            <h2 class="font-weight-bold display-2"> It's All In The Detail. </h2>
                            <h2 class="font-weight-medium heading no-bottom-margin" style="color: gray">We print on specially sourced <b> museum-quality </b> matt paper that's lightly textured to provide deep and rich colors.
                                Pick out the fine details up close or admire it from a far.
                            </h2>
                        </v-flex>
                    </v-layout>
                </div>
            </div>
            <div class="work-section " style=" background: inherit;">
                <div  class="work-section-container-row " >
                    <v-layout  row class="justify-start align-left align-content-left"  >
                        <v-flex xs12 md7>
                            <img data-aos="fade-up" src="/static/assets/home/close up.jpg"  class="full-width" alt="">
                        </v-flex>
                    </v-layout>
                    <v-layout  row class="justify-end align-right align-content-right" style="margin-top: 2rem"  >
                        <v-flex xs12 md8>
                            <img data-aos="fade-up" src="/static/assets/home/close up 2.jpg"   class="full-width" alt="">
                        </v-flex>
                    </v-layout>
                </div>




            </div>
        </main>


        <main >
            <div class="work-section " style=" background: inherit; border-top: 1px #DDDDDD solid">
                <div  class="work-section-container-row " >
                    <v-layout  row wrap class="justify-center align-center" style="margin-top: 10px; margin-bottom: 10px"  >
                        <v-flex xs12 md4>
                            <IconWithTextBlock
                                    text="World wide shipping"
                                    subtext="Fast and reliable deliveries"
                                    icon="mdi-earth"
                            ></IconWithTextBlock>
                        </v-flex>
                        <v-flex xs12 md4>
                            <IconWithTextBlock
                                    text="The perfect gift"
                                    subtext="Unique and personal for everyone."
                                    icon="mdi-gift"
                            ></IconWithTextBlock>
                        </v-flex>
                        <v-flex xs12 md4>
                            <IconWithTextBlock
                                    text="High quality products"
                                    subtext="Our products stand the tests of time."
                                    icon="mdi-diamond"
                            ></IconWithTextBlock>
                        </v-flex>
                    </v-layout>
                </div>
            </div>
        </main>



        <div class="work-section " style=" background: #252525;">
            <div  class="work-section-container-row " >

                <v-layout  row class=" justify-left align-left align-content-left "   >
                    <v-flex xs12 sm10 >
                        <h2 class="font-weight-bold display-2"  style="color: white"> Easy Edits. </h2>
                        <h2 class="font-weight-medium heading no-bottom-margin" style="color: lightgrey">
                            Simple 2 Step Editor. Explore different themes and personalize with your own text.
                        </h2>
                    </v-flex>
                </v-layout>
                <v-layout row :wrap="$mq=='mobile'"  style="color: #DDDDDD; margin-top: 30px">
                    <v-layout column align-left justify-center
                              xs12  sm6>
                        <h2 class="text-xs-left heading font-weight-light" style="margin-top: 20px">
                            <div class="step">1</div>
                            Choose Your Map Area <!-- <v-icon size="32">mdi-earth</v-icon> -->
                        </h2>
                        <!--
                        <h2 class="text-xs-center subheading font-weight-light" style="margin-top: 0px">
                          Search for a place, anywhere in the world
                        </h2>
                        -->
                        <h2 shrink class="text-xs-left heading font-weight-light" style="margin-top: 20px">
                            <div class="step">2</div>
                            Customize Colors & Styling  <!--<v-icon size="32">mdi-palette</v-icon> -->
                        </h2>
                        <!--
                        <h2 shrink class="text-xs-center subheading font-weight-light" style="margin-top: 0px">
                          Choose from a range of hand crafted color schemes.
                        </h2>
                        <v-flex shrink style="height: 30px ;margin-top: 10px; ">
                          <img  class="themebutton"  src="/static/assets/colourschemes/15 47_lavender forest.svg">
                          <img  class="themebutton"   src="/static/assets/colourschemes/13 56_teatime.svg">
                          <img  class="themebutton"   src="/static/assets/colourschemes/18 44_crayon.svg">
                        </v-flex>
            -->
                    </v-layout>


                    <v-flex width="100%" shrink xs12  sm6 fill-height>
                        <div class="align-content-center" style="width:100%">
                            <LazyImage src="/static/assets/home/step2.png"></LazyImage>
                        </div>

                        <!--
                        <div class="align-content-center" style="width:100%">
                          <LazyImage src="/static/assets/home/step2.png"></LazyImage>
                        </div>
                        -->

                    </v-flex>
                </v-layout>


            </div>
        </div>
        <!--
        <div data-aos="fade-up" class="widesection" style="background-color: #eeeeee; margin-top: 0px">
          <v-layout column wrap align-center justify-center style="margin-top: 20px; margin-bottom: 20px">

            <v-layout  align-center :column="windowWidth < 500">
              <v-flex>
                <h2 class="text-xs-center heading font-weight-light " style="margin-top: 0px">
                  <v-icon size="32" color="green">mdi-lock</v-icon>  Secure payments
                </h2>
              </v-flex>
              <v-flex style="margin-left: 20px;  margin-top: 0px; margin-bottom: 12px; height: 30px">
                <img src="/static/assets/cards/Dark Color/1.png" height="100%" style="margin: 0px 2px 0px" >
                <img src="/static/assets/cards/Dark Color/2.png"  height="100%" style="margin: 0px 2px 0px" >
                <img src="/static/assets/cards/Dark Color/22.png"  height="100%" style="margin: 0px 2px 0px" >
                <img src="/static/assets/cards/Dark Color/14.png" height="100%" style="margin: 0px 2px 0px" >
              </v-flex>
            </v-layout>


          </v-layout>
        </div>
        -->

        <div  class="widesection" style="background-color: #252525;">
            <v-container>

                <v-layout  shrink column wrap align-center justify-center style="margin-top: 50px; margin-bottom: 50px">
                    <!--
                    <h4 class="font-weight-medium display-2 text-xs-center" style="padding-top: 0px">
                      Ready to begin?
                    </h4> -->
                    <v-btn data-aos="fade-up" round large color="hero" dark @click="gotoCreatePage(true)" class=" title font-weight-light  " style="margin-top: 0px; height: 50px; text-transform: none">
                        Create Your Own Map <v-icon class="shake" right>mdi-arrow-right</v-icon>
                    </v-btn>
                </v-layout>
            </v-container>
        </div>



        <!--
            <h2 class="text-xs-center  font-weight-light font-italic" style="margin: 30px">
              <div style="color: #888888">
                <span class="font-weight-bold " >“</span> Customer quote here <span class="font-weight-bold " >”</span>
              </div>
              <div>
                <v-icon v-for="i in 5" :key="i" color="yellow darken-2" size="32">mdi-star</v-icon>
              </div>
            </h2>
            <v-divider ></v-divider>
        -->
        <SiteFooter></SiteFooter>
    </div>
</template>
<script>
  // import DemoMapWidget from './DemoMapWidget.vue'
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'

  export default {
    components:{
      /*   Slick, */
      LazyImage: () => import('@/components/home/LazyImage.vue'),
    //   ImageGallery: () => import('@/components/home/ImageGallery.vue'),
      HomeSearchInput: () => import('@/components/home/HomeSearchInput.vue'),
      ScrollingIcon: () => import('@/components/home/ScrollingIcon.vue'),
      MockupSection: () => import('@/components/home/MockupSection.vue'),
      IconWithTextBlock: () => import('@/components/home/IconWithTextBlock.vue')
      //   DemoMapWidget
    },
    props: {
    },
    computed: {
      ...mapGetters([
        'hasShippingOffer','shippingOfferID'
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
        showMoreExamples: false,
        windowWidth: 600,
        headerHeight : 650, // get updated by onResize,
        slickOptions: {
          lazyLoad: 'ondemand',
          centerMode: false,
          arrows: true,
          slidesToShow: 1,
          dots: true,
          infinite: true,
          speed: 300,
          slidesToScroll: 1,
          autoplay: false,
          autoplaySpeed: 2000
        },
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
            image:"stockholm.webp",
            themeNameColour:'#e2c951'
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
            image:"london.webp",
            themeNameColour:'#d0c3b5'
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
            image:"rome.webp",
            themeNameColour:'rgb(211, 158, 113)'
          }

        ]
      }
    },
    methods:{
      gotoExamplesPage : function( ){
        this.$router.push({name: 'examples', params: {}})
      },
      gotoCreatePage : function( resetLocation = false ){
        if(resetLocation) {
          this.$router.push({name: 'createnew', params: {}})
        }
        else{
          this.$router.push({name: 'create', params: {}})

        }
      },
      onResize: function(){
        let h = window.innerHeight;
        //console.log("h", h , this.headerHeight);
        this.headerHeight = Math.min( Math.max(400, h - 40), 1500);
        this.windowWidth = window.innerWidth;

        let windowHeight = window.innerWidth;

        // justify headings to center on mobile view
        if (windowHeight <= 767) {
          const h3 = document.getElementById('mbl-h-3')
          h3.classList.remove('text-xs-left')
          h3.classList.add('text-xs-center')

          const h2 = document.getElementById('mbl-h-2')
          h2.classList.remove('text-xs-left')
          h2.classList.add('text-xs-center')
        } else {
          const h3 = document.getElementById('mbl-h-3')
          h3.classList.remove('text-xs-center')
          h3.classList.add('text-xs-left')

          const h2 = document.getElementById('mbl-h-2')
          h2.classList.remove('text-xs-center')
          h2.classList.add('text-xs-left')
        }

        const w = window.innerWidth
        const h2 = document.getElementById('mbl-h-2')
        if(w <= 767) {
          h2.classList.remove('header-subtitle')
        } else {
          h2.classList.add('header-subtitle')
        }

        this.adjustMobileImgHeight();
      },
      // to adjust the image height so that searchbar may show without scrolling on all mobile resolutions
      adjustMobileImgHeight: function () {
        let h = window.innerHeight;
        if(h <= 568) {
          $('#mbl-image').height('28vh');
        } else if(h >= 736) {
          $('#mbl-image').height('48vh');
        } else {
          $('#mbl-image').height('40vh');
        }
      }
    },
    watch:{
    },
    mounted: function()
    {
      this.adjustMobileImgHeight();

      //   console.log("homepage mounted");
      window.addEventListener("resize", this.onResize);
      this.onResize();

      var text0 = "Home Sweet &home;";
      var text1 = "A Place Close To Your &hearts;";
      var text2 = "A Great Escape";
      var text3 = "A Story Of Adventure";
      var text4 = "A Fond Memory";

      // test
      var pauseTime = 2000;
      /*
      $('.type-it').typeIt({
        speed: 150, lifeLike: false, autoStart: true,loop: true
      })
              .tiType(text0).tiPause(pauseTime) .tiDelete(text0.length)
              .tiType(text1) .tiPause(pauseTime).tiDelete(text1.length)
              .tiType(text2).tiPause(pauseTime) .tiDelete(text2.length)
              .tiType(text3).tiPause(pauseTime) .tiDelete(text3.length)
              .tiType(text4).tiPause(pauseTime) .tiDelete(text4.length)

*/
      /*
      $("#slider").slick({
        lazyLoad: 'ondemand',
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        centerMode: false,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2000
      });*/

      let w = window.innerWidth;
      const h2 = document.getElementById('mbl-h-2')
      if(w <= 767) {
        h2.classList.remove('header-subtitle')
      } else {
        h2.classList.add('header-subtitle')
      }


    },
    activated: function()
    {

    },
    deactivated: function(){
      // todo is this the correct lifecycle hook
      window.removeEventListener("resize", this.onResize);

    }
  }
</script>

<style>


    .slick-track{
        font-size:0px !important;
    }

    .slick-dotted.slick-slider{
        margin-bottom: 0px !important;
    }

    .slick-slide img {
        width: 100%;
        display: block;
    }

    .slick-dots li.slick-active button:before, .slick-dots li button:before {
        color: #444444 !important;
        opacity: 1 !important;
    }

    .slick-dots li.slick-active button:before {
        color: transparent !important;
    }

    .slick-dots li button:before {
        color: transparent !important;
    }

    .slick-dots li button {
        min-width: 0 !important;
        margin: 0 !important;
        border: 2px solid #444444  !important;
        border-radius: 100% ;
        width: 12px !important;
        height: 12px !important;
        padding: 0px !important;
    }
    @media only screen and (max-width: 600px) {
        .slick-dots li button {
            width: 8px !important;
            height: 8px !important;
        }
    }

    .slick-dots li.slick-active button {
        border: none;
        border-radius: 100%;
        opacity: 1 !important;
        color: #444444  !important;
        background: #444444  !important;
    }

    .slick-dots {
        position: absolute !important;
        bottom: 0.8rem !important;
    }




</style>

<style scoped>

    @media print, screen and (min-width: 48em) {
        .hero__container {
            width: 100%;
            height: 100%;
            display: -webkit-box;
            display: flex;
            -webkit-box-orient: horizontal;
            -webkit-box-direction: reverse;
            flex-direction: row-reverse;
            /*
            -webkit-box-align: center;
            align-items: center;
            */
        }
        #text-body{
            display: none;
        }
        .hero__body {
            padding-left: 1.875rem;
            padding-right: 1.875rem;
            max-width: 55.0rem;
            color: black;
        }
        .hero__img {
            flex-basis: 100%;
        }
    }
    @media print, screen and (max-width: 1419px) {
        #hero-body{
            display: none;
        }
        #text-body{
            display: block;
        }
    }
    @media print, screen and (min-width: 768px) and (max-width: 1419px) {
        .hero__body {
            flex-basis: 50%;
            padding-left: 1.875rem;
            padding-right: 1.875rem;
            max-width: 50.0rem;
            color: black;
        }
        .hero__img {
            flex-basis: 50%;
        }
    }

    .hero__container {
        background-color: #fefefe;
    }

    .hero__body {
        padding: 3.125rem 1.875rem;
    }
    .hero__body--center {
        text-align: center;
    }

    .hero__img {
        background-color: #f8f7f7;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: 50%;
    }




    b{
        color:#2A2A2A;
    }

    .full-width{
        width:100%;
    }
    .section-image{
        max-width: 95vh;
        width:100%;
    }

    .work-section-bg {
        position: absolute;
        min-width: 100%;
        height: 100%;
    }

    work-section.full-width-only .work-section-bg {
        position: absolute;
        min-width: 100%;
        height: 100%;
    }

    .work-section-bg {
        height: 100%;
    }



    .work-section .work-section-bg img {
        max-width: 100%;
        min-width: 100%;
    }

    .work-section{
        font-size: 0;
        position: absolute;

        background-size: cover;
        background-position: 50%;
        overflow: hidden;
        position: relative;
        background-color: #272726;
        width: 100%;
        margin: 0 auto;
        padding-left: 0%;
        padding-right: 0%;
        margin-top: 00px;

    }



    .theme-bg-image{
        position: absolute;
    }
    .header-image{
        position: absolute;
    }
    .header-subtitle{
        color: #444444;
        padding-top: 0px;
    }

    @media only screen and (max-width: 960px){
        .section-image{
            margin-bottom: 25px;
        }
    }

    @media only screen and (max-width: 767px){
        .theme-bg-image{
            top: 0;
            margin-top: 100px;
            right: -100px;
            height: 200px;
        }
        .theme-container{
            padding-top: 100px;
            padding-bottom: 100px;
        }
        .header-image{
            left: 200px;
            top: -400px;
            height: 1000px;
        }
        .header-subtitle{
            max-width: 300px;
        }
        .hero__container{
            width: 100%;
            height: 100%;
        }
        .mbl-image{
            width: 100%;
            background-image: url('/static/assets/home/headertest-mobile.jpg');
            background-size: 100% auto;
            background-position: 0 5%;
        }
        #mbl-h-2{
            margin-bottom: 0px !important;
            color: #444444;


        }

    }
    @media only screen and (min-width: 768px){
        .hero__container{
            min-width: 900px;
        }
    }
    @media only screen and (min-width: 601px) and (max-width: 767px){
        .search-input-wrap{
            margin: auto !important;
            width: 68% !important;
            padding-top: 30px !important;
        }
    }

    @media only screen and (min-width: 600px){
        .theme-bg-image{
            top: 200px;
            right: -200px;
            height: 500px;
        }
        .theme-container{
            padding-top: 50px;
            padding-bottom: 50px;
        }
        .header-image{
            left: 300px;
            top: -400px;
            height: 1000px;
        }
        .header-subtitle{
            max-width: 400px;
        }
        .section-image{
            min-width: 500px;
        }
    }

    .no-bottom-margin{
        margin-bottom: 0;
    }

    .header-container{
        display: flex;
        position: relative;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;

    }

    .close-icon {
        width: 100%;
        height: 20px;
        opacity: 1;
        margin-top: 7px;
        margin-bottom: 7px;

    }

    .close-icon:before, .close-icon:after {
        position: absolute;
        content: ' ';
        height: 20px;
        width:1.5px;
        background-color: #fff;
    }
    .close-icon:before {
        transform: rotate(45deg);
    }
    .close-icon:after {
        transform: rotate(-45deg);
    }

    .locationHeading{
        margin: 0;
        color: #eeeeee;
        font-size: 2.5rem;
        margin-bottom: 10px;
    }
    .themeHeading{
        margin-bottom: 0; margin-right: 10px
    }


    .test-theme-01-252_jazz-bg {
    // background: red;
        object-fit: cover;
        background-repeat: no-repeat;
        width:110%;
        background: url("data:image/svg+xml,%3csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='1 1 95 95'%3e %3ctitle%3eUntitled-1%3c/title%3e %3cg transform='rotate(45 50 50)'%3e %3crect style='fill: rgb(106%2c166%2c166)%3b' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill: rgb(64%2c43%2c60)%3b' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill: rgb(242%2c178%2c99)%3b' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill: rgb(242%2c104%2c53)%3b' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
    }

    .shake {
        animation: shakeAnimation 2s infinite cubic-bezier(.36,.07,.19,.97) both;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        perspective: 1000px;
    }

    @keyframes shakeAnimation {
        10%, 90% {
            transform: translate3d(-1px, 0, 0);
        }
        20%, 80% {
            transform: translate3d(2px, 0, 0);
        }
        30%, 50%, 70% {
            transform: translate3d(-4px, 0, 0);
        }
        40%, 60% {
            transform: translate3d(4px, 0, 0);
        }
    }


    .headercontainer{
        z-index: 0;
        margin-top:-5px;  /* hack to hide the blurry artifact edge on the lazy loaded image */
        display: flex;
        flex-direction: row;
        justify-content: center ;

    }

    .headerimage {
        position: absolute;
        margin: 0;
        /*
        background-position: center;
        background-size: cover;
        background-image: url(/static/assets/home/header.jpg);
        */
        width: 100%;
    }

    .heighttransition {
        /*  transition:height 0.2s ease-out;*/
    }

    .widesection{

        justify-content: center ;
        padding-top: 0px;
        padding-bottom: 0px;
    }

    .step {
        background: #000000;
        border-radius: 1.4em;
        -moz-border-radius: 1.4em;
        -webkit-border-radius: 1.4em;
        color: #efebf3;
        display: inline-block;
        font-weight: normal;
        line-height: 1.4em;
        font-size: 0.9em;
        margin-right: 5px;
        text-align: center;
        width: 1.4em;
    }

    .themebutton {
        margin-left: 0px;
        margin-right: 0px;
        width: 35px;
        height: 100%;

        -webkit-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.5);
        -moz-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.5);
        box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.59);
        border-radius: 50px;
        transform: rotate(45deg);
    }
    .themeBar{
        margin-left: 10%;
        margin-right: 10%;
        /* width: 200px; */
        height: 100px;

        /* border-radius: 50px; */
        /* -webkit-transform: rotate(45deg); */
        /* transform: rotate(45deg); */
        margin-top: 10px;
    }

    .exampleimage{
        max-width: 100%;
        max-height: 100%;
    }

    .fluidimage{
        max-width: 100%;
        max-height: 100%;
    }

    .cardimage{
        height: 80px;
    }
</style>
