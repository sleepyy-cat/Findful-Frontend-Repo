import { createRouter, createWebHistory } from 'vue-router'
import User from '@/components/user.vue'
import Space from '@/components/space.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'user', component: User },
    { path: '/space', name: 'space', component: Space },
  ],
})

export default router
