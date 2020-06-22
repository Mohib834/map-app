<!--
Row of option buttons
-->
<template>
  <div >
    <template v-if="isThemesLoaded">

      <v-layout row fill-height  align-center>
      <v-btn v-if="showNavigation" class="nav-button-left" depressed dark color="primary" :dark="themePageIndex != 0" :disabled="themePageIndex == 0" @click="prevThemePage()" >
        <v-icon size="28" style="margin: 0px"> mdi-chevron-left </v-icon>
      </v-btn>
      <div class="themegridcontainer">
        <div :style="{width: buttonWidth}" class="text-xs-center themeholder" v-for="(v,index) in (nThemesPerPage)"
             :key="index"  >
          <!--v-show="getPagedThemeIndex(index) < nThemes" -->
          <ThemeView   v-show="getPagedThemeIndex(index) < nThemes" :tooltips="tooltips" :visible="getPagedThemeIndex(index) < nThemes" :selected="getPagedThemeID(index) == themeID" :theme="getTheme( getPagedThemeIndex(index) )" v-on:click="onClick($event)" v-on:mouseenter.native="$emit('onThemeMouseEnter', {event: $event, themeID: getPagedThemeID(index)}) "  v-on:mouseleave.native="$emit('onThemeMouseLeave', null)" ></ThemeView>
        </div>
      </div>

        <v-btn v-if="showNavigation" style="min-width:10px; width:10px; height: 70px; margin: 0px; padding: -2px; border-radius: 0px; border-bottom-left-radius: 5px; border-top-left-radius: 5px"  depressed dark class="pagebutton"  color="primary" :dark="themePageIndex != lastThemePageIndex" :disabled="themePageIndex == lastThemePageIndex" @click="nextThemePage()" > ❯ </v-btn>


      </v-layout>
      <!--
      <div class="navigationContainer" >

        <v-btn v-if="lastThemePageIndex > 1" depressed   class="pagebutton" color="grey darken-2" :dark="themePageIndex != 0"  :disabled="themePageIndex == 0" @click="themePageIndex = 0" > ❮❮ </v-btn>
        <v-btn depressed dark class="pagebutton" color="grey darken-2" :dark="themePageIndex != 0"   :disabled="themePageIndex == 0" @click="prevThemePage()" > ❮ </v-btn>
        <div class="pageIndicator"> {{(themePageIndex + 1)  + "/" + (lastThemePageIndex+1)  }} </div>
        <v-btn depressed dark class="pagebutton"  color="grey darken-2" :dark="themePageIndex != lastThemePageIndex" :disabled="themePageIndex == lastThemePageIndex" @click="nextThemePage()" > ❯ </v-btn>
        <v-btn v-if="lastThemePageIndex > 1" depressed dark class="pagebutton" color="grey darken-2 " :dark="themePageIndex != lastThemePageIndex" :disabled="themePageIndex == lastThemePageIndex" @click="themePageIndex = lastThemePageIndex" > ❯❯ </v-btn>
      </div>
      -->
    </template>
    <template v-else="">
      <div>
        <v-progress-linear :indeterminate="true" background-color="grey"
                           color="grey lighten-3"></v-progress-linear>
      </div>
    </template>
  </div>
</template>

