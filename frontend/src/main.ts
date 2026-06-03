import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import pinia from './store'

console.log('Starting Vue app initialization...')

try {
  const app = createApp(App)

  app.use(pinia)
  app.use(router)

  app.mount('#app')
  console.log('Vue app mounted successfully.')
} catch (e) {
  console.error('Error mounting Vue app:', e)
}
