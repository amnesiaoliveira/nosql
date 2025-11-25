 CREATE KEYSPACE IF NOT EXISTS chatroom_ks
   WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

 USE chatroom_ks;

 CREATE TABLE IF NOT EXISTS users (
   user_id UUID PRIMARY KEY,
   username text,
   email text,
   password_hash text,
   created_at timestamp
 );

 CREATE TABLE IF NOT EXISTS chat_rooms (
   room_id UUID PRIMARY KEY,
   room_name text,
   is_private boolean,
   created_at timestamp
 );

 CREATE TABLE IF NOT EXISTS messages_by_room (
   room_id UUID,
   message_timestamp timestamp,
   message_id UUID,
   sender_id UUID,
   message_type text,
   content_text text,
   content_url text,
   file_format text,
   file_size bigint,
   PRIMARY KEY (room_id, message_timestamp, message_id)
 ) WITH CLUSTERING ORDER BY (message_timestamp DESC, message_id ASC);

 CREATE INDEX IF NOT EXISTS ON messages_by_room (sender_id);