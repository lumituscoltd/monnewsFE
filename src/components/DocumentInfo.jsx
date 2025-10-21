import React from 'react';

const DocumentInfo = ({ result }) => {
  const getFileTypeBadge = (fileType) => {
    const typeMap = {
      'pdf': 'bg-red-100 text-red-800',
      'doc': 'bg-blue-100 text-blue-800',
      'docx': 'bg-blue-100 text-blue-800',
      'ppt': 'bg-orange-100 text-orange-800',
      'pptx': 'bg-orange-100 text-orange-800',
      'xlsx': 'bg-green-100 text-green-800',
      'online': 'bg-purple-100 text-purple-800',
      'unknown': 'bg-gray-100 text-gray-800'
    };
    return typeMap[fileType?.toLowerCase()] || typeMap['unknown'];
  };

  const getFileIcon = (fileType) => {
    const iconMap = {
      'pdf': '📄',
      'doc': '📝',
      'docx': '📝',
      'ppt': '📊',
      'pptx': '📊',
      'xlsx': '📈',
      'online': '🌐',
      'unknown': '📄'
    };
    return iconMap[fileType?.toLowerCase()] || iconMap['unknown'];
  };

  return (
    <div className="space-y-3">
      {/* Document Type */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-600">Loại:</span>
        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getFileTypeBadge(result.document_type)}`}>
          <span>{getFileIcon(result.document_type)}</span>
          <span>{(result.document_type || 'unknown').toUpperCase()}</span>
        </span>
      </div>

      {/* Publication Date */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-600">Ngày:</span>
        <span className="text-sm text-gray-800">
          {result.publication_date || 'N/A'}
        </span>
      </div>

      {/* Author */}
      <div className="flex items-start space-x-2">
        <span className="text-sm font-medium text-gray-600">Tác giả:</span>
        <span className="text-sm text-gray-800 flex-1">
          {result.author || 'N/A'}
        </span>
      </div>

      {/* Source Link */}
      <div className="flex items-start space-x-2">
        <span className="text-sm font-medium text-gray-600">Nguồn:</span>
        <div className="flex-1">
          {result.url ? (
            <a 
              href={result.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm break-all"
              title={result.url}
            >
              {result.url.length > 50 ? `${result.url.substring(0, 50)}...` : result.url}
            </a>
          ) : (
            <span className="text-sm text-gray-500">N/A</span>
          )}
        </div>
      </div>

      {/* Search Engine & Language */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium text-gray-600">Engine:</span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {result.search_engine || 'Unknown'}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium text-gray-600">Ngôn ngữ:</span>
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
            {result.language || 'Unknown'}
          </span>
        </div>
      </div>

      {/* Source Verification */}
      {result.source_verification && (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">Xác thực:</span>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            {result.source_verification}
          </span>
        </div>
      )}

      {/* Content Accuracy Score */}
      {result.content_accuracy_score && (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">Độ chính xác:</span>
          <div className="flex items-center space-x-1">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${(result.content_accuracy_score || 0) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600">
              {((result.content_accuracy_score || 0) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentInfo;
