/*
* generic error pop up message when something goes wrong
*/

<template>

  <v-dialog
    v-model="showing"
    width="400"
  >
    <v-card>
      <v-card-title
        class="headline"
        primary-title
      >
      </v-card-title>
      <div class="modal-icon-container">
        <v-icon size="100" color="red lighten-2">mdi-alert-circle-outline</v-icon>
      </div>

      <v-card-text text-xs-center style="font-size: 18px">
        {{message}}
      </v-card-text>


      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" depressed style=" margin: 0px ; text-transform: none" dark @click="close()">Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script>

  export default {
    data(){
      return {
      }
    },
    props:{
      message:{
        type:[String],
        default: "Error"
      },
      value: {
        type: [Boolean],
        default: true
      },
    },
    computed: {
      showing: {
        // getter
        get: function () {
          return this.value;
        },
        // setter
        set: function (newValue) {
          this.$emit('input', newValue)
        }
      }
    },
    watch:{

    },
    methods : {
      //gets called from the parent

      close : function (){
        this.showing = false;
        this.$router.back();
      }
    },
    mounted(){

    }
  }
</script>

<style scoped>

  .modal-icon-container{
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    color: lightseagreen;
  }


</style>
