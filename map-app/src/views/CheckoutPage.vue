<template>
  <main  >


    <section class="site-section">

      <content class="work-section-container">


        <v-container style="max-width: none" >


          <v-layout row wrap fill-height >



            <v-flex xs12 style="margin-bottom: 20px" >

              <v-chip
                      v-if="isLivePaymentMode== false"
                      class="ma-2"
                      color="yellow"
                      text-color="black"
                      x-large
              >
                Stripe Test Mode - payments not live
              </v-chip>


              <v-layout row wrap>
                <h2 class=" display-1 font-weight-light " style="padding-top: 0px; margin: 0px" >
                  <v-icon size="32" color="black" style="margin-bottom: 5px">mdi-lock</v-icon> Secure Checkout
                </h2>
                <v-spacer></v-spacer>

                <v-flex shrink  style="margin-left: 0px;  margin-top:5px">
                  <v-layout row align-center>
                    <img src="/static/assets/cards/Dark Color/1.png" height="30px" style="margin: 0px 2px 0px" >
                    <img src="/static/assets/cards/Dark Color/2.png"  height="30px" style="margin: 0px 2px 0px" >
                    <img src="/static/assets/cards/Dark Color/22.png"  height="30px" style="margin: 0px 2px 0px" >
                    <img src="/static/assets/cards/Dark Color/14.png" height="30px" style="margin: 0px 2px 0px" >
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex :class="column1Classes" style="padding-bottom: 20px">
              <v-stepper v-model="stepperSectionID" vertical style="background: #FFFFFF" >
                <v-stepper-step edit-icon="mdi-check"   :complete="stepperSectionID > 1" step="1" :editable="stepperSectionID > 1" >

                  <div class="title font-weight-medium" >
                    Shipping Details
                  </div>
                  <template v-if="stepperSectionID > 1">
                    <p style="color:#999999; margin-top: 10px">
                    <pre>{{shippingAddressSummary}}</pre>
                    </p>

                  </template>
                </v-stepper-step>

                <v-stepper-content step="1">
                  <AddressForm showContactSection sectionID="shipping
                  address" delivery ref="shippingAddress" addressModuleName="shippingAddress" v-on:change="onShippingAddressChange"></AddressForm>
                  <v-alert
                          v-if="nItemsInCart == 0"
                          :value="true"
                          color="info"
                          icon="mdi-alert-circle"
                          outline
                  >
                    Add an item to the cart to continue
                  </v-alert>

                  <v-layout v-else="" style="">
                    <v-spacer></v-spacer>
                    <v-btn   dark color="hero"  class="title font-weight-regular" style="text-transform: none; margin-right: 0"  large @click="onShippingDetailsNextClicked()" :loading="shippingRatesLoading">Continue to delivery</v-btn>
                  </v-layout>
                </v-stepper-content>

                <v-stepper-step edit-icon="mdi-check" :complete="stepperSectionID > 2" step="2" :editable="stepperSectionID > 2">
                  <div class="title font-weight-medium">
                    Delivery
                  </div>
                  <template v-if="stepperSectionID > 2">
                    <p style="color:#999999; margin-top: 10px">
                    <pre>{{shippingRateDescription}}</pre>
                    </p>
                  </template>
                </v-stepper-step>

                <v-stepper-content step="2">
                  <v-alert
                          :value="true"
                          color="info"
                          icon="mdi-alert-circle"
                          outline
                  >
                    COVID-19 Update:<br> Please note that delivery may take a few extra days as carriers adjust to reduced staffing.
                  </v-alert>

                  <v-layout justify-space-between column class="innerpadding font-weight-bold">
                    <v-radio-group class="" v-model="$store.state.checkout.shippingRateID">
                      <v-radio
                              v-for="(item, index) in  $store.state.checkout.shippingRates"
                              :key="item.id"
                              :label="`${getShippingRateDescriptionForObj(item)}:  ${getShippingRateWithCurrency(item)} (est. ${getEstimatedDeliveryDates(item)})`"
                              :value="item.shippingRateID"

                              v-show="shippingRates.length > 0"
                      ></v-radio>
                    </v-radio-group>




                  </v-layout>

                  <v-layout>
                    <v-spacer></v-spacer>
                    <v-btn color="hero" dark style="text-transform: none" class="title font-weight-regular"  large :load="shippingSectionButtonLoading" @click="onShippingSectionNextClick">Continue To billing</v-btn>
                  </v-layout>
                </v-stepper-content>

                <v-stepper-step edit-icon="mdi-check" :complete="stepperSectionID > 3" step="3" :editable="stepperSectionID > 3">
                  <div class="title font-weight-medium">
                    Payment
                  </div>
                </v-stepper-step>

                <v-stepper-content step="3">

                  <template v-if="isFreeOrder">
                    <div class="subheading"> Lucky you! This is a free order, so no billing is required. </div>

                    <v-layout>
                      <v-spacer></v-spacer>
                      <v-btn  class="title font-weight-normal" dark  color="hero" :loading="payButtonLoading" large @click="submitFreeOrder()" style="height: 50px;margin-top: 20px; text-transform: none; margin-right: 0">Submit order</v-btn>
                    </v-layout>

                  </template>
                  <template v-if="!isFreeOrder">

                    <template v-if="paymentServiceLoading">
                      <div class="text-center" style="width: 100%">
                        <v-progress-circular
                                indeterminate
                                color="primary"
                                style="margin: 1rem;"
                        ></v-progress-circular>
                      </div>
                    </template>
                    <template>

                      <template v-if="useBrainTree">
                        <!-- use paypal and credit card -->
                        <PaymentOption
                                heading="Credit card"
                                subheading=""
                                @selected="onCreditCardOptionSelected"
                                :value="creditCardOptionSelected"
                        >
                          <template slot="icon">

                            <v-flex shrink  style="margin-left: 0px;  margin-top:0px">
                              <v-layout row align-center style="margin-bottom: 10px; margin-top: 10px">
                                <img src="/static/assets/cards/Dark Color/1.png" height="20px" style="margin: 0px 2px 0px" >
                                <img src="/static/assets/cards/Dark Color/2.png"  height="20px" style="margin: 0px 2px 0px" >
                                <img src="/static/assets/cards/Dark Color/22.png"  height="20px" style="margin: 0px 2px 0px" >
                                <img src="/static/assets/cards/Dark Color/14.png" height="20px" style="margin: 0px 2px 0px" >
                              </v-layout>
                            </v-flex>
                            <!--
                            <v-flex shrink  >
                             <v-icon size="40" style="margin-right: 8px">mdi-credit-card </v-icon>
                            </v-flex>
                            -->
                          </template>


                          <!-- -->
                          <form id="credit-card-form" class="scale-down">

                            <div class="cardinfo-card-number">
                              <label class="cardinfo-label" for="card-number">Card Number</label>
                              <div class='input-wrapper' id="card-number"></div>
                              <div :class=cardImageClasses id="card-image"></div>
                            </div>

                            <div class="cardinfo-wrapper">
                              <div class="cardinfo-exp-date">
                                <label class="cardinfo-label" for="expiration-date">Expiration Date</label>
                                <div class='input-wrapper' id="expiration-date"></div>
                              </div>

                              <div class="cardinfo-cvv">
                                <label class="cardinfo-label" for="cvv">CVV</label>
                                <div class='input-wrapper' id="cvv"></div>
                              </div>
                            </div>

                            <div style="margin-top: 20px"> <v-icon> mdi-lock</v-icon> All transactions are secure and encrypted.</div>

                          </form>

                          <v-checkbox style="margin-top: 10px"
                                      color="blue"
                                      label="Billing address is same as shipping"
                                      v-model="billingAddressSameAsShipping"
                          ></v-checkbox>
                          <template v-if="!billingAddressSameAsShipping">
                            <h3 style="margin-bottom: 20px">Billing Address</h3>
                            <AddressForm  billling sectionID="billingaddress" ref="billingAddress" addressModuleName="billingAddress"></AddressForm>
                          </template>

                          <v-layout>
                            <v-spacer></v-spacer>
                            <v-btn  class="title font-weight-normal" dark  color="hero" :loading="payButtonLoading" large @click="submitOrderUsingCard()" style="height: 50px;margin-top: 20px; text-transform: none; margin-right: 0">Submit order</v-btn>
                          </v-layout>

                          <v-alert
                                  v-show="errorMessage"
                                  :value="true"
                                  color="error"
                                  icon="mdi-alert-circle"
                                  outline
                          >
                            {{errorMessage}}
                          </v-alert>

                        </PaymentOption >
                        <PaymentOption
                                heading="PayPal"
                                subheading=""
                                @selected="onPayPalOptionSelected"
                                :value="payPalOptionSelected"
                        >
                          <template slot="icon">
                            <v-flex  shrink>
                              <!-- paypal icon-->
                              <div style="padding-top: 10px">
                                <div aria-hidden="true" class="" style="width: 60px !important; height: 60px !important;; "><svg viewBox="0 0 48 48"><title>Paypal</title><desc>Paypal Logo</desc><path fill="#199DDA" d="M29.8 30.7h-2.5c-.1 0-.3.1-.4.3l-1 6.6c0 .1.1.2.2.2h1.3c.1 0 .2-.1.2-.2l.3-1.9c0-.1.1-.3.4-.3h.8c1.7 0 2.7-.8 2.9-2.5.2-1-.5-2-1.6-2.2h-.6m.3 2.5c-.1.9-.8.9-1.5.9h-.4l.3-1.7c0-.1.1-.1.2-.1h.1c.4 0 .9 0 1.1.3.2 0 .2.2.2.6"></path><g fill="#263B80"><path d="M11.5 30.7H9c-.1 0-.3.1-.4.3l-1 6.6c0 .1.1.2.2.2H9c.1 0 .3-.1.4-.3l.3-1.8c0-.1.1-.3.4-.3h.8c1.7 0 2.7-.8 2.9-2.5.2-1-.5-2-1.6-2.2h-.7m.3 2.5c-.1.9-.8.9-1.5.9H10l.3-1.7c0-.1.1-.1.2-.1h.1c.4 0 .9 0 1.1.3.1 0 .2.2.1.6M19.2 33.1H18c-.1 0-.2.1-.2.1l-.1.4-.1-.1c-.3-.4-.8-.5-1.4-.5-1.3 0-2.5 1-2.8 2.5-.1.7.1 1.4.4 1.9.4.4.9.6 1.6.6 1.1 0 1.7-.7 1.7-.7l-.1.4c0 .1.1.2.2.2h1.1c.1 0 .3-.1.4-.3l.7-4.2c0-.2-.1-.3-.2-.3m-1.7 2.4c-.1.7-.7 1.2-1.4 1.2-.4 0-.7-.1-.8-.3-.1-.2-.2-.5-.2-.9.1-.7.7-1.2 1.3-1.2.4 0 .6.1.8.3.2.2.3.6.3.9"></path></g><path fill="#199DDA" d="M37.4 33.1h-1.2c-.1 0-.2.1-.2.1l-.1.4-.1-.1c-.3-.4-.8-.5-1.4-.5-1.3 0-2.5 1-2.8 2.5-.1.7.1 1.4.4 1.9.4.4.9.6 1.6.6 1.1 0 1.7-.7 1.7-.7l-.1.4c0 .1.1.2.2.2h1.1c.1 0 .3-.1.4-.3l.7-4.2c0-.2-.1-.3-.2-.3m-1.7 2.4c-.1.7-.7 1.2-1.4 1.2-.4 0-.7-.1-.8-.3-.1-.2-.2-.5-.2-.9.1-.7.7-1.2 1.3-1.2.4 0 .6.1.8.3.3.2.3.6.3.9"></path><path fill="#263B80" d="M25.7 33.1h-1.3c-.1 0-.2.1-.3.1l-1.6 2.5-.7-2.4c-.1-.1-.1-.2-.4-.2h-1.2c-.1 0-.2.1-.2.3l1 3c.2.6.1 1.2-.3 1.7l-.7 1c-.1.1 0 .4.1.4h1.2c.1 0 .2-.1.3-.1l4.1-5.9c.3-.2.1-.4 0-.4"></path><path fill="#199DDA" d="M38.8 30.9l-1 6.7c0 .1.1.2.2.2h1c.1 0 .3-.1.4-.3l1-6.6c0-.1-.1-.2-.2-.2H39c-.1 0-.1.1-.2.2"></path><path fill="#053385" d="M30.9 7.8c-.9-1.1-2.6-1.6-5-1.6h-6.6c-.4 0-.8.4-.9.8l-2.6 17.3c0 .4.3.7.5.7h4.1l1.1-6.5v.3c.1-.4.5-.8.9-.8h2c3.8 0 6.7-1.6 7.6-5.9v-.4c-.1 0-.1 0 0 0 .1-1.8-.1-2.8-1.1-3.9"></path><path fill="#199DDA" d="M31.9 11.7v.4c-1 4.4-3.9 5.9-7.7 5.9h-2c-.4 0-.8.4-.9.8l-1.3 8c0 .3.1.5.5.5h3.4c.4 0 .8-.3.8-.7v-.1l.7-4.1v-.3c0-.4.4-.7.8-.7h.5c3.3 0 5.9-1.3 6.6-5.3.3-1.6.1-3-.7-4-.1 0-.4-.3-.7-.4"></path><path fill="#232C65" d="M30.9 11.3c-.1 0-.3-.1-.4-.1-.1 0-.3 0-.4-.1-.5-.1-1.1-.1-1.7-.1h-5.1c-.1 0-.3 0-.4.1-.3.1-.4.4-.4.7l-1.1 6.8v.3c.1-.4.5-.8.9-.8h2c3.8 0 6.7-1.6 7.6-5.9 0-.1 0-.3.1-.4-.3-.1-.4-.3-.7-.3-.2-.2-.2-.2-.4-.2"></path></svg></div>
                              </div>
                            </v-flex>
                          </template>

                          <div class="body-1" style="margin-top: 25px"> Click the button to sign into your PayPal account and pay securely.</div>


                          <div style="margin-top: 20px; margin-left: 0px" id="paypalButton"></div>

                        </PaymentOption>
                      </template>
                      <template v-else="">
                        <v-checkbox style="margin-top: 10px"
                                    color="blue"
                                    label="Billing address is same as shipping"
                                    v-model="billingAddressSameAsShipping"
                        ></v-checkbox>
                        <template v-if="!billingAddressSameAsShipping">
                          <h3 style="margin-bottom: 20px">Billing Address</h3>
                          <AddressForm  billling sectionID="billingaddress" ref="billingAddress" addressModuleName="billingAddress"></AddressForm>
                        </template>


                        <v-layout justify-space-between row class="innerpadding">
                          <h3 style="margin-bottom: 10px">Payment</h3>
                          <v-spacer></v-spacer>
                          <img src="/static/assets/cards/Dark Color/1.png" height="20" style="margin: 0px 2px" >
                          <img src="/static/assets/cards/Dark Color/2.png"  height="20" style="margin: 0px 2px" >
                          <img src="/static/assets/cards/Dark Color/22.png"  height="20" style="margin: 0px 2px" >
                          <img src="/static/assets/cards/Dark Color/14.png"  height="20" style="margin: 0px 2px" >

                        </v-layout>

                        <v-card>
                          <v-card-text style="background:#eeeeee">
                            <!--
                            <v-text-field outline label="Card Number" append-icon="credit_card"></v-text-field>
                            <v-layout justify-space-between row class="innerpadding">
                              <v-spacer></v-spacer>
                              <v-text-field outline label="Expiration Date" append-icon="date_range"></v-text-field>
                              <div style="width: 60px;"></div>
                              <v-text-field  outline label="CSV" append-icon="lock" ></v-text-field>
                            </v-layout>
                            -->
                            <div ref="stripeDiv"></div>

                          </v-card-text>
                        </v-card>
                      </template>

                    </template>

                  </template>


                  <!-- accept terms and conditions -->
                  <!--
                  <v-checkbox style="margin-top: 30px"
                              color="blue"
                              v-model="agreeToTerms"
                              :error="termsError"

                  >
                    <template slot="append">
                      <div style="align-items: center">
                      <div style="font-family: inherit; margin-top: 5px; margin-left: -5px; top: 0px; height: auto">I agree to the <a href="/terms" target="_blank">Terms of service</a> and <a href="/privacy" target="_blank">Privacy Policy</a></div>
                      </div>
                    </template>
                  </v-checkbox>
                  -->
                  <!--
                  <v-layout>
                    <v-divider></v-divider>
                    <v-btn  class="title font-weight-normal" dark  color="hero" :loading="payButtonLoading" large @click="verifyBillingDetailsAndPay()" style="height: 50px;margin-top: 20px; text-transform: none; margin-right: 0">Submit order</v-btn>
                  </v-layout>-->
                  <!--
                  <v-flex class="xs12 justify-center align-content-center align-center">
                    <small  >By proceeding you are agreeing to the <a href="/terms" target="_blank">Terms of service</a> and <a href="/privacy" target="_blank">Privacy Policy</a></small>
                 </v-flex>
                 -->

                </v-stepper-content>


              </v-stepper>
            </v-flex>
            <!--
            <v-flex xs12 md5 :style="'padding-right:' + (($vuetify.breakpoint.smAndDown) ? 0: 20) + 'px'">
              <v-card>
                <v-card-title  style="background: #eeeeee">
                  <h3 >Shipping Address</h3>
                </v-card-title>
                <v-card-text>
                  <AddressForm showEmail sectionID="shipping
                  address" delivery ref="shippingAddress" addressModuleName="shippingAddress" v-on:change="onShippingAddressChange"></AddressForm>
                </v-card-text>
              </v-card>
              <v-checkbox style="margin-top: 20px"
                          color="blue"
                          label="Untick to add a different billing address"
                          v-model="billingAddressSameAsShipping"
              ></v-checkbox>

              <v-card style="margin-top: 0px" v-show="!billingAddressSameAsShipping">
                <v-card-title  style="background: #eeeeee">
                  <h3 >Billing Address</h3>
                </v-card-title>
                <v-card-text>

                  <AddressForm billling sectionID="billingaddress" ref="billingAddress" addressModuleName="billingAddress"></AddressForm>

                </v-card-text>
              </v-card>
            </v-flex>
            -->
            <v-flex :class="column2Classes" >


              <CheckoutOrder v-on:calcShippingButtonClicked="onCalcShippingButtonClicked()"></CheckoutOrder>





              <!--:disabled="!shippingRateSelected" -->
              <!--
              <v-btn class="title bigbutton"  style="height:60px; margin: 20px 0px" dark  large color="blue"  v-on:click="verifyCard()"> Review & Confirm</v-btn>
              -->

            </v-flex>
          </v-layout>

          <v-layout row wrap>
          </v-layout>


        </v-container>
      </content>
    </section>

    <SiteFooter></SiteFooter>
  </main>




