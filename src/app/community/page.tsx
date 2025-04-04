'use client';

import { useUrlParams } from '@/hooks';
import { CreatePostCard, FilterBar, PostCard } from './components';
import { mainCategories, posts, sortOptions, users } from './data';
import { Post } from './types';

export default function CommunityPage() {
  // URL 파라미터 관리
  const { params, setParam } = useUrlParams({
    defaultValues: {
      category: 'all', // all, discussion, bookreport, question, meetup
      sort: 'popular', // popular, following, latest
    },
  });

  const selectedCategory = params.category || 'all';
  const selectedSort = params.sort || 'popular';
  const currentUser = users[4]; // 현재 로그인한 사용자 (예시)

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (categoryId: string) => {
    setParam('category', categoryId);
  };

  // 정렬 옵션 클릭 핸들러
  const handleSortClick = (sortId: string) => {
    setParam('sort', sortId);
  };

  // 필터링 로직
  let filteredPosts = posts;

  // 카테고리 필터링
  if (selectedCategory !== 'all') {
    filteredPosts = posts.filter(post => post.category === selectedCategory);
  }

  // 정렬 로직
  const sortPosts = (postsToSort: Post[], sort: string): Post[] => {
    return [...postsToSort].sort((a, b) => {
      if (sort === 'latest') {
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      } else if (sort === 'popular') {
        return b.likes - a.likes;
      }
      return 0;
    });
  };

  // 정렬된 게시물
  let sortedPosts = sortPosts(filteredPosts, selectedSort);

  // following 뷰를 위한 필터링 (예시: 사용자 ID 1,2만 팔로잉 중이라고 가정)
  if (selectedSort === 'following') {
    sortedPosts = sortedPosts.filter(post => [1, 2].includes(post.author.id));
  }

  return (
    <div className="bg-white pb-8">
      {/* 상단 필터 */}
      <div className="mx-auto max-w-3xl px-4 pt-2 pb-3">
        <FilterBar
          mainCategories={mainCategories}
          sortOptions={sortOptions}
          selectedCategory={selectedCategory}
          selectedSort={selectedSort}
          onCategoryClick={handleCategoryClick}
          onSortClick={handleSortClick}
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="mx-auto max-w-3xl px-4 pt-2">
        {/* 포스트 작성 */}
        <CreatePostCard user={currentUser} />

        {/* 포스트 목록 */}
        {sortedPosts.length > 0 ? (
          sortedPosts.map(post => (
            <PostCard key={post.id} post={post} currentUser={currentUser} />
          ))
        ) : (
          <div className="mt-12 flex flex-col items-center justify-center rounded-lg bg-gray-50 py-16 text-center">
            <div className="text-3xl">📝</div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              게시물이 없습니다
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {selectedSort === 'following'
                ? '팔로우하는 사용자의 게시물이 없습니다.'
                : selectedSort === 'popular'
                  ? '인기 게시물이 없습니다.'
                  : '최신 게시물이 없습니다.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
