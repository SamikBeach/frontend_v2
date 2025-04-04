import {
  ArrowDownAZ,
  Calendar,
  CalendarClock,
  CalendarDays,
  Clock,
  Clock3,
  Star,
} from 'lucide-react';
import { Category, Library, SortOption } from './types';

// 라이브러리 카테고리 (파스텔톤 색상)
export const libraryCategories: Category[] = [
  {
    id: 'all',
    name: '전체',
    color: '#E2E8F0', // 파스텔 그레이
  },
  {
    id: 'philosophy',
    name: '철학',
    color: '#FFF8E2', // 파스텔 옐로우
  },
  {
    id: 'literature',
    name: '문학',
    color: '#F2E2FF', // 파스텔 퍼플
  },
  {
    id: 'history',
    name: '역사',
    color: '#FFE2EC', // 파스텔 코럴
  },
  {
    id: 'science',
    name: '과학',
    color: '#E2FFFC', // 파스텔 민트
  },
];

// 정렬 옵션
export const sortOptions: SortOption[] = [
  {
    id: 'popular',
    label: '인기순',
    icon: () => <Star className="mr-2 h-4 w-4 text-[#FFAB00]" />,
    sortFn: (a, b) => b.followers - a.followers,
    supportsTimeRange: true,
  },
  {
    id: 'latest',
    label: '최신순',
    icon: () => <Calendar className="mr-2 h-4 w-4 text-gray-500" />,
    sortFn: (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  },
  {
    id: 'title',
    label: '제목순',
    icon: () => <ArrowDownAZ className="mr-2 h-4 w-4 text-gray-500" />,
    sortFn: (a, b) => a.title.localeCompare(b.title, 'ko'),
  },
];

// 기간 필터 옵션
export const timeRangeOptions = [
  {
    id: 'all',
    label: '전체 기간',
    icon: <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />,
  },
  {
    id: 'today',
    label: '오늘',
    icon: <Clock className="mr-2 h-4 w-4 text-gray-500" />,
  },
  {
    id: 'week',
    label: '이번 주',
    icon: <Clock3 className="mr-2 h-4 w-4 text-gray-500" />,
  },
  {
    id: 'month',
    label: '이번 달',
    icon: <Calendar className="mr-2 h-4 w-4 text-gray-500" />,
  },
  {
    id: 'year',
    label: '올해',
    icon: <CalendarClock className="mr-2 h-4 w-4 text-gray-500" />,
  },
];

// 더미 서재 데이터
export const libraries: Library[] = [
  {
    id: 1,
    title: '철학의 시작',
    description: '서양 철학의 기초를 다지는 필수 고전들',
    category: 'philosophy',
    owner: {
      name: '김철수',
      username: 'cheolsu',
      avatar: 'https://i.pravatar.cc/150?u=user1',
    },
    books: [
      {
        id: 1,
        title: '소크라테스의 변명',
        author: '플라톤',
        coverImage: 'https://picsum.photos/seed/book1/240/360',
      },
      {
        id: 2,
        title: '니코마코스 윤리학',
        author: '아리스토텔레스',
        coverImage: 'https://picsum.photos/seed/book4/240/360',
      },
    ],
    followers: 128,
    isPublic: true,
    tags: ['철학', '고전', '그리스'],
    timestamp: '2024-04-01T14:32:00',
  },
  {
    id: 2,
    title: '문학의 향기',
    description: '세계 문학의 걸작들을 모아둔 서재입니다',
    category: 'literature',
    owner: {
      name: '이영희',
      username: 'younghee',
      avatar: 'https://i.pravatar.cc/150?u=user2',
    },
    books: [
      {
        id: 3,
        title: '죄와 벌',
        author: '표도르 도스토예프스키',
        coverImage: 'https://picsum.photos/seed/book2/240/360',
      },
      {
        id: 4,
        title: '1984',
        author: '조지 오웰',
        coverImage: 'https://picsum.photos/seed/book5/240/360',
      },
    ],
    followers: 256,
    isPublic: true,
    tags: ['문학', '소설', '세계문학'],
    timestamp: '2024-03-28T11:15:00',
  },
  {
    id: 3,
    title: '역사 속의 지혜',
    description: '역사 속에서 배우는 삶의 교훈',
    category: 'history',
    owner: {
      name: '박지민',
      username: 'jimin',
      avatar: 'https://i.pravatar.cc/150?u=user3',
    },
    books: [
      {
        id: 5,
        title: '로마제국 쇠망사',
        author: '에드워드 기번',
        coverImage: 'https://picsum.photos/seed/book3/240/360',
      },
      {
        id: 6,
        title: '사기',
        author: '사마천',
        coverImage: 'https://picsum.photos/seed/book6/240/360',
      },
    ],
    followers: 89,
    isPublic: true,
    tags: ['역사', '고전', '교양'],
    timestamp: '2024-03-25T09:45:00',
  },
  {
    id: 4,
    title: '현대 과학의 이해',
    description: '누구나 이해할 수 있는 과학 명저 모음',
    category: 'science',
    owner: {
      name: '최동욱',
      username: 'dongwook',
      avatar: 'https://i.pravatar.cc/150?u=user4',
    },
    books: [
      {
        id: 7,
        title: '코스모스',
        author: '칼 세이건',
        coverImage: 'https://picsum.photos/seed/book7/240/360',
      },
      {
        id: 8,
        title: '이기적 유전자',
        author: '리처드 도킨스',
        coverImage: 'https://picsum.photos/seed/book8/240/360',
      },
    ],
    followers: 142,
    isPublic: true,
    tags: ['과학', '물리학', '생물학'],
    timestamp: '2024-03-30T16:22:00',
  },
  {
    id: 5,
    title: '철학과 인간',
    description: '인간 존재의 본질을 탐구하는 철학 명저 컬렉션',
    category: 'philosophy',
    owner: {
      name: '정민석',
      username: 'minseok',
      avatar: 'https://i.pravatar.cc/150?u=user5',
    },
    books: [
      {
        id: 9,
        title: '존재와 시간',
        author: '마르틴 하이데거',
        coverImage: 'https://picsum.photos/seed/book9/240/360',
      },
      {
        id: 10,
        title: '실존주의는 휴머니즘이다',
        author: '장 폴 사르트르',
        coverImage: 'https://picsum.photos/seed/book10/240/360',
      },
    ],
    followers: 118,
    isPublic: true,
    tags: ['철학', '실존주의', '인간론'],
    timestamp: '2024-03-15T11:22:00',
  },
  {
    id: 6,
    title: '미스터리 소설 컬렉션',
    description: '잠 못 이루게 하는 미스터리 스릴러 모음',
    category: 'literature',
    owner: {
      name: '한지연',
      username: 'jiyeon',
      avatar: 'https://i.pravatar.cc/150?u=user6',
    },
    books: [
      {
        id: 11,
        title: '오리엔트 특급 살인',
        author: '아가사 크리스티',
        coverImage: 'https://picsum.photos/seed/book11/240/360',
      },
      {
        id: 12,
        title: '양들의 침묵',
        author: '토마스 해리스',
        coverImage: 'https://picsum.photos/seed/book12/240/360',
      },
    ],
    followers: 203,
    isPublic: true,
    tags: ['미스터리', '스릴러', '소설'],
    timestamp: '2024-03-22T09:15:00',
  },
  {
    id: 7,
    title: '조선의 역사',
    description: '조선 시대의 역사와 문화를 살펴보는 서재',
    category: 'history',
    owner: {
      name: '송민우',
      username: 'minwoo',
      avatar: 'https://i.pravatar.cc/150?u=user7',
    },
    books: [
      {
        id: 13,
        title: '조선왕조실록',
        author: '여러 저자',
        coverImage: 'https://picsum.photos/seed/book13/240/360',
      },
      {
        id: 14,
        title: '조선의 문화와 예술',
        author: '김문진',
        coverImage: 'https://picsum.photos/seed/book14/240/360',
      },
    ],
    followers: 156,
    isPublic: true,
    tags: ['역사', '조선', '한국사'],
    timestamp: '2024-03-18T14:30:00',
  },
  {
    id: 8,
    title: '현대 물리학의 세계',
    description: '양자역학과 상대성이론을 쉽게 이해하기',
    category: 'science',
    owner: {
      name: '이태영',
      username: 'taeyoung',
      avatar: 'https://i.pravatar.cc/150?u=user8',
    },
    books: [
      {
        id: 15,
        title: '시간의 역사',
        author: '스티븐 호킹',
        coverImage: 'https://picsum.photos/seed/book15/240/360',
      },
      {
        id: 16,
        title: '상대성 이론',
        author: '앨버트 아인슈타인',
        coverImage: 'https://picsum.photos/seed/book16/240/360',
      },
    ],
    followers: 175,
    isPublic: true,
    tags: ['과학', '물리학', '우주론'],
    timestamp: '2024-03-29T10:15:00',
  },
  {
    id: 9,
    title: '동양 철학의 지혜',
    description: '동양 철학의 핵심 사상과 가르침',
    category: 'philosophy',
    owner: {
      name: '윤서연',
      username: 'seoyeon',
      avatar: 'https://i.pravatar.cc/150?u=user9',
    },
    books: [
      {
        id: 17,
        title: '논어',
        author: '공자',
        coverImage: 'https://picsum.photos/seed/book17/240/360',
      },
      {
        id: 18,
        title: '도덕경',
        author: '노자',
        coverImage: 'https://picsum.photos/seed/book18/240/360',
      },
    ],
    followers: 144,
    isPublic: true,
    tags: ['철학', '동양철학', '고전'],
    timestamp: '2024-03-19T13:40:00',
  },
  {
    id: 10,
    title: '고전 시 모음',
    description: '동서양의 가장 아름다운 시 모음집',
    category: 'literature',
    owner: {
      name: '조현우',
      username: 'hyunwoo',
      avatar: 'https://i.pravatar.cc/150?u=user10',
    },
    books: [
      {
        id: 19,
        title: '잎새에 적힌 시',
        author: '월트 휘트먼',
        coverImage: 'https://picsum.photos/seed/book19/240/360',
      },
      {
        id: 20,
        title: '청련집',
        author: '김소월',
        coverImage: 'https://picsum.photos/seed/book20/240/360',
      },
    ],
    followers: 189,
    isPublic: true,
    tags: ['문학', '시', '고전'],
    timestamp: '2024-03-24T16:50:00',
  },
  {
    id: 11,
    title: '세계 대전의 역사',
    description: '제1차, 제2차 세계대전의 주요 사건과 영향',
    category: 'history',
    owner: {
      name: '강동현',
      username: 'donghyun',
      avatar: 'https://i.pravatar.cc/150?u=user11',
    },
    books: [
      {
        id: 21,
        title: '제1차 세계대전',
        author: '존 키건',
        coverImage: 'https://picsum.photos/seed/book21/240/360',
      },
      {
        id: 22,
        title: '제2차 세계대전사',
        author: '윈스턴 처칠',
        coverImage: 'https://picsum.photos/seed/book22/240/360',
      },
    ],
    followers: 98,
    isPublic: true,
    tags: ['역사', '전쟁사', '세계사'],
    timestamp: '2024-03-26T11:25:00',
  },
  {
    id: 12,
    title: '생명과학의 세계',
    description: '현대 생물학과 생명공학의 이해',
    category: 'science',
    owner: {
      name: '김유진',
      username: 'eugene',
      avatar: 'https://i.pravatar.cc/150?u=user12',
    },
    books: [
      {
        id: 23,
        title: '종의 기원',
        author: '찰스 다윈',
        coverImage: 'https://picsum.photos/seed/book23/240/360',
      },
      {
        id: 24,
        title: '유전자의 비밀',
        author: '제임스 왓슨',
        coverImage: 'https://picsum.photos/seed/book24/240/360',
      },
    ],
    followers: 135,
    isPublic: true,
    tags: ['과학', '생물학', '진화론'],
    timestamp: '2024-03-31T08:15:00',
  },
  {
    id: 13,
    title: '현대 윤리학의 쟁점',
    description: '현대 사회의 윤리적 문제들에 대한 철학적 접근',
    category: 'philosophy',
    owner: {
      name: '정수진',
      username: 'sujin',
      avatar: 'https://i.pravatar.cc/150?u=user13',
    },
    books: [
      {
        id: 25,
        title: '정의란 무엇인가',
        author: '마이클 샌델',
        coverImage: 'https://picsum.photos/seed/book25/240/360',
      },
      {
        id: 26,
        title: '도덕적 동물',
        author: '로버트 라이트',
        coverImage: 'https://picsum.photos/seed/book26/240/360',
      },
    ],
    followers: 167,
    isPublic: true,
    tags: ['철학', '윤리학', '현대철학'],
    timestamp: '2024-03-23T14:05:00',
  },
  {
    id: 14,
    title: '한국 문학의 정수',
    description: '한국 문학의 대표작들을 모았습니다',
    category: 'literature',
    owner: {
      name: '박수민',
      username: 'sumin',
      avatar: 'https://i.pravatar.cc/150?u=user14',
    },
    books: [
      {
        id: 27,
        title: '삼대',
        author: '염상섭',
        coverImage: 'https://picsum.photos/seed/book27/240/360',
      },
      {
        id: 28,
        title: '태백산맥',
        author: '조정래',
        coverImage: 'https://picsum.photos/seed/book28/240/360',
      },
    ],
    followers: 211,
    isPublic: true,
    tags: ['문학', '한국문학', '소설'],
    timestamp: '2024-03-27T09:30:00',
  },
  {
    id: 15,
    title: '고대 문명의 신비',
    description: '인류 역사 속 고대 문명들의 이야기',
    category: 'history',
    owner: {
      name: '임지훈',
      username: 'jihoon',
      avatar: 'https://i.pravatar.cc/150?u=user15',
    },
    books: [
      {
        id: 29,
        title: '이집트 문명',
        author: '토비 윌킨슨',
        coverImage: 'https://picsum.photos/seed/book29/240/360',
      },
      {
        id: 30,
        title: '마야와 아즈텍',
        author: '찰스 필립스',
        coverImage: 'https://picsum.photos/seed/book30/240/360',
      },
    ],
    followers: 124,
    isPublic: true,
    tags: ['역사', '고대사', '문명'],
    timestamp: '2024-03-20T15:40:00',
  },
  {
    id: 16,
    title: '컴퓨터 과학의 기초',
    description: '프로그래밍과 컴퓨터 과학의 핵심 원리',
    category: 'science',
    owner: {
      name: '이준호',
      username: 'junho',
      avatar: 'https://i.pravatar.cc/150?u=user16',
    },
    books: [
      {
        id: 31,
        title: '컴퓨터 알고리즘',
        author: '토마스 코르멘',
        coverImage: 'https://picsum.photos/seed/book31/240/360',
      },
      {
        id: 32,
        title: '컴퓨터 구조와 설계',
        author: '데이비드 패터슨',
        coverImage: 'https://picsum.photos/seed/book32/240/360',
      },
    ],
    followers: 198,
    isPublic: true,
    tags: ['과학', '컴퓨터', '프로그래밍'],
    timestamp: '2024-03-16T10:20:00',
  },
  {
    id: 17,
    title: '서양 미학의 이해',
    description: '서양 미학 사상의 역사와 주요 개념',
    category: 'philosophy',
    owner: {
      name: '김서영',
      username: 'seoyoung',
      avatar: 'https://i.pravatar.cc/150?u=user17',
    },
    books: [
      {
        id: 33,
        title: '미학 입문',
        author: '움베르토 에코',
        coverImage: 'https://picsum.photos/seed/book33/240/360',
      },
      {
        id: 34,
        title: '예술의 역사',
        author: '곰브리치',
        coverImage: 'https://picsum.photos/seed/book34/240/360',
      },
    ],
    followers: 87,
    isPublic: true,
    tags: ['철학', '미학', '예술'],
    timestamp: '2024-03-17T13:10:00',
  },
  {
    id: 18,
    title: '판타지 문학의 세계',
    description: '상상력이 펼쳐지는 판타지 문학 컬렉션',
    category: 'literature',
    owner: {
      name: '황주원',
      username: 'juwon',
      avatar: 'https://i.pravatar.cc/150?u=user18',
    },
    books: [
      {
        id: 35,
        title: '반지의 제왕',
        author: 'J.R.R. 톨킨',
        coverImage: 'https://picsum.photos/seed/book35/240/360',
      },
      {
        id: 36,
        title: '해리 포터',
        author: 'J.K. 롤링',
        coverImage: 'https://picsum.photos/seed/book36/240/360',
      },
    ],
    followers: 276,
    isPublic: true,
    tags: ['문학', '판타지', '소설'],
    timestamp: '2024-03-21T17:25:00',
  },
  {
    id: 19,
    title: '근현대 한국사',
    description: '일제강점기부터 현대까지의 한국 역사',
    category: 'history',
    owner: {
      name: '신재민',
      username: 'jaemin',
      avatar: 'https://i.pravatar.cc/150?u=user19',
    },
    books: [
      {
        id: 37,
        title: '한국 근대사의 이해',
        author: '이기백',
        coverImage: 'https://picsum.photos/seed/book37/240/360',
      },
      {
        id: 38,
        title: '대한민국 현대사',
        author: '강만길',
        coverImage: 'https://picsum.photos/seed/book38/240/360',
      },
    ],
    followers: 145,
    isPublic: true,
    tags: ['역사', '한국사', '근현대사'],
    timestamp: '2024-04-02T09:10:00',
  },
  {
    id: 20,
    title: '우주 탐험의 역사',
    description: '인류의 우주 탐험 역사와 최신 발견들',
    category: 'science',
    owner: {
      name: '강혜원',
      username: 'hyewon',
      avatar: 'https://i.pravatar.cc/150?u=user20',
    },
    books: [
      {
        id: 39,
        title: '우주 대탐험',
        author: '닐 디그래스 타이슨',
        coverImage: 'https://picsum.photos/seed/book39/240/360',
      },
      {
        id: 40,
        title: '달과 화성',
        author: '앤드류 체이킨',
        coverImage: 'https://picsum.photos/seed/book40/240/360',
      },
    ],
    followers: 159,
    isPublic: true,
    tags: ['과학', '우주', '천문학'],
    timestamp: '2024-03-28T16:45:00',
  },
];
