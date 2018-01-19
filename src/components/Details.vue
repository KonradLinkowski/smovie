<template>
  <div class="lightbox" v-show="isOpen">
    <div style="width: 100%; height: 100%; position: fixed"  @click="close"></div>
    <div class="details" style="z-index: 100">
      <div class="poster">
        <img v-if="movie.poster_path" :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" alt="Movie">
        <img v-else src="https://placehold.it/500x750" alt="Movie">
      </div>
      <p>{{ movie.title }}</p>
      <p v-for="item in movie.genre_ids" :key="item.id">{{ getGenreName(item) }}</p>
    </div>
  </div>
</template>

<script>
import eventHub from '../utils/eventhub'
import { getGenres } from '../utils/api'
export default {
  data() {
    return {
      isOpen: false,
      movie: {},
      genres: [],
    }
  },
  created: function() {
    eventHub.$on('show-details', this.open)
    getGenres()
    .then(genres => {
      this.genres = genres
    })
    .catch(err => {
      console.error(err)
    })
  },
  methods: {
    open(movie) {
      console.log(movie.genre_ids)
      this.movie = movie
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
    getGenreName(id) {
      return this.genres.filter(genre => {
        return genre.id == id
      })[0].name
    }
  }
}
</script>

<style>

</style>
