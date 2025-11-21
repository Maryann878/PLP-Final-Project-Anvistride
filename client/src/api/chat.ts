// client/src/api/chat.ts
import API from "../lib/axios";

export interface Message {
  _id?: string;
  senderId: string;
  senderName: string;
  content: string;
  type: "text" | "system";
  createdAt?: string;
}

export interface Chat {
  _id: string;
  type: "group" | "private";
  name: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
  lastActivity?: string;
  isGroup?: boolean;
  otherParticipant?: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
}

export const getGroupChat = async (): Promise<Chat> => {
  const res = await API.get("/chat/group");
  return res.data;
};

export const getPrivateChat = async (userId: string): Promise<Chat> => {
  const res = await API.get(`/chat/private/${userId}`);
  return res.data;
};

export const getUserChats = async (): Promise<Chat[]> => {
  const res = await API.get("/chat");
  return res.data;
};

export const getChatMessages = async (chatId: string): Promise<{ messages: Message[]; chat: Chat }> => {
  const res = await API.get(`/chat/${chatId}/messages`);
  return res.data;
};

export const sendMessage = async (chatId: string, content: string): Promise<Chat> => {
  const res = await API.post(`/chat/${chatId}/message`, { content });
  return res.data.chat;
};

