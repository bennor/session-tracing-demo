import Link from 'next/link';
import { trace } from '@opentelemetry/api';
import { withSpan } from '@/utils/tracing';
import { connection } from 'next/server';

const tracer = trace.getTracer('slow-page');

export default async function SlowPage() {
  await connection();
  await withSpan(tracer, 'call-api', async (span) => {
    const response = await fetch('https://httpbin.org/headers');
    const data = await response.text();
    span.setAttribute('data', data);
  });

  await withSpan(tracer, 'artificial-delay', async (span) => {
    const timeout = 500;
    span.setAttribute('timeout', timeout);
    await new Promise((res) => setTimeout(res, timeout));
  });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <p>This is a slow page.</p>

        <p>
          Back to the{' '}
          <Link href="/" className="text-blue-500">
            home page
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
