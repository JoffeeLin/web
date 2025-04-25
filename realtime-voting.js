// 实时投票反馈机制函数
function updateRealTimeVotingFeedback() {
  console.log("执行实时投票反馈更新...");
  // 遍历所有进行中的参数投票
  const activeParameterPolls = polls.filter(poll => 
    poll.isParameterPoll && 
    new Date(poll.endDate) > new Date() && 
    !poll.executed
  );
  
  console.log(`找到 ${activeParameterPolls.length} 个活跃的参数投票`);
  
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
    
    // 如果没有平局且有投票，应用当前领先的选项
    if (!isTie && winningOption && maxVotes > 0) {
      const category = poll.parameterCategory;
      const paramName = poll.parameterName;
      
      console.log(`投票 "${poll.title}" 中，选项 "${winningOption.text}" 领先，准备应用参数变更`);
      
      // 获取参数对象
      const param = websiteParameters[category][paramName];
      
      // 将选项文本转换为参数值
      const paramValue = getParameterValueFromText(paramName, winningOption.text);
      
      // 如果当前值与领先选项不同，则应用新值
      if (param.current !== paramValue) {
        console.log(`参数 ${paramName} 从 ${param.current} 变更为 ${paramValue}`);
        
        // 更新参数值
        param.current = paramValue;
        
        // 保存参数更改
        saveParameters();
        
        // 应用参数更改
        applyCurrentParameters();
        
        // 显示参数变更通知
        showParameterChangeNotification(paramName, winningOption.text);
      }
    }
  });
}

// 从选项文本获取参数值
function getParameterValueFromText(paramName, optionText) {
  switch (paramName) {
    case 'colorScheme':
      switch (optionText) {
        case '蓝色': return 'blue';
        case '绿色': return 'green';
        case '紫色': return 'purple';
        case '橙色': return 'orange';
        case '深色': return 'dark';
        default: return optionText;
      }
    case 'fontSize':
      switch (optionText) {
        case '小': return 'small';
        case '中': return 'medium';
        case '大': return 'large';
        case '特大': return 'extra-large';
        default: return optionText;
      }
    case 'layout':
      switch (optionText) {
        case '标准': return 'standard';
        case '紧凑': return 'compact';
        case '宽屏': return 'wide';
        case '极简': return 'minimal';
        default: return optionText;
      }
    case 'darkMode':
      if (optionText === '启用') return 'enabled';
      if (optionText === '禁用') return 'disabled';
      if (optionText === '自动（跟随系统）') return 'auto';
      if (optionText === '浅色模式') return 'disabled';
      if (optionText === '深色模式') return 'enabled';
      return optionText;
    case 'liveResults':
    case 'anonymousVoting':
      if (optionText === '启用') return 'enabled';
      if (optionText === '禁用') return 'disabled';
      return optionText;
    case 'autoExecuteDelay':
      if (optionText === '立即') return 'immediate';
      if (optionText === '1小时') return '1hour';
      if (optionText === '1天') return '1day';
      if (optionText === '手动') return 'manual';
      return optionText;
    case 'maxPollsPerUser':
      if (optionText === '无限制') return 'unlimited';
      return optionText;
    case 'defaultPollDuration':
      if (optionText === '1天') return '1day';
      if (optionText === '3天') return '3days';
      if (optionText === '7天') return '7days';
      if (optionText === '14天') return '14days';
      if (optionText === '30天') return '30days';
      return optionText;
    default:
      return optionText;
  }
}

// 保存参数到本地存储
function saveParameters() {
  const parameterData = {};
  
  // 提取当前参数值
  for (const category in websiteParameters) {
    parameterData[category] = {};
    for (const param in websiteParameters[category]) {
      parameterData[category][param] = {
        current: websiteParameters[category][param].current
      };
    }
  }
  
  // 保存到本地存储
  localStorage.setItem('websiteParameters', JSON.stringify(parameterData));
  console.log('参数已保存到本地存储');
}

// 显示参数变更通知
function showParameterChangeNotification(paramName, optionText) {
  // 获取或创建通知容器
  let notificationContainer = document.getElementById('parameter-notification');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'parameter-notification';
    notificationContainer.className = 'parameter-notification';
    document.body.appendChild(notificationContainer);
  }
  
  // 显示通知
  notificationContainer.style.display = 'flex';
  
  // 设置通知内容
  const notificationTitle = document.getElementById('notification-title');
  const notificationMessage = document.getElementById('notification-message');
  
  if (notificationTitle && notificationMessage) {
    notificationTitle.textContent = '参数实时更新';
    notificationMessage.textContent = `${getParameterDisplayName(paramName)}已更新为: ${optionText}`;
  } else {
    // 如果元素不存在，创建完整的通知内容
    notificationContainer.innerHTML = `
      <div class="notification-content">
        <h3>参数实时更新</h3>
        <p>${getParameterDisplayName(paramName)}已更新为: ${optionText}</p>
      </div>
      <button id="close-notification" onclick="closeNotification()">&times;</button>
    `;
  }
  
  // 5秒后自动关闭
  setTimeout(() => {
    closeNotification();
  }, 5000);
  
  console.log(`显示参数变更通知: ${getParameterDisplayName(paramName)}已更新为 ${optionText}`);
}

