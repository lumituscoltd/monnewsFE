import React from 'react';

const CriteriaCompliance = ({ result }) => {
  if (!result.criteria_met || !result.criteria_not_met) return null;

  const getComplianceColor = (percentage) => {
    if (percentage >= 0.8) return 'text-green-600 bg-green-50';
    if (percentage >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getComplianceIcon = (percentage) => {
    if (percentage >= 0.8) return '✅';
    if (percentage >= 0.6) return '⚠️';
    return '❌';
  };

  return (
    <div className="space-y-3">
      {/* Compliance Score */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Chỉ số đáp ứng:</span>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getComplianceColor(result.criteria_percentage || 0)}`}>
          {getComplianceIcon(result.criteria_percentage || 0)} {result.criteria_score || 'N/A'}
        </div>
      </div>

      {/* Criteria Met */}
      {result.criteria_met && result.criteria_met.length > 0 && (
        <div>
          <div className="text-sm font-medium text-green-700 mb-2">✅ Tiêu chí đạt:</div>
          <div className="flex flex-wrap gap-1">
            {result.criteria_met.map((criterion, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
              >
                {criterion}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Criteria Not Met */}
      {result.criteria_not_met && result.criteria_not_met.length > 0 && (
        <div>
          <div className="text-sm font-medium text-red-700 mb-2">❌ Tiêu chí chưa đạt:</div>
          <div className="flex flex-wrap gap-1">
            {result.criteria_not_met.map((criterion, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
              >
                {criterion}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Compliance Percentage */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Tỷ lệ đáp ứng:</span>
          <span className="font-semibold">
            {((result.criteria_percentage || 0) * 100).toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              (result.criteria_percentage || 0) >= 0.8 ? 'bg-green-500' :
              (result.criteria_percentage || 0) >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${(result.criteria_percentage || 0) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CriteriaCompliance;
