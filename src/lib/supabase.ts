import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export interface ClinicalAnalysis {
  id: string;
  user_id?: string;
  input_text: string;
  model_used: string;
  analysis_type: string;
  results: Record<string, any>;
  confidence_score?: number;
  created_at: string;
}

export interface ExtractedEntity {
  id: string;
  analysis_id: string;
  entity_text: string;
  entity_type: string;
  confidence: number;
  start_pos?: number;
  end_pos?: number;
  created_at: string;
}

export interface ModelPerformance {
  id: string;
  model_name: string;
  analysis_count: number;
  avg_confidence: number;
  total_entities_extracted: number;
  last_used: string;
  updated_at: string;
}

export interface BatchAnalysis {
  id: string;
  batch_name: string;
  total_documents: number;
  completed_documents: number;
  status: string;
  results_summary: Record<string, any>;
  created_at: string;
  completed_at?: string;
}
