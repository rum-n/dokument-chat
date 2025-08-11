#!/bin/bash

echo "🚀 Setting up Dokument Chat"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or later."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit .env file and add your Mistral API key and JWT secret"
    echo "   MISTRAL_API_KEY=your_mistral_api_key_here"
    echo "   JWT_SECRET=your_super_secret_jwt_key_here"
else
    echo "✅ .env file already exists"
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Edit .env file with your OpenAI API key"
echo "2. Start Qdrant: docker run -p 6333:6333 qdrant/qdrant"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend: cd frontend && npm start"
echo ""
echo "Or use Docker Compose: docker-compose up -d"
