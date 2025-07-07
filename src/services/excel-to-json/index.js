/*
 * @Author: gaoyang334 gaoyang334@jd.com
 * @Date: 2025-07-07 14:28:03
 * @LastEditors: gaoyang334 gaoyang334@jd.com
 * @LastEditTime: 2025-07-07 14:45:26
 * @FilePath: /node-be/services/excel-to-json.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const logger = require('../../utils/logger');

// 配置上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // NODE无法直接识别 ~ 需要用os模块
    const os = require('os');
    const filePath = path.join(os.homedir(), 'Downloads', '/');
    cb(null, filePath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

module.exports = (app) => {
  // Excel 转 JSON 路由
  app.post('/api/excel-to-json', upload.single('excelFile'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);

      logger.info(`Converted ${req.file.originalname} to JSON`);
      
      res.json({
        filename: req.file.originalname,
        data: jsonData
      });
    } catch (error) {
      logger.error(`Excel conversion error: ${error.message}`);
      res.status(500).json({ error: 'Error converting file' });
    }
  });

  logger.info('Excel to JSON service loaded');
};