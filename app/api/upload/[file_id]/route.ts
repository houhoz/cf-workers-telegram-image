import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  context: { params: any }
) {
  try {
    const { TG_BOT_TOKEN } = process.env as unknown as {
      TG_BOT_TOKEN: string;
    };
    const file_id = context.params.file_id;

    const getFileResponse = await fetch(
      `https://api.telegram.org/bot${TG_BOT_TOKEN}/getFile?file_id=${file_id}`
    );
    const getFileRes = await getFileResponse.json();
    const file_path = getFileRes.result.file_path;

    const imageResponse = await fetch(
      `https://api.telegram.org/file/bot${TG_BOT_TOKEN}/${file_path}`
    );

    const imageRes = await imageResponse.arrayBuffer();

    return new Response(imageRes, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
