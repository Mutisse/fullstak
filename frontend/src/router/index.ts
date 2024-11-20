import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import BookDetailsPage from '../components/BookDetailsPage.vue';

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/books', name: 'BookDetailsPage', component: BookDetailsPage}
];

const router = createRouter({
  history: createWebHistory(), // Sem process.env.BASE_URL
  routes,
});

export default router;
