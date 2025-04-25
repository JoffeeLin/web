/**
 * 移动端体验优化模块
 * 为网站添加更好的移动端支持和触摸交互
 */

(function() {
  'use strict';
  
  // 配置
  const config = {
    // 是否启用手势控制
    enableGestures: true,
    // 是否启用触觉反馈
    enableHapticFeedback: true,
    // 是否启用移动端专用布局
    enableMobileLayout: true,
    // 是否启用触摸优化
    enableTouchOptimization: true,
    // 触摸目标最小尺寸（像素）
    minTouchTargetSize: 44,
    // 触摸目标间距（像素）
    touchTargetSpacing: 8
  };
  
  // 设备信息
  const deviceInfo = {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    hasTouch: false,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1
  };
  
  // 手势状态
  const gestureState = {
    isTracking: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    startTime: 0,
    currentTime: 0,
    velocityX: 0,
    velocityY: 0
  };
  
  // 已注册的手势
  const registeredGestures = {
    swipeLeft: [],
    swipeRight: [],
    swipeUp: [],
    swipeDown: [],
    tap: [],
    doubleTap: [],
    longPress: [],
    pinch: [],
    rotate: []
  };
  
  // 触摸历史
  const touchHistory = [];
  
  // 初始化移动端体验优化
  function initMobileExperience() {
    console.log("初始化移动端体验优化...");
    
    // 检测设备类型
    detectDeviceType();
    
    // 添加视口元标签（如果不存在）
    addViewportMeta();
    
    // 添加移动端样式
    addMobileStyles();
    
    // 初始化触摸优化
    if (config.enableTouchOptimization) {
      initTouchOptimization();
    }
    
    // 初始化手势控制
    if (config.enableGestures) {
      initGestureControl();
    }
    
    // 初始化触觉反馈
    if (config.enableHapticFeedback) {
      initHapticFeedback();
    }
    
    // 初始化移动端专用布局
    if (config.enableMobileLayout) {
      initMobileLayout();
    }
    
    // 添加窗口大小变化监听
    window.addEventListener('resize', handleWindowResize);
    
    // 添加设备方向变化监听
    window.addEventListener('orientationchange', handleOrientationChange);
    
    console.log("移动端体验优化初始化完成");
  }
  
  // 检测设备类型
  function detectDeviceType() {
    console.log("检测设备类型...");
    
    // 更新视口尺寸
    deviceInfo.viewportWidth = window.innerWidth;
    deviceInfo.viewportHeight = window.innerHeight;
    deviceInfo.pixelRatio = window.devicePixelRatio || 1;
    
    // 检测触摸支持
    deviceInfo.hasTouch = 'ontouchstart' in window || 
                          navigator.maxTouchPoints > 0 || 
                          navigator.msMaxTouchPoints > 0;
    
    // 检测设备类型
    if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      if (window.innerWidth >= 768) {
        deviceInfo.isTablet = true;
        deviceInfo.isMobile = false;
        deviceInfo.isDesktop = false;
      } else {
        deviceInfo.isTablet = false;
        deviceInfo.isMobile = true;
        deviceInfo.isDesktop = false;
      }
    } else {
      deviceInfo.isTablet = false;
      deviceInfo.isMobile = false;
      deviceInfo.isDesktop = true;
    }
    
    // 添加设备类型类名到文档
    document.documentElement.classList.remove('mobile', 'tablet', 'desktop');
    if (deviceInfo.isMobile) {
      document.documentElement.classList.add('mobile');
    } else if (deviceInfo.isTablet) {
      document.documentElement.classList.add('tablet');
    } else {
      document.documentElement.classList.add('desktop');
    }
    
    // 添加触摸支持类名
    if (deviceInfo.hasTouch) {
      document.documentElement.classList.add('has-touch');
    } else {
      document.documentElement.classList.remove('has-touch');
    }
    
    console.log("设备类型:", deviceInfo.isMobile ? "移动设备" : deviceInfo.isTablet ? "平板设备" : "桌面设备");
    console.log("触摸支持:", deviceInfo.hasTouch ? "是" : "否");
  }
  
  // 添加视口元标签
  function addViewportMeta() {
    // 检查是否已存在视口元标签
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    
    if (!viewportMeta) {
      // 创建视口元标签
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
      
      // 添加到文档头部
      document.head.appendChild(viewportMeta);
      
      console.log("已添加视口元标签");
    } else {
      console.log("视口元标签已存在");
    }
  }
  
  // 添加移动端样式
  function addMobileStyles() {
    console.log("添加移动端样式...");
    
    // 检查是否已存在移动端样式
    if (document.getElementById('mobile-experience-styles')) {
      console.log("移动端样式已存在");
      return;
    }
    
    // 创建样式元素
    const style = document.createElement('style');
    style.id = 'mobile-experience-styles';
    style.textContent = `
      /* 基础移动端优化 */
      html {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      
      body {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        touch-action: manipulation;
      }
      
      /* 移动端触摸目标优化 */
      .mobile button,
      .mobile input,
      .mobile select,
      .mobile textarea,
      .mobile a,
      .mobile [role="button"],
      .mobile .clickable,
      .tablet button,
      .tablet input,
      .tablet select,
      .tablet textarea,
      .tablet a,
      .tablet [role="button"],
      .tablet .clickable {
        min-height: ${config.minTouchTargetSize}px;
        min-width: ${config.minTouchTargetSize}px;
        padding: 12px;
        margin: ${config.touchTargetSpacing}px;
      }
      
      /* 移动端表单元素优化 */
      .mobile input[type="text"],
      .mobile input[type="email"],
      .mobile input[type="password"],
      .mobile input[type="number"],
      .mobile input[type="search"],
      .mobile input[type="tel"],
      .mobile input[type="url"],
      .mobile textarea,
      .tablet input[type="text"],
      .tablet input[type="email"],
      .tablet input[type="password"],
      .tablet input[type="number"],
      .tablet input[type="search"],
      .tablet input[type="tel"],
      .tablet input[type="url"],
      .tablet textarea {
        font-size: 16px; /* 防止iOS缩放 */
      }
      
      /* 移动端滚动优化 */
      .mobile .scrollable,
      .tablet .scrollable {
        -webkit-overflow-scrolling: touch;
        overflow-y: auto;
      }
      
      /* 移动端固定元素优化 */
      .mobile .fixed-bottom,
      .tablet .fixed-bottom {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding-bottom: env(safe-area-inset-bottom, 0);
      }
      
      .mobile .fixed-top,
      .tablet .fixed-top {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding-top: env(safe-area-inset-top, 0);
      }
      
      /* 移动端导航优化 */
      .mobile .nav-menu,
      .tablet .nav-menu {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-around;
        background-color: var(--background-color, white);
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        padding: 10px 0;
        padding-bottom: calc(10px + env(safe-area-inset-bottom, 0));
        z-index: 1000;
      }
      
      .mobile .nav-menu-item,
      .tablet .nav-menu-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-width: 60px;
        min-height: 60px;
      }
      
      .mobile .nav-menu-icon,
      .tablet .nav-menu-icon {
        font-size: 24px;
        margin-bottom: 5px;
      }
      
      .mobile .nav-menu-label,
      .tablet .nav-menu-label {
        font-size: 12px;
      }
      
      /* 移动端内容区域优化 */
      .mobile .content-area,
      .tablet .content-area {
        padding-bottom: 80px; /* 为底部导航留出空间 */
      }
      
      /* 移动端卡片优化 */
      .mobile .card,
      .tablet .card {
        margin: 10px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      /* 移动端按钮反馈效果 */
      .mobile button:active,
      .mobile [role="button"]:active,
      .mobile .clickable:active,
      .tablet button:active,
      .tablet [role="button"]:active,
      .tablet .clickable:active {
        transform: scale(0.98);
        transition: transform 0.1s;
      }
      
      /* 移动端触摸反馈 */
      .touch-feedback {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        background-color: rgba(0, 0, 0, 0.1);
        transform: scale(0);
        opacity: 1;
        animation: touch-feedback 0.6s ease-out;
      }
      
      @keyframes touch-feedback {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(3);
          opacity: 0;
        }
      }
      
      /* 暗色模式适配 */
      .dark-mode.mobile .nav-menu,
      .dark-mode.tablet .nav-menu {
        background-color: var(--dark-background-color, #333);
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
      }
      
      .dark-mode .touch-feedback {
        background-color: rgba(255, 255, 255, 0.1);
      }
      
      /* 移动端手势提示 */
      .gesture-hint {
        position: fixed;
        bottom: 70px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
      }
      
      .gesture-hint.visible {
        opacity: 1;
      }
      
      /* 移动端浮动操作按钮 */
      .mobile-fab {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background-color: var(--primary-color, #4a90e2);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      
      .mobile-fab:active {
        transform: scale(0.95);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      }
      
      .mobile-fab-icon {
        font-size: 24px;
      }
      
      /* 移动端抽屉菜单 */
      .mobile-drawer {
        position: fixed;
        top: 0;
        bottom: 0;
        width: 80%;
        max-width: 300px;
        background-color: var(--background-color, white);
        z-index: 1001;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        transform: translateX(-100%);
        transition: transform 0.3s;
      }
      
      .mobile-drawer.right {
        right: 0;
        transform: translateX(100%);
      }
      
      .mobile-drawer.open {
        transform: translateX(0);
      }
      
      .mobile-drawer-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
      }
      
      .mobile-drawer-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }
      
      .dark-mode .mobile-drawer {
        background-color: var(--dark-background-color, #333);
      }
    `;
    
    // 添加到文档头部
    document.head.appendChild(style);
    
    console.log("移动端样式已添加");
  }
  
  // 初始化触摸优化
  function initTouchOptimization() {
    console.log("初始化触摸优化...");
    
    // 移除点击延迟
    document.addEventListener('touchstart', function() {}, { passive: true });
    
    // 添加触摸反馈效果
    document.addEventListener('touchstart', addTouchFeedback, { passive: true });
    
    // 优化触摸目标
    optimizeTouchTargets();
    
    console.log("触摸优化初始化完成");
  }
  
  // 添加触摸反馈效果
  function addTouchFeedback(event) {
    // 如果不是移动设备或平板，不添加触摸反馈
    if (!deviceInfo.isMobile && !deviceInfo.isTablet) return;
    
    // 获取触摸点
    const touch = event.touches[0];
    if (!touch) return;
    
    // 创建反馈元素
    const feedback = document.createElement('div');
    feedback.className = 'touch-feedback';
    feedback.style.left = `${touch.clientX}px`;
    feedback.style.top = `${touch.clientY}px`;
    
    // 添加到文档
    document.body.appendChild(feedback);
    
    // 动画结束后移除
    setTimeout(function() {
      if (feedback.parentNode) {
        feedback.parentNode.removeChild(feedback);
      }
    }, 600);
  }
  
  // 优化触摸目标
  function optimizeTouchTargets() {
    console.log("优化触摸目标...");
    
    // 查找所有可点击元素
    const clickableElements = document.querySelectorAll('button, a, [role="button"], .clickable');
    
    // 为每个元素添加触摸优化
    clickableElements.forEach(element => {
      // 添加clickable类
      element.classList.add('clickable');
      
      // 确保元素有足够的大小
      const rect = element.getBoundingClientRect();
      if (rect.width < config.minTouchTargetSize || rect.height < config.minTouchTargetSize) {
        element.style.minWidth = `${config.minTouchTargetSize}px`;
        element.style.minHeight = `${config.minTouchTargetSize}px`;
      }
      
      // 添加触摸反馈
      element.addEventListener('touchstart', function(e) {
        this.classList.add('touch-active');
      }, { passive: true });
      
      element.addEventListener('touchend', function(e) {
        this.classList.remove('touch-active');
      }, { passive: true });
    });
    
    console.log("触摸目标优化完成");
  }
  
  // 初始化手势控制
  function initGestureControl() {
    console.log("初始化手势控制...");
    
    // 添加手势事件监听
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // 创建手势提示元素
    const gestureHint = document.createElement('div');
    gestureHint.className = 'gesture-hint';
    gestureHint.id = 'gesture-hint';
    document.body.appendChild(gestureHint);
    
    // 创建投票参数
    createGestureVotingParameters();
    
    console.log("手势控制初始化完成");
  }
  
  // 创建手势投票参数
  function createGestureVotingParameters() {
    // 检查是否有createParameterPoll函数
    if (typeof window.createParameterPoll !== 'function') {
      console.warn("createParameterPoll函数不存在，无法创建手势投票参数");
      return;
    }
    
    // 创建交互参数类别（如果不存在）
    if (!window.websiteParameters.interaction) {
      window.websiteParameters.interaction = {};
    }
    
    // 添加手势控制参数
    window.websiteParameters.interaction.gestureControl = {
      current: 'enabled',
      options: ['enabled', 'disabled'],
      description: '手势控制'
    };
    
    // 添加左右滑动参数
    window.websiteParameters.interaction.swipeLeftRight = {
      current: 'navigate',
      options: ['navigate', 'vote', 'none'],
      description: '左右滑动操作'
    };
    
    // 添加上下滑动参数
    window.websiteParameters.interaction.swipeUpDown = {
      current: 'scroll',
      options: ['scroll', 'refresh', 'none'],
      description: '上下滑动操作'
    };
    
    // 创建手势控制投票
    window.createParameterPoll('interaction', 'gestureControl', ['启用手势', '禁用手势'], null);
    
    // 创建左右滑动投票
    window.createParameterPoll('interaction', 'swipeLeftRight', ['导航切换', '投票操作', '无操作'], null);
    
    // 创建上下滑动投票
    window.createParameterPoll('interaction', 'swipeUpDown', ['页面滚动', '下拉刷新', '无操作'], null);
    
    console.log("手势投票参数已创建");
  }
  
  // 处理触摸开始
  function handleTouchStart(event) {
    // 如果手势控制被禁用，不处理
    if (window.websiteParameters && 
        window.websiteParameters.interaction && 
        window.websiteParameters.interaction.gestureControl && 
        window.websiteParameters.interaction.gestureControl.current === 'disabled') {
      return;
    }
    
    // 获取第一个触摸点
    const touch = event.touches[0];
    if (!touch) return;
    
    // 更新手势状态
    gestureState.isTracking = true;
    gestureState.startX = touch.clientX;
    gestureState.startY = touch.clientY;
    gestureState.currentX = touch.clientX;
    gestureState.currentY = touch.clientY;
    gestureState.deltaX = 0;
    gestureState.deltaY = 0;
    gestureState.startTime = Date.now();
    gestureState.currentTime = Date.now();
    
    // 记录触摸历史
    touchHistory.push({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    });
    
    // 限制历史记录数量
    if (touchHistory.length > 10) {
      touchHistory.shift();
    }
  }
  
  // 处理触摸移动
  function handleTouchMove(event) {
    // 如果没有跟踪手势，不处理
    if (!gestureState.isTracking) return;
    
    // 获取第一个触摸点
    const touch = event.touches[0];
    if (!touch) return;
    
    // 更新手势状态
    gestureState.currentX = touch.clientX;
    gestureState.currentY = touch.clientY;
    gestureState.deltaX = touch.clientX - gestureState.startX;
    gestureState.deltaY = touch.clientY - gestureState.startY;
    gestureState.currentTime = Date.now();
    
    // 计算速度
    const timeDelta = gestureState.currentTime - gestureState.startTime;
    if (timeDelta > 0) {
      gestureState.velocityX = gestureState.deltaX / timeDelta;
      gestureState.velocityY = gestureState.deltaY / timeDelta;
    }
    
    // 记录触摸历史
    touchHistory.push({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    });
    
    // 限制历史记录数量
    if (touchHistory.length > 10) {
      touchHistory.shift();
    }
    
    // 检测滑动方向
    detectSwipeDirection();
  }
  
  // 处理触摸结束
  function handleTouchEnd(event) {
    // 如果没有跟踪手势，不处理
    if (!gestureState.isTracking) return;
    
    // 更新手势状态
    gestureState.isTracking = false;
    gestureState.currentTime = Date.now();
    
    // 计算最终速度
    const timeDelta = gestureState.currentTime - gestureState.startTime;
    if (timeDelta > 0) {
      gestureState.velocityX = gestureState.deltaX / timeDelta;
      gestureState.velocityY = gestureState.deltaY / timeDelta;
    }
    
    // 识别手势
    recognizeGesture();
  }
  
  // 检测滑动方向
  function detectSwipeDirection() {
    // 计算滑动距离
    const absX = Math.abs(gestureState.deltaX);
    const absY = Math.abs(gestureState.deltaY);
    
    // 如果滑动距离足够大，显示方向提示
    if (absX > 50 || absY > 50) {
      let direction = '';
      
      if (absX > absY) {
        // 水平滑动
        direction = gestureState.deltaX > 0 ? '右滑' : '左滑';
      } else {
        // 垂直滑动
        direction = gestureState.deltaY > 0 ? '下滑' : '上滑';
      }
      
      // 显示手势提示
      showGestureHint(direction);
    }
  }
  
  // 显示手势提示
  function showGestureHint(text) {
    const hint = document.getElementById('gesture-hint');
    if (!hint) return;
    
    // 设置提示文本
    hint.textContent = text;
    
    // 显示提示
    hint.classList.add('visible');
    
    // 清除之前的定时器
    if (hint.hideTimeout) {
      clearTimeout(hint.hideTimeout);
    }
    
    // 设置隐藏定时器
    hint.hideTimeout = setTimeout(function() {
      hint.classList.remove('visible');
    }, 1500);
  }
  
  // 识别手势
  function recognizeGesture() {
    // 计算滑动距离和时间
    const absX = Math.abs(gestureState.deltaX);
    const absY = Math.abs(gestureState.deltaY);
    const swipeDistance = Math.max(absX, absY);
    const swipeTime = gestureState.currentTime - gestureState.startTime;
    
    // 检查是否是轻触
    if (swipeDistance < 10 && swipeTime < 300) {
      // 触发轻触事件
      triggerGestureEvent('tap', {
        x: gestureState.startX,
        y: gestureState.startY
      });
      return;
    }
    
    // 检查是否是滑动
    if (swipeDistance > 50) {
      // 确定滑动方向
      if (absX > absY) {
        // 水平滑动
        if (gestureState.deltaX > 0) {
          // 右滑
          triggerGestureEvent('swipeRight', {
            distance: gestureState.deltaX,
            velocity: gestureState.velocityX
          });
          
          // 执行右滑操作
          executeSwipeRightAction();
        } else {
          // 左滑
          triggerGestureEvent('swipeLeft', {
            distance: -gestureState.deltaX,
            velocity: -gestureState.velocityX
          });
          
          // 执行左滑操作
          executeSwipeLeftAction();
        }
      } else {
        // 垂直滑动
        if (gestureState.deltaY > 0) {
          // 下滑
          triggerGestureEvent('swipeDown', {
            distance: gestureState.deltaY,
            velocity: gestureState.velocityY
          });
          
          // 执行下滑操作
          executeSwipeDownAction();
        } else {
          // 上滑
          triggerGestureEvent('swipeUp', {
            distance: -gestureState.deltaY,
            velocity: -gestureState.velocityY
          });
          
          // 执行上滑操作
          executeSwipeUpAction();
        }
      }
    }
  }
  
  // 触发手势事件
  function triggerGestureEvent(type, data) {
    // 创建自定义事件
    const event = new CustomEvent('gesture', {
      detail: {
        type: type,
        ...data
      }
    });
    
    // 触发事件
    document.dispatchEvent(event);
    
    // 调用已注册的回调
    if (registeredGestures[type]) {
      registeredGestures[type].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`手势回调错误 (${type}):`, error);
        }
      });
    }
    
    console.log(`触发手势: ${type}`, data);
  }
  
  // 执行左滑操作
  function executeSwipeLeftAction() {
    // 获取左右滑动参数
    const swipeLeftRightAction = window.websiteParameters && 
                                window.websiteParameters.interaction && 
                                window.websiteParameters.interaction.swipeLeftRight ? 
                                window.websiteParameters.interaction.swipeLeftRight.current : 
                                'navigate';
    
    // 根据参数执行不同操作
    switch (swipeLeftRightAction) {
      case 'navigate':
        // 导航到下一页
        navigateToNextPage();
        break;
      case 'vote':
        // 投票操作（选择下一个选项）
        selectNextVoteOption();
        break;
      case 'none':
        // 无操作
        break;
      default:
        // 默认导航
        navigateToNextPage();
        break;
    }
  }
  
  // 执行右滑操作
  function executeSwipeRightAction() {
    // 获取左右滑动参数
    const swipeLeftRightAction = window.websiteParameters && 
                                window.websiteParameters.interaction && 
                                window.websiteParameters.interaction.swipeLeftRight ? 
                                window.websiteParameters.interaction.swipeLeftRight.current : 
                                'navigate';
    
    // 根据参数执行不同操作
    switch (swipeLeftRightAction) {
      case 'navigate':
        // 导航到上一页
        navigateToPreviousPage();
        break;
      case 'vote':
        // 投票操作（选择上一个选项）
        selectPreviousVoteOption();
        break;
      case 'none':
        // 无操作
        break;
      default:
        // 默认导航
        navigateToPreviousPage();
        break;
    }
  }
  
  // 执行上滑操作
  function executeSwipeUpAction() {
    // 获取上下滑动参数
    const swipeUpDownAction = window.websiteParameters && 
                             window.websiteParameters.interaction && 
                             window.websiteParameters.interaction.swipeUpDown ? 
                             window.websiteParameters.interaction.swipeUpDown.current : 
                             'scroll';
    
    // 根据参数执行不同操作
    switch (swipeUpDownAction) {
      case 'scroll':
        // 向下滚动
        scrollDown();
        break;
      case 'refresh':
        // 无操作（下拉刷新通常是下滑）
        break;
      case 'none':
        // 无操作
        break;
      default:
        // 默认滚动
        scrollDown();
        break;
    }
  }
  
  // 执行下滑操作
  function executeSwipeDownAction() {
    // 获取上下滑动参数
    const swipeUpDownAction = window.websiteParameters && 
                             window.websiteParameters.interaction && 
                             window.websiteParameters.interaction.swipeUpDown ? 
                             window.websiteParameters.interaction.swipeUpDown.current : 
                             'scroll';
    
    // 根据参数执行不同操作
    switch (swipeUpDownAction) {
      case 'scroll':
        // 向上滚动
        scrollUp();
        break;
      case 'refresh':
        // 下拉刷新
        pullToRefresh();
        break;
      case 'none':
        // 无操作
        break;
      default:
        // 默认滚动
        scrollUp();
        break;
    }
  }
  
  // 导航到下一页
  function navigateToNextPage() {
    // 查找下一页按钮
    const nextButton = document.querySelector('.next-page, .next, [data-action="next"]');
    if (nextButton) {
      // 模拟点击
      nextButton.click();
      
      // 显示手势提示
      showGestureHint('下一页');
      
      // 触发触觉反馈
      triggerHapticFeedback('medium');
      
      return true;
    }
    
    // 如果在投票详情页，切换到下一个投票
    if (document.getElementById('poll-detail-section')) {
      // 查找下一个投票
      const nextPoll = findNextPoll();
      if (nextPoll) {
        // 显示下一个投票
        if (typeof window.showPollDetails === 'function') {
          window.showPollDetails(nextPoll.id);
          
          // 显示手势提示
          showGestureHint('下一个投票');
          
          // 触发触觉反馈
          triggerHapticFeedback('medium');
          
          return true;
        }
      }
    }
    
    return false;
  }
  
  // 导航到上一页
  function navigateToPreviousPage() {
    // 查找上一页按钮
    const prevButton = document.querySelector('.prev-page, .prev, [data-action="prev"]');
    if (prevButton) {
      // 模拟点击
      prevButton.click();
      
      // 显示手势提示
      showGestureHint('上一页');
      
      // 触发触觉反馈
      triggerHapticFeedback('medium');
      
      return true;
    }
    
    // 如果在投票详情页，切换到上一个投票
    if (document.getElementById('poll-detail-section')) {
      // 查找上一个投票
      const prevPoll = findPreviousPoll();
      if (prevPoll) {
        // 显示上一个投票
        if (typeof window.showPollDetails === 'function') {
          window.showPollDetails(prevPoll.id);
          
          // 显示手势提示
          showGestureHint('上一个投票');
          
          // 触发触觉反馈
          triggerHapticFeedback('medium');
          
          return true;
        }
      }
    }
    
    // 如果是在详情页，返回列表页
    const backButton = document.querySelector('.back-button, [data-action="back"]');
    if (backButton) {
      // 模拟点击
      backButton.click();
      
      // 显示手势提示
      showGestureHint('返回');
      
      // 触发触觉反馈
      triggerHapticFeedback('medium');
      
      return true;
    }
    
    return false;
  }
  
  // 查找下一个投票
  function findNextPoll() {
    // 如果没有polls数组，返回null
    if (!window.polls || !window.currentPollId) return null;
    
    // 查找当前投票索引
    const currentIndex = window.polls.findIndex(poll => poll.id === window.currentPollId);
    if (currentIndex === -1) return null;
    
    // 查找下一个投票
    if (currentIndex < window.polls.length - 1) {
      return window.polls[currentIndex + 1];
    }
    
    // 如果是最后一个，循环到第一个
    return window.polls[0];
  }
  
  // 查找上一个投票
  function findPreviousPoll() {
    // 如果没有polls数组，返回null
    if (!window.polls || !window.currentPollId) return null;
    
    // 查找当前投票索引
    const currentIndex = window.polls.findIndex(poll => poll.id === window.currentPollId);
    if (currentIndex === -1) return null;
    
    // 查找上一个投票
    if (currentIndex > 0) {
      return window.polls[currentIndex - 1];
    }
    
    // 如果是第一个，循环到最后一个
    return window.polls[window.polls.length - 1];
  }
  
  // 选择下一个投票选项
  function selectNextVoteOption() {
    // 如果不在投票详情页，不处理
    if (!document.getElementById('poll-detail-section')) return false;
    
    // 查找所有选项
    const options = document.querySelectorAll('.poll-option');
    if (!options.length) return false;
    
    // 查找当前选中的选项
    let currentIndex = -1;
    for (let i = 0; i < options.length; i++) {
      if (options[i].classList.contains('selected')) {
        currentIndex = i;
        break;
      }
    }
    
    // 选择下一个选项
    let nextIndex = currentIndex + 1;
    if (nextIndex >= options.length) {
      nextIndex = 0;
    }
    
    // 模拟点击
    options[nextIndex].click();
    
    // 显示手势提示
    showGestureHint('下一个选项');
    
    // 触发触觉反馈
    triggerHapticFeedback('light');
    
    return true;
  }
  
  // 选择上一个投票选项
  function selectPreviousVoteOption() {
    // 如果不在投票详情页，不处理
    if (!document.getElementById('poll-detail-section')) return false;
    
    // 查找所有选项
    const options = document.querySelectorAll('.poll-option');
    if (!options.length) return false;
    
    // 查找当前选中的选项
    let currentIndex = -1;
    for (let i = 0; i < options.length; i++) {
      if (options[i].classList.contains('selected')) {
        currentIndex = i;
        break;
      }
    }
    
    // 选择上一个选项
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = options.length - 1;
    }
    
    // 模拟点击
    options[prevIndex].click();
    
    // 显示手势提示
    showGestureHint('上一个选项');
    
    // 触发触觉反馈
    triggerHapticFeedback('light');
    
    return true;
  }
  
  // 向下滚动
  function scrollDown() {
    // 滚动一屏
    window.scrollBy({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    });
    
    // 显示手势提示
    showGestureHint('向下滚动');
  }
  
  // 向上滚动
  function scrollUp() {
    // 滚动一屏
    window.scrollBy({
      top: -window.innerHeight * 0.8,
      behavior: 'smooth'
    });
    
    // 显示手势提示
    showGestureHint('向上滚动');
  }
  
  // 下拉刷新
  function pullToRefresh() {
    // 如果下拉距离足够大
    if (gestureState.deltaY > 100) {
      // 显示手势提示
      showGestureHint('刷新中...');
      
      // 触发触觉反馈
      triggerHapticFeedback('medium');
      
      // 刷新页面
      location.reload();
      
      return true;
    }
    
    return false;
  }
  
  // 初始化触觉反馈
  function initHapticFeedback() {
    console.log("初始化触觉反馈...");
    
    // 创建触觉反馈参数
    createHapticFeedbackParameters();
    
    console.log("触觉反馈初始化完成");
  }
  
  // 创建触觉反馈参数
  function createHapticFeedbackParameters() {
    // 检查是否有createParameterPoll函数
    if (typeof window.createParameterPoll !== 'function') {
      console.warn("createParameterPoll函数不存在，无法创建触觉反馈参数");
      return;
    }
    
    // 创建交互参数类别（如果不存在）
    if (!window.websiteParameters.interaction) {
      window.websiteParameters.interaction = {};
    }
    
    // 添加触觉反馈参数
    window.websiteParameters.interaction.hapticFeedback = {
      current: 'enabled',
      options: ['enabled', 'disabled'],
      description: '触觉反馈'
    };
    
    // 添加触觉强度参数
    window.websiteParameters.interaction.hapticIntensity = {
      current: 'medium',
      options: ['light', 'medium', 'strong'],
      description: '触觉强度'
    };
    
    // 创建触觉反馈投票
    window.createParameterPoll('interaction', 'hapticFeedback', ['启用触觉', '禁用触觉'], null);
    
    // 创建触觉强度投票
    window.createParameterPoll('interaction', 'hapticIntensity', ['轻微震动', '中等震动', '强烈震动'], null);
    
    console.log("触觉反馈参数已创建");
  }
  
  // 触发触觉反馈
  function triggerHapticFeedback(intensity) {
    // 如果触觉反馈被禁用，不处理
    if (window.websiteParameters && 
        window.websiteParameters.interaction && 
        window.websiteParameters.interaction.hapticFeedback && 
        window.websiteParameters.interaction.hapticFeedback.current === 'disabled') {
      return;
    }
    
    // 获取触觉强度
    const hapticIntensity = window.websiteParameters && 
                           window.websiteParameters.interaction && 
                           window.websiteParameters.interaction.hapticIntensity ? 
                           window.websiteParameters.interaction.hapticIntensity.current : 
                           'medium';
    
    // 如果指定了强度，使用指定的强度
    if (intensity) {
      hapticIntensity = intensity;
    }
    
    // 检查是否支持振动API
    if ('vibrate' in navigator) {
      // 根据强度设置振动时间
      let vibrationTime = 0;
      switch (hapticIntensity) {
        case 'light':
          vibrationTime = 10;
          break;
        case 'medium':
          vibrationTime = 25;
          break;
        case 'strong':
          vibrationTime = 50;
          break;
        default:
          vibrationTime = 25;
          break;
      }
      
      // 触发振动
      navigator.vibrate(vibrationTime);
    }
  }
  
  // 初始化移动端专用布局
  function initMobileLayout() {
    console.log("初始化移动端专用布局...");
    
    // 创建移动端导航
    createMobileNavigation();
    
    // 创建移动端浮动操作按钮
    createMobileFab();
    
    // 创建移动端抽屉菜单
    createMobileDrawer();
    
    // 创建移动端布局参数
    createMobileLayoutParameters();
    
    console.log("移动端专用布局初始化完成");
  }
  
  // 创建移动端导航
  function createMobileNavigation() {
    // 如果不是移动设备或平板，不创建
    if (!deviceInfo.isMobile && !deviceInfo.isTablet) return;
    
    // 检查是否已存在移动端导航
    if (document.querySelector('.nav-menu')) {
      console.log("移动端导航已存在");
      return;
    }
    
    // 创建导航菜单
    const navMenu = document.createElement('div');
    navMenu.className = 'nav-menu';
    navMenu.innerHTML = `
      <div class="nav-menu-item" data-action="home">
        <div class="nav-menu-icon">🏠</div>
        <div class="nav-menu-label">首页</div>
      </div>
      <div class="nav-menu-item" data-action="polls">
        <div class="nav-menu-icon">📊</div>
        <div class="nav-menu-label">投票</div>
      </div>
      <div class="nav-menu-item" data-action="create">
        <div class="nav-menu-icon">➕</div>
        <div class="nav-menu-label">创建</div>
      </div>
      <div class="nav-menu-item" data-action="profile">
        <div class="nav-menu-icon">👤</div>
        <div class="nav-menu-label">我的</div>
      </div>
    `;
    
    // 添加到文档
    document.body.appendChild(navMenu);
    
    // 添加点击事件
    navMenu.querySelectorAll('.nav-menu-item').forEach(item => {
      item.addEventListener('click', function() {
        const action = this.dataset.action;
        
        // 触发触觉反馈
        triggerHapticFeedback('light');
        
        // 执行操作
        switch (action) {
          case 'home':
            // 返回首页
            if (typeof window.showHomePage === 'function') {
              window.showHomePage();
            } else {
              document.getElementById('home-tab').click();
            }
            break;
          case 'polls':
            // 显示投票列表
            if (typeof window.showPollsList === 'function') {
              window.showPollsList();
            } else {
              document.getElementById('polls-tab').click();
            }
            break;
          case 'create':
            // 创建新投票
            if (typeof window.showCreatePollForm === 'function') {
              window.showCreatePollForm();
            } else {
              document.getElementById('create-tab').click();
            }
            break;
          case 'profile':
            // 显示个人资料
            if (typeof window.showUserProfile === 'function') {
              window.showUserProfile();
            } else {
              document.getElementById('profile-tab').click();
            }
            break;
        }
      });
    });
    
    // 添加内容区域类名
    document.getElementById('app') && document.getElementById('app').classList.add('content-area');
    document.getElementById('main') && document.getElementById('main').classList.add('content-area');
    document.getElementById('content') && document.getElementById('content').classList.add('content-area');
    
    console.log("移动端导航已创建");
  }
  
  // 创建移动端浮动操作按钮
  function createMobileFab() {
    // 如果不是移动设备或平板，不创建
    if (!deviceInfo.isMobile && !deviceInfo.isTablet) return;
    
    // 检查是否已存在浮动操作按钮
    if (document.querySelector('.mobile-fab')) {
      console.log("移动端浮动操作按钮已存在");
      return;
    }
    
    // 创建浮动操作按钮
    const fab = document.createElement('div');
    fab.className = 'mobile-fab';
    fab.innerHTML = '<div class="mobile-fab-icon">+</div>';
    
    // 添加到文档
    document.body.appendChild(fab);
    
    // 添加点击事件
    fab.addEventListener('click', function() {
      // 触发触觉反馈
      triggerHapticFeedback('medium');
      
      // 创建新投票
      if (typeof window.showCreatePollForm === 'function') {
        window.showCreatePollForm();
      } else {
        // 尝试点击创建按钮
        const createButton = document.querySelector('[data-action="create"], #create-button, .create-button');
        if (createButton) {
          createButton.click();
        }
      }
    });
    
    console.log("移动端浮动操作按钮已创建");
  }
  
  // 创建移动端抽屉菜单
  function createMobileDrawer() {
    // 如果不是移动设备或平板，不创建
    if (!deviceInfo.isMobile && !deviceInfo.isTablet) return;
    
    // 检查是否已存在抽屉菜单
    if (document.querySelector('.mobile-drawer')) {
      console.log("移动端抽屉菜单已存在");
      return;
    }
    
    // 创建抽屉菜单
    const drawer = document.createElement('div');
    drawer.className = 'mobile-drawer';
    drawer.innerHTML = `
      <div class="drawer-header">
        <h3>菜单</h3>
      </div>
      <div class="drawer-content">
        <ul class="drawer-menu">
          <li class="drawer-menu-item" data-action="home">首页</li>
          <li class="drawer-menu-item" data-action="polls">投票列表</li>
          <li class="drawer-menu-item" data-action="create">创建投票</li>
          <li class="drawer-menu-item" data-action="profile">个人资料</li>
          <li class="drawer-menu-item" data-action="settings">设置</li>
          <li class="drawer-menu-item" data-action="about">关于</li>
        </ul>
      </div>
    `;
    
    // 创建抽屉菜单遮罩
    const overlay = document.createElement('div');
    overlay.className = 'mobile-drawer-overlay';
    
    // 添加到文档
    document.body.appendChild(drawer);
    document.body.appendChild(overlay);
    
    // 添加抽屉菜单项点击事件
    drawer.querySelectorAll('.drawer-menu-item').forEach(item => {
      item.addEventListener('click', function() {
        const action = this.dataset.action;
        
        // 触发触觉反馈
        triggerHapticFeedback('light');
        
        // 关闭抽屉菜单
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        
        // 执行操作
        switch (action) {
          case 'home':
            // 返回首页
            if (typeof window.showHomePage === 'function') {
              window.showHomePage();
            } else {
              document.getElementById('home-tab').click();
            }
            break;
          case 'polls':
            // 显示投票列表
            if (typeof window.showPollsList === 'function') {
              window.showPollsList();
            } else {
              document.getElementById('polls-tab').click();
            }
            break;
          case 'create':
            // 创建新投票
            if (typeof window.showCreatePollForm === 'function') {
              window.showCreatePollForm();
            } else {
              document.getElementById('create-tab').click();
            }
            break;
          case 'profile':
            // 显示个人资料
            if (typeof window.showUserProfile === 'function') {
              window.showUserProfile();
            } else {
              document.getElementById('profile-tab').click();
            }
            break;
          case 'settings':
            // 显示设置
            if (typeof window.showSettings === 'function') {
              window.showSettings();
            } else {
              document.getElementById('settings-tab').click();
            }
            break;
          case 'about':
            // 显示关于
            if (typeof window.showAbout === 'function') {
              window.showAbout();
            } else {
              document.getElementById('about-tab').click();
            }
            break;
        }
      });
    });
    
    // 添加遮罩点击事件
    overlay.addEventListener('click', function() {
      // 关闭抽屉菜单
      drawer.classList.remove('open');
      overlay.classList.remove('open');
    });
    
    // 添加左滑手势打开抽屉菜单
    document.addEventListener('gesture', function(e) {
      if (e.detail.type === 'swipeRight' && e.detail.distance > 100 && e.detail.velocity > 0.5) {
        // 打开抽屉菜单
        drawer.classList.add('open');
        overlay.classList.add('open');
        
        // 触发触觉反馈
        triggerHapticFeedback('medium');
      }
    });
    
    // 添加抽屉菜单样式
    const style = document.createElement('style');
    style.textContent = `
      .drawer-header {
        padding: 20px;
        border-bottom: 1px solid #eee;
      }
      
      .drawer-header h3 {
        margin: 0;
        font-size: 18px;
      }
      
      .drawer-content {
        padding: 20px 0;
      }
      
      .drawer-menu {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .drawer-menu-item {
        padding: 15px 20px;
        border-bottom: 1px solid #eee;
        cursor: pointer;
      }
      
      .drawer-menu-item:active {
        background-color: rgba(0, 0, 0, 0.05);
      }
      
      .dark-mode .drawer-header {
        border-bottom-color: #444;
      }
      
      .dark-mode .drawer-menu-item {
        border-bottom-color: #444;
      }
      
      .dark-mode .drawer-menu-item:active {
        background-color: rgba(255, 255, 255, 0.05);
      }
    `;
    
    document.head.appendChild(style);
    
    console.log("移动端抽屉菜单已创建");
  }
  
  // 创建移动端布局参数
  function createMobileLayoutParameters() {
    // 检查是否有createParameterPoll函数
    if (typeof window.createParameterPoll !== 'function') {
      console.warn("createParameterPoll函数不存在，无法创建移动端布局参数");
      return;
    }
    
    // 创建交互参数类别（如果不存在）
    if (!window.websiteParameters.interaction) {
      window.websiteParameters.interaction = {};
    }
    
    // 添加移动端导航参数
    window.websiteParameters.interaction.mobileNavigation = {
      current: 'bottom',
      options: ['bottom', 'top', 'none'],
      description: '移动端导航'
    };
    
    // 添加移动端浮动按钮参数
    window.websiteParameters.interaction.mobileFab = {
      current: 'enabled',
      options: ['enabled', 'disabled'],
      description: '移动端浮动按钮'
    };
    
    // 添加移动端抽屉菜单参数
    window.websiteParameters.interaction.mobileDrawer = {
      current: 'left',
      options: ['left', 'right', 'none'],
      description: '移动端抽屉菜单'
    };
    
    // 创建移动端导航投票
    window.createParameterPoll('interaction', 'mobileNavigation', ['底部导航', '顶部导航', '无导航'], null);
    
    // 创建移动端浮动按钮投票
    window.createParameterPoll('interaction', 'mobileFab', ['显示浮动按钮', '隐藏浮动按钮'], null);
    
    // 创建移动端抽屉菜单投票
    window.createParameterPoll('interaction', 'mobileDrawer', ['左侧抽屉', '右侧抽屉', '无抽屉'], null);
    
    console.log("移动端布局参数已创建");
  }
  
  // 处理窗口大小变化
  function handleWindowResize() {
    // 重新检测设备类型
    detectDeviceType();
    
    // 更新移动端布局
    updateMobileLayout();
  }
  
  // 处理设备方向变化
  function handleOrientationChange() {
    // 重新检测设备类型
    detectDeviceType();
    
    // 更新移动端布局
    updateMobileLayout();
  }
  
  // 更新移动端布局
  function updateMobileLayout() {
    // 如果不是移动设备或平板，不更新
    if (!deviceInfo.isMobile && !deviceInfo.isTablet) return;
    
    // 获取移动端导航参数
    const mobileNavigation = window.websiteParameters && 
                            window.websiteParameters.interaction && 
                            window.websiteParameters.interaction.mobileNavigation ? 
                            window.websiteParameters.interaction.mobileNavigation.current : 
                            'bottom';
    
    // 获取移动端浮动按钮参数
    const mobileFab = window.websiteParameters && 
                     window.websiteParameters.interaction && 
                     window.websiteParameters.interaction.mobileFab ? 
                     window.websiteParameters.interaction.mobileFab.current : 
                     'enabled';
    
    // 获取移动端抽屉菜单参数
    const mobileDrawer = window.websiteParameters && 
                        window.websiteParameters.interaction && 
                        window.websiteParameters.interaction.mobileDrawer ? 
                        window.websiteParameters.interaction.mobileDrawer.current : 
                        'left';
    
    // 更新导航位置
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
      navMenu.classList.remove('top', 'bottom', 'hidden');
      
      switch (mobileNavigation) {
        case 'bottom':
          navMenu.classList.add('bottom');
          navMenu.style.display = '';
          break;
        case 'top':
          navMenu.classList.add('top');
          navMenu.style.display = '';
          break;
        case 'none':
          navMenu.style.display = 'none';
          break;
      }
    }
    
    // 更新浮动按钮
    const fab = document.querySelector('.mobile-fab');
    if (fab) {
      fab.style.display = mobileFab === 'enabled' ? '' : 'none';
    }
    
    // 更新抽屉菜单
    const drawer = document.querySelector('.mobile-drawer');
    if (drawer) {
      drawer.classList.remove('left', 'right', 'hidden');
      
      switch (mobileDrawer) {
        case 'left':
          drawer.classList.add('left');
          drawer.style.display = '';
          break;
        case 'right':
          drawer.classList.add('right');
          drawer.style.display = '';
          break;
        case 'none':
          drawer.style.display = 'none';
          break;
      }
    }
  }
  
  // 在DOM加载完成后初始化
  document.addEventListener('DOMContentLoaded', function() {
    console.log("初始化移动端体验优化模块...");
    
    // 延迟初始化，确保其他模块已加载
    setTimeout(function() {
      initMobileExperience();
    }, 1000);
  });
  
  // 导出公共API
  window.MobileExperience = {
    // 设备信息
    getDeviceInfo: function() {
      return { ...deviceInfo };
    },
    
    // 注册手势回调
    registerGesture: function(type, callback) {
      if (registeredGestures[type]) {
        registeredGestures[type].push(callback);
        return true;
      }
      return false;
    },
    
    // 取消注册手势回调
    unregisterGesture: function(type, callback) {
      if (registeredGestures[type]) {
        const index = registeredGestures[type].indexOf(callback);
        if (index !== -1) {
          registeredGestures[type].splice(index, 1);
          return true;
        }
      }
      return false;
    },
    
    // 触发触觉反馈
    triggerHapticFeedback: triggerHapticFeedback,
    
    // 显示手势提示
    showGestureHint: showGestureHint,
    
    // 打开抽屉菜单
    openDrawer: function() {
      const drawer = document.querySelector('.mobile-drawer');
      const overlay = document.querySelector('.mobile-drawer-overlay');
      if (drawer && overlay) {
        drawer.classList.add('open');
        overlay.classList.add('open');
        return true;
      }
      return false;
    },
    
    // 关闭抽屉菜单
    closeDrawer: function() {
      const drawer = document.querySelector('.mobile-drawer');
      const overlay = document.querySelector('.mobile-drawer-overlay');
      if (drawer && overlay) {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        return true;
      }
      return false;
    }
  };
})();
