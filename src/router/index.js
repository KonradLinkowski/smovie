import Vue from 'vue';
import Router from 'vue-router';
import MovieList from '../components/MovieList'
import SearchList from '../components/SearchList'

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: window.location.pathName,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: MovieList,
    },
    {
      path: '/search',
      name: 'Search',
      component: SearchList 
    }
  ],
});