<template>
  <div class="container">
    <div v-if="loading" class="info">Loading post details...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="post" class="post-detail">
      <h1>{{ post.title }}</h1>
      <p class="meta">Written by <strong>{{ post.authorUsername }}</strong> on {{ new Date(post.createdAt).toLocaleString() }}</p>
      
      <div class="actions" v-if="canEdit || canDelete">
        <router-link v-if="canEdit" :to="`/edit/${post._id}`" class="btn-edit">Edit Post</router-link>
        <button v-if="canDelete" @click="handleDelete" class="btn-delete">Delete Post</button>
      </div>

      <div class="content">{{ post.content }}</div>

      <hr />

      <section class="comments-section">
        <h3>Comments ({{ post.comments ? post.comments.length : 0 }})</h3>

        <div v-if="authStore.user" class="comment-form">
          <textarea v-model="newComment" placeholder="Write a comment..." rows="3"></textarea>
          <button @click="submitComment" :disabled="!newComment.trim()">Add Comment</button>
        </div>
        <p v-else class="login-prompt">Please <router-link to="/login">login</router-link> to add a comment.</p>

        <div class="comments-list">
          <div v-for="c in post.comments" :key="c._id" class="comment-item">
            <strong>{{ c.username }}</strong>
            <span class="comment-date">{{ new Date(c.createdAt).toLocaleDateString() }}</span>
            <p>{{ c.content }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';
import { authStore } from '../store/auth';

const route = useRoute();
const router = useRouter();

const post = ref(null);
const loading = ref(true);
const error = ref('');
const newComment = ref('');

const canEdit = computed(() => {
  return authStore.user && post.value && post.value.author === authStore.user._id;
});

const canDelete = computed(() => {
  if (!authStore.user || !post.value) return false;
  return post.value.author === authStore.user._id || authStore.user.isAdmin;
});

const fetchPost = async () => {
  try {
    const res = await api.get(`/posts/${route.params.id}`);
    post.value = res.data.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to fetch post';
  } finally {
    loading.value = false;
  }
};

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this post?')) return;
  try {
    await api.delete(`/posts/${post.value._id}`);
    alert('Post deleted');
    router.push('/');
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to delete post');
  }
};

const submitComment = async () => {
  try {
    const res = await api.post(`/posts/${post.value._id}/comments`, { content: newComment.value });
    post.value = res.data.data;
    newComment.value = '';
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to submit comment');
  }
};

onMounted(fetchPost);
</script>

<style scoped>
.container { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
.meta { color: #7f8c8d; font-size: 0.9rem; }
.actions { margin: 1rem 0; display: flex; gap: 10px; }
.btn-edit { background: #3498db; color: white; padding: 6px 12px; text-decoration: none; border-radius: 4px; }
.btn-delete { background: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
.content { font-size: 1.1rem; line-height: 1.6; margin: 1.5rem 0; white-space: pre-wrap; }
.comments-section { margin-top: 2rem; }
.comment-form textarea { width: 100%; margin-bottom: 8px; padding: 8px; border-radius: 4px; border: 1px solid #ccc; }
.comment-form button { background: #42b983; color: white; border: none; padding: 6px 16px; border-radius: 4px; cursor: pointer; }
.comment-item { background: #f1f2f6; padding: 10px 14px; border-radius: 6px; margin-top: 10px; }
.comment-date { font-size: 0.75rem; color: #95a5a6; margin-left: 10px; }
.error { color: red; }
</style>