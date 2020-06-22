<template>

  <button v-if="getCurrencyName != null"  :class="classes" class="cuurencybutton" >
      {{getCurrencyName + " " +getCurrencySymbol }}
      <!--
      <img :src="'/static/assets/flags/' + getCurrencyName + '.png'">
      -->
  </button>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'

  export default {
    components: {

    },
    data () {
      return {
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
      ...mapGetters([
        'getCurrencyName',
        'getCurrencySymbol',
        'subtotalPrice',
        'subtotalPriceWithCurrency'
      ]),
      classes(){
        return {
          dark : this.dark,
          light: this.light
        };
      }
    },
    methods:{
    },
    watch:{
    }
  }
</script>

<style scoped>
  button{
    font-weight: normal;
    font-size: 1em;
  }
  img{
    vertical-align: middle;
    position: relative;
    top: -1px;
  }

  .cuurencybutton{
    padding: 2px;
    background-color: inherit;
      border-radius: 20px;
  }

  .light{
      color: #666666;
      border: 1px solid #888888;
  }

  .dark{
      color: #eeeeee;
      border: 1px solid #aaaaaa;
  }

  .currencybutton{
      padding: 2px;
      background-color: inherit;
      border-radius: 20px;
  }

</style>
