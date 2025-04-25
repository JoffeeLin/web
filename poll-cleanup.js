// 更新index.html以引入投票删除功能
document.addEventListener('DOMContentLoaded', function() {
  // 检查是否已经加载了poll-deletion.js
  if (typeof deletePoll === 'undefined') {
    console.log('加载投票删除功能...');
    
    // 创建script元素
    const script = document.createElement('script');
    script.src = 'poll-deletion.js';
    script.onload = function() {
      console.log('投票删除功能加载完成');
      
      // 删除与网站设计理念无关的投票
      if (typeof deleteIrrelevantPolls === 'function') {
        const results = deleteIrrelevantPolls();
        console.log('删除结果:', results);
        
        // 显示删除结果通知
        if (typeof showParameterNotification === 'function') {
          if (results.success.length > 0) {
            showParameterNotification(
              '投票清理完成',
              `已成功删除${results.success.length}个与网站设计理念无关的投票。网站现在只包含参数相关的投票，完全符合"由用户投票驱动参数的系统"的核心理念。`
            );
          }
        }
      }
    };
    
    // 将script元素添加到文档
    document.head.appendChild(script);
  }
});
