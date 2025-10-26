import React from "react";
import {
  getChat,
  getChatMessages,
  sendMessage,
  getLatestMessages,
  type ChatWithDetails,
  type MessageWithDetails,
} from "../api";

interface ChatWindowProps {
  chatId: number;
  currentUserId: number;
  onChatDeleted: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chatId,
  currentUserId,
  onChatDeleted,
}) => {
  const [chat, setChat] = React.useState<ChatWithDetails | null>(null);
  const [messages, setMessages] = React.useState<MessageWithDetails[]>([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChat = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const chatData = await getChat(chatId, currentUserId);
      setChat(chatData);

      const messagesData = await getChatMessages(chatId, currentUserId);
      setMessages(messagesData);
    } catch (err) {
      console.error(err);
      setError("Failed to load chat");
    } finally {
      setLoading(false);
    }
  }, [chatId, currentUserId]);

  React.useEffect(() => {
    loadChat();
  }, [loadChat]);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simple polling for new messages (every 3 seconds)
  React.useEffect(() => {
    if (!chat) return;

    const interval = setInterval(async () => {
      try {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage) {
          const newMessages = await getLatestMessages(
            chatId,
            currentUserId,
            lastMessage.timestamp
          );
          if (newMessages.length > 0) {
            setMessages((prev) => [...prev, ...newMessages]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch new messages:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [chatId, currentUserId, messages, chat]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chat) return;

    setSending(true);
    try {
      const receiverId =
        currentUserId === chat.renter_id ? chat.lender_id : chat.renter_id;

      const sentMessage = await sendMessage(
        newMessage.trim(),
        chatId,
        currentUserId,
        receiverId
      );

      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
      setError("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !chat) {
    return (
      <div className="alert alert-danger m-3">
        {error || "Chat not found"}
      </div>
    );
  }

  const otherUser =
    currentUserId === chat.renter_id ? chat.lender : chat.renter;

  return (
    <div className="d-flex flex-column h-100">
      {/* Chat Header */}
      <div className="border-bottom p-3 bg-light">
        <h5 className="mb-0">{otherUser?.full_name || "Unknown User"}</h5>
        <small className="text-muted">Booking #{chat.booking_id}</small>
      </div>

      {/* Messages */}
      <div className="flex-grow-1 overflow-auto p-3" style={{ maxHeight: "calc(100vh - 400px)" }}>
        {messages.length === 0 ? (
          <div className="text-center text-muted">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.sender_id === currentUserId;
            return (
              <div
                key={message.id}
                className={`mb-3 d-flex ${
                  isOwnMessage ? "justify-content-end" : "justify-content-start"
                }`}
              >
                <div
                  className={`p-2 rounded ${
                    isOwnMessage
                      ? "bg-primary text-white"
                      : "bg-light text-dark"
                  }`}
                  style={{ maxWidth: "70%" }}
                >
                  <p className="mb-1">{message.content}</p>
                  <small
                    className={isOwnMessage ? "text-white-50" : "text-muted"}
                  >
                    {formatMessageTime(message.timestamp)}
                  </small>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-top p-3">
        <form onSubmit={handleSendMessage}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
              maxLength={1000}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={sending || !newMessage.trim()}
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
