import mongoose from "mongoose";

const livroSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  published: {
    type: Date,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  pages: {
    type: Number,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: function () {
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      };
      return new Date().toLocaleDateString("pt-BR", options);
    },
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  language: {
    type: String,
    required: true,
  },
  copiesAvailable: {
    type: Number,
    required: true,
  },
  price: {
    type: Number, // Adicionando campo para preço
    required: true,
  },
  synopsis: {
    type: String,
    required: true,
  },
});

// Middleware de pré-validação para gerar o código de livro
livroSchema.pre("validate", async function (next) {
  if (this.isNew && !this._id) {
    let uniqueCodeFound = false;
    while (!uniqueCodeFound) {
      const randomCode = Math.floor(1000 + Math.random() * 9000); // Gera um número de 4 dígitos
      const livroId = `L${randomCode}`;

      // Verifica se o código já existe
      const existingLivro = await mongoose
        .model("livros")
        .findOne({ _id: livroId });
      if (!existingLivro) {
        this._id = livroId;
        uniqueCodeFound = true;
      }
    }
  }
  next();
});

// Middleware para logging de dados
livroSchema.post("save", function (doc) {
  console.log("Livro salvo com sucesso:", doc);
});

livroSchema.post("find", function (docs) {
  console.log("Livros encontrados:", docs);
});

export default mongoose.model("livros", livroSchema);
