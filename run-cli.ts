// 注入构建时宏
(globalThis as any).MACRO = { VERSION: '2.1.88' };

// 动态导入入口点
import('./src/entrypoints/cli.tsx');