/**
 * 社交登录 API（模拟）
 */
import type { APIRoute } from 'astro';

// 模拟不同提供商的用户信息
const providerInfo: Record<string, { name: string; avatar: string; email: string; role: string }> =
  {
    github: {
      name: 'GitHub User',
      avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
      email: 'user@github.com',
      role: 'user',
    },
    google: {
      name: 'Google User',
      avatar: 'https://lh3.googleusercontent.com/a/default-user',
      email: 'user@gmail.com',
      role: 'user',
    },
    wechat: {
      name: '微信用户',
      avatar: 'https://thirdwx.qlogo.cn/mmopen/default',
      email: 'user@wechat.com',
      role: 'user',
    },
  };

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { provider } = body;

    // 验证必填字段
    if (!provider) {
      return new Response(JSON.stringify({ success: false, message: '缺少提供商参数' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 验证提供商
    if (!['github', 'google', 'wechat'].includes(provider)) {
      return new Response(JSON.stringify({ success: false, message: '不支持的提供商' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 模拟 OAuth 流程延迟
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const info = providerInfo[provider];
    const user = {
      id: `${provider}_${Date.now()}`,
      name: info.name,
      email: info.email,
      avatar: info.avatar,
      role: info.role,
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: '登录成功',
        user,
        token: `mock_token_${provider}_${Date.now()}`,
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
