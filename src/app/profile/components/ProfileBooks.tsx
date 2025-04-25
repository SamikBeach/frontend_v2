import { createLibrary } from '@/apis/library/library';
import { CreateLibraryDto } from '@/apis/library/types';
import { LibraryDialog } from '@/components/Library';
import { LibraryCard } from '@/components/LibraryCard';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useIsMyProfile } from '../hooks';

// 샘플 서재 데이터 (LibraryCard에 맞게 수정)
const userLibraries: any[] = [
  {
    id: 1,
    name: '철학 고전',
    description: '플라톤부터 니체까지, 철학 관련 고전 모음',
    category: 'philosophy',
    owner: {
      id: 1,
      name: '내 서재',
      username: 'mybooks',
      email: 'user@example.com',
    },
    subscriberCount: 42,
    isPublic: true,
    tags: [
      { tagId: 1, tagName: '철학' },
      { tagId: 2, tagName: '고전' },
      { tagId: 3, tagName: '서양철학' },
    ],
    bookCount: 4,
    previewBooks: [
      {
        id: 1,
        title: '국가',
        author: '플라톤',
        coverImage: 'https://picsum.photos/seed/book1/120/180',
      },
      {
        id: 2,
        title: '니코마코스 윤리학',
        author: '아리스토텔레스',
        coverImage: 'https://picsum.photos/seed/book2/120/180',
      },
      {
        id: 3,
        title: '도덕경',
        author: '노자',
        coverImage: 'https://picsum.photos/seed/book3/120/180',
      },
    ],
    createdAt: new Date('2023-01-15'),
  },
  {
    id: 2,
    name: '현대 문학',
    description: '20세기 이후 주요 문학 작품 모음',
    category: 'literature',
    owner: {
      id: 1,
      name: '내 서재',
      username: 'mybooks',
      email: 'user@example.com',
    },
    subscriberCount: 35,
    isPublic: true,
    tags: [
      { tagId: 4, tagName: '문학' },
      { tagId: 5, tagName: '소설' },
      { tagId: 6, tagName: '현대문학' },
    ],
    bookCount: 4,
    previewBooks: [
      {
        id: 5,
        title: '노인과 바다',
        author: '헤밍웨이',
        coverImage: 'https://picsum.photos/seed/book5/120/180',
      },
      {
        id: 6,
        title: '카프카 단편선',
        author: '프란츠 카프카',
        coverImage: 'https://picsum.photos/seed/book6/120/180',
      },
      {
        id: 7,
        title: '백년의 고독',
        author: '가브리엘 가르시아 마르케스',
        coverImage: 'https://picsum.photos/seed/book7/120/180',
      },
    ],
    createdAt: new Date('2023-02-20'),
  },
  {
    id: 3,
    name: '과학 교양',
    description: '일반인을 위한 과학 교양서 모음',
    category: 'science',
    owner: {
      id: 1,
      name: '내 서재',
      username: 'mybooks',
      email: 'user@example.com',
    },
    subscriberCount: 27,
    isPublic: true,
    tags: [
      { tagId: 7, tagName: '과학' },
      { tagId: 8, tagName: '교양' },
      { tagId: 9, tagName: '물리학' },
    ],
    bookCount: 4,
    previewBooks: [
      {
        id: 9,
        title: '시간의 역사',
        author: '스티븐 호킹',
        coverImage: 'https://picsum.photos/seed/book9/120/180',
      },
      {
        id: 10,
        title: '코스모스',
        author: '칼 세이건',
        coverImage: 'https://picsum.photos/seed/book10/120/180',
      },
      {
        id: 11,
        title: '이기적 유전자',
        author: '리처드 도킨스',
        coverImage: 'https://picsum.photos/seed/book11/120/180',
      },
    ],
    createdAt: new Date('2023-03-10'),
  },
];

export default function ProfileBooks() {
  const isMyProfile = useIsMyProfile();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showLibraryDialog, setShowLibraryDialog] = useState(false);

  // 새 서재 생성 mutation
  const { mutateAsync: createLibraryMutation } = useMutation({
    mutationFn: (data: CreateLibraryDto) => createLibrary(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraries', 'my'] });
      toast.success('새 서재가 생성되었습니다.');
    },
  });

  // 새 서재 만들기 클릭 핸들러
  const handleCreateLibrary = () => {
    setShowLibraryDialog(true);
  };

  // 새 서재 생성 처리 함수
  const handleCreateNewLibrary = async (libraryData: CreateLibraryDto) => {
    try {
      await createLibraryMutation(libraryData);
    } catch (error) {
      console.error('서재 생성 오류:', error);
      throw error;
    }
  };

  // 전체 책 수 계산
  const totalBooks = userLibraries.reduce(
    (sum, library) => sum + library.bookCount,
    0
  );

  // 전체 구독자 수 계산
  const totalFollowers = userLibraries.reduce(
    (sum, library) => sum + library.subscriberCount,
    0
  );

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">내 서재</h2>
          <p className="text-sm text-gray-500">
            총 {userLibraries.length}개의 서재, {totalBooks}권의 책,{' '}
            {totalFollowers}명의 구독자
          </p>
        </div>
        {isMyProfile && (
          <Button
            onClick={handleCreateLibrary}
            className="flex items-center gap-1.5 rounded-full bg-gray-900 text-white hover:bg-gray-800"
          >
            <PlusCircle className="h-4 w-4" />새 서재 만들기
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {userLibraries.map(library => (
          <LibraryCard key={library.id} library={library} />
        ))}
      </div>

      {/* 새 서재 만들기 다이얼로그 */}
      <LibraryDialog
        open={showLibraryDialog}
        onOpenChange={setShowLibraryDialog}
        mode="create"
        onCreateLibrary={handleCreateNewLibrary}
      />
    </>
  );
}
