<template>
  <div class="auth-container">
    <h2>Login</h2>
    <p v-if="error" class="error">{{ error }}</p>
    <form @submit.prevent="handleLogin" class="auth-form">
      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit" class="btn-auth">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import { authStore } from '../store/auth';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');

const handleLogin = async () => {
  try {
    const res = await api.post('/users/login', { email: email.value, password: password.value });
    authStore.setUser(res.data.data);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed';
  }
};
</script>

<style scoped>
.auth-container { max-width: 400px; margin: 3rem auto; padding: 2rem; border: 1px solid #ddd; border-radius: 8px; }
.auth-form { display: flex; flex-direction: column; gap: 1rem; }
.form-group { display: flex; flex-direction: column; }
.form-group input { padding: 8px; font-size: 1rem; border-radius: 4px; border: 1px solid #ccc; }
.btn-auth { background: #2c3e50; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer; }
.error { color: red; margin-bottom: 1rem; }
</style>