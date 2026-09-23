import { z } from "zod";

/**
 * D2 PATCH (PACKAGE_A §2.2) — the lexicon check type, abide's FIRST scored check.
 *
 * This file is a VENDOR-SIDE PATCH FILE, not upstream abide. Upstream check types
 * are lint | model | deferred | unenforceable (packages/schema/src/rubric.ts:105);
 * abide has ZERO lexicon hits (F-1: grep -rn "lexicon" packages/ --include=*.ts -> 0).
 * This variant lets the rubric express a scored, deterministic, locally-decided rule:
 * the weights ARE the question, the band is DERIVED (recorded in derivedFrom), and a
 * missing use: bank is rejected here AND thrown with the rule id by the engine's
 * loadRules (LEXICON_NO_USE) — never a silent default.
 *
 * Wiring: schema/rubric.ts carries a 2-line patch (the import + the union member).
 */

const bankSchema = z.array(z.string().min(1));

const instructionsSchema = z.string().min(1).max(2000);

/**
 * The lexicon weights as a check "question". The field semantics are the seam's
 * (SEAM/seam.ts PatternFamily): descriptive neg+=1 · suggestive pos+=2 (or +1
 * without \b) · substitute pos+=2 · use neg+=3; confidence = pos/(pos+neg+1).
 */
export const lexiconQuestionSchema = z.object({
  /** neg += 1 — the legitimate co-context. */
  descriptive: bankSchema.default([]),
  /** pos += 2 per \b-bearing pattern hit, else pos += 1 — the violation shape. */
  suggestive: bankSchema.min(1),
  /** pos += 2 — the theatrical tell. */
  substitute: bankSchema.default([]),
  /** neg += 3 — THE EXEMPTOR. MANDATORY: min(1) at the schema level, and
   * loadRules THROWS LEXICON_NO_USE (naming the rule id) before this parses. */
  use: bankSchema.min(1),
});
export type LexiconQuestion = z.infer<typeof lexiconQuestionSchema>;

export const lexiconBandSchema = z
  .object({
    low: z.number().min(0).max(1),
    high: z.number().min(0).max(1),
  })
  .refine((b) => b.high > b.low, "high must exceed low");
export type LexiconBand = z.infer<typeof lexiconBandSchema>;

/** DERIVED-band provenance — recorded so an inherited band is visible as a mismatch. */
export const lexiconDerivedFromSchema = z.object({
  minPositive: z.number().min(0).max(1),
  maxNegative: z.number().min(0).max(1),
  positives: z.number().int().min(1),
  negatives: z.number().int().min(1),
});
export type LexiconDerivedFrom = z.infer<typeof lexiconDerivedFromSchema>;

export const lexiconCheckSchema = z.object({
  type: z.literal("lexicon"),
  /** The scored question — the weights ARE the question. */
  question: lexiconQuestionSchema,
  /** The rule text / correction body. */
  instructions: instructionsSchema,
  /** DERIVED from the labeled corpus — never inherited. */
  band: lexiconBandSchema,
  derivedFrom: lexiconDerivedFromSchema.optional(),
});
export type LexiconCheck = z.infer<typeof lexiconCheckSchema>;
