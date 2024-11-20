<template>
    <div>
      <nav class="navbar">
        <router-link to="/" class="nav-link">
          <i class="fas fa-home"></i> Início
        </router-link>
        <router-link to="/books" class="nav-link">
          <i class="fas fa-book"></i> Livros
        </router-link>
      </nav>
    </div>
  </template>
  
  <style>
  /* Estilo da barra de navegação */
  .navbar {
    font-family: "Arial", sans-serif;
    font-size: clamp(16px, 1.5vw, 22px); /* Fonte responsiva */
    display: flex; /* Flex container para alinhar os itens */
    justify-content: space-around; /* Espaça os links uniformemente */
    align-items: center; /* Alinha verticalmente */
    padding: 5px 10px; /* Espaçamento interno */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra para destaque */
  }
  
  /* Estilo dos links */
  .nav-link {
    font-size: 1em;
    font-weight: bold;
    color: #333; /* Cor do texto */
    text-decoration: none;
    padding: 10px 5px; /* Espaçamento interno */
    border-radius: 5px; /* Borda arredondada */
    transition: background-color 0.3s, color 0.3s; /* Animação suave */
    display: flex; /* Para alinhar o ícone e o texto */
    align-items: center;
    gap: 8px; /* Espaço entre o ícone e o texto */
  }
  
  .nav-link:hover {
    background-color: #ddd; /* Fundo claro no hover */
    color: #000; /* Cor do texto no hover */
  }
  
  /* Ícones */
  .nav-link i {
    font-size: 1.2em; /* Tamanho do ícone */
    margin-right: 5px; /* Espaço entre o ícone e o texto */
  }
  
  /* Responsividade */
  @media (max-width: 600px) {
    .navbar {
      flex-direction: column; /* Links empilhados em telas menores */
      padding: 10px 20px; /* Ajusta o espaçamento interno */
    }
  
    .nav-link {
      justify-content: center; /* Centraliza os itens */
      width: 100%; /* Links ocupam a largura total */
      text-align: center; /* Centraliza o texto */
    }
  }
  </style>
  