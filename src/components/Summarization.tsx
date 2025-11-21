import { useState } from 'react';
import { Play, Download, Loader2, AlertCircle, FileText } from 'lucide-react';
import TextInput from './TextInput';
import { performSummarization } from '../lib/api';
import { supabase } from '../lib/supabase';
import { exportAsJSON } from '../lib/utils';

export default function Summarization() {
  const [inputText, setInputText] = useState('');
  const [model, setModel] = useState('ClinicalBERT');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to summarize');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await performSummarization(inputText, model);
      setResult(data);

      await supabase.from('clinical_analyses').insert({
        input_text: inputText,
        model_used: model,
        analysis_type: 'Summarization',
        results: data,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Summarization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Text Summarization</h2>
        <p className="text-gray-600 mb-6">
          Automatically summarize lengthy clinical notes and research papers
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Selection
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

          <div className="flex items-end">
            <button
              onClick={handleSummarize}
              disabled={loading}
              className="w-full bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Summarizing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Summarize</span>
                </>
              )}
            </button>
          </div>
        </div>

        <TextInput
          value={inputText}
          onChange={setInputText}
          placeholder="Enter clinical text to summarize..."
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Original Words</div>
              <div className="text-3xl font-bold text-blue-600">{result.originalWords}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Summary Words</div>
              <div className="text-3xl font-bold text-green-600">{result.summaryWords}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Compression</div>
              <div className="text-3xl font-bold text-purple-600">{result.compressionRatio}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Model Used</div>
              <div className="text-lg font-bold text-orange-600 truncate">{model}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <span>Summary</span>
              </h3>
              <button
                onClick={() => exportAsJSON(result, 'summary-result.json')}
                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
            <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
              <p className="text-gray-800 leading-relaxed">{result.summary}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Original Text</h3>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">{inputText}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
