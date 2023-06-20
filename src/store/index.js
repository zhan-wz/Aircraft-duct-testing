import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import form from './modules/form'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    form
  },
  getters
})

export default store
