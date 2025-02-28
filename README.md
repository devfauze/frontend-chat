# Frontend - Chat ao Vivo

Este é o frontend do sistema de chat ao vivo, desenvolvido com **Next.js**. Ele se comunica com o backend para fornecer uma experiência de chat interativa em tempo real, com suporte a múltiplas salas e funcionalidades de mensagens.

## Funcionalidades

- Chat em tempo real com WebSocket.
- Suporte a múltiplas salas de chat.
- Design responsivo e otimizado para dispositivos móveis.
- Histórico de conversas com paginação.
- Prevenção contra ataques XSS.
- Indicadores de digitação em tempo real.

## Tecnologias

- **Next.js**: Framework React para SSR (Server-Side Rendering) e SSG (Static Site Generation).
- **WebSocket**: Comunicação em tempo real com o backend.
- **Tailwind CSS**: Framework CSS para design responsivo.
- **Axios**: Biblioteca para fazer requisições HTTP.
- **TypeScript**: Superset do JavaScript com tipagem estática.
  
## Instruções de Instalação e Execução

### Pré-requisitos

- **Node.js** (versão 14.x ou superior)
- **npm** (gerenciador de pacotes)

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/devfauze/frontend-chat.git
   cd frontend-chat
   npm run setup
