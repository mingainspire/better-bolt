import { useStore } from '@nanostores/react';
import { useAnimate } from 'framer-motion';
import React, { memo, useEffect, useRef, useState } from 'react';
import { cssTransition, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSnapScroll } from '~/lib/hooks';
import { chatStore } from '~/lib/stores/chat';
import { createScopedLogger } from '~/utils/logger';
import { BaseChat } from './BaseChat';
import Cookies from 'js-cookie';
import { DEFAULT_MODEL, DEFAULT_PROVIDER } from '~/utils/constants';

const toastAnimation = cssTransition({
  enter: 'animated fadeInRight',
  exit: 'animated fadeOutRight',
});

const logger = createScopedLogger('Chat');

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chat: React.FC = () => {
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [provider, setProvider] = useState(DEFAULT_PROVIDER);
  const [input, setInput] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [enhancingPrompt, setEnhancingPrompt] = useState(false);
  const [promptEnhanced, setPromptEnhanced] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { showChat } = useStore(chatStore);
  const [animationScope, animate] = useAnimate();
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;

  const scrollTextArea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
      textarea.style.overflowY = scrollHeight > TEXTAREA_MAX_HEIGHT ? 'auto' : 'hidden';
    }
  }, [input, TEXTAREA_MAX_HEIGHT]);

  const runAnimation = async () => {
    if (chatStarted) return;

    await Promise.all([
      animate('#examples', { opacity: 0, display: 'none' }, { duration: 0.1 }),
      animate('#intro', { opacity: 0, flex: 1 }, { duration: 0.2, ease: 'easeInOut' }),
    ]);

    chatStore.setKey('started', true);
    setChatStarted(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const sendMessage = async (event: React.UIEvent, messageInput?: string) => {
    const messageToSend = messageInput || input;
    if (!messageToSend.trim() || isStreaming) return;

    try {
      setIsStreaming(true);
      runAnimation();

      // Add user message
      const userMessage: Message = { role: 'user', content: messageToSend };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      // Send to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: messageToSend,
          model,
          provider,
          apiKeys
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
      toast.error('Failed to get response from AI');
    } finally {
      setIsStreaming(false);
    }
  };

  const handleStop = () => {
    setIsStreaming(false);
  };

  const [messageRef, scrollRef] = useSnapScroll();

  useEffect(() => {
    const storedApiKeys = Cookies.get('apiKeys');
    if (storedApiKeys) {
      setApiKeys(JSON.parse(storedApiKeys));
    }
  }, []);

  return (
    <BaseChat
      ref={animationScope}
      textareaRef={textareaRef}
      input={input}
      showChat={showChat}
      chatStarted={chatStarted}
      isStreaming={isStreaming}
      enhancingPrompt={enhancingPrompt}
      promptEnhanced={promptEnhanced}
      sendMessage={sendMessage}
      model={model}
      setModel={setModel}
      provider={provider}
      setProvider={setProvider}
      messageRef={messageRef}
      scrollRef={scrollRef}
      handleInputChange={handleInputChange}
      handleStop={handleStop}
      messages={messages}
      enhancePrompt={() => {}}
    />
  );
};
