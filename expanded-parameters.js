/**
 * 扩展参数模块
 * 为网站添加更多可由用户投票控制的参数
 */

(function() {
  'use strict';
  
  // 扩展参数配置
  const expandedParameters = {
    // UI细节参数
    ui_details: {
      // 按钮样式
      buttonStyle: {
        current: 'standard',
        options: ['standard', 'rounded', 'pill', 'flat', '3d'],
        description: '按钮样式'
      },
      // 字体选择
      fontFamily: {
        current: 'system',
        options: ['system', 'serif', 'sans-serif', 'monospace', 'rounded'],
        description: '字体家族'
      },
      // 动画效果
      animationStyle: {
        current: 'standard',
        options: ['standard', 'smooth', 'bounce', 'none', 'dramatic'],
        description: '动画效果'
      },
      // 卡片样式
      cardStyle: {
        current: 'standard',
        options: ['standard', 'flat', 'raised', 'outlined', 'minimal'],
        description: '卡片样式'
      },
      // 颜色对比度
      colorContrast: {
        current: 'standard',
        options: ['standard', 'high', 'very-high', 'maximum'],
        description: '颜色对比度'
      }
    },
    
    // 内容展示参数
    content_display: {
      // 信息密度
      informationDensity: {
        current: 'standard',
        options: ['compact', 'standard', 'spacious', 'very-spacious'],
        description: '信息密度'
      },
      // 列表排序
      listSorting: {
        current: 'time-desc',
        options: ['time-desc', 'time-asc', 'votes-desc', 'alphabetical'],
        description: '列表排序方式'
      },
      // 投票卡片布局
      pollCardLayout: {
        current: 'standard',
        options: ['standard', 'compact', 'detailed', 'minimal', 'grid'],
        description: '投票卡片布局'
      },
      // 标题样式
      headingStyle: {
        current: 'standard',
        options: ['standard', 'bold', 'underlined', 'centered', 'minimal'],
        description: '标题样式'
      }
    },
    
    // 性能相关参数
    performance: {
      // 预加载策略
      preloadStrategy: {
        current: 'balanced',
        options: ['aggressive', 'balanced', 'minimal', 'disabled'],
        description: '预加载策略'
      },
      // 缓存策略
      cacheStrategy: {
        current: 'standard',
        options: ['minimal', 'standard', 'extensive', 'aggressive'],
        description: '缓存策略'
      },
      // 图片质量
      imageQuality: {
        current: 'high',
        options: ['low', 'medium', 'high', 'auto'],
        description: '图片质量'
      },
      // 动画减弱
      animationReduction: {
        current: 'none',
        options: ['none', 'reduced', 'minimal', 'disabled'],
        description: '动画减弱'
      }
    },
    
    // 辅助功能参数
    accessibility: {
      // 文本大小调整
      textSizeAdjustment: {
        current: '0',
        options: ['-10', '0', '10', '20', '30'],
        description: '文本大小调整(百分比)'
      },
      // 焦点指示器
      focusIndicator: {
        current: 'standard',
        options: ['subtle', 'standard', 'high-visibility', 'custom'],
        description: '焦点指示器样式'
      },
      // 键盘导航增强
      keyboardNavigation: {
        current: 'standard',
        options: ['minimal', 'standard', 'enhanced', 'comprehensive'],
        description: '键盘导航增强'
      },
      // 色彩模式
      colorMode: {
        current: 'standard',
        options: ['standard', 'deuteranopia', 'protanopia', 'tritanopia', 'grayscale'],
        description: '色彩模式(色盲辅助)'
      }
    },
    
    // 交互参数
    interaction: {
      // 点击反馈
      clickFeedback: {
        current: 'subtle',
        options: ['none', 'subtle', 'standard', 'pronounced'],
        description: '点击反馈效果'
      },
      // 滚动行为
      scrollBehavior: {
        current: 'smooth',
        options: ['instant', 'smooth', 'auto'],
        description: '滚动行为'
      },
      // 表单验证严格程度
      formValidation: {
        current: 'balanced',
        options: ['minimal', 'balanced', 'strict', 'very-strict'],
        description: '表单验证严格程度'
      },
      // 确认对话框使用
      confirmDialogs: {
        current: 'important',
        options: ['none', 'minimal', 'important', 'all'],
        description: '确认对话框使用场景'
      }
    }
  };
  
  // 初始化扩展参数
  function initExpandedParameters() {
    console.log('初始化扩展参数');
    
    // 将扩展参数添加到网站参数中
    if (window.websiteParameters) {
      // 合并参数
      for (const category in expandedParameters) {
        window.websiteParameters[category] = expandedParameters[category];
      }
      console.log('扩展参数已添加到网站参数');
    } else {
      console.warn('网站参数对象不存在，无法添加扩展参数');
    }
    
    // 加载保存的扩展参数
    loadSavedExpandedParameters();
    
    // 应用扩展参数
    applyExpandedParameters();
    
    console.log('扩展参数初始化完成');
  }
  
  // 加载保存的扩展参数
  function loadSavedExpandedParameters() {
    const savedParameters = localStorage.getItem('websiteParameters');
    if (savedParameters) {
      const parsedParams = JSON.parse(savedParameters);
      
      // 更新当前值
      for (const category in expandedParameters) {
        if (parsedParams[category]) {
          for (const param in expandedParameters[category]) {
            if (parsedParams[category][param]) {
              expandedParameters[category][param].current = parsedParams[category][param].current;
            }
          }
        }
      }
      console.log('已加载保存的扩展参数');
    }
  }
  
  // 应用扩展参数
  function applyExpandedParameters() {
    // 应用UI细节参数
    applyUIDetailsParameters();
    
    // 应用内容展示参数
    applyContentDisplayParameters();
    
    // 应用性能相关参数
    applyPerformanceParameters();
    
    // 应用辅助功能参数
    applyAccessibilityParameters();
    
    // 应用交互参数
    applyInteractionParameters();
    
    console.log('已应用扩展参数');
  }
  
  // 应用UI细节参数
  function applyUIDetailsParameters() {
    if (!window.websiteParameters.ui_details) return;
    
    // 应用按钮样式
    const buttonStyle = window.websiteParameters.ui_details.buttonStyle.current;
    document.body.setAttribute('data-button-style', buttonStyle);
    
    // 应用字体选择
    const fontFamily = window.websiteParameters.ui_details.fontFamily.current;
    document.body.setAttribute('data-font-family', fontFamily);
    
    // 应用动画效果
    const animationStyle = window.websiteParameters.ui_details.animationStyle.current;
    document.body.setAttribute('data-animation-style', animationStyle);
    
    // 应用卡片样式
    const cardStyle = window.websiteParameters.ui_details.cardStyle.current;
    document.body.setAttribute('data-card-style', cardStyle);
    
    // 应用颜色对比度
    const colorContrast = window.websiteParameters.ui_details.colorContrast.current;
    document.body.setAttribute('data-color-contrast', colorContrast);
    
    // 添加自定义CSS
    updateUIDetailStyles();
  }
  
  // 应用内容展示参数
  function applyContentDisplayParameters() {
    if (!window.websiteParameters.content_display) return;
    
    // 应用信息密度
    const informationDensity = window.websiteParameters.content_display.informationDensity.current;
    document.body.setAttribute('data-information-density', informationDensity);
    
    // 应用列表排序
    const listSorting = window.websiteParameters.content_display.listSorting.current;
    document.body.setAttribute('data-list-sorting', listSorting);
    
    // 应用投票卡片布局
    const pollCardLayout = window.websiteParameters.content_display.pollCardLayout.current;
    document.body.setAttribute('data-poll-card-layout', pollCardLayout);
    
    // 应用标题样式
    const headingStyle = window.websiteParameters.content_display.headingStyle.current;
    document.body.setAttribute('data-heading-style', headingStyle);
    
    // 添加自定义CSS
    updateContentDisplayStyles();
    
    // 重新排序列表
    if (typeof reorderLists === 'function') {
      reorderLists();
    }
  }
  
  // 应用性能相关参数
  function applyPerformanceParameters() {
    if (!window.websiteParameters.performance) return;
    
    // 应用预加载策略
    const preloadStrategy = window.websiteParameters.performance.preloadStrategy.current;
    document.body.setAttribute('data-preload-strategy', preloadStrategy);
    
    // 应用缓存策略
    const cacheStrategy = window.websiteParameters.performance.cacheStrategy.current;
    document.body.setAttribute('data-cache-strategy', cacheStrategy);
    
    // 应用图片质量
    const imageQuality = window.websiteParameters.performance.imageQuality.current;
    document.body.setAttribute('data-image-quality', imageQuality);
    
    // 应用动画减弱
    const animationReduction = window.websiteParameters.performance.animationReduction.current;
    document.body.setAttribute('data-animation-reduction', animationReduction);
    
    // 更新性能相关设置
    updatePerformanceSettings();
  }
  
  // 应用辅助功能参数
  function applyAccessibilityParameters() {
    if (!window.websiteParameters.accessibility) return;
    
    // 应用文本大小调整
    const textSizeAdjustment = window.websiteParameters.accessibility.textSizeAdjustment.current;
    document.documentElement.style.fontSize = `calc(1rem + ${textSizeAdjustment}%)`;
    
    // 应用焦点指示器
    const focusIndicator = window.websiteParameters.accessibility.focusIndicator.current;
    document.body.setAttribute('data-focus-indicator', focusIndicator);
    
    // 应用键盘导航增强
    const keyboardNavigation = window.websiteParameters.accessibility.keyboardNavigation.current;
    document.body.setAttribute('data-keyboard-navigation', keyboardNavigation);
    
    // 应用色彩模式
    const colorMode = window.websiteParameters.accessibility.colorMode.current;
    document.body.setAttribute('data-color-mode', colorMode);
    
    // 添加自定义CSS
    updateAccessibilityStyles();
  }
  
  // 应用交互参数
  function applyInteractionParameters() {
    if (!window.websiteParameters.interaction) return;
    
    // 应用点击反馈
    const clickFeedback = window.websiteParameters.interaction.clickFeedback.current;
    document.body.setAttribute('data-click-feedback', clickFeedback);
    
    // 应用滚动行为
    const scrollBehavior = window.websiteParameters.interaction.scrollBehavior.current;
    document.documentElement.style.scrollBehavior = scrollBehavior;
    
    // 应用表单验证严格程度
    const formValidation = window.websiteParameters.interaction.formValidation.current;
    document.body.setAttribute('data-form-validation', formValidation);
    
    // 应用确认对话框使用
    const confirmDialogs = window.websiteParameters.interaction.confirmDialogs.current;
    document.body.setAttribute('data-confirm-dialogs', confirmDialogs);
    
    // 更新交互相关设置
    updateInteractionSettings();
  }
  
  // 更新UI细节样式
  function updateUIDetailStyles() {
    let styleElement = document.getElementById('ui-detail-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'ui-detail-styles';
      document.head.appendChild(styleElement);
    }
    
    const buttonStyle = window.websiteParameters.ui_details.buttonStyle.current;
    const fontFamily = window.websiteParameters.ui_details.fontFamily.current;
    const animationStyle = window.websiteParameters.ui_details.animationStyle.current;
    const cardStyle = window.websiteParameters.ui_details.cardStyle.current;
    const colorContrast = window.websiteParameters.ui_details.colorContrast.current;
    
    let css = '';
    
    // 按钮样式
    switch (buttonStyle) {
      case 'standard':
        css += `
          button, .button, input[type="submit"] {
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: background-color 0.3s, transform 0.1s;
          }
          button:hover, .button:hover, input[type="submit"]:hover {
            transform: translateY(-1px);
          }
        `;
        break;
      case 'rounded':
        css += `
          button, .button, input[type="submit"] {
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.3s;
          }
          button:hover, .button:hover, input[type="submit"]:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          }
        `;
        break;
      case 'pill':
        css += `
          button, .button, input[type="submit"] {
            border-radius: 50px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.3s;
            padding-left: 20px;
            padding-right: 20px;
          }
          button:hover, .button:hover, input[type="submit"]:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            transform: translateY(-2px);
          }
        `;
        break;
      case 'flat':
        css += `
          button, .button, input[type="submit"] {
            border-radius: 0;
            box-shadow: none;
            transition: background-color 0.3s;
            border-bottom: 2px solid rgba(0,0,0,0.1);
          }
          button:hover, .button:hover, input[type="submit"]:hover {
            background-color: rgba(0,0,0,0.05);
          }
        `;
        break;
      case '3d':
        css += `
          button, .button, input[type="submit"] {
            border-radius: 4px;
            box-shadow: 0 4px 0 rgba(0,0,0,0.2);
            transition: all 0.1s;
            transform: translateY(-2px);
            border: none;
          }
          button:hover, .button:hover, input[type="submit"]:hover {
            transform: translateY(-4px);
            box-shadow: 0 6px 0 rgba(0,0,0,0.2);
          }
          button:active, .button:active, input[type="submit"]:active {
            transform: translateY(0);
            box-shadow: 0 0 0 rgba(0,0,0,0.2);
          }
        `;
        break;
    }
    
    // 字体选择
    switch (fontFamily) {
      case 'system':
        css += `
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          }
        `;
        break;
      case 'serif':
        css += `
          body {
            font-family: Georgia, Times, "Times New Roman", serif;
          }
        `;
        break;
      case 'sans-serif':
        css += `
          body {
            font-family: Arial, Helvetica, sans-serif;
          }
        `;
        break;
      case 'monospace':
        css += `
          body {
            font-family: "Courier New", Courier, monospace;
          }
        `;
        break;
      case 'rounded':
        css += `
          body {
            font-family: "Comic Sans MS", "Comic Sans", cursive;
          }
        `;
        break;
    }
    
    // 动画效果
    switch (animationStyle) {
      case 'standard':
        css += `
          .container, section, .poll-card {
            transition: all 0.3s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `;
        break;
      case 'smooth':
        css += `
          .container, section, .poll-card {
            transition: all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `;
        break;
      case 'bounce':
        css += `
          .container, section, .poll-card {
            transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            70% { opacity: 1; transform: translateY(-5px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `;
        break;
      case 'none':
        css += `
          .container, section, .poll-card {
            transition: none;
          }
          @keyframes fadeIn {
            from { opacity: 1; transform: none; }
            to { opacity: 1; transform: none; }
          }
        `;
        break;
      case 'dramatic':
        css += `
          .container, section, .poll-card {
            transition: all 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55);
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(40px) scale(0.9); }
            60% { opacity: 1; transform: translateY(-10px) scale(1.02); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
        `;
        break;
    }
    
    // 卡片样式
    switch (cardStyle) {
      case 'standard':
        css += `
          .poll-card, section {
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            border: 1px solid var(--border-color, #ddd);
          }
        `;
        break;
      case 'flat':
        css += `
          .poll-card, section {
            border-radius: 0;
            box-shadow: none;
            border: 1px solid var(--border-color, #ddd);
          }
        `;
        break;
      case 'raised':
        css += `
          .poll-card, section {
            border-radius: 8px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
            border: none;
          }
        `;
        break;
      case 'outlined':
        css += `
          .poll-card, section {
            border-radius: 8px;
            box-shadow: none;
            border: 2px solid var(--border-color, #ddd);
          }
        `;
        break;
      case 'minimal':
        css += `
          .poll-card, section {
            border-radius: 0;
            box-shadow: none;
            border: none;
            background-color: transparent;
            padding: 10px 0;
          }
        `;
        break;
    }
    
    // 颜色对比度
    switch (colorContrast) {
      case 'standard':
        // 默认对比度，不需要额外CSS
        break;
      case 'high':
        css += `
          body {
            color: #000;
          }
          .dark-mode {
            color: #fff;
          }
          a, button, .button, input[type="submit"] {
            color: #000;
            background-color: #f0f0f0;
          }
          .dark-mode a, .dark-mode button, .dark-mode .button, .dark-mode input[type="submit"] {
            color: #fff;
            background-color: #444;
          }
        `;
        break;
      case 'very-high':
        css += `
          body {
            color: #000;
          }
          .dark-mode {
            color: #fff;
          }
          a, button, .button, input[type="submit"] {
            color: #000;
            background-color: #fff;
            border: 2px solid #000;
          }
          .dark-mode a, .dark-mode button, .dark-mode .button, .dark-mode input[type="submit"] {
            color: #fff;
            background-color: #000;
            border: 2px solid #fff;
          }
        `;
        break;
      case 'maximum':
        css += `
          body {
            color: #000;
            background-color: #fff;
          }
          .dark-mode {
            color: #fff;
            background-color: #000;
          }
          a, button, .button, input[type="submit"] {
            color: #fff;
            background-color: #000;
            border: 3px solid #fff;
            outline: 1px solid #000;
          }
          .dark-mode a, .dark-mode button, .dark-mode .button, .dark-mode input[type="submit"] {
            color: #000;
            background-color: #fff;
            border: 3px solid #000;
            outline: 1px solid #fff;
          }
        `;
        break;
    }
    
    styleElement.textContent = css;
  }
  
  // 更新内容展示样式
  function updateContentDisplayStyles() {
    let styleElement = document.getElementById('content-display-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'content-display-styles';
      document.head.appendChild(styleElement);
    }
    
    const informationDensity = window.websiteParameters.content_display.informationDensity.current;
    const pollCardLayout = window.websiteParameters.content_display.pollCardLayout.current;
    const headingStyle = window.websiteParameters.content_display.headingStyle.current;
    
    let css = '';
    
    // 信息密度
    switch (informationDensity) {
      case 'compact':
        css += `
          .container {
            max-width: 1000px;
          }
          section {
            padding: 10px;
            margin-bottom: 10px;
          }
          .form-group {
            margin-bottom: 8px;
          }
          p {
            margin: 0.5em 0;
          }
          .poll-card {
            padding: 10px;
            margin-bottom: 10px;
          }
        `;
        break;
      case 'standard':
        css += `
          .container {
            max-width: 1200px;
          }
          section {
            padding: 20px;
            margin-bottom: 20px;
          }
          .form-group {
            margin-bottom: 15px;
          }
          p {
            margin: 1em 0;
          }
          .poll-card {
            padding: 15px;
            margin-bottom: 20px;
          }
        `;
        break;
      case 'spacious':
        css += `
          .container {
            max-width: 1400px;
          }
          section {
            padding: 30px;
            margin-bottom: 30px;
          }
          .form-group {
            margin-bottom: 25px;
          }
          p {
            margin: 1.5em 0;
            line-height: 1.8;
          }
          .poll-card {
            padding: 25px;
            margin-bottom: 30px;
          }
        `;
        break;
      case 'very-spacious':
        css += `
          .container {
            max-width: 1600px;
          }
          section {
            padding: 40px;
            margin-bottom: 40px;
          }
          .form-group {
            margin-bottom: 35px;
          }
          p {
            margin: 2em 0;
            line-height: 2;
          }
          .poll-card {
            padding: 35px;
            margin-bottom: 40px;
          }
        `;
        break;
    }
    
    // 投票卡片布局
    switch (pollCardLayout) {
      case 'standard':
        css += `
          .polls-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
          }
          .poll-card {
            display: flex;
            flex-direction: column;
          }
        `;
        break;
      case 'compact':
        css += `
          .polls-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 10px;
          }
          .poll-card {
            display: flex;
            flex-direction: column;
          }
          .poll-card h3 {
            font-size: 1rem;
            margin-bottom: 5px;
          }
          .poll-card p {
            font-size: 0.9rem;
            margin: 5px 0;
          }
        `;
        break;
      case 'detailed':
        css += `
          .polls-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .poll-card {
            display: grid;
            grid-template-columns: 3fr 1fr;
            gap: 20px;
          }
          .poll-card-info {
            display: flex;
            flex-direction: column;
          }
          .poll-card-actions {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
        `;
        break;
      case 'minimal':
        css += `
          .polls-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .poll-card {
            border: none;
            box-shadow: none;
            padding: 10px 0;
            border-bottom: 1px solid var(--border-color, #ddd);
            border-radius: 0;
          }
          .poll-card:last-child {
            border-bottom: none;
          }
        `;
        break;
      case 'grid':
        css += `
          .polls-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
          }
          .poll-card {
            display: flex;
            flex-direction: column;
            aspect-ratio: 1 / 1;
            justify-content: center;
            text-align: center;
          }
          .poll-card h3 {
            font-size: 1.1rem;
          }
        `;
        break;
    }
    
    // 标题样式
    switch (headingStyle) {
      case 'standard':
        css += `
          h1, h2, h3, h4, h5, h6 {
            font-weight: bold;
            color: var(--accent-color, #1c3d5a);
            margin-bottom: 15px;
          }
        `;
        break;
      case 'bold':
        css += `
          h1, h2, h3, h4, h5, h6 {
            font-weight: 900;
            color: var(--accent-color, #1c3d5a);
            margin-bottom: 15px;
            letter-spacing: -0.5px;
          }
        `;
        break;
      case 'underlined':
        css += `
          h1, h2, h3, h4, h5, h6 {
            font-weight: bold;
            color: var(--accent-color, #1c3d5a);
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 2px solid var(--primary-color, #4a90e2);
          }
        `;
        break;
      case 'centered':
        css += `
          h1, h2, h3, h4, h5, h6 {
            font-weight: bold;
            color: var(--accent-color, #1c3d5a);
            margin-bottom: 15px;
            text-align: center;
          }
        `;
        break;
      case 'minimal':
        css += `
          h1, h2, h3, h4, h5, h6 {
            font-weight: normal;
            color: var(--text-color, #333);
            margin-bottom: 15px;
          }
        `;
        break;
    }
    
    styleElement.textContent = css;
  }
  
  // 更新性能相关设置
  function updatePerformanceSettings() {
    const preloadStrategy = window.websiteParameters.performance.preloadStrategy.current;
    const imageQuality = window.websiteParameters.performance.imageQuality.current;
    const animationReduction = window.websiteParameters.performance.animationReduction.current;
    
    // 预加载策略
    switch (preloadStrategy) {
      case 'aggressive':
        // 预加载所有图片和资源
        document.querySelectorAll('img[data-src]').forEach(img => {
          const src = img.getAttribute('data-src');
          img.setAttribute('src', src);
          img.removeAttribute('data-src');
        });
        
        // 预取可能的下一页链接
        document.querySelectorAll('a').forEach(link => {
          const prefetchLink = document.createElement('link');
          prefetchLink.rel = 'prefetch';
          prefetchLink.href = link.href;
          document.head.appendChild(prefetchLink);
        });
        break;
      case 'balanced':
        // 只预加载可见区域的图片
        const loadVisibleImages = () => {
          document.querySelectorAll('img[data-src]').forEach(img => {
            const rect = img.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
            
            if (isVisible) {
              const src = img.getAttribute('data-src');
              img.setAttribute('src', src);
              img.removeAttribute('data-src');
            }
          });
        };
        
        loadVisibleImages();
        window.addEventListener('scroll', loadVisibleImages);
        break;
      case 'minimal':
        // 只在需要时加载图片
        const loadImageOnDemand = () => {
          document.querySelectorAll('img[data-src]').forEach(img => {
            const observer = new IntersectionObserver(entries => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  const src = img.getAttribute('data-src');
                  img.setAttribute('src', src);
                  img.removeAttribute('data-src');
                  observer.disconnect();
                }
              });
            });
            
            observer.observe(img);
          });
        };
        
        loadImageOnDemand();
        break;
      case 'disabled':
        // 不预加载任何内容
        break;
    }
    
    // 图片质量
    let styleElement = document.getElementById('image-quality-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'image-quality-styles';
      document.head.appendChild(styleElement);
    }
    
    let css = '';
    
    switch (imageQuality) {
      case 'low':
        css += `
          img {
            filter: blur(0.5px);
            image-rendering: auto;
          }
        `;
        break;
      case 'medium':
        css += `
          img {
            image-rendering: auto;
          }
        `;
        break;
      case 'high':
        css += `
          img {
            image-rendering: high-quality;
          }
        `;
        break;
      case 'auto':
        // 根据网络状况自动调整
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
          if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            css += `
              img {
                filter: blur(0.5px);
                image-rendering: auto;
              }
            `;
          } else if (connection.effectiveType === '3g') {
            css += `
              img {
                image-rendering: auto;
              }
            `;
          } else {
            css += `
              img {
                image-rendering: high-quality;
              }
            `;
          }
        }
        break;
    }
    
    // 动画减弱
    switch (animationReduction) {
      case 'none':
        // 不减弱动画
        break;
      case 'reduced':
        css += `
          * {
            animation-duration: 0.5s !important;
            transition-duration: 0.5s !important;
          }
        `;
        break;
      case 'minimal':
        css += `
          * {
            animation-duration: 0.2s !important;
            transition-duration: 0.2s !important;
          }
        `;
        break;
      case 'disabled':
        css += `
          * {
            animation: none !important;
            transition: none !important;
          }
        `;
        break;
    }
    
    styleElement.textContent = css;
  }
  
  // 更新辅助功能样式
  function updateAccessibilityStyles() {
    let styleElement = document.getElementById('accessibility-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'accessibility-styles';
      document.head.appendChild(styleElement);
    }
    
    const focusIndicator = window.websiteParameters.accessibility.focusIndicator.current;
    const keyboardNavigation = window.websiteParameters.accessibility.keyboardNavigation.current;
    const colorMode = window.websiteParameters.accessibility.colorMode.current;
    
    let css = '';
    
    // 焦点指示器
    switch (focusIndicator) {
      case 'subtle':
        css += `
          :focus {
            outline: 1px dotted var(--primary-color, #4a90e2);
            outline-offset: 2px;
          }
        `;
        break;
      case 'standard':
        css += `
          :focus {
            outline: 2px solid var(--primary-color, #4a90e2);
            outline-offset: 2px;
          }
        `;
        break;
      case 'high-visibility':
        css += `
          :focus {
            outline: 3px solid var(--primary-color, #4a90e2);
            outline-offset: 3px;
            box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.3);
          }
        `;
        break;
      case 'custom':
        css += `
          :focus {
            outline: 2px dashed var(--primary-color, #4a90e2);
            outline-offset: 3px;
            box-shadow: 0 0 0 5px rgba(74, 144, 226, 0.2);
          }
        `;
        break;
    }
    
    // 键盘导航增强
    switch (keyboardNavigation) {
      case 'minimal':
        // 基本键盘导航，不需要额外CSS
        break;
      case 'standard':
        css += `
          a:focus, button:focus, input:focus, select:focus, textarea:focus {
            outline: 2px solid var(--primary-color, #4a90e2);
            outline-offset: 2px;
          }
        `;
        break;
      case 'enhanced':
        css += `
          a:focus, button:focus, input:focus, select:focus, textarea:focus {
            outline: 3px solid var(--primary-color, #4a90e2);
            outline-offset: 3px;
            box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.3);
          }
          
          .skip-to-content {
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--primary-color, #4a90e2);
            color: white;
            padding: 8px;
            z-index: 100;
            transition: top 0.3s;
          }
          
          .skip-to-content:focus {
            top: 0;
          }
        `;
        
        // 添加跳转到内容的链接
        if (!document.querySelector('.skip-to-content')) {
          const skipLink = document.createElement('a');
          skipLink.href = '#main';
          skipLink.className = 'skip-to-content';
          skipLink.textContent = '跳转到主要内容';
          document.body.insertBefore(skipLink, document.body.firstChild);
        }
        break;
      case 'comprehensive':
        css += `
          a:focus, button:focus, input:focus, select:focus, textarea:focus {
            outline: 3px solid var(--primary-color, #4a90e2);
            outline-offset: 3px;
            box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.3);
          }
          
          .skip-to-content {
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--primary-color, #4a90e2);
            color: white;
            padding: 8px;
            z-index: 100;
            transition: top 0.3s;
          }
          
          .skip-to-content:focus {
            top: 0;
          }
          
          [tabindex]:not([tabindex="-1"]):focus {
            outline: 3px solid var(--primary-color, #4a90e2);
            outline-offset: 3px;
            box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.3);
          }
        `;
        
        // 添加跳转链接
        if (!document.querySelector('.skip-to-content')) {
          const skipLink = document.createElement('a');
          skipLink.href = '#main';
          skipLink.className = 'skip-to-content';
          skipLink.textContent = '跳转到主要内容';
          document.body.insertBefore(skipLink, document.body.firstChild);
        }
        
        // 添加键盘快捷键
        document.addEventListener('keydown', function(e) {
          // Alt+1: 跳转到主要内容
          if (e.altKey && e.key === '1') {
            e.preventDefault();
            document.querySelector('main').focus();
          }
          // Alt+2: 跳转到导航
          else if (e.altKey && e.key === '2') {
            e.preventDefault();
            document.querySelector('nav').focus();
          }
          // Alt+3: 跳转到投票列表
          else if (e.altKey && e.key === '3') {
            e.preventDefault();
            document.querySelector('#polls-container').focus();
          }
        });
        break;
    }
    
    // 色彩模式
    switch (colorMode) {
      case 'standard':
        // 标准色彩模式，不需要额外CSS
        break;
      case 'deuteranopia': // 绿色盲
        css += `
          :root {
            --primary-color: #0072B2;
            --secondary-color: #005682;
            --accent-color: #440154;
            --success-color: #0072B2;
            --warning-color: #E69F00;
            --error-color: #D55E00;
          }
          
          .progress-fill, .parameter-category.active {
            background-color: #0072B2 !important;
          }
          
          button, .button, input[type="submit"] {
            background-color: #0072B2;
          }
          
          button:hover, .button:hover, input[type="submit"]:hover {
            background-color: #005682;
          }
        `;
        break;
      case 'protanopia': // 红色盲
        css += `
          :root {
            --primary-color: #0072B2;
            --secondary-color: #005682;
            --accent-color: #440154;
            --success-color: #0072B2;
            --warning-color: #E69F00;
            --error-color: #D55E00;
          }
          
          .progress-fill, .parameter-category.active {
            background-color: #0072B2 !important;
          }
          
          button, .button, input[type="submit"] {
            background-color: #0072B2;
          }
          
          button:hover, .button:hover, input[type="submit"]:hover {
            background-color: #005682;
          }
        `;
        break;
      case 'tritanopia': // 蓝色盲
        css += `
          :root {
            --primary-color: #E69F00;
            --secondary-color: #B07B00;
            --accent-color: #D55E00;
            --success-color: #009E73;
            --warning-color: #E69F00;
            --error-color: #D55E00;
          }
          
          .progress-fill, .parameter-category.active {
            background-color: #E69F00 !important;
          }
          
          button, .button, input[type="submit"] {
            background-color: #E69F00;
          }
          
          button:hover, .button:hover, input[type="submit"]:hover {
            background-color: #B07B00;
          }
        `;
        break;
      case 'grayscale':
        css += `
          html {
            filter: grayscale(100%);
          }
        `;
        break;
    }
    
    styleElement.textContent = css;
  }
  
  // 更新交互设置
  function updateInteractionSettings() {
    let styleElement = document.getElementById('interaction-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'interaction-styles';
      document.head.appendChild(styleElement);
    }
    
    const clickFeedback = window.websiteParameters.interaction.clickFeedback.current;
    const formValidation = window.websiteParameters.interaction.formValidation.current;
    
    let css = '';
    
    // 点击反馈
    switch (clickFeedback) {
      case 'none':
        css += `
          button:active, .button:active, input[type="submit"]:active {
            transform: none;
          }
        `;
        break;
      case 'subtle':
        css += `
          button:active, .button:active, input[type="submit"]:active {
            transform: scale(0.98);
            opacity: 0.9;
          }
        `;
        break;
      case 'standard':
        css += `
          button:active, .button:active, input[type="submit"]:active {
            transform: scale(0.95);
            opacity: 0.8;
          }
        `;
        break;
      case 'pronounced':
        css += `
          button:active, .button:active, input[type="submit"]:active {
            transform: scale(0.9);
            opacity: 0.7;
            box-shadow: inset 0 3px 5px rgba(0,0,0,0.2);
          }
        `;
        break;
    }
    
    // 表单验证样式
    switch (formValidation) {
      case 'minimal':
        css += `
          input:invalid, textarea:invalid, select:invalid {
            border-color: var(--border-color, #ddd);
          }
        `;
        break;
      case 'balanced':
        css += `
          input:invalid, textarea:invalid, select:invalid {
            border-color: var(--error-color, #f44336);
          }
        `;
        break;
      case 'strict':
        css += `
          input:invalid, textarea:invalid, select:invalid {
            border-color: var(--error-color, #f44336);
            box-shadow: 0 0 0 1px var(--error-color, #f44336);
          }
          
          input:invalid + .error-message,
          textarea:invalid + .error-message,
          select:invalid + .error-message {
            display: block;
            color: var(--error-color, #f44336);
            font-size: 0.8rem;
            margin-top: 5px;
          }
        `;
        break;
      case 'very-strict':
        css += `
          input:invalid, textarea:invalid, select:invalid {
            border-color: var(--error-color, #f44336);
            box-shadow: 0 0 0 2px var(--error-color, #f44336);
            background-color: rgba(244, 67, 54, 0.05);
          }
          
          input:invalid + .error-message,
          textarea:invalid + .error-message,
          select:invalid + .error-message {
            display: block;
            color: var(--error-color, #f44336);
            font-size: 0.8rem;
            margin-top: 5px;
            font-weight: bold;
          }
          
          form:invalid button[type="submit"],
          form:invalid input[type="submit"] {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `;
        break;
    }
    
    styleElement.textContent = css;
    
    // 确认对话框使用
    const confirmDialogs = window.websiteParameters.interaction.confirmDialogs.current;
    
    // 重写确认操作函数
    window.confirmAction = function(action, message) {
      switch (confirmDialogs) {
        case 'none':
          // 不使用确认对话框
          return action();
        case 'minimal':
          // 只对删除操作使用确认对话框
          if (message.includes('删除')) {
            return confirm(message) ? action() : null;
          }
          return action();
        case 'important':
          // 对重要操作使用确认对话框
          if (message.includes('删除') || message.includes('重置') || message.includes('清除')) {
            return confirm(message) ? action() : null;
          }
          return action();
        case 'all':
          // 对所有操作使用确认对话框
          return confirm(message) ? action() : null;
      }
    };
  }
  
  // 重新排序列表
  function reorderLists() {
    if (!window.websiteParameters.content_display) return;
    
    const listSorting = window.websiteParameters.content_display.listSorting.current;
    
    // 获取投票列表
    const pollsContainer = document.getElementById('polls-container');
    if (!pollsContainer) return;
    
    // 获取所有投票卡片
    const pollCards = Array.from(pollsContainer.querySelectorAll('.poll-card'));
    if (pollCards.length === 0) return;
    
    // 根据排序方式重新排序
    switch (listSorting) {
      case 'time-desc':
        // 按创建时间降序排序
        pollCards.sort((a, b) => {
          const aId = a.getAttribute('data-poll-id');
          const bId = b.getAttribute('data-poll-id');
          const aPoll = window.polls.find(p => p.id === aId);
          const bPoll = window.polls.find(p => p.id === bId);
          
          if (!aPoll || !bPoll) return 0;
          
          return new Date(bPoll.id) - new Date(aPoll.id);
        });
        break;
      case 'time-asc':
        // 按创建时间升序排序
        pollCards.sort((a, b) => {
          const aId = a.getAttribute('data-poll-id');
          const bId = b.getAttribute('data-poll-id');
          const aPoll = window.polls.find(p => p.id === aId);
          const bPoll = window.polls.find(p => p.id === bId);
          
          if (!aPoll || !bPoll) return 0;
          
          return new Date(aPoll.id) - new Date(bPoll.id);
        });
        break;
      case 'votes-desc':
        // 按投票数降序排序
        pollCards.sort((a, b) => {
          const aId = a.getAttribute('data-poll-id');
          const bId = b.getAttribute('data-poll-id');
          const aPoll = window.polls.find(p => p.id === aId);
          const bPoll = window.polls.find(p => p.id === bId);
          
          if (!aPoll || !bPoll) return 0;
          
          const aTotalVotes = aPoll.options.reduce((sum, option) => sum + option.votes, 0);
          const bTotalVotes = bPoll.options.reduce((sum, option) => sum + option.votes, 0);
          
          return bTotalVotes - aTotalVotes;
        });
        break;
      case 'alphabetical':
        // 按标题字母顺序排序
        pollCards.sort((a, b) => {
          const aId = a.getAttribute('data-poll-id');
          const bId = b.getAttribute('data-poll-id');
          const aPoll = window.polls.find(p => p.id === aId);
          const bPoll = window.polls.find(p => p.id === bId);
          
          if (!aPoll || !bPoll) return 0;
          
          return aPoll.title.localeCompare(bPoll.title);
        });
        break;
    }
    
    // 重新添加到容器
    pollCards.forEach(card => {
      pollsContainer.appendChild(card);
    });
  }
  
  // 创建扩展参数投票
  function createExpandedParameterPolls() {
    console.log('创建扩展参数投票');
    
    // 检查是否有createParameterPoll函数
    if (typeof window.createParameterPoll !== 'function') {
      console.warn('createParameterPoll函数不存在，无法创建扩展参数投票');
      return;
    }
    
    // 创建UI细节参数投票
    createUIDetailsPolls();
    
    // 创建内容展示参数投票
    createContentDisplayPolls();
    
    // 创建性能相关参数投票
    createPerformancePolls();
    
    // 创建辅助功能参数投票
    createAccessibilityPolls();
    
    // 创建交互参数投票
    createInteractionPolls();
    
    console.log('扩展参数投票创建完成');
  }
  
  // 创建UI细节参数投票
  function createUIDetailsPolls() {
    // 创建按钮样式投票
    createParameterPoll('ui_details', 'buttonStyle', ['标准', '圆角', '胶囊形', '扁平', '3D'], null);
    
    // 创建字体选择投票
    createParameterPoll('ui_details', 'fontFamily', ['系统默认', '衬线字体', '无衬线字体', '等宽字体', '圆润字体'], null);
    
    // 创建动画效果投票
    createParameterPoll('ui_details', 'animationStyle', ['标准', '平滑', '弹跳', '无动画', '戏剧性'], null);
    
    // 创建卡片样式投票
    createParameterPoll('ui_details', 'cardStyle', ['标准', '扁平', '浮起', '轮廓', '极简'], null);
    
    // 创建颜色对比度投票
    createParameterPoll('ui_details', 'colorContrast', ['标准', '高对比度', '超高对比度', '最大对比度'], null);
  }
  
  // 创建内容展示参数投票
  function createContentDisplayPolls() {
    // 创建信息密度投票
    createParameterPoll('content_display', 'informationDensity', ['紧凑', '标准', '宽松', '非常宽松'], null);
    
    // 创建列表排序投票
    createParameterPoll('content_display', 'listSorting', ['时间降序', '时间升序', '投票数降序', '字母顺序'], null);
    
    // 创建投票卡片布局投票
    createParameterPoll('content_display', 'pollCardLayout', ['标准', '紧凑', '详细', '极简', '网格'], null);
    
    // 创建标题样式投票
    createParameterPoll('content_display', 'headingStyle', ['标准', '粗体', '下划线', '居中', '极简'], null);
  }
  
  // 创建性能相关参数投票
  function createPerformancePolls() {
    // 创建预加载策略投票
    createParameterPoll('performance', 'preloadStrategy', ['激进', '平衡', '最小化', '禁用'], null);
    
    // 创建缓存策略投票
    createParameterPoll('performance', 'cacheStrategy', ['最小化', '标准', '广泛', '激进'], null);
    
    // 创建图片质量投票
    createParameterPoll('performance', 'imageQuality', ['低', '中', '高', '自动'], null);
    
    // 创建动画减弱投票
    createParameterPoll('performance', 'animationReduction', ['无', '减少', '最小化', '禁用'], null);
  }
  
  // 创建辅助功能参数投票
  function createAccessibilityPolls() {
    // 创建文本大小调整投票
    createParameterPoll('accessibility', 'textSizeAdjustment', ['-10%', '0%', '+10%', '+20%', '+30%'], null);
    
    // 创建焦点指示器投票
    createParameterPoll('accessibility', 'focusIndicator', ['微妙', '标准', '高可见度', '自定义'], null);
    
    // 创建键盘导航增强投票
    createParameterPoll('accessibility', 'keyboardNavigation', ['最小化', '标准', '增强', '全面'], null);
    
    // 创建色彩模式投票
    createParameterPoll('accessibility', 'colorMode', ['标准', '绿色盲模式', '红色盲模式', '蓝色盲模式', '灰度模式'], null);
  }
  
  // 创建交互参数投票
  function createInteractionPolls() {
    // 创建点击反馈投票
    createParameterPoll('interaction', 'clickFeedback', ['无', '微妙', '标准', '明显'], null);
    
    // 创建滚动行为投票
    createParameterPoll('interaction', 'scrollBehavior', ['即时', '平滑', '自动'], null);
    
    // 创建表单验证严格程度投票
    createParameterPoll('interaction', 'formValidation', ['最小化', '平衡', '严格', '非常严格'], null);
    
    // 创建确认对话框使用投票
    createParameterPoll('interaction', 'confirmDialogs', ['无', '最小化', '重要操作', '所有操作'], null);
  }
  
  // 从选项文本获取参数值
  function getExpandedParameterValueFromText(paramName, optionText) {
    switch (paramName) {
      // UI细节参数
      case 'buttonStyle':
        if (optionText === '标准') return 'standard';
        if (optionText === '圆角') return 'rounded';
        if (optionText === '胶囊形') return 'pill';
        if (optionText === '扁平') return 'flat';
        if (optionText === '3D') return '3d';
        return optionText;
      case 'fontFamily':
        if (optionText === '系统默认') return 'system';
        if (optionText === '衬线字体') return 'serif';
        if (optionText === '无衬线字体') return 'sans-serif';
        if (optionText === '等宽字体') return 'monospace';
        if (optionText === '圆润字体') return 'rounded';
        return optionText;
      case 'animationStyle':
        if (optionText === '标准') return 'standard';
        if (optionText === '平滑') return 'smooth';
        if (optionText === '弹跳') return 'bounce';
        if (optionText === '无动画') return 'none';
        if (optionText === '戏剧性') return 'dramatic';
        return optionText;
      case 'cardStyle':
        if (optionText === '标准') return 'standard';
        if (optionText === '扁平') return 'flat';
        if (optionText === '浮起') return 'raised';
        if (optionText === '轮廓') return 'outlined';
        if (optionText === '极简') return 'minimal';
        return optionText;
      case 'colorContrast':
        if (optionText === '标准') return 'standard';
        if (optionText === '高对比度') return 'high';
        if (optionText === '超高对比度') return 'very-high';
        if (optionText === '最大对比度') return 'maximum';
        return optionText;
        
      // 内容展示参数
      case 'informationDensity':
        if (optionText === '紧凑') return 'compact';
        if (optionText === '标准') return 'standard';
        if (optionText === '宽松') return 'spacious';
        if (optionText === '非常宽松') return 'very-spacious';
        return optionText;
      case 'listSorting':
        if (optionText === '时间降序') return 'time-desc';
        if (optionText === '时间升序') return 'time-asc';
        if (optionText === '投票数降序') return 'votes-desc';
        if (optionText === '字母顺序') return 'alphabetical';
        return optionText;
      case 'pollCardLayout':
        if (optionText === '标准') return 'standard';
        if (optionText === '紧凑') return 'compact';
        if (optionText === '详细') return 'detailed';
        if (optionText === '极简') return 'minimal';
        if (optionText === '网格') return 'grid';
        return optionText;
      case 'headingStyle':
        if (optionText === '标准') return 'standard';
        if (optionText === '粗体') return 'bold';
        if (optionText === '下划线') return 'underlined';
        if (optionText === '居中') return 'centered';
        if (optionText === '极简') return 'minimal';
        return optionText;
        
      // 性能相关参数
      case 'preloadStrategy':
        if (optionText === '激进') return 'aggressive';
        if (optionText === '平衡') return 'balanced';
        if (optionText === '最小化') return 'minimal';
        if (optionText === '禁用') return 'disabled';
        return optionText;
      case 'cacheStrategy':
        if (optionText === '最小化') return 'minimal';
        if (optionText === '标准') return 'standard';
        if (optionText === '广泛') return 'extensive';
        if (optionText === '激进') return 'aggressive';
        return optionText;
      case 'imageQuality':
        if (optionText === '低') return 'low';
        if (optionText === '中') return 'medium';
        if (optionText === '高') return 'high';
        if (optionText === '自动') return 'auto';
        return optionText;
      case 'animationReduction':
        if (optionText === '无') return 'none';
        if (optionText === '减少') return 'reduced';
        if (optionText === '最小化') return 'minimal';
        if (optionText === '禁用') return 'disabled';
        return optionText;
        
      // 辅助功能参数
      case 'textSizeAdjustment':
        if (optionText === '-10%') return '-10';
        if (optionText === '0%') return '0';
        if (optionText === '+10%') return '10';
        if (optionText === '+20%') return '20';
        if (optionText === '+30%') return '30';
        return optionText;
      case 'focusIndicator':
        if (optionText === '微妙') return 'subtle';
        if (optionText === '标准') return 'standard';
        if (optionText === '高可见度') return 'high-visibility';
        if (optionText === '自定义') return 'custom';
        return optionText;
      case 'keyboardNavigation':
        if (optionText === '最小化') return 'minimal';
        if (optionText === '标准') return 'standard';
        if (optionText === '增强') return 'enhanced';
        if (optionText === '全面') return 'comprehensive';
        return optionText;
      case 'colorMode':
        if (optionText === '标准') return 'standard';
        if (optionText === '绿色盲模式') return 'deuteranopia';
        if (optionText === '红色盲模式') return 'protanopia';
        if (optionText === '蓝色盲模式') return 'tritanopia';
        if (optionText === '灰度模式') return 'grayscale';
        return optionText;
        
      // 交互参数
      case 'clickFeedback':
        if (optionText === '无') return 'none';
        if (optionText === '微妙') return 'subtle';
        if (optionText === '标准') return 'standard';
        if (optionText === '明显') return 'pronounced';
        return optionText;
      case 'scrollBehavior':
        if (optionText === '即时') return 'instant';
        if (optionText === '平滑') return 'smooth';
        if (optionText === '自动') return 'auto';
        return optionText;
      case 'formValidation':
        if (optionText === '最小化') return 'minimal';
        if (optionText === '平衡') return 'balanced';
        if (optionText === '严格') return 'strict';
        if (optionText === '非常严格') return 'very-strict';
        return optionText;
      case 'confirmDialogs':
        if (optionText === '无') return 'none';
        if (optionText === '最小化') return 'minimal';
        if (optionText === '重要操作') return 'important';
        if (optionText === '所有操作') return 'all';
        return optionText;
      default:
        return optionText;
    }
  }
  
  // 获取参数显示名称
  function getExpandedParameterDisplayName(paramName) {
    switch (paramName) {
      // UI细节参数
      case 'buttonStyle': return '按钮样式';
      case 'fontFamily': return '字体选择';
      case 'animationStyle': return '动画效果';
      case 'cardStyle': return '卡片样式';
      case 'colorContrast': return '颜色对比度';
      
      // 内容展示参数
      case 'informationDensity': return '信息密度';
      case 'listSorting': return '列表排序方式';
      case 'pollCardLayout': return '投票卡片布局';
      case 'headingStyle': return '标题样式';
      
      // 性能相关参数
      case 'preloadStrategy': return '预加载策略';
      case 'cacheStrategy': return '缓存策略';
      case 'imageQuality': return '图片质量';
      case 'animationReduction': return '动画减弱';
      
      // 辅助功能参数
      case 'textSizeAdjustment': return '文本大小调整';
      case 'focusIndicator': return '焦点指示器样式';
      case 'keyboardNavigation': return '键盘导航增强';
      case 'colorMode': return '色彩模式';
      
      // 交互参数
      case 'clickFeedback': return '点击反馈效果';
      case 'scrollBehavior': return '滚动行为';
      case 'formValidation': return '表单验证严格程度';
      case 'confirmDialogs': return '确认对话框使用场景';
      
      default: return paramName;
    }
  }
  
  // 扩展原有的getParameterValueFromText函数
  if (typeof window.getParameterValueFromText === 'function') {
    const originalGetParameterValueFromText = window.getParameterValueFromText;
    window.getParameterValueFromText = function(paramName, optionText) {
      // 检查是否是扩展参数
      const expandedParamCategories = ['buttonStyle', 'fontFamily', 'animationStyle', 'cardStyle', 'colorContrast',
                                      'informationDensity', 'listSorting', 'pollCardLayout', 'headingStyle',
                                      'preloadStrategy', 'cacheStrategy', 'imageQuality', 'animationReduction',
                                      'textSizeAdjustment', 'focusIndicator', 'keyboardNavigation', 'colorMode',
                                      'clickFeedback', 'scrollBehavior', 'formValidation', 'confirmDialogs'];
      
      if (expandedParamCategories.includes(paramName)) {
        return getExpandedParameterValueFromText(paramName, optionText);
      }
      
      // 否则使用原始函数
      return originalGetParameterValueFromText(paramName, optionText);
    };
  }
  
  // 扩展原有的getParameterDisplayName函数
  if (typeof window.getParameterDisplayName === 'function') {
    const originalGetParameterDisplayName = window.getParameterDisplayName;
    window.getParameterDisplayName = function(paramName) {
      // 检查是否是扩展参数
      const expandedParamCategories = ['buttonStyle', 'fontFamily', 'animationStyle', 'cardStyle', 'colorContrast',
                                      'informationDensity', 'listSorting', 'pollCardLayout', 'headingStyle',
                                      'preloadStrategy', 'cacheStrategy', 'imageQuality', 'animationReduction',
                                      'textSizeAdjustment', 'focusIndicator', 'keyboardNavigation', 'colorMode',
                                      'clickFeedback', 'scrollBehavior', 'formValidation', 'confirmDialogs'];
      
      if (expandedParamCategories.includes(paramName)) {
        return getExpandedParameterDisplayName(paramName);
      }
      
      // 否则使用原始函数
      return originalGetParameterDisplayName(paramName);
    };
  }
  
  // 在DOM加载完成后初始化
  document.addEventListener('DOMContentLoaded', function() {
    console.log('初始化扩展参数模块');
    
    // 初始化扩展参数
    initExpandedParameters();
    
    // 延迟创建扩展参数投票，确保polls数组已加载
    setTimeout(createExpandedParameterPolls, 2000);
    
    console.log('扩展参数模块初始化完成');
  });
  
  // 导出公共API
  window.ExpandedParameters = {
    refresh: function() {
      applyExpandedParameters();
    },
    createPolls: createExpandedParameterPolls
  };
})();
