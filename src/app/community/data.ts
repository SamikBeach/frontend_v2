import { Comment, Event, Post, ReadingGroup, UserProfile } from './types';

// 더미 사용자 데이터
export const users: UserProfile[] = [
  {
    id: 1,
    name: '김철수',
    username: 'cheolsu',
    avatar: 'https://i.pravatar.cc/150?u=user1',
  },
  {
    id: 2,
    name: '이영희',
    username: 'younghee',
    avatar: 'https://i.pravatar.cc/150?u=user2',
  },
  {
    id: 3,
    name: '박지민',
    username: 'jimin',
    avatar: 'https://i.pravatar.cc/150?u=user3',
  },
  {
    id: 4,
    name: '최동욱',
    username: 'dongwook',
    avatar: 'https://i.pravatar.cc/150?u=user4',
  },
  {
    id: 5,
    name: '정수아',
    username: 'sua',
    avatar: 'https://i.pravatar.cc/150?u=user5',
  },
];

// 커뮤니티 메인 카테고리 (파스텔톤 색상)
export const mainCategories = [
  {
    id: 'all',
    name: '전체',
    color: '#E2E8F0', // 파스텔 그레이
  },
  {
    id: 'discussion',
    name: '토론',
    color: '#FFF8E2', // 파스텔 옐로우
  },
  {
    id: 'bookreport',
    name: '독서 감상',
    color: '#F2E2FF', // 파스텔 퍼플
  },
  {
    id: 'question',
    name: '질문',
    color: '#FFE2EC', // 파스텔 코럴
  },
  {
    id: 'meetup',
    name: '모임',
    color: '#E2FFFC', // 파스텔 민트
  },
];

// 커뮤니티 정렬 옵션 (파스텔톤 색상)
export const sortOptions = [
  {
    id: 'popular',
    name: '인기',
    color: '#FFE2E2', // 파스텔 핑크
  },
  {
    id: 'following',
    name: '팔로잉',
    color: '#E2F0FF', // 파스텔 블루
  },
  {
    id: 'latest',
    name: '최신',
    color: '#E2FFE9', // 파스텔 그린
  },
];

// 더미 댓글 데이터 추가
export const comments: Comment[] = [
  {
    id: 1,
    postId: 1,
    author: users[1],
    content:
      '칸트의 인식론에 대한 통찰이 정말 훌륭한 것 같아요. 저도 읽어봐야겠어요!',
    timestamp: '2024-04-01T15:10:00',
    likes: 5,
  },
  {
    id: 2,
    postId: 1,
    author: users[2],
    content:
      '선험적 종합판단이라는 개념이 어려웠는데, 이 책을 통해 조금 더 이해할 수 있었습니다.',
    timestamp: '2024-04-01T16:05:00',
    likes: 3,
  },
  {
    id: 3,
    postId: 2,
    author: users[0],
    content:
      '도스토예프스키의 심리묘사는 정말 타의 추종을 불허하는 것 같아요. 특히 라스콜니코프의 내면 묘사가 인상적이었습니다.',
    timestamp: '2024-03-31T13:22:00',
    likes: 7,
  },
  {
    id: 4,
    postId: 3,
    author: users[3],
    content:
      '니체의 초인 개념에 대해 더 자세히 알고 싶습니다. 혹시 추천할만한 해설서가 있을까요?',
    timestamp: '2024-03-30T18:15:00',
    likes: 2,
  },
  {
    id: 5,
    postId: 4,
    author: users[1],
    content:
      '아리스토텔레스의 행복론이 현대 심리학과 연결된다는 점이 흥미롭네요. 웰빙에 대한 고전적 관점과 현대적 관점의 비교가 인상적입니다.',
    timestamp: '2024-03-29T10:45:00',
    likes: 4,
  },
];

