<template>
  <div class="container">
    <input
      v-model="title"
      class="input-task"
      placeholder="Título do livro..."
    />
    <input
      v-model="author"
      class="input-task"
      placeholder="Autor do livro..."
      @input="validateAuthor"
    />
    <input
      v-model="published"
      type="date"
      class="input-task"
      placeholder="Data de publicação..."
    />
    <input
      v-model="genre"
      class="input-task"
      placeholder="Gênero do livro..."
    />
    <input
      v-model="pages"
      type="number"
      class="input-task"
      placeholder="Número de páginas..."
      @input="validatePages"
    />
    <input v-model="publisher" class="input-task" placeholder="Editora..." />
    <input
      v-model="language"
      class="input-task"
      placeholder="Idioma..."
      @input="validateLanguage"
    />
    <input
      v-model="copiesAvailable"
      type="number"
      class="input-task"
      placeholder="Cópias disponíveis..."
      @input="validateCopiesAvailable"
    />
    <input
      v-model="price"
      type="number"
      class="input-task"
      placeholder="Preço do livro..."
      @input="validatePrice"
    />
    <textarea
      v-model="synopsis"
      class="input-task"
      placeholder="Sinopse..."
      @input="validateSynopsis"
    ></textarea>
    <button class="button-add-task" @click="adicionarOuAtualizarLivro">
      <i class="fas fa-plus"></i>
      {{ livroParaEditar ? "Atualizar" : "Adicionar" }}
    </button>
  </div>
</template>

<script>
import { useLivroStore } from "../stores/livroStore";
import { useToast } from "vue-toastification";

export default {
  props: {
    livroParaEditar: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      title: "",
      author: "",
      published: "",
      genre: "",
      pages: "",
      publisher: "",
      language: "",
      copiesAvailable: "",
      price: "", // Adicionando campo para preço
      synopsis: "",
    };
  },
  watch: {
    livroParaEditar(newVal) {
      if (newVal) {
        this.preencherCamposParaEdicao(newVal);
      } else {
        this.limparCampos();
      }
    },
  },
  methods: {
    preencherCamposParaEdicao(livro) {
      this.title = livro.title || "";
      this.author = livro.author || "";
      this.published = livro.published ? livro.published.split("T")[0] : ""; // Formata a data corretamente
      this.genre = livro.genre || "";
      this.pages = livro.pages || "";
      this.publisher = livro.publisher || "";
      this.language = livro.language || "";
      this.copiesAvailable =
        livro.copiesAvailable !== undefined
          ? livro.copiesAvailable.toString()
          : ""; // Verifica se copiesAvailable está definido
      this.price = livro.price !== undefined ? livro.price.toString() : ""; // Adicionando campo para preço
      this.synopsis = livro.synopsis || "";
    },
    limparCampos() {
      this.title = "";
      this.author = "";
      this.published = "";
      this.genre = "";
      this.pages = "";
      this.publisher = "";
      this.language = "";
      this.copiesAvailable = "";
      this.price = ""; // Adicionando campo para preço
      this.synopsis = "";
      this.$emit("update:livroParaEditar", null);
    },
    validateAuthor() {
      const pattern = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/;
      if (!pattern.test(this.author)) {
        this.author = this.author.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, "");
        this.showToast(
          "O campo 'Autor' deve conter apenas caracteres alfabéticos e acentuações.",
          "error"
        );
      }
    },
    validatePages() {
      const pattern = /^[1-9]\d*$/;
      if (!pattern.test(this.pages.toString())) {
        this.pages = "";
        this.showToast(
          "O campo 'Páginas' deve conter apenas números positivos.",
          "error"
        );
      }
    },
    validateCopiesAvailable() {
      const pattern = /^[1-9]\d*$/;
      if (!pattern.test(this.copiesAvailable.toString())) {
        this.copiesAvailable = "";
        this.showToast(
          "O campo 'Cópias Disponíveis' deve conter apenas números positivos.",
          "error"
        );
      }
    },
    validateLanguage() {
      const pattern = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/;
      if (!pattern.test(this.language)) {
        this.language = this.language.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, "");
        this.showToast(
          "O campo 'Idioma' deve conter apenas caracteres alfabéticos e acentuações.",
          "error"
        );
      }
    },
    validatePrice() {
      const pattern = /^[1-9]\d*$/;
      if (!pattern.test(this.price.toString())) {
        this.price = "";
        this.showToast(
          "O campo 'Preço' deve conter apenas números positivos.",
          "error"
        );
      }
    },
    validateSynopsis() {
      if (this.synopsis.trim() === "") {
        this.showToast("O campo 'Sinopse' não pode estar vazio.", "error");
      }
    },
    async adicionarOuAtualizarLivro() {
      if (
        this.title.trim() === "" ||
        this.author.trim() === "" ||
        this.published === "" ||
        this.genre.trim() === "" ||
        this.pages === "" ||
        this.publisher.trim() === "" ||
        this.language.trim() === "" ||
        this.copiesAvailable === "" ||
        this.price === "" || // Adicionando validação do preço
        this.synopsis.trim() === ""
      ) {
        this.showToast("Todos os campos precisam ser preenchidos!", "error");
        return;
      }

      const store = useLivroStore();
      const livro = {
        title: this.title,
        author: this.author,
        published: this.published,
        genre: this.genre,
        pages: parseInt(this.pages),
        publisher: this.publisher,
        language: this.language,
        copiesAvailable: parseInt(this.copiesAvailable),
        price: parseInt(this.price), // Adicionando campo para preço
        synopsis: this.synopsis,
      };

      try {
        if (this.livroParaEditar) {
          await store.updateLivro(this.livroParaEditar._id, livro);
          this.showToast("Livro atualizado com sucesso!", "success");
        } else {
          await store.addLivro(livro);
          this.showToast("Livro adicionado com sucesso!", "success");
        }
      } catch (error) {
        if (error.message.includes("Network Error")) {
          this.showToast(
            "Erro de conexão. Verifique se o servidor está em execução.",
            "error"
          );
        } else {
          this.showToast("Erro ao registrar livro. Tente novamente.", "error");
        }
      }

      this.limparCampos();
    },
    async deletarLivro() {
      if (!this.livroParaEditar) return;

      const store = useLivroStore();

      try {
        await store.deleteLivro(this.livroParaEditar._id);
        this.showToast("Livro deletado com sucesso!", "success");
        this.limparCampos();
      } catch (error) {
        this.showToast("Erro ao deletar livro. Tente novamente.", "error");
      }
    },
    showToast(message, type) {
      const toast = useToast();
      toast(message, { type: type });
    },
  },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");
