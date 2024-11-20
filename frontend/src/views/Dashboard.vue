<template>
  <div>
    <navbar />
    <BookForm
      :livroParaEditar="livroParaEditar"
      @update:livroParaEditar="atualizarLivro"
    />
    <BookList @editar-livro="livroSelecionadoParaEdicao" />
  </div>
</template>

<script>
import navbar from "@/components/navbar.vue";
import BookList from "../components/BookList.vue";
import BookForm from "../components/BookForm.vue";

export default {
  components: {
    navbar,
    BookList,
    BookForm,
  },
  data() {
    return {
      livroParaEditar: null,
    };
  },
  methods: {
    livroSelecionadoParaEdicao(livro) {
      this.livroParaEditar = livro;
    },
    atualizarLivro() {
      this.livroParaEditar = null;
    },
  },
};
</script>
