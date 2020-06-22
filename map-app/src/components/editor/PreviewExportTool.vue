
<template>
    <DraggableContainer containerID="previewExport" title="Preview Export Tool" :initialXPos="310" :initialYPos="300" :width="400" v-model="show">
            <!--
        <v-btn @click="randomtest()">test</v-btn>-->

            <v-layout column align-left style="margin: 5px; margin-bottom: 0px; padding: 0; ">
                <v-btn @click="exportImage()">export preview image</v-btn>
                <v-btn @click="copyToClipboard()">Copy Text To Clipboard</v-btn>
                <v-textarea

                        ref="textarea"
                        style="font-family: monospace; font-size: 12px; width: 100%"
                        solo
                        label="JSON"
                        :value="jsonExportStr"
                        min-height="400"
                ></v-textarea>
            </v-layout>



    </DraggableContainer>
</template>

<script>
  import currentMapDataMixin from '../../mixins/currentMapDataMixin'
  import {bus} from "./../../main"
  import DraggableContainer from "./DraggableContainer";

  export default {
    name:"PreviewExportTool",
    mixins:[
      currentMapDataMixin
    ],
    components:{
      DraggableContainer,
    },
    data(){
      return {
        show: false,//
      }
    },
    props:{

    },
    computed: {
      jsonExportStr: function() {
          let map = this.$store.state.map;
          if(map != null ) {
            return JSON.stringify(map, null, 2);
          }
          return "";
        },
    },

    watch:{
    },
    methods : {
      copyToClipboard: function(){
        /* Get the text field */
        this.$refs.textarea.focus();

        /* Select the text field */
        //copyText.select();
        //copyText.setSelectionRange(0, 99999); /*For mobile devices*/
        /* Copy the text inside the text field */
        //document.execCommand("copy");
        document.execCommand('selectAll');
        document.execCommand('copy');
      },
      exportImage: function(){
         bus.$emit("exportLargeImagePreview");
      },
      apply: function(){
        // apply the colour
      //  bus.$emit("setThemeColour", this.blendCol);
      }
    },
    mounted(){
      //bus.$on("openColourEditor", this.openColourEditor);
    }
  }
</script>

<style scoped>
    textarea {
        min-height: 28px;
        width: 400px;
    }

    #textarea {
        -moz-appearance: textfield-multiline;
        -webkit-appearance: textarea;
        border: 1px solid gray;
        font: medium -moz-fixed;
        font: -webkit-small-control;
        height: 28px;
        overflow: auto;
        padding: 2px;
        resize: both;
        width: 400px;
    }

    input {
        margin-top: 5px;
        width: 400px;
    }

    #input {
        -moz-appearance: textfield;
        -webkit-appearance: textfield;
        background-color: white;
        background-color: -moz-field;
        border: 1px solid darkgray;
        box-shadow: 1px 1px 1px 0 lightgray inset;
        font: -moz-field;
        font: -webkit-small-control;
        margin-top: 5px;
        padding: 2px 3px;
        width: 398px;
    }



</style>
