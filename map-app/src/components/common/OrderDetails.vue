<template>

    <div>

        <v-layout row wrap align-center justify-center   v-if="findMyOrderDataLoading">
            <v-flex xs12 text-xs-center style="margin-top: 50px">
                <v-progress-circular  indeterminate color='grey' :size="48"  :width="3"></v-progress-circular>
            </v-flex>
        </v-layout>

        <v-layout column justify-center   v-else-if="findMyOrderDataExists">

            <slot name="prepend">
            </slot>

            <template v-if="status">
                <v-flex block style="font-size: 20px; margin-top: 10px">
                    Status <v-chip color="grey" text-color="white" style="font-size: 16px">    {{statusLabel}} </v-chip>
                </v-flex>
                <v-divider style="margin-top: 20px"></v-divider>
            </template>
                <v-flex block class="headline" style="margin-top: 20px">
                Order Reference ID: <span style="font-weight: bold;"> {{orderReferenceID}} </span>
            </v-flex>
            <v-flex block style=" margin-top: 20px">
                Estimated Delivery Date: {{deliveryDate}}
            </v-flex>
            <v-flex block style=" margin-top: 10px"  align-center >
                Order placed on: {{createdAt}}
            </v-flex>

            <v-divider style="margin-top: 20px"></v-divider>
            <v-flex block class="headline" style="margin-top: 20px" >
                Shipping Address
            </v-flex>

            <div v-if="hasShippingAddress"  style="white-space: pre-line; font-size: 14px; margin-top: 10px">
                {{shippingAddressSummary}}
            </div>
            <div v-else="">
                <div style="width: 200px" class="maskedLine"></div>
                <div style="width: 250px" class="maskedLine"></div>
                <div style="width: 220px" class="maskedLine"></div>

            </div>


            <v-flex block style="font-size: 14px; margin-top:10px">
                <v-card v-if="shipments" v-for="(shipment, i) in shipments" :key="i">
                    <v-card-text style="background: lightgrey; font-size: 18px">
                        Shipment
                    </v-card-text>
                    <v-card-text>
                        <v-layout column justify-center>
                            <v-flex block style="font-size: 14px;" >
                                {{shipment.carrier}}
                            </v-flex>
                            <v-flex block style="font-size: 14px; font-weight: bold" >
                                <template v-if="shipment.trackingUrl !=''">
                                    <a :href="shipment.trackingUrl"> {{shipment.trackingUrl}}</a>
                                </template>
                                <template v-else="">
                                    No tracking information yet
                                </template>
                            </v-flex>

                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>

            <v-divider></v-divider>

            <v-flex xs12>
                <h2 class=" headline text-xs-left"  style="padding-top: 20px" >Your Items</h2>
            </v-flex>
            <div v-for="(map, index) in orderItems" :key="index" >

                <div style="margin-bottom: 0px; margin-right: 15px">
                    <div style="padding: 10px">

                        <v-container fluid grid-list-md style="padding: 0px">

                            <v-layout row  align-center justify-start >
                                <v-flex shrink>
                                    <v-layout column  align-center justify-center fill-height >

                                        <v-flex shrink >

                                        </v-flex>
                                        <v-flex shrink>

                                        </v-flex>
                                    </v-layout>
                                </v-flex>

                                <v-flex shrink >

                                    <VImage
                                            style="cursor: pointer; min-width: 85px; min-height: 50px;   margin-right: 0px"
                                            :src="getMapThumbnailURLForMapID(map.mapID)"
                                            :elementWidth="180"
                                            :elementHeight="180"

                                    >
                                    </VImage>
                                </v-flex>

                                <v-spacer></v-spacer>

                                <v-layout column justify-start align-end fill-height>
                                    <!--
                                    <v-flex skrink class="font-weight-bold" text-xs-right>
                                        {{map.text1}}
                                    </v-flex>
                                    -->
                                    <v-flex skrink class="font-weight-bold" text-xs-right>
                                        {{getPrintsizeLabel(map)}}
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

                                        <div style="display: inline-flex; margin-left: 5px">{{"Qty " + map.quantity}}</div>

                                    </v-flex>
                                    <v-flex skrink class="subheading" text-xs-right style="margin-top: -10px; ">
                                        {{ getCurrencySymbol +   getItemPrice(map)}}
                                    </v-flex>
                                </v-layout>





                            </v-layout>


                        </v-container>
                    </div>

                </div>
                <v-divider></v-divider>
            </div>
            <div  style="margin-bottom: 30px"> </div>

            <v-layout row >
                <v-spacer></v-spacer>
                <div class="subheading font-weight-bold" style="margin-right: 10px">Subtotal </div>
                <div class="subheading" style="min-width: 50px; text-align:right">{{subtotalWithCurrency}}</div>
                <div style="margin-right: 20px"></div>
            </v-layout>
            <v-layout row v-if="discountValue > 0" >
                <v-spacer></v-spacer>
                <div class="subheading font-weight-bold" style="margin-right: 10px"> Total Discount</div>
                <div class="subheading" style="min-width: 50px; text-align:right">
                    <template v-if="discountValue > 0">
                        -{{  discountCostWithCurrency }}
                    </template>
                    <template v-else="">
                        -
                    </template>
                </div>
                <div style="margin-right: 20px"></div>
            </v-layout>
            <v-layout row >
                <v-spacer></v-spacer>
                <div class="subheading font-weight-bold" style="margin-right: 10px">Shipping </div>
                <div class="subheading" style="min-width: 50px; text-align:right">{{shippingCostWithCurrency}}</div>
                <div style="margin-right: 20px"></div>
            </v-layout>
            <v-layout row >
                <v-spacer></v-spacer>
                <div class="subheading font-weight-bold" style="margin-right: 10px">Total without VAT </div>
                <div class="subheading" style="min-width: 50px; text-align:right">{{totalWithoutVATWithCurrency}}</div>
                <div style="margin-right: 20px"></div>
            </v-layout>
            <v-layout row >
                <v-spacer></v-spacer>
                <div class="subheading font-weight-bold" style="margin-right: 10px">VAT </div>
                <div class="subheading" style="min-width: 50px; text-align:right">{{VATWithCurrency}}</div>
                <div style="margin-right: 20px"></div>
            </v-layout>
            <v-layout row >
                <v-spacer></v-spacer>
                <div class="subheading font-weight-bold" style="margin-right: 10px">Total </div>
                <div class="subheading" style="min-width: 50px; text-align:right">{{totalCostWithCurrency}}</div>
                <div style="margin-right: 20px"></div>
            </v-layout>


        </v-layout>
        <template v-else="">

            <v-layout column wrap align-start justify-left >
                <v-flex xs12 shrink>
                    <div class="headline">
                        Oops! No such order exists.
                    </div>
                </v-flex>
            </v-layout>

            <!--
            <v-btn color="primary" @click="findmyorderlogin()">Back</v-btn>
            -->
        </template>
    </div>


