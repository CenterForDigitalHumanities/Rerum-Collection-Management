/**
 * Test Fixtures — Expressions
 */

import type { Expression } from "../core/types";

/** Transcription of a letter. */
export const transcriptionExpression: Expression = {
  "@id": "tag:rcm.example,2026:expr/letter-1918-001-transcription",
  "@type": "rcm:Expression",
  "rdfs:label": "Line-by-line transcription of letter (1918)",
  "rcm:expresses": "tag:rcm.example,2026:thing/letter-1918-001",
  "rcm:mode": "transcription",
  "dcterms:creator": "tag:rcm.example,2026:agent/transcriber-001",
  "dcterms:created": "2026-06-20T10:00:00Z",
};

/** OCR-generated text layer. */
export const ocrExpression: Expression = {
  "@id": "tag:rcm.example,2026:expr/letter-1918-001-ocr",
  "@type": "rcm:Expression",
  "rdfs:label": "OCR text layer for letter scan",
  "rcm:expresses": "tag:rcm.example,2026:thing/letter-1918-001",
  "rcm:mode": "ocr",
  "dcterms:creator": "tag:rcm.example,2026:agent/ocr-pipeline-001",
  "dcterms:created": "2026-06-21T14:32:00Z",
};

/** Translation of a foreign-language document. */
export const translationExpression: Expression = {
  "@id": "tag:rcm.example,2026:expr/letter-1918-001-translation-en",
  "@type": "rcm:Expression",
  "rdfs:label": "English translation of letter (1918)",
  "rcm:expresses": "tag:rcm.example,2026:thing/letter-1918-001",
  "rcm:mode": "translation",
  "dcterms:creator": "tag:rcm.example,2026:agent/translator-001",
  "dcterms:created": "2026-06-22T09:15:00Z",
};

export const allExpressions: Expression[] = [
  transcriptionExpression,
  ocrExpression,
  translationExpression,
];
