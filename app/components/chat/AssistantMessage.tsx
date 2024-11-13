import { memo, useState } from 'react';
import { Markdown } from './Markdown';

interface AssistantMessageProps {
  content: string;
}

export const AssistantMessage = memo(({ content }: AssistantMessageProps) => {
  const [visualBreakdown, setVisualBreakdown] = useState<string | null>(null);

  const handleVisualBreakdown = () => {
    // Logic to generate visual breakdown from content
    const breakdown = generateVisualBreakdown(content);
    setVisualBreakdown(breakdown);
  };

  return (
    <div className="overflow-hidden w-full">
      <Markdown html>{content}</Markdown>
      {visualBreakdown && (
        <div className="visual-breakdown">
          <Markdown html>{visualBreakdown}</Markdown>
        </div>
      )}
      <button onClick={handleVisualBreakdown}>Generate Visual Breakdown</button>
    </div>
  );
});

function generateVisualBreakdown(content: string): string {
  // Placeholder function to generate visual breakdown from content
  return `<div>Visual breakdown of: ${content}</div>`;
}
