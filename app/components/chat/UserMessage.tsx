import { useState } from 'react';
import { Markdown } from './Markdown';

interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  const [visualBreakdown, setVisualBreakdown] = useState<string | null>(null);

  const handleVisualBreakdown = async () => {
    const breakdown = await generateVisualBreakdown(content);
    setVisualBreakdown(breakdown);
    saveToDashboard(breakdown);
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

async function generateVisualBreakdown(content: string): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: content }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate visual breakdown');
  }

  const breakdown = await response.text();
  return breakdown;
}

function saveToDashboard(breakdown: string) {
  // Logic to save the visual breakdown to the dashboard
  console.log('Saving to dashboard:', breakdown);
}
