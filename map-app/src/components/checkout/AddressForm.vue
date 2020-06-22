<template>
  <v-form >
    <v-layout row>

      <v-text-field

        ref="name"
        :errorMessages="errors_firstname"
        v-model.sync="firstname"
        label="First name"
        placeholder=""
        :autocomplete="firstnameID"
        @input="$v.firstname.$touch()"
        @blur="$v.firstname.$touch()"
        required
      ></v-text-field>
      <div style="width: 20px"></div>
      <v-text-field

        ref="lastname"
        :errorMessages="errors_lastname"
        v-model.sync="lastname"
        label="Last name"
        placeholder=""
        :autocomplete="lastnameID"
        @input="$v.lastname.$touch()"
        @blur="$v.lastname.$touch()"
        required
      ></v-text-field>

    </v-layout>


      <v-text-field

      ref="address1"
      :errorMessages="errors_address1"
      v-model.sync="address1"
      label="Street address"
      :autocomplete="address1ID"
      placeholder=""
      :counter="address1MaxLength"
      @input="$v.address1.$touch()"
      @blur="$v.address1.$touch()"
      required
    ></v-text-field>

    <v-text-field

      ref="address2"
      :errorMessages="errors_address2"
      v-model.sync="address2"
      label="Address Line 2 (optional)"
      :autocomplete="address2ID"
      placeholder=""
      :counter="address2MaxLength"
      @input="$v.address2.$touch()"
      @blur="$v.address2.$touch()"
    ></v-text-field>

    <v-text-field

      ref="city"
      :errorMessages="errors_city"
      v-model.sync="city"
      :autocomplete="cityID"
      label="Town / city"
      placeholder=""
      @input="$v.city.$touch()"
      @blur="$v.city.$touch()"
      required
    ></v-text-field>


    <!--  OFSCREEN textfield used for autofill only-->
    <v-text-field
            ref="country"
            v-model.sync="countryName"
            label="Country"
            :autocomplete="countryID"
            required
            placeholder=""
            style="height: 0px; transform: translateX(-10000px); margin: 0; padding: 0"

    ></v-text-field>


    <v-layout row style="margin: 0px; padding: 0px">

      <v-text-field

        ref="zip"
        :errorMessages="errors_zip"
        v-model.sync="zip"
        label="ZIP / Postal code"
        :autocomplete="zipID"
        required
        placeholder=""
        @input="$v.zip.$touch()"
        @blur="$v.zip.$touch()"
      ></v-text-field>
      <div style="width: 20px"></div>
      <v-autocomplete
        dense
        no-data-text="No Results"
        ref="sfsef"
        :items="countries"
        v-model.sync="countryCode"
        :errorMessages="errors_countryCode"
        label="Country"
        :search-input.sync="countryCodeInputTest"
        browser-autocomplete="none"
        placeholder=""
        required
        item-text="shippingCountryName"
        item-value="shippingCountryCode"
        @input="countryInput"
        @blur="$v.countryCode.$touch()"
      >
      </v-autocomplete>
    </v-layout>

    <!--  OFSCREEN textfield used for autofill only-->
    <v-text-field

      ref="stateName"
      v-model.sync="stateName"
      label="State Code"
      :autocomplete="stateID"
      placeholder=""
      style="height: 0px; transform: translateX(-10000px); margin: 0; padding: 0"
    ></v-text-field>

    <v-autocomplete
      v-if="states[countryCode] != null"
      style="margin-top: -10px !important;"

      dense
      no-data-text="No Results"
      ref="code"
      :items="states[countryCode]"
      v-model.sync="stateCode"
      :errorMessages="errors_stateCode"
      label="State"
      browser-autocomplete="none"
      placeholder="Select..."
      :required="states[countryCode] != null"
      item-text="name"
      item-value="code"
      @input="$v.stateCode.$touch()"
      @blur="$v.stateCode.$touch()"
    >
    </v-autocomplete>

    <template v-if="showContactSection">
      <!--
      <v-divider></v-divider>
-->
      <!--
      <h3 style="margin-bottom: 10px; margin-top: 20px">Shipping Contact Details</h3>
