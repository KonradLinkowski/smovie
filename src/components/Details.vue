<template>
  <div class="lightbox" v-show="isOpen">
    <div style="width: 100%; height: 100%; position: fixed"  @click="close"></div>
    <div class="details container" style="z-index: 100; flex-wrap: nowrap">
      <div class="poster" style="margin: 10px; flex-shrink: 0">
        <img class="border" v-if="movie.poster_path" :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" alt="Movie">
        <img class="border" v-else src="https://placehold.it/500x750" alt="Movie">
      </div>
      <div style="padding:0">
        <h2>{{ movie.title }}</h2>
        <a :href="'https://www.themoviedb.org/movie/' + movie.id">https://www.themoviedb.org/movie/{{ movie.id }}</a>
        <p>
          {{ movie.overview }}
        </p>
        <p class="no-margin">
          Gatunki
          <ul>
            <li v-for="(item, index) in movie.genres" :key="item.id">{{ movie.genres[index].name }}</li>
          </ul>
        </p>
        <p class="no-margin">
          Kraje produkcji
          <ul>
            <li v-for="(item, index) in movie.production_countries" :key="item.id">{{ movie.production_countries[index].name }}</li>
          </ul>
        </p>
        <p class="no-margin">
          Firmy produkcyjne
          <ul>
            <li v-for="(item, index) in movie.production_companies" :key="item.id">{{ movie.production_companies[index].name }}</li>
          </ul>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import eventHub from '../utils/eventhub'
import { getMovie } from '../utils/api'
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
  },
  methods: {
    open(movie) {
      getMovie(movie.id)
      .then(details => {
        this.movie = Object.assign(movie, details)
        this.isOpen = true;
      })
      .catch(err => {
        console.error(err)
      })
    },
    close() {
      this.isOpen = false;
    },
  }
}
</script>

<style>

</style>
