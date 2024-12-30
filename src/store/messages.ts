import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

interface MessagesStore {
  messages: Message[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  fetchMessages: (userId: string) => Promise<void>;
  sendMessage: (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => Promise<void>;
  markAsRead: (senderId: string) => Promise<void>;
  getUnreadCount: (userId: string) => Promise<void>;
}

export const useMessagesStore = create<MessagesStore>((set, get) => ({
  messages: [],
  loading: false,
  error: null,
  unreadCount: 0,

  fetchMessages: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const messages = data.map(msg => ({
        id: msg.id,
        senderId: msg.sender_id,
        receiverId: msg.receiver_id,
        content: msg.content,
        createdAt: msg.created_at,
        read: msg.read
      }));

      set({ messages, loading: false });

      // Update unread count
      await get().getUnreadCount(userId);
    } catch (error) {
      console.error('Error fetching messages:', error);
      set({ error: error.message, loading: false });
    }
  },

  sendMessage: async (message) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          sender_id: message.senderId,
          receiver_id: message.receiverId,
          content: message.content,
          read: false
        });

      if (error) throw error;

      // Refresh messages for both sender and receiver
      await get().fetchMessages(message.senderId);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  markAsRead: async (senderId: string) => {
    try {
      const { error } = await supabase.rpc('mark_messages_read', {
        p_sender_id: senderId
      });

      if (error) throw error;

      // Update local state
      set(state => ({
        messages: state.messages.map(msg => 
          msg.senderId === senderId ? { ...msg, read: true } : msg
        )
      }));

      // Update unread count
      const userId = get().messages.find(m => m.receiverId !== senderId)?.receiverId;
      if (userId) {
        await get().getUnreadCount(userId);
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  getUnreadCount: async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_unread_message_count', {
        p_user_id: userId
      });

      if (error) throw error;
      set({ unreadCount: data || 0 });
    } catch (error) {
      console.error('Error getting unread count:', error);
    }
  }
}));