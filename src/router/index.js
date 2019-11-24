import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'
import routes from './routes'
import Store from '../store/index'
Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function(/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    const currentUser = firebase.auth().currentUser

    // TODO: Refactor to set the user only on application enter instead of every route change
    if (currentUser) {
      Store().commit('user/setUser', {
        displayName: currentUser.displayName,
        email: currentUser.email,
        uid: currentUser.uid,
        emailVerified: currentUser.emailVerified
      })
    }
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    console.log('requiresAuth', requiresAuth)
    // if (!requiresAuth) {
    //   next()
    // }
    if (requiresAuth && !currentUser) next('login')
    else if (!requiresAuth && currentUser) next('/weekly')
    else next()
  })

  return Router
}
