import { useStore } from '@nanostores/react';
import { useAnimate } from 'framer-motion';
import { memo, useEffect, useRef, useState } from 'react';
import { cssTransition, toast, ToastContainer } from 'react-toastify';
import { useSnapScroll } from '~/lib/hooks';
import { chatStore } from '~/lib/stores/chat';
import { createScopedLogger, renderLogger } from '~/utils/logger';
import { BaseChat } from './BaseChat';
import Cookies from 'js-cookie';

const toastAnimation = cssTransition({
  enter: 'animated fadeInRight',
  exit: 'animated fadeOutRight',
});

const logger = createScopedLogger('Chat');

export function Chat() {
  renderLogger.trace('Chat');

  return (
    <>
      <ChatImpl />
      <ToastContainer
        closeButton={({ closeToast }) => {
          return (
            <button className="Toastify__close-button" onClick={closeToast}>
              <div className="i-ph:x text-lg" />
            </button>
          );
        }}
        icon={({ type }) => {
          switch (type) {
            case 'success': {
              return <div className="i-ph:check-bold text-bolt-elements-icon-success text-2xl" />;
            }
            case 'error': {
              return <div className="i-ph:warning-circle-bold text-bolt-elements-icon-error text-2xl" />;
            }
          }

          return undefined;
        }}
        position="bottom-right"
        pauseOnFocusLoss
        transition={toastAnimation}
      />
    </>
  );
}

interface ChatProps {}

export const ChatImpl = memo(({}: ChatProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [chatStarted, setChatStarted] = useState(false);
  const [model, setModel] = useState('');
  const [provider, setProvider] = useState('');

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
  }, [textareaRef]);

  const runAnimation = async () => {
    if (chatStarted) {
      return;
    }

    await Promise.all([
      animate('#examples', { opacity: 0, display: 'none' }, { duration: 0.1 }),
      animate('#intro', { opacity: 0, flex: 1 }, { duration: 0.2, ease: cubicEasingFn }),
    ]);

    chatStore.setKey('started', true);

    setChatStarted(true);
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
      input=""
      showChat={showChat}
      chatStarted={chatStarted}
      isStreaming={false}
      enhancingPrompt={false}
      promptEnhanced={false}
      sendMessage={() => {}}
      model={model}
      setModel={setModel}
      provider={provider}
      setProvider={setProvider}
      messageRef={messageRef}
      scrollRef={scrollRef}
      handleInputChange={() => {}}
      handleStop={() => {}}
      messages={[]}
      enhancePrompt={() => {}}
    />
  );
});
