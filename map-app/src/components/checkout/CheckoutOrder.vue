<template>
  <div>
  <v-card style="border-radius: 8px; overflow: hidden">
    <v-card-title  style="background: #fff; padding-top: 4px; padding-bottom: 4px ; padding-right: 0px; border-bottom: solid 0px ">
        <h3 class="title font-weight-medium"  style="margin-top: 10px; margin-bottom: 10px">Order Summary</h3>
        <v-spacer>
        </v-spacer>
      <!--
        <v-btn color="secondary"  flat dark icon  style="text-transform: none; padding: 0px; border-color: #aaaaaa"  @click="goToCartPage()">
          <v-icon size="20" style="">mdi-pencil</v-icon>
        </v-btn>-->
    </v-card-title>
    <v-card-text style="padding: 0px " class="body-2">
      <p v-show="cartItemsLength == 0" style="margin: 20px">
        <i>No items in the cart </i>
        <router-link to="/create">Create a new map</router-link>
      </p>
      <v-divider></v-divider>

      <template v-show="cartItemsLength > 0">

        <div
          v-for="(item, index) in cartItems" :key="index"
          >
          <v-layout  row class="innerpadding font-weight-bold">
            <v-flex shrink style="margin-right: 5px">
              <VImage
                      style="cursor: pointer"
                      @click.native="onImageClick(item.mapID)"
                      :src="getMapThumbnailURLForMapID(item.mapID)"
                      :elementWidth="85"
                      :elementHeight="85"

              >
              </VImage>
            </v-flex>
            <v-flex shrink style="margin-right: 5px">
              <div class="font-weight-regular " >

                <!--<div class="font-weight-bold"  style="font-size: 12px; margin-bottom: 5px">{{ getMapLocationDescription(item)}} </div>-->
                <div class="font-weight-bold"  style="font-size: 14px; margin-bottom: 5px">{{ getProductLabel(item )}} </div>
                <div style="font-size: 12px" >{{(getOrientationLabel(item)) }} </div>
              </div>
            </v-flex>
            <v-spacer></v-spacer>
            <v-layout column shrink style="min-width: 40px">
              <div class="font-weight-regular" style="color: #888888">
                {{ "Qty " + item.quantity}}
              </div>
              <div class="font-weight-medium">
                {{  getCurrencySymbol + getItemPriceFormattedString(item)}}
              </div>
            </v-layout>
         </v-layout>
          <v-divider v-if="index < cartItemsLength - 1" style="background: #eeeeee"></v-divider>
        </div>
      </template>
    </v-card-text>
  </v-card>
  <div>
    <div>
      <!-- voucher code-->
      <v-layout v-if="!voucherSectionShowing && !hasVoucherData" style="margin-bottom: 10px" >
        <div @click="onShowVoucherSectionBtnClicked"  style="color:#3b5998 ; cursor:pointer ;text-transform: none; margin: 0px; margin-left: 10px;margin-right: 15px;margin-top: 15px;margin-bottom: 5px"> Apply Promo Code +
        </div>
      </v-layout>
      <v-layout v-else="" column >
        <template v-if="hasVoucherData">

          <v-layout row  align-center justify-space-between  class="innerpadding font-weight-bold" style="margin-top: 20px;margin-bottom: 5px" >
            <v-icon color="primary" style="margin-right: 5px">mdi-ticket-percent</v-icon>
            <v-flex shrink >
              <div>Voucher<span class="font-weight-medium font-italic"> {{voucherCode}} </span> </div>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex shrink >
              <div style="text-decoration: underline; cursor: pointer"  @click='removeVoucher()'>remove</div>
              <!---
              <v-btn :loading="voucherLoading"  icon :ripple="false"    style="background-color: #FFFFFF; margin:0px"  @click='removeVoucher()'>

                <v-icon size="22" color="red">mdi-delete-forever</v-icon>
              </v-btn>
              -->
              <v-tooltip bottom>
                <template #activator="data">

                </template>
                <span>Remove</span>
              </v-tooltip>
            </v-flex>

          </v-layout>
          <v-layout v-if="voucherInformation.length > 0"   align-left  justify-space-between  class="innerpadding font-weight-normal" style="margin-bottom: 15px; margin-left: 10px" >
            <v-flex shrink >
              <li class="font-italic"
                      v-for="(item, index) in voucherInformation" :key="index"
              >
                {{item}}
              </li>
            </v-flex>
          </v-layout>

        </template>
        <template v-else="">
          <v-layout row style="margin-bottom: 0px; margin-top:10px;margin-left: 10px;margin-right: 15px">
            <v-text-field ref="voucherCodeInput" v-model="voucherCodeInput"  single-line  label="Voucher Code"  @input="onVoucherInput"></v-text-field>
            <v-btn :color="(voucherError)?'error' : 'primary'" :loading="voucherLoading" @click="applyVoucher()"  style="text-transform: none; width: 70px; margin-top: 5px; margin-bottom: 0;margin-right: 0" large>
              <template v-if="voucherError"> <v-icon style="margin-right: 5px">mdi-alert-circle-outline</v-icon> Invalid </template>
              <template v-else=""> Apply </template>
            </v-btn>
          </v-layout>

        </template>
      </v-layout>
      <!--
      <v-divider style="background: #eeeeee"></v-divider>
      -->
      <v-layout v-if="(hasVoucherData)" justify-space-between row class="innerpadding font-weight-bold">
        <div> Discounts</div>
        <v-spacer></v-spacer>
        <div>{{totalDiscountsPriceWithCurrency}}</div>
      </v-layout>

      <v-layout justify-space-between row class="innerpadding font-weight-bold">
        <div>Subtotal</div>
        <v-spacer></v-spacer>
        <div>{{ subtotalWithDiscountPriceWithCurrency }}</div>
      </v-layout>


      <v-layout justify-space-between row class="innerpadding font-weight-bold" >
        <div>Shipping</div>
        <v-spacer></v-spacer>
       <!--
        <div v-if="shippingRates.length > 0">{{shippingRatePriceFormatted }}</div>
        -->
        <div v-if="hasShippingCost">{{shippingCostWithCurrency }}</div>
        <div v-else="" style="color: #bbbbbb" class="font-weight-regular font-italic">not calculated yet</div>
      </v-layout>

      <!--
      <div style="padding-left: 15px ; padding-top: 10px; padding-bottom: 10px; background: #eeeeee">
        Shipping Options
      </div>
      <v-layout justify-space-between column class="innerpadding font-weight-bold">
        <v-radio-group class="" v-model="$store.state.checkout.shippingRateID">
          <v-radio
            v-for="(item, index) in  $store.state.checkout.shippingRates"
            :key="item.id"
            :label="`${item.name}: $${item.rate}`"
            :value="item.id"

            v-show="shippingRates.length > 0"
          ></v-radio>
        </v-radio-group>
      </v-layout>
      -->
      <!--
      <v-layout justify-space-between column class="innerpadding font-weight-bold">
        <v-btn v-show="$store.state.checkout.shippingRatesRequireUpdating || $store.state.checkout.shippingRatesLoading"  large block color="blue" style="height: 60px" dark v-on:click="calcShippingButtonClicked()" :loading = "shippingRatesLoading">
          Calculate Shipping
        </v-btn>

        <v-radio-group v-model="$store.state.checkout.shippingRateID">
          <v-radio
            v-for="(item, index) in  $store.state.checkout.shippingRates"
            :key="item.id"
            :label="`${item.name} $${item.rate}`"
            :value="item.id"

            v-show="shippingRates.length > 0"
          ></v-radio>
        </v-radio-group>
      </v-layout>
      <v-layout justify-space-between row class="innerpadding" v-show="shippingRates.length > 0">
        <div>Shipping Cost</div>
        <v-spacer></v-spacer>
        <div>${{ shippingCost }}</div>
      </v-layout>
      -->

      <!--
      <v-divider v-if="shippingRates.length > 0"></v-divider>
      -->
      <!--
      <v-layout justify-space-between row class="innerpadding" v-show="shippingRates.length > 0">
        <div>Taxes</div>
        <v-spacer></v-spacer>
        <div>${{0 }}</div>
      </v-layout>
      -->
    </div>
    <!--
    <v-divider v-show="shippingRates.length > 0"></v-divider>
