<template>
  <div class="max-width">
    <div class="container flex-space-between flex-center-vert navigation site-width center-hor">
      <button v-bind:class="{invisible: page <= 1}" @click="prevPage"><i class="medium material-icons">navigate_before</i></button>
      <div style="flex-grow"></div>
      <span class="color-text clickable" @click="sortMovies">Sortuj: <span class="color-text bold">{{ sortedby.current.name }}</span> </span>
      <div style="flex-grow"></div>
      <button v-bind:class="{invisible: !hasNextPage()}" @click="nextPage"><i class="medium material-icons">navigate_next</i></button>
    </div>
    <div class="container flex-wrap blank-field site-width center-hor">
      <Movie v-for="item in list" :key="item.id" :movie="item" />
    </div>
    <infinite-loading @infinite="infiniteHandler">
      <div slot="no-more" class="container flex-space-between flex-center-vert navigation site-width center-hor">
        <button v-bind:class="{invisible: page <= 1}" @click="prevPage"><i class="medium material-icons">navigate_before</i></button>
        <div style="flex-grow"></div>
        <button v-bind:class="{invisible: !hasNextPage()}" @click="nextPage"><i class="medium material-icons">navigate_next</i></button>
      </div>
      <span slot="no-results">Brak filmów :(</span>
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
      moviePage: 0,
      pagePerSite: 5,
      page: 1,
      searchedMovie: '',
      infiniteState: null,
      totalPages: null,
      sortedby: {
        states: {
          popularity: {
            fun: (a, b) => {
              return a.popularity < b.popularity ? 1 : a.popularity > b.popularity ? -1 : 0
            },
            name: 'popularność'
          },
          atoz: {
            fun: (a, b) => {
              a.title = a.title.toLowerCase()
              b.title = b.title.toLowerCase()
              return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
            },
            name: 'a do z'
          },
          ztoa: {
            fun: (a, b) => {
              a.title = a.title.toLowerCase()
              b.title = b.title.toLowerCase()
              return a.title < b.title ? 1 : a.title > b.title ? -1 : 0;
            },
            name: 'z do a'
          }
        },
        current: null,
        next: () => {
          if (this.sortedby.current == this.sortedby.states.popularity) {
            this.sortedby.current = this.sortedby.states.atoz
          } else if (this.sortedby.current == this.sortedby.states.atoz) {
            this.sortedby.current = this.sortedby.states.ztoa
          } else {
            this.sortedby.current = this.sortedby.states.popularity
          }
        }
      },
    }
  },
  created: function() {
    this.moviePage = (this.$route.query.page - 1) * this.pagePerSite || 0
    this.page = this.$route.query.page || 1
    this.sortedby.current = this.sortedby.states.popularity
  },
  watch: {
    '$route.query.movie' (to, from) {
      this.page = 1
      this.moviePage = 0
      this.list = []
      this.infiniteState.reset()
    },
    totalPages: function() {
      this.hasNextPage()
    }
  },
  methods: {
    infiniteHandler($state) {
      if(this.totalPages && this.moviePage >= this.totalPages) {
        $state.complete()
        return
      }
      this.infiniteState = $state
      findMovies({
        query: this.$route.query.movie,
        page: this.moviePage + 1
      })
      .then(movies => {
        if (movies.results.length) {
          this.totalPages = movies.total_pages
          this.list = this.list.concat(movies.results)
          $state.loaded();
          this.moviePage++;
          if (this.moviePage % this.pagePerSite === 0) {
            $state.complete();
          }
        } else {
          $state.complete();
        }
      })
    },
    changeMovie(movie) {
      this.searchedMovie = movie
      this.list = []
      this.infiniteState.reset()
    },
    hasNextPage() {
      if(this.totalPages == null) {
        return false
      }
      if(Math.floor(this.moviePage / this.pagePerSite) + 1 < Math.floor(this.totalPages / this.pagePerSite) + 1) {
        return true
      }
      return false
    },
    sortMovies() {
      this.sortedby.next()
      this.list.sort(this.sortedby.current.fun)
    },
    nextPage() {
      if (this.hasNextPage) {
        this.page++
        this.moviePage = (this.page - 1) * this.pagePerSite
        this.list = []
        let query = { movie: this.$route.query.movie, page: this.page }
        router.push({ query: query })
        this.infiniteState.reset()
        this.sortedby.current = this.sortedby.states.popularity
      }
    },
    prevPage() {
      if (this.page > 1) {
        this.page--
        this.moviePage = (this.page - 1) * this.pagePerSite + 1
        this.list = []
        let query = { movie: this.$route.query.movie, page: this.page }
        router.push({ query: query })
        this.infiniteState.reset()
        this.sortedby.current = this.sortedby.states.popularity
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
