import React from 'react';

const PerformanceDashboard = ({ performanceInfo, resultsCount }) => {
  if (!performanceInfo) return null;

  const getStatusIcon = (status) => {
    const statusMap = {
      'GOOD': '✅',
      'SLOW': '⚠️',
      'TIMEOUT': '⏰',
      'INSUFFICIENT_RESULTS': '❌'
    };
    return statusMap[status] || '❓';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'GOOD': 'text-green-600',
      'SLOW': 'text-yellow-600', 
      'TIMEOUT': 'text-red-600',
      'INSUFFICIENT_RESULTS': 'text-orange-600'
    };
    return colorMap[status] || 'text-gray-600';
  };

  const formatTime = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="mr-2">📊</span>
          Dashboard Hiệu suất Tìm kiếm
        </h3>
        <div className="text-sm text-gray-600">
          Tổng kết quả: <span className="font-semibold text-primary">{resultsCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Response Time */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Thời gian phản hồi</span>
            <span className="text-lg">⏱️</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {formatTime(performanceInfo.response_time_ms || 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {performanceInfo.response_time_ms < 20000 ? 'Tốt' : 'Chậm'}
          </div>
        </div>

        {/* Performance Status */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Trạng thái</span>
            <span className="text-lg">{getStatusIcon(performanceInfo.performance_status)}</span>
          </div>
          <div className={`text-2xl font-bold ${getStatusColor(performanceInfo.performance_status)}`}>
            {performanceInfo.performance_status || 'N/A'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {performanceInfo.performance_status === 'GOOD' ? 'Hoạt động tốt' : 'Cần cải thiện'}
          </div>
        </div>

        {/* Minimum Results */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Đạt tối thiểu</span>
            <span className="text-lg">{performanceInfo.min_results_achieved ? '✅' : '❌'}</span>
          </div>
          <div className={`text-2xl font-bold ${performanceInfo.min_results_achieved ? 'text-green-600' : 'text-red-600'}`}>
            {performanceInfo.min_results_achieved ? 'Có' : 'Không'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Tối thiểu 10 kết quả
          </div>
        </div>

        {/* Timeout Status */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Timeout</span>
            <span className="text-lg">{performanceInfo.timeout_occurred ? '⏰' : '✅'}</span>
          </div>
          <div className={`text-2xl font-bold ${performanceInfo.timeout_occurred ? 'text-red-600' : 'text-green-600'}`}>
            {performanceInfo.timeout_occurred ? 'Có' : 'Không'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Dưới 30 giây
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="mt-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3">📈 Phân tích chi tiết</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Tỷ lệ thành công:</span>
            <span className="ml-2 font-semibold text-green-600">
              {performanceInfo.min_results_achieved ? '100%' : '0%'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Hiệu suất tìm kiếm:</span>
            <span className={`ml-2 font-semibold ${performanceInfo.performance_status === 'GOOD' ? 'text-green-600' : 'text-yellow-600'}`}>
              {performanceInfo.performance_status === 'GOOD' ? 'Tối ưu' : 'Cần cải thiện'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
