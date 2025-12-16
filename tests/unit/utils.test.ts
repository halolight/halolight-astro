/**
 * 工具函数单元测试
 */
import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPassword,
  formatDate,
  truncateText,
  formatFileSize,
  generateId,
  deepClone,
} from '../../src/lib/utils';

describe('isValidEmail', () => {
  it('应该验证有效邮箱', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.cn')).toBe(true);
    expect(isValidEmail('admin@halolight.h7ml.cn')).toBe(true);
  });

  it('应该拒绝无效邮箱', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('no@domain')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
  });
});

describe('isValidPassword', () => {
  it('应该验证有效密码（>=6位）', () => {
    expect(isValidPassword('123456')).toBe(true);
    expect(isValidPassword('password123')).toBe(true);
    expect(isValidPassword('abcdefghij')).toBe(true);
  });

  it('应该拒绝过短的密码', () => {
    expect(isValidPassword('')).toBe(false);
    expect(isValidPassword('12345')).toBe(false);
    expect(isValidPassword('abc')).toBe(false);
  });
});

describe('formatDate', () => {
  it('应该正确格式化日期', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date, 'zh-CN');
    expect(result).toContain('2024');
    expect(result).toContain('1');
    expect(result).toContain('15');
  });

  it('应该接受字符串日期', () => {
    const result = formatDate('2024-06-20', 'zh-CN');
    expect(result).toContain('2024');
  });
});

describe('truncateText', () => {
  it('应该截断超长文本', () => {
    expect(truncateText('Hello World', 5)).toBe('Hello...');
    expect(truncateText('This is a long text', 10)).toBe('This is a ...');
  });

  it('不应截断短文本', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
    expect(truncateText('Hi', 5)).toBe('Hi');
  });
});

describe('formatFileSize', () => {
  it('应该正确格式化文件大小', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(1073741824)).toBe('1 GB');
  });
});

describe('generateId', () => {
  it('应该生成唯一 ID', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
    expect(id1.length).toBeGreaterThan(0);
  });
});

describe('deepClone', () => {
  it('应该深拷贝对象', () => {
    const original = { a: 1, b: { c: 2 } };
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.b).not.toBe(original.b);
  });

  it('应该深拷贝数组', () => {
    const original = [1, [2, 3], { a: 4 }];
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
  });
});
