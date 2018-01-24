<template>
  <div class="max-width">
    <div class="container flex-space-between flex-center-vert navigation site-width center-hor">
      <button v-bind:class="{invisible: page <= 1}" @click="prevPage"><i class="medium material-icons">navigate_before</i></button>
      <div style="flex-grow"></div>
      <span class="color-text clickable" @click="sortMovies">Sortuj: <span class="color-text bold">{{ sortedby.current.name }}</span> </span>
      <div style="flex-grow"></div>
      <button v-bind:class="{invisible: !hasNextPage}" @click="nextPage"><i class="medium material-icons">navigate_next</i></button>
    </div>
    <div class="container flex-wrap blank-field site-width center-hor">
      <Movie v-for="item in list" :key="item.id" :movie="item" />
    </div>
    <infinite-loading @infinite="infiniteHandler">
      <div slot="no-more" class="container flex-space-between flex-center-vert navigation site-width center-hor">
        <button v-bind:class="{invisible: page <= 1}" @click="prevPage"><i class="medium material-icons">navigate_before</i></button>
        <div style="flex-grow"></div>
        <button v-bind:class="{invisible: !hasNextPage}" @click="nextPage"><i class="medium material-icons">navigate_next</i></button>
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
    this.moviePage = (this.$route.query.page - 1) * this.pagePerSite + 1 || 1
    this.page = this.$route.query.page || 1
    this.sortedby.current = this.sortedby.states.popularity
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
    sortMovies() {
      this.sortedby.next()
      console.log(this.sortedby)
      this.list.sort(this.sortedby.current.fun)
    },
    nextPage() {
      this.page++
      this.moviePage = this.page * this.pagePerSite + 1
      this.list = []
      router.push({ query: { page: this.page } })
      this.infiniteState.reset()
      this.sortedby.current = this.sortedby.states.popularity
    },
    prevPage() {
      if (this.page > 1) {
        this.page--
        this.moviePage = (this.page - 1) * this.pagePerSite + 1
        this.list = []
        router.push({ query: { page: this.page } })
        this.infiniteState.reset()
        this.sortedby.current = this.sortedby.states.popularity
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
