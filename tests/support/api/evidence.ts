import type { APIResponse, TestInfo } from '@playwright/test';

const MAX_TEXT_LENGTH = 5_000;

export async function readApiResponse(response: APIResponse) {
  const contentType = response.headers()['content-type'] ?? '';
  const text = await response.text();

  if (contentType.includes('json') || contentType.includes('javascript') || looksLikeJson(text)) {
    try {
      return JSON.parse(text);
    } catch (error) {
      return {
        parseError: error instanceof Error ? error.message : String(error),
        text: truncateText(text),
      };
    }
  }

  return {
    contentType,
    text: truncateText(text),
  };
}

export async function attachApiEvidence(
  testInfo: TestInfo,
  name: string,
  evidence: Record<string, unknown>
) {
  await testInfo.attach(`${name}.json`, {
    body: JSON.stringify(evidence, null, 2),
    contentType: 'application/json',
  });
}

function looksLikeJson(text: string) {
  const trimmed = text.trimStart();
  return trimmed.startsWith('{') || trimmed.startsWith('[');
}

function truncateText(text: string) {
  if (text.length <= MAX_TEXT_LENGTH) return text;

  return `${text.slice(0, MAX_TEXT_LENGTH)}\n... truncated ${text.length - MAX_TEXT_LENGTH} chars`;
}
