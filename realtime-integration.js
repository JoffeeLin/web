// 修改app.js文件，集成实时投票反馈机制

// 导入实时投票反馈机制
document.addEventListener('DOMContentLoaded', () => {
  console.log('初始化实时投票反馈集成');
  
  // 确保脚本加载后执行初始化
  if (typeof updateRealTimeVotingFeedback === 'function') {
    console.log('立即执行实时投票反馈更新');
    updateRealTimeVotingFeedback();
  } else {
    console.warn('实时投票反馈函数未找到，可能尚未加载');
  }
});

// 修改viewPollDetails函数，添加实时投票反馈
const originalViewPollDetails = window.viewPollDetails || function() {};
window.viewPollDetails = function(pollId) {
  // 调用原始函数
  originalViewPollDetails(pollId);
  
  // 获取投票对象
  const poll = polls.find(p => p.id === pollId);
  
  // 如果是参数投票，添加实时反馈说明
  if (poll && poll.isParameterPoll) {
    const pollInfoContainer = document.getElementById('poll-info-container');
    if (pollInfoContainer) {
      // 检查是否已经添加了实时信息
      if (!pollInfoContainer.querySelector('.realtime-info')) {
        const realtimeInfo = document.createElement('div');
        realtimeInfo.className = 'realtime-info';
        realtimeInfo.innerHTML = `
          <p><strong>实时参数反馈：</strong>此投票结果将实时应用到网站。当某个选项的票数领先时，对应的参数设置将立即生效。</p>
        `;
        pollInfoContainer.appendChild(realtimeInfo);
      }
    }
  }
};

// 修改handleVoteSubmission函数，集成实时投票反馈
const originalHandleVoteSubmission = window.handleVoteSubmission || function() {};
window.handleVoteSubmission = function(pollId, optionIndex) {
  console.log(`集成的投票提交处理: 投票ID ${pollId}, 选项索引 ${optionIndex}`);
  
  // 调用原始函数
  originalHandleVoteSubmission(pollId, optionIndex);
  
  // 获取投票对象
  const poll = polls.find(p => p.id === pollId);
  
  // 如果是参数投票，立即应用实时反馈
  if (poll && poll.isParameterPoll && typeof updateRealTimeVotingFeedback === 'function') {
    console.log('立即应用实时反馈');
    updateRealTimeVotingFeedback();
  }
};

// 修改executeParameterPollResult函数，使用实时投票反馈机制
window.executeParameterPollResult = function(pollId) {
  console.log(`执行参数投票结果: 投票ID ${pollId}`);
  
  const poll = polls.find(p => p.id === pollId);
  if (!poll || !poll.isParameterPoll) {
    console.warn('未找到有效的参数投票');
    return;
  }
  
  // 找出得票最高的选项
  let maxVotes = -1;
  let winningOption = null;
  let isTie = false;
  
  poll.options.forEach(option => {
    if (option.votes > maxVotes) {
      maxVotes = option.votes;
      winningOption = option;
      isTie = false;
    } else if (option.votes === maxVotes && maxVotes > 0) {
      isTie = true;
    }
  });
  
  if (isTie) {
    alert('投票结果为平局，无法执行');
    return;
  }
  
  if (!winningOption) {
    alert('没有有效的投票结果');
    return;
  }
  
  // 获取参数信息
  const category = poll.parameterCategory;
  const paramName = poll.parameterName;
  
  // 获取参数对象
  const param = websiteParameters[category][paramName];
  
  // 将选项文本转换为参数值
  const paramValue = getParameterValueFromText(paramName, winningOption.text);
  
  console.log(`执行参数变更: ${paramName} 设置为 ${paramValue}`);
  
  // 更新参数值
  param.current = paramValue;
  
  // 保存参数更改
  saveParameters();
  
  // 应用参数更改
  applyCurrentParameters();
  
  // 标记投票为已执行
  poll.executed = true;
  savePolls();
  
  // 更新投票详情
  renderPollDetails(poll);
  
  // 显示参数变更通知
  showParameterChangeNotification(paramName, winningOption.text);
  
  alert(`投票结果已执行：${getParameterDisplayName(paramName)}已设置为${winningOption.text}`);
};

