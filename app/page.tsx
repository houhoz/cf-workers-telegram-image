'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface IFileUploader {
  handleFile: (file: any) => void;
}

const FileUploader = ({ handleFile }: IFileUploader) => {
  const [imgUrl, setImgUrl] = useState('');

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    hiddenFileInput.current && hiddenFileInput.current.click();
  };

  const handleChange = (event: any) => {
    const fileUploaded = event.target.files[0];
    handleFile(fileUploaded);
    const URL = window.URL || window.webkitURL;
    // 通过 file 生成目标 url
    const imgURL = URL.createObjectURL(fileUploaded);

    setImgUrl(imgURL);
  };
  return (
    <>
      {imgUrl ? (
        <Image
          src={imgUrl}
          alt="file upload"
          width="200"
          height="200"
          onClick={handleClick}
        />
      ) : (
        <Button onClick={handleClick}>选择图片</Button>
      )}
      <p className="text-sm text-gray-500 mt-5">
        PNG, JPG, GIF up to 10MB
      </p>
      <Input
        type="file"
        onChange={handleChange}
        ref={hiddenFileInput}
        className="hidden"
        accept="image/png, image/jpeg, image/gif, image/jpg"
      />
    </>
  );
};

export default function Home() {
  const [file, setFile] = useState<any | null>(null);

  const [fileId, setFileId] = useState('');

  const handleOnChangFile = (e: any) => {
    setFile(e);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const res = await response.json();
    const photo = res.result.photo;
    const originalPhoto = photo[photo.length - 1];
    setFileId(originalPhoto.file_id);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <FileUploader handleFile={handleOnChangFile} />
      {file && (
        <Button className="mt-5" onClick={handleUpload}>
          上传
        </Button>
      )}
      {fileId && (
        <p className="mt-5">{`${window.location.origin}/api/upload/${fileId}`}</p>
      )}
    </main>
  );
}
