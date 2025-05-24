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
        <ResponsiveDialogContent className="max-h-[95vh] w-[1600px] min-w-[70vw] overflow-hidden rounded-xl p-0 shadow-lg md:p-0">
          <div className="flex h-full flex-col">
            <ResponsiveDialogHeader className="border-b border-gray-100 bg-white p-5">
              <ResponsiveDialogTitle className="text-xl font-semibold text-gray-900">
                발견하기 관리
              </ResponsiveDialogTitle>
            </ResponsiveDialogHeader>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex h-[80vh] flex-col"
            >
              <TabsList className="mx-5 mt-3 grid w-fit grid-cols-2">
                <TabsTrigger value="books" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  도서 관리
                </TabsTrigger>
                <TabsTrigger
                  value="categories"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  카테고리 관리
                </TabsTrigger>
              </TabsList>

              <TabsContent value="books" className="flex-1 overflow-hidden">
                <BooksManagementTab open={open} />
              </TabsContent>

              <TabsContent
                value="categories"
                className="flex-1 overflow-hidden p-5"
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
