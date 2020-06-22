<template>
  <v-navigation-drawer class="navDrawer" temporary light app  right v-model="cartDrawerShowing" touchless width="400" :height='getInnerWindowHeight()'>

    <div class="HolyGrail-nav">
      <div>
        <div class="sidenavtop">
          <!--
          <button class="menu-button" @click="closeNav()" >
            <v-icon color="white">mdi-chevron-left</v-icon>
          </button>
          -->
          <panel-header text="Cart" icon=""  >
            <template slot="right">
              <v-btn style="margin-left: 120px; height: 40px; width: 40px" icon @click="cartDrawerShowing = false" dark><v-icon size="32">mdi-close</v-icon> </v-btn>
            </template>
          </panel-header>
        </div>
      </div>
      <div class="sidenav-scrollcontentholder " :style="{ 'padding-bottom': (hasVoucherData) ? '145px;': '105px'}">
        <div class ="sidenav-scrollcontent customscroll">
          <!--   MAIN SIDE BAR CONTENT GOES HERE -->
          <div class="sidenav-scrollcontentinner" :style="{width: innerScrollContainerWidth + 'px'}">
            <template v-if="!isCartLoaded">
              <div class="text-xs-center"  style="margin-top: 50px">
                <v-progress-circular
                        size="44"
                        indeterminate
                        color="primary"
                ></v-progress-circular>
              </div>
            </template>
            <template v-else="">
              <!--
              <div v-show="cartItems.length == 0">
                <p >Your cart is empty, let's create your first map!</p>
                <v-btn round large color="primary" dark @click="gotoCreatePage()" class=" title font-weight-light pulse" style="height: 50px; text-transform: none; margin-left: -0px">
                  Get Started
                </v-btn>
              </div>
        -->


              <!--
              <v-divider></v-divider>
              -->
              <div v-for="(map, index) in cartItems" :key="index" >

                <div style="margin-bottom: 0px; margin-right: 15px">
                  <div style="padding: 10px">

                    <v-container fluid grid-list-md style="padding: 0px">

                      <v-layout row  align-center justify-start >
                        <v-flex shrink>
                          <v-layout column  align-center justify-center fill-height >

                            <v-flex shrink >
                              <v-btn  :loading="isDeleteWaiting(index)" icon :ripple="false"    style="background-color: #FFFFFF; margin:0px"  @click='removeItem(index,map.mapID)'>
                                <v-icon size="22" color="red">mdi-delete-forever
                                </v-icon>
                              </v-btn>
                              <v-tooltip bottom>
                                <template #activator="data">

                                </template>
                                <span>Remove Map</span>
                              </v-tooltip>



                            </v-flex>
                            <v-flex shrink>
                              <v-btn   @click='editMap(map)'  icon   round   style="background-color: #FFFFFF; margin: 0px; color: #222222" >
                                <v-icon  size="22">mdi-pencil</v-icon>
                              </v-btn>
                            </v-flex>
                          </v-layout>
                        </v-flex>

                        <v-flex shrink >

                          <VImage @click.native='editMap(map)'
                                  style="cursor: pointer; min-width: 85px; min-height: 50px;   margin-right: 0px"
                                  :src="getMapThumbnailURLForMapID(map.mapID)"
                                  :elementWidth="180"
                                  :elementHeight="180"

                          >
                          </VImage>
                        </v-flex>

                        <v-spacer></v-spacer>

                        <v-layout column justify-start align-end fill-height>

                          <v-flex skrink class="font-weight-bold" text-xs-right>
                            {{getPrintsizeLabel(map)}}
                            <!-- {{map.text1}}-->
                            <!-- {{getMapLocationDescription(map)}}-->
                          </v-flex>
                          <v-flex skrink class="font-weight-regular" text-xs-right>
                            {{getOrientationLabel(map)}}
                          </v-flex>

                          <v-spacer></v-spacer>

                          <!--
                                  <v-flex shrink>
                                    <input min="1" max="100" class="quantity" type="number" placeholder="0" v-model.number="localCartItemQuantities[index]"></input>
                                  </v-flex>

