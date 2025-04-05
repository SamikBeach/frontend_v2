import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

interface NotificationSettingsProps {
  onSave: () => void;
}

export default function NotificationSettings({
  onSave,
}: NotificationSettingsProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [siteNotifications, setSiteNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [mentionNotifications, setMentionNotifications] = useState(true);
  const [commentNotifications, setCommentNotifications] = useState(true);
  const [bookRecommendations, setBookRecommendations] = useState(true);

  return (
    <div className="bg-white p-6">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">알림 설정</h2>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">이메일 알림</h3>
              <p className="text-xs text-gray-500">
                독서 활동 및 댓글 알림을 이메일로 받습니다.
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onValueChange={value => setEmailNotifications(value)}
              className="data-[state=checked]:bg-gray-900"
            />
          </div>
          <Separator />

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                사이트 내 알림
              </h3>
              <p className="text-xs text-gray-500">
                사이트 내에서 알림을 받습니다.
              </p>
            </div>
            <Switch
              checked={siteNotifications}
              onValueChange={value => setSiteNotifications(value)}
              className="data-[state=checked]:bg-gray-900"
            />
          </div>
          <Separator />

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                주간 다이제스트
              </h3>
              <p className="text-xs text-gray-500">
                일주일 동안의 활동 요약을 이메일로 받습니다.
              </p>
            </div>
            <Switch
              checked={weeklyDigest}
              onValueChange={value => setWeeklyDigest(value)}
              className="data-[state=checked]:bg-gray-900"
            />
          </div>
          <Separator />

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">멘션 알림</h3>
              <p className="text-xs text-gray-500">
                누군가 나를 멘션하면 알림을 받습니다.
              </p>
            </div>
            <Switch
              checked={mentionNotifications}
              onValueChange={value => setMentionNotifications(value)}
              className="data-[state=checked]:bg-gray-900"
            />
          </div>
          <Separator />

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                댓글 및 좋아요 알림
              </h3>
              <p className="text-xs text-gray-500">
                내 리뷰에 댓글이나 좋아요가 달리면 알림을 받습니다.
              </p>
            </div>
            <Switch
              checked={commentNotifications}
              onValueChange={value => setCommentNotifications(value)}
              className="data-[state=checked]:bg-gray-900"
            />
          </div>
          <Separator />

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                책 추천 알림
              </h3>
              <p className="text-xs text-gray-500">
                내 독서 취향에 맞는 새로운 책 추천을 받습니다.
              </p>
            </div>
            <Switch
              checked={bookRecommendations}
              onValueChange={value => setBookRecommendations(value)}
              className="data-[state=checked]:bg-gray-900"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={onSave}
            className="h-10 rounded-md bg-gray-900 px-5 hover:bg-gray-800"
          >
            변경사항 저장
          </Button>
        </div>
      </div>
    </div>
  );
}
