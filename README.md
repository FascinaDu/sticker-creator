# 🔄 WhatsApp Sticker Sender

> Site para upload de imagens e envio automático de figurinhas via WhatsApp

## 📖 Índice

- [📌 Sobre o Projeto](#sobre-o-projeto)
- [🚀 Tecnologias Utilizadas](#tecnologias-utilizadas)
- [📦 Instalação](#instalação)
- [🎮 Como Usar](#como-usar)
- [⚠️ Considerações Importantes](#considerações-importantes)
- [🔍 FAQ](#faq)
- [📜 Licença](#licença)

## Sobre o Projeto

O **WhatsApp Sticker Sender** é uma aplicação web que permite fazer upload de imagens, convertê-las automaticamente para o formato de figurinha do WhatsApp e enviá-las para contatos individuais ou grupos. A aplicação utiliza a biblioteca não-oficial `whatsapp-web.js` para interagir com o WhatsApp, oferecendo uma interface simples e intuitiva para o usuário.

## Tecnologias Utilizadas

O projeto foi desenvolvido com as seguintes tecnologias:

- 🟧 **HTML, CSS** - Frontend
- 🟨 **JavaScript** - Frontend e Backend
- 🟩 **Node.js** - Runtime de JavaScript
- 📦 **Express** - Framework web
- 🖼️ **Sharp** - Processamento de imagens
- 📱 **whatsapp-web.js** - API não oficial do WhatsApp
- 🔄 **Multer** - Upload de arquivos

## Instalação

Para instalar e executar o projeto, siga os passos abaixo:

```bash
# Clone este repositório
git clone https://github.com/seu-usuario/whatsapp-sticker-sender.git

# Acesse a pasta do projeto
cd whatsapp-sticker-sender

# Instale as dependências
npm install

# Crie a pasta uploads (opcional, será criada automaticamente se não existir)
mkdir uploads

# Inicie o servidor
npm run dev
```

## Como Usar

1. **Inicie o servidor**:
   ```bash
   npm run dev
   ```

2. **Escaneie o QR Code**:
   - Após iniciar o servidor, um QR code será exibido no terminal
   - Abra o WhatsApp no seu celular
   - Acesse Configurações > Aparelhos Conectados > Conectar um aparelho
   - Escaneie o QR code exibido no terminal

3. **Acesse a aplicação**:
   - Abra o navegador e acesse `http://localhost:3000`
   - Verifique se o status de conexão está "Conectado"

4. **Envie figurinhas**:
   - Selecione uma imagem no seu computador
   - Escolha se deseja enviar para um contato individual ou grupo
   - Para contatos individuais: Digite o número de telefone completo com código do país (ex: 5511999999999)
   - Para grupos: Digite o ID do grupo ou use o número mostrado na aplicação após conectar
   - Clique em "Enviar Figurinha"

## Estrutura do Projeto

```
whatsapp-sticker-sender/
├── public/               # Arquivos estáticos
│   └── index.html        # Interface do usuário
├── uploads/              # Pasta para armazenar arquivos temporários
├── server.js             # Código principal do servidor
└── package.json          # Configurações e dependências do projeto
```

## Considerações Importantes

- **Uso da biblioteca não-oficial**: O uso da biblioteca `whatsapp-web.js` pode violar os termos de serviço do WhatsApp, use por sua conta e risco
- **Armazenamento de sessão**: A implementação básica não salva a sessão, então será necessário escanear o QR code sempre que iniciar o servidor
- **Uso em produção**: Para uso em produção, considere implementar armazenamento de sessão com o módulo `wwebjs-mongo`
- **Recursos do sistema**: A aplicação utiliza o Puppeteer para automatizar um navegador, o que pode consumir recursos consideráveis

## 🔍 FAQ

### As sessões são salvas?
Na implementação básica, não. Você precisará escanear o QR code cada vez que reiniciar o servidor.

### Posso enviar para múltiplos contatos?
A implementação atual suporta envio para um contato ou grupo por vez.

### O WhatsApp pode bloquear minha conta?
Sim, o uso excessivo de automação pode resultar em bloqueio temporário ou permanente da sua conta. Use com moderação.

### Como enviar para grupos?
Para grupos, você precisa do ID do grupo, que geralmente termina com `@g.us`. Você pode ver os IDs dos grupos disponíveis no console após conectar.

## 📜 Licença

Este projeto está sob a licença MIT.
