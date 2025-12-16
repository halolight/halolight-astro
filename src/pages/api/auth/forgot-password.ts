/**
 * 忘记密码 API
 */
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = body;

    // 验证邮箱
    if (!email) {
      return new Response(JSON.stringify({ success: false, message: '邮箱不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 模拟发送重置邮件
    // 出于安全考虑，无论邮箱是否存在都返回成功
    return new Response(
      JSON.stringify({
        success: true,
        message: '如果该邮箱已注册，您将收到重置密码的邮件',
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
