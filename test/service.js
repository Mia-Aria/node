/*
 * @Author: gaoyang334 gaoyang334@jd.com
 * @Date: 2025-06-28 15:18:56
 * @LastEditors: gaoyang334 gaoyang334@jd.com
 * @LastEditTime: 2025-07-07 14:51:29
 * @FilePath: /node-be/server.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
require('dotenv').config(); // 添加在文件最顶部
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb'); // 新增 MongoDB 客户端
const { ObjectId } = require('mongodb');

const app = express();
const PORT = 4000;

// 在入口文件顶部加载环境变量
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.development' });
} else {
  require('dotenv').config();
}

// MongoDB 连接配置
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'user';

// 数据库连接客户端
let dbClient;
let db;

// 连接数据库的函数
// 异步函数，连接到数据库
async function connectToDatabase() {
  // 如果已经连接到数据库，则直接返回
  if (db) return db;
  
  try {
    // 创建一个新的 MongoClient 实例，连接到 MongoDB
    dbClient = new MongoClient(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    // 等待连接成功
    await dbClient.connect();
    // 连接成功后，获取数据库实例
    db = dbClient.db(dbName);
    // 打印连接成功的消息
    console.log('成功连接到 MongoDB');
    // 返回数据库实例
    return db;
  } catch (error) {
    // 如果连接失败，打印错误信息，并退出程序
    console.error('MongoDB 连接失败:', error);
    process.exit(1);
  }
}

// 在应用启动时连接数据库
connectToDatabase().then(database => {
  db = database;
  console.log('已经连接到 MongoDB');
}).catch(() => {
  console.error('无法连接到 MongoDB');
});

// 中间件：解析 JSON 请求体
app.use(express.json());
app.use(cors());

// 添加数据库对象到请求对象中
app.use((req, res, next) => {
  req.db = db;
  next();
});

// 导入路由
// 用户路由 - 现在使用真实的 MongoDB
app.get('/api/users', async (req, res) => {
  try {
    const users = await req.db.collection('users').find().toArray();
    
    res.json({
      status: 'success',
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: '获取用户列表失败'
    });
  }
});

// 带参数的路由
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await req.db.collection('users').findOne({ _id:new ObjectId(userId) });
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: '用户未找到'
      });
    }
    
    res.json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: '获取用户信息失败'
    });
  }
});

// POST 请求示例 - 现在会真实存储到数据库
app.post('/api/users', async (req, res) => {
  try {
    const newUser = req.body;
    
    // 简单的数据验证
    if (!newUser.name || !newUser.email) {
      return res.status(400).json({
        status: 'error',
        message: '姓名和邮箱是必填字段'
      });
    }
    
    const result = await req.db.collection('users').insertOne(newUser);
    const createdUser = {
      _id: result.insertedId,
      ...newUser
    };
    
    res.status(201).json({
      status: 'success',
      data: createdUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: '创建用户失败'
    });
  }
});

// 添加关闭数据库连接的逻辑
// 启动服务器
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log(`- GET http://localhost:${PORT}/`);
  console.log(`- GET http://localhost:${PORT}/api/users`);
  console.log(`- GET http://localhost:${PORT}/api/users/1`);
  console.log(`- POST http://localhost:${PORT}/api/users`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('HTTP server closed');
    if (dbClient) {
      dbClient.close();
      console.log('MongoDB connection closed');
    }
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully');
  server.close(() => {
    console.log('HTTP server closed');
    if (dbClient) {
      dbClient.close();
      console.log('MongoDB connection closed');
    }
    process.exit(0);
  });
});