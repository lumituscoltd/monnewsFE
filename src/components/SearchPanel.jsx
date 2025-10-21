import React, { useState } from 'react';

const SearchPanel = ({ onSearch, isLoading }) => {
  const [formData, setFormData] = useState({
    keyword: '',
    criteria: '',
    search_pages: 10,
    target_languages: ['VN', 'EN']
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLanguageToggle = (lang) => {
    setFormData(prev => {
      const current = prev.target_languages || [];
      const updated = current.includes(lang)
        ? current.filter(l => l !== lang)
        : [...current, lang];
      return { ...prev, target_languages: updated.length > 0 ? updated : ['EN'] };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.keyword.trim()) {
      onSearch(formData);
    }
  };

  const handleClear = () => {
    setFormData({
      keyword: '',
      criteria: '',
      search_pages: 10,
      target_languages: ['VN', 'EN']
    });
  };

  return (
    <div className="card fade-in">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <svg
            className="w-6 h-6 text-primary"
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
        <h2 className="text-2xl font-bold text-secondary">Thu thập thông tin</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Prompt Input */}
        <div>
          <label htmlFor="keyword" className="block text-sm font-semibold text-gray-700 mb-2">
            Nhập prompt tìm kiếm <span className="text-red-500">*</span>
          </label>
          <textarea
            id="keyword"
            name="keyword"
            value={formData.keyword}
            onChange={handleChange}
            placeholder="Ví dụ: Tìm kiếm tài liệu về trí tuệ nhân tạo trong quốc phòng, ứng dụng AI trong quân sự, công nghệ tự động hóa..."
            rows="3"
            className="input-field resize-none"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading || !formData.keyword.trim()}
            className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <svg className="spinner w-5 h-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Đang thu thập thông tin...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <span>Bắt đầu thu thập</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Xóa prompt
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchPanel;

