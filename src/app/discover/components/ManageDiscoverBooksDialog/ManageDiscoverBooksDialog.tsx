import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Settings } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BooksManagementTab } from './components/BooksManagementTab';
import { CategoriesManagementTab } from './components/CategoriesManagementTab';
import { useTabState } from './hooks';
import { ManageDiscoverBooksDialogProps } from './types';

export function ManageDiscoverBooksDialog({
  open,
  onOpenChange,
}: ManageDiscoverBooksDialogProps) {
  const { activeTab, setActiveTab } = useTabState();

  return (
    <DndProvider backend={HTML5Backend}>
      <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
        <ResponsiveDialogContent className="max-h-[98vh] w-full max-w-[95vw] overflow-hidden rounded-xl p-0 shadow-lg md:max-h-[95vh] md:w-[1600px] md:min-w-[95vw] md:p-0">
          <div className="flex h-full flex-col">
            <ResponsiveDialogHeader className="border-b border-gray-100 bg-white p-2 md:p-3">
              <ResponsiveDialogTitle className="text-base font-semibold text-gray-900 md:text-lg">
                발견하기 관리
              </ResponsiveDialogTitle>
            </ResponsiveDialogHeader>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex h-[94vh] flex-col md:h-[85vh]"
            >
              <TabsList className="mx-2 mt-1 grid w-fit grid-cols-2 md:mx-3 md:mt-2">
                <TabsTrigger
                  value="books"
                  className="flex items-center gap-1 text-xs md:gap-2 md:text-sm"
                >
                  <BookOpen className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">도서 관리</span>
                  <span className="sm:hidden">도서</span>
                </TabsTrigger>
                <TabsTrigger
                  value="categories"
                  className="flex items-center gap-1 text-xs md:gap-2 md:text-sm"
                >
                  <Settings className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">카테고리 관리</span>
                  <span className="sm:hidden">카테고리</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="books" className="flex-1 overflow-hidden">
                <BooksManagementTab open={open} />
              </TabsContent>

              <TabsContent
                value="categories"
                className="flex-1 overflow-hidden p-1 md:p-2"
              >
                <CategoriesManagementTab />
              </TabsContent>
            </Tabs>
          </div>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </DndProvider>
  );
}
