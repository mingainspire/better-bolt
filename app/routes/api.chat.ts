import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { streamText } from '~/lib/.server/llm/stream-text';
import { stripIndents } from '~/utils/stripIndent';

export async function action(args: ActionFunctionArgs) {
  return chatAction(args);
}

interface ChatRequest {
  message: string;
  model: string;
  provider: string;
  apiKeys: Record<string, string>;
}

async function chatAction({ context, request }: ActionFunctionArgs) {
  const { message, model, provider, apiKeys } = await request.json<ChatRequest>();

  try {
    const result = await streamText(
      [
        {
          role: 'user',
          content: stripIndents`
          [Model: ${model}]
          [Provider: ${provider}]

          Create a comprehensive visual representation and explanation of the concept provided in the \`<concept>\` tags.

          Please provide your response in this format:
          
          # [Concept Title]

          ## Visual Representation
          [Create a detailed visual representation using markdown. This can include:
          - ASCII diagrams
          - Flow charts
          - Process diagrams
          - Hierarchical structures
          - Mathematical visualizations
          - Any other visual format that best explains the concept
          Be creative but ensure clarity and accuracy.]

          ## Detailed Explanation
          [Provide a clear, detailed explanation that complements the visual representation. Include:
          - Key principles and components
          - How different elements interact
          - Real-world applications or examples
          - Important relationships and patterns]

          ## Related Concepts
          [List and briefly explain related concepts that help provide broader context]

          ## Notes
          [Include any important considerations, limitations, or additional insights]

          <concept>
            ${message}
          </concept>
        `,
        },
      ],
      context.cloudflare.env,
      undefined,
      apiKeys
    );

    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const processedChunk = new TextDecoder().decode(chunk);
        controller.enqueue(new TextEncoder().encode(processedChunk));
      },
    });

    const transformedStream = result.toAIStream().pipeThrough(transformStream);

    // Get the complete response
    const response = await new Response(transformedStream).text();

    // Return the formatted response
    return new Response(response, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);

    return new Response(
      JSON.stringify({ 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
