/**
 * htmlParser.ts — PW Blog HTML Parser
 *
 * Parses raw HTML (e.g. from Google Docs export) into the PW BlogForm schema:
 *   { title, excerpt, content, tags, isPublished }
 *
 * Uses native browser DOMParser — no external libraries.
 */

export interface PwParsedResult {
  title: string;
  excerpt: string;
  /** Full HTML content string — stored verbatim in the content field */
  content: string;
  /** Comma-separated tags string */
  tags: string;
}

/**
 * Inline metadata fields recognised on any <p> tag.
 *
 * Supported formats (case-insensitive, flexible separator):
 *   Title:- My Title
 *   Excerpt:- Short summary
 *   Tags:- investment, real estate, 2025
 */
const INLINE_FIELD_REGEX =
  /^(Title|Excerpt|Tags|Description|Summary|Keywords?)[\\s*]*[:\\-]+\\s*(.+)$/i;

/**
 * Parse raw HTML into { title, excerpt, content, tags }.
 *
 * Strategy:
 *  - <h1>             → title  (also accepted as "Title:- …" inline)
 *  - <p> before <h2>  → intro / excerpt accumulation
 *  - Entire body HTML → content (cleaned of meta charset noise)
 *  - Inline field tags on <p> → title / excerpt / tags overrides
 *
 * The `content` field receives the full cleaned innerHTML so it can be
 * stored as rich HTML and rendered with dangerouslySetInnerHTML on the
 * public blog page.
 */
export function parseGoogleDocsHtml(htmlString: string): PwParsedResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  const result: PwParsedResult = {
    title: "",
    excerpt: "",
    content: "",
    tags: "",
  };

  // ── 1. Strip Google Docs noise ────────────────────────────────────────────
  // Remove <meta>, <style>, <script> tags that come with the .html export
  doc.querySelectorAll("meta, style, script, link").forEach((el) => el.remove());

  // Remove empty spans (Google Docs wraps everything in nested spans)
  doc.querySelectorAll("span:empty").forEach((el) => el.remove());

  const body = doc.body;
  const nodes = Array.from(body.childNodes) as HTMLElement[];

  let foundH2 = false; // track whether we've seen the first section heading
  const introParagraphs: string[] = [];

  for (const node of nodes) {
    if (node.nodeType !== Node.ELEMENT_NODE) continue;

    const tag = node.tagName.toLowerCase();
    const plainText = node.textContent?.trim() || "";
    if (!plainText && tag !== "img" && tag !== "hr" && tag !== "br") continue;

    // ── Inline field detection ────────────────────────────────────────────
    if (tag === "p" || tag === "div" || tag === "span") {
      const m = plainText.match(INLINE_FIELD_REGEX);
      if (m) {
        const key = m[1].toLowerCase();
        const value = m[2].trim();

        if (key === "title") {
          if (!result.title) result.title = value;
        } else if (key === "excerpt" || key === "description" || key === "summary") {
          if (!result.excerpt) result.excerpt = value;
        } else if (key.startsWith("tag") || key.startsWith("keyword")) {
          if (!result.tags) result.tags = value;
        }
        // Remove this node from body so it doesn't end up in content
        node.remove();
        continue;
      }
    }

    // ── H1 → title ───────────────────────────────────────────────────────
    if (tag === "h1") {
      if (!result.title) result.title = plainText;
      // Keep in content so the article still has its heading
      continue;
    }

    // ── Track first H2 to know when we've left the intro zone ────────────
    if (tag === "h2") {
      foundH2 = true;
      continue; // keep in content
    }

    // ── Paragraphs before first H2 accumulate as excerpt candidates ───────
    if (!foundH2 && (tag === "p")) {
      introParagraphs.push(plainText);
    }
  }

  // ── 2. Auto-populate excerpt from first intro paragraph if not set ──────
  if (!result.excerpt && introParagraphs.length > 0) {
    // Use first non-empty paragraph as excerpt (truncate to 200 chars)
    const first = introParagraphs[0];
    result.excerpt = first.length > 200 ? first.slice(0, 197) + "…" : first;
  }

  // ── 3. Build content from remaining cleaned body HTML ───────────────────
  // Re-parse to get the cleaned HTML (after removals above)
  const cleanedBody = doc.body.innerHTML
    // Collapse excessive whitespace inside tags
    .replace(/\s{2,}/g, " ")
    // Remove Google-specific class/style noise (optional light clean)
    .replace(/\s*class="[^"]*"/g, "")
    .replace(/\s*style="[^"]*"/g, "")
    .trim();

  result.content = cleanedBody;

  return result;
}
