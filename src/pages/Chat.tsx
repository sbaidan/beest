import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth';
import { useMessagesStore } from '../store/messages';
import { useUserStore } from '../store/users';
import { useTrainingPlans } from '../hooks/useTrainingPlans';
import { Loader2 } from 'lucide-react';
import ChatWindow from '../components/chat/ChatWindow';
import ChatUserList from '../components/chat/ChatUserList';

export default function Chat() {
  const { profile } = useAuthStore();
  const { plans, loading: loadingPlans } = useTrainingPlans();
  const { messages, loading: loadingMessages, fetchMessages, markAsRead } = useMessagesStore();
  const { users, loading: loadingUsers, fetchUsers } = useUserStore();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      fetchMessages(profile.id);
      fetchUsers();
    }
  }, [profile?.id]);

  useEffect(() => {
    if (selectedUserId && profile) {
      markAsRead(selectedUserId);
    }
  }, [selectedUserId, profile?.id]);

  if (!profile || loadingPlans || loadingMessages || loadingUsers) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const chatUsers = profile.role === 'coach'
    ? plans
        .filter(plan => plan.athleteId)
        .map(plan => plan.athleteId!)
        .filter((id, index, self) => self.indexOf(id) === index)
    : plans
        .filter(plan => plan.athleteId === profile.id)
        .map(plan => plan.coachId)
        .filter((id, index, self) => self.indexOf(id) === index);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">
          Chat with your {profile.role === 'coach' ? 'athletes' : 'coach'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <ChatUserList
          users={chatUsers}
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
          messages={messages}
        />

        <div className="lg:col-span-3">
          {selectedUserId ? (
            <ChatWindow
              currentUserId={profile.id}
              otherUserId={selectedUserId}
              messages={messages}
              onSendMessage={async (content) => {
                await useMessagesStore.getState().sendMessage({
                  senderId: profile.id,
                  receiverId: selectedUserId,
                  content
                });
                await fetchMessages(profile.id);
              }}
            />
          ) : (
            <div className="h-[600px] bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-500">
              Select a {profile.role === 'coach' ? 'athlete' : 'coach'} to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}