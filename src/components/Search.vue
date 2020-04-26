<template>
  <div class="search-bar container flex-center-vert max-width rounded shadow-bot">
    <div class="container site-width center-hor">
      <button @click="goHome"><i class="material-icons">home</i></button>
      <input class="search flex-grow" @keyup.enter="search" v-model="message" placeholder="Szukaj">
      <button :disabled="message < 1" @click="search"><i class="medium material-icons">search</i></button>
    </div>
  </div>
</template>

<script>
import router from '../router';
export default {
  data() {
    return {
      message: ''
    };
  },
  created() {
    if (!this.$route.query.movie) {
      this.goHome();
      return;
    }
    this.message = this.$route.query.movie;
  },
  methods: {
    search() {
      router.push({ query: { movie: this.message }});
    },
    goHome() {
      if (router.currentRoute.fullPath !== '/') {
        router.push('/');
      }
      this.message = '';
    }
  }
};
</script>

<style>

</style>
