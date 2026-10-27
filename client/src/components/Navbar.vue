<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="brand">Blog Post Proj</router-link>
      <div class="nav-links">
        <router-link to="/">Home</router-link>
        <template v-if="authStore.user">
          <router-link to="/create">Create Post</router-link>
          <span class="user-greeting">Welcome, {{ authStore.user.username }} <strong v-if="authStore.user.isAdmin">(Admin)</strong></span>
          <button @click="handleLogout" class="btn-logout">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login">Login</router-link>
          <router-link to="/register">Register</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { authStore } from '../store/auth';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.navbar { background: #2c3e50; padding: 1rem 2rem; color: #fff; }
.nav-container { display: flex; justify-content: space-between; align-items: center; max-width: 1000px; margin: 0 auto; }
.brand { color: #42b983; font-size: 1.5rem; font-weight: bold; text-decoration: none; }
.nav-links { display: flex; gap: 1rem; align-items: center; }
.nav-links a { color: #ecf0f1; text-decoration: none; }
.nav-links a.router-link-active { color: #42b983; font-weight: bold; }
.user-greeting { font-size: 0.9rem; color: #bdc3c7; margin-left: 10px; }
.btn-logout { background: #e74c3c; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; }
</style>