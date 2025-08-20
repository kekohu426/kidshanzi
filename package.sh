# 打包脚本

# 创建发布包
echo "📦 正在创建项目发布包..."

# 清理旧文件
rm -rf hanzi-kids-release.tar.gz

# 清理不必要的文件
rm -rf node_modules/.cache
rm -rf .vite
rm -rf dist

# 创建空目录结构
mkdir -p public/images

# 打包所有必要文件
tar -czf ../hanzi-kids-release.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='.DS_Store' \
  --exclude='dist' \
  .

echo "✅ 项目包创建完成：hanzi-kids-release.tar.gz"
echo "📁 包含内容："
echo "  - 源代码 (src/)"
echo "  - 配置文件 (package.json, vite.config.ts 等)"
echo "  - 数据文件 (public/data/chars.json)"
echo "  - 文档 (README.md, DEPLOYMENT.md 等)"
echo "  - 工具脚本 (scripts/)"
echo ""
echo "🚀 使用方法："
echo "  1. 解压：tar -xzf hanzi-kids-release.tar.gz"
echo "  2. 进入目录：cd hanzi-kids"
echo "  3. 安装依赖：npm install"
echo "  4. 启动开发：npm run dev"
echo "  5. 构建生产：npm run build"
