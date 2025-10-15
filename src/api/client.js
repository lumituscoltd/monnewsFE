/**
 * API Client for MonNews Backend
 * Connects Frontend with FastAPI Backend
 */

// API Base URL - development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8100';

/**
 * Generic API request handler
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    // Network error or fetch failed
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Không thể kết nối với server backend. Vui lòng kiểm tra xem backend đã chạy chưa.');
    }
    throw error;
  }
}

/**
 * Search API
 */
export const searchAPI = {
  /**
   * Search documents
   * @param {Object} params - Search parameters
   * @param {string} params.query - Search query
   * @param {string} params.criteria - Additional criteria (AI filtering)
   * @param {number} params.max_results - Maximum results
   * @param {string} params.languages - Languages (comma-separated)
   * @returns {Promise<Object>} Search results
   */
  async search(params) {
    return apiRequest('/api/search', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  /**
   * Get search sessions
   * @param {number} limit - Number of sessions
   * @returns {Promise<Array>} Search sessions
   */
  async getSessions(limit = 20) {
    return apiRequest(`/api/sessions?limit=${limit}`);
  },

  /**
   * Get results from a session
   * @param {number} sessionId - Session ID
   * @returns {Promise<Object>} Session results
   */
  async getSessionResults(sessionId) {
    return apiRequest(`/api/sessions/${sessionId}`);
  },

  /**
   * Download a single file
   * @param {number} documentId - Document ID
   * @returns {Promise<Blob>} File blob
   */
  async downloadFile(documentId) {
    const url = `${API_BASE_URL}/api/download/${documentId}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }
    
    return response.blob();
  },

  /**
   * Export session results
   * @param {number} sessionId - Session ID
   * @param {string} format - Export format (csv/excel)
   * @returns {Promise<Blob>} Export file blob
   */
  async exportSession(sessionId, format = 'excel') {
    const url = `${API_BASE_URL}/api/export/${sessionId}?format=${format}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }
    
    return response.blob();
  },

  /**
   * Get system statistics
   */
  async getStats() {
    return apiRequest('/api/stats');
  },

  /**
   * Health check for search module
   */
  async health() {
    return apiRequest('/health');
  },
};

/**
 * Root API
 */
export const rootAPI = {
  /**
   * Get API info
   */
  async info() {
    return apiRequest('/');
  },

  /**
   * Health check
   */
  async health() {
    return apiRequest('/health');
  },
};

/**
 * Export default for backward compatibility
 */
export default {
  search: searchAPI,
  root: rootAPI,
};

