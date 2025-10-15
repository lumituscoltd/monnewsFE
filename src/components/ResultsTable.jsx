import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { searchAPI } from '../api/client';

const ResultsTable = ({ results, searchParams }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const [hoveredContent, setHoveredContent] = useState(null);
  const itemsPerPage = 10;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  const handleExportExcel = () => {
    if (results.length === 0) {
      alert('Không có dữ liệu để xuất!');
      return;
    }

    // Chuẩn bị dữ liệu
    const exportData = results.map((item, index) => ({
      'STT': index + 1,
      'Tiêu đề': item.title,
      'URL': item.url || 'N/A',
      'Ngôn ngữ': item.language,
      'Nguồn tìm kiếm': item.search_engine,
      'Đường dẫn file': item.file_path || 'N/A',
      'Loại file': item.file_type,
      'Mô tả ngắn': item.relevant_content?.split('\n\n✓ AI:')[0] || item.relevant_content,
      'Phân tích AI': item.relevant_content?.includes('✓ AI:') 
        ? item.relevant_content.split('✓ AI:')[1] 
        : 'N/A',
      'Trạng thái tải': item.download_status,
          'Ngày xuất bản': item.created_at
    }));

    // Tạo workbook và worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Định dạng độ rộng cột
    ws['!cols'] = [
      { wch: 5 },   // STT
      { wch: 60 },  // Tiêu đề
      { wch: 50 },  // URL
      { wch: 10 },  // Ngôn ngữ
      { wch: 15 },  // Nguồn
      { wch: 50 },  // File path
      { wch: 12 },  // File type
      { wch: 50 },  // Mô tả ngắn
      { wch: 80 },  // Phân tích AI
      { wch: 15 },  // Download status
      { wch: 20 }   // Ngày tạo
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Kết quả tìm kiếm');

    // Xuất file
    const fileName = `ketqua_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(wb, fileName);
    setShowExportMenu(false);
  };

  const handleExportExcelAndZip = async () => {
    if (results.length === 0) {
      alert('Không có dữ liệu để xuất!');
      return;
    }

    try {
      setIsDownloading(true);
      
      // Export Excel first
      handleExportExcel();

      // Get offline documents
      const offlineFiles = results.filter(item => 
        item.file_path && item.download_status === 'downloaded'
      );

      if (offlineFiles.length === 0) {
        alert('Xuất Excel thành công! Không có tài liệu offline để tải.');
        return;
      }

      // Download batch files as ZIP
      const documentIds = offlineFiles.map(file => file.id);
      const blob = await searchAPI.downloadBatch(documentIds);
      
      // Create download link for ZIP
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `documents_${offlineFiles.length}_files_${new Date().getTime()}.zip`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert(`Xuất Excel và ZIP thành công!\n${offlineFiles.length} tài liệu offline đã được tải.`);
      
    } catch (error) {
      console.error('Export ZIP error:', error);
      alert(`Lỗi khi tải ZIP: ${error.message}`);
    } finally {
      setIsDownloading(false);
      setShowExportMenu(false);
    }
  };

  const handleDownloadFile = async (file) => {
    if (!file.file_path) {
      alert('File không tồn tại trên server!');
      return;
    }
    
    try {
      setIsDownloading(true);
      
      // Download from backend
      const blob = await searchAPI.downloadFile(file.id);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_path.split('/').pop() || `${file.title}.${file.file_type}`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Download error:', error);
      alert(`Lỗi khi tải file: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleViewOnline = (url) => {
    window.open(url, '_blank');
  };

  const getFileIcon = (fileType) => {
    const icons = {
      'pdf': '📄',
      'docx': '📝',
      'pptx': '📊',
      'xlsx': '📈',
      'online': '🌐'
    };
    return icons[fileType] || '📁';
  };

  const getFileTypeBadge = (fileType) => {
    const colors = {
      'pdf': 'bg-red-100 text-red-800',
      'docx': 'bg-blue-100 text-blue-800',
      'pptx': 'bg-orange-100 text-orange-800',
      'xlsx': 'bg-green-100 text-green-800',
      'online': 'bg-purple-100 text-purple-800'
    };
    return colors[fileType] || 'bg-gray-100 text-gray-800';
  };

  const toggleSelectDocument = (docId) => {
    const newSelected = new Set(selectedDocuments);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedDocuments(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedDocuments.size === currentItems.length) {
      setSelectedDocuments(new Set());
    } else {
      setSelectedDocuments(new Set(currentItems.map(item => item.id)));
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedDocuments.size === 0) {
      alert('Vui lòng chọn ít nhất một tài liệu để tải!');
      return;
    }

    try {
      setIsDownloading(true);
      
      const selectedIds = Array.from(selectedDocuments);
      const blob = await searchAPI.downloadBatch(selectedIds);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `selected_documents_${selectedIds.length}_files.zip`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert(`Đã tải ${selectedIds.length} tài liệu thành công!`);
      setSelectedDocuments(new Set());
      
    } catch (error) {
      console.error('Download selected error:', error);
      alert(`Lỗi khi tải files: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  console.log('ResultsTable - Results:', results.length);

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="card fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-secondary">Kết quả tìm kiếm</h2>
            <p className="text-sm text-gray-500 mt-1">
              Tìm thấy <span className="font-semibold text-primary">{results.length}</span> tài liệu
              {searchParams?.keyword && (
                <> cho từ khóa: <span className="font-semibold">"{searchParams.keyword}"</span></>
              )}
            </p>
          </div>
        </div>

        {/* Export & Download Buttons */}
        <div className="flex items-center space-x-3">
          {/* Download Selected Button */}
          {selectedDocuments.size > 0 && (
            <button
              onClick={handleDownloadSelected}
              disabled={isDownloading}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Tải {selectedDocuments.size} file</span>
            </button>
          )}

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="btn-primary flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Xuất dữ liệu</span>
              <svg
                className={`w-4 h-4 transition-transform ${showExportMenu ? 'rotate-180' : ''}`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                <div className="py-2">
                  <button
                    onClick={handleExportExcel}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3"
                  >
                    <svg className="w-5 h-5 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                    <div>
                      <div className="font-semibold text-gray-900">Xuất Excel</div>
                      <div className="text-xs text-gray-500">Chỉ xuất danh sách kết quả</div>
                    </div>
                  </button>

                  <button
                    onClick={handleExportExcelAndZip}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3 border-t border-gray-100"
                  >
                    <svg className="w-5 h-5 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path>
                    </svg>
                    <div>
                      <div className="font-semibold text-gray-900">Xuất Excel + ZIP</div>
                      <div className="text-xs text-gray-500">Excel + tài liệu offline (.zip)</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={selectedDocuments.size === currentItems.length && currentItems.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">STT</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tiêu đề</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Loại</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nguồn</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Ngôn ngữ</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nội dung</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Ngày xuất bản</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((result, index) => (
              <tr key={result.id} className="table-row-hover">
                <td className="px-4 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.has(result.id)}
                    onChange={() => toggleSelectDocument(result.id)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                  {indexOfFirstItem + index + 1}
                </td>
                <td className="px-4 py-4 text-sm">
                  <div className="font-semibold text-gray-900 hover:text-primary transition-colors max-w-md">
                    {result.title}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getFileTypeBadge(result.file_type)}`}>
                    <span>{getFileIcon(result.file_type)}</span>
                    <span>{(result.file_type || 'unknown').toUpperCase()}</span>
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {result.search_engine || 'Unknown'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {result.language || 'Unknown'}
                  </span>
                </td>
                <td 
                  className="px-4 py-4 text-sm text-gray-600 max-w-md relative"
                  onMouseEnter={() => setHoveredContent(result.id)}
                  onMouseLeave={() => setHoveredContent(null)}
                >
                  <div className="line-clamp-10 cursor-help leading-relaxed">
                    {result.relevant_content || 'N/A'}
                  </div>
                  
                  {/* Tooltip with full AI analysis */}
                  {hoveredContent === result.id && result.relevant_content && (
                    <div className="absolute z-50 left-0 top-full mt-2 w-[600px] bg-gray-900 text-white text-sm p-5 rounded-lg shadow-2xl border border-gray-700">
                      <div className="font-bold mb-3 text-base text-yellow-400">🤖 Phân tích AI đầy đủ:</div>
                      <div className="whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed">
                        {result.relevant_content}
                      </div>
                      <div className="absolute -top-2 left-8 w-4 h-4 bg-gray-900 border-l border-t border-gray-700 transform rotate-45"></div>
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.created_at ? new Date(result.created_at).toLocaleString('vi-VN') : 'N/A'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {result.file_path && result.download_status === 'downloaded' ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDownloadFile(result)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span>Tải về</span>
                      </button>
                    </div>
                  ) : result.url ? (
                    <button
                      onClick={() => handleViewOnline(result.url)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90 font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                      <span>Mở link</span>
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">{indexOfFirstItem + 1}</span> đến{' '}
                <span className="font-medium">{Math.min(indexOfLastItem, results.length)}</span> trong tổng số{' '}
                <span className="font-medium">{results.length}</span> kết quả
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Trước</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      currentPage === idx + 1
                        ? 'z-10 bg-primary text-white focus:z-20'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Sau</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;
