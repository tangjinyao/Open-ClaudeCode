# Fork 仓库协作指南

> 本文档记录了如何 fork 本仓库并保持与上游仓库同步的工作流程。

---

## 仓库信息

| 仓库 | URL |
|------|-----|
| **上游仓库** (原始仓库) | https://github.com/LING71671/Open-ClaudeCode |
| **你的 Fork** | https://github.com/tangjinyao/Open-ClaudeCode |

---

## 首次 Fork 流程

### 1. 在 GitHub 上 Fork 仓库

1. 访问 https://github.com/LING71671/Open-ClaudeCode
2. 点击页面右上角的 **Fork** 按钮
3. 选择你的 GitHub 账号
4. 等待 Fork 创建完成

### 2. 克隆你的 Fork 到本地

```bash
git clone https://github.com/tangjinyao/Open-ClaudeCode.git
cd Open-ClaudeCode
```

### 3. 添加上游仓库 remote

```bash
# 添加上游仓库作为 remote
git remote add upstream https://github.com/LING71671/Open-ClaudeCode.git

# 验证 remote 配置
git remote -v
```

**预期输出**:
```
origin    https://github.com/tangjinyao/Open-ClaudeCode.git (fetch)
origin    https://github.com/tangjinyao/Open-ClaudeCode.git (push)
upstream  https://github.com/LING71671/Open-ClaudeCode.git (fetch)
upstream  https://github.com/LING71671/Open-ClaudeCode.git (push)
```

---

## 日常开发工作流

### 1. 同步上游仓库的最新更改

```bash
# 获取上游仓库的最新更改
git fetch upstream

# 切换到 main 分支
git checkout main

# 合并上游仓库的更改
git merge upstream/main

# 或者使用 rebase（保持提交历史整洁）
git rebase upstream/main
```

### 2. 推送你自己的更改

```bash
# 确保在 main 分支
git checkout main

# 添加要提交的文件
git add .

# 提交更改
git commit -m "你的提交信息"

# 推送到你的 fork
git push origin main
```

### 3. 创建 Pull Request

1. 访问你的 Fork: https://github.com/tangjinyao/Open-ClaudeCode
2. 点击 **Contribute** → **Open pull request**
3. 填写 PR 标题和描述
4. 点击 **Create pull request**

---

## 常用 Git 命令参考

### 查看状态

```bash
# 查看当前分支和状态
git status

# 查看 remote 信息
git remote -v

# 查看提交历史
git log --oneline -5
```

### 分支操作

```bash
# 查看所有分支
git branch -a

# 创建新分支
git checkout -b feature/your-feature

# 切换分支
git checkout main
```

### 同步上游

```bash
# 获取上游更改
git fetch upstream

# 查看上游 main 分支的更改
git log upstream/main --oneline -5

# 合并到本地 main
git checkout main
git merge upstream/main
```

---

## 同步冲突解决

如果合并时出现冲突：

```bash
# 1. 先同步上游
git fetch upstream
git merge upstream/main

# 2. 如果有冲突，Git 会提示冲突文件
git status
# On branch main
# You have unmerged paths.
#   (fix conflicts and run "git commit")

# 3. 编辑冲突文件，保留需要的更改

# 4. 标记冲突已解决
git add <冲突文件>

# 5. 完成合并提交
git commit
```

---

## 配置 GitHub 访问（可选）

如果你遇到网络问题无法访问 GitHub，可以配置代理：

```bash
# 配置 HTTP 代理
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

---

## 提交规范

建议的提交信息格式：

```
<type>: <subject>

<body>
```

**Type 类型**:
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更改
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建过程或辅助工具的更改

**示例**:
```
feat: 添加新的工具支持

- 添加 XXX 工具
- 修改 YYY 逻辑

Co-Authored-By: Your Name <you@example.com>
```

---

## 远程仓库结构图

```
┌─────────────────────────────────────────────────────────┐
│  LING71671/Open-ClaudeCode (upstream)                   │
│  - 原始仓库                                             │
│  - 只读权限                                            │
└─────────────────────────────────────────────────────────┘
                          │
                          │ fork
                          ▼
┌─────────────────────────────────────────────────────────┐
│  tangjinyao/Open-ClaudeCode (origin)                    │
│  - 你的 Fork                                            │
│  - 推送权限                                            │
│  - 包含你的更改                                        │
└─────────────────────────────────────────────────────────┘
                          │
                          │ clone
                          ▼
┌─────────────────────────────────────────────────────────┐
│  本地工作目录 (Local)                                   │
│  - 进行开发工作                                        │
│  - 提交更改                                            │
└─────────────────────────────────────────────────────────┘
```

---

## 快速参考

```bash
# 首次设置
git clone https://github.com/tangjinyao/Open-ClaudeCode.git
cd Open-ClaudeCode
git remote add upstream https://github.com/LING71671/Open-ClaudeCode.git

# 同步上游
git fetch upstream
git checkout main
git merge upstream/main

# 提交更改
git add .
git commit -m "message"
git push origin main
```
