<template>
    <div ref="themeContainer"  style="flex: 0 1 100%; height: 100%; margin: 3px;" class="shrink" :class="{growselected: selected}"  v-on:click="$emit('click', theme)">
      <!--
        <img  class="themebutton" :class="{themebuttonselected: selected}"  style="transform: rotate(0deg); height: 100%; cursor: pointer" :src="svgPath">
      -->
        <!--
         <ThemeIcon class="themeicon" :size="30" :selected="selected" :theme="theme" ></ThemeIcon>
         -->
        <ThemeIconDynamic class="themeicon" :size="30" :selected="selected" :theme="theme" ></ThemeIconDynamic>

    </div>
</template>

<script>
  import ThemeIcon from './ThemeIcon.vue'
  import ThemeIconDynamic from './ThemeIconDynamic.vue'

  export default {
      name:"ThemeView",
      components:{
        ThemeIcon,
        ThemeIconDynamic
      },
    props: {
      tooltips: {
        type: Boolean,
        default: false
      },
      visible : {
        type: Boolean,
        default: true
      },
      selected: {
        type: Boolean,
        default: false
      },
      theme: {
        type: Object,
        default: function(){
          return {"themeID":"abyss","road":[1,24,42],"water":[222,206,183],"segments":[{"colour":[233,221,195],"weight":13}]};
        }
      }
    },
    data () {
      return {
        tooltipsInitDone: false
      }
    },
    computed:{
      classes : function(){
        let list = {
          themebuttonselected: this.selected,
        };
        list[this.svgClass] = true;
       // console.log("svgClass", this.svgClass);
        return list;
      },
      svgClass: function(){
        return (this.themeID) ? "theme-" +this.themeID.split(" ").join("-") : "" ;
      },
      /*
      svgPath: function(){
        return "/static/assets/colourschemes/" + this.themeID + ".svg";
      },*/
      themeID: function(){
        return (this.theme) ? this.theme.themeID : null;
      },
      label: function(){
        return (this.theme) ? this.theme.label : "";
      },
    },
    methods:{
      getThemeContainer:function(){
        return this.$refs.themeContainer;
      },
      initTooltips: function(){
        if( !this.tooltipsInitDone) {
          this.tooltipsInitDone = true;
          let themeContainer = this.$refs.themeContainer;
          MarcTooltips.add(themeContainer, this.label, {position: 'right', align: 'center'});
        }
      }
    },
    watch:{
      selected: function (newVal,oldVal)
      {
        console.log("****** prop change selected");

      },
      theme: function (newVal,oldVal) {
        console.log("****** prop change ", newVal);
      },
      tooltips: function(newVal)
      {
        console.log("****** prop change tooltips", newVal);
        if(newVal ) {
            this.initTooltips();
        }
      }
    },
    mounted(){
      // console.log("ThemeView mounted, themeContainer:", themeContainer);
      // create a tooltip that appears on rollover
      if(this.tooltips) {
        this.initTooltips();
      }
    }
  }
</script>

<style scoped>

  .margin{
    cursor: pointer;
    padding: 0px;
  }
  .nohandcursor {
    cursor: default;
  }

  .grow { transition: all .15s ease-in-out; }
  .grow:hover { transform: scale(1.25); }

  .themeicon {

      cursor: pointer;

      transition: all .15s ease-in-out;
  }

  .themeicon:hover  {
    opacity: 1.0;
      transform: rotate(25deg) scale(1.25);
      box-shadow: 1px 2px 3px 0px rgba(0,0,0,0.6);

  }

  .themeicon:active {
  }

  .themebuttonselected{
      border: 2px solid #666666;
      box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.6);
  }
    .growselected{
        transform: scale(1.25);
        animation: pop 0.4s;

    }

  @keyframes pop {
      30% {transform: scale(1.5) ;}
      70% {transform: scale(1.25) ;}
  }

</style>