// 添加实时投票状态显示
function updatePollRealTimeStatus(poll) {
  if (!poll.isParameterPoll) return;
  
  // 找出当前得票最高的选项
  let maxVotes = -1;
  let leadingOption = null;
  let isTie = false;
  
  poll.options.forEach(option => {
    if (option.votes > maxVotes) {
      maxVotes = option.votes;
      leadingOption = option;
      isTie = false;
    } else if (option.votes === maxVotes && maxVotes > 0) {
      isTie = true;
    }
  });
  
  // 更新投票卡片显示
  const pollCard = document.querySelector(`.poll-card[data-poll-id="${poll.id}"]`);
  if (pollCard) {
    let statusElement = pollCard.querySelector('.realtime-status');
    if (!statusElement) {
      statusElement = document.createElement('div');
      statusElement.className = 'realtime-status';
      pollCard.appendChild(statusElement);
    }
    
    if (isTie) {
      statusElement.textContent = '当前状态：平局，参数未变更';
      statusElement.className = 'realtime-status tie';
    } else if (leadingOption) {
      statusElement.textContent = `当前领先：${leadingOption.text}（实时生效中）`;
      statusElement.className = 'realtime-status leading';
    } else {
      statusElement.textContent = '暂无投票';
      statusElement.className = 'realtime-status';
    }
  }
}

// 修改renderPolls函数，添加实时状态显示
const originalRenderPolls = window.renderPolls || function() {};
window.renderPolls = function() {
  console.log('渲染投票列表，添加实时状态显示');
  
  // 调用原始函数
  originalRenderPolls();
  
  // 为每个参数投票添加实时状态
  polls.forEach(poll => {
    if (poll.isParameterPoll) {
      updatePollRealTimeStatus(poll);
    }
  });
};

// 添加CSS样式
function addRealtimeStyles() {
  console.log('添加实时投票反馈样式');
  
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .realtime-info {
      margin: 15px 0;
      padding: 10px;
      background-color: #e3f2fd;
      border-left: 4px solid #2196f3;
      border-radius: 4px;
    }
    
    .realtime-status {
      margin-top: 10px;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: bold;
    }
    
    .realtime-status.leading {
      background-color: rgba(76, 175, 80, 0.1);
      color: #388e3c;
      animation: pulse 2s infinite;
    }
    
    .realtime-status.tie {
      background-color: rgba(255, 152, 0, 0.1);
      color: #f57c00;
    }
    
    .parameter-notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      padding: 15px;
      max-width: 350px;
      z-index: 1000;
      display: flex;
      animation: slideIn 0.5s ease-in-out;
    }
    
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.8; }
      100% { opacity: 1; }
    }
    
    .dark-mode .parameter-notification {
      background-color: #333;
      color: white;
    }
    
    .notification-content {
      flex-grow: 1;
    }
    
    .notification-content h3 {
      margin-bottom: 5px;
      color: var(--primary-color);
    }
    
    #close-notification {
      background: none;
      color: #999;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0 5px;
      align-self: flex-start;
    }
    
    #close-notification:hover {
      color: var(--error-color);
      background: none;
    }
  `;
  document.head.appendChild(styleElement);
}

// 在DOM加载完成后添加样式
document.addEventListener('DOMContentLoaded', addRealtimeStyles);

// 创建浅色/深色模式切换投票
function createDarkModeTogglePoll() {
  console.log('创建浅色/深色模式切换投票');
  
  // 检查是否已存在相关投票
  const existingPoll = polls.find(p => 
    p.isParameterPoll && 
    p.parameterCategory === 'features' && 
    p.parameterName === 'darkMode' &&
    new Date(p.endDate) > new Date()
  );
  
  if (existingPoll) {
    console.log('已存在浅色/深色模式投票，不重复创建');
    return;
  }
  
  // 创建新投票
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7); // 7天后结束
  
  const poll = {
    id: Date.now().toString(),
    title: '网站模式选择',
    description: '请为网站选择浅色模式或深色模式，投票结果将实时应用到网站。',
    options: [
      { text: '浅色模式', votes: 0 },
      { text: '深色模式', votes: 0 }
    ],
    endDate: endDate.toISOString().split('T')[0],
    createdBy: 'system',
    voters: [],
    isParameterPoll: true,
    parameterCategory: 'features',
    parameterName: 'darkMode',
    executed: false
  };
  
  polls.push(poll);
  savePolls();
  console.log('成功创建浅色/深色模式切换投票');
}

// 在页面加载时创建浅色/深色模式切换投票
document.addEventListener('DOMContentLoaded', () => {
  // 延迟执行，确保polls数组已加载
  setTimeout(createDarkModeTogglePoll, 1000);
});