</template>

<script>
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'
  import utilsMixin from "../mixins/utilsMixin";
  import commonGlobals from "../../../common/commonGlobals";

  import braintree from 'braintree-web';
  import paypal from 'paypal-checkout';

  let stripe = null;
  let elements = null;
  let card = null;


  // temp remove for testing

    //https://jsfiddle.net/ywain/02x8opLy/

  const SINGLE_COLUMN_BREAKPOINT_WIDTH = 900;

  export default {
    components: {
      CheckoutOrder: () => import('@/components/checkout/CheckoutOrder.vue'),
      AddressForm: () => import('@/components/checkout/AddressForm.vue'),
      PaymentOption: () => import('@/components/checkout/PaymentOption.vue')
    },
    mixins: [utilsMixin],
    data () {
      return {
        windowWidth: 0,
        paymentServiceLoading: true,
        paymentSubmitLoading :false,
        cardImageClasses: [],
        payPalOptionSelected :false,
        creditCardOptionSelected :false,
        useBrainTree: true,
        termsError: false,
        agreeToTerms: true,
        shippingRatesLoading:false,
        stepperSectionID: 1,
        payButtonLoading: false,
        shippingSectionButtonLoading: false,
        errorMessage : ""
      }
    },
    props: {
    },
    methods:{
      onResize: function(){
        this.windowWidth = window.innerWidth;

      },
      onPayPalOptionSelected: function(){
        this.payPalOptionSelected  = true;
        this.creditCardOptionSelected  = false;
      },
      onCreditCardOptionSelected: function(){
        this.payPalOptionSelected  = false;
        this.creditCardOptionSelected  = true;
      },
      onShippingSectionNextClick: async function()
      {
        this.shippingSectionButtonLoading = true;
        await this.$store.dispatch("refreshTotalAmountBreakdown");
        this.shippingSectionButtonLoading = false;
        this.stepperSectionID = 3;
      },
      getEstimatedDeliveryDates: function(shippingRateObj)
      {
        return this.$store.getters.getEstimatedDeliveryDates(shippingRateObj);
      },
      getShippingRateWithCurrency: function(shippingRateObj)
      {
        let price = Number.parseFloat( this.$store.getters.getShippingRatePriceForObject(shippingRateObj));
        if(price == 0)
        {
          return "FREE SHIPPING";
        }
        return this.getCurrencySymbol + price.toFixed(2);
      },
      getShippingRateDescriptionForObj: function(shippingRateObj)
      {
        return  this.$store.getters.getShippingRateDescriptionForObj(shippingRateObj);

      },
      onShippingAddressChange: function()
      {
        // this will hide any shipping options, and show the cacluate shipping button
       // this.$store.commit('shippingAddressDirty');

      },
      onShippingDetailsNextClicked: function(){

        // do a check to see if the shipping address form is valid first
        // if not highlight any fields
        if(this.shippingAddressValid)
        {
          // do API call
          this.shippingRatesLoading = true;
          this.$store.dispatch("retrieveShippingRates").then(() => {
            this.shippingRatesLoading = false;
            // move to the next section
            this.stepperSectionID = 2;

          });

          /*
          console.log("retrieveShippingRates");
          */

        }
        else{
          // not valid, show
          this.$refs.shippingAddress.validateForm();
        }
      },
      checkAddresses: function(){

        // check adddress
        if(!this.$store.getters["shippingAddress/valid"])
        {
          this.errorMessage = "Shipping Address is invalid";
          this.$refs.shippingAddress.validateForm();
          return false;
        }

        if(!this.$store.getters.billingAddressSameAsShippingAddress) {
          // check billing
          if(!this.$store.getters["billingAddress/valid"])
          {
            this.errorMessage = "Billing Address is invalid";
            this.$refs.billingAddress.validateForm();
            return false;
          }
        }

        return true;
      },
      verifyBillingDetailsAndPay: function(){

        if(!this.checkAddresses())
        {
          return false;
        }
        /*
        if(!this.agreeToTerms)
        {
          this.errorMessage = "You must agree to the terms";
          this.termsError = true;
          return false;
        }*/

        //https://alligator.io/vuejs/stripe-elements-vue-integration/
        let _this = this;
        if(this.isFreeOrder)
        {
          // free order
          this.submitOrder(null, null);

        }
        else{
          //
          stripe.createToken(card).then((result) => {
            if (result.error) {
              _this.hasCardErrors = true;
              _this.$forceUpdate(); // Forcing the DOM to update so the Stripe Element can update.

              // disaplay the messsage
              var message = result.error.message;
              console.log('result.error', message);
              _this.errorMessage = message;

            } else {
              // success - Access the token with result.token
              // this token can be sent to the server when ready
              let token = result.token.id;
              console.log(token);
              this.submitOrder(token);
            }
          });
        }
      },
      validateShippingAddressSection: function(){
        if(this.shippingAddressValid){
          return true;
        }
        else{
          this.errorMessage = "Invalid Shipping Address";
          return false;
        }
      },
      submitFreeOrder: function(){
        this.submitOrder(null);
      },
      submitOrderUsingCard: function(){
        let valid = false;
        valid = this.validateShippingAddressSection();
        if(!valid) return;


        if(this.useBrainTree) {
          if (this.hostedFieldInstance) {

            let formIsInvalid = false;
            let paymentFieldState = this.hostedFieldInstance.getState();

            // Loop through the Hosted Fields and check
            // for validity, apply the is-invalid class
            // to the field container if invalid
            Object.keys(paymentFieldState.fields).forEach(function(field) {
              if (!paymentFieldState.fields[field].isValid) {
                console.log("invalid fields ", paymentFieldState.fields[field]);
                $(paymentFieldState.fields[field].container).addClass('braintree-hosted-fields-invalid');
                formIsInvalid = true;
              }
            });

            if(formIsInvalid){
              this.errorMessage = "Please check payment details."
              return;
            }

            this.error = "";
            this.nonce = "";
            this.hostedFieldInstance.tokenize().then(payload => {
              console.log(payload);
              let nonceToken = payload.nonce;
              this.submitOrder(nonceToken, commonGlobals.PAYMENT_TYPE_ID_CREDIT_CARD);

            })
                    .catch(err => {
                      console.error(err);
                      //        this.error = err.message;
                    })
          }
        }
        else{
          stripe.createToken(card).then((result) => {
            if (result.error) {
              _this.hasCardErrors = true;
              _this.$forceUpdate(); // Forcing the DOM to update so the Stripe Element can update.

              // disaplay the messsage
              var message = result.error.message;
              console.log('result.error', message);
              _this.errorMessage = message;

            } else {
              // success - Access the token with result.token
              // this token can be sent to the server when ready
              let token = result.token.id;
              console.log(token);
              this.submitOrder(token, commonGlobals.PAYMENT_TYPE_ID_CREDIT_CARD );
            }
          });
        }
      },
      submitOrder: function(token = null , paymentTypeID = null){


        this.errorMessage = "";
        this.payButtonLoading = true;
        var data = {
          paymentTypeID: paymentTypeID,
          token: token,
          deviceData: this.deviceData,
          paymentServiceTypeID: (this.useBrainTree) ? "braintree"  : "stripe"
        };
        this.$store.dispatch("submitOrder", data).then((orderResult)=> {
          //let orderID = orderResult.order.orderID;
          let orderReferenceID = orderResult.order.orderReferenceID;

          let error=  orderResult.error;
          console.log("orderResult: " , orderResult);
          //console.log("orderID: " , orderID);
          console.log("orderReferenceID: " , orderReferenceID);

          console.log("error: " , error);

          if(!error)
          {
            console.log("error: " , error);
            this.$store.dispatch("retrieveCartFromServer"); // update the cart, should return empty
            //this.$store.commit("setOrderID",orderID);
            // clear state
            this.$store.commit("setEditorModeToAddNew");
            this.$store.commit("resetBasemapValuesToDefault");
            //  clear the voucher data - this is now done in the order submit method
            this.$store.dispatch("removeVoucherFromCart");

            this.stepperSectionID = 1; // reset
            this.gotoConfirmationPage(orderReferenceID);
            return true;
          }
          else{
            // pop up error message ?
            return false;
          }
        }).catch((err)=>{
          //todo show error
          console.log("in catch - there was an error", err);
          this.payButtonLoading = false;
          this.errorMessage = "Oops there was an error";
        });
      },

      gotoConfirmationPage : function(orderReferenceID){
        this.$router.push({ name: 'order', params: {route_orderReferenceID:orderReferenceID} })

      },
      initPaymentService: function(){
        this.paymentServiceLoading = true;
        if(this.useBrainTree){
          this.initBraintree();
        }
        else{
          this.initStripe(this.$store.getters.stripePublishableKey);
        }
      },
      initBraintree: async function(){
        //var token = "sandbox_93smtrz3_bbgx4xf7h8bx24xg";
        console.log("token from server ", this.braintreeClientToken);
        if(this.braintreeClientToken == null){
          console.error("token is null, cannot init");
          return;
        }

        braintree.client.create({
          authorization: this.braintreeClientToken
        })
                .then(clientInstance => {
                  let options = {
                    client: clientInstance,
                    styles: {
                      'input': {
                        'color': '#282c37',
                        'font-size': '16px',
                        'transition': 'color 0.1s',
                        'line-height': '3'
                      },
                      // Style the text of an invalid input
                      'input.invalid': {
                        'color': '#E53A40'
                      },
                      // placeholder styles need to be individually adjusted
                      '::-webkit-input-placeholder': {
                        'color': 'rgba(0,0,0,0.6)'
                      },
                      ':-moz-placeholder': {
                        'color': 'rgba(0,0,0,0.6)'
                      },
                      '::-moz-placeholder': {
                        'color': 'rgba(0,0,0,0.6)'
                      },
                      ':-ms-input-placeholder': {
                        'color': 'rgba(0,0,0,0.6)'
                      }

                    },
                    // Add information for individual fields
                    fields: {
                      number: {
                        selector: '#card-number',
                        placeholder: '●●●● ●●●● ●●●● ●●●●'
                      },
                      cvv: {
                        selector: '#cvv',
                        placeholder: 'CVV'
                      },
                      expirationDate: {
                        selector: '#expiration-date',
                        placeholder: 'MM / YYYY'
                      }
                    }
                  };

                  let dataCollectorOptions = {
                    client: clientInstance,
                    kount: true
                  };

                  return Promise.all([
                    braintree.hostedFields.create(options),
                    braintree.paypalCheckout.create({ client: clientInstance }),
                    braintree.dataCollector.create(dataCollectorOptions)
                  ])
                })
                .then(instances => {
                  const hostedFieldInstance    = instances[0];
                  const paypalCheckoutInstance = instances[1];
                  const dataCollectorInstance = instances[2];

                  this.deviceData = dataCollectorInstance.deviceData;
                  console.log("deviceData", this.deviceData);

                  // Use hostedFieldInstance to send data to Braintree
                  this.hostedFieldInstance = hostedFieldInstance;

                  //https://developers.braintreepayments.com/guides/hosted-fields/events/javascript/v3
                  // Emitted when a field loses focus.
                  hostedFieldInstance.on('blur', (event)=>{
                    console.log("blur", event);
                    //if(event.emittedBy == "number"){
                      // card number field
                    // set the state to invalid
                    let key = event.emittedBy;
                    let field = event.fields[key];
                    let valid = field.isValid;
                    let empty = field.isEmpty;
                    if(!valid && !empty) {
                      field.container.classList.remove("braintree-hosted-fields-valid");
                      field.container.classList.add("braintree-hosted-fields-invalid");
                    }
                    else{
                      field.container.classList.remove("braintree-hosted-fields-invalid");
                      field.container.classList.add("braintree-hosted-fields-valid");
                    }

                    // check for the correct lengths
                    var formValid = Object.keys(event.fields).every(function (key) {
                      return event.fields[key].isValid;
                    });
                  });

                  hostedFieldInstance.on('focus', (event)=>{
                    this.errorMessage = "";
                  });

                  hostedFieldInstance.on('validityChange',  (event) => {
                    // Check if all fields are valid, then show submit button
                    var formValid = Object.keys(event.fields).every(function (key) {
                      return event.fields[key].isValid;
                    });

                    console.log("validityChange", event);
                    /*
                    if (formValid) {
                      $('#button-pay').addClass('show-button');
                    } else {
                      $('#button-pay').removeClass('show-button');
                    }*/
                  });

                  hostedFieldInstance.on('empty', (event)=> {
                    $('header').removeClass('header-slide');
                    //$('#card-image').removeClass();
                    this.cardImageClasses = [];
                   // $(form).removeClass();
                  });

                  hostedFieldInstance.on('cardTypeChange', (event) => {

                    console.log("cardTypeChange", event);
                    // Change card bg depending on card type
                    if (event.cards.length === 1) {
                     // $(form).removeClass().addClass(event.cards[0].type);
                       //$('#card-image').removeClass().addClass(event.cards[0].type);
                      this.cardImageClasses = [ event.cards[0].type];
                      //$('header').addClass('header-slide');

                      // Change the CVV length for AmericanExpress cards
                      if (event.cards[0].code.size === 4) {
                        hostedFieldInstance.setAttribute({
                          field: 'cvv',
                          attribute: 'placeholder',
                          value: '1234'
                        });
                      }
                    } else {
                      this.cardImageClasses = [ ];


                      hostedFieldInstance.setAttribute({
                        field: 'cvv',
                        attribute: 'placeholder',
                        value: '123'
                      });
                    }
                  });

                  this.paymentServiceLoading = false;
                  return paypal.Button.render({
                      env: 'sandbox',
                      style: {
                        //size: 'small',
                        color: 'gold',
                        shape: 'pill',
                        label: "pay",
                        tagline: true,
                        size: "responsive"
                      },
                      payment: () => {
                        //this.paymentSubmitLoading = true;

                        // params https://developer.paypal.com/docs/checkout/reference/customize-sdk/
                        return paypalCheckoutInstance.createPayment({
                          flow: 'checkout',
                          intent: 'sale',
                          amount: this.totalCost,
                          displayName: commonGlobals.COMPANY_NAME,
                          currency: this.braintreeCurrencyID,
                          enableShippingAddress: false,
                          shippingAddressEditable: false,
                        })
                      },
                      // uuser has successfully interacted with the popup
                      onAuthorize: (data, options) => {


                        return paypalCheckoutInstance.tokenizePayment(data).then(payload => {
                          console.log(payload);
                          // todo - submit order
                          let nonceToken = payload.nonce;
                          this.submitOrder(nonceToken, commonGlobals.PAYMENT_TYPE_ID_PAYPAL);
                          //
                          //this.error = "";
                          //this.nonce = payload.nonce;
                          //this.confirmPaymentState = true;
                        })
                      },
                      onCancel: (data) => {
                        console.log(data);
                        console.log("Payment Cancelled");
                        this.paymentSubmitLoading = false;
                      },
                      onError: (err) => {
                        this.paymentSubmitLoading = false;
                        console.error(err);
                        this.error = "An error occurred while processing the paypal payment.";
                      }
                    }, '#paypalButton')


                })
                .catch(err => {
                  console.error(err);
                  this.paymentServiceLoading = false;
                });
      },
      initStripe: async function(stripePublishableKey){
        // load sript
        await this.loadExternalScript('https://js.stripe.com/v3/');

        if(stripe == null)
        {
          // todo - change this to the value from the server
          stripe = Stripe( stripePublishableKey + '\n' );
          elements = stripe.elements();
          card = undefined;
        }

        // create card if stripe is available
        if((card == null) && (elements != null)) {
          card = elements.create('card', {
            hidePostalCode: false,
            style: {
              base: {
                // Add your base input styles here. For example:
                fontSize: '16px',
                color: "#32325d",
              }
            }

            /*
          style: {
            base: {
              iconColor: '#666EE8',
              color: '#31325F',
              lineHeight: '40px',
              fontWeight: 300,
              fontFamily: 'Helvetica Neue',
              fontSize: '15px',

              '::placeholder': {
                color: '#CFD7E0',
              },
            },
          }*/
          });


          let self = this;
          card.addEventListener('change', function(event) {
            var displayError = document.getElementById('card-errors');
            if (event.error) {
              self.errorMessage = event.error.message;
            } else {
              self.errorMessage = '';
            }
          });

        }

        this.mountStripeCardUI();
      },
      mountStripeCardUI: function(){
        console.log("mount stripe" , this.$refs.stripeDiv);
        if((card != null) && this.$refs.stripeDiv){
          card.mount(this.$refs.stripeDiv);
        }
      }
    },
    computed: {
      ...mapGetters([
              'braintreeClientToken',
          'isLivePaymentMode',
          'totalCost',
          'nItemsInCart','cart', 'shippingRates', 'shippingAddressSummary', 'shippingRateDescription', 'shippingRate', 'getCurrencyID', 'getCurrencySymbol' ,'getCurrencyName'
      ]),
      column1Classes: function(){
        let singleColumnWidth =   this.windowWidth < SINGLE_COLUMN_BREAKPOINT_WIDTH;
        return {
          "xs12": singleColumnWidth,
          "xs7": !singleColumnWidth
        }
      },
      column2Classes: function(){
        let singleColumnWidth =   this.windowWidth < SINGLE_COLUMN_BREAKPOINT_WIDTH;
        return {
          "column2Desktop": !singleColumnWidth,
          "xs12": singleColumnWidth,
          "xs5": !singleColumnWidth
        }
      },
      shippingAddressValid: function(){
        return this.$store.getters["shippingAddress/valid"];
      },
      isFreeOrder: function(){
        console.log("isFreeOrder this.totalCost",  this.totalCost);
        return this.totalCost == 0;
      },
      shippingRateSelected: function(){
        return this.$store.getters.shippingRateID != null;
      },
      billingAddressSameAsShipping:{
        get: function(){
          return this.$store.getters.billingAddressSameAsShippingAddress;
        },
        set: function(value){
          this.$store.commit('billingAddressSameAsShippingAddress', value);
        }
      },
      braintreeCurrencyID: function() {
        if(this.getCurrencyID == commonGlobals.CURRENCY_ID_EUR){
          return "EUR";
        }
        if(this.getCurrencyID == commonGlobals.CURRENCY_ID_GBP){
          return "GBP";
        }
        if(this.getCurrencyID == commonGlobals.CURRENCY_ID_USD){
          return "USD";
        }
        return null
      }
    },
    watch:{

      isFreeOrder: function(freeOrder)
      {

        console.log("isFreeOrder");
        let showCreditCardInput = !freeOrder;
        if(showCreditCardInput)
        {
          this.$nextTick(() => {

            this.mountStripeCardUI();
          });

        }
      },
      agreeToTerms: function(newVal)
      {
        if(newVal)
        {
            this.termsError = false;
        }
      }

    },

    created()
    {
    },
    mounted()
    {
      window.addEventListener("resize", this.onResize);
      this.onResize();

      //this.initBraintree();
      // redirect to home if theres no items in the cart
      /*
      let emptyCart = this.nItemsInCart == 0;
      if(emptyCart)
      {
        this.$router.push({name:'home',params:{}});
      }*/


      // todo - change this to the get checkoutdata which includes countries
      if(!this.$store.getters.checkoutDataLoaded) {
        this.$store.dispatch('retrieveCheckoutDataFromServer').then(() => {
          this.initPaymentService();
        });
      }else{
        this.initPaymentService();
      }
    }
  }



