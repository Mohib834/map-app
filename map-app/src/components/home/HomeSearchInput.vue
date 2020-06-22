
<template>
    <v-layout row class="outer-container" align-center >

        <v-flex class="inner-container">
            <SearchInput :hitsPerPage="5" cleared ref="searchInput" elementID="search-input-home" v-model="searchString" @onLocationChanged="go()" ></SearchInput>
        </v-flex>
        <div
                class=" search-button title font-weight-light"
                :style="{'padding-left': (isDesktop) ? '25px' : '0px', 'padding-right': (isDesktop) ? '35px' : '0px'}"
                color="hero" dark @click="go()" >
            {{(isDesktop) ? 'Create Your Map' : ''}}<v-icon class="search-icon" :right="isDesktop" size="32" >mdi-magnify</v-icon>
        </div>
    </v-layout>
</template>

<script>
  import SearchInput from './../previewcreator/SearchInput'

  export default {
    mixins:[],
    components:{
      SearchInput
    },
    props: {

    },
    computed: {
      isMobile : function(){
        return this.$mq == 'mobile';
      },
      isDesktop : function(){
        return false;
        //return !this.isMobile;
      },
      searchString: {
        get: function () {
          console.log("searchString " ,this.$store.state.previewMap_searchString);
          return this.$store.getters.previewMap_searchString;
        },
        set: function (newValue) {
          this.$store.commit('setPreviewMap_searchString', newValue)
        }
      },

    },
    data () {
      return {
      }
    },
    methods:{
      go: function(){
        let DELAY= 300; // little delay for the text to appear in the textfield before naviagting to the preview page
        setTimeout(()=>{
          this.$emit("go");
        }, DELAY);
      }
    },
    watch:{
    },
    mounted: async function(){

    },
    name: 'HomeSearchInput'
  }
</script>

<style>
    /*  hide the search pin icon */
    .ap-icon-pin{
        opacity: 0;
    }
</style>


<style scoped>

    .outer-container{
        text-align: left;
        z-index: 1;
        max-width: 470px;
        height:56px;
        margin-left: 1px;
        color: #222222;
        background-color: white;
        border-radius: 50px;
        box-shadow: 0px 1px 4px #00000066;
        border: 0px solid #7493c1;
    }

    .inner-container{
        z-index: 1;
        background-color: #ffffff !important;
        border-radius: 0px;
        margin-left: 20px
    }

    .search-button{
        background: #3d83ee;
        cursor: pointer;
        align-items: center;
        min-width: 0;
        height: 100%;
        margin: 0px;
        border-top-left-radius: 0px ;
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 50px
        !important; border-top-right-radius: 50px
    !important; text-transform: none;
        box-shadow: none !important;
        -webkit-box-shadow: none !important;
        /*   border-left: #DDDDDD 1px solid !important; */
    }

    .search-icon{
        color: #ffffff;
        height: 100%;
        margin-left: 15px;
        margin-right: 15px;
    }

    .roundleft{
        z-index: 1;
        width: 30px;
        background: white;
        height: 100%;
        border-top-left-radius: 30px;
        border-bottom-left-radius: 30px;
    }

    .algolia-places {
    }




    .ap-input {
        font-size: 1.4em;
        border: none;
        color: #000000 !important;
        height: 45px;
        padding-left: 0px;
        padding-right: 35px;
        border-radius: 0px !important;
        /*
         border-left-right-radius: 0px;
         border-bottom-right-radius: 0px;
         border-top-left-radius: 30px;
         border-bottom-left-radius: 30px;
         */
        background: white;
    }

    @media only screen and (max-width: 600px){
        .ap-input {
            font-size: 1.2em;
        }
    }

    .ap-input::placeholder {
        color:  #666666;
    }

    /*  hide pin icon*/

    /*   */



    .shake {
        animation: shakeAnimation 2s infinite cubic-bezier(.36,.07,.19,.97) both;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        perspective: 1000px;
    }

    @keyframes shakeAnimation {
        10%, 90% {
            transform: translate3d(-1px, 0, 0);
        }
        20%, 80% {
            transform: translate3d(2px, 0, 0);
        }
        30%, 50%, 70% {
            transform: translate3d(-4px, 0, 0);
        }
        40%, 60% {
            transform: translate3d(4px, 0, 0);
        }
    }


</style>
