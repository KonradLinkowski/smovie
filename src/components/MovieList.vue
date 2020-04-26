<template>
  <div class="max-width">
    <div class="container flex-space-between flex-center-vert navigation site-width center-hor">
      <button v-bind:class="{invisible: page <= 1}" @click="prevPage"><i class="medium material-icons">navigate_before</i></button>
      <div style="flex-grow"></div>
      <span class="color-text clickable" @click="sortMovies">Sortuj: <span class="color-text bold">{{ sortStateName }}</span> </span>
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
import Movie from './Movie';
import InfiniteLoading from 'vue-infinite-loading';
import { getPopularMovies, findMovies } from '../utils/api';
import router from '../router';
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
        states: [{
            fun: (a, b) => a.popularity - b.popularity,
            name: 'popularność'
          }, {
            fun: (a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
            name: 'a do z'
          }, {
            fun: (a, b) => b.title.toLowerCase().localeCompare(a.title.toLowerCase()),
            name: 'z do a'
          }
        ],
        current: 0,
        next: () => {
          this.sortedby.current = (this.sortedby.current + 1) % this.sortedby.states.length;
        }
      },
    };
  },
  created() {
    this.moviePage = (this.$route.query.page - 1) * this.pagePerSite || 0;
    this.page = this.$route.query.page || 1;
  },
  watch: {
    '$route.query.movie'() {
      this.loadPage();
    },
    totalPages() {
      this.hasNextPage();
    }
  },
  computed: {
    sortStateName() {
      return this.sortedby.states[this.sortedby.current].name;
    }
  },
  methods: {
    infiniteHandler($state) {
      if (this.totalPages && this.moviePage >= this.totalPages) {
        $state.complete();
        return;
      }
      this.infiniteState = $state;
      this.loadMovies(this.$route.query.movie, this.moviePage + 1)
      .then(movies => {
        if (movies.results.length) {
          this.totalPages = movies.total_pages;
          this.list = this.list.concat(movies.results);
          $state.loaded();
          this.moviePage++;
          if (this.moviePage % this.pagePerSite === 0) {
            $state.complete();
          }
        } else {
          $state.complete();
        }
      });
    },
    loadMovies(movie, page) {
      if (movie) {
        return findMovies({
          query: movie,
          page
        });
      } else {
        return getPopularMovies({
          page
        });
      }
    },
    changeMovie(movie) {
      this.searchedMovie = movie;
      this.list = [];
      this.infiniteState.reset();
    },
    hasNextPage() {
      if (this.totalPages == null) {
        return false;
      }
      if (Math.floor(this.moviePage / this.pagePerSite) + 1 < Math.floor(this.totalPages / this.pagePerSite) + 1) {
        return true;
      }
      return false;
    },
    sortMovies() {
      this.sortedby.next();
      this.list.sort(this.sortedby.states[this.sortedby.current].fun);
    },
    nextPage() {
      if (this.hasNextPage) {
        let query = { movie: this.$route.query.movie, page: parseInt(this.page) + 1 };
        router.push({ query });
        this.loadPage();
      }
    },
    prevPage() {
      if (this.page > 1) {
        let query = { movie: this.$route.query.movie, page: parseInt(this.page) - 1 };
        router.push({ query });
        this.loadPage();
      }
    },
    loadPage() {
      this.list = [];
      if (this.infiniteState) {
        this.infiniteState.reset();
      }
      this.moviePage = (this.$route.query.page - 1) * this.pagePerSite || 0;
      this.page = this.$route.query.page || 1;
      this.sortedby.current = 0;
    }
  },
  components: {
      Movie,
      InfiniteLoading
  }
};
</script>

<style>

</style>
