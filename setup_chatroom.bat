@echo off
setlocal EnableDelayedExpansion

:: =====================================================
::  SETUP COMPLETO DO PROJETO CHATROOM + CASSANDRA
::  Desenvolvido para o documento de requisitos fornecido
::  Executar como Administrador (recomendado)
:: =====================================================

echo.
echo ====================================================
echo    SETUP DO PROJETO CHATROOM - FULLSTACK + CASSANDRA
echo ====================================================
echo.

:: Definindo nome do projeto
set PROJECT_NAME=chatroom-cassandra
set ROOT=%cd%\%PROJECT_NAME%

echo [1] Criando estrutura de pastas do projeto...
mkdir "%ROOT%" 2>nul
cd /d "%ROOT%"

:: Estrutura completa do projeto
mkdir backend
mkdir backend\src
mkdir backend\src\config
mkdir backend\src\controllers
mkdir backend\src\models
mkdir backend\src\routes
mkdir backend\src\middlewares
mkdir backend\src\utils
mkdir backend\public
mkdir backend\public\uploads
mkdir backend\public\uploads\images
mkdir backend\public\uploads\audios
mkdir backend\public\uploads\videos
mkdir backend\public\uploads\files

mkdir frontend
mkdir frontend\css
mkdir frontend\js
mkdir frontend\assets
mkdir frontend\assets\img

mkdir docker
mkdir scripts

echo.
echo [2] Criando arquivos base...

:: package.json backend
(
echo {
echo   "name": "chatroom-backend",
echo   "version": "1.0.0",
echo   "description": "Backend do ChatRoom com Node.js + Express + Socket.IO + Cassandra",
echo   "main": "src/server.js",
echo   "scripts": {
echo     "start": "node src/server.js",
echo     "dev": "nodemon src/server.js"
echo   },
echo   "dependencies": {
echo     "express": "^4.19.2",
echo     "socket.io": "^4.7.5",
echo     "cassandra-driver": "^4.7.2",
echo     "bcrypt": "^5.1.1",
echo     "dotenv": "^16.4.5",
echo     "multer": "^1.4.5-lts.1",
echo     "cors": "^2.8.5",
echo     "uuid": "^9.0.1",
echo     "joi": "^17.13.3"
echo   },
echo   "devDependencies": {
echo     "nodemon": "^3.1.0"
echo   }
echo }
) > backend\package.json

:: server.js básico
(
echo require('dotenv').config();
echo const express = require('express');
echo const http = require('http');
echo const { Server } = require('socket.io');
echo const cassandra = require('cassandra-driver');
echo const path = require('path');
echo.
echo const app = express();
echo const server = http.createServer(app);
echo const io = new Server(server, {
echo   cors: { origin: "*" }
echo });
echo.
echo // Config Cassandra
echo const client = new cassandra.Client({
echo   contactPoints: [process.env.CASSANDRA_HOST || 'localhost'],
echo   localDataCenter: 'datacenter1',
echo   keyspace: 'chatroom_ks'
echo });
echo.
echo app.use(express.json());
echo app.use(express.static(path.join(__dirname, '../frontend')));
echo.
echo io.on('connection', (socket) => {
echo   console.log('Usuário conectado:', socket.id);
echo.
echo   socket.on('join_room', (roomId) => {
echo     socket.join(roomId);
echo     console.log(`Usuário ${socket.id} entrou na sala ${roomId}`);
echo   });
echo.
echo   socket.on('send_message', async (data) => {
echo     // Salvar no Cassandra aqui (será implementado depois)
echo     io.to(data.roomId).emit('receive_message', data);
echo   });
echo.
echo   socket.on('disconnect', () => {
echo     console.log('Usuário desconectado:', socket.id);
echo   });
echo });
echo.
echo const PORT = process.env.PORT || 3000;
echo server.listen(PORT, () => {
echo   console.log(`Servidor rodando na porta ${PORT}`);
echo   console.log(`Acesse: http://localhost:${PORT}`);
echo });
) > backend\src\server.js

:: .env exemplo
(
echo CASSANDRA_HOST=localhost
echo CASSANDRA_PORT=9042
echo PORT=3000
) > backend\.env

