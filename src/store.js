import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    access_token: ''
  },
  mutations: {
    setAccess (state, str) {
      state.access_token = str
    }
  },
  actions: {}
})
