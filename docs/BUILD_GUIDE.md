# Open-ClaudeCode 构建指南

> 本项目是从官方 npm 包 source map 恢复的 TypeScript 源码，恢复不完整。本文档记录了使其可构建的过程。

---

## 问题背景

这个项目是从官方 npm 包 (`@anthropic-ai/claude-code`) 的 source map 恢复出来的 TypeScript 源码，但存在以下问题：

1. **恢复不完整** - 部分源文件丢失（如 `TungstenTool/`、`WorkflowTool/` 目录）
2. **内部包不存在** - 一些 `@ant/*` 包不在 npm 上
3. **生成的类型文件缺失** - 如 `*.generated.js` 文件
4. **缺少构建配置** - 没有 tsconfig、build 脚本等

---

## 第一阶段：让源码可直接运行

### 1. 创建启动器 `run-cli.ts`

```typescript
// 注入构建时宏
(globalThis as any).MACRO = { VERSION: '2.1.88' };

// 动态导入入口点
import('./src/entrypoints/cli.tsx');
```

### 2. 安装第三方 npm 依赖

```bash
bun add @anthropic-ai/sdk @commander-js/extra-typings @growthbook/growthbook \
  @modelcontextprotocol/sdk axios chokidar commander execa ink lodash-es \
  react react-dom semver xss @opentelemetry/api @opentelemetry/resources \
  @opentelemetry/semantic-conventions ignore marked diff picomatch \
  supports-hyperlinks tree-kill env-paths lru-cache jsonc-parser \
  @opentelemetry/sdk-logs @opentelemetry/sdk-trace-base \
  @opentelemetry/exporter-trace-otlp-http @opentelemetry/instrumentation \
  color-diff-napi usehooks-ts proper-lockfile @anthropic-ai/bedrock-sdk \
  @anthropic-ai/foundry-sdk @azure/identity @anthropic-ai/vertex-sdk \
  google-auth-library @aws-sdk/client-sts turndown fflate undici \
  @aws-sdk/client-bedrock @anthropic-ai/mcpb yaml qrcode sharp \
  vscode-jsonrpc asciichart fuse.js bidi-js modifiers-napi
```

### 3. 创建缺失的内部包 stub

```bash
# 创建 @ant/claude-for-chrome-mcp stub
mkdir -p node_modules/@ant/claude-for-chrome-mcp
echo "module.exports = { BROWSER_TOOLS: [] };" > node_modules/@ant/claude-for-chrome-mcp/index.js
```

### 4. 创建缺失的源码 stub 文件

| 文件路径 | 创建原因 |
|---------|---------|
| `src/tools/TungstenTool/TungstenTool.ts` | 目录完全缺失 |
| `src/tools/TungstenTool/TungstenLiveMonitor.tsx` | 目录完全缺失 |
| `src/tools/WorkflowTool/constants.js` | 目录完全缺失 |
| `src/entrypoints/sdk/runtimeTypes.js` | 生成的类型文件 |
| `src/entrypoints/sdk/settingsTypes.generated.js` | 生成的类型文件 |
| `src/entrypoints/sdk/toolTypes.js` | 生成的类型文件 |
| `src/entrypoints/sdk/controlTypes.js` | 生成的类型文件 |
| `src/entrypoints/sdk/coreTypes.generated.js` | 生成的类型文件 |
| `src/types/connectorText.js` | 源码恢复丢失 |
| `src/ink/global.d.ts` | 源码恢复丢失 |
| `src/skills/bundled/verify/examples/cli.md` | 源码恢复丢失 |
| `src/skills/bundled/verify/examples/server.md` | 源码恢复丢失 |
| `src/skills/bundled/verify/SKILL.md` | 源码恢复丢失 |

### 5. 修复包版本兼容性

```bash
# commander 12.x 存在 bug，导致选项解析失败
bun add commander@12.1.0
```

### 6. 修复 stub 的导出

`color-diff-napi` 的 stub 需要正确导出：

```javascript
class ColorDiff {}
class ColorFile {}
function getSyntaxTheme() { return null; }
module.exports = { ColorDiff, ColorFile, getSyntaxTheme };
```

---

## 第二阶段：创建可打包的构建

### 7. 安装构建时需要的额外依赖

