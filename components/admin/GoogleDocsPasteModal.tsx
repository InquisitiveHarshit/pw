"use client";

import React, { useState } from "react";

/* ─── Props ─────────────────────────────────────────────────────────────────── */

interface GoogleDocsPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called with the raw HTML string when the user clicks "Populate Blog Form" */
  onParse: (html: string) => void;
}

/* ─── Mapping rules shown in the collapsible table ──────────────────────────── */

const HTML_RULES = [
  {
    tag: "<h1>",
    mapsTo: "Title",
    example: "<h1>Why Group Buying Works</h1>",
    note: "Becomes the blog post title.",
  },
  {
    tag: "<p> before first <h2>",
    mapsTo: "Excerpt (auto)",
    example: "<p>A short intro paragraph...</p>",
    note: "First paragraph auto-fills the excerpt if not set explicitly.",
  },
  {
    tag: "<h2>, <h3>, <p>, <ul>, <ol>…",
    mapsTo: "Content (rich HTML)",
    example: "<h2>Section</h2><p>Text...</p>",
    note: "All body HTML goes into the content field as-is.",
  },
  {
    tag: "Title:- …",
    mapsTo: "Title (inline override)",
    example: "<p>Title:- My Blog Title</p>",
    note: 'Use "Field:- Value" on its own line.',
  },
  {
    tag: "Excerpt:- …",
    mapsTo: "Excerpt",
    example: "<p>Excerpt:- A one-line summary.</p>",
    note: null,
  },
  {
    tag: "Tags:- …",
    mapsTo: "Tags (comma-separated)",
    example: "<p>Tags:- real estate, investment</p>",
    note: null,
  },
  {
    tag: "Keywords:- …",
    mapsTo: "Tags (alias)",
    example: "<p>Keywords:- group buying, 2025</p>",
    note: null,
  },
];

/* ─── Tiny inline SVG icons (no lucide-react dependency) ────────────────────── */

const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconCode = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);
const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconZap = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IconInfo = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
const IconChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconChevronUp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

/* ─── Component ─────────────────────────────────────────────────────────────── */

type Step = "paste" | "preview";

