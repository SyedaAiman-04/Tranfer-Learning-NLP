import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

/**
 * Clinical NLP Analysis Edge Function
 * 
 * This function simulates advanced NLP analysis for breast cancer clinical texts.
 * In production, this would integrate with actual transformer models (BioBERT, ClinicalBERT, PubMedBERT)
 * via APIs like Hugging Face Inference API or deployed model endpoints.
 * 
 * Features:
 * - Named Entity Recognition (NER) for clinical entities
 * - Text Summarization
 * - Question Answering
 * - Multi-model comparison
 */

interface NERRequest {
  text: string;
  model: string;
  confidenceThreshold?: number;
}

interface SummarizationRequest {
  text: string;
  model: string;
}

interface QARequest {
  text: string;
  question: string;
  model: string;
}

interface ComparisonRequest {
  text: string;
}

// Simulated NER extraction with medical domain patterns
function extractEntities(text: string, model: string, threshold = 0.5) {
  const entities: Array<{
    text: string;
    type: string;
    confidence: number;
    start: number;
    end: number;
  }> = [];

  // Tumor characteristics patterns
  const tumorPatterns = [
    { regex: /\d+\.?\d*\s*(cm|mm|centimeter|millimeter)/gi, type: 'TUMOR_SIZE' },
    { regex: /invasive\s+ductal\s+carcinoma/gi, type: 'TUMOR_TYPE' },
    { regex: /infiltrating\s+lobular\s+carcinoma/gi, type: 'TUMOR_TYPE' },
    { regex: /ductal\s+carcinoma\s+in\s+situ/gi, type: 'TUMOR_TYPE' },
    { regex: /DCIS/g, type: 'TUMOR_TYPE' },
    { regex: /triple[-\s]negative/gi, type: 'TUMOR_CLASSIFICATION' },
  ];

  // Receptor status patterns
  const receptorPatterns = [
    { regex: /ER[\s-]positive|estrogen\s+receptor\s+positive/gi, type: 'RECEPTOR_STATUS' },
    { regex: /ER[\s-]negative|estrogen\s+receptor\s+negative/gi, type: 'RECEPTOR_STATUS' },
    { regex: /PR[\s-]positive|progesterone\s+receptor\s+positive/gi, type: 'RECEPTOR_STATUS' },
    { regex: /PR[\s-]negative|progesterone\s+receptor\s+negative/gi, type: 'RECEPTOR_STATUS' },
    { regex: /HER2[\s-]positive|HER2\+/gi, type: 'RECEPTOR_STATUS' },
    { regex: /HER2[\s-]negative|HER2-/gi, type: 'RECEPTOR_STATUS' },
  ];

  // Stage and grade patterns
  const stagePatterns = [
    { regex: /stage\s+(I{1,3}|IV|[1-4])[ABC]?/gi, type: 'STAGE' },
    { regex: /grade\s+([1-3]|I{1,3})/gi, type: 'GRADE' },
    { regex: /T[1-4][a-c]?N[0-3]M[0-1]/gi, type: 'TNM_STAGE' },
  ];

  // Treatment patterns
  const treatmentPatterns = [
    { regex: /chemotherapy/gi, type: 'TREATMENT' },
    { regex: /radiation\s+therapy|radiotherapy/gi, type: 'TREATMENT' },
    { regex: /mastectomy|lumpectomy|breast[-\s]conserving\s+surgery/gi, type: 'TREATMENT' },
    { regex: /tamoxifen|anastrozole|letrozole|exemestane/gi, type: 'MEDICATION' },
    { regex: /trastuzumab|pertuzumab|paclitaxel|doxorubicin/gi, type: 'MEDICATION' },
  ];

  // Demographics
  const demoPatterns = [
    { regex: /\b\d{1,3}[-\s]year[-\s]old/gi, type: 'AGE' },
    { regex: /female|male/gi, type: 'GENDER' },
  ];

  const allPatterns = [
    ...tumorPatterns,
    ...receptorPatterns,
    ...stagePatterns,
    ...treatmentPatterns,
    ...demoPatterns,
  ];

  // Model-specific confidence adjustments
  const modelBonus = {
    'BioBERT': 0.05,
    'ClinicalBERT': 0.08,
    'PubMedBERT': 0.03,
  }[model] || 0;

  allPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.regex.exec(text)) !== null) {
      const baseConfidence = 0.75 + Math.random() * 0.20;
      const confidence = Math.min(0.99, baseConfidence + modelBonus);
      
      if (confidence >= threshold) {
        entities.push({
          text: match[0],
          type: pattern.type,
          confidence: Number(confidence.toFixed(4)),
          start: match.index,
          end: match.index + match[0].length,
        });
      }
    }
  });

  return entities;
}

