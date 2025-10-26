import React from "react";
import type { ChatListItem } from "../api";

interface ChatListProps {
  chats: ChatListItem[];
  loading: boolean;
  selectedChatId: number | null;
  onChatSelect: (chatId: number) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  loading,
  selectedChatId,
  onChatSelect,
}) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="text-center text-muted p-4">
        <p>No messages yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto h-100">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`p-3 border-bottom cursor-pointer ${
            selectedChatId === chat.id ? "bg-light" : ""
          }`}
          style={{ cursor: "pointer" }}
          onClick={() => onChatSelect(chat.id)}
        >
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <h6 className="mb-1">{chat.other_user.full_name}</h6>
              {chat.last_message && (
                <p className="text-muted small mb-0 text-truncate">
                  {chat.last_message.content}
                </p>
              )}
            </div>
            <div className="text-end ms-2">
              {chat.last_message && (
                <small className="text-muted">
                  {formatTimestamp(chat.last_message.timestamp)}
                </small>
              )}
              {chat.unread_count > 0 && (
                <span className="badge bg-primary rounded-pill d-block mt-1">
                  {chat.unread_count}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
