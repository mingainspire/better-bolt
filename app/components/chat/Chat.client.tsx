import React, { useRef, useState } from 'react';
import { BaseChat } from './BaseChat';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const sendMessage = async (event: React.UIEvent) => {
    if (!input.trim() || isStreaming) return;

    try {
      setIsStreaming(true);

      // Add user message
      const userMessage: Message = { role: 'user', content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      // Send to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.text();

      // Add assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: data }]);

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get response from AI');
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <BaseChat
      textareaRef={textareaRef}
      input={input}
      isStreaming={isStreaming}
      handleInputChange={handleInputChange}
      sendMessage={sendMessage}
    />
  );
};