-->
                          <v-flex skrink class="subheading" text-xs-right style="margin-top: 30px; color: #888888">

                            <!--
                            <v-btn icon  style="font-size: 1em; margin: 0px; text-transform: none;margin-bottom: 5px; width: 25px; height: 25px" color="grey lighten-4" >
                            {{map.quantity}}
                            </v-btn>
                            -->

                            <v-btn v-if="map.quantity > 1"  @click="decreaseQuantity(index)" icon  style="font-size: 0.6em; margin: 0px; text-transform: none;margin-bottom: 5px; width: 22px; height: 22px" :loading="updateQuantityWaiting" color="grey lighten-4" >
                              <v-icon size="12">mdi-minus</v-icon>
                            </v-btn>
                            <v-btn @click="increaseQuantity(index)" icon  style="font-size: 0.6em; margin: 0px; text-transform: none;margin-bottom: 5px; width: 22px; height: 22px" :loading="updateQuantityWaiting" color="grey lighten-4" >
                              <v-icon size="12">mdi-plus</v-icon>
                            </v-btn>
                            <div style="display: inline-flex; margin-left: 5px">{{"Qty " + map.quantity}}</div>

                          </v-flex>
                          <v-flex skrink class="subheading" text-xs-right style="margin-top: -10px; ">
                            {{ getCurrencySymbol +   map.quantity*getItemPrice(map)}}
                          </v-flex>
                        </v-layout>


                      </v-layout>

                    </v-container>
                  </div>

                </div>
                <v-divider></v-divider>


              </div>

              <h3  v-if="(cartItems == null) || (cartItems.length == 0)" class="title font-weight-light text-xs-center" style="margin-top: 50px; margin-bottom: 20px">
                Looks like your cart is empty.
              </h3>

              <template v-if="(nItemsInCart >= 0)">
                <v-layout style="padding: 10px">
                  <v-btn block outline depressed :ripple="true" class="subheading font-weight-regular"  large @click='goToCreatePage()' color="black" style="border: 0px; border-radius: 3px; text-transform: none; height: 50px;  margin: 0px" dark large >

                    <span style="text-decoration: underline;">Create New Map + </span>
                    <!--
                    <v-icon right >mdi-plus</v-icon>
                    -->
                    <!--
                    <template v-else-if="nItemsInCart == 1">
                      Get a <span class="font-weight-bold" style="margin-left:5px; margin-right: 5px"> {{getDiscountTwoOrMore + "%" }} </span> discount on your 2nd map
                    </template>
                    <template v-else-if="nItemsInCart == 2">

                      Get a <span class="font-weight-bold" style="margin-left:5px; margin-right: 5px"> {{getDiscountThreeOrMore + "%"}} </span> discount on your 3rd map
                    </template>
                    <template v-else-if="nItemsInCart >= 3">
                      Get a <span class="font-weight-bold" style="margin-left:5px; margin-right: 5px"> {{discountPercAllItems4OrMore*100 + "%"}} </span> discount on further maps

                    </template>
                      -->
                  </v-btn>
                </v-layout>
              </template>

            </template>




          </div>

        </div>
      </div>
      <div class="sidenav-bottom" v-if="cartItems &&  (cartItems.length > 0)">
        <!--   BOTTOM SIDEBAR CONTENT GOES HERE -->

        <v-layout column style="padding-top: 5px; background-color: #FFFFFF">




          <v-layout row align-center style="padding-left:20px; padding-top: 8px; padding-bottom: 8px">
            <div class=" font-weight-bold" style="">Subtotal </div>
            <v-spacer></v-spacer>
            <div class="" style="min-width: 50px; text-align:right">{{subtotalPriceWithCurrency}}</div>
            <div style="margin-right: 20px"></div>
          </v-layout>

          <v-divider></v-divider>

          <v-layout align-center row v-if="hasVoucherData" style="padding-left:20px; padding-top: 8px; padding-bottom: 8px" >
            <v-icon  style="margin-right: 5px" color="primary">mdi-ticket-percent</v-icon>
            <div class="font-weight-bold"> Voucher  <span class="font-weight-medium font-italic">{{ voucherCode }}</span> </div>
            <v-spacer></v-spacer>
            <div class="" style="min-width: 50px; text-align:right">
              <template v-if="hasTotalDiscounts">
                {{totalDiscountsPriceWithCurrency}}
              </template>
              <template v-else="">
                -
              </template>
            </div>
            <div style="margin-right: 20px"></div>
          </v-layout>

          <div :class="{'pulse': (cartItems &&  (cartItems.length > 0)) }"  style="width:100%">
            <v-btn :disabled="cartItems && (cartItems.length == 0)" class="nextbutton hero title font-weight-light " flat block large dark @click="goToCheckoutPage()">
              Checkout <v-icon right>mdi-credit-card</v-icon>
            </v-btn>
          </div>


        </v-layout>

        <!--
        <v-btn :disabled="cartItems.length == 0" :block="mobileView"  :ripple="false" @click='goToCheckoutPage()'  large dark color="primary" style="text-transform: none" >
          <div style="margin-right: 8px">
            Checkout
          </div>
          <v-icon>mdi-credit-card</v-icon>
        </v-btn>-->

      </div>

    </div>

  </v-navigation-drawer>

</template>