-->
      <v-text-field

      ref="email"
      :errorMessages="errors_email"
      v-model.sync="email"
      label="Email"
      autocomplete="email"
      required
      placeholder=""
      @input="$v.email.$touch()"
      @blur="$v.email.$touch()"
      persistent-hint

    ></v-text-field>


      <v-text-field

        ref="phoneNumber"
        :errorMessages="errors_phone"
        v-model.sync="phoneNumber"
        label="Mobile Phone (for delivery)"
        autocomplete="tel"
        placeholder=""
        @input="$v.phoneNumber.$touch()"
        @blur="$v.phoneNumber.$touch()"
        persistent-hint

      ></v-text-field>

    </template>
      <!--
      <v-text-field
        v-else=""
        outline
        ref="state"
        v-model.sync="stateCode"
        :errorMessages="errors_stateCode"
        label="State/Province/Region *"
        autocomplete="shipping address-level1"
        required
        placeholder=""
      ></v-text-field>
  -->
  </v-form>
</template>

<script>
  import {bus} from "../../main"
  import { validationMixin } from 'vuelidate'
  import { required, maxLength, email } from 'vuelidate/lib/validators'



  const alwaysOK = { OK: () => true }
  const validateZipCode1 = (value, vm) => {
      console.log("here");
      return vm.validateZipCode();
    };
  export default {
    mixins: [validationMixin],
    validations() {
      return {
        firstname: {required, maxLength: maxLength(this.firstnameMaxLength)},
        lastname: {required, maxLength: maxLength(this.lastnameMaxLength)},
        address1: {required, maxLength: maxLength(this.address1MaxLength)},
        address2: {maxLength: maxLength(this.address2MaxLength)},
        countryCode: {required},
        zip: {required , validateZipCode1, maxLength: maxLength(this.zipMaxLength)},
        city: {required, maxLength: maxLength(this.cityMaxLength)},
        stateCode: (this.states[this.countryCode] != null) ? {required} : alwaysOK,
        email: {required, email, maxLength: maxLength(this.emailMaxLength)},
        phoneNumber: {required, maxLength: maxLength(this.phoneMaxLength)}
      }
    },
    data () {
      return {
        stateName: null,
        countryName: null,
        countryCodeInputTest: "",
        firstnameMaxLength : 40,
        lastnameMaxLength : 40,
        address1MaxLength : 45,
        address2MaxLength : 45,
        cityMaxLength: 50,
        zipMaxLength: 20,
        emailMaxLength: 100,
        phoneMaxLength: 30
      }
    },
    props: {
      showContactSection: {
        type: Boolean,
        default: false
      },
      sectionID : {
        type: String,
        default: "none"
      },
      addressModuleName: {
        type:String
      },
      billing : {
        type: Boolean,
        default: false
      },
      delivery : {
        type: Boolean,
        default: false
      }

    },
    computed: {
      appendID : function(){
        return "section-" + this.sectionID + " ";
      },
      autocompleteType:function() {
        if(this.delivery) return 'delivery';
        if(this.billing) return 'billing';
        return null;
      },
      firstnameID: function(){
        let map = {
          delivery : 'fname',
          billing : 'billing fname'
        };
        return this.appendID + map[this.autocompleteType];
      },
      lastnameID: function(){
        let map = {
          delivery : 'lname',
          billing : 'billing lname'
        };
        return this.appendID + map[this.autocompleteType];
      },
      address1ID: function(){
        let map = {
          delivery : 'shipping street-address',
          billing : 'billing street-address'
        };
        return this.appendID + map[this.autocompleteType];
      },
      address2ID: function(){
        let map = {
          delivery : 'shipping address-line2',
          billing : 'billing address-line2'
        };
        return this.appendID + map[this.autocompleteType];
      },
      cityID: function(){
        let map = {
          delivery : 'shipping address-level2',
          billing : 'billing address-level2'
        };
        return this.appendID + map[this.autocompleteType];
      },
      zipID: function(){
        let map = {
          delivery : 'shipping postal-code',
          billing : 'billing postal-code'
        };
        return this.appendID + map[this.autocompleteType];
      },
      countryID: function(){
        let map = {
          delivery : 'shipping country',
          billing : 'billing country'
        };
        return this.appendID + map[this.autocompleteType];
      },
      stateID: function(){
        let map = {
          delivery : 'shipping region',
          billing : 'billing region'
        };
        return this.appendID + map[this.autocompleteType];
      },


      valid: mapTwoWay( 'valid', 'valid'),
      lastname: mapTwoWay( 'lastname', 'lastname'),
      firstname: mapTwoWay( 'firstname', 'firstname'),
      address1: mapTwoWay( 'address1', 'address1'),
      address2: mapTwoWay( 'address2', 'address2'),
      city: mapTwoWay( 'city', 'city'),
      countryCode: mapTwoWay( 'countryCode', 'countryCode'),
      stateCode: mapTwoWay( 'stateCode', 'stateCode'),
      zip: mapTwoWay( 'zip', 'zip'),
      email: mapTwoWay( 'email', 'email'),
      phoneNumber: mapTwoWay( 'phoneNumber', 'phoneNumber'),

      states : function(){
        return this.$store.state.checkout.states;
      },
      countries : function(){
        return this.$store.state.checkout.countries;
      },
      errors_firstname: function(){
        const errors = [];
        if (!this.$v.firstname.$dirty) return errors;
        !this.$v.firstname.maxLength && errors.push('Name must be at most ' + this.firstnameMaxLength +' characters long');
        !this.$v.firstname.required && errors.push('Name is required.');
        return errors;
      },
      errors_lastname: function(){
        const errors = [];
        if (!this.$v.lastname.$dirty) return errors;
        !this.$v.lastname.maxLength && errors.push('Name must be at most ' +this.lastnameMaxLength + ' characters long');
        !this.$v.lastname.required && errors.push('Name is required.');
        return errors;
      },
      errors_address1: function(){
        const errors = [];
        if (!this.$v.address1.$dirty) return errors;
        !this.$v.address1.maxLength && errors.push('Address must be at most '+ this.address1MaxLength +' characters long');
        !this.$v.address1.required && errors.push('Field is required.');
        return errors;
      },
      errors_address2: function() {
        const errors = [];
        if (!this.$v.address2.$dirty) return errors;
        !this.$v.address2.maxLength && errors.push('Address must be at most '+ this.address2MaxLength +' characters long');
        return errors;
      },
      errors_city: function(){
        const errors = [];
        if (!this.$v.city.$dirty) return errors;
        !this.$v.city.maxLength && errors.push('Field must be at most '+ this.cityMaxLength +' characters long');
        !this.$v.city.required && errors.push('Field is required.');
        return errors;
      },
      errors_zip: function(){
        const errors = [];
        if (!this.$v.zip.$dirty) return errors;
        !this.$v.zip.required && errors.push('Field is required.');
        !this.$v.zip.maxLength && errors.push('Field must be at most '+ this.zipMaxLength +' characters long');
        !this.$v.zip.validateZipCode1 && errors.push('Invalid for selected country.');

        return errors;
      },
      errors_countryCode: function(){
        const errors = [];
        if (!this.$v.countryCode.$dirty) return errors;
        !this.$v.countryCode.required && errors.push('Field is required.');
        return errors;
      },
      errors_stateCode: function(){
        const errors = [];
        if (!this.$v.stateCode.$dirty) return errors;
        !this.$v.stateCode.required && errors.push('Field is required for this country.');
        return errors;
      },
      errors_email: function(){
        const errors = [];
        if (!this.$v.email.$dirty) return errors;
        !this.$v.email && errors.push('Must be valid e-mail');
        !this.$v.email.maxLength && errors.push('Field must be at most '+ this.emailMaxLength +' characters long');
        !this.$v.email.required && errors.push('E-mail is required');
        return errors;
      },
      errors_phone: function(){

        const errors = [];
        if (!this.$v.phoneNumber.$dirty) return errors;
        !this.$v.phoneNumber.maxLength && errors.push('Field must be at most '+ this.phoneMaxLength +' characters long');
        !this.$v.phoneNumber.required && errors.push('Field is required');
        return errors;


        /*
        const errors = [];
        if (!this.$v.phoneNumber.$dirty) return errors;
        !this.$v.phoneNumber.required && errors.push('Phone number is required');
        return errors;
        */
        //return [];
      }

    },
    methods:{
      countryInput()
      {
        this.$v.countryCode.$touch();
        console.log("countryInput");
      },

      validateForm()
      {
        this.$v.$touch();
      },
      validateZipCode()
      {
         return postcodeCheck(this.zip, this.countryCode);
      }
    },
    watch:{
      countryName: function(value)
      {
        //
        console.log("autofill country",value);
        let countries = this.countries;
        let n  = countries.length;
        for(var i =0;i < n;++i )
        {

          if(countries[i].shippingCountryName == value) {
            this.countryCode = countries[i].shippingCountryCode;
            return;
          }
        }
        for(var i =0;i < n;++i )
        {
          if(countries[i].shippingCountryCode == value) {
            this.countryCode = countries[i].shippingCountryCode;
            return;
          }
        }

        console.log("error country not found in current list", value);
      },

      stateName: function(value)
      {
        //
        console.log("autofill state",value, "this.countryCode", this.countryCode);

        let states = this.states[this.countryCode];
        if(states == null) return null;

        let n  = states.length;
        for(var i =0;i < n;++i )
        {
          if(states[i].name == value) {
            this.stateCode = states[i].code;
            return;
          }
        }
        for(var i =0;i < n;++i )
        {
          if(states[i].code == value) {
            this.stateCode = states[i].code;
            return;
          }
        }
        this.stateCode = null;

        console.log("error country not found in current list", value);
      },


      countryCodeInputTest : function(value)
      {
        console.log("countryCodeInputTest", value);
        this.$nextTick(() => {
         // this.countryCode = this.states[value];
          //this.$v.countryCode.$touch();


        });
      },
      '$v.$invalid' : function(value){
        this.valid = !value;
      },
      countryCode: function(value){

        let stateCodeRequired = this.states[value] != null;
        // reset the state cpde if the country code changes, this is to pick up form voaliation check
        if(stateCodeRequired)
        {
          this.stateCode = "";
        }

        this.$emit('change');
      },
      name: function(value) {
      },
      address1: function(value){
        this.$emit('change');
      },
      address2: function(value){
        this.$emit('change');
      },
      city: function(value){
        this.$emit('change');
      },
      zip: function(value){
        this.$emit('change');
      },
      countryCode: function(value){
        this.$emit('change');
      },
      stateCode: function(value){
        this.$emit('change');
      },

    },
    mounted(){

    }
  }

  function mapTwoWay ( getter, mutation) {
    return {
      get () {
        let namespace = this.addressModuleName;

        return this.$store.getters[ namespace ? `${namespace}/${getter}` : getter]
      },
      set (value) {
        let namespace = this.addressModuleName;
        this.$store.commit(namespace ? `${namespace}/${mutation}` : mutation, value)
      }
    }
  }

  function postcodeCheck(postcode, countryCode)
  {

    var postCodeRegExs = {
      "GB": "GIR[ ]?0AA|((AB|AL|B|BA|BB|BD|BH|BL|BN|BR|BS|BT|CA|CB|CF|CH|CM|CO|CR|CT|CV|CW|DA|DD|DE|DG|DH|DL|DN|DT|DY|E|EC|EH|EN|EX|FK|FY|G|GL|GY|GU|HA|HD|HG|HP|HR|HS|HU|HX|IG|IM|IP|IV|JE|KA|KT|KW|KY|L|LA|LD|LE|LL|LN|LS|LU|M|ME|MK|ML|N|NE|NG|NN|NP|NR|NW|OL|OX|PA|PE|PH|PL|PO|PR|RG|RH|RM|S|SA|SE|SG|SK|SL|SM|SN|SO|SP|SR|SS|ST|SW|SY|TA|TD|TF|TN|TQ|TR|TS|TW|UB|W|WA|WC|WD|WF|WN|WR|WS|WV|YO|ZE)(\\d[\\dA-Z]?[ ]?\\d[ABD-HJLN-UW-Z]{2}))|BFPO[ ]?\\d{1,4}",
      "JE": "JE\\d[\\dA-Z]?[ ]?\\d[ABD-HJLN-UW-Z]{2}",
      "GG": "GY\\d[\\dA-Z]?[ ]?\\d[ABD-HJLN-UW-Z]{2}",
      "IM": "IM\\d[\\dA-Z]?[ ]?\\d[ABD-HJLN-UW-Z]{2}",
      "US": "\\d{5}([ \\-]\\d{4})?",
      "CA": "[ABCEGHJKLMNPRSTVXY]\\d[ABCEGHJ-NPRSTV-Z][ ]?\\d[ABCEGHJ-NPRSTV-Z]\\d",
      "DE": "\\d{5}",
      "JP": /\d{3}-\d{4}/,
      "FR": "\\d{2}[ ]?\\d{3}",
      "AU": "\\d{4}",
      "IT": "\\d{5}",
      "CH": "\\d{4}",
      "AT": "\\d{4}",
      "ES": "\\d{5}",
      "NL": "\\d{4}[ ]?[A-Z]{2}",
      "BE": "\\d{4}",
      "DK": "\\d{4}",
      "SE": "\\d{3}[ ]?\\d{2}",
      "NO": "\\d{4}",
      "BR": "\\d{5}[\\-]?\\d{3}",
      "PT": "\\d{4}([\\-]\\d{3})?",
      "FI": "\\d{5}",
      "AX": "22\\d{3}",
      "KR": "\\d{3}[\\-]\\d{3}",
      "CN": "\\d{6}",
      "TW": "\\d{3}(\\d{2})?",
      "SG": "\\d{6}",
      "DZ": "\\d{5}",
      "AD": "AD\\d{3}",
      "AR": "([A-HJ-NP-Z])?\\d{4}([A-Z]{3})?",
      "AM": "(37)?\\d{4}",
      "AZ": "\\d{4}",
      "BH": "((1[0-2]|[2-9])\\d{2})?",
      "BD": "\\d{4}",
      "BB": "(BB\\d{5})?",
      "BY": "\\d{6}",
      "BM": "[A-Z]{2}[ ]?[A-Z0-9]{2}",
      "BA": "\\d{5}",
      "IO": "BBND 1ZZ",
      "BN": "[A-Z]{2}[ ]?\\d{4}",
      "BG": "\\d{4}",
      "KH": "\\d{5}",
      "CV": "\\d{4}",
      "CL": "\\d{7}",
      "CR": "\\d{4,5}|\\d{3}-\\d{4}",
      "HR": "\\d{5}",
      "CY": "\\d{4}",
      "CZ": "\\d{3}[ ]?\\d{2}",
      "DO": "\\d{5}",
      "EC": "([A-Z]\\d{4}[A-Z]|(?:[A-Z]{2})?\\d{6})?",
      "EG": "\\d{5}",
      "EE": "\\d{5}",
      "FO": "\\d{3}",
      "GE": "\\d{4}",
      "GR": "\\d{3}[ ]?\\d{2}",
      "GL": "39\\d{2}",
      "GT": "\\d{5}",
      "HT": "\\d{4}",
      "HN": "(?:\\d{5})?",
      "HU": "\\d{4}",
      "IS": "\\d{3}",
      "IN": "\\d{6}",
      "ID": "\\d{5}",
      "IL": "\\d{5}",
      "JO": "\\d{5}",
      "KZ": "\\d{6}",
      "KE": "\\d{5}",
      "KW": "\\d{5}",
      "LA": "\\d{5}",
      "LV": "\\d{4}",
      "LB": "(\\d{4}([ ]?\\d{4})?)?",
      "LI": "(948[5-9])|(949[0-7])",
      "LT": "\\d{5}",
      "LU": "\\d{4}",
      "MK": "\\d{4}",
      "MY": "\\d{5}",
      "MV": "\\d{5}",
      "MT": "[A-Z]{3}[ ]?\\d{2,4}",
      "MU": "(\\d{3}[A-Z]{2}\\d{3})?",
      "MX": "\\d{5}",
      "MD": "\\d{4}",
      "MC": "980\\d{2}",
      "MA": "\\d{5}",
      "NP": "\\d{5}",
      "NZ": "\\d{4}",
      "NI": "((\\d{4}-)?\\d{3}-\\d{3}(-\\d{1})?)?",
      "NG": "(\\d{6})?",
      "OM": "(PC )?\\d{3}",
      "PK": "\\d{5}",
      "PY": "\\d{4}",
      "PH": "\\d{4}",
      "PL": "\\d{2}-\\d{3}",
      "PR": "00[679]\\d{2}([ \\-]\\d{4})?",
      "RO": "\\d{6}",
      "RU": "\\d{6}",
      "SM": "4789\\d",
      "SA": "\\d{5}",
      "SN": "\\d{5}",
      "SK": "\\d{3}[ ]?\\d{2}",
      "SI": "\\d{4}",
      "ZA": "\\d{4}",
      "LK": "\\d{5}",
      "TJ": "\\d{6}",
      "TH": "\\d{5}",
      "TN": "\\d{4}",
      "TR": "\\d{5}",
      "TM": "\\d{6}",
      "UA": "\\d{5}",
      "UY": "\\d{5}",
      "UZ": "\\d{6}",
      "VA": "00120",
      "VE": "\\d{4}",
      "ZM": "\\d{5}",
      "AS": "96799",
      "CC": "6799",
      "CK": "\\d{4}",
      "RS": "\\d{6}",
      "ME": "8\\d{4}",
      "CS": "\\d{5}",
      "YU": "\\d{5}",
      "CX": "6798",
      "ET": "\\d{4}",
      "FK": "FIQQ 1ZZ",
      "NF": "2899",
      "FM": "(9694[1-4])([ \\-]\\d{4})?",
      "GF": "9[78]3\\d{2}",
      "GN": "\\d{3}",
      "GP": "9[78][01]\\d{2}",
      "GS": "SIQQ 1ZZ",
      "GU": "969[123]\\d([ \\-]\\d{4})?",
      "GW": "\\d{4}",
      "HM": "\\d{4}",
      "IQ": "\\d{5}",
      "KG": "\\d{6}",
      "LR": "\\d{4}",
      "LS": "\\d{3}",
      "MG": "\\d{3}",
      "MH": "969[67]\\d([ \\-]\\d{4})?",
      "MN": "\\d{6}",
      "MP": "9695[012]([ \\-]\\d{4})?",
      "MQ": "9[78]2\\d{2}",
      "NC": "988\\d{2}",
      "NE": "\\d{4}",
      "VI": "008(([0-4]\\d)|(5[01]))([ \\-]\\d{4})?",
      "PF": "987\\d{2}",
      "PG": "\\d{3}",
      "PM": "9[78]5\\d{2}",
      "PN": "PCRN 1ZZ",
      "PW": "96940",
      "RE": "9[78]4\\d{2}",
      "SH": "(ASCN|STHL) 1ZZ",
      "SJ": "\\d{4}",
      "SO": "\\d{5}",
      "SZ": "[HLMS]\\d{3}",
      "TC": "TKCA 1ZZ",
      "WF": "986\\d{2}",
      "XK": "\\d{5}",
      "YT": "976\\d{2}"
    };
    var regEx = postCodeRegExs[countryCode];
    if(regEx){
      var patt = new RegExp(regEx);
      var postcode = postcode.toUpperCase();
      var result = patt.test(postcode);

      console.log("regEx", regEx, postcode, result);
      return result;
    }
    return true;
  }

</script>



<style scoped>
  .v-input .v-label {

    color: #a4a4a4 !important;
  }




</style>

<style scoped>

  /deep/ .v-text-field .v-label--active {
    -webkit-transform: translateY(-26px) scale(0.90) !important;
    transform: translateY(-26px) scale(0.90) !important;;
    font-weight: bold;
    color: #7493c1;
  }


  /deep/ .v-text-field{
    margin-top: 10px !important;
  }

  /deep/ .v-messages__message {
    margin-bottom: 18px !important;
  }

  /deep/
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active  {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
  }
  </style>