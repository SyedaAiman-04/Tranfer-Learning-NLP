import { useState } from 'react';
import { FileUp, Type, BookMarked } from 'lucide-react';
import { EXAMPLE_TEXTS } from '../lib/utils';

interface TextInputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

export default function TextInput({ value, onChange, placeholder }: TextInputProps) {
  const [inputMode, setInputMode] = useState<'textarea' | 'file' | 'example'>('textarea');
  const [selectedExample, setSelectedExample] = useState<keyof typeof EXAMPLE_TEXTS>('pathology');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        onChange(text);
      };
      reader.readAsText(file);
    }
  };

  const handleExampleSelect = (example: keyof typeof EXAMPLE_TEXTS) => {
    setSelectedExample(example);
    onChange(EXAMPLE_TEXTS[example]);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <button
          onClick={() => setInputMode('textarea')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            inputMode === 'textarea'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Type Text</span>
        </button>

        <button
          onClick={() => setInputMode('file')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            inputMode === 'file'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <FileUp className="w-4 h-4" />
          <span>Upload File</span>
        </button>

        <button
          onClick={() => setInputMode('example')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            inputMode === 'example'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>Use Example</span>
        </button>
      </div>

      {inputMode === 'textarea' && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Enter clinical text for analysis...'}
          className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
        />
      )}

      {inputMode === 'file' && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white">
          <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Upload a clinical text file</p>
          <input
            type="file"
            accept=".txt,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
          >
            Select File
          </label>
          {value && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">File loaded successfully!</p>
              <p className="text-gray-600 text-xs mt-1">{value.length} characters</p>
            </div>
          )}
        </div>
      )}

      {inputMode === 'example' && (
        <div className="space-y-3">
          <div className="flex space-x-2">
            <button
              onClick={() => handleExampleSelect('pathology')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedExample === 'pathology'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Pathology Report
            </button>
            <button
              onClick={() => handleExampleSelect('clinical')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedExample === 'clinical'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Clinical Note
            </button>
            <button
              onClick={() => handleExampleSelect('followup')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedExample === 'followup'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Follow-up
            </button>
          </div>
          <div className="border border-gray-300 rounded-lg p-4 bg-amber-50">
            <p className="text-sm text-gray-700 leading-relaxed">{value}</p>
          </div>
        </div>
      )}
    </div>
  );
}
