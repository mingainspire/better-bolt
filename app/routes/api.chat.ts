import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { streamText } from '~/lib/.server/llm/stream-text';
import { stripIndents } from '~/utils/stripIndent';

export async function action(args: ActionFunctionArgs) {
  return chatAction(args);
}

async function chatAction({ context, request }: ActionFunctionArgs) {
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
        const processedChunk = new TextDecoder().decode(chunk);
        controller.enqueue(new TextEncoder().encode(processedChunk));
      },
    });

    const transformedStream = result.toAIStream().pipeThrough(transformStream);

    return new Response(transformedStream, {
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