</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    props: {
      status:{
        default:true
      },
      route_orderReferenceID: {
        type: [String, Number],
        default: null
      }
    },
    data () {
      return {
        loading : false,
        email : "",
        orderReference: ""
      }
    },
    computed: {
      ...mapGetters([
        'findMyOrderDataLoading',
        'supportEmail'
      ]),
      findMyOrderDataExists : function(){
        return this.$store.state.findMyOrderData != null;
      },
      orderReferenceID: function(){
        if(this.$store.state.findMyOrderData ==null) return "";
        return this.$store.state.findMyOrderData.orderReferenceID;
      },
      createdAt: function(){
        if(this.$store.state.findMyOrderData ==null) return "";
        return this.getFormattedDate( this.$store.state.findMyOrderData.createdAt);
      },
      statusLabel : function(){
        if(this.$store.state.findMyOrderData ==null) return "";
        let statusID = this.$store.state.findMyOrderData.statusID;
        return statusLabelMap[statusID];
      },
      deliveryDate : function(){
        if(this.$store.state.findMyOrderData ==null) return "";

        return this.$store.getters.getEstimatedDeliveryDates(this.$store.state.findMyOrderData);

      },
      shipments: function(){
        if(this.$store.state.findMyOrderData ==null) return "";
        return this.$store.state.findMyOrderData.shipments;
      },
      orderItems: function(){
        if(this.$store.state.findMyOrderData ==null) return [];
        return this.$store.state.findMyOrderData.items;
      },
      getCurrencySymbol: function(){
        if(this.$store.state.findMyOrderData ==null) return "";
        return this.$store.state.findMyOrderData.currencySymbol;
      },
      getCurrencyName: function(){
        if(this.$store.state.findMyOrderData ==null) return "";
        return this.$store.state.findMyOrderData.currencyName;
      },
      subtotalWithCurrency: function(){
        if(this.$store.state.findMyOrderData ==null) return "";
        return this.getCurrencySymbol + this.convertToPrice(this.$store.state.findMyOrderData.subTotal);
      },
      VATWithCurrency: function(){
        if(this.$store.state.findMyOrderData ==null) return "";
        return this.getCurrencySymbol + this.convertToPrice(this.$store.state.findMyOrderData.VAT);
      },
      totalWithoutVATWithCurrency: function(){
        if(this.$store.state.findMyOrderData ==null) return "";
        let vat = this.$store.state.findMyOrderData.VAT;
        let total = this.$store.state.findMyOrderData.totalCost;
        return this.getCurrencySymbol + this.convertToPrice(total - vat);
      },
      shippingCostWithCurrency: function(){
        if(this.$store.state.findMyOrderData ==null) return "";
        return this.getCurrencySymbol + this.convertToPrice(this.$store.state.findMyOrderData.shippingCost);
      },
      totalCostWithCurrency: function(){
        if(this.$store.state.findMyOrderData ==null) return "";
        return this.getCurrencySymbol + this.convertToPrice(this.$store.state.findMyOrderData.totalCost);
      },
      vatValue: function(){
        if(this.$store.state.findMyOrderData ==null) return 0;
        return this.$store.state.findMyOrderData.VAT;
      },
      totalCostValue: function(){
        if(this.$store.state.findMyOrderData ==null) return 0;
        return this.$store.state.findMyOrderData.totalCost;
      },
      discountValue : function(){
        if(this.$store.state.findMyOrderData ==null) return "";
        var value = this.$store.state.findMyOrderData.totalCost - this.$store.state.findMyOrderData.shippingCost - this.subTotalValue ;
        //console.log("discount value", value, this.$store.state.findMyOrderData.totalCost, this.$store.state.findMyOrderData.shippingCost, this.subTotalValue );
        return -value;
      },
      discountCostWithCurrency: function(){
        var value = this.discountValue;
        return this.getCurrencySymbol + this.convertToPrice(value);
      },
      subTotalValue: function(){
        // get the cart value
        if(this.$store.state.findMyOrderData ==null) return 0;
        var items = this.$store.state.findMyOrderData.items;
        var sum = 0;
        for(var i =0; i < items.length;++i){
          sum += this.getItemPrice(items[i]);
        }
        return sum;
      },
      hasShippingAddress: function(){
        var data = this.$store.state.findMyOrderData;
        if(data == null) return false;
        return data.shippingFirstName != null;

      },
      shippingAddressSummary: function(){
        // construct shippping address
        var data = this.$store.state.findMyOrderData;
        if(data == null) return "";
        var address = {
          firstname: data.shippingFirstName,
          lastname: data.shippingLastName,
          address1: data.shippingAddressLine1,
          address2: data.shippingAddressLine2,
          city: data.shippingAddressCity,
          zip : data.shippingAddressZip,
          stateCode: data.shippingAddressStateCode,
          countryCode: data.shippingAddressCountryCode,
          //  email: data.shippingAddressEmail,
          // phoneNumber: data.shippingAddressPhoneNumber
        };
        return this.$store.getters.getAddressSummary(address);
      }



    },
    methods:{
      findmyorderlogin(){
        this.$router.push({ name: 'findmyorder', params: {} })

      },
      getFormattedDate(str){
        // Apply each element to the Date function
        //console.log(t);
        var d = new Date(str);
        return d.toLocaleString("en-GB");

      },
      getFormattedAnswer : function(str)
      {
        return str.replace("{{supportemail}}", "<i>"+ this.supportEmail +"</i>");
      },

      getMapThumbnailURLForMapID(mapID){
        return this.$store.getters.getMapThumbnailURLForMapID(mapID);
      },

      getItemPrice: function(mapData){
        var currencyName = this.getCurrencyName;
        return mapData["orderedPrice"] * mapData.quantity;
      },
      getPrintsizeLabel: function(mapData){

        console.log("mapData", mapData);
        return  this.$store.getters.labelForPrintSizeID(mapData.printSizeID, mapData.metricUnits);
      },
      getOrientationLabel : function(mapData)
      {
        var orientationID = mapData.orientationID;
        return this.$store.getters.labelForOrientationID(orientationID);
      },
      getProductLabel: function(mapData)
      {
        return this.getPrintsizeLabel(mapData) + " - " + this.getOrientationLabel(mapData);
      },
      convertToPrice: function (number){
        try {
          return ((Math.round(number) - number) === 0) ? number : number.toFixed(2);
        }
        catch(e)
        {
          return number;
        }
      }
    },
    watch:{
    },
    mounted(){
      console.log("mounted route_orderReferenceID", this.route_orderReferenceID );
      if(this.route_orderReferenceID != null){
        // todo load the data
        this.$store.state.findMyOrderDataLoading = true;
        this.$store.dispatch("retrieveOrder", { orderReferenceID: this.route_orderReferenceID} ).then((orderData)=>{
          console.log("retrieveOrder response", orderData );
          this.$store.state.findMyOrderData = orderData;
          this.$store.state.findMyOrderDataLoading = false;

        }).catch((e)=>{
          this.$store.state.findMyOrderData = null;
          this.$store.state.findMyOrderDataLoading = false;


        });
      }
    }
  }


  var statusLabelMap = {
    0 : "Your order is currently being processed",
    1 : "Your order is currently being processed",
    2 : "Your order is currently being processed",
    3 : "Order sent for printing",
    4 : "Order sent for delivery",
  }

  var orderStatusEnums = {
    ORDER_STATUS_ID_pending_processing: 0,
    ORDER_STATUS_ID_order_pending_check: 1,
    ORDER_STATUS_ID_order_checked: 2,
    ORDER_STATUS_ID_order_sent_to_fulfilment_company: 3,
    ORDER_STATUS_ID_sent_for_delivery: 4,
    ORDER_STATUS_ID_delivery_error: 10,
  }
</script>

<style scoped>
.maskedLine{
    height: 15px;
    background-color: #DDDDDD;
    border-radius: 10px;
    margin-bottom: 10px;
    margin-top: 10px;

}
</style>
