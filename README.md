# Jianhua Web 项目

一个基于 React、TypeScript 和 Vite 的现代化 Web 应用程序。

## 项目概述

这是一个使用最新技术栈构建的 Web 应用程序，具有以下特点：

- 🚀 **Vite** 作为构建工具，提供极速的开发体验
- ⚛️ **React 19** 作为 UI 框架
- 📝 **TypeScript** 提供类型安全
- 🎨 **Less** 作为 CSS 预处理器
- 🧭 **React Router** 用于路由管理

## 技术栈

- **前端框架**：React 19
- **构建工具**：Vite 6
- **语言**：TypeScript 5.8
- **样式**：Less 4.2
- **路由**：React Router 7.4
- **代码检查**：ESLint 9.23
- **包管理器**：pnpm

## 项目结构

```
jianhua-web/
├── public/             # 静态资源文件夹
│   └── assets/         # 图片等资源
├── src/                # 源代码
│   ├── components/     # 可复用组件
│   ├── pages/          # 页面组件
│   │   ├── home/       # 首页
│   │   └── about/      # 关于页面
│   ├── styles/         # 样式文件
│   │   ├── variables.less  # 全局变量
│   │   └── App.less    # 应用样式
│   ├── types/          # TypeScript 类型定义
│   ├── App.tsx         # 应用入口组件
│   └── main.jsx        # 应用入口文件
├── .gitignore          # Git 忽略文件
├── package.json        # 项目依赖和脚本
├── tsconfig.json       # TypeScript 配置
├── tsconfig.node.json  # Node.js TypeScript 配置
├── vite.config.ts      # Vite 配置
└── README.md           # 项目文档
```

## 特性

### TypeScript 支持

项目配置了完整的 TypeScript 支持，包括：

- 严格的类型检查
- 路径别名 (`@/*` 映射到 `src/*`)
- 保存时自动类型检查 (通过 vite-plugin-checker)

### Less 集成

项目使用 Less 作为 CSS 预处理器，具有以下特性：

- 全局变量文件 (`src/styles/variables.less`)
- 自动导入全局变量 (通过 Vite 配置)
- JavaScript 支持 (javascriptEnabled: true)

### 路由系统

使用 React Router 实现了路由系统，目前包含：

- 首页 (`/`)
- 关于页面 (`/about`)

## 开始使用

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

这将启动开发服务器，通常在 [http://localhost:5173](http://localhost:5173) 上运行。

### 构建生产版本

```bash
pnpm build
```

构建后的文件将输出到 `dist` 目录。

### 预览生产版本

```bash
pnpm start
```

### 类型检查

```bash
pnpm typecheck
```

## 路径别名

项目配置了路径别名，可以使用 `@/` 代替 `src/`，例如：

```typescript
// 而不是
import Component from '../../components/Component';

// 可以使用
import Component from '@/components/Component';
```

## 样式使用

项目中的全局变量定义在 `src/styles/variables.less` 中，可以在任何 Less 文件中直接使用：

```less
// 示例：使用全局变量
.my-component {
  color: @primary-color;
  font-size: @font-size-base;
  padding: @spacing-md;
}
```