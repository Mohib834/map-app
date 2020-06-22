<template>
  <v-app class="site-centered">

    <template v-if="isBrowserSupported">
      <CookiePolicyPopUp></CookiePolicyPopUp>
      <!--
      <CurrencyWelcomeModal></CurrencyWelcomeModal>
      -->

      <Navbar :floating="false" ></Navbar>

      <keep-alive :include="['PreviewCreatorPage','MapEditorPage', 'PreviewCreatorPageContainer']">
      <router-view  class="page-content" ></router-view>
      </keep-alive>

      <CartSideBar></CartSideBar>
    </template>
    <template v-else="">
      <p style="margin: 20px"> Sorry but this browser isn't supported, please use Edge Browser or Chrome Browser</p>
    </template>
  </v-app>

</template>

<script>
    import NavBar from './components/navbar/NavBar.vue'
   // import commonGlobals from './../../common/commonGlobals'
    var commonGlobals = require('./../../common/commonGlobals');

    import {bus} from "./main"
    //import CartSideBar from "./components/cart/CartSideBar";

    export default {
        components: {
          CartSideBar: () => import("./components/cart/CartSideBar"),  // lazy load it
            NavBar
        },
        data () {
            return {
                clipped: true,
                navDrawerShowing: true,
                fixed: false,
                items: [{
                    icon: 'bubble_chart',
                    title: 'Inspire'
                }],
                miniVariant: false,
                right: true,
                rightDrawer: false,
                absolute: true,
                title: '{Page title}'
            }
        },
        methods:{
            disableTracking : function(){
                this.$ga.disable();
            },
            enableTracking : function(){
                this.$ga.enable();
            }
        },
        computed:{
          isBrowserSupported(){
            return this.$store.getters.isBrowserSupported;
          }
        },
        created(){
            // store
            console.log("app.created");
          this.$store.commit("innerHeight", window.innerHeight);
          this.$store.commit("browserID", get_browser());
          this.$store.commit("isMobileDevice", isMobileDevice());

          // uncomment this to test a new user
            //  localStore.clear();

            //local storage load
            this.$store.commit("loadValuesFromLocalStorage");
            if(this.$store.getters.isFirstVisit) {
                // first visit so show welcome popup
                this.$nextTick(() => {
                //    bus.$emit("showWelcomeModal");
                });
            }
/*
            this.$store.dispatch("retrieveJobsWithCartID").then((jobs) =>{
                // if theres an active job thats not complete then connect to socket then get updates
                for(var i =0; i < jobs.length;++i)
                {
                    var job = jobs[i];
                    if(job.state !==  commonGlobals.PREVIEWMAP_JOB_STATUS_COMPLETE)
                    {
                        // connect to socket
                        this.$store.dispatch("initSocket");
                        let socket = this.$store.getters.getSocket;
                        socket.emit('receiveStatus', job.basemapID); // request status events for the basemapID

                        break;
                    }
                }
            }).catch((e)=>[

            ]);
*/
            this.$store.dispatch("retrieveSessionData").then(() =>{

                this.$store.dispatch("retrieveCartFromServer").then(()=>{
                    console.log("cart retrieved");
                    // retrieve from server


                }).catch(()=>{
                    console.log("cart error");

                });
            });
        },
        name: 'App'
    }


    function isMobileDevice(){
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        return true;
      }
      return false;
    }

    function get_browser() {
      var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
      if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE', version: (tem[1] || '') };
      }
      if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) { return { name: 'Opera', version: tem[1] }; }
      }
      if (window.navigator.userAgent.indexOf("Edge") > -1) {
        tem = ua.match(/\Edge\/(\d+)/)
        if (tem != null) { return { name: 'Edge', version: tem[1] }; }
      }
      M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
      if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
      return {
        name: M[0],
        version: +M[1]
      };
    }





</script>

<style scoped>



