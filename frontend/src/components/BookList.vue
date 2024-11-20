<template>
  <div class="container">
    <input
      v-model="searchQuery"
      @input="filterLivros"
      class="search-input"
      placeholder="Pesquisar por título, autor ou preço..."
    />
    <div class="list-tasks">
      <template v-if="isMobile">
        <div
          v-for="(item, index) in filteredLivros"
          :key="item._id"
          :class="{ done: item.isDeleted, task: true }"
        >
          <div class="content">
            <p><strong>Título:</strong> {{ item.title }}</p>
            <p><strong>Autor:</strong> {{ item.author }}</p>
            <p><strong>Gênero:</strong> {{ item.genre }}</p>
            <p><strong>Editora:</strong> {{ item.publisher }}</p>
            <p><strong>Idioma:</strong> {{ item.language }}</p>
            <p><strong>Preço:</strong> {{ item.price }}</p>
            <p>
              <strong>Data de Publicação:</strong>
              {{ formatDate(item.published) }}
            </p>
          </div>
          <div class="actions">
            <button
              @click="editarLivro(item)"
              class="action-button"
              :class="{ updating: isEditing === item._id }"
            >
              <i class="fas fa-edit"></i> Editar
            </button>
            <button
              @click="removerLivro(item._id)"
              class="action-button remove-button"
              :disabled="isEditing === item._id"
            >
              <i class="fas fa-trash-alt"></i> Remover
            </button>
          </div>
        </div>
      </template>
      <template v-else>
        <table class="table-tasks">
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Gênero</th>
              <th>Editora</th>
              <th>Idioma</th>
              <th>Preço</th>
              <th>Data de Publicação</th>
              <th class="acoes-coluna">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in filteredLivros"
              :key="item._id"
              :class="{ done: item.isDeleted }"
            >
              <td>{{ item.title }}</td>
              <td>{{ item.author }}</td>
              <td>{{ item.genre }}</td>
              <td>{{ item.publisher }}</td>
              <td>{{ item.language }}</td>
              <td>{{ item.price }}</td>
              <td class="date">{{ formatDate(item.published) }}</td>
              <td class="acoes-coluna">
                <button
                  @click="editarLivro(item)"
                  class="action-button"
                  :class="{ updating: isEditing === item._id }"
                >
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button
                  @click="removerLivro(item._id)"
                  class="action-button remove-button"
                  :disabled="isEditing === item._id"
                >
                  <i class="fas fa-trash-alt"></i> Remover
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </div>
  </div>
</template>

<script>
import { useLivroStore } from "@/stores/livroStore";
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      searchQuery: "",
      filteredLivros: [],
      isEditing: null,
      isMobile: false,
    };
  },
  computed: {
    livros() {
      const store = useLivroStore();
      return store.livros;
    },
  },
  methods: {
    editarLivro(livro) {
      console.log("Dados recebidos no editarLivro:", livro); // Log para depuração
      const livroCompleto = {
        ...livro,
        copiesAvailable: livro.copiesAvailable || 0, // Valor padrão se estiver ausente
        author: livro.author || "", // Valor padrão se estiver ausente
      };
      console.log("Dados enviados para o formulário:", livroCompleto); // Log para depuração
      this.$emit("editar-livro", livroCompleto);
    },
    async removerLivro(id) {
      const store = useLivroStore();
      await store.deleteLivro(id);
      this.showToast("Livro removido com sucesso!", "success");
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("pt-BR", options);
    },
    showToast(message, type) {
      const toast = useToast();
      toast(message, {
        type: type,
      });
    },
    filterLivros() {
      const query = this.searchQuery.toLowerCase();
      this.filteredLivros = this.livros.filter(
        (livro) =>
          livro.title.toLowerCase().includes(query) ||
          livro.author.toLowerCase().includes(query) ||
          livro.genre.toLowerCase().includes(query) ||
          livro.publisher.toLowerCase().includes(query) ||
          livro.language.toLowerCase().includes(query) ||
          livro.price.toString().toLowerCase().includes(query)
      );
    },
    checkIsMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
  },
  mounted() {
    const store = useLivroStore();
    store.fetchLivros().then(() => {
      this.filteredLivros = this.livros;
    });
    this.checkIsMobile();
    window.addEventListener("resize", this.checkIsMobile);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkIsMobile);
  },
  watch: {
    livros(newLivros) {
      this.filterLivros();
    },
  },
};
</script>



<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");

.container {
  background-color: #d1d1d1;
  width: 80%;
  max-width: 1200px;
  border-radius: 10px;
  padding: 20px;
  margin: 100px auto 0;
}

.search-input {
  width: 100%;
  max-width: 600px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.table-tasks {
  width: 100%;
  border-collapse: collapse;
  margin-top: 30px;
  table-layout: fixed;
}

.table-tasks th,
.table-tasks td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
  word-wrap: break-word;
}

.table-tasks th {
  background-color: #f4f4f4;
}

.table-tasks tr.done {
  background-color: #8fac55;
  text-decoration: line-through;
}

.acoes-coluna {
  width: 180px;
}

.list-tasks {
  margin-top: 30px;
}

.task {
  background-color: #f2f2f2;
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
}

.task .content {
  margin-bottom: 10px;
}

.task .actions {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

img {
  width: 25px;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.task:hover img {
  opacity: 1;
}

.done {
  background-color: #8fac55;
  text-decoration: line-through;
}

.action-button {
  display: inline-flex;
  align-items: center;
  background-color: #007bff;
  color: white;
  border: none;
  gap:5px;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  margin-right: 5px;
  font-size: 14px;
}

.action-button i {
  margin-right: 5px;
}

.action-button.updating {
  background-color: #28a745;
}

.action-button.remove-button {
  background-color: #dc3545;
}

.action-button.remove-button i {
  margin-right: 5px;
}

.action-button:disabled {
  background-color: #dcdcdc;
  cursor: not-allowed;
}

.action-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.action-button.updating:hover:not(:disabled) {
  background-color: #218838;
}

.action-button.remove-button:hover:not(:disabled) {
  background-color: #c82333;
}

.date {
  font-size: 0.8em;
  color: #888;
}

@media (max-width: 768px) {
  .container {
    width: 100%;
    padding: 15px;
  }

  .search-input {
    width: 100%;
  }

  .table-tasks {
    display: none; /* Esconder a tabela em dispositivos menores */
  }

  .task {
    padding: 15px;
    flex-direction: column;
  }

  .task .actions {
    flex-direction: column; /* Ações em coluna */
    align-items: flex-start;
  }

  .action-button,
  .action-button.remove-button {
    width: 100%; /* Botões ocupam toda a largura */
    margin-bottom: 10px;
    font-size: 16px;
    padding: 10px;
  }

  .task .content p {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 10px;
  }

  .action-button,
  .action-button.remove-button {
    font-size: 14px;
    padding: 8px;
  }

  .task .content p {
    font-size: 12px;
  }
}
</style>
