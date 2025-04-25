/**
 * 参数设置测试模块
 * 用于测试参数设置的有效性和功能
 */

(function() {
  'use strict';
  
  // 测试配置
  const testConfig = {
    // 是否启用自动测试
    enableAutoTest: false,
    // 测试日志级别 (debug, info, warn, error)
    logLevel: 'info',
    // 测试结果存储键
    resultStorageKey: 'parameterTestResults'
  };
  
  // 测试结果
  let testResults = {
    // 测试运行时间
    timestamp: null,
    // 测试通过数量
    passed: 0,
    // 测试失败数量
    failed: 0,
    // 详细测试结果
    details: []
  };
  
  // 初始化测试模块
  function initParameterTest() {
    console.log('初始化参数设置测试模块...');
    
    // 创建测试UI
    createTestUI();
    
    // 如果启用自动测试，则运行测试
    if (testConfig.enableAutoTest) {
      runAllTests();
    }
    
    console.log('参数设置测试模块初始化完成');
  }
  
  // 创建测试UI
  function createTestUI() {
    // 检查是否已存在测试面板
    if (document.getElementById('parameter-test-panel')) {
      console.log('测试面板已存在');
      return;
    }
    
    // 创建测试面板
    const testPanel = document.createElement('div');
    testPanel.id = 'parameter-test-panel';
    testPanel.className = 'parameter-test-panel';
    testPanel.innerHTML = `
      <div class="test-panel-header">
        <h3>参数设置测试</h3>
        <button id="close-test-panel" class="close-button">×</button>
      </div>
      <div class="test-panel-content">
        <div class="test-controls">
          <button id="run-all-tests" class="test-button">运行所有测试</button>
          <button id="run-duration-test" class="test-button">测试投票持续时间</button>
          <button id="clear-test-results" class="test-button">清除测试结果</button>
        </div>
        <div class="test-results">
          <h4>测试结果</h4>
          <div id="test-summary" class="test-summary">
            尚未运行测试
          </div>
          <div id="test-details" class="test-details">
          </div>
        </div>
      </div>
    `;
    
    // 添加到文档
    document.body.appendChild(testPanel);
    
    // 添加关闭按钮事件
    document.getElementById('close-test-panel').addEventListener('click', function() {
      testPanel.classList.remove('active');
    });
    
    // 添加测试按钮事件
    document.getElementById('run-all-tests').addEventListener('click', function() {
      runAllTests();
    });
    
    document.getElementById('run-duration-test').addEventListener('click', function() {
      runDurationTests();
    });
    
    document.getElementById('clear-test-results').addEventListener('click', function() {
      clearTestResults();
    });
    
    // 创建测试按钮
    const testButton = document.createElement('button');
    testButton.id = 'show-test-button';
    testButton.className = 'show-test-button';
    testButton.innerHTML = '<span class="test-icon">🧪</span> 参数测试';
    
    // 添加到文档
    document.body.appendChild(testButton);
    
    // 添加按钮事件
    testButton.addEventListener('click', function() {
      testPanel.classList.toggle('active');
    });
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .parameter-test-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        max-width: 600px;
        max-height: 80vh;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: none;
        flex-direction: column;
        overflow: hidden;
      }
      
      .parameter-test-panel.active {
        display: flex;
      }
      
      .test-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid #eee;
      }
      
      .test-panel-header h3 {
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
      
      .test-panel-content {
        padding: 15px;
        overflow-y: auto;
      }
      
      .test-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 20px;
      }
      
      .test-button {
        padding: 8px 12px;
        background-color: var(--primary-color, #4a90e2);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      
      .test-results {
        background-color: #f5f5f5;
        border-radius: 4px;
        padding: 15px;
      }
      
      .test-results h4 {
        margin-top: 0;
        margin-bottom: 10px;
      }
      
      .test-summary {
        font-weight: bold;
        margin-bottom: 10px;
        padding: 10px;
        background-color: #e9e9e9;
        border-radius: 4px;
      }
      
      .test-details {
        max-height: 300px;
        overflow-y: auto;
      }
      
      .test-item {
        padding: 8px;
        margin-bottom: 5px;
        border-radius: 4px;
      }
      
      .test-pass {
        background-color: #d4edda;
        color: #155724;
      }
      
      .test-fail {
        background-color: #f8d7da;
        color: #721c24;
      }
      
      .show-test-button {
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
      
      .test-icon {
        margin-right: 5px;
        font-size: 16px;
      }
      
      .dark-mode .parameter-test-panel {
        background-color: #333;
        color: white;
      }
      
      .dark-mode .test-panel-header {
        border-bottom-color: #444;
      }
      
      .dark-mode .close-button {
        color: #ccc;
      }
      
      .dark-mode .test-results {
        background-color: #444;
      }
      
      .dark-mode .test-summary {
        background-color: #555;
      }
      
      .dark-mode .test-pass {
        background-color: #1e4a33;
        color: #a3d9b3;
      }
      
      .dark-mode .test-fail {
        background-color: #4a1e1e;
        color: #d9a3a3;
      }
    `;
    
    document.head.appendChild(style);
    
    console.log('测试UI创建完成');
  }
  
  // 运行所有测试
  function runAllTests() {
    console.log('运行所有参数测试...');
    
    // 重置测试结果
    resetTestResults();
    
    // 运行投票持续时间测试
    runDurationTests();
    
    // 更新测试结果显示
    updateTestResultsDisplay();
    
    // 保存测试结果
    saveTestResults();
    
    console.log('所有参数测试完成');
  }
  
  // 运行投票持续时间测试
  function runDurationTests() {
    console.log('运行投票持续时间测试...');
    
    // 测试默认投票持续时间参数
    testDefaultPollDuration();
    
    // 测试持续时间验证
    testDurationValidation();
    
    // 测试持续时间转换
    testDurationConversion();
    
    // 更新测试结果显示
    updateTestResultsDisplay();
    
    console.log('投票持续时间测试完成');
  }
  
  // 测试默认投票持续时间参数
  function testDefaultPollDuration() {
    // 测试参数存在
    assertTest(
      '默认投票持续时间参数存在',
      window.websiteParameters && 
      window.websiteParameters.system && 
      window.websiteParameters.system.defaultPollDuration,
      '默认投票持续时间参数不存在'
    );
    
    // 测试选项包含30秒
    assertTest(
      '默认投票持续时间选项包含30秒',
      window.websiteParameters && 
      window.websiteParameters.system && 
      window.websiteParameters.system.defaultPollDuration &&
      window.websiteParameters.system.defaultPollDuration.options &&
      window.websiteParameters.system.defaultPollDuration.options.includes('30seconds'),
      '默认投票持续时间选项不包含30秒'
    );
    
    // 测试选项顺序（30秒应该是第一个选项）
    assertTest(
      '30秒是默认投票持续时间的第一个选项',
      window.websiteParameters && 
      window.websiteParameters.system && 
      window.websiteParameters.system.defaultPollDuration &&
      window.websiteParameters.system.defaultPollDuration.options &&
      window.websiteParameters.system.defaultPollDuration.options[0] === '30seconds',
      '30秒不是默认投票持续时间的第一个选项'
    );
  }
  
  // 测试持续时间验证
  function testDurationValidation() {
    // 测试验证函数存在
    assertTest(
      '持续时间验证函数存在',
      typeof window.validatePollDuration === 'function',
      '持续时间验证函数不存在'
    );
    
    // 创建模拟输入元素
    const mockInput = document.createElement('input');
    mockInput.value = '30seconds';
    
    // 测试有效的预设选项
    assertTest(
      '验证有效的预设选项 (30seconds)',
      window.validatePollDuration(mockInput),
      '验证有效的预设选项失败'
    );
    
    // 测试无效的预设选项
    mockInput.value = '10seconds';
    assertTest(
      '拒绝无效的预设选项 (10seconds)',
      !window.validatePollDuration(mockInput),
      '未能拒绝无效的预设选项'
    );
    
    // 测试有效的数字输入
    mockInput.value = '30';
    assertTest(
      '验证有效的数字输入 (30秒)',
      window.validatePollDuration(mockInput),
      '验证有效的数字输入失败'
    );
    
    // 测试无效的数字输入
    mockInput.value = '29';
    assertTest(
      '拒绝无效的数字输入 (29秒)',
      !window.validatePollDuration(mockInput),
      '未能拒绝无效的数字输入'
    );
  }
  
  // 测试持续时间转换
  function testDurationConversion() {
    // 测试转换函数存在
    assertTest(
      '持续时间转换函数存在',
      typeof window.durationToSeconds === 'function',
      '持续时间转换函数不存在'
    );
    
    // 测试30秒转换
    assertTest(
      '30seconds转换为30秒',
      window.durationToSeconds('30seconds') === 30,
      '30seconds未正确转换为30秒'
    );
    
    // 测试1天转换
    assertTest(
      '1day转换为86400秒',
      window.durationToSeconds('1day') === 86400,
      '1day未正确转换为86400秒'
    );
    
    // 测试数字输入转换
    assertTest(
      '数字30转换为30秒',
      window.durationToSeconds('30') === 30,
      '数字30未正确转换为30秒'
    );
    
    // 测试文本转换函数存在
    assertTest(
      '秒数转文本函数存在',
      typeof window.secondsToDurationText === 'function',
      '秒数转文本函数不存在'
    );
    
    // 测试30秒文本转换
    assertTest(
      '30秒转换为"30秒"文本',
      window.secondsToDurationText(30) === '30秒',
      '30秒未正确转换为"30秒"文本'
    );
  }
  
  // 断言测试
  function assertTest(name, condition, failMessage) {
    const result = {
      name: name,
      passed: !!condition,
      message: condition ? '通过' : (failMessage || '失败'),
      timestamp: new Date().toISOString()
    };
    
    // 添加到测试结果
    testResults.details.push(result);
    
    // 更新计数
    if (result.passed) {
      testResults.passed++;
    } else {
      testResults.failed++;
    }
    
    // 记录日志
    logTest(result);
    
    return result.passed;
  }
  
  // 记录测试日志
  function logTest(result) {
    const logPrefix = `[测试] ${result.name}: `;
    
    if (result.passed) {
      if (testConfig.logLevel === 'debug' || testConfig.logLevel === 'info') {
        console.log(logPrefix + '通过');
      }
    } else {
      if (testConfig.logLevel !== 'error') {
        console.warn(logPrefix + result.message);
      } else {
        console.error(logPrefix + result.message);
      }
    }
  }
  
  // 重置测试结果
  function resetTestResults() {
    testResults = {
      timestamp: new Date().toISOString(),
      passed: 0,
      failed: 0,
      details: []
    };
  }
  
  // 清除测试结果
  function clearTestResults() {
    resetTestResults();
    updateTestResultsDisplay();
    localStorage.removeItem(testConfig.resultStorageKey);
    console.log('测试结果已清除');
  }
  
  // 保存测试结果
  function saveTestResults() {
    localStorage.setItem(testConfig.resultStorageKey, JSON.stringify(testResults));
    console.log('测试结果已保存');
  }
  
  // 加载测试结果
  function loadTestResults() {
    const savedResults = localStorage.getItem(testConfig.resultStorageKey);
    if (savedResults) {
      try {
        testResults = JSON.parse(savedResults);
        updateTestResultsDisplay();
        console.log('测试结果已加载');
      } catch (error) {
        console.error('加载测试结果时出错:', error);
      }
    }
  }
  
  // 更新测试结果显示
  function updateTestResultsDisplay() {
    const summaryElement = document.getElementById('test-summary');
    const detailsElement = document.getElementById('test-details');
    
    if (!summaryElement || !detailsElement) {
      console.warn('测试结果显示元素不存在');
      return;
    }
    
    // 更新摘要
    const total = testResults.passed + testResults.failed;
    const passRate = total > 0 ? Math.round((testResults.passed / total) * 100) : 0;
    
    summaryElement.innerHTML = `
      测试完成: ${total} 项测试
      <br>
      通过: ${testResults.passed} 项 (${passRate}%)
      <br>
      失败: ${testResults.failed} 项
      <br>
      时间: ${new Date(testResults.timestamp).toLocaleString()}
    `;
    
    // 更新详情
    detailsElement.innerHTML = '';
    
    testResults.details.forEach(result => {
      const itemElement = document.createElement('div');
      itemElement.className = `test-item ${result.passed ? 'test-pass' : 'test-fail'}`;
      itemElement.innerHTML = `
        <strong>${result.name}</strong>: ${result.message}
      `;
      
      detailsElement.appendChild(itemElement);
    });
  }
  
  // 在文档加载完成后初始化
  document.addEventListener('DOMContentLoaded', function() {
    initParameterTest();
    loadTestResults();
  });
  
  // 如果文档已加载完成，立即初始化
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initParameterTest();
    loadTestResults();
  }
})();