</style>
<style >

  :root {
    --inner-page-max-width: 1400px;
    --inner-page-padding: 35px;
  }

  /* mobile browser smaller font sizes */
  @media screen and (max-width: 600px) {
    :root {
      --inner-page-padding: 20px;
    }

    .display-3 {
      font-size: 30px !important;
    }
    .display-2 {
      font-size: 26px !important;
    }
    .display-1 {
      font-size: 22px !important;
    }
    .heading {
      font-size: 20px !important;
    }
    .headline {
      font-size: 20px !important;
    }
  }

  /* no text highlight selection on click - used for buttons */
  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
  }

  /*
  * classes used for itour pop up overlays
  */

  .customitourtheme .hStepNumbers {
    float:left !important;
  }

  .customitourtheme .hBtn {
    float:right !important;
    text-transform: capitalize;
    padding-right: 15px;
    padding-left: 15px;
    color: #222222;
  }

  .customitourtheme .hContBlock {
    box-shadow: 2px 5px 20px rgba(0,0,0,.45);
  }

  .customitourtheme .hContFooter {
    box-shadow: none !important;
  }

  .customitourtheme .continueBtn {
    margin-left: 10px;
    color: white;
    background-color: #3d83ee;
  }

  .customitourtheme .hNext {
    margin-left: 10px;
    color: white;
    background-color: #3d83ee;
  }
  .customitourtheme .hStartBtn {
    margin-left: 10px;
    color: white;
    background-color: #3d83ee;
  }

  .customitourtheme .hNext:hover {
    color: white;
    background-color: #2e6da4;
  }
  .customitourtheme .hStartBtn:hover {
    color: white;
    background-color: #2e6da4;
  }

  .customitourtheme .continueBtn:hover {
    color: white;
    background-color: #2e6da4;
  }

  .customitourtheme .hPrev {
    color: #222222;
    background-color: white;
  }

  .customitourtheme .hPrev:hover {
    color: #222222;
    background-color: #cccccc;
  }

  /*
   * CUSTOM SCROLL BARS ON THE SIDE NAVS
   */

  .customscroll::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  .customscroll::-webkit-scrollbar {
    width: 0px;
  }
  .customscroll:focus::-webkit-scrollbar,
  .customscroll:hover::-webkit-scrollbar {
    width: 7px;
  }

  /* Handle */
  .customscroll::-webkit-scrollbar-thumb {
    background: #999999;
    border-radius: 0px;
  }

  /* Handle on hover */
  .customscroll::-webkit-scrollbar-thumb:hover {
    background: #999999;
  }

  html.noscroll{
    width: 100%;
    position: fixed;
    overflow-y: scroll;
  }

  /*
   * GENERAL SITE LAYOUT
   */

  html{
    overflow-x: hidden;
    font-family: Roboto, sans-serif;
  }

  body{
    background-color: #f0f0f0;
    overflow-x: hidden;

  }

  .site-centered{
    height: inherit;
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    max-width: 1920px;
    margin: 0 auto;
    box-shadow: 0 0.0625rem 0.25rem 0 rgba(61,66,80,.18);
    background-color: white !important;
    overflow: hidden; /*  used to hide the side bar in x, used to hide to scrollbar on next button animation expand */
  }

  .container{
    padding: 0px;
  }

  .work-section-container-row{
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
    margin-bottom: 50px;
    margin-top: 50px;
  }


  .work-section-container{
    position: relative;
    max-width: var(--inner-page-max-width);
    width: 100%;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    flex-wrap: wrap;
    display: flex;
    margin: 0 auto;
    padding-left: var(--inner-page-padding);
    padding-right: var(--inner-page-padding);
    margin-bottom: 50px;
    margin-top: 50px;
  }
  @media only screen and (max-width: 600px){
    .work-section-container{
      margin-top: 25px;
      margin-bottom: 25px;
      flex-direction: row;
    }
    .work-section-container-row{
      margin-top: 25px;
      margin-bottom: 25px;
      flex-direction: row;
    }
  }

  .page-content{
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
    flex: 1 1 auto;
    -webkit-box-orient: vertical;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }

  .site-section{
    padding: 0rem 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: relative;
  }

  .site-section-content{
    max-width: 1100px;
    flex: 1 1 100%;
    margin: auto;
    padding: 10px;
    position:relative;
  }

  main{
    flex: 1;
  }

  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
  ul {
    list-style-type: none;
  }


  button{
    outline: none;
    margin: 0px;
    padding: 5px 14px;
    min-width: 30px;
    align-items: center;
    align-content: center;
    background: #dddddd;
    justify-content: center;
    color: #222222;
    border-radius: 5px;
    font-size: 1.1em;
    font-weight: 500;
  }

  button.delete {
  }

  button.large {
    padding: 7px 14px;
    font-size: 1.3em;
  }

  button:hover{
    cursor: pointer;
  }

  table{
    border-spacing: 0;
    border-radius: 5px;
    border: 1px solid #dddddd;
  }

  thead{
    background: #e1e1e1;
    font-size: 1.1em;
    font-weight: normal;
  }

  tr{
  }

  th{
    vertical-align: middle;
    padding: 9px 12px;
    text-align: left;
  }

  td{
    vertical-align: middle;
    padding: 9px 12px;
    text-align: left;
    border-bottom: 1px solid #dddddd;
  }


  /*  PULSE - for example NEXT BUTTON AND CHECKOUT */

  .pulse {
    animation: pulse 2s infinite;
  }
  .pulse:hover {
    animation: none;
  }

  @-webkit-keyframes pulse {
    0% {
      -webkit-box-shadow: 0 0 0 0 rgba(0,163,255, 0.4);
    }
    70% {
      -webkit-box-shadow: 0 0 0 4px rgba(0,163,255, 0);
    }
    100% {
      -webkit-box-shadow: 0 0 0 0 rgba(0,163,255, 0);
    }
  }
  @keyframes pulse {
    0% {
      -moz-box-shadow: 0 0 0 0 rgba(0,163,255, 0.7);
      box-shadow: 0 0 0 0 rgba(0,163,255, 0.4);
    }
    70% {
      -moz-box-shadow: 0 0 0 12px rgba(0,163,255, 0);
      box-shadow: 0 0 0 12px rgba(0,163,255, 0);
    }
    100% {
      -moz-box-shadow: 0 0 0 0 rgba(0,163,255, 0);
      box-shadow: 0 0 0 0 rgba(0,163,255, 0);
    }
  }
</style>

