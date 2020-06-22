<template>
    <div>


      <div class="work-section-container "  >
        <HeroTextSection>
          <template slot="title">
            Our Story.
          </template>
          <template slot="subtitle">
            The pursuit of perfecting modern, personalised wall art.
          </template>
        </HeroTextSection>

        <h2 class="about-subheading" >Maps are powerful storytellers.</h2>
        <div class="about-body  body-2">
          From where we’ve been to how we got there.  Where we dream to go and what we hope to do.  Maps can capture our imagination, spark our nostalgia, and guide us along the journey of life.
        </div>
        <h2 class="about-subheading" >Maps are beautiful.</h2>
        <div class="about-body  body-2">
          From structured lines to stunning typography, maps are one of the original forms of artistic expression – designed to inform and inspire.  Adorning our walls, our books, and our pathways for millennia, maps are a beautiful representation of the world we live in – from our immediate neighborhood to the entire globe.
        </div>
        <h2 class="about-subheading" >        At {{companyName}}, we believe in the power and beauty of maps.</h2>
        <div class="about-body  body-2">
          As travelers in this world, we are passionate about exploration and expression.  We believe that maps do more than inform our navigation – they inspire wonder, adventure, and whimsical nostalgia.  They capture moments in time as well as locations on the globe, and at {{companyName}}, we create stunning, original, and customizable art based on the maps in your life.
          <br><br>
          Founded in 2020, {{companyName}} transforms the locations and maps of your life into memorable, magnificent, and unique artwork to hang in your home.  From timeless, classic topography to sleek, modern cartography - {{companyName}} creates superb artwork for your home based on the times, spaces, and places that hold special meaning in your life.  With a wide variety of styles, colours, sizes, and shapes, we embrace a collaborative process designed to create a meaningful and heirloom worthy piece of art based on the locations and places that have touched your life.
          <br><br>
          From modern, urban décor to sophisticated, chic office design - {{companyName}} creates high-quality, archival worthy, and impressive pieces of map-inspired art for any occasion or space.  Powerful gifts, thoughtful mementos, or personal treasures designed to honor moments in time or places on the planet, {{companyName}} creates beautiful maps that inspire, thrill, and delight.
          <br><br>
          At {{companyName}}, we believe the story of your life is told through words, shared experiences, and places – and commemorating your journey through a customized piece of map wall art is a beautiful way to celebrate that adventure.
          Contact our team today to see how easy, fun, and affordable creating your own custom map wall art can be.
        </div>

      </div>
      <div class="work-section-container "  >
      </div>
      <SiteFooter></SiteFooter>
    </div>
</template>

<script>
  import commonGlobals from "../../../common/commonGlobals";

  export default {
    props: {
    },
    computed: {
      companyName(){
        return  commonGlobals.COMPANY_NAME;
      }
    },
    data () {
      return {
      }
    },
    methods:{
    },
    watch:{
    }
  }
</script>

<style scoped>
  .about-subheading{
    color: #5C88B5;
    font-weight: 500 !important;
  }

  .about-body{
    color: gray;
    font-size: 18px !important;
    margin-bottom: 20px;
  }
</style>
