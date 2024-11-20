<template>
  <div>
    <navbar/>
     
    <input
      v-model="searchQuery"
      class="search-input"
      placeholder="Pesquisar por título, autor ou preço..."
    />
    <div class="book-list">
      <div v-for="book in filteredBooks" :key="book._id" class="book-item">
        <h2 class="book-title">{{ book.title }}</h2>
        <p class="book-author"><strong>Autor:</strong> {{ book.author }}</p>
        <p class="book-published">
          <strong>Publicado em:</strong>
          {{ new Date(book.published).toLocaleDateString() }}
        </p>
        <p class="book-genre"><strong>Gênero:</strong> {{ book.genre }}</p>
        <p class="book-pages"><strong>Páginas:</strong> {{ book.pages }}</p>
        <p class="book-publisher">
          <strong>Editora:</strong> {{ book.publisher }}
        </p>
        <p class="book-language">
          <strong>Idioma:</strong> {{ book.language }}
        </p>
        <p class="book-copies-available">
          <strong>Disponibilidade:</strong>
          {{
            book.copiesAvailable > 0
              ? `Em Stock (${book.copiesAvailable} cópias disponíveis)`
              : "Fora de Stock"
          }}
        </p>
        <p class="book-price"><strong>Preço:</strong> {{ book.price }}</p>
        <p class="book-description">
          <strong>Descrição:</strong> {{ book.synopsis }}
        </p>
        <p class="book-rental-rate">
          <strong>Taxa de Aluguer:</strong>
          {{ calculateRentalRate(book.price) }}
        </p>
        <button
          class="action-button"
          @click="buyBook(book)"
          :disabled="book.copiesAvailable === 0"
        >
          <i class="fas fa-shopping-cart"></i> Comprar
        </button>
        <button
          class="action-button"
          @click="rentBook(book)"
          :disabled="book.copiesAvailable === 0"
        >
          <i class="fas fa-handshake"></i> Alugar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import navbar from "@/components/navbar.vue";
import { useLivroStore } from "@/stores/livroStore";
import { useToast } from "vue-toastification";

export default {
  name: "HomePage",
  components: {
    navbar
    
  },
  setup() {
    const searchQuery = ref("");
    const livroStore = useLivroStore();
    const toast = useToast();

    const calculateRentalRate = (price) => {
      return (price * 0.1).toFixed(2); // Calcula 10% do preço do livro
    };

    const filteredBooks = computed(() => {
      return livroStore.livros.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          book.synopsis
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase()) ||
          book.price
            .toString()
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase())
      );
    });

    const buyBook = async (book) => {
      if (book.copiesAvailable > 0) {
        await livroStore.buyBook(book._id);
        toast.success(`Você comprou o livro: ${book.title}`);
      } else {
        toast.error("Livro fora de stock");
      }
    };

    const rentBook = async (book) => {
      if (book.copiesAvailable > 0) {
        await livroStore.rentBook(book._id);
        toast.success(`Você alugou o livro: ${book.title}`);
      } else {
        toast.error("Livro fora de stock");
      }
    };

    onMounted(() => {
      livroStore.fetchLivros();
    });

    return {
      searchQuery,
      filteredBooks,
      buyBook,
      rentBook,
      calculateRentalRate,
    };
  },
};
</script>

<style scoped>
/* Estilo para .book-list */
.book-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

/* Estilo para cada .book-item */
.book-item {
  background-color: #d1d1d1;
  box-shadow: 1px 4px 10px rgba(0, 0, 0, 0.2);
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  cursor: pointer;
  max-width: 300px; /* Limita o tamanho para dispositivos menores */
  width: 100%; /* Preenche o espaço disponível */
}

/* Estilo para o título */
.book-title {
  font-size: 1.5em;
  margin-bottom: 10px;
}

/* Outros estilos para atributos do livro */
.book-author,
.book-published,
.book-genre,
.book-pages,
.book-publisher,
.book-language,
.book-copies-available,
.book-price,
.book-description,
.book-rental-rate {
  margin: 5px 0;
}

/* Botão de ação */
.action-button {
  display: flex;
  align-items: center;
  margin-right: 10px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button i {
  margin-right: 5px;
}

.action-button:hover {
  background-color: #0056b3;
}

.action-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Notificação */
.notification {
  background-color: #e7f5ff;
  border: 1px solid #b3d7ff;
  padding: 10px;
  border-radius: 5px;
  margin-top: 20px;
  text-align: center;
}

/* Barra de pesquisa */
.search-input {
  width: 50%;
  max-width: 600px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

/* Responsividade */
@media (max-width: 768px) {
  .book-item {
    max-width: 90%; /* Alarga em dispositivos menores */
  }

  .search-input {
    width: 80%; /* Ajusta o tamanho da barra de pesquisa */
  }

  .action-button {
    padding: 8px 10px; /* Reduz o padding */
    font-size: 0.9em; /* Tamanho menor para botões */
  }
}

@media (max-width: 480px) {
  .book-title {
    font-size: 1.2em; /* Ajusta o tamanho do título */
  }

  .action-button {
    font-size: 0.8em; /* Botões ainda menores */
  }

  .search-input {
    width: 100%; /* Barra de pesquisa ocupa toda a largura */
  }
}
</style>
