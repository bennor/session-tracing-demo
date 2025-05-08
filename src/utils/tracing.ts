import type { Span, Tracer } from '@opentelemetry/api';

export async function withSpan<T extends Promise<unknown> = Promise<void>>(
  tracer: Tracer,
  operationName: string,
  operation: (span: Span) => T
) {
  const span = tracer.startSpan(operationName);
  try {
    return await operation(span);
  } finally {
    span.end();
  }
}
