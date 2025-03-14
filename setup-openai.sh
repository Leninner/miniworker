#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Configuración de API Key de OpenAI para MiniWorker ===${NC}"

# Check if backend/.env exists
if [ ! -f backend/.env ]; then
    echo -e "${RED}No se encontró el archivo backend/.env.${NC}"
    echo -e "${YELLOW}Creando archivo backend/.env...${NC}"
    touch backend/.env
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}No se encontró el archivo .env en el directorio raíz.${NC}"
    echo -e "${YELLOW}Creando archivo .env...${NC}"
    touch .env
fi

# Ask for OpenAI API Key
echo -e "${YELLOW}Por favor, ingresa tu API Key de OpenAI:${NC}"
read -r api_key

if [ -n "$api_key" ]; then
    # Update the API key in both .env files
    # For backend/.env
    if grep -q "OPENAI_API_KEY" backend/.env; then
        sed -i "s|OPENAI_API_KEY=.*|OPENAI_API_KEY=$api_key|g" backend/.env
    else
        echo "OPENAI_API_KEY=$api_key" >> backend/.env
    fi
    
    # For root .env
    if grep -q "OPENAI_API_KEY" .env; then
        sed -i "s|OPENAI_API_KEY=.*|OPENAI_API_KEY=$api_key|g" .env
    else
        echo "OPENAI_API_KEY=$api_key" >> .env
    fi
    
    echo -e "${GREEN}API Key de OpenAI configurada exitosamente.${NC}"
    echo -e "${YELLOW}Recuerda no compartir tu API Key y mantenerla segura.${NC}"
else
    echo -e "${RED}No se ingresó ninguna API Key. La operación fue cancelada.${NC}"
    exit 1
fi

echo -e "${YELLOW}=== Configuración completada ===${NC}" 