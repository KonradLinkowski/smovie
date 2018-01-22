<template>
  <div class="container center padding">
      <input class="search padding" v-model="message" placeholder="Szukaj">
      <button @click="this.search">Go!</button>
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
    }
  }
}
</script>

<style>

</style>
