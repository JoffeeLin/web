/**
 * 增强广告系统模块
 * 为网站添加更完善的广告功能，完全由用户投票控制
 */

(function() {
  'use strict';
  
  // 配置
  const config = {
    // 是否启用广告系统
    enableAds: true,
    // 默认广告位置
    defaultAdPosition: 'sidebar',
    // 默认广告类型
    defaultAdType: 'image',
    // 默认广告频率
    defaultAdFrequency: 'medium',
    // 默认广告主题匹配
    defaultAdThemeMatching: 'enabled',
    // 默认广告个性化
    defaultAdPersonalization: 'disabled',
    // 默认广告互动性
    defaultAdInteractivity: 'low',
    // 默认广告收益分配
    defaultAdRevenueAllocation: 'site_improvement',
    // 默认广告内容过滤
    defaultAdContentFiltering: 'strict'
  };
  
  // 广告位置配置
  const adPositionConfig = {
    current: config.defaultAdPosition,
    options: ['sidebar', 'banner', 'footer', 'inline', 'popup', 'none'],
    descriptions: {
      sidebar: '侧边栏广告',
      banner: '横幅广告',
      footer: '页脚广告',
      inline: '内嵌广告',
      popup: '弹出广告',
      none: '无广告'
    }
  };
  
  // 广告类型配置
  const adTypeConfig = {
    current: config.defaultAdType,
    options: ['image', 'text', 'mixed', 'video', 'interactive'],
    descriptions: {
      image: '图片广告',
      text: '文字广告',
      mixed: '图文混合广告',
      video: '视频广告',
      interactive: '互动广告'
    }
  };
  
  // 广告频率配置
  const adFrequencyConfig = {
    current: config.defaultAdFrequency,
    options: ['low', 'medium', 'high'],
    descriptions: {
      low: '低频率（每10分钟显示一次）',
      medium: '中频率（每5分钟显示一次）',
      high: '高频率（每2分钟显示一次）'
    },
    intervals: {
      low: 10 * 60 * 1000,
      medium: 5 * 60 * 1000,
      high: 2 * 60 * 1000
    }
  };
  
  // 广告主题匹配配置
  const adThemeMatchingConfig = {
    current: config.defaultAdThemeMatching,
    options: ['enabled', 'disabled'],
    descriptions: {
      enabled: '启用主题匹配',
      disabled: '禁用主题匹配'
    }
  };
  
  // 广告个性化配置
  const adPersonalizationConfig = {
    current: config.defaultAdPersonalization,
    options: ['enabled', 'disabled'],
    descriptions: {
      enabled: '启用个性化广告',
      disabled: '禁用个性化广告'
    }
  };
  
  // 广告互动性配置
  const adInteractivityConfig = {
    current: config.defaultAdInteractivity,
    options: ['low', 'medium', 'high'],
    descriptions: {
      low: '低互动性（静态广告）',
      medium: '中互动性（简单动画）',
      high: '高互动性（完全互动）'
    }
  };
  
  // 广告收益分配配置
  const adRevenueAllocationConfig = {
    current: config.defaultAdRevenueAllocation,
    options: ['site_improvement', 'user_rewards', 'charity', 'mixed'],
    descriptions: {
      site_improvement: '网站改进',
      user_rewards: '用户奖励',
      charity: '慈善捐赠',
      mixed: '混合分配'
    }
  };
  
  // 广告内容过滤配置
  const adContentFilteringConfig = {
    current: config.defaultAdContentFiltering,
    options: ['none', 'basic', 'strict'],
    descriptions: {
      none: '无过滤',
      basic: '基本过滤',
      strict: '严格过滤'
    }
  };
  
  // 广告数据
  let adData = {
    lastShown: 0,
    currentAds: [],
    adHistory: [],
    userPreferences: {},
    adStats: {
      shown: 0,
      clicked: 0,
      dismissed: 0,
      revenue: 0
    }
  };
  
  // 示例广告内容
  const sampleAds = [
    {
      id: 'ad1',
      type: 'image',
      title: '高品质耳机',
      description: '体验无与伦比的音质，限时8折优惠！',
      imageUrl: 'https://via.placeholder.com/300x200?text=Premium+Headphones',
      targetUrl: '#ad-headphones',
      category: 'electronics',
      interactivity: 'low'
    },
    {
      id: 'ad2',
      type: 'text',
      title: '专业网站开发',
      description: '需要一个专业的网站吗？我们的团队可以帮助您从构思到上线的全过程。',
      targetUrl: '#ad-webdev',
      category: 'services',
      interactivity: 'low'
    },
    {
      id: 'ad3',
      type: 'mixed',
      title: '健康饮食计划',
      description: '定制您的健康饮食计划，专业营养师指导。',
      imageUrl: 'https://via.placeholder.com/300x200?text=Healthy+Diet+Plan',
      targetUrl: '#ad-diet',
      category: 'health',
      interactivity: 'medium'
    },
    {
      id: 'ad4',
      type: 'image',
      title: '旅游胜地推荐',
      description: '探索世界上最美丽的地方，特价机票等你来抢！',
      imageUrl: 'https://via.placeholder.com/300x200?text=Travel+Destinations',
      targetUrl: '#ad-travel',
      category: 'travel',
      interactivity: 'low'
    },
    {
      id: 'ad5',
      type: 'mixed',
      title: '在线课程',
      description: '提升您的技能，数千门课程任您选择。',
      imageUrl: 'https://via.placeholder.com/300x200?text=Online+Courses',
      targetUrl: '#ad-courses',
      category: 'education',
      interactivity: 'medium'
    },
    {
      id: 'ad6',
      type: 'interactive',
      title: '互动游戏体验',
      description: '尝试我们的小游戏，赢取优惠券！',
      gameUrl: '#ad-game',
      targetUrl: '#ad-game-reward',
      category: 'entertainment',
      interactivity: 'high'
    },
    {
      id: 'ad7',
      type: 'video',
      title: '新品发布',
      description: '查看我们最新产品的视频介绍。',
      videoUrl: 'https://example.com/video.mp4',
      thumbnailUrl: 'https://via.placeholder.com/300x200?text=New+Product+Video',
      targetUrl: '#ad-new-product',
      category: 'products',
      interactivity: 'medium'
    },
    {
      id: 'ad8',
      type: 'text',
      title: '订阅我们的通讯',
      description: '获取最新的行业动态和独家优惠。',
      targetUrl: '#ad-newsletter',
      category: 'marketing',
      interactivity: 'low'
    }
  ];
  
  // 初始化广告系统
  function initAdvertisementSystem() {
    console.log("初始化广告系统...");
    
    // 加载保存的配置
    loadSavedConfig();
    
    // 创建广告参数投票
    createAdParameterPolls();
    
    // 创建广告容器
    createAdContainers();
    
    // 初始化广告显示
    initAdDisplay();
    
    // 初始化广告统计
    initAdStats();
    
    // 初始化广告设置UI
    initAdSettingsUI();
    
    console.log("广告系统初始化完成");
  }
  
  // 加载保存的配置
  function loadSavedConfig() {
    const savedConfig = localStorage.getItem('adSystemConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        
        // 更新配置
        if (parsedConfig.adPositionConfig) {
          adPositionConfig.current = parsedConfig.adPositionConfig.current;
        }
        
        if (parsedConfig.adTypeConfig) {
          adTypeConfig.current = parsedConfig.adTypeConfig.current;
        }
        
        if (parsedConfig.adFrequencyConfig) {
          adFrequencyConfig.current = parsedConfig.adFrequencyConfig.current;
        }
        
        if (parsedConfig.adThemeMatchingConfig) {
          adThemeMatchingConfig.current = parsedConfig.adThemeMatchingConfig.current;
        }
        
        if (parsedConfig.adPersonalizationConfig) {
          adPersonalizationConfig.current = parsedConfig.adPersonalizationConfig.current;
        }
        
        if (parsedConfig.adInteractivityConfig) {
          adInteractivityConfig.current = parsedConfig.adInteractivityConfig.current;
        }
        
        if (parsedConfig.adRevenueAllocationConfig) {
          adRevenueAllocationConfig.current = parsedConfig.adRevenueAllocationConfig.current;
        }
        
        if (parsedConfig.adContentFilteringConfig) {
          adContentFilteringConfig.current = parsedConfig.adContentFilteringConfig.current;
        }
        
        console.log("已加载保存的广告系统配置");
      } catch (error) {
        console.error("解析保存的配置时出错:", error);
      }
    }
    
    // 加载广告数据
    const savedAdData = localStorage.getItem('adData');
    if (savedAdData) {
      try {
        const parsedAdData = JSON.parse(savedAdData);
        adData = { ...adData, ...parsedAdData };
        console.log("已加载保存的广告数据");
      } catch (error) {
        console.error("解析保存的广告数据时出错:", error);
      }
    }
  }
  
  // 保存配置
  function saveConfig() {
    const configToSave = {
      adPositionConfig: {
        current: adPositionConfig.current
      },
      adTypeConfig: {
        current: adTypeConfig.current
      },
      adFrequencyConfig: {
        current: adFrequencyConfig.current
      },
      adThemeMatchingConfig: {
        current: adThemeMatchingConfig.current
      },
      adPersonalizationConfig: {
        current: adPersonalizationConfig.current
      },
      adInteractivityConfig: {
        current: adInteractivityConfig.current
      },
      adRevenueAllocationConfig: {
        current: adRevenueAllocationConfig.current
      },
      adContentFilteringConfig: {
        current: adContentFilteringConfig.current
      }
    };
    
    localStorage.setItem('adSystemConfig', JSON.stringify(configToSave));
    console.log("广告系统配置已保存");
    
    // 保存广告数据
    localStorage.setItem('adData', JSON.stringify(adData));
    console.log("广告数据已保存");
  }
  
  // 创建广告参数投票
  function createAdParameterPolls() {
    console.log("创建广告参数投票...");
    
    // 检查是否有createParameterPoll函数
    if (typeof window.createParameterPoll !== 'function') {
      console.warn("createParameterPoll函数不存在，无法创建广告参数投票");
      return;
    }
    
    // 创建广告参数类别（如果不存在）
    if (!window.websiteParameters.advertisement) {
      window.websiteParameters.advertisement = {};
    }
    
    // 添加广告位置参数
    window.websiteParameters.advertisement.adPosition = {
      current: adPositionConfig.current,
      options: adPositionConfig.options,
      description: '广告位置'
    };
    
    // 添加广告类型参数
    window.websiteParameters.advertisement.adType = {
      current: adTypeConfig.current,
      options: adTypeConfig.options,
      description: '广告类型'
    };
    
    // 添加广告频率参数
    window.websiteParameters.advertisement.adFrequency = {
      current: adFrequencyConfig.current,
      options: adFrequencyConfig.options,
      description: '广告频率'
    };
    
    // 添加广告主题匹配参数
    window.websiteParameters.advertisement.adThemeMatching = {
      current: adThemeMatchingConfig.current,
      options: adThemeMatchingConfig.options,
      description: '广告主题匹配'
    };
    
    // 添加广告个性化参数
    window.websiteParameters.advertisement.adPersonalization = {
      current: adPersonalizationConfig.current,
      options: adPersonalizationConfig.options,
      description: '广告个性化'
    };
    
    // 添加广告互动性参数
    window.websiteParameters.advertisement.adInteractivity = {
      current: adInteractivityConfig.current,
      options: adInteractivityConfig.options,
      description: '广告互动性'
    };
    
    // 添加广告收益分配参数
    window.websiteParameters.advertisement.adRevenueAllocation = {
      current: adRevenueAllocationConfig.current,
      options: adRevenueAllocationConfig.options,
      description: '广告收益分配'
    };
    
    // 添加广告内容过滤参数
    window.websiteParameters.advertisement.adContentFiltering = {
      current: adContentFilteringConfig.current,
      options: adContentFilteringConfig.options,
      description: '广告内容过滤'
    };
    
    // 创建广告位置投票
    window.createParameterPoll('advertisement', 'adPosition', ['侧边栏广告', '横幅广告', '页脚广告', '内嵌广告', '弹出广告', '无广告'], null);
    
    // 创建广告类型投票
    window.createParameterPoll('advertisement', 'adType', ['图片广告', '文字广告', '图文混合广告', '视频广告', '互动广告'], null);
    
    // 创建广告频率投票
    window.createParameterPoll('advertisement', 'adFrequency', ['低频率', '中频率', '高频率'], null);
    
    // 创建广告主题匹配投票
    window.createParameterPoll('advertisement', 'adThemeMatching', ['启用主题匹配', '禁用主题匹配'], null);
    
    // 创建广告个性化投票
    window.createParameterPoll('advertisement', 'adPersonalization', ['启用个性化广告', '禁用个性化广告'], null);
    
    // 创建广告互动性投票
    window.createParameterPoll('advertisement', 'adInteractivity', ['低互动性', '中互动性', '高互动性'], null);
    
    // 创建广告收益分配投票
    window.createParameterPoll('advertisement', 'adRevenueAllocation', ['网站改进', '用户奖励', '慈善捐赠', '混合分配'], null);
    
    // 创建广告内容过滤投票
    window.createParameterPoll('advertisement', 'adContentFiltering', ['无过滤', '基本过滤', '严格过滤'], null);
    
    console.log("广告参数投票已创建");
  }
  
  // 创建广告容器
  function createAdContainers() {
    console.log("创建广告容器...");
    
    // 检查是否已存在广告容器
    if (document.getElementById('sidebar-ad-container') || 
        document.getElementById('banner-ad-container') || 
        document.getElementById('footer-ad-container') || 
        document.getElementById('inline-ad-container') || 
        document.getElementById('popup-ad-container')) {
      console.log("广告容器已存在");
      return;
    }
    
    // 创建侧边栏广告容器
    const sidebarAdContainer = document.createElement('div');
    sidebarAdContainer.id = 'sidebar-ad-container';
    sidebarAdContainer.className = 'ad-container sidebar-ad-container';
    
    // 创建横幅广告容器
    const bannerAdContainer = document.createElement('div');
    bannerAdContainer.id = 'banner-ad-container';
    bannerAdContainer.className = 'ad-container banner-ad-container';
    
    // 创建页脚广告容器
    const footerAdContainer = document.createElement('div');
    footerAdContainer.id = 'footer-ad-container';
    footerAdContainer.className = 'ad-container footer-ad-container';
    
    // 创建内嵌广告容器
    const inlineAdContainer = document.createElement('div');
    inlineAdContainer.id = 'inline-ad-container';
    inlineAdContainer.className = 'ad-container inline-ad-container';
    
    // 创建弹出广告容器
    const popupAdContainer = document.createElement('div');
    popupAdContainer.id = 'popup-ad-container';
    popupAdContainer.className = 'ad-container popup-ad-container';
    
    // 添加到文档
    document.body.appendChild(sidebarAdContainer);
    document.body.appendChild(bannerAdContainer);
    document.body.appendChild(footerAdContainer);
    document.body.appendChild(inlineAdContainer);
    document.body.appendChild(popupAdContainer);
    
    // 添加广告样式
    const style = document.createElement('style');
    style.textContent = `
      .ad-container {
        display: none;
        box-sizing: border-box;
        background-color: var(--background-color, white);
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        margin: 10px 0;
        position: relative;
      }
      
      .ad-container.active {
        display: block;
      }
      
      .sidebar-ad-container {
        position: fixed;
        top: 100px;
        right: 20px;
        width: 300px;
        max-width: 25%;
        z-index: 900;
      }
      
      .banner-ad-container {
        width: 100%;
        max-width: 100%;
        padding: 10px;
        text-align: center;
        margin: 0 auto 20px auto;
      }
      
      .footer-ad-container {
        width: 100%;
        max-width: 100%;
        padding: 10px;
        text-align: center;
        margin: 20px auto 0 auto;
      }
      
      .inline-ad-container {
        width: 100%;
        max-width: 100%;
        padding: 10px;
        text-align: center;
        margin: 20px auto;
      }
      
      .popup-ad-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        max-width: 500px;
        z-index: 1000;
        padding: 20px;
      }
      
      .popup-ad-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
        display: none;
      }
      
      .popup-ad-overlay.active {
        display: block;
      }
      
      .ad-content {
        padding: 15px;
      }
      
      .ad-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        background-color: var(--primary-color-light, #e3f2fd);
        color: var(--primary-color-dark, #1976d2);
      }
      
      .ad-title {
        font-weight: bold;
        font-size: 16px;
        margin: 0;
      }
      
      .ad-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: var(--primary-color-dark, #1976d2);
      }
      
      .ad-image {
        width: 100%;
        max-width: 100%;
        height: auto;
        display: block;
        margin-bottom: 10px;
      }
      
      .ad-description {
        font-size: 14px;
        line-height: 1.4;
        margin-bottom: 10px;
      }
      
      .ad-cta {
        display: inline-block;
        padding: 8px 15px;
        background-color: var(--primary-color, #4a90e2);
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-size: 14px;
        margin-top: 10px;
        cursor: pointer;
      }
      
      .ad-footer {
        font-size: 12px;
        color: #999;
        text-align: center;
        padding: 5px;
        border-top: 1px solid #eee;
      }
      
      .ad-badge {
        position: absolute;
        top: 5px;
        left: 5px;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        font-size: 10px;
        padding: 2px 5px;
        border-radius: 3px;
      }
      
      .ad-interactive {
        min-height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      
      .ad-video-container {
        position: relative;
        width: 100%;
        padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
      }
      
      .ad-video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      
      .ad-text {
        padding: 15px;
      }
      
      /* 响应式调整 */
      @media (max-width: 768px) {
        .sidebar-ad-container {
          position: static;
          width: 100%;
          max-width: 100%;
          margin: 10px auto;
        }
        
        .popup-ad-container {
          width: 95%;
        }
      }
      
      /* 暗色模式适配 */
      .dark-mode .ad-container {
        background-color: var(--dark-background-color, #333);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      }
      
      .dark-mode .ad-header {
        background-color: var(--dark-primary-color-light, #1e3a5f);
        color: var(--dark-primary-color, #90caf9);
      }
      
      .dark-mode .ad-close {
        color: var(--dark-primary-color, #90caf9);
      }
      
      .dark-mode .ad-footer {
        color: #777;
        border-top-color: #444;
      }
      
      /* 广告设置面板 */
      .ad-settings-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        max-width: 500px;
        max-height: 80vh;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: none;
        flex-direction: column;
        overflow: hidden;
      }
      
      .ad-settings-panel.active {
        display: flex;
      }
      
      .ad-settings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid #eee;
      }
      
      .ad-settings-header h3 {
        margin: 0;
        font-size: 18px;
      }
      
      .ad-settings-content {
        padding: 15px;
        overflow-y: auto;
      }
      
      .ad-settings-section {
        margin-bottom: 20px;
      }
      
      .ad-settings-section h4 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 16px;
      }
      
      .ad-settings-option {
        margin-bottom: 10px;
      }
      
      .ad-settings-label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }
      
      .ad-settings-value {
        padding: 10px;
        background-color: #f5f5f5;
        border-radius: 4px;
      }
      
      .ad-settings-description {
        font-size: 12px;
        color: #666;
        margin-top: 5px;
      }
      
      .ad-settings-button {
        position: fixed;
        bottom: 220px;
        right: 20px;
        background-color: var(--primary-color, #4a90e2);
        color: white;
        border: none;
        border-radius: 50px;
        padding: 10px 15px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        z-index: 999;
      }
      
      .ad-settings-icon {
        margin-right: 5px;
        font-size: 16px;
      }
      
      .dark-mode .ad-settings-panel {
        background-color: #333;
        color: white;
      }
      
      .dark-mode .ad-settings-header {
        border-bottom-color: #444;
      }
      
      .dark-mode .ad-settings-value {
        background-color: #444;
      }
      
      .dark-mode .ad-settings-description {
        color: #aaa;
      }
      
      /* 广告统计面板 */
      .ad-stats-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        max-width: 500px;
        max-height: 80vh;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: none;
        flex-direction: column;
        overflow: hidden;
      }
      
      .ad-stats-panel.active {
        display: flex;
      }
      
      .ad-stats-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid #eee;
      }
      
      .ad-stats-header h3 {
        margin: 0;
        font-size: 18px;
      }
      
      .ad-stats-content {
        padding: 15px;
        overflow-y: auto;
      }
      
      .ad-stats-section {
        margin-bottom: 20px;
      }
      
      .ad-stats-section h4 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 16px;
      }
      
      .ad-stats-item {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        background-color: #f5f5f5;
        border-radius: 4px;
        margin-bottom: 10px;
      }
      
      .ad-stats-label {
        font-weight: bold;
      }
      
      .ad-stats-value {
        font-weight: bold;
        color: var(--primary-color, #4a90e2);
      }
      
      .ad-stats-chart {
        width: 100%;
        height: 200px;
        background-color: #f5f5f5;
        border-radius: 4px;
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      .dark-mode .ad-stats-panel {
        background-color: #333;
        color: white;
      }
      
      .dark-mode .ad-stats-header {
        border-bottom-color: #444;
      }
      
      .dark-mode .ad-stats-item {
        background-color: #444;
      }
      
      .dark-mode .ad-stats-value {
        color: var(--dark-primary-color, #90caf9);
      }
      
      .dark-mode .ad-stats-chart {
        background-color: #444;
      }
    `;
    
    document.head.appendChild(style);
    
    // 创建弹出广告遮罩
    const popupAdOverlay = document.createElement('div');
    popupAdOverlay.id = 'popup-ad-overlay';
    popupAdOverlay.className = 'popup-ad-overlay';
    document.body.appendChild(popupAdOverlay);
    
    console.log("广告容器已创建");
  }
  
  // 初始化广告显示
  function initAdDisplay() {
    console.log("初始化广告显示...");
    
    // 更新广告显示
    updateAdDisplay();
    
    // 设置定时器，定期检查是否需要显示广告
    setInterval(function() {
      checkAndShowAd();
    }, 30000); // 每30秒检查一次
    
    // 立即检查是否需要显示广告
    setTimeout(function() {
      checkAndShowAd();
    }, 5000); // 页面加载5秒后检查
    
    console.log("广告显示初始化完成");
  }
  
  // 更新广告显示
  function updateAdDisplay() {
    console.log("更新广告显示...");
    
    // 获取当前广告位置
    const currentPosition = adPositionConfig.current;
    
    // 隐藏所有广告容器
    hideAllAdContainers();
    
    // 如果选择了"无广告"，不显示广告
    if (currentPosition === 'none') {
      console.log("当前设置为不显示广告");
      return;
    }
    
    // 显示对应位置的广告容器
    const containerMap = {
      sidebar: 'sidebar-ad-container',
      banner: 'banner-ad-container',
      footer: 'footer-ad-container',
      inline: 'inline-ad-container',
      popup: 'popup-ad-container'
    };
    
    const containerId = containerMap[currentPosition];
    if (containerId) {
      const container = document.getElementById(containerId);
      if (container) {
        container.classList.add('active');
        
        // 如果是弹出广告，显示遮罩
        if (currentPosition === 'popup') {
          const overlay = document.getElementById('popup-ad-overlay');
          if (overlay) {
            overlay.classList.add('active');
          }
        }
        
        console.log(`显示${adPositionConfig.descriptions[currentPosition]}`);
      }
    }
  }
  
  // 隐藏所有广告容器
  function hideAllAdContainers() {
    const containers = document.querySelectorAll('.ad-container');
    containers.forEach(container => {
      container.classList.remove('active');
    });
    
    // 隐藏弹出广告遮罩
    const overlay = document.getElementById('popup-ad-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  }
  
  // 检查并显示广告
  function checkAndShowAd() {
    // 如果选择了"无广告"，不显示广告
    if (adPositionConfig.current === 'none') {
      return;
    }
    
    // 获取当前时间
    const now = Date.now();
    
    // 获取广告频率
    const frequency = adFrequencyConfig.current;
    const interval = adFrequencyConfig.intervals[frequency];
    
    // 检查是否需要显示广告
    if (now - adData.lastShown > interval) {
      // 显示广告
      showAd();
      
      // 更新最后显示时间
      adData.lastShown = now;
      
      // 保存广告数据
      saveConfig();
    }
  }
  
  // 显示广告
  function showAd() {
    console.log("显示广告...");
    
    // 获取当前广告位置
    const currentPosition = adPositionConfig.current;
    
    // 获取当前广告类型
    const currentType = adTypeConfig.current;
    
    // 获取当前广告互动性
    const currentInteractivity = adInteractivityConfig.current;
    
    // 选择合适的广告
    const ad = selectAd(currentType, currentInteractivity);
    if (!ad) {
      console.log("没有找到合适的广告");
      return;
    }
    
    // 获取对应的广告容器
    const containerMap = {
      sidebar: 'sidebar-ad-container',
      banner: 'banner-ad-container',
      footer: 'footer-ad-container',
      inline: 'inline-ad-container',
      popup: 'popup-ad-container'
    };
    
    const containerId = containerMap[currentPosition];
    if (!containerId) {
      console.log("无效的广告位置");
      return;
    }
    
    const container = document.getElementById(containerId);
    if (!container) {
      console.log("找不到广告容器");
      return;
    }
    
    // 创建广告内容
    let adHtml = '';
    
    // 添加广告标记
    adHtml += '<div class="ad-badge">广告</div>';
    
    // 添加广告头部
    adHtml += `
      <div class="ad-header">
        <h3 class="ad-title">${ad.title}</h3>
        <button class="ad-close" data-action="close-ad">×</button>
      </div>
    `;
    
    // 根据广告类型添加不同内容
    switch (ad.type) {
      case 'image':
        adHtml += `
          <div class="ad-content">
            <img src="${ad.imageUrl}" alt="${ad.title}" class="ad-image">
            <p class="ad-description">${ad.description}</p>
            <a href="${ad.targetUrl}" class="ad-cta" data-ad-id="${ad.id}">了解更多</a>
          </div>
        `;
        break;
      case 'text':
        adHtml += `
          <div class="ad-text">
            <p class="ad-description">${ad.description}</p>
            <a href="${ad.targetUrl}" class="ad-cta" data-ad-id="${ad.id}">了解更多</a>
          </div>
        `;
        break;
      case 'mixed':
        adHtml += `
          <div class="ad-content">
            <img src="${ad.imageUrl}" alt="${ad.title}" class="ad-image">
            <p class="ad-description">${ad.description}</p>
            <a href="${ad.targetUrl}" class="ad-cta" data-ad-id="${ad.id}">了解更多</a>
          </div>
        `;
        break;
      case 'video':
        adHtml += `
          <div class="ad-content">
            <div class="ad-video-container">
              <video class="ad-video" poster="${ad.thumbnailUrl}" controls>
                <source src="${ad.videoUrl}" type="video/mp4">
                您的浏览器不支持视频标签。
              </video>
            </div>
            <p class="ad-description">${ad.description}</p>
            <a href="${ad.targetUrl}" class="ad-cta" data-ad-id="${ad.id}">了解更多</a>
          </div>
        `;
        break;
      case 'interactive':
        adHtml += `
          <div class="ad-interactive">
            <p class="ad-description">${ad.description}</p>
            <a href="${ad.gameUrl}" class="ad-cta" data-ad-id="${ad.id}">开始体验</a>
          </div>
        `;
        break;
      default:
        adHtml += `
          <div class="ad-content">
            <p class="ad-description">${ad.description}</p>
            <a href="${ad.targetUrl}" class="ad-cta" data-ad-id="${ad.id}">了解更多</a>
          </div>
        `;
    }
    
    // 添加广告页脚
    adHtml += `
      <div class="ad-footer">
        广告 · <a href="#" data-action="ad-settings">设置</a> · <a href="#" data-action="ad-feedback">反馈</a>
      </div>
    `;
    
    // 设置广告内容
    container.innerHTML = adHtml;
    
    // 显示广告容器
    container.classList.add('active');
    
    // 如果是弹出广告，显示遮罩
    if (currentPosition === 'popup') {
      const overlay = document.getElementById('popup-ad-overlay');
      if (overlay) {
        overlay.classList.add('active');
      }
    }
    
    // 添加关闭按钮事件
    const closeButton = container.querySelector('.ad-close');
    if (closeButton) {
      closeButton.addEventListener('click', function() {
        // 隐藏广告
        container.classList.remove('active');
        
        // 如果是弹出广告，隐藏遮罩
        if (currentPosition === 'popup') {
          const overlay = document.getElementById('popup-ad-overlay');
          if (overlay) {
            overlay.classList.remove('active');
          }
        }
        
        // 记录广告被关闭
        recordAdDismissed(ad.id);
      });
    }
    
    // 添加广告点击事件
    const ctaButton = container.querySelector('.ad-cta');
    if (ctaButton) {
      ctaButton.addEventListener('click', function(e) {
        // 阻止默认行为
        e.preventDefault();
        
        // 获取广告ID
        const adId = this.dataset.adId;
        
        // 记录广告被点击
        recordAdClicked(adId);
        
        // 打开目标链接
        window.open(this.href, '_blank');
      });
    }
    
    // 添加广告设置事件
    const settingsLink = container.querySelector('[data-action="ad-settings"]');
    if (settingsLink) {
      settingsLink.addEventListener('click', function(e) {
        // 阻止默认行为
        e.preventDefault();
        
        // 显示广告设置面板
        showAdSettingsPanel();
      });
    }
    
    // 添加广告反馈事件
    const feedbackLink = container.querySelector('[data-action="ad-feedback"]');
    if (feedbackLink) {
      feedbackLink.addEventListener('click', function(e) {
        // 阻止默认行为
        e.preventDefault();
        
        // 显示广告反馈面板
        showAdFeedbackPanel();
      });
    }
    
    // 记录广告被显示
    recordAdShown(ad.id);
    
    console.log(`广告已显示: ${ad.title}`);
  }
  
  // 选择广告
  function selectAd(type, interactivity) {
    // 过滤符合类型和互动性的广告
    const filteredAds = sampleAds.filter(ad => {
      // 检查类型
      if (type !== 'mixed' && ad.type !== type) {
        return false;
      }
      
      // 检查互动性
      if (interactivity === 'low' && ad.interactivity !== 'low') {
        return false;
      } else if (interactivity === 'medium' && ad.interactivity === 'high') {
        return false;
      }
      
      // 检查内容过滤
      if (adContentFilteringConfig.current !== 'none') {
        // 这里可以添加更复杂的内容过滤逻辑
        // 简单起见，我们假设所有示例广告都通过了基本过滤
        if (adContentFilteringConfig.current === 'strict') {
          // 严格过滤可能会排除某些类别的广告
          if (ad.category === 'entertainment') {
            return false;
          }
        }
      }
      
      return true;
    });
    
    // 如果没有符合条件的广告，返回null
    if (filteredAds.length === 0) {
      return null;
    }
    
    // 如果启用了主题匹配
    if (adThemeMatchingConfig.current === 'enabled') {
      // 获取当前网站主题
      const isDarkMode = document.body.classList.contains('dark-mode');
      const currentTheme = isDarkMode ? 'dark' : 'light';
      
      // 尝试找到与主题匹配的广告
      const themeMatchedAds = filteredAds.filter(ad => {
        // 这里可以添加更复杂的主题匹配逻辑
        // 简单起见，我们假设某些类别的广告更适合特定主题
        if (currentTheme === 'dark' && (ad.category === 'electronics' || ad.category === 'entertainment')) {
          return true;
        } else if (currentTheme === 'light' && (ad.category === 'health' || ad.category === 'travel')) {
          return true;
        }
        return false;
      });
      
      // 如果有匹配的广告，从中随机选择一个
      if (themeMatchedAds.length > 0) {
        return themeMatchedAds[Math.floor(Math.random() * themeMatchedAds.length)];
      }
    }
    
    // 如果启用了个性化
    if (adPersonalizationConfig.current === 'enabled') {
      // 获取当前用户
      const currentUser = window.currentUser;
      
      if (currentUser && adData.userPreferences[currentUser]) {
        // 获取用户偏好
        const preferences = adData.userPreferences[currentUser];
        
        // 尝试找到与用户偏好匹配的广告
        const personalizedAds = filteredAds.filter(ad => {
          return preferences.categories.includes(ad.category);
        });
        
        // 如果有匹配的广告，从中随机选择一个
        if (personalizedAds.length > 0) {
          return personalizedAds[Math.floor(Math.random() * personalizedAds.length)];
        }
      }
    }
    
    // 随机选择一个广告
    return filteredAds[Math.floor(Math.random() * filteredAds.length)];
  }
  
  // 记录广告被显示
  function recordAdShown(adId) {
    // 增加显示次数
    adData.adStats.shown++;
    
    // 添加到广告历史
    adData.adHistory.push({
      id: adId,
      action: 'shown',
      timestamp: Date.now()
    });
    
    // 限制历史记录数量
    if (adData.adHistory.length > 100) {
      adData.adHistory.shift();
    }
    
    // 保存广告数据
    saveConfig();
    
    console.log(`记录广告显示: ${adId}`);
  }
  
  // 记录广告被点击
  function recordAdClicked(adId) {
    // 增加点击次数
    adData.adStats.clicked++;
    
    // 添加到广告历史
    adData.adHistory.push({
      id: adId,
      action: 'clicked',
      timestamp: Date.now()
    });
    
    // 增加广告收益
    adData.adStats.revenue += 0.1; // 假设每次点击收益0.1元
    
    // 更新用户偏好
    updateUserPreferences(adId);
    
    // 保存广告数据
    saveConfig();
    
    console.log(`记录广告点击: ${adId}`);
  }
  
  // 记录广告被关闭
  function recordAdDismissed(adId) {
    // 增加关闭次数
    adData.adStats.dismissed++;
    
    // 添加到广告历史
    adData.adHistory.push({
      id: adId,
      action: 'dismissed',
      timestamp: Date.now()
    });
    
    // 保存广告数据
    saveConfig();
    
    console.log(`记录广告关闭: ${adId}`);
  }
  
  // 更新用户偏好
  function updateUserPreferences(adId) {
    // 获取当前用户
    const currentUser = window.currentUser;
    if (!currentUser) return;
    
    // 获取广告信息
    const ad = sampleAds.find(a => a.id === adId);
    if (!ad) return;
    
    // 初始化用户偏好（如果不存在）
    if (!adData.userPreferences[currentUser]) {
      adData.userPreferences[currentUser] = {
        categories: [],
        types: [],
        lastUpdate: Date.now()
      };
    }
    
    // 获取用户偏好
    const preferences = adData.userPreferences[currentUser];
    
    // 更新类别偏好
    if (!preferences.categories.includes(ad.category)) {
      preferences.categories.push(ad.category);
    }
    
    // 更新类型偏好
    if (!preferences.types.includes(ad.type)) {
      preferences.types.push(ad.type);
    }
    
    // 更新最后更新时间
    preferences.lastUpdate = Date.now();
    
    console.log(`更新用户偏好: ${currentUser}`);
  }
  
  // 初始化广告统计
  function initAdStats() {
    console.log("初始化广告统计...");
    
    // 创建广告统计面板
    createAdStatsPanel();
    
    console.log("广告统计初始化完成");
  }
  
  // 创建广告统计面板
  function createAdStatsPanel() {
    // 检查是否已存在广告统计面板
    if (document.getElementById('ad-stats-panel')) {
      console.log("广告统计面板已存在");
      return;
    }
    
    // 创建广告统计面板
    const statsPanel = document.createElement('div');
    statsPanel.id = 'ad-stats-panel';
    statsPanel.className = 'ad-stats-panel';
    statsPanel.innerHTML = `
      <div class="ad-stats-header">
        <h3>广告统计</h3>
        <button id="close-ad-stats-panel" class="close-button">×</button>
      </div>
      <div class="ad-stats-content">
        <div class="ad-stats-section">
          <h4>基本统计</h4>
          <div class="ad-stats-item">
            <span class="ad-stats-label">展示次数</span>
            <span class="ad-stats-value" id="ad-stats-shown">0</span>
          </div>
          <div class="ad-stats-item">
            <span class="ad-stats-label">点击次数</span>
            <span class="ad-stats-value" id="ad-stats-clicked">0</span>
          </div>
          <div class="ad-stats-item">
            <span class="ad-stats-label">关闭次数</span>
            <span class="ad-stats-value" id="ad-stats-dismissed">0</span>
          </div>
          <div class="ad-stats-item">
            <span class="ad-stats-label">点击率</span>
            <span class="ad-stats-value" id="ad-stats-ctr">0%</span>
          </div>
        </div>
        <div class="ad-stats-section">
          <h4>收益统计</h4>
          <div class="ad-stats-item">
            <span class="ad-stats-label">总收益</span>
            <span class="ad-stats-value" id="ad-stats-revenue">¥0.00</span>
          </div>
          <div class="ad-stats-item">
            <span class="ad-stats-label">收益分配</span>
            <span class="ad-stats-value" id="ad-stats-allocation">${adRevenueAllocationConfig.descriptions[adRevenueAllocationConfig.current]}</span>
          </div>
        </div>
        <div class="ad-stats-section">
          <h4>趋势图表</h4>
          <div class="ad-stats-chart" id="ad-stats-chart">
            图表加载中...
          </div>
        </div>
      </div>
    `;
    
    // 添加到文档
    document.body.appendChild(statsPanel);
    
    // 添加关闭按钮事件
    document.getElementById('close-ad-stats-panel').addEventListener('click', function() {
      statsPanel.classList.remove('active');
    });
    
    console.log("广告统计面板已创建");
  }
  
  // 更新广告统计面板
  function updateAdStatsPanel() {
    // 更新基本统计
    document.getElementById('ad-stats-shown').textContent = adData.adStats.shown;
    document.getElementById('ad-stats-clicked').textContent = adData.adStats.clicked;
    document.getElementById('ad-stats-dismissed').textContent = adData.adStats.dismissed;
    
    // 计算点击率
    const ctr = adData.adStats.shown > 0 ? (adData.adStats.clicked / adData.adStats.shown * 100).toFixed(2) : '0';
    document.getElementById('ad-stats-ctr').textContent = `${ctr}%`;
    
    // 更新收益统计
    document.getElementById('ad-stats-revenue').textContent = `¥${adData.adStats.revenue.toFixed(2)}`;
    document.getElementById('ad-stats-allocation').textContent = adRevenueAllocationConfig.descriptions[adRevenueAllocationConfig.current];
    
    // 更新图表
    document.getElementById('ad-stats-chart').textContent = '图表功能即将推出...';
  }
  
  // 显示广告统计面板
  function showAdStatsPanel() {
    // 更新统计数据
    updateAdStatsPanel();
    
    // 显示面板
    const statsPanel = document.getElementById('ad-stats-panel');
    if (statsPanel) {
      statsPanel.classList.add('active');
    }
  }
  
  // 初始化广告设置UI
  function initAdSettingsUI() {
    console.log("初始化广告设置UI...");
    
    // 创建广告设置面板
    createAdSettingsPanel();
    
    // 创建广告设置按钮
    createAdSettingsButton();
    
    console.log("广告设置UI初始化完成");
  }
  
  // 创建广告设置面板
  function createAdSettingsPanel() {
    // 检查是否已存在广告设置面板
    if (document.getElementById('ad-settings-panel')) {
      console.log("广告设置面板已存在");
      return;
    }
    
    // 创建广告设置面板
    const settingsPanel = document.createElement('div');
    settingsPanel.id = 'ad-settings-panel';
    settingsPanel.className = 'ad-settings-panel';
    settingsPanel.innerHTML = `
      <div class="ad-settings-header">
        <h3>广告设置</h3>
        <button id="close-ad-settings-panel" class="close-button">×</button>
      </div>
      <div class="ad-settings-content">
        <div class="ad-settings-section">
          <h4>基本设置</h4>
          <div class="ad-settings-option">
            <span class="ad-settings-label">广告位置</span>
            <div class="ad-settings-value" id="ad-position-value">${adPositionConfig.descriptions[adPositionConfig.current]}</div>
            <div class="ad-settings-description">通过投票决定广告显示的位置</div>
          </div>
          <div class="ad-settings-option">
            <span class="ad-settings-label">广告类型</span>
            <div class="ad-settings-value" id="ad-type-value">${adTypeConfig.descriptions[adTypeConfig.current]}</div>
            <div class="ad-settings-description">通过投票决定广告的类型</div>
          </div>
          <div class="ad-settings-option">
            <span class="ad-settings-label">广告频率</span>
            <div class="ad-settings-value" id="ad-frequency-value">${adFrequencyConfig.descriptions[adFrequencyConfig.current]}</div>
            <div class="ad-settings-description">通过投票决定广告显示的频率</div>
          </div>
        </div>
        <div class="ad-settings-section">
          <h4>高级设置</h4>
          <div class="ad-settings-option">
            <span class="ad-settings-label">主题匹配</span>
            <div class="ad-settings-value" id="ad-theme-matching-value">${adThemeMatchingConfig.descriptions[adThemeMatchingConfig.current]}</div>
            <div class="ad-settings-description">通过投票决定是否启用广告主题匹配</div>
          </div>
          <div class="ad-settings-option">
            <span class="ad-settings-label">个性化广告</span>
            <div class="ad-settings-value" id="ad-personalization-value">${adPersonalizationConfig.descriptions[adPersonalizationConfig.current]}</div>
            <div class="ad-settings-description">通过投票决定是否启用个性化广告</div>
          </div>
          <div class="ad-settings-option">
            <span class="ad-settings-label">广告互动性</span>
            <div class="ad-settings-value" id="ad-interactivity-value">${adInteractivityConfig.descriptions[adInteractivityConfig.current]}</div>
            <div class="ad-settings-description">通过投票决定广告的互动性</div>
          </div>
        </div>
        <div class="ad-settings-section">
          <h4>收益与内容</h4>
          <div class="ad-settings-option">
            <span class="ad-settings-label">收益分配</span>
            <div class="ad-settings-value" id="ad-revenue-allocation-value">${adRevenueAllocationConfig.descriptions[adRevenueAllocationConfig.current]}</div>
            <div class="ad-settings-description">通过投票决定广告收益的分配方式</div>
          </div>
          <div class="ad-settings-option">
            <span class="ad-settings-label">内容过滤</span>
            <div class="ad-settings-value" id="ad-content-filtering-value">${adContentFilteringConfig.descriptions[adContentFilteringConfig.current]}</div>
            <div class="ad-settings-description">通过投票决定广告内容的过滤级别</div>
          </div>
        </div>
        <div class="ad-settings-section">
          <h4>统计信息</h4>
          <div class="ad-settings-option">
            <button id="show-ad-stats-button" class="ad-cta">查看广告统计</button>
          </div>
        </div>
      </div>
    `;
    
    // 添加到文档
    document.body.appendChild(settingsPanel);
    
    // 添加关闭按钮事件
    document.getElementById('close-ad-settings-panel').addEventListener('click', function() {
      settingsPanel.classList.remove('active');
    });
    
    // 添加查看统计按钮事件
    document.getElementById('show-ad-stats-button').addEventListener('click', function() {
      // 隐藏设置面板
      settingsPanel.classList.remove('active');
      
      // 显示统计面板
      showAdStatsPanel();
    });
    
    console.log("广告设置面板已创建");
  }
  
  // 创建广告设置按钮
  function createAdSettingsButton() {
    // 检查是否已存在广告设置按钮
    if (document.getElementById('ad-settings-button')) {
      console.log("广告设置按钮已存在");
      return;
    }
    
    // 创建广告设置按钮
    const settingsButton = document.createElement('button');
    settingsButton.id = 'ad-settings-button';
    settingsButton.className = 'ad-settings-button';
    settingsButton.innerHTML = '<span class="ad-settings-icon">🔧</span> 广告设置';
    
    // 添加到文档
    document.body.appendChild(settingsButton);
    
    // 添加点击事件
    settingsButton.addEventListener('click', function() {
      // 更新设置面板
      updateAdSettingsPanel();
      
      // 显示设置面板
      const settingsPanel = document.getElementById('ad-settings-panel');
      if (settingsPanel) {
        settingsPanel.classList.add('active');
      }
    });
    
    console.log("广告设置按钮已创建");
  }
  
  // 更新广告设置面板
  function updateAdSettingsPanel() {
    // 更新基本设置
    document.getElementById('ad-position-value').textContent = adPositionConfig.descriptions[adPositionConfig.current];
    document.getElementById('ad-type-value').textContent = adTypeConfig.descriptions[adTypeConfig.current];
    document.getElementById('ad-frequency-value').textContent = adFrequencyConfig.descriptions[adFrequencyConfig.current];
    
    // 更新高级设置
    document.getElementById('ad-theme-matching-value').textContent = adThemeMatchingConfig.descriptions[adThemeMatchingConfig.current];
    document.getElementById('ad-personalization-value').textContent = adPersonalizationConfig.descriptions[adPersonalizationConfig.current];
    document.getElementById('ad-interactivity-value').textContent = adInteractivityConfig.descriptions[adInteractivityConfig.current];
    
    // 更新收益与内容
    document.getElementById('ad-revenue-allocation-value').textContent = adRevenueAllocationConfig.descriptions[adRevenueAllocationConfig.current];
    document.getElementById('ad-content-filtering-value').textContent = adContentFilteringConfig.descriptions[adContentFilteringConfig.current];
  }
  
  // 显示广告反馈面板
  function showAdFeedbackPanel() {
    // 使用通知显示反馈信息
    if (typeof window.EnhancedRealTimeFeedback !== 'undefined' && typeof window.EnhancedRealTimeFeedback.showNotification === 'function') {
      window.EnhancedRealTimeFeedback.showNotification('感谢您的反馈！您可以通过参与投票来改变广告设置。', 'info');
    } else {
      alert('感谢您的反馈！您可以通过参与投票来改变广告设置。');
    }
  }
  
  // 在DOM加载完成后初始化
  document.addEventListener('DOMContentLoaded', function() {
    console.log("初始化增强广告系统模块...");
    
    // 延迟初始化，确保其他模块已加载
    setTimeout(function() {
      initAdvertisementSystem();
    }, 1000);
  });
  
  // 导出公共API
  window.EnhancedAdvertisement = {
    // 获取广告统计
    getAdStats: function() {
      return { ...adData.adStats };
    },
    
    // 获取广告设置
    getAdSettings: function() {
      return {
        position: adPositionConfig.current,
        type: adTypeConfig.current,
        frequency: adFrequencyConfig.current,
        themeMatching: adThemeMatchingConfig.current,
        personalization: adPersonalizationConfig.current,
        interactivity: adInteractivityConfig.current,
        revenueAllocation: adRevenueAllocationConfig.current,
        contentFiltering: adContentFilteringConfig.current
      };
    },
    
    // 显示广告
    showAd: function() {
      checkAndShowAd();
    },
    
    // 隐藏广告
    hideAd: function() {
      hideAllAdContainers();
    },
    
    // 显示广告设置面板
    showSettings: function() {
      updateAdSettingsPanel();
      const settingsPanel = document.getElementById('ad-settings-panel');
      if (settingsPanel) {
        settingsPanel.classList.add('active');
      }
    },
    
    // 显示广告统计面板
    showStats: function() {
      updateAdStatsPanel();
      const statsPanel = document.getElementById('ad-stats-panel');
      if (statsPanel) {
        statsPanel.classList.add('active');
      }
    }
  };
})();
