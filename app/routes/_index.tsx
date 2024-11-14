import { json } from '@remix-run/cloudflare';

export const loader = () => json({});

export default function Index() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
