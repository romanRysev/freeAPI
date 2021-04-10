import { makeFetch } from '../api'

export default {
  state: {
    users: [],
  },

  mutations: {
    setUsers(state, users) {
      state.users = users
    },
    addMoreUsers(state, users) {
      //В ответе с сервера могут прийти записи, которые уже приходили раньше.
      //Например, если база сервера изменилась с момента последнего запроса.
      //В результате могут появлятся повторные записи пользователей.
      //Их надо фильтровать
      const obj = {}
      state.users.forEach((item) => {
        obj[item.id] = item.id
      })
      const usersFiltered = users.filter((item) => {
        return !obj[item.id]
      })
      state.users = state.users.concat(usersFiltered)
    },
  },

  actions: {
    async fetchUsers(state, options) {
      const res = await makeFetch(options)
      state.commit('setUsers', res)
    },
    async fetchMoreUsers(state, options) {
      const res = await makeFetch(options)

      state.commit('addMoreUsers', res)
    },
  },
  getters: {
    getUsers(state) {
      return state.users
    },
  },
}
