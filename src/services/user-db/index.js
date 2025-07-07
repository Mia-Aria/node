const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const logger = require('../../utils/logger');
const config = require('../../../config/default.json');

module.exports = (app) => {
  // MongoDB 配置 也可以写到 config 文件夹中
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = 'user';
  
  let dbClient;
  let db;

  // 连接数据库的函数
  async function connectToDatabase() {
    if (db) return db;
    
    try {
      dbClient = new MongoClient(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
      await dbClient.connect();
      db = dbClient.db(dbName);
      logger.info('成功连接到 MongoDB');
      return db;
    } catch (error) {
      logger.error('MongoDB 连接失败:', error);
      process.exit(1);
    }
  }

  // 用户路由处理函数
  const userHandlers = {
    // 获取所有用户
    getUsers: async (req, res) => {
      try {
        const users = await db.collection('users').find().toArray();
        
        res.json({
          status: 'success',
          data: users
        });
      } catch (error) {
        logger.error('获取用户列表失败:', error);
        res.status(500).json({
          status: 'error',
          message: '获取用户列表失败'
        });
      }
    },

    // 获取单个用户
    getUserById: async (req, res) => {
      try {
        const user = await db.collection('users').findOne({ 
          _id: new ObjectId(req.params.id) 
        });
        
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
        logger.error('获取用户信息失败:', error);
        res.status(500).json({
          status: 'error',
          message: '获取用户信息失败'
        });
      }
    },

    // 创建用户
    createUser: async (req, res) => {
      try {
        const newUser = req.body;
        
        if (!newUser.name || !newUser.email) {
          return res.status(400).json({
            status: 'error',
            message: '姓名和邮箱是必填字段'
          });
        }
        
        const result = await db.collection('users').insertOne(newUser);
        const createdUser = {
          _id: result.insertedId,
          ...newUser
        };
        
        res.status(201).json({
          status: 'success',
          data: createdUser
        });
      } catch (error) {
        logger.error('创建用户失败:', error);
        res.status(500).json({
          status: 'error',
          message: '创建用户失败'
        });
      }
    }
  };

  // 初始化服务
  (async () => {
    try {
      // 连接数据库
      await connectToDatabase();
      
      // 创建子路由
      const router = express.Router();
      
      // 用户路由
      router.get('/users', userHandlers.getUsers);
      router.get('/users/:id', userHandlers.getUserById);
      router.post('/users', userHandlers.createUser);
      
      // 将服务路由挂载到主应用
      app.use('/api', router);
      
      logger.info('用户服务已加载');
      
      // 优雅关闭处理
      const gracefulShutdown = async () => {
        logger.info('正在关闭 MongoDB 连接...');
        if (dbClient) {
          await dbClient.close();
          logger.info('MongoDB 连接已关闭');
        }
        process.exit(0);
      };
      
      process.on('SIGTERM', gracefulShutdown);
      process.on('SIGINT', gracefulShutdown);
      
    } catch (error) {
      logger.error('用户服务初始化失败:', error);
      process.exit(1);
    }
  })();
};