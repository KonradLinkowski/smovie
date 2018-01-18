<template>
    <div style="width: 100%">
        <div class="container left" style="width: 900px; margin: 0 auto">
            <Movie v-for="item in list" :key="item.id" :movie="item" />
        </div>
        <infinite-loading @infinite="infiniteHandler">
            <span slot="no-more">
                There is no more posts :(
            </span>
        </infinite-loading>
    </div>
</template>

<script>
import Movie from './Movie'
import InfiniteLoading from 'vue-infinite-loading';
import { getPopularMovies } from '../utils/api'
export default {
    data() {
        return {
            list: [],
            page: 1
        }
    },
    created: function() {
       /*
        getPopularMovies()
        .then(movies => {
            this.list = this.list.concat(movies.results)
            console.log(this.list)
        })
        .catch(err => {
            console.error(err)
        })
        */
    },
    methods: {
        infiniteHandler($state) {
        getPopularMovies({
            page: this.page
        })
        .then(movies => {
            if (movies.results.length) {
                this.list = this.list.concat(movies.results)
                $state.loaded();
                this.page++;
                /*if (this.list.length / 20 === 2) {
                $state.complete();
                }*/
            } else {
                $state.complete();
            }
        })
        },
    },
    components: {
        Movie,
        InfiniteLoading
    }
}
</script>

<style>

</style>
