<template>
  <div class="container center padding">
      <input class="search padding" v-model="message" placeholder="Szukaj">
  </div>
</template>

<script>
import _ from 'lodash'
import { findMovies } from '../utils/api'
import eventHub from '../utils/eventhub'
export default {
  data() {
    return {
      message: ''
    }
  },
  watch:{
    message: function() {
      this.search();
    }
  },
  methods: {
    search: _.debounce(function() {
      eventHub.$emit('search-movie', this.message)
    }, 500)
  }
}
</script>

<style>

</style>
