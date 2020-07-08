import 'babel-polyfill'
import Vue from 'vue'
import './plugins/axios'
import './plugins/vuetify'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
//import './registerServiceWorker'
import VueMq from 'vue-mq'
import VueAnalytics from 'vue-analytics'

import SiteFooter from './components/common/SiteFooter.vue'
import Navbar from './components/navbar/NavBar.vue'
import VImage from './components/common/VImage.vue'
import WaitOverlay from './components/common/WaitOverlay.vue'
import CurrencyWelcomeModal from './components/common/CurrencyWelcomeModal.vue'
import CookiePolicyPopUp from './components/common/CookiePolicyPopUp.vue'
import ShippingOfferMessage from './components/common/ShippingOfferMessage.vue'
import HeroTextSection from './components/common/HeroTextSection.vue'
import VueClazyLoad from 'vue-clazy-load';

import MockupWidget from './components/common/MockupWidget'

import { VLazyImagePlugin } from "v-lazy-image";

import AOS from "aos";
import "aos/dist/aos.css";

/// blob polyfill
if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: function (callback, type, quality) {
      var canvas = this;
      setTimeout(function() {

        var binStr = atob( canvas.toDataURL(type, quality).split(',')[1] ),
          len = binStr.length,
          arr = new Uint8Array(len);

        for (var i = 0; i < len; i++ ) {
          arr[i] = binStr.charCodeAt(i);
        }

        callback( new Blob( [arr], {type: type || 'image/png'} ) );

      });
    }
  });
}

Vue.component("SiteFooter", SiteFooter);
Vue.component("Navbar", Navbar);
Vue.component("HeroTextSection",HeroTextSection );
Vue.component("VImage", VImage);
Vue.component("WaitOverlay", WaitOverlay);
//Vue.component("CurrencyWelcomeModal", CurrencyWelcomeModal);
Vue.component("CookiePolicyPopUp", CookiePolicyPopUp);
Vue.component("ShippingOfferMessage", ShippingOfferMessage);
Vue.component("MockupWidget", MockupWidget);

// initialise the global bus for direct messaging between components
export const bus = new Vue();


Vue.use(VLazyImagePlugin);
Vue.use(VueClazyLoad);

Vue.config.productionTip = false

// https://alligator.io/vuejs/vue-media-queries/
Vue.use(VueMq, {
    breakpoints: {
        mobile: 600,
        desktop: Infinity,
    }
});

// Google Analytics
Vue.use(VueAnalytics, {
  id: 'UA-136763583-1',
  router: router,   // pass in router object for autotracking of pageviews
  checkDuplicatedScript: true,
  commands: {
    // test command
    trackBorder (border ) {
      this.$ga.event('editor', 'border', 'border', border)
    },
    trackStyle (styleID ) {
      this.$ga.event('editor', 'styleID', 'styleID', styleID)
    }
  }
})

new Vue({
  created() {
    console.log("main.js created, init AOS");
    AOS.init({ disable: "phone" });  }, // add this to initialize AOS
  router: router,
  store,
  render: h => h(App)
}).$mount('#app')
