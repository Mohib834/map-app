<template>


  <v-badge :value="false" right overlap  color="create" style="margin-right: 10px">
    <v-icon
      slot="badge"
      dark
      small

    >mdi-check</v-icon>


    <button class="processingbtn" v-if="hasActiveJob"  @click="openProcessingModal" style="margin-right: 10px">

      <template v-if="isActiveJobProcessing">
        <v-progress-circular
          :width="3"
          :size="20"
          :value="activeJobQueueProcessPercentage"
          color="white"
          indeterminate
        ></v-progress-circular>
      </template>
      <template v-if="isActiveJobQueued">
        <v-progress-circular
          :width="3"
          :size="20"
          color="white"
          indeterminate
        ></v-progress-circular>
      </template>
      <template v-if="isActiveJobComplete">
        <!--
        <v-icon >mdi-bell</v-icon>
        -->
      </template>




    </button>
  </v-badge>


</template>

<script>
  import commonGlobals from '../../../../common/commonGlobals'
  import {bus} from "./../../main"
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
    },
    computed: {
      ...mapGetters([
        'printSizeOptions',
        'orientationOptions',
        'activeJobEstimatedQueueDuration',
        'isActiveJobLoaded',
        'isActiveJobWaitingForResponse', 'isActiveJobProcessing', 'isActiveJobQueued', 'isActiveJobComplete', 'isActiveJobViewed', 'activeJobBasemapID', 'hasActiveJob',
        'activeJobQueueProcessPercentage', 'activeJobQueuePosition'
      ]),
      nItemsInCart()
      {
        return 1;
      }
    },
    methods:{
      openProcessingModal: function(){
        bus.$emit("showProcessingModal", {
          hideCloseButton:false
        });
      }
    },
    watch:{
    }
  }
</script>

<style scoped>
  .processingbtn{
    padding: 0px;
    background-color: inherit;
    color: white;
  }
</style>
