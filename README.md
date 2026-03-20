# 🚀 InsightAI - The Next-Gen AI Search Engine

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![LangChain](https://img.shields.io/badge/LangChain-Latest-121212?style=for-the-badge&logo=chainlink&logoColor=white)](https://js.langchain.com/)

**InsightAI** is a sophisticated generative AI platform inspired by Perplexity AI. It combines the power of modern Large Language Models (LLMs) with real-time web search to provide users with accurate, cited, and conversational answers to any question.

---

## ✨ Key Features

- 🔍 **Real-Time Web Search**: Integrated with **Tavily Search API** to fetch the most up-to-date information from the web.
- 🤖 **Multi-Model Intelligence**: Leverages **Google Gemini** and **Mistral AI** via **LangChain** for high-quality reasoning and generation.
- 💬 **Interactive Threads**: Organize your research into separate threads with full context awareness.
- 🍱 **Rich Markdown Rendering**: Supports complex formatting, math equations, and code syntax highlighting.
- 📤 **Smart Export**: Export your search results and chat history to professional **PDFs** or **Images**.
- 🔐 **Robust Authentication**: Secure access with JWT-based authentication and email verification systems.
- ⚡ **Real-Time Updates**: Powered by **Socket.io** for seamless, instantaneous communication between client and server.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) (Vite for lightning-fast builds)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (Modern, utility-first design)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Communication**: [Socket.io-client](https://socket.io/docs/v4/client-api/) & [Axios](https://axios-http.com/)
- **Content**: [React Markdown](https://github.com/remarkjs/react-markdown) with GFM and Syntax Highlighting

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **AI Orchestration**: [LangChain](https://js.langchain.com/)
- **Search Engine**: [Tavily API](https://tavily.com/)
- **Security**: [JWT](https://jwt.io/), [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Validation**: [Zod](https://zod.dev/) & [Express Validator](https://express-validator.github.io/docs/)

---

## 📂 Project Structure

```text
Perplexity/
├── Backend/                 # Express Server & AI Logic
│   ├── src/
│   │   ├── config/          # Environment & Database setup
│   │   ├── controllers/     # Route handlers (Auth, Chat, etc.)
│   │   ├── models/          # Mongoose Schemas (User, Chat, Message)
│   │   ├── routes/          # API Endpoints
│   │   ├── services/        # AI & Search logic (LangChain, Tavily)
│   │   ├── sockets/         # WebSocket event handlers
│   │   └── validators/      # Payload validation rules
│   └── server.js            # Entry point
├── Frontend/                # React Vite Application
│   ├── src/
│   │   ├── app/             # Redux Store & Root Config
│   │   ├── assets/          # Static files & Icons
│   │   ├── features/        # Feature-based logic (Auth, Thread, Chat)
│   │   ├── shared/          # Reusable UI components & Hooks
│   │   └── main.jsx         # App bootstrapping
│   └── index.html           # HTML template
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- API Keys: Gemini API, Tavily API

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/perplexity.git
   cd perplexity
   ```

2. **Backend Configuration**
   - Navigate to `Backend/`
   - Create a `.env` file and add the following:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_secret_key
     GEMINI_API_KEY=your_gemini_key
     TAVILY_API_KEY=your_tavily_key
     ```
   - Install dependencies and start:
     ```bash
     npm install
     npm run dev
     ```

3. **Frontend Configuration**
   - Navigate to `Frontend/`
   - Install dependencies and start:
     ```bash
     npm install
     npm run dev
     ```

---

## 👨‍💻 Key Design Decisions

- **LangChain Integration**: Used to easily swap and combine different LLMs while maintaining a consistent interface.
- **Redux Toolkit**: Chosen for its predictable state management, especially for complex UI states like streaming messages.
- **Tailwind CSS 4**: Leveraged for its high-performance engine and modern CSS features to build a premium, "Glassmorphic" UI.
- **Socket.io**: Implemented to provide a responsive, real-time feel for generative responses, mimicking a live typing effect.

---

## 📜 License

This project is licensed under the **ISC License**.

---

*Made with ❤️ by Sounarva*
