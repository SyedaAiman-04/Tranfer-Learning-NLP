import { BookOpen, Activity, FileText, MessageSquare, GitCompare, Layers, BarChart3, Settings, CheckCircle } from 'lucide-react';

export default function Guide() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg shadow-sm border border-blue-200 p-8">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">User Guide</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          Welcome to the Advanced Breast Cancer Clinical NLP System. This comprehensive platform leverages
          state-of-the-art transformer models to analyze clinical texts, extract entities, generate summaries,
          and answer questions about breast cancer documentation.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Platform Overview</h3>
        <div className="space-y-4 text-gray-700">
          <p>
            This system provides end-to-end NLP capabilities for breast cancer clinical text analysis:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Extract biomedical entities using domain-specific BERT models</li>
            <li>Generate concise summaries of lengthy clinical documents</li>
            <li>Answer specific questions about clinical content</li>
            <li>Compare multiple model performances side-by-side</li>
            <li>Process multiple documents in batch operations</li>
            <li>Track analytics and model performance over time</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Activity className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">1. NER Analysis</h3>
          </div>
          <p className="text-gray-700 mb-3">
            Named Entity Recognition extracts clinical entities from breast cancer texts.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-900 font-medium mb-2">How to use:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Select a model (BioBERT, ClinicalBERT, or PubMedBERT)</li>
              <li>Adjust confidence threshold (default: 50%)</li>
              <li>Enter text, upload a file, or use an example</li>
              <li>Click "Analyze" to extract entities</li>
              <li>View highlighted text, entity groups, and insights</li>
              <li>Export results as JSON or CSV</li>
            </ol>
          </div>
          <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
            <p className="text-xs text-gray-600 font-medium mb-1">Entity Types Detected:</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Tumor Size</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">Tumor Type</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Receptor Status</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">Stage</span>
              <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded">Treatment</span>
              <span className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded">Medication</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <FileText className="w-6 h-6 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">2. Text Summarization</h3>
          </div>
          <p className="text-gray-700 mb-3">
            Automatically condense lengthy clinical notes into concise summaries.
          </p>
          <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
            <p className="text-sm text-teal-900 font-medium mb-2">How to use:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-teal-800">
              <li>Select your preferred model</li>
              <li>Input clinical text (pathology reports, notes, etc.)</li>
              <li>Click "Summarize" to generate summary</li>
              <li>Review compression metrics and word counts</li>
              <li>Compare original and summarized text</li>
            </ol>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <MessageSquare className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">3. Question Answering</h3>
          </div>
          <p className="text-gray-700 mb-3">
            Ask natural language questions about clinical texts and receive AI-powered answers.
          </p>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-900 font-medium mb-2">How to use:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-green-800">
              <li>Enter or upload the clinical text as context</li>
              <li>Type your question or select from samples</li>
              <li>Click "Ask Question" to get an answer</li>
              <li>Review the answer, confidence score, and context</li>
            </ol>
          </div>
          <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
            <p className="text-xs text-gray-600 font-medium mb-1">Sample Questions:</p>
            <ul className="list-disc list-inside text-xs text-gray-600 space-y-0.5">
              <li>What is the tumor size?</li>
              <li>What is the receptor status?</li>
              <li>What treatment was recommended?</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <GitCompare className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">4. Multi-Model Comparison</h3>
          </div>
          <p className="text-gray-700 mb-3">
            Compare BioBERT, ClinicalBERT, and PubMedBERT performance on the same text.
          </p>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-purple-900 font-medium mb-2">How to use:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-purple-800">
              <li>Enter clinical text for analysis</li>
              <li>Click "Compare All Models"</li>
              <li>Review side-by-side performance metrics</li>
              <li>See recommended model based on results</li>
              <li>Compare entity extraction across models</li>
            </ol>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Layers className="w-6 h-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">5. Batch Processing</h3>
          </div>
          <p className="text-gray-700 mb-3">
            Analyze multiple clinical documents simultaneously for efficient processing.
          </p>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <p className="text-sm text-orange-900 font-medium mb-2">How to use:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-orange-800">
              <li>Select model for batch analysis</li>
              <li>Upload multiple .txt files</li>
              <li>Click "Process Batch" to analyze all files</li>
              <li>Monitor progress with real-time updates</li>
              <li>Review per-document results and statistics</li>
              <li>Export batch results as JSON or CSV</li>
            </ol>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <BarChart3 className="w-6 h-6 text-pink-600" />
            <h3 className="text-lg font-semibold text-gray-900">6. Analytics Dashboard</h3>
          </div>
          <p className="text-gray-700 mb-3">
            Track usage statistics, model performance, and entity distribution over time.
          </p>
          <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
            <p className="text-sm text-pink-900 font-medium mb-2">Features:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-pink-800">
              <li>Total analyses and average confidence metrics</li>
              <li>Model performance comparison charts</li>
              <li>Analysis type distribution</li>
              <li>Entity type distribution visualization</li>
              <li>Recent analysis history</li>
              <li>Real-time data refresh</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Settings className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">7. Fine-Tuning Panel</h3>
          </div>
          <p className="text-gray-700 mb-3">
            UI scaffold for potential model customization on domain-specific datasets.
          </p>
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <p className="text-sm text-indigo-900 font-medium mb-2">Configuration options:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-indigo-800">
              <li>Base model selection</li>
              <li>Hyperparameter tuning (learning rate, batch size, epochs)</li>
              <li>Training dataset upload</li>
              <li>Advanced parameters configuration</li>
            </ul>
            <p className="text-xs text-indigo-700 mt-2">
              Note: This is a demonstration UI. Production implementation would require training infrastructure.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Model Information</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-bold text-blue-900 mb-1">BioBERT</h4>
            <p className="text-sm text-gray-700">
              Pre-trained on biomedical literature (PubMed abstracts, PMC full-text articles).
              Excellent for general biomedical entity recognition.
            </p>
          </div>
          <div className="border-l-4 border-teal-500 pl-4">
            <h4 className="font-bold text-teal-900 mb-1">ClinicalBERT</h4>
            <p className="text-sm text-gray-700">
              Trained on clinical notes from MIMIC-III database. Optimized for clinical documentation
              and medical record analysis.
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-bold text-green-900 mb-1">PubMedBERT</h4>
            <p className="text-sm text-gray-700">
              Pre-trained from scratch on PubMed abstracts and full-text articles. Strong performance
              on research paper analysis and scientific literature.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm border border-green-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900">Best Practices</h3>
        </div>
        <ul className="space-y-3">
          <li className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Use appropriate models</p>
              <p className="text-sm text-gray-600">
                ClinicalBERT for clinical notes, PubMedBERT for research papers, BioBERT for general use
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Adjust confidence thresholds</p>
              <p className="text-sm text-gray-600">
                Lower thresholds capture more entities but may include false positives
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Review automated insights</p>
              <p className="text-sm text-gray-600">
                Check completeness scores and missing attributes for data quality assessment
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Use batch processing efficiently</p>
              <p className="text-sm text-gray-600">
                Process multiple documents at once for large-scale analysis tasks
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Monitor analytics regularly</p>
              <p className="text-sm text-gray-600">
                Track model performance and identify trends in your analysis patterns
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Architecture</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p><span className="font-medium">Frontend:</span> React 18 with TypeScript, Tailwind CSS</p>
          <p><span className="font-medium">Backend:</span> Supabase Edge Functions for NLP processing</p>
          <p><span className="font-medium">Database:</span> PostgreSQL via Supabase with Row Level Security</p>
          <p><span className="font-medium">Models:</span> Transformer-based BERT variants (simulated)</p>
          <p><span className="font-medium">Security:</span> All data encrypted, RLS policies enforced</p>
        </div>
      </div>
    </div>
  );
}
