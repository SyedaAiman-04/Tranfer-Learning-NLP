import { useState } from 'react';
import { Play, Loader2, AlertCircle, Trophy, TrendingUp } from 'lucide-react';
import TextInput from './TextInput';
import { performComparison } from '../lib/api';
import { getEntityColor, formatEntityType } from '../lib/utils';

export default function ModelComparison() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleCompare = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to analyze');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await performComparison(inputText);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Comparison failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Multi-Model Comparison</h2>
        <p className="text-gray-600 mb-6">
          Compare performance of BioBERT, ClinicalBERT, and PubMedBERT side by side
        </p>

        <div className="mb-6">
          <button
            onClick={handleCompare}
            disabled={loading}
            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Comparing Models...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Compare All Models</span>
              </>
            )}
          </button>
        </div>

        <TextInput
          value={inputText}
          onChange={setInputText}
          placeholder="Enter clinical text for model comparison..."
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
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-sm border border-purple-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Trophy className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">Recommended Model</h3>
            </div>
            <div className="p-6 bg-white rounded-lg border-2 border-purple-300">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {result.recommendation.model}
              </div>
              <p className="text-gray-700">{result.recommendation.reason}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {result.models.map((model: any, idx: number) => {
              const isRecommended = model.model === result.recommendation.model;
              const colors = [
                { bg: 'from-blue-50 to-blue-100', border: 'border-blue-300', text: 'text-blue-700' },
                { bg: 'from-teal-50 to-teal-100', border: 'border-teal-300', text: 'text-teal-700' },
                { bg: 'from-green-50 to-green-100', border: 'border-green-300', text: 'text-green-700' },
              ];
              const color = colors[idx];

              return (
                <div
                  key={model.model}
                  className={`bg-gradient-to-br ${color.bg} rounded-lg shadow-sm border-2 ${
                    isRecommended ? 'border-purple-500 ring-4 ring-purple-200' : color.border
                  } p-6 relative`}
                >
                  {isRecommended && (
                    <div className="absolute -top-3 -right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <Trophy className="w-3 h-3" />
                      <span>Best</span>
                    </div>
                  )}

                  <h3 className={`text-xl font-bold ${color.text} mb-4`}>{model.model}</h3>

                  <div className="space-y-3 bg-white rounded-lg p-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Entities Found</span>
                      <span className="font-bold text-gray-900">{model.entityCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Confidence</span>
                      <span className="font-bold text-gray-900">
                        {(model.avgConfidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Entity Types</span>
                      <span className="font-bold text-gray-900">{model.entityTypes.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Performance</span>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className={`w-4 h-4 ${color.text}`} />
                        <span className={`font-bold ${color.text}`}>
                          {((model.entityCount * model.avgConfidence) * 100).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-gray-600 mb-2">Entity Types Detected:</p>
                    <div className="flex flex-wrap gap-1">
                      {model.entityTypes.slice(0, 6).map((type: string, tidx: number) => (
                        <span
                          key={tidx}
                          className="px-2 py-1 bg-white rounded text-xs border border-gray-200"
                        >
                          {formatEntityType(type)}
                        </span>
                      ))}
                      {model.entityTypes.length > 6 && (
                        <span className="px-2 py-1 bg-white rounded text-xs border border-gray-200">
                          +{model.entityTypes.length - 6}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Entity Comparison</h3>
            <div className="space-y-6">
              {result.models.map((model: any) => (
                <div key={model.model} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-3">{model.model}</h4>
                  <div className="space-y-2">
                    {Object.entries(
                      model.entities.reduce((acc: any, e: any) => {
                        if (!acc[e.type]) acc[e.type] = [];
                        acc[e.type].push(e);
                        return acc;
                      }, {})
                    ).map(([type, entities]: [string, any]) => (
                      <div key={type}>
                        <p className="text-xs text-gray-600 mb-1">
                          {formatEntityType(type)} ({entities.length})
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {entities.slice(0, 5).map((entity: any, idx: number) => (
                            <span
                              key={idx}
                              className={`px-2 py-1 rounded text-xs ${getEntityColor(type)}`}
                            >
                              {entity.text}
                            </span>
                          ))}
                        </div>
                      </div>
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
