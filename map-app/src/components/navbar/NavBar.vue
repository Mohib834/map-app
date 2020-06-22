<template>
  <div>
    <div class="header-container noselect">
      <div class="floatnav" :class="navbarClasses" >
        <div class="navbar-container" style=" padding-top: 0px; padding-bottom: 0px; margin-top: 0px; margin-bottom: 0px; ">
          <v-layout  class=""  row align-center  style=" margin-top: 5px; margin-bottom: 5px">
            <HamburgerIcon class="hidden-sm-and-up " :open="mobileMenuShowing" @click.native="toggleMenu()"></HamburgerIcon>
            <div class="hidden-sm-and-up">
              <div
                      :class="mobileMenuAnimationClasses"
                      id="mobile-menu"
                      class="mobile-menu"
              >
                <div class="mobile-list">
                      <div
                              v-for="(item, index) in menuItems"
                              :key="index"
                              class="mobile-item mobile-item-border"
                              @click="goto(item.route)"
                      >
                        <a class="menubutton" >{{item.label}}</a>
                      </div>

                </div>

              </div>
            </div>
            <v-spacer class="hidden-sm-and-up"></v-spacer>
            <v-flex  v-show="siteLogoShowing" style="flex: 0 1 auto">
              <SiteLogo :dark="dark" :light="!dark" @click.native="goto('home')" ></SiteLogo>
            </v-flex>
            <v-toolbar-items class="hidden-xs-only">
              <v-layout style="margin-left: 10px">
                <a
                        v-for="(item, index) in menuItems"
                        :key="index"
                        class="menubutton menubutton-desktop"
                        @click="goto(item.route)"
                >
                 {{item.label}}
                </a>
              </v-layout>
            </v-toolbar-items>

            <v-spacer></v-spacer>

            <NavBarRightSection :dark="dark" :light="!dark"></NavBarRightSection>
          </v-layout>
        </div>
      </div>
    </div>
    <!-- <div>
        <v-toolbar>
          <v-toolbar-title>Toolbar Mobile Menu</v-toolbar-title>
          <v-toolbar-items class="hidden-sm-and-down">
             <v-btn
              v-for="item in menu"
              :key="item.icon"
              :to="item.link"
              flat
            >{{ item.title }}</v-btn>
          </v-toolbar-items>
          <v-menu class="hidden-md-and-up">
            <v-toolbar-side-icon slot="activator"></v-toolbar-side-icon>
            <v-list>
              <v-list-tile v-for="item in menu" :key="item.icon">
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                 </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar>
    </div> -->
  </div>
</template>

