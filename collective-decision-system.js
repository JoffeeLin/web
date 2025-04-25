/**
 * 集体决策系统模块
 * 为网站添加更完善的集体决策功能
 */

(function() {
  'use strict';
  
  // 配置
  const config = {
    // 是否启用投票权重系统
    enableVotingWeights: true,
    // 是否启用提案系统
    enableProposalSystem: true,
    // 是否启用共识算法选项
    enableConsensusAlgorithms: true,
    // 默认共识算法
    defaultConsensusAlgorithm: 'majority'
  };
  
  // 投票权重系统配置
  const weightSystemConfig = {
    // 当前权重系统
    current: 'equal',
    // 可用权重系统
    options: ['equal', 'activity', 'contribution', 'reputation', 'quadratic'],
    // 权重系统描述
    descriptions: {
      equal: '所有用户投票权重相等',
      activity: '基于用户活跃度的权重',
      contribution: '基于用户贡献的权重',
      reputation: '基于用户声誉的权重',
      quadratic: '二次方投票权重'
    }
  };
  
  // 共识算法配置
  const consensusAlgorithmConfig = {
    // 当前共识算法
    current: 'majority',
    // 可用共识算法
    options: ['majority', 'supermajority', 'consensus', 'ranked', 'quadratic'],
    // 共识算法描述
    descriptions: {
      majority: '简单多数决（超过50%）',
      supermajority: '绝对多数决（超过66.7%）',
      consensus: '共识决策（超过80%）',
      ranked: '排序选择投票',
      quadratic: '二次方投票'
    }
  };
  
  // 用户声誉数据
  let userReputationData = {};
  
  // 用户活跃度数据
  let userActivityData = {};
  
  // 用户贡献数据
  let userContributionData = {};
  
  // 提案数据
  let proposalData = [];
  
  // 初始化集体决策系统
  function initCollectiveDecisionSystem() {
    console.log("初始化集体决策系统...");
    
    // 加载保存的配置
    loadSavedConfig();
    
    // 加载用户数据
    loadUserData();
    
    // 加载提案数据
    loadProposalData();
    
    // 初始化投票权重系统
    if (config.enableVotingWeights) {
      initVotingWeightSystem();
    }
    
    // 初始化提案系统
    if (config.enableProposalSystem) {
      initProposalSystem();
    }
    
    // 初始化共识算法选项
    if (config.enableConsensusAlgorithms) {
      initConsensusAlgorithms();
    }
    
    // 增强投票处理
    enhanceVotingProcess();
    
    console.log("集体决策系统初始化完成");
  }
  
  // 加载保存的配置
  function loadSavedConfig() {
    const savedConfig = localStorage.getItem('collectiveDecisionConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        
        // 更新配置
        if (parsedConfig.weightSystemConfig) {
          weightSystemConfig.current = parsedConfig.weightSystemConfig.current;
        }
        
        if (parsedConfig.consensusAlgorithmConfig) {
          consensusAlgorithmConfig.current = parsedConfig.consensusAlgorithmConfig.current;
        }
        
        console.log("已加载保存的集体决策系统配置");
      } catch (error) {
        console.error("解析保存的配置时出错:", error);
      }
    }
  }
  
  // 保存配置
  function saveConfig() {
    const configToSave = {
      weightSystemConfig: {
        current: weightSystemConfig.current
      },
      consensusAlgorithmConfig: {
        current: consensusAlgorithmConfig.current
      }
    };
    
    localStorage.setItem('collectiveDecisionConfig', JSON.stringify(configToSave));
    console.log("集体决策系统配置已保存");
  }
  
  // 加载用户数据
  function loadUserData() {
    // 加载用户声誉数据
    const savedReputationData = localStorage.getItem('userReputationData');
    if (savedReputationData) {
      try {
        userReputationData = JSON.parse(savedReputationData);
        console.log("已加载用户声誉数据");
      } catch (error) {
        console.error("解析用户声誉数据时出错:", error);
      }
    }
    
    // 加载用户活跃度数据
    const savedActivityData = localStorage.getItem('userActivityData');
    if (savedActivityData) {
      try {
        userActivityData = JSON.parse(savedActivityData);
        console.log("已加载用户活跃度数据");
      } catch (error) {
        console.error("解析用户活跃度数据时出错:", error);
      }
    }
    
    // 加载用户贡献数据
    const savedContributionData = localStorage.getItem('userContributionData');
    if (savedContributionData) {
      try {
        userContributionData = JSON.parse(savedContributionData);
        console.log("已加载用户贡献数据");
      } catch (error) {
        console.error("解析用户贡献数据时出错:", error);
      }
    }
  }
  
  // 保存用户数据
  function saveUserData() {
    // 保存用户声誉数据
    localStorage.setItem('userReputationData', JSON.stringify(userReputationData));
    
    // 保存用户活跃度数据
    localStorage.setItem('userActivityData', JSON.stringify(userActivityData));
    
    // 保存用户贡献数据
    localStorage.setItem('userContributionData', JSON.stringify(userContributionData));
    
    console.log("用户数据已保存");
  }
  
  // 加载提案数据
  function loadProposalData() {
    const savedProposalData = localStorage.getItem('proposalData');
    if (savedProposalData) {
      try {
        proposalData = JSON.parse(savedProposalData);
        console.log("已加载提案数据");
      } catch (error) {
        console.error("解析提案数据时出错:", error);
      }
    }
  }
  
  // 保存提案数据
  function saveProposalData() {
    localStorage.setItem('proposalData', JSON.stringify(proposalData));
    console.log("提案数据已保存");
  }
  
  // 初始化投票权重系统
  function initVotingWeightSystem() {
    console.log("初始化投票权重系统...");
    
    // 创建投票权重系统投票
    createVotingWeightSystemPoll();
    
    // 创建投票权重系统UI
    createVotingWeightSystemUI();
    
    // 更新用户声誉
    updateUserReputation();
    
    // 更新用户活跃度
    updateUserActivity();
    
    // 更新用户贡献
    updateUserContribution();
    
    console.log("投票权重系统初始化完成");
  }
  
  // 创建投票权重系统投票
  function createVotingWeightSystemPoll() {
    // 检查是否有createParameterPoll函数
    if (typeof window.createParameterPoll !== 'function') {
      console.warn("createParameterPoll函数不存在，无法创建投票权重系统投票");
      return;
    }
    
    // 创建投票权重系统参数类别（如果不存在）
    if (!window.websiteParameters.voting_system) {
      window.websiteParameters.voting_system = {
        weightSystem: {
          current: weightSystemConfig.current,
          options: weightSystemConfig.options,
          description: '投票权重系统'
        }
      };
    }
    
    // 创建投票权重系统投票
    window.createParameterPoll('voting_system', 'weightSystem', ['平等权重', '活跃度权重', '贡献权重', '声誉权重', '二次方投票'], null);
    
    console.log("投票权重系统投票已创建");
  }
  
  // 创建投票权重系统UI
  function createVotingWeightSystemUI() {
    console.log("创建投票权重系统UI...");
    
    // 检查是否已存在投票权重面板
    if (document.getElementById('voting-weight-panel')) {
      console.log("投票权重系统UI已存在");
      return;
    }
    
    // 创建投票权重面板
    const weightPanel = document.createElement('div');
    weightPanel.id = 'voting-weight-panel';
    weightPanel.className = 'voting-weight-panel';
    weightPanel.innerHTML = `
      <div class="weight-panel-header">
        <h3>投票权重系统</h3>
        <button id="close-weight-panel" class="close-button">×</button>
      </div>
      <div class="weight-panel-content">
        <div class="current-weight-system">
          <h4>当前权重系统</h4>
          <div id="current-weight-system-value" class="current-weight-system-value">
            ${weightSystemConfig.descriptions[weightSystemConfig.current]}
          </div>
        </div>
        <div class="user-weight-info">
          <h4>您的投票权重</h4>
          <div id="user-weight-value" class="user-weight-value">
            计算中...
          </div>
        </div>
        <div class="weight-system-description">
          <h4>权重系统说明</h4>
          <ul class="weight-system-list">
            <li><strong>平等权重</strong>: 所有用户投票权重相等，每票权重为1。</li>
            <li><strong>活跃度权重</strong>: 基于用户活跃度的权重，活跃度越高权重越大。</li>
            <li><strong>贡献权重</strong>: 基于用户贡献的权重，贡献越多权重越大。</li>
            <li><strong>声誉权重</strong>: 基于用户声誉的权重，声誉越高权重越大。</li>
            <li><strong>二次方投票</strong>: 投票成本随投票数量的平方增加，防止财富集中。</li>
          </ul>
        </div>
      </div>
    `;
    
    // 添加到文档
    document.body.appendChild(weightPanel);
    
    // 添加关闭按钮事件
    document.getElementById('close-weight-panel').addEventListener('click', function() {
      weightPanel.classList.remove('active');
    });
    
    // 创建投票权重按钮
    const weightButton = document.createElement('button');
    weightButton.id = 'show-weight-button';
    weightButton.className = 'show-weight-button';
    weightButton.innerHTML = '<span class="weight-icon">⚖️</span> 投票权重';
    
    // 添加到文档
    document.body.appendChild(weightButton);
    
    // 添加按钮事件
    weightButton.addEventListener('click', function() {
      weightPanel.classList.toggle('active');
      updateUserWeightDisplay();
    });
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .voting-weight-panel {
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
      
      .voting-weight-panel.active {
        display: flex;
      }
      
      .weight-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid #eee;
      }
      
      .weight-panel-header h3 {
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
      
      .weight-panel-content {
        padding: 15px;
        overflow-y: auto;
      }
      
      .current-weight-system,
      .user-weight-info,
      .weight-system-description {
        margin-bottom: 20px;
      }
      
      .current-weight-system h4,
      .user-weight-info h4,
      .weight-system-description h4 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 16px;
      }
      
      .current-weight-system-value,
      .user-weight-value {
        padding: 10px;
        background-color: #f5f5f5;
        border-radius: 4px;
        font-weight: bold;
      }
      
      .weight-system-list {
        padding-left: 20px;
        margin: 0;
      }
      
      .weight-system-list li {
        margin-bottom: 8px;
      }
      
      .show-weight-button {
        position: fixed;
        bottom: 70px;
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
      
      .weight-icon {
        margin-right: 5px;
        font-size: 16px;
      }
      
      .dark-mode .voting-weight-panel {
        background-color: #333;
        color: white;
      }
      
      .dark-mode .weight-panel-header {
        border-bottom-color: #444;
      }
      
      .dark-mode .close-button {
        color: #ccc;
      }
      
      .dark-mode .current-weight-system-value,
      .dark-mode .user-weight-value {
        background-color: #444;
      }
    `;
    
    document.head.appendChild(style);
    
    console.log("投票权重系统UI创建完成");
  }
  
  // 更新用户权重显示
  function updateUserWeightDisplay() {
    const userWeightValue = document.getElementById('user-weight-value');
    if (!userWeightValue) return;
    
    // 获取当前用户
    const currentUser = window.currentUser;
    if (!currentUser) {
      userWeightValue.textContent = '请先登录';
      return;
    }
    
    // 计算用户权重
    const weight = calculateUserWeight(currentUser);
    
    // 显示用户权重
    userWeightValue.textContent = `${weight.toFixed(2)} (${getWeightLevelDescription(weight)})`;
  }
  
  // 获取权重级别描述
  function getWeightLevelDescription(weight) {
    if (weight < 0.5) return '较低';
    if (weight < 0.9) return '略低';
    if (weight < 1.1) return '标准';
    if (weight < 1.5) return '略高';
    if (weight < 2) return '较高';
    return '很高';
  }
  
  // 更新用户声誉
  function updateUserReputation() {
    // 获取当前用户
    const currentUser = window.currentUser;
    if (!currentUser) return;
    
    // 初始化用户声誉（如果不存在）
    if (!userReputationData[currentUser]) {
      userReputationData[currentUser] = {
        value: 1.0,
        history: [],
        lastUpdate: Date.now()
      };
    }
    
    // 获取用户投票历史
    const userVotes = getUserVotingHistory(currentUser);
    
    // 获取用户提案历史
    const userProposals = getUserProposalHistory(currentUser);
    
    // 计算声誉增量
    let reputationDelta = 0;
    
    // 基于投票历史计算声誉
    if (userVotes.length > 0) {
      // 计算用户投票与最终结果的一致性
      const consistencyRate = calculateVotingConsistency(userVotes);
      
      // 基于一致性调整声誉
      reputationDelta += (consistencyRate - 0.5) * 0.1;
    }
    
    // 基于提案历史计算声誉
    if (userProposals.length > 0) {
      // 计算用户提案的接受率
      const acceptanceRate = calculateProposalAcceptance(userProposals);
      
      // 基于接受率调整声誉
      reputationDelta += acceptanceRate * 0.2;
    }
    
    // 更新用户声誉
    const userData = userReputationData[currentUser];
    userData.value = Math.max(0.1, Math.min(3.0, userData.value + reputationDelta));
    
    // 记录声誉变化
    userData.history.push({
      timestamp: Date.now(),
      delta: reputationDelta,
      value: userData.value
    });
    
    // 限制历史记录数量
    if (userData.history.length > 20) {
      userData.history.shift();
    }
    
    // 更新最后更新时间
    userData.lastUpdate = Date.now();
    
    // 保存用户数据
    saveUserData();
    
    console.log(`用户 ${currentUser} 声誉已更新: ${userData.value.toFixed(2)}`);
  }
  
  // 更新用户活跃度
  function updateUserActivity() {
    // 获取当前用户
    const currentUser = window.currentUser;
    if (!currentUser) return;
    
    // 初始化用户活跃度（如果不存在）
    if (!userActivityData[currentUser]) {
      userActivityData[currentUser] = {
        value: 1.0,
        lastLogin: Date.now(),
        loginCount: 1,
        voteCount: 0,
        commentCount: 0,
        lastUpdate: Date.now()
      };
    }
    
    // 获取用户数据
    const userData = userActivityData[currentUser];
    
    // 更新登录次数
    userData.loginCount++;
    
    // 更新最后登录时间
    userData.lastLogin = Date.now();
    
    // 获取用户投票次数
    const userVotes = getUserVotingHistory(currentUser);
    userData.voteCount = userVotes.length;
    
    // 计算活跃度
    // 基础活跃度为1.0
    let activityValue = 1.0;
    
    // 根据登录频率调整
    const daysSinceLastLogin = (Date.now() - userData.lastLogin) / (1000 * 60 * 60 * 24);
    if (daysSinceLastLogin < 1) {
      activityValue += 0.5; // 每天登录奖励
    } else if (daysSinceLastLogin < 3) {
      activityValue += 0.2; // 最近3天内登录奖励
    }
    
    // 根据投票次数调整
    if (userData.voteCount > 0) {
      activityValue += Math.min(1.0, userData.voteCount / 10); // 最多增加1.0
    }
    
    // 更新用户活跃度
    userData.value = Math.max(0.1, Math.min(3.0, activityValue));
    
    // 更新最后更新时间
    userData.lastUpdate = Date.now();
    
    // 保存用户数据
    saveUserData();
    
    console.log(`用户 ${currentUser} 活跃度已更新: ${userData.value.toFixed(2)}`);
  }
  
  // 更新用户贡献
  function updateUserContribution() {
    // 获取当前用户
    const currentUser = window.currentUser;
    if (!currentUser) return;
    
    // 初始化用户贡献（如果不存在）
    if (!userContributionData[currentUser]) {
      userContributionData[currentUser] = {
        value: 1.0,
        proposalCount: 0,
        acceptedProposalCount: 0,
        commentCount: 0,
        helpfulCommentCount: 0,
        lastUpdate: Date.now()
      };
    }
    
    // 获取用户数据
    const userData = userContributionData[currentUser];
    
    // 获取用户提案历史
    const userProposals = getUserProposalHistory(currentUser);
    userData.proposalCount = userProposals.length;
    
    // 计算接受的提案数量
    userData.acceptedProposalCount = userProposals.filter(proposal => proposal.status === 'accepted').length;
    
    // 计算贡献值
    // 基础贡献为1.0
    let contributionValue = 1.0;
    
    // 根据提案数量调整
    if (userData.proposalCount > 0) {
      contributionValue += Math.min(0.5, userData.proposalCount / 5); // 最多增加0.5
    }
    
    // 根据接受的提案数量调整
    if (userData.acceptedProposalCount > 0) {
      contributionValue += userData.acceptedProposalCount * 0.2; // 每个接受的提案增加0.2
    }
    
    // 更新用户贡献
    userData.value = Math.max(0.1, Math.min(3.0, contributionValue));
    
    // 更新最后更新时间
    userData.lastUpdate = Date.now();
    
    // 保存用户数据
    saveUserData();
    
    console.log(`用户 ${currentUser} 贡献已更新: ${userData.value.toFixed(2)}`);
  }
  
  // 获取用户投票历史
  function getUserVotingHistory(username) {
    // 如果没有polls数组，返回空数组
    if (!window.polls) return [];
    
    // 收集用户的所有投票
    const userVotes = [];
    
    // 遍历所有投票
    window.polls.forEach(poll => {
      // 检查投票记录
      if (poll.votes && poll.votes[username]) {
        userVotes.push({
          pollId: poll.id,
          pollTitle: poll.title,
          optionId: poll.votes[username],
          timestamp: poll.voteTimestamps ? poll.voteTimestamps[username] : Date.now(),
          isWinningOption: isWinningOption(poll, poll.votes[username])
        });
      }
    });
    
    return userVotes;
  }
  
  // 检查是否是获胜选项
  function isWinningOption(poll, optionId) {
    // 如果投票已结束且已执行
    if (poll.executed) {
      return poll.winningOptionId === optionId;
    }
    
    // 如果投票未结束，检查当前领先选项
    const options = poll.options;
    let maxVotes = -1;
    let winningOptionId = null;
    
    options.forEach(option => {
      if (option.votes > maxVotes) {
        maxVotes = option.votes;
        winningOptionId = option.id;
      }
    });
    
    return winningOptionId === optionId;
  }
  
  // 计算投票一致性
  function calculateVotingConsistency(userVotes) {
    if (userVotes.length === 0) return 0.5;
    
    // 计算用户投票与最终结果一致的次数
    const consistentVotes = userVotes.filter(vote => vote.isWinningOption).length;
    
    // 计算一致率
    return consistentVotes / userVotes.length;
  }
  
  // 获取用户提案历史
  function getUserProposalHistory(username) {
    return proposalData.filter(proposal => proposal.creator === username);
  }
  
  // 计算提案接受率
  function calculateProposalAcceptance(userProposals) {
    if (userProposals.length === 0) return 0;
    
    // 计算接受的提案数量
    const acceptedProposals = userProposals.filter(proposal => proposal.status === 'accepted').length;
    
    // 计算接受率
    return acceptedProposals / userProposals.length;
  }
  
  // 计算用户权重
  function calculateUserWeight(username) {
    // 如果用户不存在，返回默认权重
    if (!username) return 1.0;
    
    // 根据当前权重系统计算
    switch (weightSystemConfig.current) {
      case 'equal':
        return 1.0;
      case 'activity':
        return userActivityData[username] ? userActivityData[username].value : 1.0;
      case 'contribution':
        return userContributionData[username] ? userContributionData[username].value : 1.0;
      case 'reputation':
        return userReputationData[username] ? userReputationData[username].value : 1.0;
      case 'quadratic':
        // 二次方投票不使用预先计算的权重，而是在投票时计算
        return 1.0;
      default:
        return 1.0;
    }
  }
  
  // 初始化提案系统
  function initProposalSystem() {
    console.log("初始化提案系统...");
    
    // 创建提案系统UI
    createProposalSystemUI();
    
    console.log("提案系统初始化完成");
  }
  
  // 创建提案系统UI
  function createProposalSystemUI() {
    console.log("创建提案系统UI...");
    
    // 检查是否已存在提案面板
    if (document.getElementById('proposal-panel')) {
      console.log("提案系统UI已存在");
      return;
    }
    
    // 创建提案面板
    const proposalPanel = document.createElement('div');
    proposalPanel.id = 'proposal-panel';
    proposalPanel.className = 'proposal-panel';
    proposalPanel.innerHTML = `
      <div class="proposal-panel-header">
        <h3>参数提案系统</h3>
        <button id="close-proposal-panel" class="close-button">×</button>
      </div>
      <div class="proposal-panel-content">
        <div class="proposal-form">
          <h4>创建新提案</h4>
          <form id="new-proposal-form">
            <div class="form-group">
              <label for="proposal-title">提案标题</label>
              <input type="text" id="proposal-title" name="proposal-title" required>
            </div>
            <div class="form-group">
              <label for="proposal-category">参数类别</label>
              <select id="proposal-category" name="proposal-category" required>
                <option value="">-- 选择参数类别 --</option>
                <option value="ui">界面参数</option>
                <option value="features">功能参数</option>
                <option value="system">系统参数</option>
                <option value="ui_details">UI细节参数</option>
                <option value="content_display">内容展示参数</option>
                <option value="performance">性能相关参数</option>
                <option value="accessibility">辅助功能参数</option>
                <option value="interaction">交互参数</option>
                <option value="new">新参数类别</option>
              </select>
            </div>
            <div class="form-group" id="new-category-group" style="display: none;">
              <label for="new-category-name">新类别名称</label>
              <input type="text" id="new-category-name" name="new-category-name">
            </div>
            <div class="form-group">
              <label for="proposal-param">参数名称</label>
              <select id="proposal-param" name="proposal-param" required>
                <option value="">-- 先选择参数类别 --</option>
              </select>
            </div>
            <div class="form-group" id="new-param-group" style="display: none;">
              <label for="new-param-name">新参数名称</label>
              <input type="text" id="new-param-name" name="new-param-name">
            </div>
            <div class="form-group">
              <label for="proposal-description">提案描述</label>
              <textarea id="proposal-description" name="proposal-description" rows="4" required></textarea>
            </div>
            <div class="form-group">
              <label for="proposal-options">选项（每行一个）</label>
              <textarea id="proposal-options" name="proposal-options" rows="4" required></textarea>
            </div>
            <div class="form-group">
              <button type="submit" class="submit-proposal-btn">提交提案</button>
            </div>
          </form>
        </div>
        <div class="proposals-list">
          <h4>当前提案</h4>
          <div id="proposals-container" class="proposals-container">
            <p>加载中...</p>
          </div>
        </div>
      </div>
    `;
    
    // 添加到文档
    document.body.appendChild(proposalPanel);
    
    // 添加关闭按钮事件
    document.getElementById('close-proposal-panel').addEventListener('click', function() {
      proposalPanel.classList.remove('active');
    });
    
    // 创建提案按钮
    const proposalButton = document.createElement('button');
    proposalButton.id = 'show-proposal-button';
    proposalButton.className = 'show-proposal-button';
    proposalButton.innerHTML = '<span class="proposal-icon">💡</span> 参数提案';
    
    // 添加到文档
    document.body.appendChild(proposalButton);
    
    // 添加按钮事件
    proposalButton.addEventListener('click', function() {
      proposalPanel.classList.toggle('active');
      loadProposalsList();
      updateParameterDropdown();
    });
    
    // 添加参数类别变更事件
    document.getElementById('proposal-category').addEventListener('change', function() {
      updateParameterDropdown();
      
      // 显示/隐藏新类别输入框
      const newCategoryGroup = document.getElementById('new-category-group');
      if (this.value === 'new') {
        newCategoryGroup.style.display = 'block';
      } else {
        newCategoryGroup.style.display = 'none';
      }
    });
    
    // 添加参数变更事件
    document.getElementById('proposal-param').addEventListener('change', function() {
      // 显示/隐藏新参数输入框
      const newParamGroup = document.getElementById('new-param-group');
      if (this.value === 'new') {
        newParamGroup.style.display = 'block';
      } else {
        newParamGroup.style.display = 'none';
      }
    });
    
    // 添加提案表单提交事件
    document.getElementById('new-proposal-form').addEventListener('submit', function(e) {
      e.preventDefault();
      submitProposal();
    });
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .proposal-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 800px;
        height: 90vh;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: none;
        flex-direction: column;
        overflow: hidden;
      }
      
      .proposal-panel.active {
        display: flex;
      }
      
      .proposal-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid #eee;
      }
      
      .proposal-panel-header h3 {
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
      
      .proposal-panel-content {
        padding: 15px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      
      .proposal-form h4,
      .proposals-list h4 {
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 16px;
      }
      
      .form-group {
        margin-bottom: 15px;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }
      
      .form-group input,
      .form-group select,
      .form-group textarea {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      
      .submit-proposal-btn {
        background-color: var(--primary-color, #4a90e2);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 10px 15px;
        cursor: pointer;
      }
      
      .proposals-container {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      
      .proposal-item {
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 15px;
      }
      
      .proposal-item-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      
      .proposal-item-title {
        font-weight: bold;
        font-size: 16px;
      }
      
      .proposal-item-status {
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 12px;
      }
      
      .status-pending {
        background-color: #f0f0f0;
        color: #666;
      }
      
      .status-voting {
        background-color: #e3f2fd;
        color: #1976d2;
      }
      
      .status-accepted {
        background-color: #e8f5e9;
        color: #388e3c;
      }
      
      .status-rejected {
        background-color: #ffebee;
        color: #d32f2f;
      }
      
      .proposal-item-details {
        margin-bottom: 10px;
        font-size: 14px;
      }
      
      .proposal-item-creator {
        font-size: 12px;
        color: #666;
        margin-bottom: 10px;
      }
      
      .proposal-item-actions {
        display: flex;
        gap: 10px;
      }
      
      .proposal-action-btn {
        padding: 5px 10px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        font-size: 12px;
      }
      
      .vote-btn {
        background-color: var(--primary-color, #4a90e2);
        color: white;
      }
      
      .approve-btn {
        background-color: var(--success-color, #4caf50);
        color: white;
      }
      
      .reject-btn {
        background-color: var(--error-color, #f44336);
        color: white;
      }
      
      .show-proposal-button {
        position: fixed;
        bottom: 120px;
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
      
      .proposal-icon {
        margin-right: 5px;
        font-size: 16px;
      }
      
      .dark-mode .proposal-panel {
        background-color: #333;
        color: white;
      }
      
      .dark-mode .proposal-panel-header {
        border-bottom-color: #444;
      }
      
      .dark-mode .close-button {
        color: #ccc;
      }
      
      .dark-mode .form-group input,
      .dark-mode .form-group select,
      .dark-mode .form-group textarea {
        background-color: #444;
        border-color: #555;
        color: white;
      }
      
      .dark-mode .proposal-item {
        border-color: #444;
      }
      
      .dark-mode .status-pending {
        background-color: #444;
        color: #ccc;
      }
      
      .dark-mode .proposal-item-creator {
        color: #ccc;
      }
    `;
    
    document.head.appendChild(style);
    
    console.log("提案系统UI创建完成");
  }
  
  // 更新参数下拉列表
  function updateParameterDropdown() {
    const categorySelect = document.getElementById('proposal-category');
    const paramSelect = document.getElementById('proposal-param');
    
    if (!categorySelect || !paramSelect) return;
    
    // 获取选中的类别
    const selectedCategory = categorySelect.value;
    
    // 清空参数下拉列表
    paramSelect.innerHTML = '';
    
    // 如果未选择类别或选择了新类别
    if (!selectedCategory || selectedCategory === 'new') {
      paramSelect.innerHTML = '<option value="">-- 先选择参数类别 --</option>';
      return;
    }
    
    // 添加"新参数"选项
    paramSelect.innerHTML = '<option value="">-- 选择参数 --</option><option value="new">新参数</option>';
    
    // 获取类别下的参数
    const categoryParams = window.websiteParameters[selectedCategory];
    if (categoryParams) {
      // 添加参数选项
      for (const paramName in categoryParams) {
        const option = document.createElement('option');
        option.value = paramName;
        option.textContent = window.getParameterDisplayName ? window.getParameterDisplayName(paramName) : paramName;
        paramSelect.appendChild(option);
      }
    }
  }
  
  // 提交提案
  function submitProposal() {
    console.log("提交提案...");
    
    // 获取当前用户
    const currentUser = window.currentUser;
    if (!currentUser) {
      alert('请先登录');
      return;
    }
    
    // 获取表单数据
    const title = document.getElementById('proposal-title').value;
    const category = document.getElementById('proposal-category').value;
    const param = document.getElementById('proposal-param').value;
    const description = document.getElementById('proposal-description').value;
    const optionsText = document.getElementById('proposal-options').value;
    
    // 处理新类别
    let finalCategory = category;
    if (category === 'new') {
      finalCategory = document.getElementById('new-category-name').value;
      if (!finalCategory) {
        alert('请输入新类别名称');
        return;
      }
    }
    
    // 处理新参数
    let finalParam = param;
    if (param === 'new') {
      finalParam = document.getElementById('new-param-name').value;
      if (!finalParam) {
        alert('请输入新参数名称');
        return;
      }
    }
    
    // 解析选项
    const options = optionsText.split('\n')
      .map(option => option.trim())
      .filter(option => option.length > 0);
    
    if (options.length < 2) {
      alert('请至少提供两个选项');
      return;
    }
    
    // 创建提案
    const proposal = {
      id: Date.now().toString(),
      title: title,
      category: finalCategory,
      param: finalParam,
      description: description,
      options: options,
      creator: currentUser,
      createdAt: Date.now(),
      status: 'pending',
      votes: {},
      approvals: 0,
      rejections: 0,
      minApprovals: 3 // 需要至少3个批准才能进入投票阶段
    };
    
    // 添加到提案数据
    proposalData.push(proposal);
    
    // 保存提案数据
    saveProposalData();
    
    // 更新提案列表
    loadProposalsList();
    
    // 重置表单
    document.getElementById('new-proposal-form').reset();
    
    // 显示成功消息
    if (typeof window.EnhancedRealTimeFeedback !== 'undefined' && typeof window.EnhancedRealTimeFeedback.showNotification === 'function') {
      window.EnhancedRealTimeFeedback.showNotification('提案已成功提交，等待审核', 'success');
    } else {
      alert('提案已成功提交，等待审核');
    }
    
    console.log("提案已提交:", proposal);
  }
  
  // 加载提案列表
  function loadProposalsList() {
    console.log("加载提案列表...");
    
    const proposalsContainer = document.getElementById('proposals-container');
    if (!proposalsContainer) return;
    
    // 清空容器
    proposalsContainer.innerHTML = '';
    
    // 如果没有提案
    if (proposalData.length === 0) {
      proposalsContainer.innerHTML = '<p>暂无提案</p>';
      return;
    }
    
    // 按状态和创建时间排序
    const sortedProposals = [...proposalData].sort((a, b) => {
      // 首先按状态排序：voting > pending > accepted > rejected
      const statusOrder = { voting: 0, pending: 1, accepted: 2, rejected: 3 };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;
      
      // 然后按创建时间降序排序
      return b.createdAt - a.createdAt;
    });
    
    // 添加提案项
    sortedProposals.forEach(proposal => {
      const proposalItem = document.createElement('div');
      proposalItem.className = 'proposal-item';
      proposalItem.dataset.proposalId = proposal.id;
      
      // 获取状态显示文本
      let statusText = '';
      let statusClass = '';
      switch (proposal.status) {
        case 'pending':
          statusText = '待审核';
          statusClass = 'status-pending';
          break;
        case 'voting':
          statusText = '投票中';
          statusClass = 'status-voting';
          break;
        case 'accepted':
          statusText = '已接受';
          statusClass = 'status-accepted';
          break;
        case 'rejected':
          statusText = '已拒绝';
          statusClass = 'status-rejected';
          break;
      }
      
      // 创建提案项内容
      proposalItem.innerHTML = `
        <div class="proposal-item-header">
          <div class="proposal-item-title">${proposal.title}</div>
          <div class="proposal-item-status ${statusClass}">${statusText}</div>
        </div>
        <div class="proposal-item-details">
          参数: ${proposal.category}.${proposal.param}<br>
          描述: ${proposal.description}
        </div>
        <div class="proposal-item-creator">
          提案人: ${proposal.creator} | 创建时间: ${new Date(proposal.createdAt).toLocaleString()}
        </div>
        <div class="proposal-item-actions">
          ${getProposalActions(proposal)}
        </div>
      `;
      
      proposalsContainer.appendChild(proposalItem);
      
      // 添加按钮事件
      const actions = proposalItem.querySelector('.proposal-item-actions');
      if (actions) {
        // 投票按钮
        const voteBtn = actions.querySelector('.vote-btn');
        if (voteBtn) {
          voteBtn.addEventListener('click', function() {
            createProposalPoll(proposal);
          });
        }
        
        // 批准按钮
        const approveBtn = actions.querySelector('.approve-btn');
        if (approveBtn) {
          approveBtn.addEventListener('click', function() {
            approveProposal(proposal.id);
          });
        }
        
        // 拒绝按钮
        const rejectBtn = actions.querySelector('.reject-btn');
        if (rejectBtn) {
          rejectBtn.addEventListener('click', function() {
            rejectProposal(proposal.id);
          });
        }
      }
    });
    
    console.log("提案列表已加载");
  }
  
  // 获取提案操作按钮
  function getProposalActions(proposal) {
    // 获取当前用户
    const currentUser = window.currentUser;
    if (!currentUser) return '';
    
    // 根据提案状态返回不同的操作按钮
    switch (proposal.status) {
      case 'pending':
        // 只有管理员可以批准或拒绝提案
        if (isAdmin(currentUser)) {
          return `
            <button class="proposal-action-btn approve-btn">批准</button>
            <button class="proposal-action-btn reject-btn">拒绝</button>
          `;
        }
        return '<span>等待管理员审核</span>';
      case 'voting':
        // 如果已经创建了投票，显示查看投票按钮
        const poll = findProposalPoll(proposal);
        if (poll) {
          return `<button class="proposal-action-btn vote-btn">查看投票</button>`;
        }
        // 否则显示创建投票按钮
        return `<button class="proposal-action-btn vote-btn">创建投票</button>`;
      case 'accepted':
        return '<span>提案已接受</span>';
      case 'rejected':
        return '<span>提案已拒绝</span>';
      default:
        return '';
    }
  }
  
  // 检查用户是否是管理员
  function isAdmin(username) {
    // 这里可以根据实际需求定义管理员
    // 简单起见，我们假设用户名为"admin"的用户是管理员
    return username === 'admin' || username === 'demo';
  }
  
  // 批准提案
  function approveProposal(proposalId) {
    console.log(`批准提案 ${proposalId}...`);
    
    // 获取当前用户
    const currentUser = window.currentUser;
    if (!currentUser || !isAdmin(currentUser)) {
      alert('只有管理员可以批准提案');
      return;
    }
    
    // 查找提案
    const proposalIndex = proposalData.findIndex(p => p.id === proposalId);
    if (proposalIndex === -1) {
      alert('提案不存在');
      return;
    }
    
    // 获取提案
    const proposal = proposalData[proposalIndex];
    
    // 增加批准数
    proposal.approvals++;
    
    // 如果达到最小批准数，将状态更改为投票中
    if (proposal.approvals >= proposal.minApprovals) {
      proposal.status = 'voting';
      
      // 创建投票
      createProposalPoll(proposal);
    }
    
    // 更新提案数据
    proposalData[proposalIndex] = proposal;
    
    // 保存提案数据
    saveProposalData();
    
    // 更新提案列表
    loadProposalsList();
    
    // 显示成功消息
    if (typeof window.EnhancedRealTimeFeedback !== 'undefined' && typeof window.EnhancedRealTimeFeedback.showNotification === 'function') {
      window.EnhancedRealTimeFeedback.showNotification('提案已批准', 'success');
    } else {
      alert('提案已批准');
    }
    
    console.log(`提案 ${proposalId} 已批准`);
  }
  
  // 拒绝提案
  function rejectProposal(proposalId) {
    console.log(`拒绝提案 ${proposalId}...`);
    
    // 获取当前用户
    const currentUser = window.currentUser;
    if (!currentUser || !isAdmin(currentUser)) {
      alert('只有管理员可以拒绝提案');
      return;
    }
    
    // 查找提案
    const proposalIndex = proposalData.findIndex(p => p.id === proposalId);
    if (proposalIndex === -1) {
      alert('提案不存在');
      return;
    }
    
    // 获取提案
    const proposal = proposalData[proposalIndex];
    
    // 增加拒绝数
    proposal.rejections++;
    
    // 如果达到最小拒绝数，将状态更改为已拒绝
    if (proposal.rejections >= proposal.minApprovals) {
      proposal.status = 'rejected';
    }
    
    // 更新提案数据
    proposalData[proposalIndex] = proposal;
    
    // 保存提案数据
    saveProposalData();
    
    // 更新提案列表
    loadProposalsList();
    
    // 显示成功消息
    if (typeof window.EnhancedRealTimeFeedback !== 'undefined' && typeof window.EnhancedRealTimeFeedback.showNotification === 'function') {
      window.EnhancedRealTimeFeedback.showNotification('提案已拒绝', 'success');
    } else {
      alert('提案已拒绝');
    }
    
    console.log(`提案 ${proposalId} 已拒绝`);
  }
  
  // 创建提案投票
  function createProposalPoll(proposal) {
    console.log(`为提案 ${proposal.id} 创建投票...`);
    
    // 检查是否已经存在相关投票
    const existingPoll = findProposalPoll(proposal);
    if (existingPoll) {
      // 如果已存在投票，显示该投票
      showPoll(existingPoll.id);
      return;
    }
    
    // 检查是否有createPoll函数
    if (typeof window.createPoll !== 'function') {
      alert('创建投票功能不可用');
      return;
    }
    
    // 创建投票
    const pollData = {
      title: `提案: ${proposal.title}`,
      description: `${proposal.description}\n\n参数: ${proposal.category}.${proposal.param}`,
      options: proposal.options,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7天后
      isParameterPoll: true,
      parameterCategory: proposal.category,
      parameterName: proposal.param,
      proposalId: proposal.id
    };
    
    // 调用创建投票函数
    window.createPoll(pollData);
    
    // 更新提案列表
    setTimeout(loadProposalsList, 1000);
    
    console.log(`提案 ${proposal.id} 的投票已创建`);
  }
  
  // 查找提案相关的投票
  function findProposalPoll(proposal) {
    // 如果没有polls数组，返回null
    if (!window.polls) return null;
    
    // 查找与提案关联的投票
    return window.polls.find(poll => poll.proposalId === proposal.id);
  }
  
  // 显示投票
  function showPoll(pollId) {
    console.log(`显示投票 ${pollId}...`);
    
    // 查找投票
    const poll = window.polls.find(p => p.id === pollId);
    if (!poll) {
      alert('投票不存在');
      return;
    }
    
    // 关闭提案面板
    const proposalPanel = document.getElementById('proposal-panel');
    if (proposalPanel) {
      proposalPanel.classList.remove('active');
    }
    
    // 显示投票详情
    if (typeof window.showPollDetails === 'function') {
      window.showPollDetails(pollId);
    } else {
      alert('显示投票详情功能不可用');
    }
  }
  
  // 初始化共识算法选项
  function initConsensusAlgorithms() {
    console.log("初始化共识算法选项...");
    
    // 创建共识算法投票
    createConsensusAlgorithmPoll();
    
    // 创建共识算法UI
    createConsensusAlgorithmUI();
    
    console.log("共识算法选项初始化完成");
  }
  
  // 创建共识算法投票
  function createConsensusAlgorithmPoll() {
    // 检查是否有createParameterPoll函数
    if (typeof window.createParameterPoll !== 'function') {
      console.warn("createParameterPoll函数不存在，无法创建共识算法投票");
      return;
    }
    
    // 创建共识算法参数类别（如果不存在）
    if (!window.websiteParameters.voting_system) {
      window.websiteParameters.voting_system = {};
    }
    
    // 添加共识算法参数
    window.websiteParameters.voting_system.consensusAlgorithm = {
      current: consensusAlgorithmConfig.current,
      options: consensusAlgorithmConfig.options,
      description: '共识算法'
    };
    
    // 创建共识算法投票
    window.createParameterPoll('voting_system', 'consensusAlgorithm', ['简单多数决', '绝对多数决', '共识决策', '排序选择投票', '二次方投票'], null);
    
    console.log("共识算法投票已创建");
  }
  
  // 创建共识算法UI
  function createConsensusAlgorithmUI() {
    console.log("创建共识算法UI...");
    
    // 检查是否已存在共识算法面板
    if (document.getElementById('consensus-algorithm-panel')) {
      console.log("共识算法UI已存在");
      return;
    }
    
    // 创建共识算法面板
    const consensusPanel = document.createElement('div');
    consensusPanel.id = 'consensus-algorithm-panel';
    consensusPanel.className = 'consensus-algorithm-panel';
    consensusPanel.innerHTML = `
      <div class="consensus-panel-header">
        <h3>共识算法</h3>
        <button id="close-consensus-panel" class="close-button">×</button>
      </div>
      <div class="consensus-panel-content">
        <div class="current-consensus-algorithm">
          <h4>当前共识算法</h4>
          <div id="current-consensus-algorithm-value" class="current-consensus-algorithm-value">
            ${consensusAlgorithmConfig.descriptions[consensusAlgorithmConfig.current]}
          </div>
        </div>
        <div class="consensus-algorithm-description">
          <h4>共识算法说明</h4>
          <ul class="consensus-algorithm-list">
            <li><strong>简单多数决</strong>: 得票最多的选项获胜，无论得票率。</li>
            <li><strong>绝对多数决</strong>: 选项需要获得超过66.7%的票数才能获胜。</li>
            <li><strong>共识决策</strong>: 选项需要获得超过80%的票数才能获胜。</li>
            <li><strong>排序选择投票</strong>: 用户可以对选项进行排序，按排名分配权重。</li>
            <li><strong>二次方投票</strong>: 投票成本随投票数量的平方增加，防止财富集中。</li>
          </ul>
        </div>
      </div>
    `;
    
    // 添加到文档
    document.body.appendChild(consensusPanel);
    
    // 添加关闭按钮事件
    document.getElementById('close-consensus-panel').addEventListener('click', function() {
      consensusPanel.classList.remove('active');
    });
    
    // 创建共识算法按钮
    const consensusButton = document.createElement('button');
    consensusButton.id = 'show-consensus-button';
    consensusButton.className = 'show-consensus-button';
    consensusButton.innerHTML = '<span class="consensus-icon">🔄</span> 共识算法';
    
    // 添加到文档
    document.body.appendChild(consensusButton);
    
    // 添加按钮事件
    consensusButton.addEventListener('click', function() {
      consensusPanel.classList.toggle('active');
      updateConsensusAlgorithmDisplay();
    });
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .consensus-algorithm-panel {
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
      
      .consensus-algorithm-panel.active {
        display: flex;
      }
      
      .consensus-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid #eee;
      }
      
      .consensus-panel-header h3 {
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
      
      .consensus-panel-content {
        padding: 15px;
        overflow-y: auto;
      }
      
      .current-consensus-algorithm,
      .consensus-algorithm-description {
        margin-bottom: 20px;
      }
      
      .current-consensus-algorithm h4,
      .consensus-algorithm-description h4 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 16px;
      }
      
      .current-consensus-algorithm-value {
        padding: 10px;
        background-color: #f5f5f5;
        border-radius: 4px;
        font-weight: bold;
      }
      
      .consensus-algorithm-list {
        padding-left: 20px;
        margin: 0;
      }
      
      .consensus-algorithm-list li {
        margin-bottom: 8px;
      }
      
      .show-consensus-button {
        position: fixed;
        bottom: 170px;
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
      
      .consensus-icon {
        margin-right: 5px;
        font-size: 16px;
      }
      
      .dark-mode .consensus-algorithm-panel {
        background-color: #333;
        color: white;
      }
      
      .dark-mode .consensus-panel-header {
        border-bottom-color: #444;
      }
      
      .dark-mode .close-button {
        color: #ccc;
      }
      
      .dark-mode .current-consensus-algorithm-value {
        background-color: #444;
      }
    `;
    
    document.head.appendChild(style);
    
    console.log("共识算法UI创建完成");
  }
  
  // 更新共识算法显示
  function updateConsensusAlgorithmDisplay() {
    const consensusAlgorithmValue = document.getElementById('current-consensus-algorithm-value');
    if (!consensusAlgorithmValue) return;
    
    // 显示当前共识算法
    consensusAlgorithmValue.textContent = consensusAlgorithmConfig.descriptions[consensusAlgorithmConfig.current];
  }
  
  // 增强投票处理
  function enhanceVotingProcess() {
    console.log("增强投票处理...");
    
    // 监听投票提交
    document.addEventListener('voteSubmitted', function(e) {
      // 获取投票数据
      const voteData = e.detail;
      if (!voteData) return;
      
      // 更新用户活跃度
      updateUserActivity();
      
      // 更新用户声誉
      updateUserReputation();
      
      console.log("投票提交事件已处理");
    });
    
    // 监听投票结果变化
    document.addEventListener('voteResultsChanged', function(e) {
      // 获取投票数据
      const pollData = e.detail;
      if (!pollData) return;
      
      // 检查是否是提案投票
      if (pollData.proposalId) {
        // 查找提案
        const proposalIndex = proposalData.findIndex(p => p.id === pollData.proposalId);
        if (proposalIndex !== -1) {
          // 获取提案
          const proposal = proposalData[proposalIndex];
          
          // 检查投票是否已结束
          if (new Date(pollData.endDate) < new Date() && !pollData.executed) {
            // 确定获胜选项
            let winningOptionIndex = -1;
            let maxVotes = -1;
            
            pollData.options.forEach((option, index) => {
              if (option.votes > maxVotes) {
                maxVotes = option.votes;
                winningOptionIndex = index;
              }
            });
            
            // 如果有获胜选项
            if (winningOptionIndex !== -1) {
              // 根据共识算法检查是否满足条件
              const totalVotes = pollData.options.reduce((sum, option) => sum + option.votes, 0);
              const winningPercentage = totalVotes > 0 ? pollData.options[winningOptionIndex].votes / totalVotes : 0;
              
              let consensusReached = false;
              
              switch (consensusAlgorithmConfig.current) {
                case 'majority':
                  // 简单多数决：得票最多的选项获胜
                  consensusReached = true;
                  break;
                case 'supermajority':
                  // 绝对多数决：需要超过66.7%的票数
                  consensusReached = winningPercentage > 0.667;
                  break;
                case 'consensus':
                  // 共识决策：需要超过80%的票数
                  consensusReached = winningPercentage > 0.8;
                  break;
                case 'ranked':
                case 'quadratic':
                  // 这些算法需要特殊处理，简单起见，这里使用简单多数决
                  consensusReached = true;
                  break;
              }
              
              // 如果达成共识
              if (consensusReached) {
                // 更新提案状态为已接受
                proposal.status = 'accepted';
                
                // 更新提案数据
                proposalData[proposalIndex] = proposal;
                
                // 保存提案数据
                saveProposalData();
                
                console.log(`提案 ${proposal.id} 已接受`);
              } else {
                // 更新提案状态为已拒绝
                proposal.status = 'rejected';
                
                // 更新提案数据
                proposalData[proposalIndex] = proposal;
                
                // 保存提案数据
                saveProposalData();
                
                console.log(`提案 ${proposal.id} 已拒绝（未达成共识）`);
              }
            }
          }
        }
      }
      
      console.log("投票结果变化事件已处理");
    });
    
    console.log("投票处理增强完成");
  }
  
  // 在DOM加载完成后初始化
  document.addEventListener('DOMContentLoaded', function() {
    console.log("初始化集体决策系统模块...");
    
    // 延迟初始化，确保其他模块已加载
    setTimeout(function() {
      initCollectiveDecisionSystem();
    }, 1000);
  });
  
  // 导出公共API
  window.CollectiveDecisionSystem = {
    calculateUserWeight: calculateUserWeight,
    getUserReputationData: function(username) {
      return userReputationData[username];
    },
    getUserActivityData: function(username) {
      return userActivityData[username];
    },
    getUserContributionData: function(username) {
      return userContributionData[username];
    },
    getProposalData: function() {
      return [...proposalData];
    },
    getCurrentConsensusAlgorithm: function() {
      return consensusAlgorithmConfig.current;
    },
    getCurrentWeightSystem: function() {
      return weightSystemConfig.current;
    }
  };
})();
