# Dokument Chat

A production-ready web application for uploading PDFs and chatting with AI in Bulgarian and English. The system extracts text from PDFs, stores it in a vector database, and provides intelligent Q&A with clickable page references.

## Features

- **PDF Upload & Processing**: Support for text PDFs (OCR for scanned documents requires additional setup)
- **Multilingual Support**: Chat in Bulgarian or English with automatic language detection
- **Vector Search**: Fast semantic search using OpenAI embeddings
- **AI Chat**: Intelligent Q&A using GPT-4o-mini with context from PDF content
- **Page References**: Clickable links to source pages in the PDF
- **Modern UI**: Clean React interface with TailwindCSS styling

## Tech Stack

- **Frontend**: React, TailwindCSS, pdf.js
- **Backend**: Node.js, Express
- **Vector Database**: Qdrant
- **AI**: Mistral Embeddings + Mistral Large
- **OCR**: Tesseract.js (Bulgarian traineddata)
- **Containerization**: Docker & Docker Compose

## Quick Start

### Prerequisites

- Docker and Docker Compose
- OpenAI API key
- Tesseract OCR (for scanned PDFs)

### Setup

#### Option 1: Quick Setup (Recommended)

1. **Run the setup script**:

   ```bash
   git clone <repository-url>
   cd bgpdf-ai
   ./setup.sh
   ```

2. **Configure environment**:

   - Edit `.env` file and add your Mistral API key and JWT secret
   - Example:
     ```env
     MISTRAL_API_KEY=your-mistral-api-key-here
     JWT_SECRET=your-super-secret-jwt-key-here
     ```

3. **Start the application**:

   ```bash
   # Start Qdrant (in a separate terminal)
   docker run -p 6333:6333 qdrant/qdrant

   # Start backend (in a separate terminal)
   cd backend && npm run dev

   # Start frontend (in a separate terminal)
   cd frontend && npm start
   ```

#### Option 2: Docker Compose

1. **Clone and configure environment**:

   ```bash
   git clone <repository-url>
   cd bgpdf-ai
   cp env.example .env
   # Edit .env with your OpenAI API key and JWT secret
   ```

2. **Start the application**:

   ```bash
   docker-compose up -d
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Qdrant: http://localhost:6333

### Development Setup

1. **Install Node.js dependencies**:

   ```bash
   cd backend
   npm install
   ```

2. **Install React dependencies**:

   ```bash
   cd frontend
   npm install
   ```

3. **Start services individually**:

   ```bash
   # Terminal 1: Start Qdrant
   docker run -p 6333:6333 qdrant/qdrant

   # Terminal 2: Start backend
   cd backend && npm run dev

   # Terminal 3: Start frontend
   cd frontend && npm start
   ```

## API Endpoints

- `POST /upload_pdf` - Upload and process PDF
- `POST /ask` - Ask questions about uploaded PDFs
- `GET /pdfs` - List uploaded PDFs
- `GET /pdf/{pdf_id}` - Get PDF metadata

## Project Structure

```
bgpdf-ai/
├── frontend/          # React application
├── backend/           # FastAPI server
├── docker-compose.yml # Development environment
├── .env.example      # Environment variables template
└── README.md         # This file
```

## Environment Variables

Create a `.env` file with:

```env
OPENAI_API_KEY=your_openai_api_key_here
QDRANT_URL=http://localhost:6333
JWT_SECRET=your_jwt_secret_here
```

## Troubleshooting

### Docker Build Issues

If you encounter Docker build issues, try the local setup option instead:

```bash
./setup.sh
```

### OCR Limitations

The current build doesn't include OCR for scanned PDFs. For production use, consider:

- Using cloud OCR services (Google Cloud Vision, Azure Computer Vision)
- Installing Tesseract properly in the Docker container
- Using a pre-built Tesseract Docker image

### Package Version Issues

If you encounter package version conflicts, the setup script will install compatible versions automatically.

## Contributing

This is Phase 1 of development. Future phases will include:

- S3 integration for PDF storage
- User authentication system
- Advanced OCR capabilities
- Performance optimizations

## License

MIT License
