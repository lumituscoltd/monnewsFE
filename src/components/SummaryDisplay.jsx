import React, { useState } from 'react';

const SummaryDisplay = ({ result }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!result.summary) {
    return <span className="text-sm text-gray-500">N/A</span>;
  }

  const summaryLines = result.summary.split('\n');
  const shouldTruncate = summaryLines.length > 3;
  const displaySummary = shouldTruncate && !isExpanded 
    ? summaryLines.slice(0, 3).join('\n') 
    : result.summary;

  return (
    <div className="space-y-2">
      {/* Summary Text */}
      <div className="text-sm text-gray-700 leading-relaxed">
        {displaySummary}
        {shouldTruncate && !isExpanded && '...'}
      </div>

      {/* Expand/Collapse Button */}
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          {isExpanded ? 'Thu gọn' : 'Xem thêm'}
        </button>
      )}

      {/* Relevant Quotes */}
      {result.relevant_quotes && result.relevant_quotes.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-medium text-gray-600 mb-2">💬 Trích dẫn minh chứng:</div>
          <div className="space-y-2">
            {result.relevant_quotes.slice(0, isExpanded ? result.relevant_quotes.length : 2).map((quote, idx) => (
              <div key={idx} className="bg-gray-50 border-l-4 border-blue-200 p-2 rounded-r">
                <div className="text-xs text-blue-600 font-medium mb-1">
                  Tiêu chí: {quote.criterion}
                </div>
                <div className="text-sm text-gray-700 italic">
                  "{quote.quote}"
                </div>
              </div>
            ))}
            {result.relevant_quotes.length > 2 && !isExpanded && (
              <div className="text-xs text-gray-500">
                +{result.relevant_quotes.length - 2} trích dẫn khác...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Highlighted Content */}
      {result.highlighted_content && (
        <div className="mt-3">
          <div className="text-xs font-medium text-gray-600 mb-2">🔍 Nội dung nổi bật:</div>
          <div 
            className="text-sm text-gray-700 bg-yellow-50 p-2 rounded"
            dangerouslySetInnerHTML={{ __html: result.highlighted_content }}
          />
        </div>
      )}

      {/* Content Quality Indicators */}
      <div className="flex items-center space-x-4 mt-3 text-xs">
        {result.content_accuracy_score && (
          <div className="flex items-center space-x-1">
            <span className="text-gray-600">Độ chính xác:</span>
            <span className="font-semibold text-green-600">
              {((result.content_accuracy_score || 0) * 100).toFixed(0)}%
            </span>
          </div>
        )}
        {result.relevance_score && (
          <div className="flex items-center space-x-1">
            <span className="text-gray-600">Độ liên quan:</span>
            <span className="font-semibold text-blue-600">
              {result.relevance_score}/10
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryDisplay;
