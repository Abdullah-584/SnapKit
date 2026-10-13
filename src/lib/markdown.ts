import { marked } from 'marked';

/** Render first-party Markdown (trusted, authored in this repo) to HTML. */
export function renderMarkdown(markdown: string): string {
  marked.setOptions({ gfm: true, breaks: false });
  const result = marked.parse(markdown, { async: false });
  return typeof result === 'string' ? result : '';
}
