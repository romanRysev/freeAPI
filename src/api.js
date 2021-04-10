import axios from 'axios'
import store from './store/index'
import { BASE_URL } from './config/config'

export async function makeFetch(options) {
  let queryString = `q=${options.query}`
  delete options.query

  for (let key in options) {
    queryString = queryString + '&' + key + '=' + options[key]
  }

  try {
    const res = await axios.get(`${BASE_URL}/search/users?${queryString}`)
    return res.data.items
  } catch (error) {
    store.dispatch('showError', error.message)
    setTimeout(() => {
      store.dispatch('deleteError')
    }, 10000)
  }
}
