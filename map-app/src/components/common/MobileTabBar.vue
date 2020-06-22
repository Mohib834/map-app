<template>
    <div  id="mobile-tab-bar" class="mobile-tab-bar white lighten-2" v-if="isMobile">
        <v-layout row fill-height>
            <template v-for="(tabObject, index) in tabData">
                <v-btn :id="'tabButton' + index"  class="mobile-tab-bar-btn"  :ripple="false" color="white lighten-2" :class="{selected: tabIndex  == index + 1}" style="color: #444444; padding:0px;min-width: 70px;" light @click="tabSelected(index + 1)">
                    <v-layout column>
                    <v-icon>{{tabObject.icon}}</v-icon>
                    <div>{{tabObject.text}}</div>
                    </v-layout>
                </v-btn>
            </template>
            <v-spacer></v-spacer>
            <slot name="right"></slot>
        </v-layout>
    </div>
</template>

<script>

  export default {
    components: {

    },
    data () {
      return {
      }
    },
    props:{
      // v-model
      tabData:{
        default: function(){
          return [
            {
              text: "Tab1",
              icon: "mdi-earth"
            },
            {
              text: "Paper",
              icon: "mdi-crop"
            }
          ]
        }
      },
      value: {
        required: true,
      }
    },
    computed: {
      tabIndex: {
        get() {
          return this.value;
        },
        set(v) {
          this.$emit('input', v)
        }
      },
      isMobile : function(){
        return this.$mq == 'mobile';
      },
      isDesktop : function(){
        return !this.isMobile;
      },
    },
    methods:{
      tabSelected: function(tabIndex){
        // canToggle
        this.$emit("onTabClicked", tabIndex );

        console.log("tabIndex");
        if(this.tabIndex == tabIndex) {
         this.tabIndex = 0;
        }
        else {
          this.tabIndex = tabIndex;
        }

      },

    },
    watch:{
    }
  }
</script>

<style scoped>



    .mobile-tab-bar-btn{
        height: 100%;
        margin: 0px;
        text-transform: none;
        border-radius: 0px;
        box-shadow: none !important;

    }

    .mobile-tab-bar-btn.selected{
        background-color: grey !important;
        color: white !important;
    }

    .mobile-next-btn{
        height: 100%;
        width: 100px;
        margin: 0px;
        text-transform: none;
        border-radius: 0px;
    }

    .mobile-tab-bar{
        z-index: 2;
        height: 56px;
        display: flex;
        flex: 0 1 auto;
        width: 100%;
        justify-content: center;
        left: 0;
        box-shadow: 0 3px 15px 2px rgba(0,0,0,0.4);
    }

</style>