export default function GoogleDocsPasteModal({
  isOpen,
  onClose,
  onParse,
}: GoogleDocsPasteModalProps) {
  const [inputHtml, setInputHtml] = useState("");
  const [step, setStep] = useState<Step>("paste");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(false);

  if (!isOpen) return null;

  /* handlers */
  const handleContinue = () => {
    if (!inputHtml.trim()) {
      setErrorMsg("Please paste some HTML content before continuing.");
      return;
    }
    setErrorMsg(null);
    setStep("preview");
  };

  const handlePopulate = () => {
    onParse(inputHtml.trim());
    handleClose();
  };

  const handleClose = () => {
    setInputHtml("");
    setErrorMsg(null);
    setStep("paste");
    setShowRules(false);
    onClose();
  };

  const handleBack = () => setStep("paste");

  /* ── RENDER ─────────────────────────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal shell */}
      <div
        className="relative bg-white rounded-2xl border border-[#C7C0AE]/30 shadow-2xl w-full max-w-5xl z-10 flex flex-col"
        style={{ height: "90vh" }}
      >
        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-[#C7C0AE]/20 px-6 py-4 shrink-0">
          <div className="flex items-center gap-4">
            <h3 className="text-base font-extrabold text-[#313131] font-vietnam">
              {step === "paste" ? "📄 Paste HTML Content" : "👁 Preview & Confirm"}
            </h3>

            {/* Step indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold">
              <span
                className={`px-2.5 py-1 rounded-full transition-colors ${
                  step === "paste"
                    ? "bg-[#FFA100] text-[#313131]"
                    : "bg-[#F5F4F0] text-[#313131]/40"
                }`}
              >
                1. Paste
              </span>
              <span className="text-[#313131]/30">→</span>
              <span
                className={`px-2.5 py-1 rounded-full transition-colors ${
                  step === "preview"
                    ? "bg-[#FFA100] text-[#313131]"
                    : "bg-[#F5F4F0] text-[#313131]/40"
                }`}
              >
                2. Preview & Confirm
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-[#313131]/40 hover:text-[#313131] hover:bg-[#F5F4F0] transition-colors"
          >
            <IconX />
          </button>
        </div>

        {/* ══════════ STEP 1: PASTE ══════════ */}
        {step === "paste" && (
          <>
            <div className="px-6 pt-4 shrink-0 space-y-3">

              {/* How-to tip */}
              <div className="bg-[#FFA100]/8 border border-[#FFA100]/25 rounded-xl p-4 text-xs text-[#313131]/60 space-y-1">
                <p className="font-bold text-[#FFA100] uppercase tracking-wider text-[10px]">
                  How to get HTML from Google Docs
                </p>
                <p>
                  Go to{" "}
                  <strong className="text-[#313131]">
                    File → Download → Web Page (.html, zipped)
                  </strong>{" "}
                  → Unzip → open the{" "}
                  <code className="bg-[#F5F4F0] px-1 rounded">.html</code> in
                  Notepad → Select All → Copy → Paste below.
                </p>
                <p className="text-[#313131]/40 text-[10px] mt-1">
                  Or you can paste a hand-crafted HTML snippet directly.
                </p>
              </div>

              {/* Collapsible rules table */}
              <button
                type="button"
                onClick={() => setShowRules((v) => !v)}
                className="w-full flex items-center justify-between bg-[#F5F4F0] border border-[#C7C0AE]/30 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#313131]/60 hover:text-[#313131] hover:border-[#FFA100]/40 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <IconInfo />
                  HTML → Field mapping rules
                </span>
                {showRules ? <IconChevronUp /> : <IconChevronDown />}
              </button>

              {showRules && (
                <div className="bg-[#FAF1E6]/60 border border-[#C7C0AE]/30 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto max-h-56 overflow-y-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#C7C0AE]/20 text-[10px] uppercase tracking-widest text-[#313131]/40">
                          <th className="text-left px-4 py-2.5 font-bold w-[28%]">HTML / Format</th>
                          <th className="text-left px-4 py-2.5 font-bold w-[18%]">Maps To</th>
                          <th className="text-left px-4 py-2.5 font-bold w-[30%]">Example</th>
                          <th className="text-left px-4 py-2.5 font-bold w-[24%]">Note</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#C7C0AE]/10">
                        {HTML_RULES.map((r, i) => (
                          <tr key={i} className="hover:bg-[#FFA100]/5 transition-colors">
                            <td className="px-4 py-2.5">
                              <code className="bg-[#FFA100]/10 text-[#313131] px-1.5 py-0.5 rounded text-[10px] font-mono">
                                {r.tag}
                              </code>
                            </td>
                            <td className="px-4 py-2.5 font-bold text-[#313131]/80">{r.mapsTo}</td>
                            <td className="px-4 py-2.5">
                              <code className="text-[#313131]/40 font-mono text-[10px] break-all">{r.example}</code>
                            </td>
                            <td className="px-4 py-2.5 text-[#313131]/40">{r.note || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm font-semibold">
                  {errorMsg}
                </div>
              )}
            </div>

            {/* Textarea */}
            <div className="flex-1 flex flex-col px-6 pb-4 pt-3 min-h-0 gap-2">
              <div className="flex items-center gap-2 shrink-0">
                <IconCode />
                <label className="text-xs uppercase tracking-wider font-bold text-[#FFA100]">
                  Paste HTML Here
                </label>
                {inputHtml && (
                  <span className="ml-auto text-xs text-[#313131]/30">
                    {inputHtml.length.toLocaleString()} characters
                  </span>
                )}
              </div>
              <textarea
                className="flex-1 bg-[#F5F4F0] border border-[#C7C0AE]/40 rounded-xl p-4 text-sm text-[#313131]/80 font-mono focus:outline-none focus:border-[#FFA100] transition-colors resize-none leading-relaxed"
                placeholder={`<h1>Why Group Buying is the Future of Real Estate</h1>\n<p>Tags:- real estate, investment, 2025</p>\n<p>Excerpt:- A short compelling summary here.</p>\n\n<h2>Introduction</h2>\n<p>Group buying pools resources from multiple buyers...</p>\n<ul>\n  <li>Lower entry cost</li>\n  <li>Shared due diligence</li>\n</ul>`}
                value={inputHtml}
                onChange={(e) => setInputHtml(e.target.value)}
                spellCheck={false}
              />
            </div>

            {/* Footer */}
            <div className="border-t border-[#C7C0AE]/20 px-6 py-4 shrink-0 flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl border border-[#C7C0AE]/40 text-[#313131]/60 font-bold text-xs uppercase hover:text-[#313131] hover:border-[#313131]/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleContinue}
                disabled={!inputHtml.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#313131] hover:bg-[#FFA100] hover:text-[#313131] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue to Preview <IconArrow />
              </button>
            </div>
          </>
        )}

        {/* ══════════ STEP 2: PREVIEW ══════════ */}
        {step === "preview" && (
          <>
            <div className="flex-1 min-h-0 flex flex-col md:flex-row">

              {/* Left: Raw HTML code */}
              <div className="flex flex-col w-full md:w-2/5 border-r border-[#C7C0AE]/20 min-h-0">
                <div className="flex items-center gap-2 px-6 py-3 border-b border-[#C7C0AE]/10 shrink-0 bg-[#F5F4F0]/60">
                  <IconCode />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#313131]/40">Raw HTML</span>
                  <span className="ml-auto text-xs text-[#313131]/25">
                    {inputHtml.length.toLocaleString()} chars
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <pre className="text-[11px] text-[#313131]/40 font-mono whitespace-pre-wrap break-all leading-relaxed">
                    {inputHtml}
                  </pre>
                </div>
              </div>

              {/* Right: Rendered preview */}
              <div className="flex flex-col w-full md:w-3/5 min-h-0">
                <div className="flex items-center gap-2 px-6 py-3 border-b border-[#C7C0AE]/10 shrink-0">
                  <IconEye />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FFA100]">Rendered Preview</span>
                  <span className="ml-auto text-xs text-[#313131]/30">
                    Confirm this looks correct before populating
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto px-8 py-6">
                  <div
                    className="
                      max-w-none text-[#313131]/80
                      [&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-[#313131] [&_h1]:mb-4 [&_h1]:mt-2 [&_h1]:leading-tight [&_h1]:font-vietnam
                      [&_h2]:text-lg [&_h2]:font-extrabold [&_h2]:text-[#FFA100] [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:border-b [&_h2]:border-[#C7C0AE]/20 [&_h2]:pb-1 [&_h2]:font-vietnam
                      [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-[#313131] [&_h3]:mb-2 [&_h3]:mt-5
                      [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-[#313131]/80 [&_h4]:mb-1 [&_h4]:mt-4
                      [&_p]:text-[#313131]/70 [&_p]:mb-3 [&_p]:leading-relaxed [&_p]:text-sm
                      [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:text-[#313131]/70 [&_ul]:text-sm
                      [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_ol]:text-[#313131]/70 [&_ol]:text-sm
                      [&_li]:mb-1
                      [&_strong]:text-[#313131] [&_strong]:font-bold
                      [&_em]:text-[#313131]/60 [&_em]:italic
                      [&_a]:text-[#FFA100] [&_a]:underline
                      [&_table]:w-full [&_table]:text-sm [&_table]:border-collapse [&_table]:mb-4
                      [&_td]:border [&_td]:border-[#C7C0AE]/30 [&_td]:p-2 [&_td]:text-[#313131]/60
                      [&_th]:border [&_th]:border-[#C7C0AE]/30 [&_th]:p-2 [&_th]:bg-[#FAF1E6] [&_th]:font-bold [&_th]:text-[#313131]/80
                      [&_hr]:border-[#C7C0AE]/30 [&_hr]:my-4
                      [&_blockquote]:border-l-4 [&_blockquote]:border-[#FFA100] [&_blockquote]:pl-4 [&_blockquote]:text-[#313131]/50 [&_blockquote]:italic
                      [&_code]:bg-[#F5F4F0] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[#313131] [&_code]:text-xs [&_code]:font-mono
                    "
                    dangerouslySetInnerHTML={{ __html: inputHtml }}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#C7C0AE]/20 px-6 py-4 shrink-0 flex items-center justify-between gap-3">
              <button
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl border border-[#C7C0AE]/40 text-[#313131]/60 font-bold text-xs uppercase hover:text-[#313131] hover:border-[#313131]/30 transition-colors"
              >
                ← Back & Edit
              </button>
              <button
                onClick={handlePopulate}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#313131] hover:bg-[#FFA100] hover:text-[#313131] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg"
              >
                <IconZap />
                Populate Blog Form
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
