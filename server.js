const express = require('express');
const app = express();
const PORT = 3001;

// 中间件：解析 JSON 请求体
app.use(express.json());

// 根路由
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    data: {
      message: 'Welcome to our API!',
      version: '1.0.0'
    }
  });
});

// 用户路由
app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ];
  
  res.json({
    status: 'success',
    data: users
  });
});

// 带参数的路由
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  
  // 模拟数据库查找
  const user = { id: userId, name: `User ${userId}` };
  
  res.json({
    status: 'success',
    data: user
  });
});

// POST 请求示例
app.post('/api/users', (req, res) => {
  const newUser = req.body; // 从请求体获取数据
  
  // 模拟创建用户
  const createdUser = {
    id: Math.floor(Math.random() * 1000),
    ...newUser
  };
  
  res.status(201).json({
    status: 'success',
    data: createdUser
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Not Found'
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log(`- GET http://localhost:${PORT}/`);
  console.log(`- GET http://localhost:${PORT}/api/users`);
  console.log(`- GET http://localhost:${PORT}/api/users/1`);
  console.log(`- POST http://localhost:${PORT}/api/users`);
});