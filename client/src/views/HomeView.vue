<template>
  <div class="container">
    <h1>All Blog Posts</h1>
    <div v-if="loading" class="info">Loading posts...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="posts.length === 0" class="info">No posts available yet.</div>
    <div v-else class="post-list">
      <div v-for="post in posts" :key="post._id" class="post-card">
        <h2>{{ post.title }}</h2>
        <p class="meta">By <strong>{{ post.authorUsername }}</strong> on {{ new Date(post.createdAt).toLocaleDateString() }}</p>
        <p class="snippet">{{ post.content.substring(0, 150) }}...</p>
        <router-link :to="`/posts/${post._id}`" class="btn-read">Read More</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const posts = ref([]);
const loading = ref(true);
const error = ref('');

const fetchPosts = async () => {
  try {
    const res = await api.get('/posts');
    posts.value = res.data.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load posts';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchPosts);
</script>

<style scoped>
.container { max-width: 900px; margin: 2rem auto; padding: 0 1rem; }
.post-list { display: flex; flex-direction: column; gap: 1.5rem; }
.post-card { background: #f8f9fa; border: 1px solid #e9ecef; padding: 1.5rem; border-radius: 8px; }
.meta { color: #6c757d; font-size: 0.85rem; margin-bottom: 0.5rem; }
.snippet { margin-bottom: 1rem; line-height: 1.5; }
.btn-read { display: inline-block; background: #42b983; color: white; padding: 6px 14px; text-decoration: none; border-radius: 4px; }
.error { color: red; }
</style>