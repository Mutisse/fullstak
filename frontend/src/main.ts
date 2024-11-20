import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import { createPinia } from 'pinia';
import Toast, { PluginOptions } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);
const pinia = createPinia();

const options: PluginOptions = {
  // Aqui você pode definir suas opções padrão
};

app.use(pinia);
app.use(router);
app.use(Toast, options);

app.mount('#app');