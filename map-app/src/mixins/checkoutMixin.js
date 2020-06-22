export default {
  methods:{

  },
  computed:{

    billingAddressSameAsShippingAddress:{
      get: function () {
        return this.$store.state.billingAddressSameAsShippingAddress;
      },
      set: function (value) {
        this.$store.state.billingAddressSameAsShippingAddress = value;
      }
    },
    //// SHIPPING ADDRESS ////

    shippingAddress_Address1: {
      get: function () {
        return this.$store.state.shippingAddress.address1;
      },
      set: function (value) {
        this.$store.state.shippingAddress.address1 = value;
      }
    },
    shippingAddress_Address2: {
      get: function () {
        return this.$store.state.shippingAddress.address2;
      },
      set: function (value) {
        this.$store.state.shippingAddress.address2 = value;
      }
    },
    shippingAddress_city: {
      get: function () {
        return this.$store.state.shippingAddress.city;
      },
      set: function (value) {
        this.$store.state.shippingAddress.city = value;
      }
    },
    shippingAddress_countryCode: {
      get: function () {
        return this.$store.state.shippingAddress.countryCode;
      },
      set: function (value) {
        this.$store.state.shippingAddress.countryCode = value;
      }
    },
    shippingAddress_stateCode: {
      get: function () {
        return this.$store.state.shippingAddress.stateCode;
      },
      set: function (value) {
        this.$store.state.shippingAddress.stateCode = value;
      }
    },
    shippingAddress_zip: {
      get: function () {
        return this.$store.state.shippingAddress.zip;
      },
      set: function (value) {
        this.$store.state.shippingAddress.zip = value;
      }
    },

    //// BILLING ADDRESS
    bllingAddress_Address1: {
      get: function () {
        return this.$store.state.billingAddress.address1;
      },
      set: function (value) {
        this.$store.state.billingAddress.address1 = value;
      }
    },
    billingAddress_Address2: {
      get: function () {
        return this.$store.state.billingAddress.address2;
      },
      set: function (value) {
        this.$store.state.billingAddress.address2 = value;
      }
    },
    billingAddress_city: {
      get: function () {
        return this.$store.state.billingAddress.city;
      },
      set: function (value) {
        this.$store.state.billingAddress.city = value;
      }
    },
    billingAddress_countryCode: {
      get: function () {
        return this.$store.state.billingAddress.countryCode;
      },
      set: function (value) {
        this.$store.state.billingAddress.countryCode = value;
      }
    },
    billingAddress_stateCode: {
      get: function () {
        return this.$store.state.billingAddress.stateCode;
      },
      set: function (value) {
        this.$store.state.billingAddress.stateCode = value;
      }
    },
    billingAddress_zip: {
      get: function () {
        return this.$store.state.billingAddress.zip;
      },
      set: function (value) {
        this.$store.state.billingAddress.zip = value;
      }
    }
  }


}
