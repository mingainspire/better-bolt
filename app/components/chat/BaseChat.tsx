import React, { useState } from 'react';
import { classNames } from '~/utils/classNames';

interface BaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
  input?: string;
  isStreaming?: boolean;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  sendMessage?: (event: React.UIEvent) => void;
}

export const BaseChat = React.forwardRef<HTMLDivElement, BaseChatProps>(
  (
    {
      textareaRef,
      input = '',
      isStreaming = false,
      handleInputChange,
      sendMessage,
    },
    ref,
  ) => {
    const TEXTAREA_MIN_HEIGHT = 76;
    const TEXTAREA_MAX_HEIGHT = 200;

    const EXAMPLE_PROMPTS = [
      { text: 'Visualize how magnetic interference affects sound waves' },
      { text: 'Create a visual representation of photosynthesis' },
      { text: 'Show me how a black hole warps spacetime' },
      { text: 'Visualize the relationship between music harmony and mathematics' },
      { text: 'Create a visual breakdown of how memory formation works in the brain' },
    ];

    return (
      <div
        ref={ref}
        className="relative flex h-full w-full overflow-hidden"
      >
        <div className="flex overflow-y-auto w-full h-full">
          <div className="flex flex-col flex-grow min-w-[375px] h-full">
            <div id="intro" className="mt-[26vh] max-w-[768px] mx-auto text-center">
              <h1 className="text-6xl font-bold mb-4 animate-fade-in">
                Visual Concept Breakdown
              </h1>
              <p className="text-xl mb-8 text-gray-600 animate-fade-in animation-delay-200">
                Transform any concept into clear visual representations
              </p>
            </div>
            <div className="pt-6 px-6">
              <div className="relative w-full max-w-[768px] mx-auto">
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
                    onChange={handleInputChange}
                    style={{
                      minHeight: TEXTAREA_MIN_HEIGHT,
                      maxHeight: TEXTAREA_MAX_HEIGHT,
                    }}
                    placeholder="Describe any concept you'd like to visualize..."
                    translate="no"
                  />
                  <div className="flex justify-between items-center text-sm p-4 pt-2">
                    <button
                      disabled={input.length === 0 || isStreaming}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${
                        input.length === 0 || isStreaming
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                      onClick={(event) => sendMessage?.(event)}
                    >
                      <span className="i-ph:paper-plane-right text-xl" />
                      Visualize
                    </button>
                    <div className="text-xs text-gray-500">
                      Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-gray-100">Enter</kbd> to send
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="examples" className="relative w-full max-w-xl mx-auto mt-8 flex justify-center">
              <div className="flex flex-col space-y-2">
                {EXAMPLE_PROMPTS.map((examplePrompt, index) => (
                  <button
                    key={index}
                    onClick={(event) => sendMessage?.(event)}
                    className="group flex items-center w-full gap-2 justify-center bg-transparent text-gray-500 hover:text-gray-900"
                  >
                    {examplePrompt.text}
                    <div className="i-ph:arrow-bend-down-left" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
