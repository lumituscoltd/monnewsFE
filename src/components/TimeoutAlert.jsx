import React from 'react';

const TimeoutAlert = ({ onRetry, onDismiss }) => {
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 fade-in">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              ⏰ Tìm kiếm bị timeout
            </h3>
            <div className="text-sm text-red-700 space-y-2">
              <p>
                Tìm kiếm đã vượt quá thời gian cho phép (30 giây). Điều này có thể do:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Mạng chậm hoặc không ổn định</li>
                <li>Server đang xử lý nhiều yêu cầu</li>
                <li>Query quá phức tạp hoặc quá nhiều tiêu chí</li>
                <li>Một số search engine không phản hồi</li>
              </ul>
              <p className="mt-3 font-medium">
                💡 Gợi ý: Thử giảm số tiêu chí tìm kiếm hoặc sử dụng từ khóa đơn giản hơn.
              </p>
            </div>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={onRetry}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Thử lại</span>
              </button>
              <button
                onClick={onDismiss}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Bỏ qua
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeoutAlert;
