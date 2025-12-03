CREATE KEYSPACE IF NOT EXISTS chatroom_ks
  WITH replication = {
    'class': 'SimpleStrategy',
    'replication_factor': 1
  }
  AND durable_writes = true;

USE chatroom_ks;

CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY,
    username TEXT,
    email TEXT,
    password_hash TEXT,
    created_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);

CREATE TABLE IF NOT EXISTS chat_rooms (
    room_id UUID PRIMARY KEY,
    room_name TEXT,
    is_private BOOLEAN,
    creator_id UUID,
    created_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS rooms_private_idx ON chat_rooms (is_private);

CREATE TABLE IF NOT EXISTS messages_by_room (
    room_id TEXT,
    message_timestamp TIMESTAMP,
    message_id UUID,

    sender_id TEXT,
    sender_name TEXT,
    message_type TEXT,
    content_text TEXT,
    content_data BLOB,
    file_format TEXT,
    file_size BIGINT,

    PRIMARY KEY (room_id, message_timestamp, message_id)
) WITH CLUSTERING ORDER BY (message_timestamp DESC, message_id ASC)
  AND compaction = { 'class': 'TimeWindowCompactionStrategy' }
  AND default_time_to_live = 0;

CREATE INDEX IF NOT EXISTS messages_sender_idx ON messages_by_room (sender_id);
