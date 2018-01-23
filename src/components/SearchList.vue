<template>
  <div class="max-width">
    <div class="container site-width center-hor">
      <button v-show="page > 1" @click="prevPage">Previous Page</button>
      <div style="flex-grow"></div>
      <button v-show="hasNextPage" @click="nextPage">Next Page</button>
    </div>
    <div class="container flex-wrap blank-field site-width center-hor">
      <Movie v-for="item in list" :key="item.id" :movie="item" />
    </div>
    <infinite-loading @infinite="infiniteHandler">
      <div slot="no-more" class="container site-width center-hor">
        <button v-show="page > 1" @click="prevPage">Previous Page</button>
        <div style="flex-grow"></div>
        <button v-show="hasNextPage" @click="nextPage">Next Page</button>
      </div>
    </infinite-loading>
  </div>
</template>

<script>
import Movie from './Movie'
import InfiniteLoading from 'vue-infinite-loading';
import { getPopularMovies, findMovies } from '../utils/api'
import eventHub from '../utils/eventhub'
import router from '../router'
export default {
  data() {
    return {
      list: [],
      moviePage: 1,
      pagePerSite: 5,
      page: 1,
      searchedMovie: 'wiedźmin',
      infiniteState: null,
      hasNextPage: true
    }
  },
  created: function() {
    this.moviePage = (this.$route.query.page - 1) * this.pagePerSite + 1 || 1
    this.page = this.$route.query.page || 1
  },
  watch: {
    '$route' (to, from) {
      this.page = 1
      this.moviePage = 1
      this.list = []
      this.hasNextPage = true
      this.infiniteState.reset()
    }
  },
  methods: {
    infiniteHandler($state) {
      this.infiniteState = $state
      findMovies({
        query: this.$route.query.movie,
        page: this.moviePage
      })
      .then(movies => {
        if (movies.results.length) {
          this.list = this.list.concat(movies.results)
          $state.loaded();
          this.moviePage++;
          if (this.moviePage % (this.pagePerSite + 1) === 0) {
            this.hasNextPage = false
            $state.complete();
          }
        } else {
          this.hasNextPage = false
          $state.complete();
        }
      })
    },
    changeMovie(movie) {
      console.log(movie)
      this.searchedMovie = movie
      this.list = []
      this.infiniteState.reset()
    },
    nextPage() {
      this.page++
      this.moviePage = (this.page - 1) * this.pagePerSite + 1
      this.list = []
      let query = { movie: this.$route.query.movie, page: this.page }
      router.push({ query: query })
      this.hasNextPage = true
      this.infiniteState.reset()
    },
    prevPage() {
      if (this.page > 1) {
        this.page--
        this.moviePage = (this.page - 1) * this.pagePerSite + 1
        this.list = []
        let query = { movie: this.$route.query.movie, page: this.page }
        router.push({ query: query })
        this.hasNextPage = true
        this.infiniteState.reset()
      }
    },
  },
  components: {
      Movie,
      InfiniteLoading
  }
}
</script>

<style>

</style>
