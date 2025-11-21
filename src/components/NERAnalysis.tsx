import { useState } from 'react';
import { Play, Download, Loader2, AlertCircle, CheckCircle, Info } from 'lucide-react';
import TextInput from './TextInput';
import { performNER } from '../lib/api';
import { supabase } from '../lib/supabase';
import { getEntityColor, formatEntityType, exportAsJSON, exportAsCSV, calculateCompletenessScore, generateInsights } from '../lib/utils';

export default function NERAnalysis() {
  const [inputText, setInputText] = useState('');
  const [model, setModel] = useState('ClinicalBERT');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to analyze');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await performNER(inputText, model, confidenceThreshold);
      setResult(data);

      await supabase.from('clinical_analyses').insert({
        input_text: inputText,
        model_used: model,
        analysis_type: 'NER',
        results: data,
        confidence_score: data.avgConfidence,
      });

      await supabase.from('extracted_entities').insert(
        data.entities.map((entity: any) => ({
          analysis_id: null,
          entity_text: entity.text,
          entity_type: entity.type,
          confidence: entity.confidence,
          start_pos: entity.start,
          end_pos: entity.end,
        }))
      );

      await supabase.rpc('execute_sql', {
        query: `
          UPDATE model_performance
          SET
            analysis_count = analysis_count + 1,
            avg_confidence = (avg_confidence * analysis_count + ${data.avgConfidence}) / (analysis_count + 1),
            total_entities_extracted = total_entities_extracted + ${data.entityCount},
            last_used = now(),
            updated_at = now()
          WHERE model_name = '${model}'
        `
      }).catch(() => {});

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const highlightedText = () => {
    if (!result || !result.entities.length) return inputText;

    const sortedEntities = [...result.entities].sort((a, b) => a.start - b.start);
    let highlighted = '';
    let lastIndex = 0;

    sortedEntities.forEach((entity: any) => {
      highlighted += inputText.substring(lastIndex, entity.start);
      highlighted += `<mark class="px-1 py-0.5 rounded ${getEntityColor(entity.type)} border" title="${formatEntityType(entity.type)} (${(entity.confidence * 100).toFixed(1)}%)">${entity.text}</mark>`;
      lastIndex = entity.end;
    });

    highlighted += inputText.substring(lastIndex);
    return highlighted;
  };

  const entityGroups = result?.entities.reduce((acc: any, entity: any) => {
    if (!acc[entity.type]) acc[entity.type] = [];
    acc[entity.type].push(entity);
    return acc;
  }, {}) || {};

  const completeness = result ? calculateCompletenessScore(result.entities) : null;
  const insights = result ? generateInsights(result.entities) : [];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Named Entity Recognition</h2>
        <p className="text-gray-600 mb-6">
          Extract biomedical entities from clinical breast cancer texts using advanced NER models
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Selection
              <span className="ml-2 text-xs text-gray-500">(hover for info)</span>
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="BioBERT">BioBERT</option>
              <option value="ClinicalBERT">ClinicalBERT</option>
              <option value="PubMedBERT">PubMedBERT</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confidence Threshold: {(confidenceThreshold * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
        </div>

        <TextInput
          value={inputText}
          onChange={setInputText}
          placeholder="Enter clinical text for NER analysis..."
        />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </div>

      {result && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Total Entities</div>
              <div className="text-3xl font-bold text-blue-600">{result.entityCount}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Avg Confidence</div>
              <div className="text-3xl font-bold text-green-600">
                {(result.avgConfidence * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Entity Types</div>
              <div className="text-3xl font-bold text-purple-600">{result.entityTypes.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Completeness</div>
              <div className="text-3xl font-bold text-orange-600">
                {completeness?.score.toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Highlighted Text</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => exportAsJSON(result, 'ner-results.json')}
                  className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>JSON</span>
                </button>
                <button
                  onClick={() => exportAsCSV(result.entities, 'ner-entities.csv')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>CSV</span>
                </button>
              </div>
            </div>
            <div
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlightedText() }}
            />
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg shadow-sm border border-blue-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Automated Clinical Insights</h3>
            </div>
            <div className="space-y-2">
              {insights.map((insight, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{insight}</span>
                </div>
              ))}
              {completeness && completeness.missing.length > 0 && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
                  <p className="text-sm text-amber-800 font-medium">Missing key attributes:</p>
                  <p className="text-xs text-amber-700 mt-1">
                    {completeness.missing.map(formatEntityType).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Entities by Category</h3>
            <div className="space-y-4">
              {Object.entries(entityGroups).map(([type, entities]: [string, any]) => (
                <div key={type} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {formatEntityType(type)} ({entities.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {entities.map((entity: any, idx: number) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-sm ${getEntityColor(type)} border`}
                      >
                        {entity.text}
                        <span className="ml-2 text-xs opacity-75">
                          {(entity.confidence * 100).toFixed(0)}%
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
