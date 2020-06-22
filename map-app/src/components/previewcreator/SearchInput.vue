
<template>
    <input ref="address-input" type="search" id="address-input" placeholder="Search a city or address..." size='14' v-model="searchString"  />
</template>

<script>
  import utilsMixin from "../../mixins/utilsMixin";
  import currentMapDataMixin from "../../mixins/currentMapDataMixin";

  export default {
    mixins:[utilsMixin, currentMapDataMixin],
    props: {
      cleared: {
        type:Boolean,
        default:false
      },
      hitsPerPage: {
        type:Number,
        default: 5,
      },
      value: {
        required: true,
        default: true,
      }
    },
    computed: {

      searchString: {
        get() {
          if(this.cleared) return null;
          console.log("searchString this.value", this.value);
          return this.value;
        },
        set(v) {
          this.$emit('input', v)
        }
      }
    },
    data () {
      return {
        initDone: false
      }
    },
    methods:{
      getInputElement : function(){
        return this.refs['address-input'];
      },
    },
    watch:{
    },
    mounted: async function(){
      await this.loadExternalScript('https://cdn.jsdelivr.net/npm/places.js@1.16.4');
      let inputElement = this.$refs['address-input'];
      if(inputElement) {
        var placesAutocomplete = places({
          container: inputElement  // document.querySelector('#address-input')
        }).configure({
          //  type: 'address',
          //type: 'city',
          language: 'en',
          hitsPerPage: this.hitsPerPage
        });

        // hide pin
        $("button.ap-icon-pin").css("display", "none");

        if(this.cleared)
        {

        }
        else if ((this.searchString != null) || (this.searchString != "")) {
          //hack to show to X icon on the input box
          this.$nextTick(() => {
            $("button.ap-icon-clear").css("display", "");

          });
        }

        // set focus
        inputElement.focus();

        placesAutocomplete.on('change', e => {
          var obj = e.suggestion;
          console.log('placesAutocomplete change', obj);
          var latlng = obj.latlng;
          this.lat = latlng.lat;
          this.lng = latlng.lng;

          this.searchString = obj.value; // searchString is the v-model so its set automatically
          this.text1 = obj.name;
          this.text2 = obj.country;
          this.text3 = "";
          this.searchCountry = obj.countryCode;
          let administrative = obj.hit.administrative;
          if(administrative != null && administrative.length > 0) {
            this.searchRegion = obj.hit.administrative[obj.hit.administrative.length - 1];
          }
          else{
            this.searchRegion = "";
          }
          // set this value later on
          //this.text3 = obj.latlng.lat + "°N / " + obj.latlng.lng + "°E";


          console.log("seach suggestion obj", obj);
          this.$emit("onLocationChanged");

          // capture search to google analytics
          this.$ga.event({
            eventCategory: 'editor',
            eventAction: 'search',
            eventLabel: 'search',
            eventValue: this.searchString
          })
        });
      }
    }
  }
</script>

<style scoped>


</style>
