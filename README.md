# Inspired (by Bolt)

A universal concept visualization tool that transforms any concept into clear visual representations.

## Current State
- Basic React application with dark theme
- "Inspired by Bolt" branding
- Simple, clean interface
- Working server-side rendering

## Goals
- Universal concept visualization (not just programming concepts)
- Integration with OpenRouter API using Qwen 2.5 32B model
- Visual breakdowns of complex concepts
- Simple dashboard for saved visualizations
- Local storage for persistence

## Setup

1. Clone this repository
2. Copy `.env.example` to `.env.local` and add your API keys
3. Install dependencies:
```bash
pnpm install
```
4. Start the development server:
```bash
pnpm run dev
```

## Environment Variables

Configure your API keys in `.env.local`:

```
OPENROUTER_API_KEY=xxx
```

## License

MIT
