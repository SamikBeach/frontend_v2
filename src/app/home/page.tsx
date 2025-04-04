// 이미지 src를 외부 서비스 URL로 변경
// 이미지가 있는 모든 부분을 찾아 picsum.photos 이미지 URL로 수정
// 예시:
<img 
  src={`https://picsum.photos/seed/${book.id}/200/300`} 
  alt={book.title} 
  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
/>

// 아바타 이미지는 pravatar로 변경
<Avatar>
  <AvatarImage src={`https://i.pravatar.cc/150?u=user${post.id}`} alt={post.author} />
  <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
</Avatar> 