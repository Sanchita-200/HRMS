#!/bin/bash

# ==============================================================================
# BASH SETUP SCRIPT FOR AI-HRMS DEV ENVIRONMENT (macOS / Linux)
# ==============================================================================

set -e

GREEN='\033[0;32'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=============================================${NC}"
echo -e "${GREEN}Initializing AI-HRMS Development Environment${NC}"
echo -e "${GREEN}=============================================${NC}"

# --- Check Python Version ---
if command -v python3 &>/dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "✔ Found Python: ${PYTHON_VERSION}"
else
    echo -e "${RED}✘ Python 3 not found. Please install Python 3.12+${NC}"
    exit 1
fi

# --- Check Node.js Version ---
if command -v node &>/dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "✔ Found NodeJS: ${NODE_VERSION}"
else
    echo -e "${RED}✘ Node.js not found. Please install Node v18+${NC}"
    exit 1
fi

# --- Set Up Backend Environment ---
echo -e "\n${YELLOW}Step 1: Setting up Python Backend Virtual Environment...${NC}"
if [ ! -d "backend/.venv" ]; then
    python3 -m venv backend/.venv
    echo -e "✔ Virtual environment created at backend/.venv"
else
    echo -e "✔ Virtual environment already exists."
fi

echo -e "Installing Python Backend dependencies..."
./backend/.venv/bin/pip install --upgrade pip
./backend/.venv/bin/pip install -r backend/requirements.txt

# --- Set Up Frontend Environment ---
echo -e "\n${YELLOW}Step 2: Installing Next.js Frontend NPM Packages...${NC}"
cd frontend
npm install
cd ..
echo -e "✔ Frontend dependencies installed."

# --- Copy Environment Variables ---
echo -e "\n${YELLOW}Step 3: Creating Environment Configs...${NC}"
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "✔ Created .env configuration file from example template."
else
    echo -e "✔ .env file already exists."
fi

echo -e "\n${GREEN}=============================================${NC}"
echo -e "${GREEN}Scaffolding Environment Setup Successful!${NC}"
echo -e "To run the stack locally, run: docker compose up"
echo -e "${GREEN}=============================================${NC}"
