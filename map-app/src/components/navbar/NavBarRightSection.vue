<template>


  <v-flex shrink  >
    <v-layout row align-center fill-height>
      <!--
      <ProcessingButton></ProcessingButton>
      <div class="divider"></div>
      -->
      <v-flex >
        <CurrencySelectPopUp >
          <CurrencyButton :dark="dark" :light="light" slot="activator"  style="padding-left: 10px; padding-right: 10px;"></CurrencyButton>
        </CurrencySelectPopUp>
      </v-flex>
      <div class="divider"></div>
      <v-flex>
        <CartButton :dark="dark" :light="light" style="padding-left: 10px; padding-right: 10px"></CartButton>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
import CartButton from './CartButton.vue'
import ProcessingButton from './ProcessingButton.vue'
import CurrencyButton from './CurrencyButton.vue'
import CurrencySelectPopUp from './CurrencySelectPopUp.vue'

export default {
 components: {
   CartButton,
   CurrencyButton,
   CurrencySelectPopUp,
   ProcessingButton,
 },
 data () {
   return {
     cartDrawerShowing : true,
     currencyPopUpShowing : false
   }
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
 computed: {
 },
 methods:{
   openCurrencyPopUp: function()
   {
     this.currencyPopUpShowing = true;
   },
   goto: function (pageID)
   {
     this.$router.push({ name: pageID, params: {}})
   },
   toggleMenu : function()
   {
       var x = document.getElementById("menu");
       if (x.className === "site-nav-menu") {
         x.className += " hidden";
       } else {
         x.className = "site-nav-menu";
       }

   },
   onCreateNewClicked : function(){
     this.$router.push({ name: 'custom', params: {}})
   }
 },
 watch:{
 }
}
</script>

<style scoped>

  .floatnav{
    z-index: 1;
    background-color: #eeeeee;
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
 color: white;
 background-color: inherit;
 padding: 0px 10px;
 vertical-align: text-bottom;
 line-height: 1;
 cursor: pointer;
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
 display: flex;
 width: 1100px;
 max-width: 1100px;
 list-style-type: none;
 flex-direction: row;
 justify-content: space-between;
 align-items: center;
 padding: 0px;
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
  margin-left: 10px;
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
