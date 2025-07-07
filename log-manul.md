<!--
 * @Author: gaoyang334 gaoyang334@jd.com
 * @Date: 2025-07-07 15:08:09
 * @LastEditors: gaoyang334 gaoyang334@jd.com
 * @LastEditTime: 2025-07-07 15:08:58
 * @FilePath: /node-be/log-manul.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# MongoDB 无法启动
1. 首次运行MongoDB时，需要初始化数据库目录
mkdir -p ~/data/db
2. 然后执行
mongod --dbpath ~/data/db

