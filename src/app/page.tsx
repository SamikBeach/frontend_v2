import { redirect } from 'next/navigation';

export default function LandingPage() {
  // 루트 페이지에서 home 디렉터리로 리디렉션
  redirect('/home');
}
