import { AuthProvider, UserStatus } from '../auth/types';

/**
 * 사용자 정보 인터페이스
 */
export interface User {
  id: number;
  email: string;
  username?: string;
  avatar?: string;
  bio?: string;
  profileImage?: string;
  provider: AuthProvider;
  providerId?: string;
  status: UserStatus;
  isEmailVerified: boolean;
  marketingConsent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 사용자 정보 업데이트 요청 인터페이스
 */
export interface UpdateUserInfoRequest {
  username?: string;
  bio?: string;
}

/**
 * 사용자 정보 업데이트 응답
 */
export interface UpdateUserInfoResponse {
  id: string;
  email: string;
  username?: string;
}

/**
 * 비밀번호 변경 요청
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * 비밀번호 변경 응답
 */
export interface ChangePasswordResponse {
  message: string;
}

/**
 * 프로필 이미지 업로드 응답
 */
export interface UploadProfileImageResponse {
  url: string;
}

/**
 * 계정 비활성화/삭제 응답
 */
export interface AccountActionResponse {
  message: string;
}

/**
 * 사용자 기본 정보 DTO
 */
export interface UserDetailDto {
  id: number;
  username: string;
  email?: string;
  bio?: string;
  profileImage?: string;
  provider: AuthProvider;
  createdAt: Date;
}

/**
 * 서재 소유자 DTO
 */
export interface LibraryOwnerDto {
  id: number;
  username: string;
  email: string;
}

/**
 * 서재 태그 DTO
 */
export interface LibraryTagDto {
  id: number;
  tagId: number;
  tagName: string;
  usageCount: number;
  libraryId: number;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 서재 미리보기 DTO
 */
export interface LibraryPreviewDto {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  subscriberCount: number;
  owner: LibraryOwnerDto;
  tags: LibraryTagDto[];
  bookCount: number;
  previewBooks: BookPreviewDto[];
  isSubscribed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 책 미리보기 DTO
 */
export interface BookPreviewDto {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  isbn: string;
  publisher: string;
}

/**
 * 이미지 미리보기 DTO
 */
export interface ImagePreviewDto {
  id: number;
  url: string;
}

/**
 * 리뷰 미리보기 DTO
 */
export interface ReviewPreviewDto {
  id: number;
  content: string;
  type: string;
  previewImage: ImagePreviewDto;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
}

/**
 * 카테고리별 독서 통계 DTO
 */
export interface ReadingCategoryStatDto {
  category: string;
  count: number;
}

/**
 * 리뷰 카운트 DTO
 */
export interface ReviewCountsDto {
  total: number;
  general: number;
  discussion: number;
  review: number;
  question: number;
  meetup: number;
}

/**
 * 사용자 상세 정보 응답 DTO
 */
export interface UserDetailResponseDto {
  user: UserDetailDto;
  libraryCount: number;
  readCount: number;
  subscribedLibraryCount: number;
  reviewCount: ReviewCountsDto;
  followers: number;
  following: number;
  isEditable: boolean;
  isFollowing?: boolean;
  libraries?: LibraryPreviewDto[];
  averageRating?: number | null;
  ratingCount: number;
  reviewAndRatingCount?: number;
}

/**
 * 사용자 서재 목록 응답
 */
export interface UserLibrariesResponseDto {
  items: LibraryPreviewDto[];
  total: number;
}

/**
 * 사용자 리뷰 목록 응답
 */
export interface UserReviewsResponseDto {
  reviews: any[]; // Match actual server response
  total: number;
  page: number;
  totalPages: number;
}

/**
 * 팔로워/팔로잉 사용자 응답 DTO
 */
export interface FollowerResponseDto {
  id: number;
  username: string;
  bio?: string;
  profileImage?: string;
  isFollowing: boolean;
}

/**
 * 팔로워 목록 응답 DTO
 */
export interface FollowersListResponseDto {
  followers: FollowerResponseDto[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
}

/**
 * 팔로잉 목록 응답 DTO
 */
export interface FollowingListResponseDto {
  following: FollowerResponseDto[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
}

/**
 * 사용자 책 목록 응답 DTO
 */
export interface UserBooksResponseDto {
  items: ExtendedReadingStatusResponseDto[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
}

/**
 * 기존 ReadingStatusResponseDto는 계속 유지
 */
export interface ReadingStatusResponseDto {
  id: number;
  status: string; // 서버에서 "READ", "READING", "WANT_TO_READ" 형식으로 반환됨
  currentPage?: number;
  startDate?: Date;
  finishDate?: Date;
  readingMemo?: string;
  createdAt: Date;
  updatedAt: Date;
  book: {
    id: number;
    title: string;
    author: string;
    coverImage: string;
    isbn: string;
  };
}

/**
 * 확장된 책 정보 DTO
 */
export interface ExtendedBookInfoDto {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  isbn: string;
  publisher: string;
  isbn13?: string;
  translator?: string;
  pageCount?: number;
  publishDate?: Date;
  rating?: number;
  reviews?: number;
  totalRatings?: number;
  description?: string;
  tags?: string[];
  categoryId?: number;
  subcategoryId?: number;
  priceSales?: number;
  priceStandard?: number;
  isFeatured?: boolean;
  isDiscovered?: boolean;
}

/**
 * 확장된 독서 상태 응답 DTO
 */
export interface ExtendedReadingStatusResponseDto {
  id: number;
  status: string; // 서버에서 "READ", "READING", "WANT_TO_READ" 형식으로 반환됨
  currentPage?: number;
  startDate?: Date;
  finishDate?: Date;
  readingMemo?: string;
  createdAt: Date;
  updatedAt: Date;
  book: ExtendedBookInfoDto;
}

/**
 * 사용자의 읽기 상태별 책 수 응답 타입
 */
export interface UserReadingStatusCountsDto {
  WANT_TO_READ: number;
  READING: number;
  READ: number;
  total: number;
}

/**
 * 사용자의 리뷰 타입별 수 응답 타입
 */
export interface UserReviewTypeCountsDto {
  general: number;
  discussion: number;
  review: number;
  question: number;
  meetup: number;
  total: number;
}

/**
 * 통계 설정 업데이트 요청 인터페이스
 */
export interface UpdateStatisticsSettingRequest {
  isReadingStatusPublic?: boolean;
  isReadingTimePatternPublic?: boolean;
  isReadingStatusByPeriodPublic?: boolean;
  isGenreAnalysisPublic?: boolean;
  isAuthorPublisherStatsPublic?: boolean;
  isReviewStatsPublic?: boolean;
  isRatingStatsPublic?: boolean;
  isActivityFrequencyPublic?: boolean;
  isRatingHabitsPublic?: boolean;
  isUserInteractionPublic?: boolean;
  isFollowerStatsPublic?: boolean;
  isCommentActivityPublic?: boolean;
  isReviewInfluencePublic?: boolean;
  isLibraryCompositionPublic?: boolean;
  isLibraryPopularityPublic?: boolean;
  isLibraryUpdatePatternPublic?: boolean;
  isLibraryDiversityPublic?: boolean;
  isAmountStatsPublic?: boolean;
  isSearchActivityPublic?: boolean;
  isBookMetadataStatsPublic?: boolean;
}

/**
 * 통계 설정 응답 인터페이스
 */
export interface StatisticsSettingResponse {
  isReadingStatusPublic: boolean;
  isReadingTimePatternPublic: boolean;
  isReadingStatusByPeriodPublic: boolean;
  isGenreAnalysisPublic: boolean;
  isAuthorPublisherStatsPublic: boolean;
  isReviewStatsPublic: boolean;
  isRatingStatsPublic: boolean;
  isActivityFrequencyPublic: boolean;
  isRatingHabitsPublic: boolean;
  isUserInteractionPublic: boolean;
  isFollowerStatsPublic: boolean;
  isCommentActivityPublic: boolean;
  isReviewInfluencePublic: boolean;
  isLibraryCompositionPublic: boolean;
  isLibraryPopularityPublic: boolean;
  isLibraryUpdatePatternPublic: boolean;
  isLibraryDiversityPublic: boolean;
  isAmountStatsPublic: boolean;
  isSearchActivityPublic: boolean;
  isBookMetadataStatsPublic: boolean;
}

/**
 * 독서 상태별 도서 수 통계 응답
 */
export interface ReadingStatusStatsResponse {
  wantToReadCount: number;
  readingCount: number;
  readCount: number;
  completionRate: number;
  isPublic: boolean;
}

/**
 * 기간별 독서 상태 통계 응답
 */
export interface ReadingStatusByPeriodResponse {
  yearly: {
    year: string;
    wantToReadCount: number;
    readingCount: number;
    readCount: number;
  }[];
  monthly: {
    month: string;
    wantToReadCount: number;
    readingCount: number;
    readCount: number;
  }[];
  weekly: {
    week: string;
    wantToReadCount: number;
    readingCount: number;
    readCount: number;
  }[];
  daily: {
    date: string;
    wantToReadCount: number;
    readingCount: number;
    readCount: number;
  }[];
  isPublic: boolean;
}

/**
 * 장르/카테고리 분석 통계 응답
 */
export interface GenreAnalysisResponse {
  categoryCounts: { category: string; count: number }[];
  subCategoryCounts: { subCategory: string; count: number }[];
  mostReadCategory: string;
  yearly: {
    year: string;
    categories: { category: string; count: number }[];
    subCategories: { subCategory: string; count: number }[];
  }[];
  monthly: {
    month: string;
    categories: { category: string; count: number }[];
    subCategories: { subCategory: string; count: number }[];
  }[];
  weekly: {
    week: string;
    categories: { category: string; count: number }[];
    subCategories: { subCategory: string; count: number }[];
  }[];
  daily: {
    date: string;
    categories: { category: string; count: number }[];
    subCategories: { subCategory: string; count: number }[];
  }[];
  isPublic: boolean;
}

/**
 * 저자/출판사 통계 응답
 */
export interface AuthorPublisherStatsResponse {
  topAuthors: { author: string; count: number }[];
  topPublishers: { publisher: string; count: number }[];
  publishYearDistribution: { year: string; count: number }[];
  isPublic: boolean;
}

/**
 * 리뷰 통계 응답
 */
export interface ReviewStatsResponse {
  totalReviews: number;
  monthlyReviewCounts: { month: string; count: number }[];
  reviewTypeDistribution: { type: string; percentage: number }[];
  averageReviewLength: number;
  isPublic: boolean;
}

/**
 * 평점 통계 응답
 */
export interface RatingStatsResponse {
  averageRating: number;
  ratingDistribution: { rating: number; count: number }[];
  categoryRatings: { category: string; averageRating: number }[];
  monthlyAverageRatings: { month: string; averageRating: number }[];
  isPublic: boolean;
}

/**
 * 액티비티 빈도 통계 응답
 */
export interface ActivityFrequencyResponse {
  averageReviewInterval: number;
  averageRatingInterval: number;
  mostActiveHour: string;
  mostActiveDay: string;
  isPublic: boolean;
}

/**
 * 평가 습관 통계 응답
 */
export interface RatingHabitsResponse {
  highestRatedBooks: { title: string; author: string; rating: number }[];
  lowestRatedBooks: { title: string; author: string; rating: number }[];
  ratingLengthCorrelation: { rating: number; averageLength: number }[];
  isPublic: boolean;
}

/**
 * 사용자 상호작용 통계 응답
 */
export interface UserInteractionResponse {
  totalLikesReceived: number;
  totalCommentsReceived: number;
  engagementRate: number;
  monthlyLikes: { month: string; count: number }[];
  isPublic: boolean;
}

/**
 * 팔로워/팔로잉 통계 응답
 */
export interface FollowerStatsResponse {
  followersCount: number;
  followingCount: number;
  followerGrowth: { date: string; count: number }[];
  isPublic: boolean;
}

/**
 * 댓글 활동 통계 응답
 */
export interface CommentActivityResponse {
  totalComments: number;
  commentsPerWeek: number;
  commentsPerReview: { range: string; count: number }[];
  isPublic: boolean;
}

/**
 * 리뷰 영향력 통계 응답
 */
export interface ReviewInfluenceResponse {
  averageLikesPerReview: number;
  popularReviews: { id: number; content: string; likes: number }[];
  communityContributionScore: number;
  isPublic: boolean;
}

/**
 * 서재 구성 통계 응답
 */
export interface LibraryCompositionResponse {
  totalLibraries: number;
  booksPerLibrary: { name: string; count: number }[];
  tagsDistribution: {
    library: string;
    tags: { tag: string; count: number }[];
  }[];
  isPublic: boolean;
}

/**
 * 서재 인기도 통계 응답
 */
export interface LibraryPopularityResponse {
  subscribersPerLibrary: { library: string; subscribers: number }[];
  mostPopularLibrary: string;
  popularityTrend: {
    library: string;
    trend: { date: string; subscribers: number }[];
  }[];
  isPublic: boolean;
}

/**
 * 서재 업데이트 패턴 통계 응답
 */
export interface LibraryUpdatePatternResponse {
  updateFrequency: { library: string; updatesPerMonth: number }[];
  mostActiveLibrary: string;
  weekdayActivity: { day: string; count: number }[];
  isPublic: boolean;
}

/**
 * 서재 다양성 통계 응답
 */
export interface LibraryDiversityResponse {
  genreDiversityIndex: { library: string; index: number }[];
  mostSpecializedLibrary: string;
  mostDiverseLibrary: string;
  isPublic: boolean;
}

/**
 * 금액 통계 응답
 */
export interface AmountStatsResponse {
  estimatedTotalSpent: number;
  monthlySpending: { month: string; amount: number }[];
  categoryPriceAverage: { category: string; averagePrice: number }[];
  isPublic: boolean;
}

/**
 * 검색 활동 통계 응답
 */
export interface SearchActivityResponse {
  searchCount: number;
  topSearchTerms: { term: string; count: number }[];
  searchPattern: string;
  isPublic: boolean;
}

/**
 * 도서 메타데이터 통계 응답
 */
export interface BookMetadataStatsResponse {
  averageBookAge: number;
  translationRatio: number;
  publicationYearDistribution: { year: string; count: number }[];
  isPublic: boolean;
}

/**
 * 인기 검색어 통계 응답
 */
export interface RecentPopularSearchResponse {
  term: string;
  count: number;
}
