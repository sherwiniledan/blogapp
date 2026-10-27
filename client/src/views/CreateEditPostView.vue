<template>
  <div class="container">
    <h1>{{ isEdit ? 'Edit Post' : 'Create New Post' }}</h1>
    <p v-if="error" class="error">{{ error }}</p>
    <form @submit.prevent="handleSubmit" class="post-form">
      <div class="form-group">
        <label>Title</label>
        <input v-model="title" type="text" required placeholder="Enter post title" />
      </div>
      <div class="form-group">
        <label>Content</label>
        <textarea v-model="content" rows="8" required placeholder="Write post content here..."></textarea>
      </div>
      <button type="submit" class="btn-submit">{{ isEdit ? 'Update Post' : 'Publish Post' }}</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';

const route = useRoute();
const router = useRouter();

const isEdit = ref(Boolean(route.params.id));
const title = ref('');
const content = ref('');
const error = ref('');

onMounted(async () => {
  if (isEdit.value) {
    try {
      const res = await api.get(`/posts/${route.params.id}`);
      title.value = res.data.data.title;
      content.value = res.data.data.content;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load post data';
    }
  }
});

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await api.put(`/posts/${route.params.id}`, { title: title.value, content: content.value });
    } else {
      await api.post('/posts', { title: title.value, content: content.value });
    }
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.message || 'Operation failed';
  }
};
</script>

<style scoped>
.container { max-width: 600px; margin: 2rem auto; padding: 0 1rem; }
.post-form { display: flex; flex-direction: column; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.3rem; }
.form-group input, .form-group textarea { padding: 10px; border-radius: 4px; border: 1px solid #ccc; font-size: 1rem; }
.btn-submit { background: #42b983; color: white; border: none; padding: 10px; border-radius: 4px; font-size: 1rem; cursor: pointer; }
.error { color: red; }
</style>