<script>
  import ThemeView from './ThemeView.vue'
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'

  export default {
    components: {
      ThemeView
    },
    props: {
      tooltips: {
        type: Boolean,
        default: false
      },
      showNavigation: { //
        default: function () {
          return false;
        }
      },
      themeID: { //
        type: String,
        default: function () {
          return "";
        }
      },
      themePageRows: {
        type: Number,
        default: 5
      },
      themePageCols: {
        type: Number,
        default: 4
      }
    },
    data () {
      return {
        themePageIndex : 0
      }
    },
    methods:{

      // set the page id to show the selected theme, used when the page first loads
      setPageIndexToSelectedTheme: function()
      {
        console.log("this.themeID" , this.themeID);
        var theme = this.getThemeByID(this.themeID);
        console.log("setPageIndexToSelectedTheme", this.themeID);
        console.log("setPageIndexToSelectedTheme", theme);

       this.themePageIndex =  this.getPageIndexThatContainsTheme(theme.themeID);
      },
      getThemeByID: function(themeID)
      {
        return this.$store.getters.getThemeByID(themeID);
      },
      getThemeIndexForTheme: function(themeID){
        for(var i =0; i < this.themes.length;++i)
        {
          if(this.themes[i].themeID == themeID) return i;
        }
        return 0;
      },
      getPageIndexThatContainsTheme: function(themeID) // todo - change to theme id
      {
        var themeIndex = this.getThemeIndexForTheme(themeID);
        return Math.floor(themeIndex / this.nThemesPerPage);
      },
      onClick : function(selectedTheme)
      {
        console.log("onclick theme", selectedTheme);
        this.$emit('input', selectedTheme.themeID); // this will update the theme prop (v-model).
      },
      getPagedThemeIndex: function(ix)
      {
        return ix + this.themePageIndex*(this.nThemesPerPage);
      },
      getPagedThemeID: function(ix)
      {
        var themeIndex = this.getPagedThemeIndex(ix);
        if(themeIndex < this.themes.length) {
          //console.log("this.themes[themeIndex]", this.themes[themeIndex]);
          return this.themes[themeIndex].themeID;
        }
        return null;
      },
      nextThemePage: function()
      {
        //var nPages = nThemes/
        this.themePageIndex = (this.themePageIndex + 1);
        console.log("----themePageIndex", this.themePageIndex);

      },
      prevThemePage: function()
      {
        this.themePageIndex = (this.themePageIndex - 1);
      },
      changeTheme: function(themeIndex)
      {
        // todo emit
        //onThemeIndexChange(themeIndex);
        //previewMapRenderUpdate(this);
      },
      getTheme : function(i){
        if(i < this.nThemes) {
          return this.themes[i];
        }return null;
      }
    },
    watch:{
      themeID:function(newVal,old)
      {
        console.log("------ prop change themeID ", newVal);
        this.setPageIndexToSelectedTheme();
      }
    },
    computed: {
      ...mapGetters([
        'isThemesLoaded' , 'themes'
      ]),
      buttonWidth: function()
      {
          return  ((1.0/this.themePageCols)*100.0) + '%';
       },
      lastThemePageIndex : function()
      {
        return Math.ceil(this.nThemes/ this.nThemesPerPage ) -1;
      },
      nThemes : function()
      {
        return this.themes.length;
      },
      nThemePages : function()
      {
        return this.nThemes/16;
      },
      nThemesPerPage : function()
      {
        return this.themePageCols * this.themePageRows;
      }

    }
  }
</script>

<style scoped>


  .pagebutton{
    min-width: 0px;
    margin: 3px 3px;
  }

  .themegridcontainer{
    /*overflow: hidden;*/
    display: flex;
    flex-wrap: wrap;
    padding: 10px 0px 10px 0px;
    margin-bottom: 0px;
  }

  .themeholder{
    display: flex;
    padding: 5px;

  }

  .navigationContainer{
    display: flex;
    justify-content:  center;
  }

  .pageIndicator {
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    color: #999999;
    margin: 0px 5px;
  }
  .nav-button-left{
    min-width:10px;
    width:10px;
    height: 70px;
    margin: 0px;
    padding: -2px;
    border-radius: 0px;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
  }

  .navbutton {
    width: 40px;
    padding: 2px 5px;
    margin: 8px 2px;
    box-sizing: border-box;
    border: 1px solid #999999;
    align-content: center;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: #eeeeee;
    color: #999999;
    cursor: pointer;
    text-decoration: none;
    outline: none;

  }

  .navbutton:disabled{
    opacity: 0.5;
  }
  .navbutton:hover{
    background-color: #cccccc;

  }

  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
  }

</style>
