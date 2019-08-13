import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueLazyLoad from 'vue-lazyload'
import store from './store'
import './common/scss/ele-var.scss'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueLazyLoad, {
  loading: require('common/image/loading.gif')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
