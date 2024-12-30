/*
  # Add notification system for chat messages

  1. Changes
    - Add notifications table for unread messages
    - Add trigger to create notifications for new messages
    - Add function to mark messages as read and clear notifications
*/

CREATE TABLE IF NOT EXISTS chat_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  message_id uuid NOT NULL REFERENCES chat_messages(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, message_id)
);

ALTER TABLE chat_notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can manage their notifications"
  ON chat_notifications
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to create notification for new message
CREATE OR REPLACE FUNCTION create_message_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO chat_notifications (user_id, message_id)
  VALUES (NEW.receiver_id, NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create notification when message is created
CREATE TRIGGER on_message_created
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION create_message_notification();

-- Function to mark messages as read and clear notifications
CREATE OR REPLACE FUNCTION mark_messages_read(p_sender_id uuid)
RETURNS void AS $$
BEGIN
  -- Mark messages as read
  UPDATE chat_messages
  SET read = true
  WHERE sender_id = p_sender_id
  AND receiver_id = auth.uid()
  AND NOT read;

  -- Delete notifications
  DELETE FROM chat_notifications
  WHERE user_id = auth.uid()
  AND message_id IN (
    SELECT id FROM chat_messages
    WHERE sender_id = p_sender_id
    AND receiver_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;