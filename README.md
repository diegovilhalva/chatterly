# 💬 Chatterly

Um moderno **chat em tempo real** construído com a stack **MERN** (MongoDB, Express, React e Node.js), com design elegante, desempenho otimizado e diversas funcionalidades inspiradas em aplicativos de mensagens como **WhatsApp e Telegram**.

🔗 **Versão em produção:** [https://chatterly-jpyp1.sevalla.app/](https://chatterly-jpyp1.sevalla.app/)

---

## 🚀 Tecnologias e Stack

- **Frontend:** React + Vite + TailwindCSS + DaisyUI  
- **Backend:** Node.js + Express + MongoDB (Mongoose)  
- **Tempo real:** Socket.IO  
- **Envio de e-mails:** Resend  
- **Armazenamento de mídia:** Cloudinary  
- **Segurança:** Arcjet  
- **Autenticação:** JWT  
- **Deploy:** Sevalla

---

## ⚙️ Funcionalidades Principais

✅ Registro e login de usuários  
✅ Visualização de usuários online e indicador de status  
✅ Atualização de foto de perfil  
✅ Envio de mensagens de **texto, imagens e áudios**  
✅ Edição e exclusão de mensagens  
✅ Reações com emojis nas mensagens  
✅ Visualização de imagem em tela cheia  
✅ Player de áudio customizado  
✅ Notificações com som (opção de ativar/desativar)  
✅ Status de leitura (“enviada”, “entregue”, “lida”)  
✅ Exibição de **visto por último**  
✅ Indicador de **usuário digitando**  
✅ Interface moderna e responsiva  

---

## 🧩 Estrutura do Projeto

```

chatterly/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── emails/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── validators/
│   │   └── socket/
│   ├── index.js
│   └── package.json
│
└── frontend/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── store/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── tailwind.config.js

````

---

## 🔐 Variáveis de Ambiente (Backend)

Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis:

```bash
PORT=4000
MONGO_URI=
NODE_ENV=development
JWT_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
EMAIL_FROM_NAME=
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_SECRET=
CLOUDINARY_API_KEY=
ARCJET_KEY=
ARCJET_ENV=
````

---

## 🛠️ Como Rodar Localmente

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/diegovilhalva/chatterly.git
cd chatterly
```

### 2️⃣ Backend

```bash
cd backend
npm install
npm run dev
```

### 3️⃣ Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Acesse em: **[http://localhost:5173](http://localhost:5173)**

---

## 💡 Arquitetura e Comunicação

O **Chatterly** utiliza **Socket.IO** para toda a comunicação em tempo real.
Cada evento (mensagem, edição, exclusão, status online, typing indicator, etc.) é transmitido via sockets, garantindo uma experiência fluida e instantânea.

A autenticação é feita via **JWT**, armazenado de forma segura no cliente.
Arquivos (imagens e áudios) são enviados para o **Cloudinary**, e notificações por e-mail são gerenciadas via **Resend**.
O **Arcjet** adiciona uma camada extra de proteção e monitoramento de requisições.

---

### 💬 Chat em tempo real

* Envio de texto, imagem e áudio
* Edição e exclusão com feedback instantâneo

### 😄 Emojis e reações

* Reaja a qualquer mensagem
* Seletor moderno e intuitivo

### 🔔 Notificações

* Sons customizados para novas mensagens
* Possibilidade de desativar sons no app

---

## 🧠 Autor

👤 **Diego Vilhalva**
Desenvolvedor Web Full Stack
📂 GitHub: [@diegovilhalva](https://github.com/diegovilhalva)

---

## 📝 Licença

Este projeto é de código aberto e licenciado sob a [MIT License](LICENSE).

---