// 더미 피드 포스트 데이터
export const posts: Post[] = [
  {
    id: 1,
    category: 'discussion',
    author: users[0],
    timestamp: '2024-04-01T14:32:00',
    content:
      '칸트의 "순수이성비판"을 드디어 완독했습니다! 이성의 한계와 가능성에 대한 깊은 탐구가 정말 인상적이었어요. 특히 선험적 종합판단이라는 개념이 현대 철학에 미친 영향을 생각해보면 그 중요성이 더욱 와닿습니다. 여러분은 칸트의 어떤 관점이 가장 인상깊으셨나요?',
    book: {
      title: '순수이성비판',
      author: '임마누엘 칸트',
      coverImage: 'https://picsum.photos/seed/book1/240/360',
    },
    likes: 24,
    comments: 8,
    shares: 3,
  },
  {
    id: 2,
    category: 'bookreport',
    author: users[1],
    timestamp: '2024-03-31T11:15:00',
    content:
      '도스토예프스키의 "죄와 벌"을 읽고 있는데, 라스콜니코프의 내적 갈등이 너무 생생하게 그려져 있어요. 인간 심리의 복잡함을 이렇게 깊이 들여다본 작품이 또 있을까요? 특히 죄책감과 속죄의 테마가 현대 사회에도 여전히 큰 울림을 주는 것 같습니다.',
    book: {
      title: '죄와 벌',
      author: '표도르 도스토예프스키',
      coverImage: 'https://picsum.photos/seed/book2/240/360',
    },
    image: 'https://picsum.photos/seed/reading1/600/400',
    likes: 32,
    comments: 12,
    shares: 5,
  },
  {
    id: 3,
    category: 'discussion',
    author: users[2],
    timestamp: '2024-03-30T16:45:00',
    content:
      '요즘 철학 고전 스터디에서 니체의 "차라투스트라는 이렇게 말했다"를 함께 읽고 있어요. 초인(Übermensch)의 개념에 대해 열띤 토론을 했는데, 다양한 관점을 들을 수 있어 정말 좋았습니다. 함께 고전을 읽는 즐거움을 다시 한번 느끼는 중입니다. 다음에는 어떤 책을 함께 읽을지 고민이네요.',
    book: {
      title: '차라투스트라는 이렇게 말했다',
      author: '프리드리히 니체',
      coverImage: 'https://picsum.photos/seed/book3/240/360',
    },
    likes: 45,
    comments: 18,
    shares: 7,
  },
  {
    id: 4,
    category: 'question',
    author: users[3],
    timestamp: '2024-03-29T09:20:00',
    content:
      '아리스토텔레스의 "니코마코스 윤리학"에서 행복(eudaimonia)의 개념이 현대 심리학의 웰빙 개념과 어떻게 연결되는지 연구 중입니다. 덕의 실천을 통한 행복 추구라는 관점이 오늘날에도 여전히 유효하다고 생각하는데, 여러분의 생각은 어떠신가요?',
    book: {
      title: '니코마코스 윤리학',
      author: '아리스토텔레스',
      coverImage: 'https://picsum.photos/seed/book4/240/360',
    },
    likes: 29,
    comments: 15,
    shares: 6,
  },
  {
    id: 5,
    category: 'bookreport',
    author: users[4],
    timestamp: '2024-03-28T15:10:00',
    content:
      '유발 하라리의 "사피엔스"를 읽으면서 인류의 역사를 거시적 관점에서 바라볼 수 있었어요. 특히 인지혁명, 농업혁명, 과학혁명이라는 틀로 역사를 재해석하는 부분이 흥미로웠습니다. 하지만 일부 역사적 해석에는 단순화가 있다는 생각도 들었습니다. 함께 토론해볼까요?',
    book: {
      title: '사피엔스',
      author: '유발 하라리',
      coverImage: 'https://picsum.photos/seed/book5/240/360',
    },
    likes: 38,
    comments: 22,
    shares: 9,
  },
  {
    id: 6,
    category: 'meetup',
    author: users[0],
    timestamp: '2024-03-27T11:30:00',
    content:
      '다음 주 토요일 오후 2시에 서울 강남 책숲 카페에서 셰익스피어 4대 비극 독서 모임을 진행합니다. 관심 있으신 분들의 참여를 기다립니다. 책은 준비해오시고, 간단한 소감문도 작성해오시면 더 풍부한 대화가 될 것 같아요.',
    image: 'https://picsum.photos/seed/meetup1/600/400',
    likes: 18,
    comments: 7,
    shares: 12,
  },
];

// 더미 독서그룹 데이터
export const readingGroups: ReadingGroup[] = [
  {
    id: 1,
    name: '철학 고전 스터디',
    members: 42,
    image: 'https://picsum.photos/seed/group1/200/120',
    description: '소크라테스부터 니체까지, 함께 읽고 토론해요',
  },
  {
    id: 2,
    name: '문학의 밤',
    members: 37,
    image: 'https://picsum.photos/seed/group2/200/120',
    description: '매주 한 편의 소설을 함께 읽고 이야기 나눕니다',
  },
  {
    id: 3,
    name: '역사 탐험대',
    members: 25,
    image: 'https://picsum.photos/seed/group3/200/120',
    description: '역사 고전을 통해 과거와 현재를 연결합니다',
  },
];

// 더미 이벤트 데이터
export const events: Event[] = [
  {
    id: 1,
    title: '플라톤 대화록 전문가 특강',
    date: '2024-04-15T18:00:00',
    location: '온라인 ZOOM',
    image: 'https://picsum.photos/seed/event1/200/120',
  },
  {
    id: 2,
    title: '셰익스피어 4대 비극 독서 모임',
    date: '2024-04-20T14:00:00',
    location: '서울 강남구 책숲 카페',
    image: 'https://picsum.photos/seed/event2/200/120',
  },
];