```bash
bun add @opentelemetry/exporter-metrics-otlp-grpc \
  @opentelemetry/exporter-metrics-otlp-http \
  @opentelemetry/exporter-metrics-otlp-proto \
  @opentelemetry/exporter-prometheus \
  @opentelemetry/exporter-logs-otlp-grpc \
  @opentelemetry/exporter-logs-otlp-http \
  @opentelemetry/exporter-logs-otlp-proto \
  @opentelemetry/exporter-trace-otlp-grpc \
  @opentelemetry/exporter-trace-otlp-proto
```

### 8. 创建构建时缺失的模块 stub

| 文件路径 | 创建原因 |
|---------|---------|
| `src/utils/protectedNamespace.js` | 构建时缺失 |
| `src/commands/agents-platform/index.js` | 目录完全缺失 |
| `src/tools/REPLTool/REPLTool.js` | 目录完全缺失 |
| `src/tools/SuggestBackgroundPRTool/SuggestBackgroundPRTool.js` | 目录完全缺失 |
| `src/tools/VerifyPlanExecutionTool/VerifyPlanExecutionTool.js` | 目录完全缺失 |
| `src/components/agents/SnapshotUpdateDialog.js` | 目录完全缺失 |
| `src/assistant/AssistantSessionChooser.js` | 目录完全缺失 |
| `src/commands/assistant/assistant.js` | 目录完全缺失 |
| `src/services/compact/snipCompact.js` | 源码恢复丢失 |
| `src/services/compact/cachedMicrocompact.js` | 源码恢复丢失 |
| `src/utils/filePersistence/types.js` | 源码恢复丢失 |
| `src/ink/devtools.js` | 源码恢复丢失 |
| `src/utils/ultraplan/prompt.txt` | 源码恢复丢失 |
| `src/services/contextCollapse/index.js` | 源码恢复丢失 |

### 9. 修复 `types.js` 的导出

需要导出常量，否则打包时会报错：

```javascript
export const DEFAULT_UPLOAD_CONCURRENCY = 10;
export const FILE_COUNT_LIMIT = 1000;
export const OUTPUTS_SUBDIR = 'outputs';
export const FailedPersistence = {};
export const FilesPersistedEventData = {};
export const PersistedFile = {};
export const TurnStartTime = {};
```

---

## 最终打包命令

```bash
bun build src/entrypoints/cli.tsx \
  --target=node \
  --outfile=dist/cli.js \
  --banner="const MACRO = { VERSION: '2.1.88' };"
```

**输出**:
- `dist/cli.js` (24 MB)
- 4726 modules
- 打包时间 ~2.7s

---

## 复盘要点

### 1. 源码恢复的局限性

- 不是完整的开发项目，丢失了部分文件
- 无法知道原始构建工具和配置

### 2. 主要挑战

| 挑战类型 | 描述 | 解决方案 |
|---------|------|---------|
| **内部包** | `@ant/*` 包不在 npm | 手动创建 stub |
| **生成的类型文件** | `*.generated.js` 丢失 | 手动创建 stub |
| **缺失的目录** | `TungstenTool/`、`WorkflowTool/` 等 | 手动创建 stub |
| **npm 包版本兼容性** | commander 版本问题 | 降级到 12.1.0 |

### 3. 关键发现

- 使用 `bun run ./run-cli.ts` 可以直接运行源码（不打包）
- 使用 `bun build` 可以打包，但需要更多 stub
- `MACRO.VERSION` 需要通过 `--banner` 注入

### 4. 后续修改代码工作流

```bash
# 1. 修改 src/ 下的源码

# 2. 重新打包
bun build src/entrypoints/cli.tsx \
  --target=node \
  --outfile=dist/cli.js \
  --banner="const MACRO = { VERSION: '2.1.88' };"

# 3. 测试
node dist/cli.js [参数]
```

---

## 目录结构变化

```
Open-ClaudeCode/
├── src/                      # TypeScript 源码
│   ├── tools/TungstenTool/   # 新建 (stub)
│   ├── tools/WorkflowTool/   # 新建 (stub)
│   └── ...                   # 其他 stub 文件
├── dist/
│   └── cli.js                # 打包输出 (24 MB)
├── node_modules/             # npm 依赖
├── run-cli.ts                # 源码运行启动器
└── package.json              # 已安装依赖
```

---

## 已知限制

1. 部分内部功能可能无法正常工作（如 TungstenTool、WorkflowTool 等 stub）
2. 需要 API 密钥 (`ANTHROPIC_API_KEY`) 才能进行实际对话
3. 某些 feature flags 对应的功能可能不可用
