import type { NextRequest } from 'next/server';

export const runtime = 'edge';

// 发送图片
export async function POST(request: NextRequest) {
  try {
    const { TG_BOT_TOKEN, TG_CHAT_ID } = process.env as unknown as {
      TG_BOT_TOKEN: string;
      TG_CHAT_ID: string;
    };

    const formData = await request.formData();
    formData.append('chat_id', TG_CHAT_ID);
    const response = await fetch(
      `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendPhoto`,
      {
        method: 'POST',
        body: formData,
      }
    );
    const res = await response.json();

    return new Response(JSON.stringify(res), {
      status: 200,
    });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
