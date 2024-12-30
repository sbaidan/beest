import React from 'react';
import { useUserStore } from '../../store/users';
import { Message } from '../../store/messages';

interface ChatUserListProps {
  users: string[];
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
  messages: Message[];
}

export default function ChatUserList({ users, selectedUserId, onSelectUser, messages }: ChatUserListProps) {
  const { users: allUsers } = useUserStore();

  // Get last message for each user
  const lastMessages = users.reduce((acc, userId) => {
    const userMessages = messages.filter(m => 
      m.senderId === userId || m.receiverId === userId
    );
    acc[userId] = userMessages[userMessages.length - 1];
    return acc;
  }, {} as Record<string, Message | undefined>);

  // Sort users by last message time
  const sortedUsers = [...users].sort((a, b) => {
    const lastMessageA = lastMessages[a]?.createdAt || '';
    const lastMessageB = lastMessages[b]?.createdAt || '';
    return lastMessageB.localeCompare(lastMessageA);
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversations</h2>
      <div className="space-y-2">
        {sortedUsers.map(userId => {
          const user = allUsers.find(u => u.id === userId);
          const lastMessage = lastMessages[userId];
          
          if (!user) return null;

          return (
            <button
              key={userId}
              onClick={() => onSelectUser(userId)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedUserId === userId
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium">
                  {user.username} <span className="text-sm text-gray-500">({user.role})</span>
                </span>
                {lastMessage && (
                  <span className="text-xs text-gray-500">
                    {new Date(lastMessage.createdAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
              {lastMessage && (
                <p className="text-sm text-gray-600 truncate">
                  {lastMessage.content}
                </p>
              )}
            </button>
          );
        })}

        {sortedUsers.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No conversations yet
          </div>
        )}
      </div>
    </div>
  );
}