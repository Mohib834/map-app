<template>
    <div  class="themebutton" :class="classes"  :style="{width:size + 'px',height:size + 'px'}"  >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"  >

            <defs>
                <clipPath id="cut-off-bottom">
                    <circle cx="50" cy="50" r="50"  />


                </clipPath>
            </defs>
            <g clip-path="url(#cut-off-bottom)">
                <rect :style="previewColour0Style" width="126" x="-100" y="-50" height="200"/>
                <rect :style="previewColour1Style" width="26" x="25" y="-50" height="200"/>
                <rect :style="previewColour2Style" width="26" x="50" y="-50" height="200"/>
                <rect :style="previewColour3Style" width="126" x="75" y="-50" height="200"/>
            </g>

        </svg>

    </div>
</template>

<script>

    let _defaultFill = "fill:rgb(0,0,0)";

  export default {
    name:"ThemeIcon",
    props: {
      size:{
        type: Number,
        default: 30
      },
      selected: {
        type: Boolean,
        default: false
      },
      theme: {
        type: Object,
        default: function(){
          return {"themeID":"abyss","road":[1,24,42],"water":[222,206,183],
            "previewcolours": [{"colour":[255,0,0]},{"colour":[0,250,20]},{"colour":[10,0,250]},{"colour":[255,0,250]}],
            "segments":[{"colour":[233,221,195],"weight":13}]};
        }
      }
    },
    data () {
      return {
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
        return  (this.themeID) ? "theme-" +this.themeID.split(" ").join("-")  : "";
      },
      themeID: function(){
        return (this.theme) ? this.theme.themeID : null;
      },
      previewColour0Style: function(){
        if(this.theme == null) return _defaultFill;
       // console.log("this.theme.previewcolours[0].colour", this.theme.previewcolours[0].colour);
        return this.toHTMLColourFill( this.theme.previewcolours[0].colour);
      },
      previewColour1Style: function(){
        if(this.theme == null) return _defaultFill;
        return this.toHTMLColourFill(this.theme.previewcolours[1].colour);
      },
      previewColour2Style: function(){
        if(this.theme == null) return _defaultFill;

        return this.toHTMLColourFill(this.theme.previewcolours[2].colour);
      },
      previewColour3Style: function(){
        if(this.theme == null) return _defaultFill;

        return this.toHTMLColourFill(this.theme.previewcolours[3].colour);
      }

    },
    methods:{
      toHTMLColourFill(arrayCol){
        return 'fill:rgb('+arrayCol[0] + ',' + arrayCol[1] + ', ' + arrayCol[2] + ')'
      },
    },
    watch:{

    },

  }
</script>