</script>

<style>



  .v-stepper--vertical .v-stepper__step {
    padding: 20px 20px 20px 20px!important;
  }

  .v-stepper--vertical .v-stepper__content {
    margin: 0px 0px 0px 0px !important;
    padding: 0px 20px 0px 20px!important;
    border: none !important;
  }

  .v-stepper{
    border-radius: 8px ;
  }

  @media only screen and (max-width: 600px) {
    .v-stepper--vertical .v-stepper__step {
      padding: 20px 0px 20px 0px!important;
    }

    .v-stepper--vertical .v-stepper__content {
      margin: 0px 0px 0px 0px !important;
      padding: 0px 00px 0px 00px!important;
    }
    .v-stepper{
      box-shadow: none;
      border-bottom: #c6c6c6 1px solid;
      border-radius: 0px !important;
    }
  }


  </style>

<style scoped>

  .column2Desktop{
    padding-left: 20px;
  }


  @media only screen and (max-width: 500px) {
    .container {
      padding: 3px !important;
      padding-top: 30px !important;
    }


    .site-section-content {
      padding: 0px !important;
    }

  }



  .v-card{
    border-radius: 8px !important;
  }

/*
  * {
    font-family: "Helvetica Neue", Helvetica;
    font-size: 15px;
    font-variant: normal;
  }
*/
/*
  .group {
    background: white;
    box-shadow: 0 7px 14px 0 rgba(49, 49, 93, 0.10), 0 3px 6px 0 rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    margin-bottom: 20px;
  }

  label {
    position: relative;
    color: #8898AA;
    font-weight: 300;
    height: 40px;
    line-height: 40px;
    margin-left: 20px;
    display: flex;
    flex-direction: row;
  }

  .group label:not(:last-child) {
    border-bottom: 1px solid #F0F5FA;
  }

  label > span {
    width: 120px;
    text-align: right;
    margin-right: 30px;
  }
  */

  .field {
    background: transparent;
    font-weight: 300;
    border: 0;
    color: #31325F;
    outline: none;
    flex: 1;
    padding-right: 10px;
    padding-left: 10px;
    cursor: text;
  }

  .field::-webkit-input-placeholder {
    color: #CFD7E0;
  }

  .field::-moz-placeholder {
    color: #CFD7E0;
  }
  <!--
  button {
    float: left;
    display: block;
    background: #666EE8;
    color: white;
    box-shadow: 0 7px 14px 0 rgba(49, 49, 93, 0.10), 0 3px 6px 0 rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    border: 0;
    margin-top: 20px;
    font-size: 15px;
    font-weight: 400;
    width: 100%;
    height: 40px;
    line-height: 38px;
    outline: none;
  }

  button:focus {
    background: #555ABF;
  }

  button:active {
    background: #43458B;
  }
  -->

  .outcome {
    float: left;
    width: 100%;
    padding-top: 8px;
    min-height: 24px;
    text-align: center;
  }

  .success,
  .error {
    display: none;
    font-size: 13px;
  }

  .success.visible,
  .error.visible {
    display: inline;
  }

  .error {
    color: #E4584C;
  }

  .success {
    color: #666EE8;
  }

  .success .token {
    font-weight: 500;
    font-size: 13px;
  }