// 关闭通知
function closeNotification() {
  const notificationContainer = document.getElementById('parameter-notification');
  if (notificationContainer) {
    notificationContainer.style.display = 'none';
  }
}

// 获取参数显示名称
function getParameterDisplayName(paramName) {
  switch (paramName) {
    case 'colorScheme': return '颜色方案';
    case 'fontSize': return '字体大小';
    case 'layout': return '布局方式';
    case 'darkMode': return '暗黑模式';
    case 'liveResults': return '实时结果显示';
    case 'anonymousVoting': return '匿名投票';
    case 'autoExecuteDelay': return '自动执行延迟';
    case 'maxPollsPerUser': return '每用户最大投票数';
    case 'defaultPollDuration': return '默认投票持续时间';
    default: return paramName;
  }
}

// 处理投票提交
function handleVoteSubmission(pollId, optionIndex) {
  console.log(`处理投票提交: 投票ID ${pollId}, 选项索引 ${optionIndex}`);
  
  if (!currentUser && websiteParameters.features.anonymousVoting.current !== 'enabled') {
    alert('请先登录');
    showSection(loginSection);
    return;
  }
  
  const poll = polls.find(p => p.id === pollId);
  if (!poll) {
    console.error('未找到投票');
    return;
  }
  
  // 检查用户是否已投票
  const username = currentUser ? currentUser.username : 'anonymous';
  if (poll.voters.includes(username)) {
    alert('您已经投过票了');
    return;
  }
  
  // 增加选项票数
  poll.options[optionIndex].votes++;
  console.log(`选项 "${poll.options[optionIndex].text}" 票数增加到 ${poll.options[optionIndex].votes}`);
  
  // 添加用户到已投票列表
  poll.voters.push(username);
  
  // 保存投票
  savePolls();
  
  // 更新投票详情
  renderPollDetails(poll);
  
  // 如果是参数投票，立即应用实时反馈
  if (poll.isParameterPoll) {
    console.log('这是参数投票，立即应用实时反馈');
    updateRealTimeVotingFeedback();
  }
  
  alert('投票成功');
}

// 修改初始化函数，添加定时更新
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成，初始化实时投票反馈机制');
    
    // 检查本地存储中的用户信息
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUserInterface();
    }
    
    // 加载保存的网站参数
    loadSavedParameters();
    
    // 应用当前参数设置
    applyCurrentParameters();
    
    // 获取投票列表
    fetchPolls();
    
    // 事件监听器
    setupEventListeners();
    
    // 渲染参数类别
    renderParameterCategories();
    
    // 显示参数通知
    showParameterNotification('欢迎使用参数投票系统', '本网站的所有参数都由用户投票决定，请前往参数设置页面参与投票！');
    
    // 初始应用实时投票反馈
    updateRealTimeVotingFeedback();
    
    // 设置定时更新（每10秒检查一次）
    setInterval(updateRealTimeVotingFeedback, 10000);
    
    console.log('实时投票反馈机制初始化完成');
});

// 添加实时投票状态监控
window.addEventListener('storage', function(e) {
  // 当其他标签页更改了投票数据时，更新当前页面
  if (e.key === 'polls') {
    console.log('检测到投票数据变化，更新实时反馈');
    fetchPolls();
    updateRealTimeVotingFeedback();
  }
});

// 创建参数投票的辅助函数
function createParameterPoll(category, paramName, options, endDate) {
  const poll = {
    id: Date.now().toString(),
    title: `参数投票: ${getParameterDisplayName(paramName)}`,
    description: `为网站的${getParameterDisplayName(paramName)}参数投票，结果将实时应用到网站。`,
    options: options.map(opt => ({ text: opt, votes: 0 })),
    endDate: endDate || getDefaultEndDate(),
    createdBy: currentUser ? currentUser.username : 'system',
    voters: [],
    isParameterPoll: true,
    parameterCategory: category,
    parameterName: paramName,
    executed: false
  };
  
  polls.push(poll);
  savePolls();
  console.log(`创建了新的参数投票: ${poll.title}`);
  return poll;
}

// 获取默认结束日期（7天后）
function getDefaultEndDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().split('T')[0];
}

// 导出函数
window.updateRealTimeVotingFeedback = updateRealTimeVotingFeedback;
window.handleVoteSubmission = handleVoteSubmission;
window.getParameterDisplayName = getParameterDisplayName;
window.createParameterPoll = createParameterPoll;
window.closeNotification = closeNotification;
