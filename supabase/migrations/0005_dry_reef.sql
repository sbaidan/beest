/*
  # Add chat messages table

  1. New Tables
    - `chat_messages`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, references profiles)
      - `receiver_id` (uuid, references profiles)
      - `content` (text)
      - `created_at` (timestamptz)
      - `read` (boolean)

  2. Security
    - Enable RLS
    - Add policies for sending/receiving messages
*/

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES profiles(id),
  receiver_id uuid NOT NULL REFERENCES profiles(id),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can read messages they sent or received
CREATE POLICY "Users can read their own messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id
  );

-- Users can send messages
CREATE POLICY "Users can send messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM training_plans
      WHERE (coach_id = auth.uid() AND athlete_id = receiver_id)
         OR (athlete_id = auth.uid() AND coach_id = receiver_id)
    )
  );

-- Users can mark messages as read
CREATE POLICY "Users can mark messages as read"
  ON chat_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- Create index for faster queries
CREATE INDEX chat_messages_participants_idx ON chat_messages(sender_id, receiver_id);