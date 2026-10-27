import { reactive } from 'vue';

const storedUser = JSON.parse(localStorage.getItem('user'));

export const authStore = reactive({
  user: storedUser || null,
  setUser(userData) {
    this.user = userData;
    localStorage.setItem('user', JSON.stringify(userData));
  },
  logout() {
    this.user = null;
    localStorage.removeItem('user');
  }
});