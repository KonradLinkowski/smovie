<template>
  <div class="lightbox" v-show="isOpen">
    <div class="details">
      <p v-if="movie">{{ movie.title }}</p>
    </div>
  </div>
</template>

<script>
import eventHub from '../utils/eventhub'
export default {
  data() {
    return {
      isOpen: false,
      movie: null
    }
  },
  created: function() {
    eventHub.$on('show-details', this.open)
  },
  methods: {
    open(movie) {
      console.log("open")
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    }
  }
}
</script>

<style>

</style>
