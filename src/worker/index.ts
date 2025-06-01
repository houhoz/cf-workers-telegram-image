import { Hono } from 'hono';

type Bindings = {
  TG_BOT_TOKEN: string;
  TG_CHAT_ID: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/api/get_photo/:file_id', async (c) => {
  const { TG_BOT_TOKEN } = c.env;
  const file_id = c.req.param('file_id');

  const getFileResponse = await fetch(
    `https://api.telegram.org/bot${TG_BOT_TOKEN}/getFile?file_id=${file_id}`
  );
  const getFileRes: {
    ok: boolean;
    result: { file_path: string };
  } = await getFileResponse.json();

  if (getFileRes.ok) {
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
  } else {
    return c.json({
      status: 'error',
      message: '获取文件失败',
    });
  }
});

app.get('/api/getPhoto', (c) => c.json({ name: 'Cloudflare' }));

// 上传图片处理
app.post('/api/upload', async (c) => {
  const { TG_BOT_TOKEN, TG_CHAT_ID } = c.env;

  const formData = await c.req.formData();
  formData.append('chat_id', TG_CHAT_ID);

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendPhoto`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const res: {
      ok: boolean;
      result: { photo: { file_id: string }[] };
      description: string;
    } = await response.json();

    if (res.ok) {
      const photo = res.result.photo;
      return c.json({
        status: 'success',
        phonos: photo,
      });
    } else {
      return c.json({
        status: 'error',
        message: res.description || '上传失败',
      });
    }
  } catch (error: unknown) {
    console.error(error);
  }
});

export default app;
