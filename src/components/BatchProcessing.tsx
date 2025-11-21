import { useState } from 'react';
import { Upload, Play, Loader2, AlertCircle, CheckCircle, Download, FileText } from 'lucide-react';
import { performNER } from '../lib/api';
import { supabase } from '../lib/supabase';
import { exportAsJSON, exportAsCSV } from '../lib/utils';

export default function BatchProcessing() {
  const [files, setFiles] = useState<File[]>([]);
  const [model, setModel] = useState('ClinicalBERT');
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    setResults([]);
    setProgress(0);
  };

  const handleBatchProcess = async () => {
    if (files.length === 0) {
      setError('Please select files to process');
      return;
    }

    setProcessing(true);
    setError('');
    const batchResults: any[] = [];

    const { data: batchRecord } = await supabase
      .from('batch_analyses')
      .insert({
        batch_name: `Batch ${new Date().toLocaleString()}`,
        total_documents: files.length,
        status: 'processing',
      })
      .select()
      .single();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const text = await file.text();

      try {
        const result = await performNER(text, model, 0.5);
        batchResults.push({
          filename: file.name,
          success: true,
          entityCount: result.entityCount,
          avgConfidence: result.avgConfidence,
          entities: result.entities,
        });

        await supabase.from('clinical_analyses').insert({
          input_text: text,
          model_used: model,
          analysis_type: 'Batch NER',
          results: result,
          confidence_score: result.avgConfidence,
        });

      } catch (err) {
        batchResults.push({
          filename: file.name,
          success: false,
          error: err instanceof Error ? err.message : 'Analysis failed',
        });
      }

      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    if (batchRecord) {
      await supabase
        .from('batch_analyses')
        .update({
          completed_documents: files.length,
          status: 'completed',
          completed_at: new Date().toISOString(),
          results_summary: {
            totalFiles: files.length,
            successCount: batchResults.filter(r => r.success).length,
            avgEntities: batchResults
              .filter(r => r.success)
              .reduce((sum, r) => sum + r.entityCount, 0) / batchResults.filter(r => r.success).length,
          },
        })
        .eq('id', batchRecord.id);
    }

    setResults(batchResults);
    setProcessing(false);
  };

  const successCount = results.filter(r => r.success).length;
  const totalEntities = results.reduce((sum, r) => sum + (r.entityCount || 0), 0);
  const avgConfidence = results.filter(r => r.success).length > 0
    ? results.filter(r => r.success).reduce((sum, r) => sum + r.avgConfidence, 0) / successCount
    : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Batch Processing</h2>
        <p className="text-gray-600 mb-6">
          Upload and analyze multiple clinical documents at once
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Selection
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={processing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="BioBERT">BioBERT</option>
              <option value="ClinicalBERT">ClinicalBERT</option>
              <option value="PubMedBERT">PubMedBERT</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleBatchProcess}
              disabled={processing || files.length === 0}
              className="w-full bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing... {progress}%</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Process Batch</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Upload multiple clinical text files (.txt)</p>
          <input
            type="file"
            accept=".txt"
            multiple
            onChange={handleFileChange}
            disabled={processing}
            className="hidden"
            id="batch-upload"
          />
          <label
            htmlFor="batch-upload"
            className={`inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 cursor-pointer transition-colors ${
              processing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Select Files
          </label>
          {files.length > 0 && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-800 font-medium">{files.length} files selected</p>
              <div className="mt-2 text-left max-h-32 overflow-y-auto">
                {files.map((file, idx) => (
                  <div key={idx} className="text-xs text-gray-600 flex items-center space-x-2">
                    <FileText className="w-3 h-3" />
                    <span>{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {processing && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Total Files</div>
              <div className="text-3xl font-bold text-orange-600">{results.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Successful</div>
              <div className="text-3xl font-bold text-green-600">{successCount}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Total Entities</div>
              <div className="text-3xl font-bold text-blue-600">{totalEntities}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Avg Confidence</div>
              <div className="text-3xl font-bold text-purple-600">
                {(avgConfidence * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Batch Results</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => exportAsJSON(results, 'batch-results.json')}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>JSON</span>
                </button>
                <button
                  onClick={() => exportAsCSV(results.map(r => ({
                    filename: r.filename,
                    success: r.success,
                    entityCount: r.entityCount || 0,
                    avgConfidence: r.avgConfidence || 0,
                  })), 'batch-summary.csv')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-medium text-gray-900">{result.filename}</span>
                    </div>
                    {result.success && (
                      <div className="flex space-x-4 text-sm">
                        <span className="text-gray-600">
                          Entities: <span className="font-bold">{result.entityCount}</span>
                        </span>
                        <span className="text-gray-600">
                          Confidence: <span className="font-bold">{(result.avgConfidence * 100).toFixed(1)}%</span>
                        </span>
                      </div>
                    )}
                    {!result.success && (
                      <span className="text-sm text-red-600">{result.error}</span>
                    )}
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
