// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueAnalytics from 'vue-analytics'
import Loading from '@/components/Loading'
import Meta from 'vue-meta'

// Establish meta tag management and some helper functions
Vue.use(Meta)

Vue.use(VueAnalytics, {
  id: [process.env.MV_GOOGLE_ANALYTICS_TOKEN],
  router,
  checkDuplicatedScript: true,
  debug: {
    enabled: false,
    sendHitTask: true
  }
})

export function metaDescriptions (description) {
  return [
    { vmid: 'description', name: 'description', content: description },
    { vmid: 'twitter:description', name: 'twitter:description', content: description },
    { vmid: 'og:description', property: 'og:description', content: description }
  ]
}
export function metaTitles (title) {
  return [
    { vmid: 'twitter:title', name: 'twitter:title', content: title + ' - Mapventures' },
    { vmid: 'og:title', property: 'og:title', content: title + ' - Mapventures' }
  ]
}

// Attach 3rd party libraries to Vue instance objects
// https://vuejsdevelopers.com/2017/04/22/vue-js-libraries-plugins/
Object.defineProperty(Vue.prototype, 'Loading', { value: Loading })
Object.defineProperty(Vue.prototype, 'loadingDefaults', { value: {
  loading: Loading,
  delay: 200,
  timeout: 10000
}})

// Disable nag
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store: store
})
