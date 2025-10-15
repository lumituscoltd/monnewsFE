import React, { useState, useEffect } from 'react';
import { searchAPI } from '../api/client';

const SearchHistory = ({ onLoadHistory }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const data = await searchAPI.getHistory(20);
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadHistoryResults = async (log) => {
    try {
      const data = await searchAPI.getHistoryResults(log.id, 1, 10);
      onLoadHistory(data.results, log);
      setShowHistory(false);
    } catch (error) {
      console.error('Failed to load history results:', error);
      alert('Không thể tải kết quả tìm kiếm cũ');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setShowHistory(!showHistory);
          if (!showHistory && history.length === 0) {
            loadHistory();
          }
        }}
        className="btn-secondary flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Lịch sử tìm kiếm</span>
      </button>

      {showHistory && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Lịch sử tìm kiếm</h3>
          </div>

          {isLoading ? (
            <div className="p-4 text-center">
              <div className="spinner w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Đang tải...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p>Chưa có lịch sử tìm kiếm</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {history.map((log) => (
                <div
                  key={log.id}
                  onClick={() => handleLoadHistoryResults(log)}
                  className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">
                        "{log.keyword}"
                      </p>
                      <div className="flex flex-wrap gap-2 mb-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          {log.language}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {log.source}
                        </span>
                        {log.results_count > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            {log.results_count} kết quả
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatDate(log.created_at)}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                  {log.criteria && (
                    <p className="text-xs text-gray-600 mt-1 italic">
                      Tiêu chí: {log.criteria.substring(0, 100)}...
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchHistory;