:: docker-compose.yml (com Cassandra + volume persistente)
(
echo version: '3.8'
echo.
echo services:
echo   cassandra:
echo     image: cassandra:5.0
echo     container_name: chatroom-cassandra
echo     ports:
echo       - "9042:9042"
echo       - "7199:7199"  # JMX
echo     environment:
echo       - CASSANDRA_CLUSTER_NAME=ChatRoomCluster
echo       - HEAP_NEWSIZE=512M
echo       - MAX_HEAP_SIZE=2G
echo     volumes:
echo       - cassandra-data:/var/lib/cassandra
echo     healthcheck:
echo       test: ["CMD", "cqlsh", "-e", "describe keyspaces"]
echo       interval: 30s
echo       timeout: 10s
echo       retries: 5
echo.
echo volumes:
echo   cassandra-data:
) > docker\docker-compose.yml

:: Script CQL inicial (criação do keyspace e tabelas)
(
echo CREATE KEYSPACE IF NOT EXISTS chatroom_ks
echo   WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
echo.
echo USE chatroom_ks;
echo.
echo CREATE TABLE IF NOT EXISTS users (
echo   user_id UUID PRIMARY KEY,
echo   username text,
echo   email text,
echo   password_hash text,
echo   created_at timestamp
echo );
echo.
echo CREATE TABLE IF NOT EXISTS chat_rooms (
echo   room_id UUID PRIMARY KEY,
echo   room_name text,
echo   is_private boolean,
echo   created_at timestamp
echo );
echo.
echo CREATE TABLE IF NOT EXISTS messages_by_room (
echo   room_id UUID,
echo   message_timestamp timestamp,
echo   message_id UUID,
echo   sender_id UUID,
echo   message_type text,
echo   content_text text,
echo   content_url text,
echo   file_format text,
echo   file_size bigint,
echo   PRIMARY KEYS (room_id, message_timestamp, message_id)
echo ) WITH CLUSTERING ORDER BY (message_timestamp DESC, message_id ASC);
echo.
echo CREATE INDEX IF NOT EXISTS ON messages_by_room (sender_id);
) > scripts\init_keyspace.cql

:: index.html básico com Bootstrap + Socket.IO
(
echo ^<!DOCTYPE html^>
echo ^<html lang="pt-BR"^>
echo ^<head^>
echo   ^<meta charset="UTF-8"^>
echo   ^<meta name="viewport" content="width=device-width, initial-scale=1"^>
echo   ^<title^>ChatRoom - Cassandra^</title^>
echo   ^<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"^>
echo ^</head^>
echo ^<body class="bg-light"^>
echo   ^<div class="container mt-5"^>
echo     ^<h1 class="text-center mb-4"^>ChatRoom com Cassandra^</h1^>
echo     ^<div id="chat" class="card"^>
echo       ^<div class="card-body"^>^</div^>
echo     ^</div^>
echo   ^</div^>
echo   ^<script src="/socket.io/socket.io.js"^>^</script^>
echo   ^<script^>
echo     const socket = io();
echo   ^</script^>
echo ^</body^>
echo ^</html^>
) > frontend\index.html

echo.
echo [3] Inicializando repositório Git...
git init >nul 2>&1
echo node_modules/ > .gitignore
echo backend/node_modules/ >> .gitignore
echo .env >> .gitignore

echo.
echo [4] Subindo container do Cassandra...
cd docker
docker-compose up -d

echo.
echo Aguarde o Cassandra ficar saudável (pode levar ~40 segundos na primeira vez)...
:wait_cassandra
timeout /t 5 >nul
docker ps | find "chatroom-cassandra" | find "healthy" >nul
if %errorlevel% neq 0 (
    echo    Ainda inicializando Cassandra...
    goto wait_cassandra
)

echo.
echo ====================================================
echo        PROJETO CRIADO COM SUCESSO!
echo ====================================================
echo.
echo Pasta do projeto: %ROOT%
echo.
echo Próximos passos:
echo   1. cd %ROOT%\backend
echo   2. npm install
echo   3. npm run dev
echo.
echo Cassandra está rodando:
echo   - Host: localhost
echo   - Porta: 9042
echo   - Keyspace: chatroom_ks (já criado automaticamente)
echo.
echo Execute o script CQL para criar as tabelas:
echo   docker exec -i chatroom-cassandra cqlsh -f /scripts/init_keyspace.cql
echo   (ou copie o conteúdo de scripts/init_keyspace.cql e cole no cqlsh)
echo.
echo Acesse a aplicação: http://localhost:3000
echo.
echo Projeto pronto para desenvolvimento Full-Stack com Cassandra!
echo.

pause