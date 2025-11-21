/**
 * Advanced Breast Cancer Clinical NLP System
 *
 * A sophisticated web application for clinical text analysis using state-of-the-art
 * NLP and transfer learning techniques with BioBERT, ClinicalBERT, and PubMedBERT.
 *
 * Features:
 * - Named Entity Recognition (NER) for biomedical entities
 * - Text Summarization for clinical notes
 * - Question Answering on medical texts
 * - Multi-Model Comparison and performance analytics
 * - Batch Processing for multiple documents
 * - Analytics Dashboard with interactive visualizations
 * - Export functionality (JSON/CSV)
 * - Automated Clinical Insights and completeness scoring
 * - Fine-tuning UI scaffold for model customization
 *
 * Architecture:
 * - React 18 with TypeScript for type-safe development
 * - Supabase for backend data persistence and Edge Functions
 * - Tailwind CSS for modern, responsive medical-themed UI
 * - Transfer learning approach using clinical BERT models
 *
 * UI/UX Design:
 * - Clean, medical-friendly pastel theme with soft blue/teal accents
 * - Tab-based navigation for major workflows
 * - Responsive layouts optimized for desktop and tablet
 * - Interactive charts and visualizations
 * - Smooth transitions and hover effects
 * - Clear feedback for all user actions
 */

import { useState } from 'react';
import { Activity, FileText, MessageSquare, GitCompare, Layers, BarChart3, Settings, BookOpen } from 'lucide-react';
import NERAnalysis from './components/NERAnalysis';
import Summarization from './components/Summarization';
import QuestionAnswering from './components/QuestionAnswering';
import ModelComparison from './components/ModelComparison';
import BatchProcessing from './components/BatchProcessing';
import Analytics from './components/Analytics';
import FineTuning from './components/FineTuning';
import Guide from './components/Guide';

type Tab = 'ner' | 'summarization' | 'qa' | 'comparison' | 'batch' | 'analytics' | 'finetune' | 'guide';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('ner');

  const tabs = [
    { id: 'ner' as Tab, label: 'NER Analysis', icon: Activity, color: 'text-blue-600' },
    { id: 'summarization' as Tab, label: 'Summarization', icon: FileText, color: 'text-teal-600' },
    { id: 'qa' as Tab, label: 'Q&A', icon: MessageSquare, color: 'text-green-600' },
    { id: 'comparison' as Tab, label: 'Model Compare', icon: GitCompare, color: 'text-purple-600' },
    { id: 'batch' as Tab, label: 'Batch Process', icon: Layers, color: 'text-orange-600' },
    { id: 'analytics' as Tab, label: 'Analytics', icon: BarChart3, color: 'text-pink-600' },
    { id: 'finetune' as Tab, label: 'Fine-Tune', icon: Settings, color: 'text-indigo-600' },
    { id: 'guide' as Tab, label: 'Guide', icon: BookOpen, color: 'text-gray-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Clinical NLP System
                </h1>
                <p className="text-xs text-gray-500">
                  Breast Cancer Text Analysis Platform
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                BioBERT
              </span>
              <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full font-medium">
                ClinicalBERT
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                PubMedBERT
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto pb-2 -mb-px scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-t-lg font-medium text-sm
                    transition-all duration-200 whitespace-nowrap
                    ${isActive
                      ? 'bg-gradient-to-br from-blue-50 to-teal-50 text-blue-700 border-b-2 border-blue-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? tab.color : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="transition-all duration-300 ease-in-out">
          {activeTab === 'ner' && <NERAnalysis />}
          {activeTab === 'summarization' && <Summarization />}
          {activeTab === 'qa' && <QuestionAnswering />}
          {activeTab === 'comparison' && <ModelComparison />}
          {activeTab === 'batch' && <BatchProcessing />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'finetune' && <FineTuning />}
          {activeTab === 'guide' && <Guide />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-gray-500">
              Advanced Clinical NLP System for Breast Cancer Analysis
            </p>
            <p className="text-sm text-gray-400">
              Powered by BioBERT, ClinicalBERT & PubMedBERT | © 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
