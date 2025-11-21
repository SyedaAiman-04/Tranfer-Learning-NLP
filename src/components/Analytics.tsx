import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Activity, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Analytics() {
  const [stats, setStats] = useState<any>(null);
  const [modelPerformance, setModelPerformance] = useState<any[]>([]);
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);

    const { data: analyses } = await supabase
      .from('clinical_analyses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: models } = await supabase
      .from('model_performance')
      .select('*')
      .order('analysis_count', { ascending: false });

    const { data: entities } = await supabase
      .from('extracted_entities')
      .select('entity_type');

    const totalAnalyses = analyses?.length || 0;
    const avgConfidence = analyses && analyses.length > 0
      ? analyses.reduce((sum, a) => sum + (a.confidence_score || 0), 0) / analyses.length
      : 0;

    const entityTypeDistribution = entities?.reduce((acc: any, e) => {
      acc[e.entity_type] = (acc[e.entity_type] || 0) + 1;
      return acc;
    }, {}) || {};

    const analysisTypeDistribution = analyses?.reduce((acc: any, a) => {
      acc[a.analysis_type] = (acc[a.analysis_type] || 0) + 1;
      return acc;
    }, {}) || {};

    setStats({
      totalAnalyses,
      avgConfidence,
      totalEntities: entities?.length || 0,
      entityTypeDistribution,
      analysisTypeDistribution,
    });

    setModelPerformance(models || []);
    setRecentAnalyses(analyses || []);
    setLoading(false);
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  const topEntityTypes = Object.entries(stats.entityTypeDistribution)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 8);

  const maxEntityCount = Math.max(...topEntityTypes.map(([, count]: any) => count));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
            <p className="text-gray-600">
              Track performance metrics and usage statistics
            </p>
          </div>
          <button
            onClick={loadAnalytics}
            className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-700">Total Analyses</span>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-900">{stats.totalAnalyses}</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-700">Avg Confidence</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-900">
              {(stats.avgConfidence * 100).toFixed(1)}%
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-700">Total Entities</span>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-900">{stats.totalEntities}</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-orange-700">Entity Types</span>
              <BarChart3 className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-900">
              {Object.keys(stats.entityTypeDistribution).length}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Performance</h3>
          <div className="space-y-4">
            {modelPerformance.map((model, idx) => {
              const colors = ['bg-blue-500', 'bg-teal-500', 'bg-green-500'];
              const bgColors = ['bg-blue-100', 'bg-teal-100', 'bg-green-100'];
              return (
                <div key={model.id} className={`${bgColors[idx]} rounded-lg p-4 border border-gray-200`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">{model.model_name}</span>
                    <span className="text-sm text-gray-600">
                      {model.analysis_count} analyses
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Confidence</span>
                        <span>{(model.avg_confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${colors[idx]} h-2 rounded-full transition-all`}
                          style={{ width: `${model.avg_confidence * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      Total entities: {model.total_entities_extracted}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Type Distribution</h3>
          <div className="space-y-3">
            {Object.entries(stats.analysisTypeDistribution).map(([type, count]: any) => {
              const percentage = (count / stats.totalAnalyses) * 100;
              const colors: any = {
                'NER': 'bg-blue-500',
                'Summarization': 'bg-teal-500',
                'QA': 'bg-green-500',
                'Comparison': 'bg-purple-500',
                'Batch NER': 'bg-orange-500',
              };
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{type}</span>
                    <span className="text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${colors[type] || 'bg-gray-500'} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Entity Type Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topEntityTypes.map(([type, count]: any) => {
            const percentage = (count / maxEntityCount) * 100;
            return (
              <div key={type} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 font-medium">
                    {type.split('_').map((w: string) => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}
                  </span>
                  <span className="text-gray-600">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-5 h-5 text-pink-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Analyses</h3>
        </div>
        <div className="space-y-2">
          {recentAnalyses.map((analysis) => (
            <div
              key={analysis.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                      {analysis.analysis_type}
                    </span>
                    <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded font-medium">
                      {analysis.model_used}
                    </span>
                    {analysis.confidence_score && (
                      <span className="text-xs text-gray-600">
                        Confidence: {(analysis.confidence_score * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 truncate">
                    {analysis.input_text.substring(0, 100)}...
                  </p>
                </div>
                <span className="text-xs text-gray-400 ml-4">
                  {new Date(analysis.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
