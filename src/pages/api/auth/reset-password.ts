/**
 * 重置密码 API
 */
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { token, password } = body;

    // 验证必填字段
    if (!token || !password) {
      return new Response(JSON.stringify({ success: false, message: 'Token 和密码不能为空' }), {
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

    // 模拟验证 token 并重置密码
    return new Response(
      JSON.stringify({
        success: true,
        message: '密码已重置成功',
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
