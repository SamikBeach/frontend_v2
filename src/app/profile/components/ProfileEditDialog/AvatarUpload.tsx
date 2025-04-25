'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface AvatarUploadProps {
  initialImage?: string;
  onChange: (file: File | null) => void;
  username: string;
}

export function AvatarUpload({
  initialImage = '',
  onChange,
  username,
}: AvatarUploadProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialImage && initialImage.length > 0 ? initialImage : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initial = username.charAt(0).toUpperCase();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('5MB 이하의 이미지만 업로드할 수 있습니다.');
      return;
    }

    // 이미지 미리보기 생성
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 부모 컴포넌트에 파일 전달
    onChange(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onChange(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative flex flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="relative mb-2">
        <Avatar className="h-24 w-24 border-4 border-white ring-2 ring-gray-100">
          <AvatarImage src={avatarPreview || ''} alt={username} />
          <AvatarFallback className="bg-gray-200 text-3xl font-medium text-gray-700">
            {initial}
          </AvatarFallback>
        </Avatar>

        {avatarPreview && (
          <button
            type="button"
            onClick={handleRemoveAvatar}
            className="absolute -top-2 -right-2 rounded-full bg-gray-200 p-1 text-gray-700 hover:bg-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Button
        type="button"
        onClick={handleUploadClick}
        variant="outline"
        size="sm"
        className="h-8 rounded-full text-xs"
      >
        <Camera className="mr-1.5 h-3.5 w-3.5" />
        {avatarPreview ? '새 사진 업로드' : '사진 업로드'}
      </Button>
    </div>
  );
}
