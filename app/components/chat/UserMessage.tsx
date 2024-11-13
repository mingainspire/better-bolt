import { useState } from 'react';
import { Markdown } from './Markdown';

interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  const [visualBreakdown, setVisualBreakdown] = useState<string | null>(null);

  const handleVisualBreakdown = () => {
    const breakdown = generateVisualBreakdown(content);
    setVisualBreakdown(breakdown);
  };

  return (
    <div className="overflow-hidden pt-[4px]">
      <Markdown limitedMarkdown>{sanitizeUserMessage(content)}</Markdown>
      {visualBreakdown && (
        <div className="visual-breakdown">
          <Markdown html>{visualBreakdown}</Markdown>
        </div>
      )}
      <button onClick={handleVisualBreakdown}>Generate Visual Breakdown</button>
    </div>
  );
}

function sanitizeUserMessage(content: string) {
  return content.replace(modificationsRegex, '').replace(MODEL_REGEX, 'Using: $1').replace(PROVIDER_REGEX, ' ($1)\n\n').trim();
}

function generateVisualBreakdown(content: string): string {
  return `<div>Visual breakdown of: ${content}</div>`;
}
