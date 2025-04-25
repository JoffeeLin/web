/**
 * 增强实时反馈机制模块
 * 为网站添加更强大的实时投票反馈功能
 */

(function() {
  'use strict';
  
  // 配置
  const config = {
    // 实时更新间隔（毫秒）
    updateInterval: 5000,
    // 是否启用参数变更预览
    enablePreview: true,
    // 预览持续时间（毫秒）
    previewDuration: 3000,
    // 是否启用变更历史记录
    enableHistory: true,
    // 历史记录最大条数
    maxHistoryItems: 20,
    // 是否启用详细通知
    enableDetailedNotifications: true,
    // 通知显示时间（毫秒）
    notificationDuration: 5000
  };
  
  // 变更历史记录
  let parameterChangeHistory = [];
  
  // 当前预览状态
  let currentPreview = null;
  let previewTimer = null;
  
  // 原始参数值备份（用于预览）
  let originalParameterValues = {};
  
  // 增强实时投票反馈机制
  function enhanceRealTimeVotingFeedback() {
    console.log("增强实时投票反馈机制初始化...");
    
    // 备份原始updateRealTimeVotingFeedback函数
    if (typeof window.updateRealTimeVotingFeedback === 'function') {
      const originalUpdateFunction = window.updateRealTimeVotingFeedback;
      
      // 增强版实时投票反馈函数
      window.updateRealTimeVotingFeedback = function() {
        console.log("执行增强版实时投票反馈更新...");
        
        // 调用原始函数
        const result = originalUpdateFunction.apply(this, arguments);
        
        // 增强功能：添加参数变更预览
        if (config.enablePreview) {
          addParameterChangePreview();
        }
        
        // 增强功能：更新变更历史记录
        if (config.enableHistory) {
          updateParameterChangeHistory();
        }
        
        // 增强功能：显示详细通知
        if (config.enableDetailedNotifications) {
          showDetailedNotifications();
        }
        
        return result;
      };
      
      console.log("原始实时投票反馈函数已增强");
    } else {
      console.warn("原始实时投票反馈函数不存在，无法增强");
    }
    
    // 缩短更新间隔
    if (window.realTimeVotingInterval) {
      clearInterval(window.realTimeVotingInterval);
      window.realTimeVotingInterval = setInterval(window.updateRealTimeVotingFeedback, config.updateInterval);
      console.log(`实时投票更新间隔已设置为 ${config.updateInterval}ms`);
    }
    
    // 增强投票提交处理
    enhanceVoteSubmissionHandler();
    
    // 初始化变更历史UI
    if (config.enableHistory) {
      initParameterChangeHistoryUI();
    }
    
    // 初始化参数预览UI
    if (config.enablePreview) {
      initParameterPreviewUI();
    }
    
    // 添加多设备同步支持
    addMultiDeviceSync();
    
    console.log("实时投票反馈机制增强完成");
  }
  
  // 增强投票提交处理
  function enhanceVoteSubmissionHandler() {
    console.log("增强投票提交处理...");
    
    // 查找投票提交按钮
    const pollDetailSection = document.getElementById('poll-detail-section');
    if (!pollDetailSection) {
      console.warn("找不到投票详情区域，无法增强投票提交处理");
      return;
    }
    
    // 监听投票详情区域的变化
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          // 查找新添加的投票提交按钮
          const submitButton = pollDetailSection.querySelector('button[type="submit"], input[type="submit"], .submit-vote-btn');
          if (submitButton && !submitButton.dataset.enhanced) {
            // 标记为已增强
            submitButton.dataset.enhanced = 'true';
            
            // 添加增强的点击处理
            submitButton.addEventListener('click', function(e) {
              // 不阻止默认行为，让原始处理函数执行
              
              // 在投票提交后立即更新
              setTimeout(function() {
                if (typeof window.updateRealTimeVotingFeedback === 'function') {
                  window.updateRealTimeVotingFeedback();
                  console.log("投票提交后立即执行实时更新");
                }
              }, 500);
            });
            
            console.log("投票提交按钮已增强");
          }
        }
      });
    });
    
    // 开始观察
    observer.observe(pollDetailSection, { childList: true, subtree: true });
    
    console.log("投票提交处理增强完成");
  }
  
  // 添加参数变更预览
  function addParameterChangePreview() {
    console.log("添加参数变更预览...");
    
    // 获取所有活跃的参数投票
    const activeParameterPolls = window.polls.filter(poll => 
      poll.isParameterPoll && 
      new Date(poll.endDate) > new Date() && 
      !poll.executed
    );
    
    // 对每个活跃的参数投票进行处理
    activeParameterPolls.forEach(poll => {
      // 获取投票选项和票数
      const options = poll.options;
      
      // 找出得票最高的选项
      let maxVotes = -1;
      let winningOption = null;
      let isTie = false;
      
      options.forEach(option => {
        if (option.votes > maxVotes) {
          maxVotes = option.votes;
          winningOption = option;
          isTie = false;
        } else if (option.votes === maxVotes && maxVotes > 0) {
          isTie = true;
        }
      });
      
      // 如果没有平局且有投票，预览当前领先的选项
      if (!isTie && winningOption && maxVotes > 0) {
        const category = poll.parameterCategory;
        const paramName = poll.parameterName;
        
        // 获取参数对象
        const param = window.websiteParameters[category][paramName];
        
        // 将选项文本转换为参数值
        const paramValue = window.getParameterValueFromText(paramName, winningOption.text);
        
        // 如果当前值与领先选项不同，则预览新值
        if (param.current !== paramValue) {
          console.log(`预览参数 ${paramName} 从 ${param.current} 变更为 ${paramValue}`);
          
          // 备份原始值（如果尚未备份）
          if (!originalParameterValues[`${category}.${paramName}`]) {
            originalParameterValues[`${category}.${paramName}`] = param.current;
          }
          
          // 应用预览值
          applyParameterPreview(category, paramName, paramValue);
          
          // 设置预览计时器
          if (previewTimer) {
            clearTimeout(previewTimer);
          }
          
          // 记录当前预览
          currentPreview = {
            category: category,
            paramName: paramName,
            originalValue: originalParameterValues[`${category}.${paramName}`],
            previewValue: paramValue
          };
          
          // 预览结束后恢复原始值
          previewTimer = setTimeout(function() {
            restoreFromPreview();
          }, config.previewDuration);
          
          // 显示预览通知
          showPreviewNotification(category, paramName, paramValue);
        }
      }
    });
  }
  
  // 应用参数预览
  function applyParameterPreview(category, paramName, value) {
    // 获取参数对象
    const param = window.websiteParameters[category][paramName];
    
    // 临时更改参数值
    param.current = value;
    
    // 应用参数变更
    applyParameterChange(category, paramName);
    
    // 添加预览指示器
    document.body.classList.add('parameter-preview-active');
    
    console.log(`参数 ${paramName} 预览值 ${value} 已应用`);
  }
  
  // 从预览中恢复
  function restoreFromPreview() {
    if (!currentPreview) return;
    
    console.log(`从预览中恢复参数 ${currentPreview.paramName} 到原始值 ${currentPreview.originalValue}`);
    
    // 恢复原始值
    const param = window.websiteParameters[currentPreview.category][currentPreview.paramName];
    param.current = currentPreview.originalValue;
    
    // 应用原始参数
    applyParameterChange(currentPreview.category, currentPreview.paramName);
    
    // 移除预览指示器
    document.body.classList.remove('parameter-preview-active');
    
    // 清除当前预览
    currentPreview = null;
    
    console.log("预览已恢复到原始状态");
  }
  
  // 应用参数变更
  function applyParameterChange(category, paramName) {
    // 根据参数类别应用不同的变更
    switch (category) {
      case 'ui':
        applyUIParameterChange(paramName);
        break;
      case 'features':
        applyFeatureParameterChange(paramName);
        break;
      case 'system':
        applySystemParameterChange(paramName);
        break;
      case 'ui_details':
        if (typeof window.ExpandedParameters !== 'undefined') {
          window.ExpandedParameters.refresh();
        }
        break;
      case 'content_display':
        if (typeof window.ExpandedParameters !== 'undefined') {
          window.ExpandedParameters.refresh();
        }
        break;
      case 'performance':
        if (typeof window.ExpandedParameters !== 'undefined') {
          window.ExpandedParameters.refresh();
        }
        break;
      case 'accessibility':
        if (typeof window.ExpandedParameters !== 'undefined') {
          window.ExpandedParameters.refresh();
        }
        break;
      case 'interaction':
        if (typeof window.ExpandedParameters !== 'undefined') {
          window.ExpandedParameters.refresh();
        }
        break;
      default:
        console.log(`未知参数类别 ${category}，尝试通用应用方法`);
        applyGenericParameterChange(category, paramName);
        break;
    }
  }
  
  // 应用UI参数变更
  function applyUIParameterChange(paramName) {
    switch (paramName) {
      case 'colorScheme':
        applyColorScheme();
        break;
      case 'fontSize':
        applyFontSize();
        break;
      case 'layout':
        applyLayout();
        break;
      default:
        console.log(`未知UI参数 ${paramName}`);
        break;
    }
  }
  
  // 应用功能参数变更
  function applyFeatureParameterChange(paramName) {
    switch (paramName) {
      case 'darkMode':
        applyDarkMode();
        break;
      case 'liveResults':
        applyLiveResults();
        break;
      case 'anonymousVoting':
        applyAnonymousVoting();
        break;
      default:
        console.log(`未知功能参数 ${paramName}`);
        break;
    }
  }
  
  // 应用系统参数变更
  function applySystemParameterChange(paramName) {
    switch (paramName) {
      case 'autoExecuteDelay':
        // 系统参数通常不需要立即应用
        console.log(`系统参数 ${paramName} 已更新，将在下次相关操作时生效`);
        break;
      case 'maxPollsPerUser':
        // 系统参数通常不需要立即应用
        console.log(`系统参数 ${paramName} 已更新，将在下次相关操作时生效`);
        break;
      case 'defaultPollDuration':
        // 系统参数通常不需要立即应用
        console.log(`系统参数 ${paramName} 已更新，将在下次相关操作时生效`);
        break;
      default:
        console.log(`未知系统参数 ${paramName}`);
        break;
    }
  }
  
  // 应用通用参数变更
  function applyGenericParameterChange(category, paramName) {
    console.log(`尝试应用通用参数变更：${category}.${paramName}`);
    
    // 尝试调用特定的应用函数
    const applyFunctionName = `apply${category.charAt(0).toUpperCase() + category.slice(1)}${paramName.charAt(0).toUpperCase() + paramName.slice(1)}`;
    if (typeof window[applyFunctionName] === 'function') {
      window[applyFunctionName]();
      console.log(`调用了 ${applyFunctionName} 函数`);
    } else {
      console.log(`没有找到 ${applyFunctionName} 函数，尝试通用方法`);
      
      // 尝试通用方法：更新数据属性
      document.body.setAttribute(`data-${category}-${paramName}`, window.websiteParameters[category][paramName].current);
      
      // 触发自定义事件
      const event = new CustomEvent('parameterChanged', {
        detail: {
          category: category,
          paramName: paramName,
          value: window.websiteParameters[category][paramName].current
        }
      });
      document.dispatchEvent(event);
    }
  }
  
  // 更新变更历史记录
  function updateParameterChangeHistory() {
    if (!config.enableHistory) return;
    
    console.log("更新参数变更历史记录...");
    
    // 获取所有活跃的参数投票
    const activeParameterPolls = window.polls.filter(poll => 
      poll.isParameterPoll && 
      new Date(poll.endDate) > new Date() && 
      !poll.executed
    );
    
    // 对每个活跃的参数投票进行处理
    activeParameterPolls.forEach(poll => {
      // 获取投票选项和票数
      const options = poll.options;
      
      // 找出得票最高的选项
      let maxVotes = -1;
      let winningOption = null;
      let isTie = false;
      
      options.forEach(option => {
        if (option.votes > maxVotes) {
          maxVotes = option.votes;
          winningOption = option;
          isTie = false;
        } else if (option.votes === maxVotes && maxVotes > 0) {
          isTie = true;
        }
      });
      
      // 如果没有平局且有投票，记录当前领先的选项
      if (!isTie && winningOption && maxVotes > 0) {
        const category = poll.parameterCategory;
        const paramName = poll.parameterName;
        
        // 获取参数对象
        const param = window.websiteParameters[category][paramName];
        
        // 将选项文本转换为参数值
        const paramValue = window.getParameterValueFromText(paramName, winningOption.text);
        
        // 如果当前值与领先选项不同，则记录变更
        if (param.current !== paramValue) {
          // 检查是否已经有相同的变更记录
          const existingRecord = parameterChangeHistory.find(record => 
            record.category === category && 
            record.paramName === paramName && 
            record.newValue === paramValue
          );
          
          if (!existingRecord) {
            // 添加新的变更记录
            const changeRecord = {
              id: Date.now(),
              timestamp: new Date(),
              category: category,
              paramName: paramName,
              displayName: window.getParameterDisplayName(paramName),
              oldValue: param.current,
              newValue: paramValue,
              pollId: poll.id,
              pollTitle: poll.title
            };
            
            // 添加到历史记录
            parameterChangeHistory.unshift(changeRecord);
            
            // 限制历史记录数量
            if (parameterChangeHistory.length > config.maxHistoryItems) {
              parameterChangeHistory.pop();
            }
            
            console.log(`添加参数变更历史记录：${paramName} 从 ${param.current} 变更为 ${paramValue}`);
            
            // 更新历史记录UI
            updateParameterChangeHistoryUI();
          }
        }
      }
    });
  }
  
  // 初始化参数变更历史UI
  function initParameterChangeHistoryUI() {
    console.log("初始化参数变更历史UI...");
    
    // 检查是否已存在历史记录面板
    if (document.getElementById('parameter-history-panel')) {
      console.log("参数变更历史UI已存在");
      return;
    }
    
    // 创建历史记录面板
    const historyPanel = document.createElement('div');
    historyPanel.id = 'parameter-history-panel';
    historyPanel.className = 'parameter-history-panel';
    historyPanel.innerHTML = `
      <div class="history-panel-header">
        <h3>参数变更历史</h3>
        <button id="close-history-panel" class="close-button">×</button>
      </div>
      <div class="history-panel-content">
        <ul id="parameter-history-list" class="parameter-history-list"></ul>
      </div>
    `;
    
    // 添加到文档
    document.body.appendChild(historyPanel);
    
    // 添加关闭按钮事件
    document.getElementById('close-history-panel').addEventListener('click', function() {
      historyPanel.classList.remove('active');
    });
    
    // 创建历史记录按钮
    const historyButton = document.createElement('button');
    historyButton.id = 'show-history-button';
    historyButton.className = 'show-history-button';
    historyButton.innerHTML = '<span class="history-icon">⏱</span> 参数历史';
    
    // 添加到文档
    document.body.appendChild(historyButton);
    
    // 添加按钮事件
    historyButton.addEventListener('click', function() {
      historyPanel.classList.toggle('active');
    });
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .parameter-history-panel {
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
      
      .parameter-history-panel.active {
        display: flex;
      }
      
      .history-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid #eee;
      }
      
      .history-panel-header h3 {
        margin: 0;
        font-size: 18px;
      }
      
      .close-button {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
      }
      
      .history-panel-content {
        padding: 15px;
        overflow-y: auto;
      }
      
      .parameter-history-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .parameter-history-item {
        padding: 10px;
        border-bottom: 1px solid #eee;
        margin-bottom: 10px;
      }
      
      .parameter-history-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
      
      .history-timestamp {
        font-size: 12px;
        color: #888;
        margin-bottom: 5px;
      }
      
      .history-title {
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .history-details {
        font-size: 14px;
      }
      
      .history-value-change {
        display: flex;
        align-items: center;
        margin-top: 5px;
      }
      
      .history-old-value, .history-new-value {
        padding: 2px 6px;
        border-radius: 4px;
        background-color: #f0f0f0;
      }
      
      .history-arrow {
        margin: 0 8px;
        color: #888;
      }
      
      .show-history-button {
        position: fixed;
        bottom: 20px;
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
      
      .history-icon {
        margin-right: 5px;
        font-size: 16px;
      }
      
      .dark-mode .parameter-history-panel {
        background-color: #333;
        color: white;
      }
      
      .dark-mode .history-panel-header {
        border-bottom-color: #444;
      }
      
      .dark-mode .close-button {
        color: #ccc;
      }
      
      .dark-mode .parameter-history-item {
        border-bottom-color: #444;
      }
      
      .dark-mode .history-timestamp {
        color: #aaa;
      }
      
      .dark-mode .history-old-value, .dark-mode .history-new-value {
        background-color: #444;
      }
    `;
    
    document.head.appendChild(style);
    
    console.log("参数变更历史UI初始化完成");
  }
  
  // 更新参数变更历史UI
  function updateParameterChangeHistoryUI() {
    const historyList = document.getElementById('parameter-history-list');
    if (!historyList) return;
    
    // 清空列表
    historyList.innerHTML = '';
    
    // 如果没有历史记录
    if (parameterChangeHistory.length === 0) {
      historyList.innerHTML = '<li class="parameter-history-item">暂无参数变更历史</li>';
      return;
    }
    
    // 添加历史记录项
    parameterChangeHistory.forEach(record => {
      const historyItem = document.createElement('li');
      historyItem.className = 'parameter-history-item';
      
      // 格式化时间
      const formattedTime = record.timestamp.toLocaleString();
      
      // 获取参数显示名称
      const paramDisplayName = record.displayName || record.paramName;
      
      // 创建历史记录项内容
      historyItem.innerHTML = `
        <div class="history-timestamp">${formattedTime}</div>
        <div class="history-title">${record.pollTitle}</div>
        <div class="history-details">
          参数 <strong>${paramDisplayName}</strong> 变更:
          <div class="history-value-change">
            <span class="history-old-value">${record.oldValue}</span>
            <span class="history-arrow">→</span>
            <span class="history-new-value">${record.newValue}</span>
          </div>
        </div>
      `;
      
      historyList.appendChild(historyItem);
    });
  }
  
  // 初始化参数预览UI
  function initParameterPreviewUI() {
    console.log("初始化参数预览UI...");
    
    // 检查是否已存在预览指示器
    if (document.getElementById('parameter-preview-indicator')) {
      console.log("参数预览UI已存在");
      return;
    }
    
    // 创建预览指示器
    const previewIndicator = document.createElement('div');
    previewIndicator.id = 'parameter-preview-indicator';
    previewIndicator.className = 'parameter-preview-indicator';
    previewIndicator.innerHTML = `
      <div class="preview-indicator-content">
        <span class="preview-icon">👁️</span>
        <span class="preview-text">参数预览中</span>
        <div class="preview-timer"></div>
      </div>
    `;
    
    // 添加到文档
    document.body.appendChild(previewIndicator);
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .parameter-preview-indicator {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        border-radius: 50px;
        padding: 8px 15px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
      }
      
      .preview-indicator-content {
        display: flex;
        align-items: center;
      }
      
      .preview-icon {
        margin-right: 8px;
      }
      
      .preview-text {
        font-size: 14px;
      }
      
      .preview-timer {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        margin-left: 10px;
        position: relative;
      }
      
      .preview-timer::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 8px;
        height: 8px;
        background-color: white;
        border-radius: 50%;
        transform: translate(-50%, -50%);
      }
      
      body.parameter-preview-active .parameter-preview-indicator {
        opacity: 1;
      }
      
      @keyframes previewPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      
      body.parameter-preview-active .preview-icon {
        animation: previewPulse 1s infinite;
      }
    `;
    
    document.head.appendChild(style);
    
    console.log("参数预览UI初始化完成");
  }
  
  // 显示预览通知
  function showPreviewNotification(category, paramName, value) {
    // 获取参数显示名称
    const paramDisplayName = window.getParameterDisplayName ? window.getParameterDisplayName(paramName) : paramName;
    
    // 创建通知
    showNotification(`正在预览参数 ${paramDisplayName} 的值: ${value}`, 'preview');
  }
  
  // 显示详细通知
  function showDetailedNotifications() {
    if (!config.enableDetailedNotifications) return;
    
    console.log("显示详细通知...");
    
    // 获取所有活跃的参数投票
    const activeParameterPolls = window.polls.filter(poll => 
      poll.isParameterPoll && 
      new Date(poll.endDate) > new Date() && 
      !poll.executed
    );
    
    // 对每个活跃的参数投票进行处理
    activeParameterPolls.forEach(poll => {
      // 获取投票选项和票数
      const options = poll.options;
      
      // 找出得票最高的选项
      let maxVotes = -1;
      let winningOption = null;
      let isTie = false;
      
      options.forEach(option => {
        if (option.votes > maxVotes) {
          maxVotes = option.votes;
          winningOption = option;
          isTie = false;
        } else if (option.votes === maxVotes && maxVotes > 0) {
          isTie = true;
        }
      });
      
      // 如果没有平局且有投票，显示当前领先的选项
      if (!isTie && winningOption && maxVotes > 0) {
        const category = poll.parameterCategory;
        const paramName = poll.parameterName;
        
        // 获取参数对象
        const param = window.websiteParameters[category][paramName];
        
        // 将选项文本转换为参数值
        const paramValue = window.getParameterValueFromText(paramName, winningOption.text);
        
        // 如果当前值与领先选项不同，则显示通知
        if (param.current !== paramValue) {
          // 获取参数显示名称
          const paramDisplayName = window.getParameterDisplayName ? window.getParameterDisplayName(paramName) : paramName;
          
          // 计算领先选项的票数百分比
          const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
          const leadingPercentage = totalVotes > 0 ? Math.round((winningOption.votes / totalVotes) * 100) : 0;
          
          // 创建详细通知
          showNotification(`参数 ${paramDisplayName} 即将变更为 ${winningOption.text} (领先${leadingPercentage}%)`, 'info');
        }
      }
    });
  }
  
  // 显示通知
  function showNotification(message, type = 'info') {
    console.log(`显示通知: ${message} (${type})`);
    
    // 检查是否已存在通知容器
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
      // 创建通知容器
      notificationContainer = document.createElement('div');
      notificationContainer.id = 'notification-container';
      notificationContainer.className = 'notification-container';
      document.body.appendChild(notificationContainer);
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .notification-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }
        
        .notification {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 15px;
          max-width: 300px;
          animation: slideIn 0.3s forwards;
          position: relative;
          overflow: hidden;
        }
        
        .notification.closing {
          animation: slideOut 0.3s forwards;
        }
        
        .notification-content {
          display: flex;
          align-items: flex-start;
        }
        
        .notification-icon {
          margin-right: 10px;
          font-size: 20px;
        }
        
        .notification-message {
          flex: 1;
          font-size: 14px;
        }
        
        .notification-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background-color: var(--primary-color, #4a90e2);
          width: 100%;
          transform-origin: left;
        }
        
        .notification-close {
          position: absolute;
          top: 5px;
          right: 5px;
          background: none;
          border: none;
          font-size: 16px;
          cursor: pointer;
          color: #999;
        }
        
        .notification-info {
          border-left: 4px solid var(--primary-color, #4a90e2);
        }
        
        .notification-info .notification-icon {
          color: var(--primary-color, #4a90e2);
        }
        
        .notification-success {
          border-left: 4px solid var(--success-color, #4caf50);
        }
        
        .notification-success .notification-icon {
          color: var(--success-color, #4caf50);
        }
        
        .notification-warning {
          border-left: 4px solid var(--warning-color, #ff9800);
        }
        
        .notification-warning .notification-icon {
          color: var(--warning-color, #ff9800);
        }
        
        .notification-error {
          border-left: 4px solid var(--error-color, #f44336);
        }
        
        .notification-error .notification-icon {
          color: var(--error-color, #f44336);
        }
        
        .notification-preview {
          border-left: 4px solid var(--accent-color, #9c27b0);
        }
        
        .notification-preview .notification-icon {
          color: var(--accent-color, #9c27b0);
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        
        .dark-mode .notification {
          background-color: #333;
          color: white;
        }
        
        .dark-mode .notification-close {
          color: #ccc;
        }
      `;
      
      document.head.appendChild(style);
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // 设置图标
    let icon = '🔔';
    switch (type) {
      case 'info':
        icon = 'ℹ️';
        break;
      case 'success':
        icon = '✅';
        break;
      case 'warning':
        icon = '⚠️';
        break;
      case 'error':
        icon = '❌';
        break;
      case 'preview':
        icon = '👁️';
        break;
    }
    
    // 创建通知内容
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">${icon}</div>
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close">×</button>
      <div class="notification-progress"></div>
    `;
    
    // 添加到容器
    notificationContainer.appendChild(notification);
    
    // 添加关闭按钮事件
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', function() {
      closeNotification(notification);
    });
    
    // 添加进度条动画
    const progressBar = notification.querySelector('.notification-progress');
    progressBar.style.animation = `shrink ${config.notificationDuration / 1000}s linear forwards`;
    progressBar.style.animationFillMode = 'forwards';
    
    // 添加进度条样式
    const progressStyle = document.createElement('style');
    progressStyle.textContent = `
      @keyframes shrink {
        from { transform: scaleX(1); }
        to { transform: scaleX(0); }
      }
    `;
    document.head.appendChild(progressStyle);
    
    // 设置自动关闭
    setTimeout(function() {
      closeNotification(notification);
    }, config.notificationDuration);
    
    return notification;
  }
  
  // 关闭通知
  function closeNotification(notification) {
    // 添加关闭动画
    notification.classList.add('closing');
    
    // 动画结束后移除元素
    setTimeout(function() {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
  
  // 添加多设备同步支持
  function addMultiDeviceSync() {
    console.log("添加多设备同步支持...");
    
    // 使用localStorage事件进行同步
    window.addEventListener('storage', function(e) {
      // 检查是否是参数变更
      if (e.key === 'websiteParameters') {
        console.log("检测到其他标签页的参数变更，正在同步...");
        
        // 重新加载参数
        if (e.newValue) {
          try {
            const newParams = JSON.parse(e.newValue);
            
            // 更新参数
            for (const category in newParams) {
              if (window.websiteParameters[category]) {
                for (const param in newParams[category]) {
                  if (window.websiteParameters[category][param]) {
                    window.websiteParameters[category][param].current = newParams[category][param].current;
                  }
                }
              }
            }
            
            // 应用所有参数
            applyAllParameters();
            
            console.log("参数已从其他标签页同步");
            
            // 显示同步通知
            showNotification("参数已从其他设备同步", 'info');
          } catch (error) {
            console.error("解析同步参数时出错:", error);
          }
        }
      }
      
      // 检查是否是投票变更
      if (e.key === 'polls') {
        console.log("检测到其他标签页的投票变更，正在同步...");
        
        // 重新加载投票
        if (e.newValue) {
          try {
            const newPolls = JSON.parse(e.newValue);
            
            // 更新投票
            window.polls = newPolls;
            
            // 刷新投票列表
            if (typeof window.displayPolls === 'function') {
              window.displayPolls();
            }
            
            console.log("投票已从其他标签页同步");
          } catch (error) {
            console.error("解析同步投票时出错:", error);
          }
        }
      }
    });
    
    console.log("多设备同步支持已添加");
  }
  
  // 应用所有参数
  function applyAllParameters() {
    console.log("应用所有参数...");
    
    // 应用UI参数
    if (window.websiteParameters.ui) {
      for (const paramName in window.websiteParameters.ui) {
        applyUIParameterChange(paramName);
      }
    }
    
    // 应用功能参数
    if (window.websiteParameters.features) {
      for (const paramName in window.websiteParameters.features) {
        applyFeatureParameterChange(paramName);
      }
    }
    
    // 应用系统参数
    if (window.websiteParameters.system) {
      for (const paramName in window.websiteParameters.system) {
        applySystemParameterChange(paramName);
      }
    }
    
    // 应用扩展参数
    if (typeof window.ExpandedParameters !== 'undefined') {
      window.ExpandedParameters.refresh();
    }
    
    console.log("所有参数已应用");
  }
  
  // 在DOM加载完成后初始化
  document.addEventListener('DOMContentLoaded', function() {
    console.log("初始化增强实时反馈机制模块...");
    
    // 延迟初始化，确保其他模块已加载
    setTimeout(function() {
      enhanceRealTimeVotingFeedback();
    }, 1000);
  });
  
  // 导出公共API
  window.EnhancedRealTimeFeedback = {
    showNotification: showNotification,
    getParameterChangeHistory: function() {
      return [...parameterChangeHistory];
    },
    clearParameterChangeHistory: function() {
      parameterChangeHistory = [];
      updateParameterChangeHistoryUI();
    },
    refreshAll: function() {
      if (typeof window.updateRealTimeVotingFeedback === 'function') {
        window.updateRealTimeVotingFeedback();
      }
    }
  };
})();
