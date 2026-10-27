<template>
  <div class="auth-container">
    <h2>Register</h2>
    <p v-if="error" class="error">{{ error }}</p>
    <form @submit.prevent="handleRegister" class="auth-form">
      <div class="form-group">
        <label>Username</label>
        <input v-model="username" type="text" required />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-model="password" type="password" minlength="6" required />
      </div>
      <div class="form-group">
        <label>Confirm Password</label>
        <input v-model="confirmPassword" type="password" minlength="6" required />
        <small v-if="confirmPassword && password !== confirmPassword" class="error">Passwords do not match</small>
      </div>
      <div class="form-group checkbox-group">
        <label>
          <input v-model="isAdmin" type="checkbox" /> Register as Admin
        </label>
      </div>
      <button type="submit" class="btn-auth" :disabled="loading">
        {{ loading ? 'Registering...' : 'Register' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import { authStore } from '../store/auth';

const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isAdmin = ref(false);
const error = ref('');
const loading = ref(false);

const handleRegister = async () => {
  error.value = '';

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }

  loading.value = true;
  try {
    const res = await api.post('/users/register', {
      username: username.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
      isAdmin: isAdmin.value
    });
    authStore.setUser(res.data.data);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed (cannot reach the server)';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-container { max-width: 400px; margin: 3rem auto; padding: 2rem; border: 1px solid #ddd; border-radius: 8px; }
.auth-form { display: flex; flex-direction: column; gap: 1rem; }
.form-group { display: flex; flex-direction: column; }
.form-group input[type="text"], .form-group input[type="email"], .form-group input[type="password"] { padding: 8px; font-size: 1rem; border-radius: 4px; border: 1px solid #ccc; }
.checkbox-group { flex-direction: row; align-items: center; gap: 8px; }
.btn-auth { background: #42b983; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer; }
.btn-auth:disabled { opacity: 0.6; cursor: wait; }
.error { color: red; margin-bottom: 1rem; }
small.error { margin-bottom: 0; font-size: 0.8rem; }
</style>
