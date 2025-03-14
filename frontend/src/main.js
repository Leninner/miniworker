import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

// Set up Pinia for state management
app.use(createPinia())

// Register router
app.use(router)

app.mount('#app') 