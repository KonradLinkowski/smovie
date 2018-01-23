<template>
  <div class="search-bar container flex-center-vert max-width rounded shadow-bot">
    <div class="container site-width center-hor">
      <!--<button @click="goHome">Home</button>-->
      <input class="search flex-grow" @keyup.enter="search" v-model="message" placeholder="Szukaj">
      <button :disabled="message < 1" @click="search"><i class="medium material-icons">search</i></button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { findMovies } from '../utils/api'
import eventHub from '../utils/eventhub'
import router from '../router'
export default {
  data() {
    return {
      message: ''
    }
  },
  created: function() {
    if(!this.$route.query.movie) {
      router.push('/')
      return
    }
    this.message = this.$route.query.movie
  },
  methods: {
    search: function() {
      router.push({ name: 'SearchList', query: { movie: this.message }})
    },
    goHome() {
      router.push({ path: '/' })
      this.message = ''
    }
  }
}
</script>

<style>

</style>
