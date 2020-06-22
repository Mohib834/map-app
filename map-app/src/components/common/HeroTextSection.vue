
<template>
    <v-layout  row class=" justify-left align-left align-content-left " style="margin-top: 50px; margin-bottom: 50px; width: 100%"   >
        <v-flex xs12 sm10 >
            <h2 class=" font-weight-bold display-2">
                <slot name="title">title</slot>
            </h2>
            <h2 class="font-weight-medium heading no-bottom-margin" style="color: gray;">
                <slot name="subtitle"></slot>
            </h2>
        </v-flex>
    </v-layout>
</template>

<script>
  export default {
    name: 'HeroTextSection',
    data() {
      return {
      }
    },
    methods: {},
    props: {
    },
    computed: {},
    mounted() {}
  }
</script>

<style scoped>

</style>
