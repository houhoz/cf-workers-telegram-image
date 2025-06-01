# Telegram 图片上传工具

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/vite-react-template)

一个基于 Cloudflare Workers 的图片上传工具，可以将图片直接上传到 Telegram 频道或群组，并获取图片的 file_id，方便后续使用。

## ✨ 功能特点

- 🖼️ 图片上传预览 - 选择图片后可在上传前预览
- 🚀 一键上传到 Telegram - 直接发送图片到配置的 Telegram 频道/群组
- 📋 自动获取 file_id - 上传成功后显示图片信息和 file_id，支持一键复制
- 🌐 全球加速 - 基于 Cloudflare Workers 的全球边缘网络，上传速度更快
- 🔒 安全可靠 - 使用 Telegram Bot API，无需存储图片，安全且稳定

## 🛠️ 技术栈

- [**React**](https://react.dev/) - 用户界面库
- [**Vite**](https://vite.dev/) - 前端构建工具
- [**Hono**](https://hono.dev/) - 轻量级后端框架
- [**Cloudflare Workers**](https://developers.cloudflare.com/workers/) - 边缘计算平台
- [**TailwindCSS**](https://tailwindcss.com/) - 实用优先的 CSS 框架

## 🚀 快速开始

### 本地开发

1. 克隆项目并安装依赖：

```bash
git clone https://github.com/yourusername/cf-workers-telegram-image.git
cd cf-workers-telegram-image
npm install
```

2. 创建 `.dev.vars` 文件，添加以下环境变量：

```
TG_BOT_TOKEN=your_telegram_bot_token
TG_CHAT_ID=your_telegram_chat_id
```

3. 启动开发服务器：

```bash
npm run dev
```

应用将在 [http://localhost:5173](http://localhost:5173) 上运行。

### 部署到 Cloudflare Workers

1. 构建项目：

```bash
npm run build
```

2. 配置 Cloudflare Workers 密钥：

```bash
wrangler secret put TG_BOT_TOKEN
# 输入你的 Telegram Bot Token

wrangler secret put TG_CHAT_ID
# 输入你的 Telegram Chat ID
```

3. 部署到 Cloudflare Workers：

```bash
npm run deploy
```

## ⚙️ 配置说明

### 必要配置

| 环境变量 | 说明 |
|---------|------|
| `TG_BOT_TOKEN` | Telegram Bot 的 API Token，可以从 [@BotFather](https://t.me/BotFather) 获取 |
| `TG_CHAT_ID` | 目标 Telegram 频道或群组的 ID，可以使用 [@userinfobot](https://t.me/userinfobot) 获取 |

### Telegram Bot 设置

1. 在 Telegram 中联系 [@BotFather](https://t.me/BotFather) 创建一个新的机器人
2. 获取 API Token
3. 将机器人添加到你的目标频道或群组，并授予管理员权限（至少需要发送消息权限）

## 📝 使用方法

1. 打开应用后，点击"选择图片"按钮上传本地图片
2. 上传前可以预览图片
3. 点击"上传到 Telegram"按钮将图片发送到配置的 Telegram 频道/群组
4. 上传成功后，可以查看图片信息并复制 file_id 供其他应用使用

## 🤝 贡献

欢迎提交 Issue 或 Pull Request 来改进这个项目！

## 📄 许可证

MIT

## 🔗 相关资源

- [Telegram Bot API 文档](https://core.telegram.org/bots/api)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Hono 文档](https://hono.dev/)
