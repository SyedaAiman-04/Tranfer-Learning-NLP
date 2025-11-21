/**
 * API utilities for Clinical NLP Analysis
 *
 * This module handles all interactions with the Supabase Edge Function
 * and database operations for clinical text analysis.
 */

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/clinical-nlp-analysis`;

const headers = {
  'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

export interface NERResult {
  entities: Array<{
    text: string;
    type: string;
    confidence: number;
    start: number;
    end: number;
  }>;
  entityCount: number;
  avgConfidence: number;
  entityTypes: string[];
}

export interface SummarizationResult {
  summary: string;
  originalLength: number;
  summaryLength: number;
  originalWords: number;
  summaryWords: number;
  compressionRatio: string;
}

export interface QAResult {
  question: string;
  answer: string;
  confidence: number;
  context: string;
  model: string;
}

export interface ComparisonResult {
  models: Array<{
    model: string;
    entityCount: number;
    avgConfidence: number;
    entities: Array<{
      text: string;
      type: string;
      confidence: number;
      start: number;
      end: number;
    }>;
    entityTypes: string[];
  }>;
  recommendation: {
    model: string;
    reason: string;
  };
}

export async function performNER(
  text: string,
  model: string,
  confidenceThreshold = 0.5
): Promise<NERResult> {
  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      type: 'ner',
      text,
      model,
      confidenceThreshold,
    }),
  });

  if (!response.ok) {
    throw new Error('NER analysis failed');
  }

  const result = await response.json();
  return result.data;
}

export async function performSummarization(
  text: string,
  model: string
): Promise<SummarizationResult> {
  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      type: 'summarization',
      text,
      model,
    }),
  });

  if (!response.ok) {
    throw new Error('Summarization failed');
  }

  const result = await response.json();
  return result.data;
}

export async function performQA(
  text: string,
  question: string,
  model: string
): Promise<QAResult> {
  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      type: 'qa',
      text,
      question,
      model,
    }),
  });

  if (!response.ok) {
    throw new Error('Question answering failed');
  }

  const result = await response.json();
  return result.data;
}

export async function performComparison(text: string): Promise<ComparisonResult> {
  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      type: 'comparison',
      text,
    }),
  });

  if (!response.ok) {
    throw new Error('Model comparison failed');
  }

  const result = await response.json();
  return result.data;
}