.container {
  background-color: #d1d1d1;
  width: 80%;
  max-width: 600px;
  border-radius: 10px;
  padding: 20px;
  margin: 100px auto 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 25px;
}

.input-task {
  border: none;
  border-radius: 5px;
  height: 30px;
  padding-left: 10px;
  width: 100%;
}

textarea.input-task {
  height: 100px;
}

.button-add-task {
  border: none;
  border-radius: 5px;
  height: 30px;
  background-color: #28a745;
  color: #ffffff;
  font-size: 17px;
  padding: 0 15px;
  cursor: pointer;
  font-weight: 600;
  grid-column: span 2;
  justify-self: center;
  display: inline-flex;
  align-items: center;
}

.button-add-task i {
  margin-right: 5px;
}

.button-add-task:hover {
  opacity: 0.8;
}

.button-add-task:active {
  opacity: 0.6;
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr; /* Alterar para uma coluna em dispositivos menores */
    grid-gap: 15px;
  }

  .input-task,
  .textarea.input-task,
  .button-add-task {
    grid-column: span 1; /* Fazer com que cada elemento ocupe uma linha inteira */
  }

  .button-add-task {
    width: 100%; /* Fazer o botão ocupar toda a largura */
    font-size: 15px;
  }

  .input-task {
    height: 25px; /* Ajustar a altura do input */
    font-size: 14px; /* Ajustar o tamanho da fonte */
  }

  textarea.input-task {
    height: 80px; /* Ajustar a altura da textarea */
  }
}

@media (max-width: 480px) {
  .container {
    padding: 15px;
  }

  .button-add-task {
    font-size: 14px;
    padding: 0 10px;
  }

  .input-task {
    height: 20px;
    font-size: 13px;
  }

  textarea.input-task {
    height: 70px;
  }
}
</style>
