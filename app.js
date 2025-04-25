// 网站参数配置
const websiteParameters = {
  // 界面参数
  ui: {
    // 颜色方案
    colorScheme: {
      current: 'blue',
      options: ['blue', 'green', 'purple', 'orange', 'dark'],
      description: '网站的主色调'
    },
    // 字体大小
    fontSize: {
      current: 'medium',
      options: ['small', 'medium', 'large', 'extra-large'],
      description: '网站的文字大小'
    },
    // 布局方式
    layout: {
      current: 'standard',
      options: ['standard', 'compact', 'wide', 'minimal'],
      description: '网站的整体布局'
    }
  },
  
  // 功能参数
  features: {
    // 是否启用暗黑模式
    darkMode: {
      current: 'disabled',
      options: ['enabled', 'disabled', 'auto'],
      description: '暗黑模式设置'
    },
    // 是否显示投票结果实时更新
    liveResults: {
      current: 'enabled',
      options: ['enabled', 'disabled'],
      description: '实时显示投票结果'
    },
    // 是否允许匿名投票
    anonymousVoting: {
      current: 'disabled',
      options: ['enabled', 'disabled'],
      description: '允许未登录用户投票'
    }
  },
  
  // 系统参数
  system: {
    // 投票结束后自动执行结果的时间
    autoExecuteDelay: {
      current: 'immediate',
      options: ['immediate', '1hour', '1day', 'manual'],
      description: '投票结束后执行结果的时间'
    },
    // 每个用户可创建的最大投票数
    maxPollsPerUser: {
      current: '5',
      options: ['3', '5', '10', 'unlimited'],
      description: '每个用户可创建的最大投票数'
    },
    // 投票持续的默认时间
    defaultPollDuration: {
      current: '7days',
      options: ['30seconds', '1day', '3days', '7days', '14days', '30days'],
      description: '新投票的默认持续时间'
    }
  }
};

// MongoDB连接信息
const MONGODB_URI = "mongodb+srv://jorfylin62:<3391483j>@cluster0.ywxdqb7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "voting_app";

// 用户状态管理
let currentUser = null;
let polls = [];
let currentPollId = null;
let authToken = null; // 添加认证令牌

// DOM元素
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const createPollSection = document.getElementById('create-poll-section');
const pollsListSection = document.getElementById('polls-list-section');
const pollDetailSection = document.getElementById('poll-detail-section');
const parameterSection = document.getElementById('parameter-section');

const usernameDisplay = document.getElementById('username-display');
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');
const logoutButton = document.getElementById('logout-button');
const paramNavButton = document.getElementById('parameter-nav-button');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const createPollForm = document.getElementById('create-poll-form');
const addOptionButton = document.getElementById('add-option');
const pollOptions = document.getElementById('poll-options');
const pollsContainer = document.getElementById('polls-container');
const backToPollsButton = document.getElementById('back-to-polls');
