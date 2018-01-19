<template>
  <article class="card border poster" tabindex="0" @click="openDetails">
    <img v-if="movie.poster_path" :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" alt="Movie">
    <img v-else src="https://placehold.it/500x750" alt="Movie">
    <aside>
      <h1 class="fnt-md" style="height:2.5rem; padding: 10px">{{ movie.title }}</h1>
      <div style="width:100%; height: 3rem; margin-top: 10px; padding: 10px;">
        <p class="fnt-sm no-margin">Popularność: {{ movie.popularity }}</p>
        <p class="fnt-sm no-margin">Liczba głów: {{ movie.vote_count }}</p>
      </div>
      <div class="footer" style="padding: 10px;">
        <span>{{ movie.release_date }}</span>
        <span style="float: right">{{ movie.vote_average }}</span>
      </div>
    </aside>
  </article>
</template>

<script>
import eventHub from '../utils/eventhub'
export default {
  data() {
    return {
    }
  },
  props: [
    'movie'
  ],
  methods: {
    openDetails() {
      eventHub.$emit('show-details', this.movie)
    }
  }
}
</script>

<style>

</style>
