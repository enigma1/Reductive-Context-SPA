/* File: src/services/api/sse.ts
  stream message handling for SSE routes
 */
import { codeStoreActions } from '>/services/stores';
import { handleApiError } from './apiErrorsDialog';

export type StreamMessage = {
  content?: string;
  node?: string;
  done?: boolean;
  error?: string;
  [key: string]: unknown;
};

export const streamPost = async <TData>(
  route: string,
  data: TData,
  onMessage: (msg: StreamMessage) => void,
) => {
  return fetch(route, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  }).then(async (res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    const pump = async (): Promise<void> => {
      const { done, value } = await reader.read();

      if (done) {
        return;
      }

      buffer += decoder.decode(value, { stream: true });
      const frames = buffer.split(/\r?\n\r?\n/);
      buffer = frames.pop() ?? '';

      for (const frame of frames) {
        if (!frame.startsWith('data:')) continue;

        const json = frame.slice(5).trim();
        if (!json) continue;

        onMessage(JSON.parse(json) as StreamMessage);
      }

      return pump();
    };

    await pump();
  });
};

export const bundlePostResponse = (msg: StreamMessage) => {
  if (msg.error) {
    codeStoreActions.setBundleStream('error');
    handleApiError(
      {
        name: 'Bundle Stream',
        error: 'Stream Error',
        message: msg.error,
      },
      'stream',
    );
    return;
  }
  if (msg.done) {
    codeStoreActions.setBundleStream('done');
    return;
  }
  codeStoreActions.setBundleResponse(msg.content ?? '');
};
