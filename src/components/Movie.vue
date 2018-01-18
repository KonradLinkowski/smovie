<template>
  <div class="card" tabindex="0" @click="openDetails">
    <img v-if="movie.poster_path" :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" alt="Movie">
    <img v-else src="https://placehold.it/500x750" alt="Movie">
  </div>
</template>

<script>
import eventHub from '../utils/eventhub'
export default {
  data() {
    return {
    }
  },
  props: [
    'movie'
  ],
  methods: {
    openDetails() {
      eventHub.$emit('show-details', this.movie)
    }
  }
}
</script>

<style>

</style>
