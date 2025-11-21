/**
 * Utility functions for the Clinical NLP application
 */

// Entity type colors for visualization
export const ENTITY_COLORS: Record<string, string> = {
  TUMOR_SIZE: 'bg-blue-100 text-blue-800 border-blue-300',
  TUMOR_TYPE: 'bg-purple-100 text-purple-800 border-purple-300',
  TUMOR_CLASSIFICATION: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  RECEPTOR_STATUS: 'bg-green-100 text-green-800 border-green-300',
  STAGE: 'bg-orange-100 text-orange-800 border-orange-300',
  GRADE: 'bg-amber-100 text-amber-800 border-amber-300',
  TNM_STAGE: 'bg-red-100 text-red-800 border-red-300',
  TREATMENT: 'bg-teal-100 text-teal-800 border-teal-300',
  MEDICATION: 'bg-cyan-100 text-cyan-800 border-cyan-300',
  AGE: 'bg-pink-100 text-pink-800 border-pink-300',
  GENDER: 'bg-rose-100 text-rose-800 border-rose-300',
};

// Format entity type for display
export function formatEntityType(type: string): string {
  return type
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

// Get color class for entity type
export function getEntityColor(type: string): string {
  return ENTITY_COLORS[type] || 'bg-gray-100 text-gray-800 border-gray-300';
}

// Export data as JSON
export function exportAsJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export data as CSV
export function exportAsCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        return `"${stringValue.replace(/"/g, '""')}"`;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Calculate completeness score for clinical data extraction
export function calculateCompletenessScore(entities: Array<{ type: string }>) {
  const requiredTypes = [
    'TUMOR_SIZE',
    'TUMOR_TYPE',
    'RECEPTOR_STATUS',
    'STAGE',
  ];

  const extractedTypes = new Set(entities.map(e => e.type));
  const matchedTypes = requiredTypes.filter(type => extractedTypes.has(type));

  return {
    score: (matchedTypes.length / requiredTypes.length) * 100,
    matched: matchedTypes.length,
    total: requiredTypes.length,
    missing: requiredTypes.filter(type => !extractedTypes.has(type)),
  };
}

// Generate automated insights
export function generateInsights(entities: Array<{ type: string; confidence: number }>) {
  const insights: string[] = [];
  const entityTypes = new Set(entities.map(e => e.type));
  const avgConfidence = entities.reduce((sum, e) => sum + e.confidence, 0) / entities.length;

  if (entityTypes.has('TUMOR_SIZE') && entityTypes.has('TUMOR_TYPE')) {
    insights.push('✓ Complete tumor characterization detected');
  }

  if (entityTypes.has('RECEPTOR_STATUS')) {
    const receptorCount = entities.filter(e => e.type === 'RECEPTOR_STATUS').length;
    if (receptorCount >= 3) {
      insights.push('✓ Comprehensive receptor panel identified');
    } else {
      insights.push('⚠ Partial receptor status information');
    }
  }

  if (entityTypes.has('STAGE') || entityTypes.has('TNM_STAGE')) {
    insights.push('✓ Cancer staging information present');
  } else {
    insights.push('⚠ No staging information detected');
  }

  if (entityTypes.has('TREATMENT') || entityTypes.has('MEDICATION')) {
    insights.push('✓ Treatment plan documented');
  }

  if (avgConfidence > 0.85) {
    insights.push('✓ High confidence extraction (>85%)');
  } else if (avgConfidence > 0.70) {
    insights.push('○ Moderate confidence extraction (70-85%)');
  } else {
    insights.push('⚠ Low confidence extraction (<70%)');
  }

  return insights;
}

// Example clinical texts for demonstration
export const EXAMPLE_TEXTS = {
  pathology: `A 58-year-old female presents with a 2.3 cm invasive ductal carcinoma in the upper outer quadrant of the left breast. Pathology reveals ER-positive, PR-positive, and HER2-negative status. The tumor is grade 2 with no lymphovascular invasion. Sentinel lymph node biopsy shows 0/3 nodes positive. Final staging is T2N0M0, Stage IIA. Treatment plan includes lumpectomy followed by adjuvant chemotherapy and radiation therapy.`,

  clinical: `Patient is a 45-year-old female diagnosed with triple-negative breast cancer. Initial presentation showed a 3.5 cm mass detected on mammography. Biopsy confirmed infiltrating ductal carcinoma, grade 3. Staging workup revealed T2N1M0, Stage IIB disease. The patient underwent neoadjuvant chemotherapy with doxorubicin and paclitaxel, followed by mastectomy. Pathological complete response was achieved.`,

  followup: `62-year-old female with history of Stage IIIA breast cancer (T3N2M0), ER-positive, PR-positive, HER2-positive. Previously treated with mastectomy, adjuvant chemotherapy, trastuzumab, and radiation therapy. Currently on anastrozole for hormonal therapy. Follow-up mammography and clinical examination show no evidence of recurrence at 24 months post-treatment.`,
};
