<!--
 * @Author: gaoyang334 gaoyang334@jd.com
 * @Date: 2025-07-07 14:44:02
 * @LastEditors: gaoyang334 gaoyang334@jd.com
 * @LastEditTime: 2025-07-07 14:50:50
 * @FilePath: /node-be/README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# Node.js 项目结构示例
my-node-project/
├── .gitignore
├── package.json
├── README.md
├── config/                # 配置文件
│   ├── default.json
│   └── production.json
├── src/                   # 主源代码
│   ├── services/          # 各个服务
│   │   ├── excel-to-json/ # Excel转JSON服务
│   │   └── other-service/ # 你的其他服务
│   ├── utils/             # 共享工具函数
│   ├── middlewares/       # Express中间件
│   └── app.js             # 主应用入口
├── tests/                 # 测试代码
├── scripts/               # 部署/构建脚本
└── public/                # 静态文件（如果有前端）