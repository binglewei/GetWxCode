import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    access_token: '',
    accessParams: {
      appId: '',
      secret: ''
    }
  },
  mutations: {
    setAccess (state, str) {
      state.access_token = str
    },
    setAccessParams (state, { appId, secret }) {
      state.accessParams = {
        appId,
        secret
      }
    }
  },
  actions: {}
})
