import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useQueryClient } from '@tanstack/react-query';
import { Check, Loader2, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { Suspense, useCallback, useEffect, useRef } from 'react';
import { FollowListType, useUserFollow, useUserFollowList } from '../../hooks';

interface FollowListDialogProps {
  userId: number;
  type: FollowListType;
  isOpen: boolean;
  onClose: () => void;
}

// User 타입을 확장하여 isFollowing 속성 추가
interface UserWithFollowStatus {
  id: number;
  username?: string;
  isFollowing: boolean;
  profileImage?: string;
}

// 내부 컨텐츠 로딩 스켈레톤 컴포넌트
function FollowListLoading() {
  return (
    <div className="mt-3 space-y-3 px-1">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-3 rounded-lg p-2">
          <div className="flex flex-1 items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="mb-1 h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// 실제 데이터를 가져오는 내부 컴포넌트
function FollowListContent({
  userId,
  type,
}: {
  userId: number;
  type: FollowListType;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserFollowList(userId, type);
  const currentUser = useCurrentUser();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 모든 페이지의 사용자 데이터를 하나의 배열로 병합
  const users = data.pages.flatMap(page => page.users);

  // Intersection Observer를 사용한 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        // 관찰 대상이 화면에 보이고 다음 페이지가 있으면 로드
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (users.length === 0) {
    return (
      <div className="flex min-h-[250px] items-center justify-center">
        <p className="text-sm text-gray-500">
          {type === 'followers'
            ? '아직 팔로워가 없습니다.'
            : '아직 팔로우한 사용자가 없습니다.'}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-3 px-1">
      {users.map(user => (
        <UserListItem
          key={user.id}
          user={user}
          isCurrentUser={currentUser?.id === user.id}
          parentUserId={userId}
          listType={type}
        />
      ))}

      {/* 무한 스크롤 로딩 표시기 */}
      <div ref={loadMoreRef} className="py-2 text-center">
        {isFetchingNextPage ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">로드 중...</span>
          </div>
        ) : hasNextPage ? (
          <div className="h-8" /> // 다음 페이지 로드를 위한 빈 공간
        ) : users.length > 10 ? (
          <p className="text-xs text-gray-400">
            더 이상 표시할 사용자가 없습니다
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function FollowListDialog({
  userId,
  type,
  isOpen,
  onClose,
}: FollowListDialogProps) {
  // 다이얼로그 제목
  const title = type === 'followers' ? '팔로워' : '팔로잉';

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={onClose}>
      <ResponsiveDialogContent className="max-h-[80vh] overflow-auto sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        {/* Suspense로 감싸서 로딩 상태가 다이얼로그 내부에서만 보이도록 함 */}
        <Suspense fallback={<FollowListLoading />}>
          <FollowListContent userId={userId} type={type} />
        </Suspense>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}

interface UserListItemProps {
  user: UserWithFollowStatus;
  isCurrentUser: boolean;
  parentUserId: number;
  listType: FollowListType;
}

function UserListItem({
  user,
  isCurrentUser,
  parentUserId,
  listType,
}: UserListItemProps) {
  const queryClient = useQueryClient();
  // isFollowing 값을 직접 user 객체에서 가져옴
  const initialIsFollowing = user.isFollowing;
  const { isFollowing, toggleFollow, isLoading } =
    useUserFollow(initialIsFollowing);

  const handleFollowToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      await toggleFollow(user.id, user.username);

      // 팔로우/언팔로우 후 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['user', parentUserId, listType],
      });

      // 프로필 정보도 업데이트 (팔로워/팔로잉 카운트가 변경되므로)
      queryClient.invalidateQueries({
        queryKey: ['profile', parentUserId],
      });
    },
    [toggleFollow, user.id, user.username, queryClient, parentUserId, listType]
  );

  const displayName = user.username || `사용자 ${user.id}`;

  return (
    <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50">
      <Link
        href={`/profile/${user.id}`}
        className="flex flex-1 items-center gap-3"
        onClick={e => e.stopPropagation()}
      >
        <Avatar className="h-10 w-10 border border-gray-100">
          <AvatarImage
            src={user.profileImage || undefined}
            alt={displayName}
            className="object-cover"
          />
          <AvatarFallback className="bg-gray-100 text-gray-800">
            {(displayName[0] || '?').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 overflow-hidden">
          <p className="truncate font-medium text-gray-900">{displayName}</p>
        </div>
      </Link>

      {!isCurrentUser && (
        <Button
          size="sm"
          onClick={handleFollowToggle}
          variant={isFollowing ? 'outline' : 'default'}
          className={`h-9 cursor-pointer rounded-full ${
            isFollowing
              ? 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
          disabled={isLoading}
        >
          {isFollowing ? (
            <>
              <Check className="mr-1 h-3.5 w-3.5" />
              팔로잉
            </>
          ) : (
            <>
              <UserPlus className="mr-1 h-3.5 w-3.5" />
              팔로우
            </>
          )}
        </Button>
      )}
    </div>
  );
}
