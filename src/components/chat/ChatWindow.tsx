import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useUserStore } from '../../store/users';
import { Message } from '../../store/messages';

interface ChatWindowProps {
  currentUserId: string;
  otherUserId: string;
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
}

export default function ChatWindow({ 
  currentUserId, 
  otherUserId, 
  messages,
  onSendMessage 
}: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { users } = useUserStore();
  
  const otherUser = users.find(u => u.id === otherUserId);
  const conversation = messages.filter(msg =>
    (msg.senderId === currentUserId && msg.receiverId === otherUserId) ||
    (msg.senderId === otherUserId && msg.receiverId === currentUserId)
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [conversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">
          Chat with {otherUser?.username} 
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({otherUser?.role})
          </span>
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                msg.senderId === currentUserId
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p>{msg.content}</p>
              <span className="text-xs opacity-75">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !message.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}