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
  const initial = username.charAt(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    // 파일 크기 검증 (20MB)
    if (file.size > 20 * 1024 * 1024) {
      alert('20MB 이하의 이미지만 업로드할 수 있습니다.');
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
    // null을 전달하여 프로필 이미지 삭제를 표시
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
        accept="image/*, .heic"
        className="hidden"
      />

      <div className="relative mb-3">
        <Avatar className="h-28 w-28 border-4 border-white ring-2 ring-gray-100 transition duration-200 sm:h-32 sm:w-32">
          <AvatarImage
            src={avatarPreview || undefined}
            alt={username}
            className="object-cover"
          />
          <AvatarFallback className="bg-gray-200 text-4xl font-medium text-gray-700">
            {initial}
          </AvatarFallback>
        </Avatar>

        {avatarPreview && (
          <button
            type="button"
            onClick={handleRemoveAvatar}
            aria-label="프로필 이미지 삭제"
            className="absolute -top-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300 active:bg-gray-400"
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
        className="h-10 min-w-[140px] cursor-pointer rounded-full border-gray-200 px-4 text-sm font-medium transition-colors active:bg-gray-100"
      >
        <Camera className="mr-2 h-4 w-4" />
        {avatarPreview ? '사진 변경' : '사진 업로드'}
      </Button>

      <p className="mt-2 text-center text-xs text-gray-500">
        20MB 이하의 이미지 파일만 업로드 가능합니다
      </p>
    </div>
  );
}
