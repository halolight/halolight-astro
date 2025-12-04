/**
 * 注册 API
 */
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    // 验证必填字段
    if (!firstName || !lastName || !email || !password) {
      return new Response(JSON.stringify({ success: false, message: '所有字段都是必填的' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ success: false, message: '邮箱格式不正确' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 验证密码长度
    if (password.length < 6) {
      return new Response(JSON.stringify({ success: false, message: '密码长度至少为6位' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 模拟注册成功
    return new Response(
      JSON.stringify({
        success: true,
        message: '注册成功',
        user: {
          id: Date.now(),
          email,
          name: `${lastName}${firstName}`,
          role: 'user',
        },
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (_error) {
    return new Response(JSON.stringify({ success: false, message: '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