.bigbutton{
  text-transform: none;
}




  header {
    z-index: 2;
    transform: translate(0, 5.5em);
    transition: all .5s ease;
    &.header-slide {
      transform: translate(0, 0);
    }
  }

  h1 {
    font-weight: 100;
    font-size: 1.4em;
    display: block;
  }

  .form-container {
    display: flex;
    background-color: #EEE;
    justify-content: center;
    align-items: center;
    height: 100%;
    flex-direction: column;
    border: 1em solid #fff;
    box-sizing: border-box;
    position: relative;

    @media (max-width: 476px) {
      border: none;
    }
  }

  .cardinfo-wrapper {
    display: flex;
    justify-content: space-around;
  }

  .bg-illustration {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 0;
    svg {
      width: 100%;
    }
  }

  .card-shape {
    border-radius: 6px;
    padding: 2em 2em 1em;

    @media (max-width: 476px) {
      padding: 2em 1.5em 1em;
    }
  }

  #credit-card-form {
    background-color: #f1f1f1;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    padding: 2em 3em 2em;
    margin-bottom: 2em;
    margin-top: 20px;
    transition: all 600ms cubic-bezier(.20, 1.3, .7, 1);
    animation: cardIntro 500ms cubic-bezier(.20, 1.3, .7, 1);
    z-index: 1;

    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.06);
    }
  }

  @media (max-width: 476px) {
    #credit-card-form {
      box-sizing: border-box;
      padding: 1.5em 1em 1em;
      width: 100%;
    }
  }

  .cardinfo-label {
    display: block;
    font-size: 14px;
    margin-bottom: 0.5em;
    text-transform: none;
  }

  .cardinfo-exp-date {
    margin-right: 1em;
    width: 100%;
  }

  .cardinfo-cvv {
    width: 100%;
  }

  #button-pay {
    cursor: pointer;
    width: 16em;
    font-size: 15px;
    border: 0;
    padding: 1.2em 1em;
    color: #fff;
    background: #282c37;
    border-radius: 4px;
    z-index: 0;
    transform: translateY(-100px);
    transition: all 500ms cubic-bezier(.20, 1.3, .7, 1);
    opacity: 0;
    -webkit-appearance: none;

    &:hover {
      background: #282c37;
    }
    &:active {
      animation: cardIntro 200ms cubic-bezier(.20, 1.3, .7, 1);
    }
    &.show-button {
      transform: translateY(0);
      opacity: 1;
    }
  }
