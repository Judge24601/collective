import Vue from "vue";
import VueRouter from "vue-router";
import Landing from "../views/Landing.vue";
import Login from "../views/Login.vue";
import Posts from "@/components/Posts.vue";
import NewPost from "@/components/NewPost.vue";
import EditPost from "@/components/EditPost.vue";
import Checkout from "@/components/Checkout.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "landing",
    component: Landing
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/posts",
    name: "posts",
    component: Posts
  },
  {
    path: "/posts/new",
    name: "NewPost",
    component: NewPost
  },
  {
    path: "/posts/:id",
    name: "EditPost",
    component: EditPost
  },
  {
    path: "/checkout",
    name: "Checkout",
    component: Checkout
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
