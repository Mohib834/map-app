
<template>
    <!--
    <div class="flexcontainer" id="previewLoaderContainer">
    -->
        <keep-alive>
        <AsyncPreviewCreatorPage :routeProp_createNew="routeProp_createNew" :editRoute_mapID="editRoute_mapID"></AsyncPreviewCreatorPage>
        </keep-alive>
    <!--
    </div>
    -->
</template>

<script>
  import LoadingComponent from "../components/common/LoadingPage.vue";

  const AsyncComponent = () => ({
    // The component to load (should be a Promise)
    component: import('./PreviewCreatorPage.vue'),
    // A component to use while the async component is loading
    loading: LoadingComponent,
    // A component to use if the load fails
    error: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 300,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 30000
  })


  export default {
    components:{
      AsyncPreviewCreatorPage: AsyncComponent
    },
    props: {
      routeProp_createNew :{
        type: [String,Boolean],
        default: null
      },
      editRoute_mapID: {
        type: [String,Number],
        default: null
      },
    },
    computed: {

    },
    data () {
      return {
        loading: true,
      }
    },
    methods:{

    },
    watch:{
    },
    mounted: function(){

    },
    name: 'PreviewCreatorPageContainer'
  }
</script>

<style scoped>
    .flexcontainer{
        display: flex;
        flex-direction: column;
        height: 100%;
        flex: 1 1 auto;
    }

</style>