/*
  // Card type image styles*/
  .cardinfo-card-number {
    position: relative;
  }

  #card-image {
    position: absolute;
    top: 37px;
    right: 1em;
    width: 44px;
    height: 28px;
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/346994/card_sprite.png);
    background-size: 86px 458px;
    border-radius: 5px;
    background-position: -100px 0;
    background-repeat: no-repeat;
    margin-bottom: 1em;

  }

   .visa {
    background-position: 0 -398px !important;
  }
  #card-image.master-card {
    background-position: 0 -281px !important;;
  }
  #card-image.american-express {
    background-position: 0 -370px !important;;
  }
  #card-image.discover {
    background-position: 0 -163px !important;;
  }
  #card-image.maestro {
    background-position: 0 -251px !important;;
  }
  #card-image.jcb {
    background-position: 0 -221px !important;;
  }
  #card-image.diners-club {
    background-position: 0 -133px !important;;
  }

  /*--------------------
  Inputs
  --------------------*/
/*
  // Styling for input wrappers, internal font styles are handled in javascript*/
  .input-wrapper {
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.86);
    height: 50px;
    border: 1px solid #ccc;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.16);
    padding: 0px 10px;
    margin-bottom: 1em;
  }

  .cardinfo-card-number,
  .cardinfo-exp-date,
  .cardinfo-cvv {
    transition: transform 0.3s;
  }
