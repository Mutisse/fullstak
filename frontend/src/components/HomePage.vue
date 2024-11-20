<template>
  <div>
    <h1>Livros Disponíveis</h1>
    <input
      v-model="searchQuery"
      placeholder="Pesquisar por título, autor ou preço..."
    />
    <div v-for="book in filteredBooks" :key="book.id" class="book-item">
      <h2>{{ book.title }}</h2>
      <p>Autor: {{ book.author }}</p>
      <p>Preço: {{ book.price }}</p>
      <router-link :to="{ name: 'BookDetailsPage', params: { id: book.id } }"
        >Ver Detalhes</router-link
      >
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useBookStore } from "@/stores/bookStore";

export default {
  name: "HomePage",
  setup() {
    const searchQuery = ref("");
    const bookStore = useBookStore();

    const filteredBooks = computed(() => {
      return bookStore.books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          book.price
            .toString()
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase())
      );
    });

    return { searchQuery, filteredBooks };
  },
};
</script>

<style scoped>
.book-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