// Simulated text summarization
function summarizeText(text: string, model: string) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Extract key sentences (in production, this would use actual transformer models)
  const summaryLength = Math.max(2, Math.floor(sentences.length * 0.3));
  const summary = sentences.slice(0, summaryLength).join('. ') + '.';
  
  const originalWords = text.split(/\s+/).length;
  const summaryWords = summary.split(/\s+/).length;
  const compressionRatio = ((1 - summaryWords / originalWords) * 100).toFixed(1);

  return {
    summary,
    originalLength: text.length,
    summaryLength: summary.length,
    originalWords,
    summaryWords,
    compressionRatio: `${compressionRatio}%`,
  };
}

// Simulated question answering
function answerQuestion(text: string, question: string, model: string) {
  const lowerText = text.toLowerCase();
  const lowerQuestion = question.toLowerCase();
  
  // Simple pattern matching for demo (production would use actual QA models)
  let answer = 'Unable to find answer in the provided text.';
  let confidence = 0.0;
  let context = '';

  // Tumor size questions
  if (lowerQuestion.includes('size') || lowerQuestion.includes('large')) {
    const sizeMatch = text.match(/\d+\.?\d*\s*(cm|mm)/i);
    if (sizeMatch) {
      answer = sizeMatch[0];
      confidence = 0.92;
      const index = text.indexOf(sizeMatch[0]);
      context = text.substring(Math.max(0, index - 50), Math.min(text.length, index + 100));
    }
  }
  
  // Receptor status questions
  if (lowerQuestion.includes('receptor') || lowerQuestion.includes('er') || lowerQuestion.includes('her2')) {
    const receptorMatch = text.match(/(ER|PR|HER2)[\s-](positive|negative|\+|-)/i);
    if (receptorMatch) {
      answer = receptorMatch[0];
      confidence = 0.89;
      const index = text.indexOf(receptorMatch[0]);
      context = text.substring(Math.max(0, index - 50), Math.min(text.length, index + 100));
    }
  }
  
  // Stage questions
  if (lowerQuestion.includes('stage')) {
    const stageMatch = text.match(/stage\s+(I{1,3}|IV|[1-4])[ABC]?/i);
    if (stageMatch) {
      answer = stageMatch[0];
      confidence = 0.87;
      const index = text.indexOf(stageMatch[0]);
      context = text.substring(Math.max(0, index - 50), Math.min(text.length, index + 100));
    }
  }
  
  // Treatment questions
  if (lowerQuestion.includes('treatment') || lowerQuestion.includes('therapy')) {
    const treatmentMatch = text.match(/(chemotherapy|radiation therapy|mastectomy|lumpectomy)/i);
    if (treatmentMatch) {
      answer = treatmentMatch[0];
      confidence = 0.85;
      const index = text.indexOf(treatmentMatch[0]);
      context = text.substring(Math.max(0, index - 50), Math.min(text.length, index + 100));
    }
  }

  return {
    question,
    answer,
    confidence: Number(confidence.toFixed(4)),
    context: context.trim() || text.substring(0, 150) + '...',
    model,
  };
}

// Multi-model comparison
function compareModels(text: string) {
  const models = ['BioBERT', 'ClinicalBERT', 'PubMedBERT'];
  
  const results = models.map(model => {
    const entities = extractEntities(text, model, 0.5);
    const avgConfidence = entities.length > 0
      ? entities.reduce((sum, e) => sum + e.confidence, 0) / entities.length
      : 0;
    
    return {
      model,
      entityCount: entities.length,
      avgConfidence: Number(avgConfidence.toFixed(4)),
      entities,
      entityTypes: [...new Set(entities.map(e => e.type))],
    };
  });
  
  // Determine best model
  const bestModel = results.reduce((best, current) => {
    const bestScore = best.entityCount * best.avgConfidence;
    const currentScore = current.entityCount * current.avgConfidence;
    return currentScore > bestScore ? current : best;
  });
  
  return {
    models: results,
    recommendation: {
      model: bestModel.model,
      reason: `Highest performance with ${bestModel.entityCount} entities extracted at ${(bestModel.avgConfidence * 100).toFixed(1)}% average confidence`,
    },
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { type, ...params } = await req.json();

    let result;

    switch (type) {
      case 'ner':
        const nerParams = params as NERRequest;
        const entities = extractEntities(
          nerParams.text,
          nerParams.model,
          nerParams.confidenceThreshold
        );
        const avgConfidence = entities.length > 0
          ? entities.reduce((sum, e) => sum + e.confidence, 0) / entities.length
          : 0;
        
        result = {
          entities,
          entityCount: entities.length,
          avgConfidence: Number(avgConfidence.toFixed(4)),
          entityTypes: [...new Set(entities.map(e => e.type))],
        };
        break;

      case 'summarization':
        const sumParams = params as SummarizationRequest;
        result = summarizeText(sumParams.text, sumParams.model);
        break;

      case 'qa':
        const qaParams = params as QARequest;
        result = answerQuestion(qaParams.text, qaParams.question, qaParams.model);
        break;

      case 'comparison':
        const compParams = params as ComparisonRequest;
        result = compareModels(compParams.text);
        break;

      default:
        throw new Error('Invalid analysis type');
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});