// 直接在app.js中添加投票删除功能
// 投票删除功能
function deletePoll(pollId) {
  // 查找要删除的投票在数组中的索引
  const pollIndex = polls.findIndex(poll => poll.id === pollId);
  
  // 如果找到了投票，则从数组中删除
  if (pollIndex !== -1) {
    // 记录删除操作
    console.log(`删除投票: ID=${pollId}, 标题="${polls[pollIndex].title}"`);
    
    // 从数组中删除投票
    polls.splice(pollIndex, 1);
    
    // 保存更新后的投票列表
    savePolls();
    
    // 重新渲染投票列表
    renderPolls();
    
    return true;
  } else {
    console.error(`删除失败: 未找到ID为${pollId}的投票`);
    return false;
  }
}

// 根据标题查找投票
function findPollByTitle(title) {
  return polls.find(poll => poll.title === title || poll.title.includes(title));
}

// 删除与网站设计理念无关的投票
function deleteIrrelevantPolls() {
  // 要删除的投票标题
  const irrelevantTitles = ['最喜欢的编程语言', '最佳前端框架'];
  
  // 记录删除操作开始
  console.log('开始删除与网站设计理念无关的投票...');
  
  // 存储删除结果
  const results = {
    success: [],
    failed: []
  };
  
  // 遍历要删除的标题
  irrelevantTitles.forEach(title => {
    const poll = findPollByTitle(title);
    
    if (poll) {
      const success = deletePoll(poll.id);
      if (success) {
        results.success.push(title);
      } else {
        results.failed.push(title);
      }
    } else {
      console.error(`未找到标题包含"${title}"的投票`);
      results.failed.push(title);
    }
  });
  
  // 记录删除操作结果
  console.log(`删除操作完成: 成功=${results.success.length}, 失败=${results.failed.length}`);
  console.log('成功删除的投票:', results.success);
  if (results.failed.length > 0) {
    console.log('删除失败的投票:', results.failed);
  }
  
  // 显示删除结果通知
  if (typeof showParameterNotification === 'function' && results.success.length > 0) {
    showParameterNotification(
      '投票清理完成',
      `已成功删除${results.success.length}个与网站设计理念无关的投票。网站现在只包含参数相关的投票，完全符合"由用户投票驱动参数的系统"的核心理念。`
    );
  }
  
  return results;
}

// 在文档加载完成后执行删除操作
document.addEventListener('DOMContentLoaded', function() {
  console.log('正在检查与网站设计理念无关的投票...');
  
  // 确保polls数组已加载
  setTimeout(() => {
    if (polls && polls.length > 0) {
      deleteIrrelevantPolls();
    } else {
      console.log('投票数据尚未加载，稍后再尝试删除');
      setTimeout(() => {
        if (polls && polls.length > 0) {
          deleteIrrelevantPolls();
        } else {
          console.error('无法加载投票数据，删除操作取消');
        }
      }, 3000);
    }
  }, 1000);
});
