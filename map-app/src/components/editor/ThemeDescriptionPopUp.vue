
<template>
    <v-card class="card">
        <ThemeDescriptionPopUpColourStrip :theme="theme"></ThemeDescriptionPopUpColourStrip>

        <v-card-text >

            <div style="font-size: 1.2em; font-weight: bold; margin-top: 0px">
                {{themeName}}
            </div>
            <div style="margin-top: 10px">
                {{themeDescription}}
            </div>
        </v-card-text>

    </v-card>
</template>

<script>
  import ThemeDescriptionPopUpColourStrip from './ThemeDescriptionPopUpColourStrip'

  export default {
    name: 'ThemeDescriptionPopUp',
    components:{
      ThemeDescriptionPopUpColourStrip
    },
    data(){
      return {
      }
    },
    props: {
      themeID:{
          type: [String],
          default: function () {
            return null; // set to true for debuggin
            //return false;
          }
      }
    },
    mounted(){
    },
    methods:{
      getThemeByID: function(themeID){
        return this.$store.getters.getThemeByID(themeID);
      },
    },
    computed: {
      theme(){
        if(this.themeID != null){
          return this.getThemeByID(this.themeID);
        }
        return null;
      },
      themeName(){
        if(this.themeID != null){
            let theme = this.getThemeByID(this.themeID);
            return (theme != null) ? theme.label : "";
        }
        return "";
      },
      themeDescription(){
        if(this.themeID != null){
          let theme = this.getThemeByID(this.themeID);
          return (theme != null) ? theme.description : "";
        }
        return "";
      }
    }
  }
</script>

<style scoped>
.card{
    border-radius: 2px;
    box-shadow: 7px 12px 5px  rgba(0,0,0,0.2);
}
</style>
