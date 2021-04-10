export default {
  state: {
    error: { text: '', isVisible: false },
  },

  mutations: {
    setError(state, error) {
      state.error = error
    },
  },

  actions: {
    showError(state, error) {
      state.commit('setError', { text: error, isVisible: true })
    },
    deleteError(state) {
      state.commit('setError', { isVisible: false })
    },
  },

  getters: {
    getError(state) {
      return state.error
    },
  },
}
