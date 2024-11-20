import { defineStore } from "pinia";
import http from "../http";

export const useLivroStore = defineStore("livroStore", {
  state: () => ({
    livros: [],
    editIndex: null,
  }),
  actions: {
    async fetchLivros() {
      try {
        const response = await http.get("/livros/ativos");
        console.log("Dados recebidos do servidor (fetchLivros):", response.data);
        this.livros = response.data;
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
      }
    },

    async addLivro(livro) {
      try {
        const response = await http.post("/livros", livro);
        console.log("Livro adicionado (addLivro):", response.data);
        this.livros.push(response.data);
      } catch (error) {
        console.error("Erro ao adicionar livro:", error);
      }
    },

    async updateLivro(id, livro) {
      try {
        const index = this.livros.findIndex((l) => l._id === id);
        if (index === -1) {
          throw new Error("Livro não encontrado");
        }
        const response = await http.put(`/livros/${id}`, livro);
        console.log("Livro atualizado (updateLivro):", response.data);
        this.livros[index] = response.data;
      } catch (error) {
        console.error("Erro ao atualizar livro:", error);
      }
    },

    async deleteLivro(id) {
      try {
        const index = this.livros.findIndex((l) => l._id === id);
        if (index === -1) {
          throw new Error("Livro não encontrado");
        }
        await http.patch(`/livros/${id}`, { isDeleted: true });
        this.livros.splice(index, 1);
        console.log("Livro removido (deleteLivro):", id);
      } catch (error) {
        console.error("Erro ao deletar livro:", error);
      }
    },

    async buyBook(id) {
      const index = this.livros.findIndex((l) => l._id === id);
      if (index !== -1 && this.livros[index].copiesAvailable > 0) {
        try {
          const response = await http.put(`/api/comprar/${id}`);
          this.livros[index] = response.data;
          console.log(`Livro comprado: ${response.data}`);
        } catch (error) {
          console.error("Erro ao comprar livro:", error);
        }
      } else {
        console.error("Livro fora de stock ou não encontrado");
      }
    },

    async rentBook(id) {
      const index = this.livros.findIndex((l) => l._id === id);
      if (index !== -1 && this.livros[index].copiesAvailable > 0) {
        try {
          const response = await http.put(`/api/alugar/${id}`);
          this.livros[index] = response.data;
          console.log(`Livro alugado: ${response.data}`);
        } catch (error) {
          console.error("Erro ao alugar livro:", error);
        }
      } else {
        console.error("Livro fora de stock ou não encontrado");
      }
    },
  },
});
