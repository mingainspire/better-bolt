import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { IconButton } from '~/components/ui/IconButton';
import { APIKeyManager } from './APIKeyManager';
import styles from './BaseChat.module.scss';
import { MODEL_LIST, type ModelInfo } from '~/utils/constants';

// Utility function for combining class names
const classNames = (...classes: (string | boolean | undefined | null | { [key: string]: boolean } | Record<string, boolean>)[]): string => {
  return classes
    .filter(Boolean)
    .map((cls) => {
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(' ');
      }
      return cls;
    })
    .filter(Boolean)
    .join(' ');
};

interface ModelSelectorProps {
  model: string;
  setModel: (model: string) => void;
  provider: string;
  setProvider: (provider: string) => void;
  modelList: ModelInfo[];
  providerList: string[];
}

const EXAMPLE_PROMPTS = [
  { text: 'Explain how a CPU works' },
  { text: 'Show me how garbage collection works in JavaScript' },
  { text: 'Visualize the event loop in Node.js' },
  { text: 'Create a diagram of React component lifecycle' },
  { text: 'Explain Docker containerization' },
];

// Get unique providers from MODEL_LIST
const providerList = Array.from(new Set(MODEL_LIST.map(model => model.provider)));

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  model, 
  setModel, 
  provider, 
  setProvider, 
  modelList, 
  providerList 
}) => {
  return (
    <div className="mb-2 flex gap-2">
      <select 
        value={provider}
        onChange={(e) => {
          setProvider(e.target.value);
          const firstModel = [...modelList].find(m => m.provider === e.target.value);
          setModel(firstModel ? firstModel.name : '');
        }}
        className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {providerList.map((provider) => (
          <option key={provider} value={provider}>
            {provider}
          </option>
        ))}
      </select>
      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {[...modelList].filter(e => e.provider === provider && e.name).map((modelOption) => (
          <option key={modelOption.name} value={modelOption.name}>
            {modelOption.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const TEXTAREA_MIN_HEIGHT = 76;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface BaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
  messageRef?: React.RefCallback<HTMLDivElement>;
  scrollRef?: React.RefCallback<HTMLDivElement>;
  showChat?: boolean;
  chatStarted?: boolean;
  isStreaming?: boolean;
  messages?: Message[];
  enhancingPrompt?: boolean;
  promptEnhanced?: boolean;
  input?: string;
  model: string;
  setModel: (model: string) => void;
  provider: string;
  setProvider: (provider: string) => void;
  handleStop?: () => void;
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  enhancePrompt?: () => void;
}

export const BaseChat = React.forwardRef<HTMLDivElement, BaseChatProps>(
  (
    {
      textareaRef,
      messageRef,
      scrollRef,
      showChat = true,
      chatStarted = false,
      isStreaming = false,
      enhancingPrompt = false,
      promptEnhanced = false,
      messages = [],
      input = '',
      model,
      setModel,
      provider,
      setProvider,
      sendMessage,
      handleInputChange,
      enhancePrompt,
      handleStop,
    },
    ref,
  ) => {
    const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;
    const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

    useEffect(() => {
      try {
        const storedApiKeys = Cookies.get('apiKeys');
        if (storedApiKeys) {
          const parsedKeys = JSON.parse(storedApiKeys);
          if (typeof parsedKeys === 'object' && parsedKeys !== null) {
            setApiKeys(parsedKeys);
          }
        }
      } catch (error) {
        console.error('Error loading API keys from cookies:', error);
        Cookies.remove('apiKeys');
      }
    }, []);

    const updateApiKey = (provider: string, key: string) => {
      try {
        const updatedApiKeys = { ...apiKeys, [provider]: key };
        setApiKeys(updatedApiKeys);
        Cookies.set('apiKeys', JSON.stringify(updatedApiKeys), {
          expires: 30,
          secure: true,
          sameSite: 'strict',
          path: '/'
        });
      } catch (error) {
        console.error('Error saving API keys to cookies:', error);
      }
    };

    return (
      <div
        ref={ref}
        className={classNames(
          styles.BaseChat,
          'relative flex h-full w-full overflow-hidden',
        )}
        data-chat-visible={showChat}
      >
        <div ref={scrollRef} className="flex overflow-y-auto w-full h-full">
          <div className={classNames(styles.Chat, 'flex flex-col flex-grow min-w-[var(--chat-min-width)] h-full')}>
            {!chatStarted && (
              <div id="intro" className="mt-[26vh] max-w-chat mx-auto text-center">
                <h1 className="text-6xl font-bold mb-4 animate-fade-in">
                  Bolt
                </h1>
                <p className="text-xl mb-8 text-gray-600 animate-fade-in animation-delay-200">
                  Talk with Bolt, an AI assistant from StackBlitz
                </p>
              </div>
            )}
            <div
              className={classNames('pt-6 px-6', {
                'h-full flex flex-col': chatStarted,
              })}
            >
              <div
                className={classNames('relative w-full max-w-chat mx-auto z-prompt', {
                  'sticky bottom-0': chatStarted,
                })}
              >
                <ModelSelector
                  model={model}
                  setModel={setModel}
                  modelList={MODEL_LIST}
                  provider={provider}
                  setProvider={setProvider}
                  providerList={providerList}
                />
                <APIKeyManager
                  provider={provider}
                  apiKey={apiKeys[provider] || ''}
                  setApiKey={(key) => updateApiKey(provider, key)}
                />
                <div className="shadow-lg border border-gray-200 rounded-lg overflow-hidden">
                  <textarea
                    ref={textareaRef}
                    className="w-full pl-4 pt-4 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && event.ctrlKey) {
                        event.preventDefault();
                        sendMessage?.(event);
                      }
                    }}
                    value={input}
                    onChange={(event) => {
                      handleInputChange?.(event);
                    }}
                    style={{
                      minHeight: TEXTAREA_MIN_HEIGHT,
                      maxHeight: TEXTAREA_MAX_HEIGHT,
                    }}
                    placeholder="Ask me anything..."
                    translate="no"
                  />
                  <div className="flex justify-between items-center text-sm p-4 pt-2">
                    <div className="flex gap-2 items-center">
                      <IconButton
                        title="Enhance prompt"
                        disabled={input.length === 0 || enhancingPrompt}
                        className={classNames('transition-all', {
                          'opacity-100!': enhancingPrompt,
                          'text-blue-500! pr-1.5 enabled:hover:bg-blue-50!':
                            promptEnhanced,
                        })}
                        onClick={() => enhancePrompt?.()}
                      >
                        {enhancingPrompt ? (
                          <>
                            <div className="i-svg-spinners:90-ring-with-bg text-blue-500 text-xl animate-spin"></div>
                            <div className="ml-1.5">Enhancing prompt...</div>
                          </>
                        ) : (
                          <>
                            <div className="i-bolt:stars text-xl"></div>
                            {promptEnhanced && <div className="ml-1.5">Prompt enhanced</div>}
                          </>
                        )}
                      </IconButton>
                    </div>
                    <div className="text-xs text-gray-500">
                      Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-gray-100">Enter</kbd> to send
                    </div>
                  </div>
                </div>
                <div className="pb-6">{/* Ghost Element */}</div>
              </div>
            </div>
            {!chatStarted && (
              <div id="examples" className="relative w-full max-w-xl mx-auto mt-8 flex justify-center">
                <div className="flex flex-col space-y-2 [mask-image:linear-gradient(to_bottom,black_0%,transparent_180%)] hover:[mask-image:none]">
                  {EXAMPLE_PROMPTS.map((examplePrompt, index) => {
                    return (
                      <button
                        key={index}
                        onClick={(event) => {
                          sendMessage?.(event, examplePrompt.text);
                        }}
                        className="group flex items-center w-full gap-2 justify-center bg-transparent text-gray-500 hover:text-gray-900"
                      >
                        {examplePrompt.text}
                        <div className="i-ph:arrow-bend-down-left" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);
