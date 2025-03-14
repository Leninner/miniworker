#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Configurando entorno Docker para MiniWorker ===${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo -e "${RED}Docker no está instalado. Por favor, instálalo e inténtalo de nuevo.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null
then
    echo -e "${RED}Docker Compose no está instalado. Por favor, instálalo e inténtalo de nuevo.${NC}"
    exit 1
fi

# Copy .env.example to .env if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Copiando archivo .env.example a .env...${NC}"
    cp .env.example .env
    echo -e "${GREEN}Archivo .env creado exitosamente.${NC}"
else
    echo -e "${YELLOW}El archivo .env ya existe. No se ha sobrescrito.${NC}"
fi

# Update backend/.env to use Docker PostgreSQL instance
if [ -f backend/.env ]; then
    echo -e "${YELLOW}Actualizando backend/.env para usar PostgreSQL en Docker...${NC}"
    sed -i 's/DB_HOST=localhost/DB_HOST=postgres/g' backend/.env
    echo -e "${GREEN}Archivo backend/.env actualizado exitosamente.${NC}"
    
    # Ask for OpenAI API Key
    echo -e "${YELLOW}¿Deseas configurar una nueva API Key para OpenAI? (s/n)${NC}"
    read -r configure_api_key
    
    if [[ "$configure_api_key" =~ ^[Ss]$ ]]; then
        echo -e "${YELLOW}Por favor, ingresa tu API Key de OpenAI:${NC}"
        read -r api_key
        
        if [ -n "$api_key" ]; then
            # Update the API key in both .env files
            sed -i "s|OPENAI_API_KEY=.*|OPENAI_API_KEY=$api_key|g" backend/.env
            sed -i "s|OPENAI_API_KEY=.*|OPENAI_API_KEY=$api_key|g" .env
            echo -e "${GREEN}API Key de OpenAI configurada exitosamente.${NC}"
        else
            echo -e "${RED}No se ingresó ninguna API Key. Se mantendrá el valor actual.${NC}"
        fi
    else
        echo -e "${YELLOW}No se modificará la API Key de OpenAI.${NC}"
    fi
else
    echo -e "${RED}No se encontró el archivo backend/.env.${NC}"
fi

# Start Docker containers
echo -e "${YELLOW}Iniciando contenedores Docker...${NC}"
docker compose up -d

# Check if containers are running
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Contenedores Docker iniciados exitosamente.${NC}"
    echo -e "${GREEN}PostgreSQL disponible en: localhost:5432${NC}"
    echo -e "${GREEN}pgAdmin disponible en: localhost:5050${NC}"
    echo -e "${GREEN}  - Email: admin@miniworker.com${NC}"
    echo -e "${GREEN}  - Password: admin${NC}"
else
    echo -e "${RED}Hubo un problema al iniciar los contenedores Docker.${NC}"
    exit 1
fi

echo -e "${YELLOW}=== Configuración completada ===${NC}" 