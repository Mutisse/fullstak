import cron from "node-cron";
import Livro from "../models/livroModel";

// Função para deletar livros marcados como isDeleted
const deleteMarkedBooks = async () => {
  try {
    const result = await Livro.deleteMany({ isDeleted: true });
    console.log(`${result.deletedCount} livros deletados.`);
  } catch (error) {
    console.error("Erro ao deletar livros marcados como deletados:", error);
  }
};

// Agendar a tarefa para executar a cada 3 meses
cron.schedule('0 0 1 */3 *', () => {
  console.log('Iniciando a tarefa de deletar livros marcados como deletados...');
  deleteMarkedBooks();
});
