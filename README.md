# Visual Concept Breakdown Tool

A specialized tool that helps break down concepts visually using AI. This tool takes any concept you provide and creates a visual breakdown, storing these visualizations in a simple dashboard interface.

## Core Features

- **Visual Concept Breakdown**: Input any concept and receive an AI-generated visual breakdown
- **Simple Dashboard**: View and save your visual breakdowns for easy reference
- **Multi-Model Support**: Choose from various AI models for different visualization needs
- **Local Storage**: Automatically saves your visualizations in browser storage

## Setup

1. Clone this repository
2. Copy `.env.example` to `.env.local` and add your preferred AI model API keys
3. Install dependencies:
```bash
pnpm install
```
4. Start the development server:
```bash
pnpm run dev
```

## Environment Variables

Configure your preferred AI model by setting the appropriate API key in `.env.local`:

```
OPENAI_API_KEY=xxx
ANTHROPIC_API_KEY=xxx
GROQ_API_KEY=xxx
```

Note: You only need to set the API key for the model you plan to use.

## Development

To start the development server:

```bash
pnpm run dev
```

For production build:

```bash
pnpm run build
pnpm run start
```

## Docker Support

Build and run with Docker:

```bash
# Development
npm run dockerbuild
docker-compose --profile development up

# Production
npm run dockerbuild:prod
docker-compose --profile production up
```

## License

MIT
