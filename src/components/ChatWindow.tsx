import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Paperclip, Smile } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

interface ChatWindowProps {
  recipientName: string;
  recipientId: string;
  onClose: () => void;
}

export default function ChatWindow({ recipientName, recipientId, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: recipientId,
      senderName: recipientName,
      message: 'Hello! How can I help you today?',
      timestamp: new Date(Date.now() - 300000),
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      message: newMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate recipient typing and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Thank you for your message. I'll get back to you shortly.",
        "I understand your concern. Let me help you with that.",
        "That's a good question. Here's what I recommend...",
        "I've noted your symptoms. Please continue taking your medication as prescribed.",
        "Let's schedule a follow-up appointment to discuss this further."
      ];
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: recipientId,
        senderName: recipientName,
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-healthcare-primary text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{recipientName}</h3>
          <p className="text-sm text-healthcare-primary/80">
            {isTyping ? 'Typing...' : 'Online'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-healthcare-primary/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.senderId === user?.id
                  ? 'bg-healthcare-primary text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.message}</p>
              <p
                className={`text-xs mt-1 ${
                  message.senderId === user?.id ? 'text-healthcare-primary/70' : 'text-gray-500'
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-healthcare-primary transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-healthcare-primary focus:border-transparent"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-healthcare-primary transition-colors">
              <Smile className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-healthcare-primary text-white rounded-full hover:bg-healthcare-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}