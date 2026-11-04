import { useState, useCallback } from 'react';
import { ChatThread, ChatMessage, Movie } from '../../types';
import { MOCK_CHATS, MOCK_DARIO_MESSAGES } from '../../data/mockData';

export function useChat() {
  const [chats, setChats] = useState<ChatThread[]>(MOCK_CHATS);
  const [selectedChat, setSelectedChat] = useState<ChatThread>(MOCK_CHATS[0]);
  const [darioMessages, setDarioMessages] = useState<ChatMessage[]>(MOCK_DARIO_MESSAGES);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text: text.trim(),
      timestamp: 'Jetzt',
      isMe: true,
    };

    setDarioMessages((prev) => [...prev, newMsg]);

    // Simulate Dario reply after brief delay
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        senderId: 'dario-m',
        text: 'Absolut, sehe ich genauso! Lass uns das auf jeden Fall im nächsten Stream schauen.',
        timestamp: 'Gerade eben',
        isMe: false,
      };
      setDarioMessages((prev) => [...prev, replyMsg]);
    }, 1200);
  }, []);

  const sendRecommendation = useCallback(
    (targetMovie: Movie, note: string, friendId?: string) => {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: 'me',
        text: note || `Schau dir unbedingt ${targetMovie.title} an!`,
        timestamp: 'Jetzt',
        isMe: true,
        filmTip: {
          movieId: targetMovie.id,
          title: targetMovie.title,
          poster: targetMovie.posterUrl,
          matchScore: targetMovie.matchScore || 92,
          provider: `${targetMovie.providers[0]?.name || 'Netflix'} • DE-Synchro`,
        },
      };

      setDarioMessages((prev) => [...prev, newMsg]);
      return newMsg;
    },
    []
  );

  return {
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    messages: darioMessages,
    sendMessage,
    sendRecommendation,
  };
}
