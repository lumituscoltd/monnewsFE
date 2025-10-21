import React, { useState } from 'react';
import SearchPanel from '../components/SearchPanel';
import ResultsTable from '../components/ResultsTable';
import SearchHistory from '../components/SearchHistory';
import TimeoutAlert from '../components/TimeoutAlert';
import { searchAPI } from '../api/client';
import { mockSearchResults } from '../utils/mockData';

const SearchPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searchParams, setSearchParams] = useState(null);
  const [error, setError] = useState(null);
  const [isHistoryMode, setIsHistoryMode] = useState(false);
  const [performanceInfo, setPerformanceInfo] = useState(null);
  const [showTimeoutAlert, setShowTimeoutAlert] = useState(false);

  const handleSearch = async (formData) => {
    setIsLoading(true);
    setSearchParams(formData);
    setError(null);
    setIsHistoryMode(false);
    setShowTimeoutAlert(false);

    try {
      console.log('🔍 Calling API...', {
        url: 'http://localhost:8100/api/search',
        keyword: formData.keyword
      });

      // Call real API - search ALL 4 engines with multi-language translation
      const response = await searchAPI.search({
        query: formData.keyword,
        criteria: formData.criteria,
        max_results: formData.search_pages || 10,
        languages: formData.target_languages ? formData.target_languages.join(',') : 'en,vi'
      });

      console.log('✅ API Response:', response);
      
      // Backend returns session_id, need to get results
      if (response.session_id) {
        // Wait a bit for processing, then get results
        setTimeout(async () => {
          try {
            const sessionResults = await searchAPI.getSessionResults(response.session_id);
            console.log('✅ Session Results:', sessionResults);
            setResults(sessionResults.results || []);
            setPerformanceInfo(sessionResults.performance_info || null);
          } catch (err) {
            console.error('❌ Failed to get session results:', err);
            setError('Không thể lấy kết quả tìm kiếm');
          }
        }, 3000); // Wait 3 seconds for processing
      }
      
    } catch (err) {
      console.error('❌ Search failed:', err);
      
      // Check if it's a timeout error
      if (err.message.includes('timeout') || err.message.includes('Timeout')) {
        setShowTimeoutAlert(true);
        setError('Tìm kiếm bị timeout sau 30 giây');
      } else {
        setError(err.message);
      }
      
      // Fallback to mock data on error
      let filteredResults = [...mockSearchResults];
      
      if (formData.keyword) {
        const keyword = formData.keyword.toLowerCase();
        filteredResults = filteredResults.filter(
          result =>
            result.title.toLowerCase().includes(keyword) ||
            result.relevant_content.toLowerCase().includes(keyword)
        );
      }
      
      setResults(filteredResults);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadHistory = (historyResults, log) => {
    setResults(historyResults);
    setSearchParams({
      keyword: log.keyword,
      criteria: log.criteria,
      search_pages: 1,
      target_languages: ['VN', 'EN']
    });
    setIsHistoryMode(true);
  };

  const handleRetrySearch = () => {
    if (searchParams) {
      setShowTimeoutAlert(false);
      handleSearch(searchParams);
    }
  };

  const handleDismissTimeout = () => {
    setShowTimeoutAlert(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
          Tìm kiếm thông tin
        </h1>
        {/* <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Hệ thống thu thập thông tin tự động
        </p> */}
      </div>

      {/* Search Panel & History */}
      <div className="max-w-4xl mx-auto mb-8">
        <SearchPanel onSearch={handleSearch} isLoading={isLoading} />
        
        {/* Search History Button */}
        <div className="mt-4 flex justify-end">
          <SearchHistory onLoadHistory={handleLoadHistory} />
        </div>
      </div>

      {/* History Mode Indicator */}
      {isHistoryMode && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between fade-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-sm font-medium text-blue-800">
                Đang xem kết quả từ lịch sử tìm kiếm
              </span>
            </div>
            <button
              onClick={() => {
                setIsHistoryMode(false);
                setResults([]);
                setSearchParams(null);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Tìm kiếm mới
            </button>
          </div>
        </div>
      )}

      {/* Timeout Alert */}
      {showTimeoutAlert && (
        <TimeoutAlert 
          onRetry={handleRetrySearch}
          onDismiss={handleDismissTimeout}
        />
      )}

      {/* Error State */}
      {error && !isLoading && !showTimeoutAlert && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 fade-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  Không thể kết nối với backend. Đang hiển thị dữ liệu mẫu.
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Backend: {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 fade-in">
          <div className="spinner w-16 h-16 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-lg font-semibold text-gray-600">Đang thu thập thông tin...</p>
          <p className="text-sm text-gray-500 mt-2">Hệ thống đang tìm kiếm và phân tích tài liệu...</p>
          <div className="mt-4 w-64 bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Đảm bảo tối thiểu 10 kết quả chất lượng cao</p>
        </div>
      )}

      {/* Results Table */}
      {!isLoading && results.length > 0 && (
        <div className="max-w-7xl mx-auto">
          {console.log('🎨 Rendering ResultsTable with', results.length, 'results')}
          <ResultsTable 
            results={results} 
            searchParams={searchParams} 
            performanceInfo={performanceInfo}
          />
        </div>
      )}
      
      {/* Debug info */}
      {!isLoading && results.length === 0 && searchParams && (
        <div className="max-w-4xl mx-auto text-center text-red-500">
          <p>⚠️ No results found (check console logs)</p>
        </div>
      )}

      {/* Empty State (before first search) */}
      {!isLoading && results.length === 0 && !searchParams && (
        <div className="text-center py-16 fade-in">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Sẵn sàng thu thập thông tin
          </h3>
          <p className="text-gray-500">
            Nhập prompt để bắt đầu thu thập thông tin với 7 loại thông tin chi tiết
          </p>
        </div>
      )}

      {/* Info Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Đa nguồn</h3>
          <p className="text-sm text-gray-600">Tìm kiếm từ Google, Bing, DuckDuckGo, Baidu</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-purple-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Đa ngôn ngữ</h3>
          <p className="text-sm text-gray-600">Hỗ trợ Tiếng Việt, English, 中文</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Xuất Excel</h3>
          <p className="text-sm text-gray-600">Dễ dàng xuất kết quả ra file Excel</p>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

