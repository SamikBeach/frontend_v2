import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SearchBarProps {
  value: string;
  onSearchChange: (value: string) => void;
}

export function SearchBar({ value, onSearchChange }: SearchBarProps) {
  // 내부 입력 상태는 제어 컴포넌트로 관리
  const [inputValue, setInputValue] = useState(value);
  // 디바운스된 값이 변경될 때만 부모에게 알림
  const debouncedValue = useDebounce(inputValue, 300);

  // 외부에서 전달된 value가 변경될 때만 내부 상태 업데이트
  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  // 디바운스된 값이 변경되면 부모에게 알림
  useEffect(() => {
    // 기존 value와 다를 때만 호출하여 루프 방지
    if (debouncedValue !== value) {
      onSearchChange(debouncedValue);
    }
  }, [debouncedValue]); // onSearchChange는 dependency에서 제거하여 무한루프 방지

  // 사용자 입력 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="서재 검색..."
        value={inputValue}
        onChange={handleInputChange}
        className="h-10 rounded-xl border-gray-200 bg-[#F9FAFB] pl-9 focus-visible:ring-gray-300"
      />
    </div>
  );
}
