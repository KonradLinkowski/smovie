<template>
    <div style="width: 100%">
        <div class="container left" style=" margin: 0 auto; max-width: 80%">
            <Movie v-for="item in list" :key="item.id" :movie="item" />
        </div>
        <infinite-loading @infinite="infiniteHandler">
            <span slot="no-more">
                <a href="#">Next page </a>
            </span>
        </infinite-loading>
    </div>
</template>

<script>
import Movie from './Movie'
import InfiniteLoading from 'vue-infinite-loading';
import { getPopularMovies, findMovies } from '../utils/api'
import eventHub from '../utils/eventhub';
export default {
    data() {
        return {
            list: [],
            page: 1,
            searchMode: false
        }
    },
    created: function() {
       eventHub.$on('search-movie', this.searchMovies)
    },
    watch:{
        searchMode: function() {
            this.list = []
        }
    },
    methods: {
        infiniteHandler($state) {
            console.log(this.$route)
            getPopularMovies({
                page: this.page
            })
            .then(movies => {
                if (movies.results.length) {
                    this.list = this.list.concat(movies.results)
                    $state.loaded();
                    this.page++;
                    if (this.list.length / 20 === 5) {
                        $state.complete();
                    }
                } else {
                    $state.complete();
                }
            })
        },
        searchMovies(message) {
            if (message.length == 0) {
                this.searchMode = false
                return
            }
            this.searchMode = true
            findMovies(message)
            .then(movies => {
                console.log(movies)
                this.list = this.list.concat(movies.results)
            })
            .catch(err => {
                console.error(err)
            })
        }
    },
    components: {
        Movie,
        InfiniteLoading
    }
}
</script>

<style>

</style>
