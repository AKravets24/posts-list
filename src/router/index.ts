import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Main from "@/frontend/pages/main/Main.vue";
import About from "@/frontend/pages/about/About.vue";
import BattleShip from "@/frontend/pages/game/BattleShip.vue";
import PostIdPage from "@/frontend/pages/main/PostIdPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/posts',
    component: Main
  },
  {
    path: '/posts/:id',
    component: PostIdPage
  },

  {
    path: '/about',
    // component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    // component: () => import(/* webpackChunkName: "about" */  "@/frontend/pages/about/About.vue")
    component: About
  },
  {
    path: '/game',
    component: BattleShip,
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
