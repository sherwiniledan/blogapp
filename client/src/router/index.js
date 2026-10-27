import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PostDetailView from '../views/PostDetailView.vue';
import CreateEditPostView from '../views/CreateEditPostView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import { authStore } from '../store/auth';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/posts/:id', name: 'PostDetail', component: PostDetailView },
  { path: '/create', name: 'CreatePost', component: CreateEditPostView, meta: { requiresAuth: true } },
  { path: '/edit/:id', name: 'EditPost', component: CreateEditPostView, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Return a value instead of calling next() (next() is deprecated)
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !authStore.user) {
    return '/login';
  }
});

export default router;