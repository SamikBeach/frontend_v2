import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { ManageDiscoverBooksDialog } from './ManageDiscoverBooksDialog';

export function AdminBookManageButton() {
  const currentUser = useCurrentUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 관리자(ID: 1)만 버튼 표시
  if (!currentUser || currentUser.id !== 1) {
    return null;
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 rounded-full p-0"
        onClick={() => setIsDialogOpen(true)}
        title="발견하기 관리"
      >
        <Settings className="h-3 w-3 text-gray-500" />
      </Button>

      <ManageDiscoverBooksDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
