import Vue from 'vue'
import Vuex from 'vuex'

import app from './app'
import user from './user'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      app,
      user
    },

    strict: false
  })

  /*
    if we want some HMR magic for it, we handle
    the hot update like below. Notice we guard this
    code with "process.env.DEV" -- so this doesn't
    get into our production build (and it shouldn't).
  */

  if (process.env.DEV && module.hot) {
    module.hot.accept(['./app'], () => {
      const newApp = require('./app').default
      Store.hotUpdate({ modules: { app: newApp } })
    })
  }

  return Store
}
