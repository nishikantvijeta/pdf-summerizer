# AI PDF Summarizer & Chat Assistant

A full-stack app that uploads a PDF, extracts text with `pdf-parse`, generates a concise Gemini summary, and lets users ask questions grounded only in the uploaded PDF.

## Tech Stack

- Frontend: React.js, Tailwind CSS, Axios, Vite
- Backend: Node.js, Express.js, multer, pdf-parse, Gemini API
- Storage: Temporary in-memory document store

## Folder Structure

```txt
.
├── client
│   ├── src
│   │   ├── components
│   │   │   ├── ChatPanel.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── PdfUpload.jsx
│   │   │   └── SummaryPanel.jsx
│   │   ├── services
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server
│   ├── src
│   │   ├── config
│   │   │   └── env.js
│   │   ├── controllers
│   │   │   └── pdfController.js
│   │   ├── middleware
│   │   │   ├── errorHandler.js
│   │   │   └── upload.js
│   │   ├── routes
│   │   │   └── pdfRoutes.js
│   │   ├── services
│   │   │   ├── documentStore.js
│   │   │   ├── geminiService.js
│   │   │   └── pdfService.js
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads
│   │   └── .gitkeep
│   ├── .env.example
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```

## API Routes

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/health` | API health check |
| `POST` | `/api/pdf/upload` | Upload PDF, extract text, generate summary |
| `POST` | `/api/pdf/chat` | Ask a question from uploaded PDF content |
| `DELETE` | `/api/pdf/:documentId` | Remove a document from memory |

## Environment Setup

Create `server/.env`:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_google_ai_studio_api_key
GEMINI_MODEL=gemini-2.5-flash
MAX_UPLOAD_MB=10
DOCUMENT_TTL_MINUTES=60
```

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Get a Gemini API key from Google AI Studio and place it in `server/.env`.

## Installation

```bash
npm run install:all
```

Or install each app manually:

```bash
cd server
npm install

cd ../client
npm install
```

## Run Locally

Start the backend:

```bash
npm run dev:server
```

Start the frontend in a second terminal:

```bash
npm run dev:client
```

Open:

```txt
http://localhost:5173
```

## How It Works

1. The frontend sends a PDF to `POST /api/pdf/upload` as multipart form data using the field name `pdf`.
2. The backend stores the uploaded file briefly on disk, extracts text with `pdf-parse`, then deletes the file.
3. Extracted text is stored temporarily in backend memory with a generated `documentId`.
4. Gemini generates a concise summary automatically.
5. Chat requests send `documentId` and `question` to `POST /api/pdf/chat`.
6. The backend prompts Gemini to answer only from the stored PDF text.

## Deployment: Backend on Render

This repo includes a root-level `render.yaml` so you can create the backend service with Render Blueprint support or use the values directly in the dashboard.

1. Push the project to GitHub.
2. Create a new Render Web Service.
3. Set the root directory to `server`.
4. Use these commands:

```bash
npm install
npm start
```

5. Add environment variables in Render:

```env
PORT=10000
CLIENT_ORIGIN=https://your-vercel-app.vercel.app
GEMINI_API_KEY=your_google_ai_studio_api_key
GEMINI_MODEL=gemini-2.5-flash
MAX_UPLOAD_MB=10
DOCUMENT_TTL_MINUTES=60
```

Render injects `PORT`; keeping it in env is fine.

## Deployment: Frontend on Vercel

This repo includes [client/vercel.json](</D:/coding/ai pdf/client/vercel.json>) so the Vercel build settings live with the frontend app.

1. Import the GitHub repo in Vercel.
2. Set the root directory to `client`.
3. Use:

```bash
npm install
npm run build
```

4. Set the output directory to `dist`.
5. Add this Vercel environment variable:

```env
VITE_API_BASE_URL=https://your-render-api.onrender.com/api
```

6. Redeploy after saving env vars.

## Production Notes

- Backend memory storage is temporary and resets when the server restarts.
- For larger production usage, replace the memory store with Redis, Postgres, or object storage plus embeddings.
- This app extracts selectable text only. Scanned PDFs need OCR before upload.
- Keep `GEMINI_API_KEY` server-side only. Never expose it in the React app.

## Gemini API Reference

This project uses the official Gemini REST `generateContent` endpoint with the `x-goog-api-key` header:

- https://ai.google.dev/api
- https://ai.google.dev/api/rest
