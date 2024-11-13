import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { StreamingTextResponse, parseStreamPart } from 'ai';
import { streamText } from '~/lib/.server/llm/stream-text';
import { stripIndents } from '~/utils/stripIndent';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function action(args: ActionFunctionArgs) {
  return enhancerAction(args);
}

async function enhancerAction({ context, request }: ActionFunctionArgs) {
  const { message } = await request.json<{ message: string }>();
  const apiKeys = context.apiKeys || {};

  try {
    const result = await streamText(
      [
        {
          role: 'user',
          content: stripIndents`
          I want you to break down the concept provided in the \`<concept>\` tags visually and display it on a dashboard.

          IMPORTANT: Only respond with the visual breakdown and nothing else!

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
        const processedChunk = decoder
          .decode(chunk)
          .split('\n')
          .filter((line) => line !== '')
          .map(parseStreamPart)
          .map((part) => part.value)
          .join('');

        controller.enqueue(encoder.encode(processedChunk));
      },
    });

    const transformedStream = result.toAIStream().pipeThrough(transformStream);

    // Save the visual breakdown to the dashboard
    const visualBreakdown = await new Response(transformedStream).text();
    saveToDashboard(visualBreakdown);

    return new Response(visualBreakdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.log(error);

    throw new Response(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
}

function saveToDashboard(breakdown: string) {
  // Logic to save the visual breakdown to the dashboard
  console.log('Saving to dashboard:', breakdown);
}
