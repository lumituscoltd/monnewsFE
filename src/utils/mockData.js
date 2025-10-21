// Mock data cho kết quả tìm kiếm với đầy đủ 7 loại thông tin bắt buộc
export const mockSearchResults = [
  {
    id: 1,
    title: "Artificial Intelligence in Defense Applications: A Comprehensive Survey",
    url: "https://example.com/ai-defense-survey.pdf",
    language: "EN",
    search_engine: "Google",
    file_path: null,
    file_type: "online",
    // 7 loại thông tin bắt buộc
    document_type: "online",
    publication_date: "15/03/2024",
    author: "Dr. John Smith, MIT",
    criteria_score: "4/5",
    criteria_percentage: 0.8,
    criteria_met: ["artificial intelligence", "defense applications", "autonomous systems", "threat detection"],
    criteria_not_met: ["cybersecurity"],
    summary: "Nghiên cứu toàn diện về ứng dụng trí tuệ nhân tạo trong lĩnh vực quốc phòng, bao gồm các hệ thống tự động, phát hiện mối đe dọa và lập kế hoạch chiến lược. Tài liệu cung cấp cái nhìn tổng quan về các công nghệ AI hiện đại được sử dụng trong quân sự.",
    relevant_quotes: [
      {
        criterion: "artificial intelligence",
        quote: "AI systems have revolutionized defense applications by enabling autonomous decision-making in complex battlefield scenarios."
      },
      {
        criterion: "defense applications", 
        quote: "The integration of machine learning algorithms in defense systems has significantly improved threat detection capabilities."
      }
    ],
    highlighted_content: "AI systems have <mark>revolutionized</mark> defense applications by enabling <mark>autonomous</mark> decision-making in complex battlefield scenarios.",
    source_verification: "Verified academic source from MIT",
    content_accuracy_score: 0.95,
    relevance_score: 8.5,
    relevant_content: "This paper presents a comprehensive survey of AI applications in defense, covering autonomous systems, threat detection, and strategic planning...",
    download_status: "N/A",
    created_at: "2025-10-08 10:30:45"
  },
  {
    id: 2,
    title: "人工智能在军事领域的应用研究",
    url: "https://baidu.com/ai-military-research",
    language: "ZH",
    search_engine: "Baidu",
    file_path: "/var/www/documents/ai_military_cn.pdf",
    file_type: "pdf",
    // 7 loại thông tin bắt buộc
    document_type: "pdf",
    publication_date: "22/01/2024",
    author: "中国军事科学院",
    criteria_score: "3/5",
    criteria_percentage: 0.6,
    criteria_met: ["artificial intelligence", "military applications", "intelligent reconnaissance"],
    criteria_not_met: ["cybersecurity", "autonomous systems"],
    summary: "Nghiên cứu sâu về vai trò quan trọng của công nghệ trí tuệ nhân tạo trong các ứng dụng quân sự hiện đại, bao gồm trinh sát thông minh và hệ thống hỗ trợ ra quyết định chỉ huy.",
    relevant_quotes: [
      {
        criterion: "artificial intelligence",
        quote: "人工智能技术在军事领域的应用正在改变现代战争的面貌，特别是在情报收集和分析方面。"
      },
      {
        criterion: "military applications",
        quote: "智能侦察系统能够实时分析大量数据，为指挥官提供准确的战场态势感知。"
      }
    ],
    highlighted_content: "人工智能技术在<mark>军事领域</mark>的应用正在改变现代战争的面貌，特别是在<mark>情报收集</mark>和分析方面。",
    source_verification: "Verified from Chinese Military Academy",
    content_accuracy_score: 0.92,
    relevance_score: 7.8,
    relevant_content: "本文深入探讨了人工智能技术在现代军事应用中的关键作用，包括智能侦察、指挥决策支持系统等方面的最新进展...",
    download_status: "downloaded",
    created_at: "2025-10-08 11:15:22"
  },
  {
    id: 3,
    title: "Machine Learning for Cybersecurity: Threat Detection and Prevention",
    url: "https://duckduckgo.com/ml-cybersecurity",
    language: "EN",
    search_engine: "DuckDuckGo",
    file_path: "/var/www/documents/ml_cybersecurity.docx",
    file_type: "docx",
    relevant_content: "An in-depth analysis of machine learning techniques applied to cybersecurity, focusing on real-time threat detection, anomaly detection, and automated response systems...",
    download_status: "downloaded",
    created_at: "2025-10-08 12:45:10"
  },
  {
    id: 4,
    title: "Ứng dụng trí tuệ nhân tạo trong an ninh quốc phòng Việt Nam",
    url: null,
    language: "VN",
    search_engine: "Google",
    file_path: "/var/www/documents/ai_defense_vn.pdf",
    file_type: "pdf",
    relevant_content: "Nghiên cứu về tiềm năng và thực trạng ứng dụng công nghệ AI trong lĩnh vực quốc phòng, bao gồm giám sát biên giới, phân tích tình báo và hỗ trợ ra quyết định...",
    download_status: "downloaded",
    created_at: "2025-10-08 13:20:33"
  },
  {
    id: 5,
    title: "Deep Learning Approaches for Autonomous Weapon Systems",
    url: "https://bing.com/deep-learning-aws",
    language: "EN",
    search_engine: "Bing",
    file_path: null,
    file_type: "online",
    relevant_content: "This research explores the integration of deep learning algorithms in autonomous weapon systems, examining ethical considerations, technical challenges, and future developments...",
    download_status: "N/A",
    created_at: "2025-10-08 14:05:18"
  },
  {
    id: 6,
    title: "自主武器系统中的计算机视觉技术",
    url: null,
    language: "ZH",
    search_engine: "Baidu",
    file_path: "/var/www/documents/computer_vision_aws_cn.pptx",
    file_type: "pptx",
    relevant_content: "详细介绍了计算机视觉技术在自主武器系统中的应用，包括目标识别、跟踪和分类等核心功能的实现方法...",
    download_status: "downloaded",
    created_at: "2025-10-08 14:30:55"
  },
  {
    id: 7,
    title: "Quantum Computing Applications in Military Intelligence",
    url: "https://google.com/quantum-military-intel",
    language: "EN",
    search_engine: "Google",
    file_path: null,
    file_type: "online",
    relevant_content: "Exploring the potential of quantum computing for military intelligence applications, including cryptography, optimization problems, and simulation of complex scenarios...",
    download_status: "N/A",
    created_at: "2025-10-08 15:10:40"
  },
  {
    id: 8,
    title: "Công nghệ blockchain trong quản lý dữ liệu quốc phòng",
    url: null,
    language: "VN",
    search_engine: "Google",
    file_path: "/var/www/documents/blockchain_defense_vn.pdf",
    file_type: "pdf",
    relevant_content: "Phân tích khả năng ứng dụng công nghệ blockchain để bảo mật và quản lý dữ liệu nhạy cảm trong lĩnh vực quốc phòng, đảm bảo tính toàn vẹn và truy xuất nguồn gốc...",
    download_status: "downloaded",
    created_at: "2025-10-08 15:45:12"
  },
  {
    id: 9,
    title: "Neural Networks for Predictive Maintenance in Defense Systems",
    url: "https://google.com/neural-predictive-defense",
    language: "EN",
    search_engine: "Google",
    file_path: null,
    file_type: "online",
    relevant_content: "Application of neural networks for predictive maintenance of military equipment and systems...",
    download_status: "N/A",
    created_at: "2025-10-08 16:00:25"
  },
  {
    id: 10,
    title: "Big Data Analytics in Defense Intelligence",
    url: null,
    language: "EN",
    search_engine: "Bing",
    file_path: "/var/www/documents/bigdata_defense.pdf",
    file_type: "pdf",
    relevant_content: "Comprehensive study on using big data analytics for defense intelligence gathering and analysis...",
    download_status: "downloaded",
    created_at: "2025-10-08 16:15:40"
  },
  {
    id: 11,
    title: "Hệ thống giám sát biên giới thông minh sử dụng IoT",
    url: null,
    language: "VN",
    search_engine: "Google",
    file_path: "/var/www/documents/iot_border_surveillance.docx",
    file_type: "docx",
    relevant_content: "Nghiên cứu ứng dụng IoT trong hệ thống giám sát biên giới tự động...",
    download_status: "downloaded",
    created_at: "2025-10-08 16:30:15"
  },
  {
    id: 12,
    title: "Drone Swarm Technology for Military Operations",
    url: "https://duckduckgo.com/drone-swarm-military",
    language: "EN",
    search_engine: "DuckDuckGo",
    file_path: null,
    file_type: "online",
    relevant_content: "Analysis of drone swarm technology applications in modern military operations...",
    download_status: "N/A",
    created_at: "2025-10-08 16:45:50"
  }
];

// Các tùy chọn cho dropdown
export const languageOptions = [
  { value: "ALL", label: "Tất cả ngôn ngữ" },
  { value: "VN", label: "Tiếng Việt" },
  { value: "EN", label: "English" },
  { value: "ZH", label: "中文 (Chinese)" }
];

export const sourceOptions = [
  { value: "ALL", label: "Tất cả nguồn" },
  { value: "Google", label: "Google" },
  { value: "Bing", label: "Bing" },
  { value: "DuckDuckGo", label: "DuckDuckGo" },
  { value: "Baidu", label: "Baidu (百度)" }
];

// Icon mapping cho các nguồn
export const sourceIcons = {
  "Google": "🔍",
  "Bing": "🔎",
  "DuckDuckGo": "🦆",
  "Baidu": "🔍",
  "File": "📄"
};

