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
    // 检查文件是否存在
    if (!fs.existsSync(FILE_PATH)) {
      return res.status(404).json({ success: false, error: '文件不存在' });
    }

    // 设置下载文件名（可选，默认使用服务器上的文件名）
    const downloadName = req.query.filename || 'downloaded-file.txt';

    // 返回文件供下载
    res.download(FILE_PATH, downloadName, (err) => {
      if (err) {
        console.error('下载失败:', err);
        res.status(500).json({ success: false, error: '文件下载失败' });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 启动服务
app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务已启动: http://0.0.0.0:${PORT}`);
});