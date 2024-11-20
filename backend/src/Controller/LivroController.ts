import { Request, Response } from "express";
import Livro from "../models/livroModel";

class LivroController {
  async create(req: Request, res: Response) {
    const {
      title,
      author,
      published,
      genre,
      pages,
      publisher,
      language,
      copiesAvailable,
      price, // Adicionando campo para preço
      synopsis,
    } = req.body;

    try {
      const livro = await Livro.create({
        title,
        author,
        published,
        genre,
        pages,
        publisher,
        language,
        copiesAvailable,
        price, // Adicionando campo para preço
        synopsis,
        isDeleted: false,
        createdAt: new Date().toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      });
      return res.status(201).json(livro);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({
          error: "Falha ao criar livro",
          message: error.message,
        });
      }
      return res.status(500).json({
        error: "Erro desconhecido",
        message: "Algo deu errado, tente novamente.",
      });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const {
      title,
      author,
      published,
      genre,
      pages,
      publisher,
      language,
      copiesAvailable,
      price, // Adicionando campo para preço
      synopsis,
    } = req.body;

    try {
      const livroAtualizado = await Livro.findByIdAndUpdate(
        id,
        {
          title,
          author,
          published,
          genre,
          pages,
          publisher,
          language,
          copiesAvailable,
          price, // Adicionando campo para preço
          synopsis,
        },
        { new: true, runValidators: true }
      ).select("-isDeleted");

      if (!livroAtualizado) {
        return res.status(404).json({
          error: "Livro não encontrado",
          message: `Nenhum livro encontrado com o ID: ${id}`,
        });
      }

      return res.status(200).json(livroAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar livro:", error);
      if (error instanceof Error) {
        return res.status(500).json({
          error: "Algo deu errado, tente novamente.",
          message: error.message,
        });
      }
      return res.status(500).json({
        error: "Erro desconhecido",
        message: "Algo deu errado, tente novamente.",
      });
    }
  }

  async find(req: Request, res: Response) {
    try {
      const livros = await Livro.find().select(
        "_id title author published genre pages publisher language copiesAvailable price synopsis createdAt"
      );
      return res.status(200).json(livros);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: "Falha ao buscar livros",
          message: error.message,
        });
      }
      return res.status(500).json({
        error: "Erro desconhecido",
        message: "Algo deu errado, tente novamente.",
      });
    }
  }

  async getAllActive(req: Request, res: Response) {
    try {
      const livrosAtivos = await Livro.find({ isDeleted: false }).select(
        "_id title author published genre pages publisher language copiesAvailable price synopsis createdAt"
      );
      return res.status(200).json(livrosAtivos);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: "Falha ao buscar livros ativos",
          message: error.message,
        });
      }
      return res.status(500).json({
        error: "Erro desconhecido",
        message: "Algo deu errado, tente novamente.",
      });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const livro = await Livro.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
      ).select("-isDeleted");
      if (!livro) {
        return res.status(404).json({ error: "Livro não encontrado" });
      }
      return res.status(200).json(livro);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: "Falha ao atualizar status do livro",
          message: error.message,
        });
      }
      return res.status(500).json({
        error: "Erro desconhecido",
        message: "Algo deu errado, tente novamente.",
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const { year, author, genre, title } = req.query;

    let filters: any = { isDeleted: false };

    if (year && typeof year === "string") {
      filters.published = year;
    } else if (author && typeof author === "string") {
      filters.author = { $regex: new RegExp(author, "i") };
    } else if (genre && typeof genre === "string") {
      filters.genre = { $regex: new RegExp(genre, "i") };
    } else if (title && typeof title === "string") {
      filters.title = { $regex: new RegExp(title, "i") };
    }

    try {
      const livrosFiltrados = await Livro.find(filters).select(
        "_id title author published genre pages publisher language copiesAvailable price synopsis createdAt"
      );
      return res.status(200).json(livrosFiltrados);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: "Falha ao buscar livros",
          message: error.message,
        });
      }
      return res.status(500).json({
        error: "Erro desconhecido",
        message: "Algo deu errado, tente novamente.",
      });
    }
  }

  // Adicionando os Endpoints para Comprar e Alugar Livros
  async comprar(req: Request, res: Response) {
    try {
      const livro = await Livro.findById(req.params.id);
      if (!livro) {
        return res.status(404).send("Livro não encontrado");
      }
      if (livro.copiesAvailable > 0) {
        livro.copiesAvailable -= 1;
        await livro.save();
        res.send(livro);
      } else {
        res.status(400).send("Livro fora de stock");
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send("Erro desconhecido");
      }
    }
  }

  // Endpoint para alugar um livro
  async alugar(req: Request, res: Response) {
    try {
      const livro = await Livro.findById(req.params.id);
      if (!livro) {
        return res.status(404).send("Livro não encontrado");
      }
      if (livro.copiesAvailable > 0) {
        livro.copiesAvailable -= 1;
        await livro.save();
        res.send(livro);
      } else {
        res.status(400).send("Livro fora de stock");
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send("Erro desconhecido");
      }
    }
  }
}

export default new LivroController();
