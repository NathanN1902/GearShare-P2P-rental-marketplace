import React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import { getUserChats, type ChatListItem } from "../api";

const Messages: React.FC = () => {
  // TODO: Get current user ID from auth context/state
  // For now, using a placeholder. You'll need to implement proper auth
  const currentUserId = 1;

  const [chats, setChats] = React.useState<ChatListItem[]>([]);
  const [selectedChatId, setSelectedChatId] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadChats = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserChats(currentUserId);
      setChats(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load chats");
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  React.useEffect(() => {
    loadChats();
  }, [loadChats]);

  const handleChatSelect = (chatId: number) => {
    setSelectedChatId(chatId);
  };

  return (
    <>
      <Header />
      <main className="container my-4">
        <h1 className="mb-4">Messages</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row" style={{ height: "calc(100vh - 250px)" }}>
          {/* Chat List */}
          <div className="col-12 col-md-4 border-end">
            <ChatList
              chats={chats}
              loading={loading}
              selectedChatId={selectedChatId}
              onChatSelect={handleChatSelect}
            />
          </div>

          {/* Chat Window */}
          <div className="col-12 col-md-8">
            {selectedChatId ? (
              <ChatWindow
                chatId={selectedChatId}
                currentUserId={currentUserId}
                onChatDeleted={loadChats}
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                <p>Select a chat to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Messages;
