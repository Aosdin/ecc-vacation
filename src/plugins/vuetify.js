import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    themes: {
      light: {
        primary: '#1976D2',
        secondary: '#c30e2e',
        accent: '#f03c3c',
        error: '#c30e2e',
        info: '#b656c8',
        success: '#76ba50',
        warning: '#e6e6e6',
        anchor: 'inherit'
      }
    }
  }
})
