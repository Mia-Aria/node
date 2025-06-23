const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// 允许 JSON 请求体解析
app.use(express.json());

/**
 * 创建/修改桌面文件
 * 请求示例：POST http://localhost:3001/create-file
 * Body: { "content": "Hello, World!" }
 */
app.post('/create-file', (req, res) => {
  try {
    const desktopPath = path.join(require('os').homedir(), 'Desktop'); // 获取桌面路径
    const filePath = path.join(desktopPath, 'test.txt'); // 文件路径

    // 写入文件（如果文件不存在会自动创建）
    fs.writeFileSync(filePath, req.body.content || 'Default content');

    res.json({ success: true, message: `文件已创建/修改: ${filePath}` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 启动服务
app.listen(PORT, '0.0.0.0', () => {
    console.log(`服务已启动: http://0.0.0.0:${PORT}`);
});