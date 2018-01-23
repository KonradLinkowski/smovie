<template>
    <div class="max-width">
        <div class="container flex-space-between flex-center-vert navigation site-width center-hor">
            <button v-show="page > 1" @click="prevPage"><i class="medium material-icons">navigate_before</i></button>
            <div style="flex-grow"></div>
            <button v-show="hasNextPage" @click="nextPage"><i class="medium material-icons">navigate_next</i></button>
        </div>
        <div class="container flex-wrap blank-field site-width center-hor">
            <Movie v-for="item in list" :key="item.id" :movie="item" />
        </div>
        <infinite-loading @infinite="infiniteHandler">
            <div slot="no-more" class="container flex-space-between flex-center-vert navigation site-width center-hor">
                <button v-show="page > 1" @click="prevPage">navigate_before</button>
                <div style="flex-grow"></div>
                <button @click="nextPage"><i class="medium material-icons">navigate_next</i></button>
            </div>
        </infinite-loading>
    </div>
</template>

<script>
import Movie from './Movie'
import InfiniteLoading from 'vue-infinite-loading';
import { getPopularMovies, findMovies } from '../utils/api'
import eventHub from '../utils/eventhub';
import router from '../router'
export default {
    data() {
        return {
            list: [],
            moviePage: 1,
            pagePerSite: 5,
            page: 1,
            infiniteState: null,
            hasNextPage: true
        }
    },
    created: function() {
        this.moviePage = (this.$route.query.page - 1) * this.pagePerSite + 1 || 1
        this.page = this.$route.query.page || 1
    },
    methods: {
        infiniteHandler($state) {
            this.infiniteState = $state
            console.log("infinite", this.moviePage)
            getPopularMovies({
                page: this.moviePage
            })
            .then(movies => {
                console.log("then", this.moviePage)
                if (movies.results.length) {
                    this.list = this.list.concat(movies.results)
                    $state.loaded();
                    this.moviePage++;
                    if (this.moviePage % (this.pagePerSite + 1) === 0) {
                        this.hasNextPage = false
                        $state.complete();
                    }
                } else {
                    this.hasNextPage = false
                    $state.complete();
                }
            })
        },
        nextPage() {
            this.page++
            this.moviePage = (this.page - 1) * this.pagePerSite + 1
            this.list = []
            router.push({ query: { page: this.page } })
            this.hasNextPage = true
            this.infiniteState.reset()
        },
        prevPage() {
            if (this.page > 1) {
                this.page--
                this.moviePage = (this.page - 1) * this.pagePerSite + 1
                this.list = []
                router.push({ query: { page: this.page } })
                this.hasNextPage = true
                this.infiniteState.reset()
            }
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
