/**
 * 广告功能模块
 * 为网站添加可由用户投票控制的广告系统
 */

(function() {
  'use strict';
  
  // 广告配置
  const adConfig = {
    // 广告位置
    positions: {
      current: 'sidebar', // 默认位置
      options: ['sidebar', 'banner', 'footer', 'disabled'],
      description: '广告显示位置'
    },
    // 广告类型
    types: {
      current: 'image', // 默认类型
      options: ['image', 'text', 'mixed', 'disabled'],
      description: '广告内容类型'
    },
    // 广告频率
    frequency: {
      current: 'moderate', // 默认频率
      options: ['low', 'moderate', 'high', 'disabled'],
      description: '广告显示频率'
    }
  };
  
  // 广告内容示例
  const sampleAds = {
    image: [
      {
        url: 'https://via.placeholder.com/300x250?text=广告示例1',
        link: '#',
        alt: '广告示例1',
        width: 300,
        height: 250
      },
      {
        url: 'https://via.placeholder.com/300x250?text=广告示例2',
        link: '#',
        alt: '广告示例2',
        width: 300,
        height: 250
      },
      {
        url: 'https://via.placeholder.com/728x90?text=横幅广告示例',
        link: '#',
        alt: '横幅广告示例',
        width: 728,
        height: 90
      }
    ],
    text: [
      {
        title: '参与投票，赢取奖品',
        description: '参与我们的投票活动，有机会赢取精美奖品！',
        link: '#'
      },
      {
        title: '定制您的投票体验',
        description: '升级到专业版，获得更多投票功能和自定义选项。',
        link: '#'
      },
      {
        title: '分享您的投票',
        description: '邀请朋友参与投票，一起决定网站的未来！',
        link: '#'
      }
    ]
  };
  
  // 初始化广告系统
  function initAdSystem() {
    console.log('初始化广告系统');
    
    // 将广告配置添加到网站参数中
    if (window.websiteParameters) {
      window.websiteParameters.ads = adConfig;
      console.log('广告配置已添加到网站参数');
    } else {
      console.warn('网站参数对象不存在，无法添加广告配置');
    }
    
    // 加载保存的广告配置
    loadSavedAdConfig();
    
    // 创建广告容器
    createAdContainers();
    
    // 显示广告
    displayAds();
    
    // 设置定时刷新
    setInterval(refreshAds, 60000); // 每分钟刷新一次
    
    console.log('广告系统初始化完成');
  }
  
  // 加载保存的广告配置
  function loadSavedAdConfig() {
    const savedParameters = localStorage.getItem('websiteParameters');
    if (savedParameters) {
      const parsedParams = JSON.parse(savedParameters);
      
      if (parsedParams.ads) {
        // 更新当前配置
        for (const key in parsedParams.ads) {
          if (adConfig[key]) {
            adConfig[key].current = parsedParams.ads[key].current;
          }
        }
        console.log('已加载保存的广告配置');
      }
    }
  }
  
  // 创建广告容器
  function createAdContainers() {
    // 侧边栏广告容器
    const sidebarContainer = document.createElement('div');
    sidebarContainer.id = 'ad-container-sidebar';
    sidebarContainer.className = 'ad-container ad-sidebar';
    sidebarContainer.style.display = 'none';
    
    // 横幅广告容器
    const bannerContainer = document.createElement('div');
    bannerContainer.id = 'ad-container-banner';
    bannerContainer.className = 'ad-container ad-banner';
    bannerContainer.style.display = 'none';
    
    // 页脚广告容器
    const footerContainer = document.createElement('div');
    footerContainer.id = 'ad-container-footer';
    footerContainer.className = 'ad-container ad-footer';
    footerContainer.style.display = 'none';
    
    // 添加到页面
    document.body.appendChild(sidebarContainer);
    document.body.appendChild(bannerContainer);
    
    // 页脚广告添加到页脚
    const footer = document.querySelector('footer');
    if (footer) {
      footer.appendChild(footerContainer);
    } else {
      document.body.appendChild(footerContainer);
    }
    
    // 添加广告样式
    addAdStyles();
    
    console.log('已创建广告容器');
  }
  
  // 添加广告样式
  function addAdStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* 广告容器基本样式 */
      .ad-container {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 10px;
        margin: 10px 0;
        text-align: center;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        position: relative;
      }
      
      /* 广告标识 */
      .ad-container::before {
        content: '广告';
        position: absolute;
        top: 0;
        right: 0;
        background-color: rgba(0,0,0,0.5);
        color: white;
        font-size: 10px;
        padding: 2px 5px;
        border-bottom-left-radius: 5px;
        z-index: 1;
      }
      
      /* 侧边栏广告样式 */
      .ad-sidebar {
        position: fixed;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 300px;
        max-width: 100%;
        z-index: 90;
      }
      
      /* 横幅广告样式 */
      .ad-banner {
        position: relative;
        width: 100%;
        max-width: 728px;
        margin: 20px auto;
        z-index: 80;
      }
      
      /* 页脚广告样式 */
      .ad-footer {
        width: 100%;
        max-width: 728px;
        margin: 10px auto;
        background-color: rgba(0,0,0,0.05);
      }
      
      /* 图片广告样式 */
      .ad-image {
        display: block;
        max-width: 100%;
        height: auto;
        margin: 0 auto;
      }
      
      /* 文字广告样式 */
      .ad-text {
        padding: 10px;
        text-align: left;
      }
      
      .ad-text-title {
        font-weight: bold;
        margin-bottom: 5px;
        color: var(--primary-color, #4a90e2);
      }
      
      .ad-text-description {
        font-size: 0.9rem;
        margin-bottom: 10px;
      }
      
      .ad-text-link {
        display: inline-block;
        padding: 5px 10px;
        background-color: var(--primary-color, #4a90e2);
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-size: 0.8rem;
      }
      
      /* 关闭按钮 */
      .ad-close {
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,0.5);
        color: white;
        border: none;
        font-size: 10px;
        width: 16px;
        height: 16px;
        line-height: 16px;
        text-align: center;
        cursor: pointer;
        z-index: 1;
        border-bottom-right-radius: 5px;
      }
      
      /* 响应式调整 */
      @media (max-width: 768px) {
        .ad-sidebar {
          position: static;
          width: 100%;
          max-width: 300px;
          margin: 10px auto;
          transform: none;
        }
        
        .ad-banner {
          max-width: 100%;
        }
      }
      
      /* 暗黑模式支持 */
      .dark-mode .ad-container {
        background-color: #2c2c2c;
      }
      
      .dark-mode .ad-text-title {
        color: var(--primary-color, #4a90e2);
      }
      
      .dark-mode .ad-text-description {
        color: #e0e0e0;
      }
    `;
    document.head.appendChild(styleElement);
    console.log('已添加广告样式');
  }
  
  // 显示广告
  function displayAds() {
    // 如果广告被禁用，不显示
    if (adConfig.positions.current === 'disabled') {
      hideAllAds();
      console.log('广告已被禁用，不显示');
      return;
    }
    
    // 根据位置显示广告
    const position = adConfig.positions.current;
    const type = adConfig.types.current;
    const frequency = adConfig.frequency.current;
    
    // 隐藏所有广告容器
    hideAllAds();
    
    // 如果类型被禁用，不显示
    if (type === 'disabled') {
      console.log('广告类型已被禁用，不显示');
      return;
    }
    
    // 根据频率决定是否显示
    if (!shouldShowAdByFrequency(frequency)) {
      console.log(`根据频率 ${frequency} 决定本次不显示广告`);
      return;
    }
    
    // 显示指定位置的广告
    const container = document.getElementById(`ad-container-${position}`);
    if (container) {
      // 清空容器
      container.innerHTML = '';
      
      // 添加关闭按钮
      const closeButton = document.createElement('button');
      closeButton.className = 'ad-close';
      closeButton.innerHTML = '×';
      closeButton.addEventListener('click', function() {
        container.style.display = 'none';
      });
      container.appendChild(closeButton);
      
      // 根据类型创建广告内容
      if (type === 'image' || (type === 'mixed' && Math.random() > 0.5)) {
        // 图片广告
        const randomIndex = Math.floor(Math.random() * sampleAds.image.length);
        const ad = sampleAds.image[randomIndex];
        
        const link = document.createElement('a');
        link.href = ad.link;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        const img = document.createElement('img');
        img.src = ad.url;
        img.alt = ad.alt;
        img.className = 'ad-image';
        
        // 根据位置调整尺寸
        if (position === 'banner' || position === 'footer') {
          img.width = 728;
          img.height = 90;
        } else {
          img.width = 300;
          img.height = 250;
        }
        
        link.appendChild(img);
        container.appendChild(link);
      } else {
        // 文字广告
        const randomIndex = Math.floor(Math.random() * sampleAds.text.length);
        const ad = sampleAds.text[randomIndex];
        
        const adText = document.createElement('div');
        adText.className = 'ad-text';
        
        const title = document.createElement('div');
        title.className = 'ad-text-title';
        title.textContent = ad.title;
        
        const description = document.createElement('div');
        description.className = 'ad-text-description';
        description.textContent = ad.description;
        
        const link = document.createElement('a');
        link.href = ad.link;
        link.className = 'ad-text-link';
        link.textContent = '了解更多';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        adText.appendChild(title);
        adText.appendChild(description);
        adText.appendChild(link);
        
        container.appendChild(adText);
      }
      
      // 显示容器
      container.style.display = 'block';
      console.log(`已显示 ${position} 位置的 ${type} 类型广告`);
    } else {
      console.warn(`未找到 ${position} 位置的广告容器`);
    }
  }
  
  // 隐藏所有广告
  function hideAllAds() {
    const containers = document.querySelectorAll('.ad-container');
    containers.forEach(container => {
      container.style.display = 'none';
    });
  }
  
  // 根据频率决定是否显示广告
  function shouldShowAdByFrequency(frequency) {
    const random = Math.random();
    
    switch (frequency) {
      case 'low':
        return random < 0.3; // 30%概率显示
      case 'moderate':
        return random < 0.6; // 60%概率显示
      case 'high':
        return random < 0.9; // 90%概率显示
      case 'disabled':
        return false;
      default:
        return true;
    }
  }
  
  // 刷新广告
  function refreshAds() {
    // 如果页面可见，刷新广告
    if (document.visibilityState === 'visible') {
      displayAds();
    }
  }
  
  // 创建广告参数投票
  function createAdParameterPolls() {
    console.log('创建广告参数投票');
    
    // 检查是否有createParameterPoll函数
    if (typeof window.createParameterPoll !== 'function') {
      console.warn('createParameterPoll函数不存在，无法创建广告参数投票');
      return;
    }
    
    // 创建广告位置投票
    createAdPositionPoll();
    
    // 创建广告类型投票
    createAdTypePoll();
    
    // 创建广告频率投票
    createAdFrequencyPoll();
    
    console.log('广告参数投票创建完成');
  }
  
  // 创建广告位置投票
  function createAdPositionPoll() {
    // 检查是否已存在相关投票
    if (window.polls) {
      const existingPoll = window.polls.find(p => 
        p.isParameterPoll && 
        p.parameterCategory === 'ads' && 
        p.parameterName === 'positions' &&
        new Date(p.endDate) > new Date()
      );
      
      if (existingPoll) {
        console.log('已存在广告位置投票，不重复创建');
        return;
      }
    }
    
    // 创建投票选项
    const options = [
      '侧边栏',
      '页面顶部',
      '页脚',
      '不显示广告'
    ];
    
    // 创建投票
    window.createParameterPoll('ads', 'positions', options, null);
    console.log('已创建广告位置投票');
  }
  
  // 创建广告类型投票
  function createAdTypePoll() {
    // 检查是否已存在相关投票
    if (window.polls) {
      const existingPoll = window.polls.find(p => 
        p.isParameterPoll && 
        p.parameterCategory === 'ads' && 
        p.parameterName === 'types' &&
        new Date(p.endDate) > new Date()
      );
      
      if (existingPoll) {
        console.log('已存在广告类型投票，不重复创建');
        return;
      }
    }
    
    // 创建投票选项
    const options = [
      '图片广告',
      '文字广告',
      '混合广告',
      '不显示广告'
    ];
    
    // 创建投票
    window.createParameterPoll('ads', 'types', options, null);
    console.log('已创建广告类型投票');
  }
  
  // 创建广告频率投票
  function createAdFrequencyPoll() {
    // 检查是否已存在相关投票
    if (window.polls) {
      const existingPoll = window.polls.find(p => 
        p.isParameterPoll && 
        p.parameterCategory === 'ads' && 
        p.parameterName === 'frequency' &&
        new Date(p.endDate) > new Date()
      );
      
      if (existingPoll) {
        console.log('已存在广告频率投票，不重复创建');
        return;
      }
    }
    
    // 创建投票选项
    const options = [
      '低频率',
      '中等频率',
      '高频率',
      '不显示广告'
    ];
    
    // 创建投票
    window.createParameterPoll('ads', 'frequency', options, null);
    console.log('已创建广告频率投票');
  }
  
  // 从选项文本获取参数值
  function getAdParameterValueFromText(paramName, optionText) {
    switch (paramName) {
      case 'positions':
        if (optionText === '侧边栏') return 'sidebar';
        if (optionText === '页面顶部') return 'banner';
        if (optionText === '页脚') return 'footer';
        if (optionText === '不显示广告') return 'disabled';
        return optionText;
      case 'types':
        if (optionText === '图片广告') return 'image';
        if (optionText === '文字广告') return 'text';
        if (optionText === '混合广告') return 'mixed';
        if (optionText === '不显示广告') return 'disabled';
        return optionText;
      case 'frequency':
        if (optionText === '低频率') return 'low';
        if (optionText === '中等频率') return 'moderate';
        if (optionText === '高频率') return 'high';
        if (optionText === '不显示广告') return 'disabled';
        return optionText;
      default:
        return optionText;
    }
  }
  
  // 获取参数显示名称
  function getAdParameterDisplayName(paramName) {
    switch (paramName) {
      case 'positions': return '广告位置';
      case 'types': return '广告类型';
      case 'frequency': return '广告频率';
      default: return paramName;
    }
  }
  
  // 扩展原有的getParameterValueFromText函数
  if (typeof window.getParameterValueFromText === 'function') {
    const originalGetParameterValueFromText = window.getParameterValueFromText;
    window.getParameterValueFromText = function(paramName, optionText) {
      // 如果是广告参数，使用广告特定的函数
      if (paramName === 'positions' || paramName === 'types' || paramName === 'frequency') {
        return getAdParameterValueFromText(paramName, optionText);
      }
      
      // 否则使用原始函数
      return originalGetParameterValueFromText(paramName, optionText);
    };
  }
  
  // 扩展原有的getParameterDisplayName函数
  if (typeof window.getParameterDisplayName === 'function') {
    const originalGetParameterDisplayName = window.getParameterDisplayName;
    window.getParameterDisplayName = function(paramName) {
      // 如果是广告参数，使用广告特定的函数
      if (paramName === 'positions' || paramName === 'types' || paramName === 'frequency') {
        return getAdParameterDisplayName(paramName);
      }
      
      // 否则使用原始函数
      return originalGetParameterDisplayName(paramName);
    };
  }
  
  // 在DOM加载完成后初始化
  document.addEventListener('DOMContentLoaded', function() {
    console.log('初始化广告功能');
    
    // 初始化广告系统
    initAdSystem();
    
    // 延迟创建广告参数投票，确保polls数组已加载
    setTimeout(createAdParameterPolls, 2000);
    
    console.log('广告功能初始化完成');
  });
  
  // 导出公共API
  window.AdvertisementSystem = {
    refresh: displayAds,
    hide: hideAllAds,
    config: adConfig
  };
})();
