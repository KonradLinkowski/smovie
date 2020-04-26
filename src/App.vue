<template>
  <div id="app">
    <header class="container flex-center-vert">
      <h1 class="bright-color">Fiswietlacz</h1>
    </header>
    <Details />
    <Search />
    <MovieList />
  </div>
</template>

<script>
import Details from './components/Details';
import Search from './components/Search';
import MovieList from './components/MovieList';
export default {
  name: 'app',
  components: {
    Search,
    MovieList,
    Details
  }
};
</script>
<style>
@import './assets/style.css';
</style>
