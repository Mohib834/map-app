<template>
    <img aspect-ratio="1" class="image" :src="srcImage"   />
</template>

<script>
  export default {
    props: ['src'],
    data: () => ({ observer: null, intersected: false }),
    computed: {
      srcImage() {
        return this.intersected ? this.src : '';
      }
    },
    mounted() {
      this.observer = new IntersectionObserver(entries => {
        const image = entries[0];
        if (image.isIntersecting) {
          this.intersected = true;
        }
      });

      this.observer.observe(this.$el);
    },
  }
</script>


<style scoped>


    .image {
        opacity: 1;
        display: block;
        width: 100%;
        height: auto;
        transition: .5s ease;
    }


</style>