/**
 * 登录 API
 */
import type { APIRoute } from 'astro';

// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    email: 'admin@halolight.h7ml.cn',
    password: '123456',
    name: '管理员',
    role: 'admin',
  },
  {
    id: 2,
    email: 'admin@halolight.h7ml.cn',
    password: '123456',
    name: '管理员',
    role: 'admin',
  },
  {
    id: 3,
    email: 'user@example.com',
    password: '123456',
    name: '普通用户',
    role: 'user',
  },
];

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 验证必填字段
    if (!email || !password) {
      return new Response(JSON.stringify({ success: false, message: '邮箱和密码不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 查找用户
    const user = mockUsers.find((u) => u.email === email && u.password === password);

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: '邮箱或密码错误' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;

    return new Response(
      JSON.stringify({
        success: true,
        message: '登录成功',
        user: userWithoutPassword,
        token: `mock_token_${user.id}_${Date.now()}`,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (_error) {
    return new Response(JSON.stringify({ success: false, message: '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
