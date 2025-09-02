import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Settings } from 'lucide-react';
import { useCallback, useState } from 'react';
import { ManageDiscoverBooksDialog } from './ManageDiscoverBooksDialog';

const ADMIN_USER_ID = 1;

export function AdminBookManageButton() {
  const currentUser = useCurrentUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  if (!currentUser || currentUser.id !== ADMIN_USER_ID) {
    return null;
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 rounded-full p-0"
        onClick={handleOpenDialog}
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
