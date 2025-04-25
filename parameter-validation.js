/**
 * 参数验证模块
 * 确保参数设置符合系统要求
 */

(function() {
  'use strict';
  
  // 初始化参数验证
  function initParameterValidation() {
    console.log('初始化参数验证模块...');
    
    // 添加投票持续时间验证
    addPollDurationValidation();
    
    // 监听参数变更事件
    listenForParameterChanges();
    
    console.log('参数验证模块初始化完成');
  }
  
  // 添加投票持续时间验证
  function addPollDurationValidation() {
    // 确保创建投票表单存在
    const createPollForm = document.getElementById('create-poll-form');
    if (!createPollForm) {
      console.warn('创建投票表单不存在，无法添加持续时间验证');
      return;
    }
    
    // 获取持续时间输入字段
    const durationInput = document.getElementById('poll-duration');
    if (!durationInput) {
      console.warn('持续时间输入字段不存在，无法添加持续时间验证');
      return;
    }
    
    // 添加自定义验证
    durationInput.addEventListener('change', function(event) {
      validatePollDuration(event.target);
    });
    
    // 在表单提交前验证
    createPollForm.addEventListener('submit', function(event) {
      const isValid = validatePollDuration(durationInput);
      if (!isValid) {
        event.preventDefault();
        alert('请设置有效的投票持续时间（最短30秒）');
      }
    });
    
    console.log('投票持续时间验证已添加');
  }
  
  // 验证投票持续时间
  function validatePollDuration(inputElement) {
    if (!inputElement) return false;
    
    const durationValue = inputElement.value;
    
    // 检查是否为空
    if (!durationValue) {
      inputElement.setCustomValidity('请设置投票持续时间');
      return false;
    }
    
    // 检查是否为数字（如果是自定义输入）
    if (!isNaN(durationValue)) {
      const durationInSeconds = parseInt(durationValue, 10);
      if (durationInSeconds < 30) {
        inputElement.setCustomValidity('投票持续时间不能少于30秒');
        return false;
      }
    } else {
      // 检查预设选项
      const validOptions = ['30seconds', '1day', '3days', '7days', '14days', '30days'];
      if (!validOptions.includes(durationValue)) {
        inputElement.setCustomValidity('请选择有效的投票持续时间选项');
        return false;
      }
    }
    
    // 验证通过
    inputElement.setCustomValidity('');
    return true;
  }
  
  // 监听参数变更事件
  function listenForParameterChanges() {
    // 监听参数设置变更
    document.addEventListener('parameterChanged', function(event) {
      const { category, parameter, value } = event.detail;
      
      // 验证默认投票持续时间参数
      if (category === 'system' && parameter === 'defaultPollDuration') {
        validateDefaultPollDuration(value);
      }
    });
    
    console.log('参数变更监听已设置');
  }
  
  // 验证默认投票持续时间参数
  function validateDefaultPollDuration(value) {
    // 有效的持续时间选项
    const validOptions = ['30seconds', '1day', '3days', '7days', '14days', '30days'];
    
    // 检查是否为有效选项
    if (!validOptions.includes(value)) {
      console.error(`无效的默认投票持续时间: ${value}`);
      alert('请选择有效的默认投票持续时间（最短30秒）');
      return false;
    }
    
    console.log(`默认投票持续时间已验证: ${value}`);
    return true;
  }
  
  // 将持续时间转换为秒数
  function durationToSeconds(duration) {
    if (!duration) return 0;
    
    // 如果是数字，直接返回
    if (!isNaN(duration)) {
      return parseInt(duration, 10);
    }
    
    // 解析预设选项
    switch (duration) {
      case '30seconds':
        return 30;
      case '1day':
        return 86400; // 24 * 60 * 60
      case '3days':
        return 259200; // 3 * 24 * 60 * 60
      case '7days':
        return 604800; // 7 * 24 * 60 * 60
      case '14days':
        return 1209600; // 14 * 24 * 60 * 60
      case '30days':
        return 2592000; // 30 * 24 * 60 * 60
      default:
        return 604800; // 默认7天
    }
  }
  
  // 将秒数转换为可读的持续时间
  function secondsToDurationText(seconds) {
    if (!seconds || seconds < 0) return '无效时间';
    
    if (seconds < 60) {
      return `${seconds}秒`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)}分钟`;
    } else if (seconds < 86400) {
      return `${Math.floor(seconds / 3600)}小时`;
    } else {
      return `${Math.floor(seconds / 86400)}天`;
    }
  }
  
  // 更新创建投票表单中的持续时间选项
  function updateDurationOptions() {
    // 获取持续时间选择元素
    const durationSelect = document.getElementById('poll-duration');
    if (!durationSelect) return;
    
    // 清空现有选项
    durationSelect.innerHTML = '';
    
    // 添加选项
    const options = [
      { value: '30seconds', text: '30秒（测试用）' },
      { value: '1day', text: '1天' },
      { value: '3days', text: '3天' },
      { value: '7days', text: '7天' },
      { value: '14days', text: '14天' },
      { value: '30days', text: '30天' }
    ];
    
    // 获取当前默认值
    const defaultValue = websiteParameters.system.defaultPollDuration.current;
    
    // 添加选项
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.text;
      
      // 设置默认选中项
      if (option.value === defaultValue) {
        optionElement.selected = true;
      }
      
      durationSelect.appendChild(optionElement);
    });
    
    console.log('持续时间选项已更新');
  }
  
  // 导出函数到全局作用域
  window.validatePollDuration = validatePollDuration;
  window.durationToSeconds = durationToSeconds;
  window.secondsToDurationText = secondsToDurationText;
  window.updateDurationOptions = updateDurationOptions;
  
  // 在文档加载完成后初始化
  document.addEventListener('DOMContentLoaded', function() {
    initParameterValidation();
  });
  
  // 如果文档已加载完成，立即初始化
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initParameterValidation();
  }
})();