<script>
  import HamburgerIcon from './HamburgerIcon.vue'

  import SiteLogo from '../common/SiteLogo.vue'
  import NavBarRightSection from './NavBarRightSection.vue'

  export default {
    components: {
      NavBarRightSection,
      SiteLogo,
      HamburgerIcon
    },
    data() {
      return {

        menuItems: [
          {
            label: "Create",
            route: "create"
          },
          {
            label: "Inspire Me",
            route: "examples"
          },
          {
            label: "Our Story",
            route: "about"
          }
        ],
        mobileMenuShowing: false,
        isViewAtTheTopOfPage: true,
        cartDrawerShowing: true,
        currencyPopUpShowing: false,

      }
    },
    props: {
      floating: {
        default: function () {
          return false;
        }
      },
      dark: {
        default: function () {
          return false;
        }
      },
      siteLogoShowing: {
        default: function () {
          return true;
        }
      }
    },
    computed: {
      mobileMenuAnimationClasses : function(){
        return{
          'mobile-menu-fadeOut': !this.mobileMenuShowing,
          'mobile-menu-fadeIn': this.mobileMenuShowing

        }
      },

      navbarClasses: function () {
        var classes =  {
          "floatnavDark": this.dark,
          "floatnavLight": !this.dark,
          "floating": this.floating,
          "floatnavTop": this.floating
        }
        console.log("navbarClasses ", classes );
        return classes;
      }
    },
    methods: {

      openCurrencyPopUp: function () {
        this.currencyPopUpShowing = true;
      },
     
      goto: function (pageID) {
        this.mobileMenuShowing =false;
        this.$router.push({name: pageID, params: {}})
      },
      toggleMenu: function () {
        console.log("here");
        this.mobileMenuShowing = !this.mobileMenuShowing;
      },
      onCreateNewClicked: function () {
        this.$router.push({name: 'custom', params: {}})
      },
      handleScroll : function(){
        if (window.pageYOffset > 0) {
          this.isViewAtTheTopOfPage = false;
        } else {
          this.isViewAtTheTopOfPage = true;
        }

        console.log("navbar handleScroll this.isViewAtTheTopOfPage", this.isViewAtTheTopOfPage );
      }
    },
    watch: {},
    mounted() {

      if(this.floating) {
        window.addEventListener('scroll', this.handleScroll);
        this.handleScroll();
      }
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }
</script>

<style scoped>

  /*  menu fade animations */
  .mobile-menu-fadeOut {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s linear 500ms, opacity 500ms;
  }
  .mobile-menu-fadeIn {
    visibility: visible;
    opacity: 1;
    transition: visibility 0s linear 0s, opacity 500ms;
  }


  .mobile-menu{
    z-index: 100000;
    position: absolute;
    top: 56px !important;
    left: 0 !important;;
    width: 100vw !important;
    max-width: 100vw;
    box-shadow: 0 0.125rem 0.625rem 0 rgba(0,0,0,.1);
  }

  .mobile-list{
    padding: 0;
    background: white;
  }

  .mobile-item{
    height: 56px;
    margin-bottom: 0px;
    display: flex;
    align-items: center;
    justify-content: center;

  }
  .mobile-item-border {
    border-bottom: 1px solid #DDDDDD;
  }




  .header-container{
    height: 56px;
  }

  a{
    text-decoration: none;
    transition-duration: 0.5s;
    transition-property: color;
    color: inherit;
  }
  a:hover {
    color: #7091c3 ;
  }



  /*  when the link is active  */
  .router-link-active{
    /* font-weight: bold; */
  }


  .floating{
    position:absolute;
    width:100%;
  }

  .floatnavDark{
    background-color: #292c2f;
  }
  .floatnavLight{
    background-color: rgba(255, 255, 255, 1);
    border-bottom: 1px solid #00000015
  }

  .floatnavTop{
    background-color: rgba(255, 255, 255,0.25) !important;
    border-bottom: 1px solid #1f1f1f1f;
  }

  .floatnav{
    z-index: 3;
    box-shadow: 0 0.125rem 0.625rem 0 rgba(0,0,0,.08);
    background-color: #fefefe;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    max-width: 1920px;
    margin: 0 auto;
  }

  .divider{

    width: 10px;
    border-left: 0px solid grey;
    height: 0px;
  }


  rightdiv{
    display: flex;
    flex-direction: row;

  }


  .menubutton{
    color: #444444;
    background-color: inherit;
    padding: 0px 10px;
    vertical-align: text-bottom;
    line-height: 1;
    cursor: pointer;
    font-size: 16px;
  }

  .menubutton-desktop{
    margin-left: 24px;
  }

  button.createbutton{

  //background-color: #34a6e3;
    font-size: 1em;
    color: white;
    font-weight: normal;
  }

  .navbar-bg {
    display: flex;
    background-color: #333333;
    width: 100%;
    padding-top: 0;
    padding-bottom: 0;
    flex-direction: row;
    justify-content: center ;
    z-index: 1000;
  }

  .navbar-container {
    position: relative;
    max-width: var(--inner-page-max-width);
    width: 100%;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    display: flex;
    margin: 0 auto;
    padding-left: var(--inner-page-padding);
    padding-right: var(--inner-page-padding);
  }


  .site-nav-menu{

  }

  .menu-list{
    align-items: center;
    font-size: 1.0em;
    color: white;
    display: flex;

  }

  .menu-item{
    padding: 0 1rem;
  }

  .sitelogo{
    display: flex;
    align-content: center;
    color: #ffffff;
    font-size: 1.4em;
    cursor: pointer;
  }

  .text-button {
    cursor: pointer;
    color: white ;

  }

  @media only screen and (max-width: 10000px) {
    .show-desktop-only {
      display: none;
    }

    .hidden {
      display: none;
    }

    .site-nav-menu {
      position: absolute;
      top: 54px;
      left: 0;
      width: 100%;
      z-index: 1000;
      background-color: #333333;
    }

    .menu-item {
      padding: 0 1rem;
      display: block;
      width: 100%;
    }

    .menu-list {
      align-items: center;
      font-size: 1.0em;
      color: white;
      display: block;

    }

    ul {
      border-bottom: 1px solid #888888;
      padding: 0;
    }

    li {
      margin: 0;
      justify-content: center;
      align-content: center;
      align-items: center;
      display: block;
      text-align: center;
      padding: 5px;
    }

    .text-button {
      cursor: pointer;
      color: white ;
      line-height: 2;
      padding: 5px 0px;
    }

    button.createbutton {
      width: 100%;
      line-height: 2;
    }
  }
  @media only screen and (min-width: 10000px) {
    .show-mobile-only {
      display: none;
    }
  }
</style>
