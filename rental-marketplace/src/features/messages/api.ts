import api from "../../app/api";

export interface Chat {
  id: number;
  booking_id: number;
  renter_id: number;
  lender_id: number;
}

export interface ChatListItem {
  id: number;
  booking_id: number;
  other_user: {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
  };
  last_message?: {
    content: string;
    timestamp: string;
    sender_id: number;
  };
  unread_count: number;
}

export interface Message {
  id: number;
  content: string;
  timestamp: string;
  chat_id: number;
  sender_id: number;
  receiver_id: number;
}

export interface MessageWithDetails extends Message {
  sender?: {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
  };
  receiver?: {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
  };
}

export interface ChatWithDetails extends Chat {
  renter?: {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
  };
  lender?: {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
  };
  messages?: Message[];
}

// Chat API functions
export async function getUserChats(userId: number): Promise<ChatListItem[]> {
  const response = await api.get(`/chats/`, { params: { user_id: userId } });
  return response.data;
}

export async function getChat(chatId: number, userId: number): Promise<ChatWithDetails> {
  const response = await api.get(`/chats/${chatId}`, { params: { user_id: userId } });
  return response.data;
}

export async function createChat(
  bookingId: number,
  renterId: number,
  lenderId: number
): Promise<Chat> {
  const response = await api.post("/chats/", {
    booking_id: bookingId,
    renter_id: renterId,
    lender_id: lenderId,
  });
  return response.data;
}

export async function deleteChat(chatId: number, userId: number): Promise<void> {
  await api.delete(`/chats/${chatId}`, { params: { user_id: userId } });
}

// Message API functions
export async function getChatMessages(
  chatId: number,
  userId: number,
  limit = 50,
  offset = 0
): Promise<MessageWithDetails[]> {
  const response = await api.get(`/messages/chat/${chatId}`, {
    params: { user_id: userId, limit, offset },
  });
  return response.data;
}

export async function sendMessage(
  content: string,
  chatId: number,
  senderId: number,
  receiverId: number
): Promise<Message> {
  const response = await api.post("/messages/", {
    content,
    chat_id: chatId,
    sender_id: senderId,
    receiver_id: receiverId,
  });
  return response.data;
}

export async function deleteMessage(messageId: number, userId: number): Promise<void> {
  await api.delete(`/messages/${messageId}`, { params: { user_id: userId } });
}

export async function getLatestMessages(
  chatId: number,
  userId: number,
  sinceTimestamp: string
): Promise<Message[]> {
  const response = await api.get(`/messages/latest/${chatId}`, {
    params: { user_id: userId, since_timestamp: sinceTimestamp },
  });
  return response.data;
}