<script>
  //https://medium.com/point-of-vue/build-a-shopping-cart-with-vue-2-and-vuex-5d58b93c513f
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'
  import PanelHeader from "../common/PanelHeader";
  //import RemoveIcon from "vue-material-design-icons/delete.vue"
  import {bus} from "./../../main"

  export default {
    components:{
      PanelHeader
      // RemoveIcon
    },
    data () {
      return {
        innerScrollContainerWidth: 400,
        cartDrawerShowing: false,
        updateQuantityWaiting : false,
        deleteWaitingMap : {},
        localCartItemQuantities:{}
      }
    },
    props: {
    },
    computed: {
      ...mapGetters([
        'totalDiscounts', 'hasTotalDiscounts', 'subtotalWithDiscountPriceWithCurrency',
        'nItemsInCart',
        'voucherCode', 'hasVoucherData', 'totalDiscountsPriceWithCurrency',
        'cart', 'cartItems' , 'isCartLoaded' , 'getCurrencySymbol', 'subtotalPriceWithCurrency'
      ]),

      mobileView(){
        return true;// this.$vuetify.breakpoint.xsOnly;
      },
      quantityHasBeenModified(){
        for(var i =0; i < this.cartItems.length;++i)
        {
          if(this.cartItems[i].quantity !=  this.localCartItemQuantities[i]) return true;
        }
        return false;
      },
      total(){
        return this.cart.reduce((total, map) => {
          return total + this.getItemPrice(map) * map.quantity
        }, 0) + this.shippingCost;
      }
    },
    methods:{
      getInnerWindowHeight () {
        return window.innerHeight
      },
      increaseQuantity(mapIndex)
      {
        this.localCartItemQuantities[mapIndex] += 1;
        // update the server
        _delayedQuantityUpdate();
      },
      decreaseQuantity(mapIndex)
      {
        this.localCartItemQuantities[mapIndex] = Math.max(1,  this.localCartItemQuantities[mapIndex] - 1);
        //update the server
        _delayedQuantityUpdate();
      },
      getMapLocationDescription(map)
      {
        return this.$store.getters.getMapLocationDescription(map);
      },

      getMapThumbnailURLForMapID(mapID){
        return this.$store.getters.getMapThumbnailURLForMapID(mapID);
      },
      // edit the map
      editMap: function(map){
        this.cartDrawerShowing = false; // hide cart
        //this.$store.commit("setEditMapData", map);
        // navigate to the page
        //this.$store.commit("setEditorModeToEditExisting");
        //this.$router.push({ name: 'edit', params: {basemapIDRoute: null}})

        //     this.$store.state.map.mapID = null; // zero out so it gets reset
        //     this.$store.state.basemap.basemapID = null; // zero out so it gets reset

        bus.$emit('onCartMapClicked', {mapID: map.mapID });

        this.$router.push({ name: 'editMap', params: {route_mapID: map.mapID } })
      },
      updateQuantities: function()
      {
        this.updateQuantityWaiting = true;
        // create  data array of the quantitues that changed
        var array = [];
        for(var i = 0; i< this.cartItems.length;++i)
        {
          var quantity = this.localCartItemQuantities[i];
          if(this.cartItems[i].quantity != quantity )
          {
            array.push({mapID: this.cartItems[i].mapID, quantity: quantity})
          }
        }
        this.$store.dispatch("updateQuantities", array).then( (result) => {
          // show pop up, this should be after server confirmation
          this.updateQuantityWaiting = false;
        }).catch(()=>{
          this.updateQuantityWaiting = false;
        });
      },
      isDeleteWaiting: function (index){
        return this.deleteWaitingMap[index];
      },
      removeItem : function(index,mapID)
      {
        console.log("CartList .removeItem," , mapID, index);
        this.$set(this.deleteWaitingMap,index, true);
        this.$store.dispatch("removeMapFromCart", mapID).then( (result) => {
          // show pop up, this should be after server confirmation
          this.$set(this.deleteWaitingMap,index, false);
          this.updateLocalState();

        }).catch(()=>{
          this.$set(this.deleteWaitingMap,index, false);

        });
      },
      goToCheckoutPage : function()
      {
        this.cartDrawerShowing = false;
        this.$router.push({ name: 'checkout', params: {}})
      },
      goToCreatePage : function()
      {
        this.cartDrawerShowing = false;
        this.$router.push({ name: 'create', params: {}})
      },
      getItemPrice: function(mapData){
        return  this.$store.getters.priceForMap(mapData);
      },
      getPrintsizeLabel: function(mapData){

        console.log("mapData", mapData);
        return  this.$store.getters.labelForPrintSizeID(mapData.basemap.printSizeID, mapData.basemap.metricUnits);
      },
      getOrientationLabel : function(mapData)
      {
        var orientationID = this.$store.getters.getMapDataOrientationID(mapData);
        return this.$store.getters.labelForOrientationID(orientationID);
      },
      getProductLabel: function(mapData)
      {
        return this.getPrintsizeLabel(mapData) + " - " + this.getOrientationLabel(mapData);
      },
      // update the local quantities
      updateLocalState : function(){
        if(this.cartItems != null) {
          for (var i = 0; i < this.cartItems.length; ++i) {
            this.$set(this.localCartItemQuantities, i, this.cartItems[i].quantity);
          }
        }
      },
      onResize : function(){
        var windowWidth = $( window ).width();
        this.innerScrollContainerWidth = Math.min(400, windowWidth);
        // set css

      }
    },
    watch:{
      cartDrawerShowing: function(val)
      {
        let htmlTag = document.documentElement;
        if(val)
        {
          // $('html').addClass('noscroll');
          // none jquery version
          addClass(htmlTag,'noscroll');

        }
        else{
          //$('html').removeClass('noscroll');
          // none jquery version
          removeClass(htmlTag,'noscroll');
        }
      },
      localCartItemQuantities : function(newItems, oldVal)
      {
        console.log("localCartItemQuantities  updated");
      },
      cartItems: function(newItems, oldVal)
      {
        this.updateLocalState();
      }
    },
    created(){
      this.updateLocalState();
      // this.localCartQuantities = this.$store.getters.getCartQ
    },
    mounted(){
      const html = document.getElementsByTagName('html')[0]
      $(html).bind("touchmove",function(e){
        e.preventDefault();
      });
      $(window).resize(this.onResize);

      bus.$on("openCartDrawer", ()=>{
        this.cartDrawerShowing = true;
      });

      _delayedQuantityUpdate = debounce(() =>{
        // All the taxing stuff you do
        this.updateQuantities();
      }, 250);
    }
  }

  function hasClass(ele,cls) {
    return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
  }

  function addClass(ele,cls) {
    if (!hasClass(ele,cls)) ele.className += " "+cls;
  }

  function removeClass(ele,cls) {
    if (hasClass(ele,cls)) {
      var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
      ele.className=ele.className.replace(reg,' ');
    }
  }

  var _delayedQuantityUpdate;


  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  function debounce(func, wait, immediate) {
    var timeout;

    return function executedFunction() {
      var context = this;
      var args = arguments;

      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      var callNow = immediate && !timeout;

      clearTimeout(timeout);

      timeout = setTimeout(later, wait);

      if (callNow) func.apply(context, args);
    };
  };

