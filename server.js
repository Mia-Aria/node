const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// 允许 JSON 请求体解析（可选）
app.use(express.json());

// 存放文件的目录（确保存在）
const FILE_DIR = path.join(__dirname, 'files');
const FILE_PATH = path.join(FILE_DIR, 'example.txt');

// 初始化文件（如果不存在）
if (!fs.existsSync(FILE_DIR)) {
  fs.mkdirSync(FILE_DIR, { recursive: true });
}

// 写入默认内容（可选）
if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, '这是默认的文本文件内容\n欢迎下载！');
}

/**
 * 提供文件下载
 * 访问示例：GET http://your-server-ip:3001/download
 */
app.get('/download', (req, res) => {
    try {
      const filePath = path.join(FILE_DIR, 'example.txt');
      
      // 设置下载头
      res.setHeader('Content-Disposition', 'attachment; filename="example.txt"');
      res.setHeader('Content-Type', 'text/plain');
  
      // 发送文件
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// 启动服务
app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务已启动: http://0.0.0.0:${PORT}`);
});