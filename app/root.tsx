import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import '@unocss/reset/tailwind.css';
import 'uno.css';
import './styles/index.scss';

export function Head() {
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta />
      <Links />
      <title>Inspired - Universal Concept Visualizer</title>
      <meta name="description" content="A universal concept visualizer inspired by Bolt" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    </>
  );
}

export default function App() {
  return (
    <html lang="en" className="dark">
      <head>
        <Head />
      </head>
      <body className="bg-bolt-elements-background text-bolt-elements-textPrimary">
        <header className="flex items-center px-4 py-3 bg-bolt-elements-background-depth-1 border-b border-bolt-elements-borderColor">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" className="w-6 h-6" />
            <span className="text-lg font-semibold">Inspired</span>
            <span className="text-sm text-bolt-elements-textSecondary">by Bolt</span>
          </div>
        </header>
        <main className="h-[calc(100vh-56px)]">
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
