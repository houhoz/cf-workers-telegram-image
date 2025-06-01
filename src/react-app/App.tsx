import { useState, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [phonos, setPhonos] = useState<
    {
      file_id: string;
      file_unique_id: string;
      file_size: number;
      width: number;
      height: number;
    }[]
  >([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) return;
    setPending(true);

    const formData = new FormData(e.currentTarget);

    try {
      // 客户端处理上传状态
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const res = await response.json();
        setPhonos(res.phonos);
        alert('图片已成功上传到 Telegram');
        // Reset form
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        alert('上传失败，请重试');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('上传失败，请重试');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        图片上传到 Telegram
      </h1>

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
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
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </label>

            {selectedFile && (
              <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md flex items-center">
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
                <span>{selectedFile.name}</span>
              </div>
            )}

            {previewUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">图片预览:</p>
                <div className="relative rounded-lg overflow-hidden border border-gray-300">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto object-contain max-h-60"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={pending || !selectedFile}
            >
              {pending ? '上传中...' : '上传到 Telegram'}
            </button>
          </div>
        </form>
      </div>

      {/* 展示 phonos */}
      {phonos.length > 0 && (
        <div className="mt-8 max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">已上传的图片</h2>
          <div className="grid grid-cols-1 gap-4">
            {phonos.map((photo) => (
              <div
                key={photo.file_id}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start p-3">
                  <div className="flex-shrink-0 mr-4">
                    <img
                      src={`/api/get_photo/${photo.file_id}`}
                      alt="Uploaded"
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <div className="col-span-2">
                        <span className="text-xs text-gray-500">ID:</span>
                        <span className="text-sm text-gray-700 ml-1 font-mono break-all">
                          {photo.file_unique_id}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">尺寸:</span>
                        <span className="text-sm text-gray-700 ml-1">
                          {photo.width} × {photo.height}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">大小:</span>
                        <span className="text-sm text-gray-700 ml-1">
                          {(photo.file_size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => {
                        navigator.clipboard.writeText(photo.file_id);
                        alert('已复制 file_id 到剪贴板');
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        图片将直接发送到配置的 Telegram 频道
      </div>
    </div>
  );
}

export default App;
