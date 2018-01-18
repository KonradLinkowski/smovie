<template>
  <div id="app">
    <Details />
    <Search />
    <MovieList />
  </div>
</template>

<script>
import Details from './components/Details'
import Search from './components/Search'
import MovieList from './components/MovieList'
export default {
  name: 'app',
  components: {
    Search,
    MovieList,
    Details
  }
}
</script>