<style scoped>

    .themebutton {
        transform: rotate(45deg);
        overflow: hidden;
        -webkit-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.5);
        -moz-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.5);
        box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.59);
        border-radius: 50px;
    }


    /*
        .theme-01-252_jazz {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(106%2c166%2c166)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(64%2c43%2c60)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(242%2c178%2c99)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(242%2c104%2c53)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-02-126_summer-rain {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(129%2c194%2c184)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(234%2c208%2c65)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(240%2c86%2c61)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(48%2c59%2c64)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-03-122_beach-time {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(164%2c210%2c170)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(255%2c77%2c68)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(252%2c198%2c82)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(251%2c233%2c181)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-04-91_vintage-caribbean {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(214%2c199%2c84)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(94%2c204%2c198)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(14%2c79%2c129)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(5%2c33%2c57)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-05-88_sea-sunset {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(99%2c157%2c195)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(234%2c46%2c73)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(255%2c192%2c0)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(66%2c88%2c137)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-06-83_zinnia {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(231%2c215%2c30)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(78%2c91%2c127)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(181%2c181%2c181)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(255%2c255%2c255)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-07-82_cool-greys {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(106%2c163%2c201)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(103%2c117%2c127)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(176%2c176%2c176)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(247%2c247%2c247)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-08-80_classic-duckegg {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(67%2c171%2c160)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(163%2c191%2c189)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(216%2c216%2c216)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(76%2c76%2c76)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-09-75_mint-rose {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(109%2c214%2c166)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(18%2c173%2c145)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(31%2c18%2c38)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(254%2c35%2c84)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-10-63_runner {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(219%2c212%2c191)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(23%2c219%2c192)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(78%2c92%2c167)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(207%2c2%2c95)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-11-63_classic-coffee {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(202%2c165%2c132)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(29%2c26%2c24)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(128%2c128%2c128)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(249%2c249%2c249)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-12-62_create {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(235%2c31%2c83)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(44%2c176%2c179)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(202%2c208%2c71)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(70%2c67%2c59)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-13-56_teatime {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(99%2c151%2c167)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(224%2c232%2c128)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(230%2c167%2c203)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(249%2c242%2c224)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-14-50_abyss {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(224%2c202%2c164)' width='135' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(80%2c173%2c152)' width='35' x='34' y='-50' height='200'/%3e %3crect style='fill:rgb(0%2c36%2c60)' width='135' x='68' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-15-47_lavender-forest {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(175%2c190%2c63)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(233%2c229%2c217)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(152%2c211%2c212)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(89%2c78%2c122)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-16-45_untitled-22 {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(84%2c90%2c96)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(166%2c148%2c159)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(171%2c217%2c232)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(241%2c242%2c242)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-17-44_untitled-34 {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(3%2c39%2c90)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(28%2c125%2c214)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(243%2c183%2c9)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(243%2c70%2c5)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-18-44_crayon {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(1%2c150%2c207)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(64%2c211%2c194)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(234%2c208%2c65)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(233%2c115%2c154)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-19-42_classic-bw {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(29%2c26%2c24)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(139%2c139%2c139)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(216%2c216%2c216)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(255%2c255%2c255)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-20-42_untitled-5 {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(255%2c199%2c76)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(187%2c171%2c141)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(131%2c133%2c131)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(99%2c99%2c99)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-21-39_silver-mist {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(160%2c179%2c193)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(113%2c171%2c173)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(79%2c117%2c128)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(48%2c59%2c64)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-22-39_visual-narrative {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(43%2c172%2c181)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(180%2c204%2c185)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(232%2c77%2c91)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(59%2c59%2c59)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-23-37_untitled-51 {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(255%2c246%2c229)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(244%2c226%2c194)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(100%2c128%2c165)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(194%2c215%2c243)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-24-37_pacific {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(209%2c218%2c241)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(17%2c152%2c200)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(23%2c95%2c136)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(8%2c63%2c106)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-25-37_untitled-15 {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(25%2c81%2c74)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(77%2c132%2c74)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(116%2c156%2c85)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(203%2c205%2c120)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-26-34_salmon-at-sea {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(33%2c133%2c197)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(91%2c182%2c235)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(62%2c69%2c76)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(255%2c127%2c102)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-27-31_untitled-116 {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(79%2c102%2c106)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(117%2c197%2c209)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(178%2c171%2c154)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(218%2c213%2c171)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-28-31_untitled-108 {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(244%2c230%2c169)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(202%2c215%2c200)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(255%2c188%2c180)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(166%2c198%2c205)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-29-30_untitled-13 {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(59%2c58%2c99)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(212%2c106%2c127)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(221%2c222%2c73)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(120%2c199%2c203)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
        .theme-30-29_untitled-79 {
            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' %3e %3cg%3e %3crect style='fill:rgb(176%2c202%2c223)' width='126' x='-100' y='-50' height='200'/%3e %3crect style='fill:rgb(57%2c110%2c153)' width='26' x='25' y='-50' height='200'/%3e %3crect style='fill:rgb(255%2c85%2c77)' width='26' x='50' y='-50' height='200'/%3e %3crect style='fill:rgb(232%2c212%2c194)' width='126' x='75' y='-50' height='200'/%3e %3c/g%3e %3c/svg%3e");
        }
    */

</style>
