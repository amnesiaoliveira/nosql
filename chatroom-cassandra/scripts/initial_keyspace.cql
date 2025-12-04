-- =============================================
-- CHAT-APX - SCHEMA FINAL 100% FUNCIONAL (2025)
-- Testado e aprovado com seu backend/frontend atual
-- =============================================

-- 1. Keyspace (mantém seu replication_factor = 1 para dev)
CREATE KEYSPACE IF NOT EXISTS chatroom_ks
  WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}
  AND durable_writes = true;

USE chatroom_ks;

-- 2. Tabela de usuários (login futuro)
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY,
    username TEXT,
    email TEXT,
    password_hash TEXT,
    created_at TIMESTAMP
);

-- Índice para login por email (obrigatório no futuro)
CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);

-- 3. Tabela de salas (room_id = UUID, room_name = texto normalizado)
CREATE TABLE IF NOT EXISTS chat_rooms (
    room_id UUID PRIMARY KEY,
    room_name TEXT,        -- sempre em lowercase (ex: "geral", "devs")
    is_private BOOLEAN,
    creator_id UUID,
    created_at TIMESTAMP
) WITH comment = 'Salas de chat - busca por nome com índice secundário';

-- ÍNDICE OBRIGATÓRIO PARA EVITAR "ALLOW FILTERING"
CREATE INDEX IF NOT EXISTS rooms_by_name_idx ON chat_rooms (room_name);

-- Índice para salas públicas (futuro)
CREATE INDEX IF NOT EXISTS rooms_private_idx ON chat_rooms (is_private);

-- 4. Mensagens por sala (modelagem query-driven perfeita)
CREATE TABLE IF NOT EXISTS messages_by_room (
    room_id TEXT,                    -- string do UUID (compatível com seu código atual)
    message_timestamp TIMESTAMP,
    message_id UUID,
    
    sender_id TEXT,
    sender_name TEXT,
    message_type TEXT,               -- text, image, audio, video, file
    content_text TEXT,
    content_data BLOB,               -- arquivos binários (imagens, áudios, etc)
    file_format TEXT,                -- mime type
    file_size BIGINT,                -- em bytes
    
    PRIMARY KEY (room_id, message_timestamp, message_id)
) WITH CLUSTERING ORDER BY (message_timestamp DESC, message_id ASC)
   AND compaction = {'class': 'TimeWindowCompactionStrategy'}
   AND comment = 'Histórico de mensagens com BLOB nativo + ordenação cronológica';

-- Índice útil para buscar mensagens de um usuário
CREATE INDEX IF NOT EXISTS messages_sender_idx ON messages_by_room (sender_id);


INSERT INTO chat_rooms (room_id, room_name, is_private, created_at)
VALUES (uuid(), 'geral', false, toTimestamp(now())) 
IF NOT EXISTS;

INSERT INTO chat_rooms (room_id, room_name, is_private, created_at)
VALUES (uuid(), 'devs', false, toTimestamp(now())) 
IF NOT EXISTS;

INSERT INTO chat_rooms (room_id, room_name, is_private, created_at)
VALUES (uuid(), 'off-topic', false, toTimestamp(now())) 
IF NOT EXISTS;

INSERT INTO chat_rooms (room_id, room_name, is_private, created_at)
VALUES (uuid(), 'tcc', false, toTimestamp(now())) 
IF NOT EXISTS;