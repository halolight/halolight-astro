import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 测试环境
    environment: 'happy-dom',
    // 全局设置
    globals: true,
    // 包含的测试文件
    include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '.astro/', '**/*.d.ts', '**/*.config.*', '**/types/**'],
    },
    // 测试超时
    testTimeout: 10000,
  },
});
