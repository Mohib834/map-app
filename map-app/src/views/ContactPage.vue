<template>
  <div>
    <v-layout class="" column wrap justify-center align-center >
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-4" style="margin: 10px; border-top-left-radius: 40px; border-bottom-right-radius: 40px">
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12>
                <h2 class=" display-1 font-weight-light text-xs-center"  style="padding-top: 20px" >Contact</h2>
              </v-flex>
              <v-flex xs12>
                <p class=" body-1 text-xs-center"> Have a question that's not covered in our FAQ section? You can drop us an email. </p>
                <p class=" title text-xs-center title"> {{contactEmail}} </p>

              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <SiteFooter></SiteFooter>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    props: {
    },
    computed: {
      ...mapGetters([
        'contactEmail'
      ]),
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

  .backgroundimg {
    /* background: url(../../public/static/assets/home/header.jpg) no-repeat center center fixed; */
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;

    /* Center and scale the image nicely */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    /* Full height */
    height: 100%;
  }

  @media screen and (min-width:600px) {

  }
</style>
