import { Hono } from 'hono';
import { renderer } from './renderer';

type Bindings = {
  TG_BOT_TOKEN: string;
  TG_CHAT_ID: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(renderer);

// 首页 增加上传图片的按钮
app.get('/', (c) => {
  // 获取查询参数，用于显示上传结果
  const status = c.req.query('status');
  const message = c.req.query('message');
  const fileId = c.req.query('fileId');

  let statusMessage = null;
  if (status === 'success') {
    statusMessage = (
      <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
        图片已成功上传到 Telegram!
      </div>
    );
  } else if (status === 'error') {
    statusMessage = (
      <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
        上传失败: {message || '未知错误'}
      </div>
    );
  }

  return c.render(
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        图片上传到 Telegram
      </h1>

      {statusMessage}

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <form
          action="/upload"
          method="post"
          encType="multipart/form-data"
          className="space-y-4"
        >
          <div className="space-y-2">
            <label
              htmlFor="photo"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md border border-gray-300 transition duration-300 flex items-center justify-center cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              选择图片
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                required
                className="hidden"
              />
            </label>

            <div
              id="file-display"
              className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md flex items-center"
              style={{ display: 'none' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
              <span id="file-name"></span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              上传到 Telegram
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        图片将直接发送到配置的 Telegram 频道
      </div>

      {/* 添加客户端脚本处理文件选择 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
        document.addEventListener('DOMContentLoaded', function() {
          const fileInput = document.getElementById('photo');
          if (fileInput) {
            fileInput.addEventListener('change', function(e) {
              const fileName = this.files[0] ? this.files[0].name : '';
              document.getElementById('file-name').textContent = fileName;
              document.getElementById('file-display').style.display = fileName ? 'flex' : 'none';
            });
          }
        });
      `,
        }}
      />
    </div>
  );
});

// 上传图片处理
app.post('/upload', async (c) => {
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

    const res = await response.json();

    if (res.ok) {
      const photo = res.result.photo;
      const originalPhoto = photo[photo.length - 1];
      return c.redirect(`/?status=success&fileId=${originalPhoto.file_id}`);
    } else {
      return c.redirect(
        `/?status=error&message=${encodeURIComponent(
          res.description || '上传失败'
        )}`
      );
    }
  } catch (error) {
    return c.redirect(
      `/?status=error&message=${encodeURIComponent('请求出错')}`
    );
  }
});

export default app;
