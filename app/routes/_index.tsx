import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { Chat } from '~/components/chat/Chat.client';
import { BaseChat } from '~/components/chat/BaseChat';
import { useState } from 'react';
import { DEFAULT_MODEL, DEFAULT_PROVIDER } from '~/utils/constants';

export const meta: MetaFunction = () => {
  return [{ title: 'Bolt' }, { name: 'description', content: 'Talk with Bolt, an AI assistant from StackBlitz' }];
};

export const loader = () => json({});

export default function Index() {
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [provider, setProvider] = useState(DEFAULT_PROVIDER);

  return (
    <div className="flex flex-col h-full w-full">
      <ClientOnly fallback={<BaseChat model={model} setModel={setModel} provider={provider} setProvider={setProvider} />}>
        {() => <Chat />}
      </ClientOnly>
    </div>
  );
}
