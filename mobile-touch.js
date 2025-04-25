/**
 * 移动端触摸支持模块
 * 为网站添加移动端触摸事件支持，解决手机端按钮无响应问题
 */

(function() {
  'use strict';
  
  // 检测是否为触摸设备
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  
  // 调试日志
  console.log(`设备触摸支持检测: ${isTouchDevice ? '支持触摸' : '不支持触摸'}`);
  
  // 如果不是触摸设备，不需要进一步处理
  if (!isTouchDevice) return;
  
  // 为文档添加触摸设备标识，用于CSS样式调整
  document.documentElement.classList.add('touch-device');
  
  // 触摸反馈延迟（毫秒）
  const TOUCH_FEEDBACK_DELAY = 100;
  
  // 添加触摸样式
  function addTouchStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* 触摸设备样式优化 */
      .touch-device button,
      .touch-device input[type="submit"],
      .touch-device .poll-card,
      .touch-device .view-poll-btn,
      .touch-device .parameter-category,
      .touch-device .close-notification,
      .touch-device a {
        cursor: pointer;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        touch-action: manipulation;
      }
      
      /* 增大触摸目标区域 */
      .touch-device button,
      .touch-device input[type="submit"],
      .touch-device .view-poll-btn {
        min-height: 44px;
        min-width: 44px;
        padding: 12px 16px;
        margin: 8px 0;
      }
      
      /* 增大表单元素间距 */
      .touch-device .form-group {
        margin-bottom: 20px;
      }
      
      /* 触摸反馈效果 */
      .touch-device button:active,
      .touch-device input[type="submit"]:active,
      .touch-device .poll-card:active,
      .touch-device .view-poll-btn:active,
      .touch-device .parameter-category:active {
        transform: scale(0.98);
        opacity: 0.9;
        transition: transform 0.1s, opacity 0.1s;
      }
      
      /* 修复移动端导航栏 */
      @media (max-width: 768px) {
        .touch-device header {
          padding: 10px;
        }
        
        .touch-device nav {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
        }
        
        .touch-device nav button {
          margin: 4px;
          flex-grow: 1;
          max-width: 120px;
        }
      }
      
      /* 触摸反馈类 */
      .touch-feedback {
        position: relative;
        overflow: hidden;
      }
      
      .touch-feedback::after {
        content: '';
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        background-image: radial-gradient(circle, rgba(255,255,255,0.4) 10%, transparent 70%);
        background-repeat: no-repeat;
        background-position: 50%;
        transform: scale(10,10);
        opacity: 0;
        transition: transform 0.5s, opacity 0.5s;
      }
      
      .touch-feedback.active::after {
        transform: scale(0,0);
        opacity: 1;
        transition: 0s;
      }
    `;
    document.head.appendChild(styleElement);
    console.log('已添加触摸设备样式优化');
  }
  
  // 为所有可交互元素添加触摸反馈效果
  function addTouchFeedback() {
    // 选择所有可交互元素
    const interactiveElements = document.querySelectorAll('button, input[type="submit"], .poll-card, .view-poll-btn, .parameter-category, a');
    
    interactiveElements.forEach(element => {
      // 添加触摸反馈类
      element.classList.add('touch-feedback');
      
      // 添加触摸开始事件
      element.addEventListener('touchstart', function(e) {
        this.classList.add('active');
        
        // 设置触摸位置为波纹起点
        const rect = this.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        
        this.style.setProperty('--touch-x', `${x}px`);
        this.style.setProperty('--touch-y', `${y}px`);
      }, { passive: true });
      
      // 添加触摸结束事件
      element.addEventListener('touchend', function() {
        // 延迟移除活动状态，以便看到反馈效果
        setTimeout(() => {
          this.classList.remove('active');
        }, TOUCH_FEEDBACK_DELAY);
      }, { passive: true });
      
      // 添加触摸取消事件
      element.addEventListener('touchcancel', function() {
        this.classList.remove('active');
      }, { passive: true });
    });
    
    console.log(`已为 ${interactiveElements.length} 个元素添加触摸反馈效果`);
  }
  
  // 修复移动端点击延迟问题
  function fixTouchDelay() {
    // 阻止双击缩放
    document.addEventListener('touchend', function(e) {
      const now = Date.now();
      const lastTouch = this.lastTouch || now + 1;
      const delta = now - lastTouch;
      
      if (delta < 300 && delta > 0) {
        e.preventDefault();
      }
      
      this.lastTouch = now;
    }, { passive: false });
    
    // 为所有按钮添加触摸事件处理
    const buttons = document.querySelectorAll('button, input[type="submit"], .poll-card, .view-poll-btn, .parameter-category, a');
    
    buttons.forEach(button => {
      button.addEventListener('touchend', function(e) {
        // 阻止默认行为，防止延迟
        e.preventDefault();
        
        // 模拟点击事件
        setTimeout(() => {
          const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          this.dispatchEvent(clickEvent);
        }, TOUCH_FEEDBACK_DELAY);
      }, { passive: false });
    });
    
    console.log(`已为 ${buttons.length} 个按钮修复触摸延迟问题`);
  }
  
  // 动态添加触摸事件处理
  function setupTouchEventHandlers() {
    // 监听DOM变化，为新添加的元素添加触摸支持
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(node => {
            // 检查是否为元素节点
            if (node.nodeType === 1) {
              // 为新元素添加触摸反馈
              const interactiveElements = node.querySelectorAll('button, input[type="submit"], .poll-card, .view-poll-btn, .parameter-category, a');
              
              if (interactiveElements.length > 0) {
                console.log(`为新添加的 ${interactiveElements.length} 个元素添加触摸支持`);
                interactiveElements.forEach(element => {
                  // 添加触摸反馈类
                  element.classList.add('touch-feedback');
                  
                  // 添加触摸事件处理
                  element.addEventListener('touchstart', function(e) {
                    this.classList.add('active');
                    
                    // 设置触摸位置为波纹起点
                    const rect = this.getBoundingClientRect();
                    const x = e.touches[0].clientX - rect.left;
                    const y = e.touches[0].clientY - rect.top;
                    
                    this.style.setProperty('--touch-x', `${x}px`);
                    this.style.setProperty('--touch-y', `${y}px`);
                  }, { passive: true });
                  
                  element.addEventListener('touchend', function(e) {
                    // 延迟移除活动状态，以便看到反馈效果
                    setTimeout(() => {
                      this.classList.remove('active');
                    }, TOUCH_FEEDBACK_DELAY);
                    
                    // 阻止默认行为，防止延迟
                    e.preventDefault();
                    
                    // 模拟点击事件
                    setTimeout(() => {
                      const clickEvent = new MouseEvent('click', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                      });
                      this.dispatchEvent(clickEvent);
                    }, TOUCH_FEEDBACK_DELAY);
                  }, { passive: false });
                  
                  element.addEventListener('touchcancel', function() {
                    this.classList.remove('active');
                  }, { passive: true });
                });
              }
              
              // 如果新元素本身是交互元素，也为其添加触摸支持
              if (node.matches('button, input[type="submit"], .poll-card, .view-poll-btn, .parameter-category, a')) {
                console.log('为新添加的交互元素添加触摸支持');
                
                // 添加触摸反馈类
                node.classList.add('touch-feedback');
                
                // 添加触摸事件处理
                node.addEventListener('touchstart', function(e) {
                  this.classList.add('active');
                  
                  // 设置触摸位置为波纹起点
                  const rect = this.getBoundingClientRect();
                  const x = e.touches[0].clientX - rect.left;
                  const y = e.touches[0].clientY - rect.top;
                  
                  this.style.setProperty('--touch-x', `${x}px`);
                  this.style.setProperty('--touch-y', `${y}px`);
                }, { passive: true });
                
                node.addEventListener('touchend', function(e) {
                  // 延迟移除活动状态，以便看到反馈效果
                  setTimeout(() => {
                    this.classList.remove('active');
                  }, TOUCH_FEEDBACK_DELAY);
                  
                  // 阻止默认行为，防止延迟
                  e.preventDefault();
                  
                  // 模拟点击事件
                  setTimeout(() => {
                    const clickEvent = new MouseEvent('click', {
                      view: window,
                      bubbles: true,
                      cancelable: true
                    });
                    this.dispatchEvent(clickEvent);
                  }, TOUCH_FEEDBACK_DELAY);
                }, { passive: false });
                
                node.addEventListener('touchcancel', function() {
                  this.classList.remove('active');
                }, { passive: true });
              }
            }
          });
        }
      });
    });
    
    // 开始观察文档变化
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('已设置动态触摸事件处理');
  }
  
  // 在DOM加载完成后初始化
  document.addEventListener('DOMContentLoaded', function() {
    console.log('初始化移动端触摸支持');
    
    // 添加触摸样式
    addTouchStyles();
    
    // 添加触摸反馈效果
    addTouchFeedback();
    
    // 修复触摸延迟问题
    fixTouchDelay();
    
    // 设置动态触摸事件处理
    setupTouchEventHandlers();
    
    console.log('移动端触摸支持初始化完成');
  });
  
  // 导出公共API
  window.MobileTouchSupport = {
    refresh: function() {
      addTouchFeedback();
      fixTouchDelay();
    }
  };
})();
