<template>
  <article class="movie border poster shadow-bot hvr-float clickable container-vert" tabindex="0" @click="openDetails">
    <div>
      <img v-if="movie.poster_path" :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" alt="Movie">
      <img v-else src="https://placehold.it/500x750" alt="Movie">
    </div>
    <div class="flex-grow movie-details">
      <h2 class="">{{ movie.title }}</h2>
      <p class="">Popularność: {{ movie.popularity }}</p>
      <p class="">Liczba głosów: {{ movie.vote_count }}</p>
    </div>
    <div class="container flex-space-between movie-footer">
      <span>{{ movie.release_date }}</span>
      <span>{{ movie.vote_average }}</span>
    </div>
  </article>
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
