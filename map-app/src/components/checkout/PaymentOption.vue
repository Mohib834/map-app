<template>
    <div style="margin-bottom: 20px">
        <v-btn block :class="classes"  :outline="!value" :depressed="value"  :color="colour" @click="onClicked" style=" border-radius: 5px; text-transform: none; height: 100%; margin:0px">
           <v-layout wrap row align-center style="color: black" >
               <v-flex shrink>
                   <v-radio-group  class="" v-model="value">
                   <v-radio
                           readonly
                           color="black"
                           :value="true"
                   ></v-radio>
               </v-radio-group>
               </v-flex>
               <v-layout   column align-start >
                   <span class="subheading" style="font-weight: bold">{{heading}}</span>
                   <span class="body-1">{{subheading}}</span>
               </v-layout>
               <v-spacer></v-spacer>
               <slot name="icon"></slot>

           </v-layout>
        </v-btn>
        <v-expansion-panel-content
                :value="value"
        >
            <v-card style="margin: 0; padding: 0">
                <v-card-text style="margin: 0;padding: 0;padding-left: 5px; padding-right: 5px" class="white">
                    <slot></slot>
                </v-card-text>
            </v-card>
        </v-expansion-panel-content>
    </div>
</template>

<script>
  import {bus} from "./../../main"

  export default {
    components: {

    },
    data () {
      return {
      }
    },
    props: {
      value:{
        type: [Boolean],
        default: false
      },
      heading:{
        type: [String],
        default: "heading"
      },
      subheading:{
        type: [String],
        default: "subheading"
      },
      dark: {
        type: [Boolean],
        default: null
      }
    },
    computed: {
      colour: function(){
        if(this.value) return 'grey lighten-2';
        return 'grey '
      },
      classes(){
        console.log("classes ", this.dark);
        return {
          dark : this.dark,
        };
      }
    },
    methods:{
      onClicked: function(){
          if(!this.value) {
            this.$emit("selected");
          }
        }
    },
    watch:{
    }
  }
</script>

<style scoped>

    li { /* styles all li elements, hide bullet in expansion panel*/
        list-style-type: none;
    }

    .dark{
        background-color: inherit;
        color: white;
    }

</style>