/*
  // Change styles of the input wrappers using Braintree's provided classes.
  // Styles the wrapper of the focused input*/
  .braintree-hosted-fields-focused {
    border-color: #4d7bff;
  }

  /* Styles the wrapper of the invalid input*/
  .braintree-hosted-fields-invalid {
    border-color: red;
    animation: shake 500ms cubic-bezier(.20, 1.3, .7, 1) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }


  /*--------------------
  Animations
  --------------------*/

  @keyframes cardIntro {
    0% {
      transform: scale(0.8) translate(0, 0);
      opacity: 0;
    }
    100% {
      transform: scale(1) translate(0, 0);
      opacity: 1;
    }
  }

  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }
    20%,
    80% {
      transform: translate3d(1px, 0, 0);
    }
    30%,
    50%,
    70% {
      transform: translate3d(-3px, 0, 0);
    }
    40%,
    60% {
      transform: translate3d(3px, 0, 0);
    }
  }

  /*
  */
/*

  .container {
    display:flex;
    flex-wrap:wrap;
    flex-direction:row;
    justify-content:flex-start;
    align-items:stretch;
  }

  .left {order:1; background:inherit; flex-basis:100%; }
  .right {order:2; background:inherit;flex-basis:100%; }

  @media screen and (min-width:600px) {
    .container {
      flex-wrap:nowrap;
    }

    .left {
      flex-basis:1;
      order:1;
      padding: 10px;
    }
    .right {
      flex-basis:1;
      order:3;
      padding: 10px;
    }
  }
  */

</style>
