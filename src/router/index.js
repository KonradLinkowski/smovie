import Vue from 'vue';
import Router from 'vue-router';
import MovieList from '../components/MovieList'
import SearchList from '../components/SearchList'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'MovieList',
      component: MovieList,
    },
    {
      path: '/search/:query',
      component: SearchList 
    }
  ],
});