-->
    <v-card-actions  style=" padding: 0px" v-if="shippingRates.length > 0">
      <v-layout justify-space-between row class="innerpadding"  style="padding-top: 15px; padding-bottom: 15px">
        <div class="font-weight-bold subheading" >Total incl. taxes </div>
        <v-spacer></v-spacer>
        <div v-if="hasTotalCost" class="font-weight-bold subheading"> {{ getCurrencySymbol + total }}</div>
        <div v-else="" style="color: #bbbbbb" class="font-weight-regular font-italic">calculated after shipping</div>

      </v-layout>
    </v-card-actions>
  </div>
  </div>
</template>

<script>
  //https://medium.com/point-of-vue/build-a-shopping-cart-with-vue-2-and-vuex-5d58b93c513f
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'
  import {bus} from "./../../main"

  export default {
    data () {
      return {
        voucherSectionShowing: false,
        voucherCodeInput: "",
        voucherError: false,
        voucherLoading: false
      }
    },
    props: {
    },
    computed: {
      ...mapGetters([
              'voucherCode', 'voucherData', 'hasVoucherData', 'totalDiscounts', 'hasTotalDiscounts', 'voucherDataPercentageOff',
        'cart', 'cartItems', 'nItemsInCart', 'shippingRatePrice' , 'shippingRates',
        'hasShippingCost', 'shippingCost', 'shippingCostWithCurrency', 'hasTotalCost', 'totalCost',
        'getCurrencySymbol', 'subtotalPrice', 'totalPriceWithCurrency', 'subtotalPriceWithCurrency', 'subtotalWithDiscountPriceWithCurrency', 'totalDiscountsPriceWithCurrency'
      ]),
      cartItemsLength: function()
      {
        if(this.cartItems) {
          return this.cartItems.length
        }
        return 0;
      },

      total: function(){
        console.log("totalCost", this.totalCost);
        return  this.getformattedMoney(this.totalCost);
      },

      shippingRatesLoading(){
        return this.$store.state.checkout.shippingRatesLoading;
      },
      shippingRatePriceFormatted : function(){
        // todo move this to store?
        let price = this.shippingRatePrice;
        if(price === 0){
          return "FREE SHIPPING";
        }
        else{
          return this.getCurrencySymbol + this.getformattedMoney(price);
        }
      },
      voucherInformation: function(){
        let voucherData = this.voucherData;
        let info = [];
        if(voucherData != null){
          if(voucherData.freeShipping){
            info.push("Free Standard Shipping");
          }
          if(voucherData.percentageOff > 0){
            info.push( (voucherData.percentageOff) +"% discount");
          }
          if(voucherData.freePrints != null){
            for(let i= 0; i < voucherData.freePrints.length; ++i) {
              let quantity = voucherData.freePrints[i].quantity;
              let skuID = voucherData.freePrints[i].skuID;
              info.push(quantity  + " free " + "" +  this.$store.getters.getProductDescriptionFromSkuID(skuID)  + ((quantity > 1) ? "s" : "") );
            }
          }
          return info;
        }
        else{
          return [];
        }
      }
    },
    methods:{
      onShowVoucherSectionBtnClicked: function(e){
        this.voucherSectionShowing = true;
        this.$nextTick(function () {
          this.$refs.voucherCodeInput.focus();
        });
      },
      onVoucherInput: function(value){
        // reset voucher error
        if(this.voucherError) {
          this.voucherError = false;
        }
      },
      onImageClick:function(mapID)
      {
        // editMap
        this.$router.push({ name: 'editMap', params: {route_mapID: mapID } })
      },
      applyVoucher()
      {
        console.log("voucherCodeInput", this.voucherCodeInput);
        this.voucherLoading = true;
        this.$store.dispatch("applyVoucherToCart",this.voucherCodeInput ).then((voucherData)=>
        {
          this.voucherLoading = false;
          this.voucherError = false;

        }).catch(e =>{
          this.voucherLoading = false;
          this.voucherError = true;
          setTimeout(()=>{
            this.voucherError = false;
          },2000);
        });

      },
      removeVoucher()
      {
        this.voucherLoading = true;
        this.$store.dispatch("removeVoucherFromCart" ).then(()=>
        {
          this.voucherLoading = false;
          //this.voucherError = false;
        }).catch(e =>{
          this.voucherLoading = false;
          //this.voucherError = true;

        });
      },
      convertToPriceString(number)
      {
        return this.$store.getters.convertToPriceString(number);
      },
      getformattedMoney : function(price)
      {
        if(price - Math.floor(price) === 0)
        {
          return price;
        }
        return price.toFixed(2);
      },
      goToCartPage : function()
      {
        bus.$emit("openCartDrawer");
        //this.$router.push({ name: 'cart', params: {}})
      },
      calcShippingButtonClicked : function(){
        this.$emit('calcShippingButtonClicked');
      },
      getItemPriceFormattedString: function(mapData){
        return  this.getformattedMoney(this.$store.getters.priceForMap(mapData));
      },
      getPrintsizeLabel: function(mapData){
        console.log("mapData", mapData);
        return  this.$store.getters.labelForPrintSizeID(mapData.basemap.printSizeID, mapData.basemap.metricUnits);
      },
      getOrientationLabel : function(mapData)
      {
        return this.$store.getters.labelForOrientationID(mapData.basemap.orientationID);
      },
      getProductLabel: function(mapData)
      {
        return this.getPrintsizeLabel(mapData)   /*+ " - " + this.getOrientationLabel(mapData)*/;
      },
      getMapLocationDescription(map)
      {
        return this.$store.getters.getMapLocationDescription(map);
      },
      getMapThumbnailURLForMapID(mapID){
        return this.$store.getters.getMapThumbnailURLForMapID(mapID);
      },
    },
    watch:{
    },
    mounted(){

      if(!this.hasVoucherData) {
        this.voucherSectionShowing = false;
      }
    }
  }
</script>

<style scoped>

  .innerpadding{
    padding: 2px 10px;
  }
</style>
