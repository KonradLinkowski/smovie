<template>
  <div class="lightbox" v-show="isOpen">
    <div class="position-fixed max-width max-height top-0 clickable" @click="close"></div>
    <div class="details container">
      <div class="close-btn" @click="close"><i class="material-icons">close</i></div>
      <div class="poster flex-no-shrink margin-right">
        <img class="border" v-if="movie.poster_path" :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" alt="Movie">
        <img class="border" v-else src="https://placehold.it/500x750" alt="Movie">
      </div>
      <div class="container flex-wrap flex-start">
        <div class="flex-strech-self">
          <h2>{{ movie.title }}</h2>
          <h3>{{ movie.original_title }}</h3>
          <a :href="'https://www.themoviedb.org/movie/' + movie.id">https://www.themoviedb.org/movie/{{ movie.id }}</a>
        </div>
        <p class="flex-strech-self no-margin">
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
  watch: {
    isOpen: function() {
      this.switchScrolling();
    }
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
    switchScrolling() {
      if (this.isOpen) {
        document.querySelector('#app').classList.add('scroll-off')
      } else {
        document.querySelector('#app').classList.remove('scroll-off')
      }
    }
  }
}
</script>

<style>

</style>
