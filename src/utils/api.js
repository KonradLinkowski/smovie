import axios from 'axios'

const key = '0e16ef3395ba49327a6a6d3e9b4861e1'
const serverURL = 'https://api.themoviedb.org/3/'

export function getPopularMovies(params) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: serverURL + 'movie/popular',
      params: {
        api_key: key,
        page: params.page
      }
    })
    .then(({data}) => {
      resolve(data)
    })
    .catch(error => {
      console.error(error)
      reject(error)
    });
  })
}