</script>

<style>

</style>

<style scoped>
  .navDrawer{
    position: fixed !important;
    /* max-height:  100vh !important; */
    overflow-y: hidden;
  }

  .nextbutton{
    margin: 0px;
    text-transform: none;
    height: 65px;
    border-radius: 0px;
  }

  .HolyGrail-nav {
    /* 12em is the width of the columns */
    display: flex;
    height: 100%;
    width: 100%;
    /*flex: 0 0 300px;*/
    flex-direction: column;
    order: 3;
    background-color: #fff;
  }


  .sidenavtop {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    display: flex;
    z-index: 3;
  }

  .sidenav-scrollcontentholder{
    padding-top: 65px; /* should match the sidenavtop height */
    height: 100%;
    position: relative;
    z-index: 2;

  }

  .sidenav-scrollcontentinner{
    width: 400px; /* gets updated by onResize */
  }

  .sidenav-scrollcontent{
    height: 100%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    -ms-overflow-style: -ms-autohiding-scrollbar;
  }

  .sidenav-bottom {
    width: 100%;
    position:absolute;
    bottom:0;
    background-color: #eeeeee;
    border-top: 1px solid #cccccc;
    padding: 0px;
    z-index: 100;
  }






  tbody tr{
    background: #FFFFFF;
  }

  thead {
    border-bottom-left-radius: 10px;
  }

  table tr:last-child td:first-child {
    border-bottom-left-radius: 0px;
  }

  table tr:last-child td:last-child {
    border-bottom-right-radius: 0px;
  }

  .shop-table{
    width:100%;
    margin: 0 -1px 24px 0;
    text-align: left;
    border-collapse: separate;
    box-shadow: 0 1px 4px 0 rgba(49, 49, 93, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.08);

  }
  .footer-row{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .v-btn-delete{
    background-color: #f75850;
  }

  .quantity{
    border: solid 1px;
    border-radius: 3px;
    padding-left: 7px ;
    padding-right: 2px;
    padding-bottom: 4px;
    padding-top: 4px;
    width: 60px;
    font-size: 1.1em;
  }

</style>
