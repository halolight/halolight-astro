/**
 * API 端点单元测试
 */
import { describe, it, expect } from 'vitest';

// 模拟用户数据
const mockUsers = [
  { id: 1, email: 'admin@halolight.h7ml.cn', password: '123456', name: '管理员', role: 'admin' },
  { id: 2, email: 'admin@halolight.h7ml.cn', password: '123456', name: '管理员', role: 'admin' },
  { id: 3, email: 'user@example.com', password: '123456', name: '普通用户', role: 'user' },
];

// 模拟登录验证逻辑
function validateLogin(email: string, password: string) {
  if (!email || !password) {
    return { success: false, message: '邮箱和密码不能为空', status: 400 };
  }

  const user = mockUsers.find((u) => u.email === email && u.password === password);

  if (!user) {
    return { success: false, message: '邮箱或密码错误', status: 401 };
  }

  const { password: _, ...userWithoutPassword } = user;
  return {
    success: true,
    message: '登录成功',
    user: userWithoutPassword,
    status: 200,
  };
}

describe('登录 API', () => {
  it('应该成功登录有效用户 - admin@halolight.h7ml.cn', () => {
    const result = validateLogin('admin@halolight.h7ml.cn', '123456');
    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
    expect(result.user?.email).toBe('admin@halolight.h7ml.cn');
    expect(result.user?.role).toBe('admin');
  });

  it('应该成功登录有效用户 - admin@halolight.h7ml.cn', () => {
    const result = validateLogin('admin@halolight.h7ml.cn', '123456');
    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
    expect(result.user?.email).toBe('admin@halolight.h7ml.cn');
  });

  it('应该拒绝错误密码', () => {
    const result = validateLogin('admin@halolight.h7ml.cn', 'wrongpassword');
    expect(result.success).toBe(false);
    expect(result.status).toBe(401);
    expect(result.message).toBe('邮箱或密码错误');
  });

  it('应该拒绝不存在的用户', () => {
    const result = validateLogin('nonexistent@example.com', '123456');
    expect(result.success).toBe(false);
    expect(result.status).toBe(401);
  });

  it('应该拒绝空邮箱', () => {
    const result = validateLogin('', '123456');
    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
    expect(result.message).toBe('邮箱和密码不能为空');
  });

  it('应该拒绝空密码', () => {
    const result = validateLogin('admin@halolight.h7ml.cn', '');
    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
  });

  it('不应在响应中返回密码', () => {
    const result = validateLogin('admin@halolight.h7ml.cn', '123456');
    expect(result.success).toBe(true);
    expect(result.user).not.toHaveProperty('password');
  });
});

// 模拟注册验证逻辑
function validateRegister(data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}) {
  const { firstName, lastName, email, password } = data;

  if (!firstName || !lastName || !email || !password) {
    return { success: false, message: '所有字段都是必填的', status: 400 };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: '邮箱格式不正确', status: 400 };
  }

  if (password.length < 6) {
    return { success: false, message: '密码长度至少为6位', status: 400 };
  }

  return {
    success: true,
    message: '注册成功',
    user: { id: Date.now(), email, name: `${lastName}${firstName}`, role: 'user' },
    status: 201,
  };
}

describe('注册 API', () => {
  it('应该成功注册新用户', () => {
    const result = validateRegister({
      firstName: '三',
      lastName: '张',
      email: 'zhangsan@example.com',
      password: '123456',
    });
    expect(result.success).toBe(true);
    expect(result.status).toBe(201);
    expect(result.user?.name).toBe('张三');
  });

  it('应该拒绝缺少必填字段', () => {
    const result = validateRegister({
      firstName: '三',
      email: 'test@example.com',
      password: '123456',
    });
    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
  });

  it('应该拒绝无效邮箱格式', () => {
    const result = validateRegister({
      firstName: '三',
      lastName: '张',
      email: 'invalid-email',
      password: '123456',
    });
    expect(result.success).toBe(false);
    expect(result.message).toBe('邮箱格式不正确');
  });

  it('应该拒绝过短的密码', () => {
    const result = validateRegister({
      firstName: '三',
      lastName: '张',
      email: 'test@example.com',
      password: '12345',
    });
    expect(result.success).toBe(false);
    expect(result.message).toBe('密码长度至少为6位');
  });
});
