<template>
  <div class="max-width">
    <div class="container flex-space-between flex-center-vert navigation site-width center-hor">
      <button v-show="page > 1" @click="prevPage"><i class="medium material-icons">navigate_before</i></button>
      <div style="flex-grow"></div>
      <button @click="sortMoviesPop">Sort</button>
      <div style="flex-grow"></div>
      <button v-show="hasNextPage" @click="nextPage"><i class="medium material-icons">navigate_next</i></button>
    </div>
    <div class="container flex-wrap blank-field site-width center-hor">
      <Movie v-for="item in list" :key="item.id" :movie="item" />
    </div>
    <infinite-loading @infinite="infiniteHandler">
      <div slot="no-more" class="container flex-space-between flex-center-vert navigation site-width center-hor">
        <button v-show="page > 1" @click="prevPage"><i class="medium material-icons">navigate_before</i></button>
        <div style="flex-grow"></div>
        <button v-show="hasNextPage" @click="nextPage"><i class="medium material-icons">navigate_next</i></button>
      </div>
    </infinite-loading>
  </div>
</template>

<script>
import Movie from './Movie'
import InfiniteLoading from 'vue-infinite-loading';
import { getPopularMovies, findMovies } from '../utils/api'
import eventHub from '../utils/eventhub';
import router from '../router'
export default {
  data() {
    return {
      list: [],
      moviePage: 1,
      pagePerSite: 5,
      page: 1,
      infiniteState: null,
      totalPages: null,
      sorted: false,
    }
  },
  created: function() {
    this.moviePage = (this.$route.query.page - 1) * this.pagePerSite + 1 || 1
    this.page = this.$route.query.page || 1
  },
  methods: {
    infiniteHandler($state) {
      this.infiniteState = $state
      getPopularMovies({
        page: this.moviePage
      })
      .then(movies => {
        if (movies.results.length) {
          this.totalPages = movies.total_results
          this.list = this.list.concat(movies.results)
          $state.loaded();
          this.moviePage++;
          if ((this.moviePage - 1) % this.pagePerSite === 0) {
            $state.complete();
          }
        } else {
          $state.complete();
        }
      })
    },
    hasNextPage() {
      if(totalPages == null) {
        return true
      }
      if(this.moviePage % this.pagePerSite < this.totalPages % this.pagePerSite) {
        return true
      }
      return false
    },
    sortMoviesPop() {
      this.list.sort((a, b) => {
        a = a.popularity, b = b.popularity;
        if (this.sorted) {
          if (a > b)
            return -1;
          if (a < b)
            return 1;
        } else {
          if (a < b)
            return -1;
          if (a > b)
            return 1;
        }
        return 0;
      });
      this.sorted = !this.sorted
    },
    sortMoviesAlpha() {
      this.list.sort((a, b) => {
        a = a.title.toLowerCase(), b = b.title.toLowerCase();
        if (this.sorted) {
          if (a > b)
            return -1;
          if (a < b)
            return 1;
        } else {
          if (a < b)
            return -1;
          if (a > b)
            return 1;
        }
        return 0;
      });
      this.sorted = !this.sorted
    },
    nextPage() {
      this.page++
      this.moviePage = this.page * this.pagePerSite + 1
      this.list = []
      router.push({ query: { page: this.page } })
      this.infiniteState.reset()
    },
    prevPage() {
      if (this.page > 1) {
        this.page--
        this.moviePage = (this.page - 1) * this.pagePerSite + 1
        this.list = []
        router.push({ query: { page: this.page } })
        this.infiniteState.reset()
      }
    }
  },
  components: {
    Movie,
    InfiniteLoading
  }
}
</script>

<style>

</style>
