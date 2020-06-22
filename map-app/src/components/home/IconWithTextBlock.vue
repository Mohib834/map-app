<template>
    <v-layout  column  align-center justify-center style="margin-top: 25px; margin-bottom: 25px">
        <v-flex shrink>
            <v-icon color="primary" size="60">{{icon}}</v-icon>
        </v-flex>
        <v-flex style="margin-top: 20px">
            <div class="title" > {{text}} </div>
        </v-flex>
        <v-flex style="margin-top: 15px" >
            <div class="subheading">{{subtext}}</div>
        </v-flex>
    </v-layout>
</template>

<script>
  export default {
    name: "HomeImageTitle",
    props: {
      text:{
        type:String
      },
      subtext:{
        type:String
      },
      icon: {
        type:String
      }
    },
    computed:{

    },
    mounted: function () {
    }
  }
</script>


<style scoped>
    .title {
    }

</style>