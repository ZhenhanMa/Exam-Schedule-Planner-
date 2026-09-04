# 考研日程规划 (Exam Schedule Planner)

主播是一只考研区，距离27考研所剩时间不多了为了督促自己vibe了一个时钟和倒计时，包含当下时间、追踪考研倒计时，并高效管理每日与每周学习计划。支持打包为 Windows 桌面应用（EXE）。祝各位考研/考试顺利！

![应用截图](./public/screenshot.png)

## 功能特性

### 中央时间显示
- 实时显示当前日期（年月日 + 星期）和时钟（时分秒，每秒更新）
- 衬线体日期 + 等宽数字时钟，配合琥珀色光晕效果

### 考研倒计时
- 巨型数字显示距考研初试的剩余天数（默认当年12月最后一个周六）
- 剩余 ≤30 天变红、≤100 天变琥珀色提醒
- 支持自定义考研日期

### 当日安排竖栏
- 右侧竖栏列出当天所有计划项
- 支持新增、编辑、删除、勾选完成
- 计划项分为四个类别：学习 / 休息 / 运动 / 其他
- 完成进度条实时显示当日完成率

### 周计划编辑
- 横向7天卡片排列，支持本周/下周切换
- 点击日卡片选中后，点击「添加计划」共同按钮在右侧栏打开编辑面板
- 编辑面板与今日安排操作一致，关闭后自动恢复今日安排

### 收纳功能
- 可分别收纳右侧「今日安排」竖栏和底部「周计划」区
- 全部收纳后仅保留中央时钟和倒计时，专注沉浸

### 滚动式时间选择器
- 添加/编辑计划时使用滚轮选择开始和结束时间
- 小时（00-23）+ 分钟（5分钟刻度）四列滚动选择
- 滚轮自动吸附、选中高亮，无需手动输入

### 数据持久化
- 所有计划数据自动保存到浏览器 localStorage
- 刷新或重启应用数据不丢失

## 技术栈

| 技术 | 用途 |
|------|------|
| React 18 | 前端框架 |
| TypeScript | 类型安全 |
| Vite 6 | 构建工具 |
| Tailwind CSS 3 | 样式方案 |
| Zustand | 状态管理（含 localStorage 持久化） |
| lucide-react | 图标库 |
| Electron | 桌面应用打包 |

## 快速开始

### 环境要求

- Node.js >= 18
- npm（或 pnpm / yarn）

### 安装依赖

```bash
npm install
```

### 开发模式（Web）

```bash
npm run dev
```

启动后访问 `http://localhost:5173`

### 开发模式（Electron 桌面）

```bash
npm run electron:dev
```

### 打包为 EXE 安装程序

```bash
npm run electron:build
```

生成的安装包位于 `release/` 目录下（或构建输出目录）。

### 类型检查

```bash
npm run check
```

## 项目结构

```
├── electron/                # Electron 主进程
│   ├── main.cjs             # 主进程入口
│   └── preload.cjs          # 预加载脚本
├── src/
│   ├── components/          # React 组件
│   │   ├── CenterClock.tsx       # 中央日期时间显示
│   │   ├── ExamCountdown.tsx     # 考研倒计时
│   │   ├── TodaySchedule.tsx     # 当日安排竖栏 / 日期编辑面板
│   │   ├── WeekPlanner.tsx       # 周计划编辑区
│   │   ├── WeekToggle.tsx        # 本周/下周切换
│   │   ├── ScheduleItemCard.tsx  # 单个计划项卡片
│   │   └── TimePicker.tsx        # 滚动式时间选择器
│   ├── pages/
│   │   └── Home.tsx              # 主面板页面
│   ├── store/
│   │   └── useScheduleStore.ts   # Zustand 状态管理
│   ├── types/
│   │   └── index.ts              # TypeScript 类型定义
│   ├── utils/
│   │   └── date.ts               # 日期工具函数
│   ├── lib/
│   │   └── utils.ts              # 通用工具函数
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── eslint.config.js
```

## 设计风格

- **主色调**：深色靛蓝/墨黑背景 + 暖琥珀色强调
- **字体**：Noto Serif SC（衬线体，日期标题）/ JetBrains Mono（等宽，时钟数字）/ Noto Sans SC（正文）
- **氛围**：专注、沉稳的备考视觉体验

## 常用命令

| 命令 | 用途 |
|------|------|
| `npm run dev` | 启动 Web 开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run electron:dev` | 构建并启动 Electron 桌面应用 |
| `npm run electron:build` | 打包为 Windows EXE 安装程序 |
| `npm run check` | TypeScript 类型检查 |
| `npm run lint` | ESLint 代码检查 |

## 许可证

MIT
