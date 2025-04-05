import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

interface PrivacySettingsProps {
  onSave: () => void;
}

export default function PrivacySettings({ onSave }: PrivacySettingsProps) {
  const [isProfilePublic, setIsProfilePublic] = useState(true);
  const [showReadingActivity, setShowReadingActivity] = useState(true);
  const [showFollowers, setShowFollowers] = useState(true);
  const [showFollowing, setShowFollowing] = useState(true);
  const [showRatings, setShowRatings] = useState(true);
  const [showReadingStats, setShowReadingStats] = useState(true);
  const [allowDataCollection, setAllowDataCollection] = useState(true);

  return (
    <div className="bg-white p-6">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">
        개인정보 보호 설정
      </h2>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">프로필 공개</h3>
              <p className="text-xs text-gray-500">
                내 프로필을 다른 사용자에게 공개합니다.
              </p>
            </div>
            <Switch
              checked={isProfilePublic}
              onValueChange={value => setIsProfilePublic(value)}
              className="data-[state=checked]:bg-gray-900"
            />
          </div>
          <Separator />

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                독서 활동 공개
              </h3>
              <p className="text-xs text-gray-500">
                내 독서 활동을 팔로워에게 공개합니다.
              </p>
            </div>
            <Switch
              checked={showReadingActivity}
              onValueChange={value => setShowReadingActivity(value)}
              className="data-[state=checked]:bg-gray-900"
            />
          </div>
          <Separator />

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">팔로워 공개</h3>
              <p className="text-xs text-gray-500">
                내 팔로워 목록을 다른 사용자에게 공개합니다.
              </p>
            </div>
            <Switch
              checked={showFollowers}
              onValueChange={value => setShowFollowers(value)}
              className="data-[state=checked]:bg-gray-900"
            />
          </div>
          <Separator />

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                팔로잉 목록 공개
              </h3>
              <p className="text-xs text-gray-500">
                내가 팔로우하는 사용자 목록을 다른 사용자에게 공개합니다.
              </p>
            </div>
            <Switch
              checked={showFollowing}
              onValueChange={value => setShowFollowing(value)}
              className="data-[state=checked]:bg-gray-900"
            />
          </div>
          <Separator />

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">평점 공개</h3>
              <p className="text-xs text-gray-500">
                내가 책에 매긴 평점을 다른 사용자에게 공개합니다.
              </p>
            </div>
            <Switch
              checked={showRatings}
              onValueChange={value => setShowRatings(value)}
              className="data-[state=checked]:bg-gray-900"
            />
          </div>
          <Separator />

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                독서 통계 공개
              </h3>
              <p className="text-xs text-gray-500">
                내 독서 통계를 다른 사용자에게 공개합니다.
              </p>
            </div>
            <Switch
              checked={showReadingStats}
              onValueChange={value => setShowReadingStats(value)}
              className="data-[state=checked]:bg-gray-900"
            />
          </div>
          <Separator />

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                데이터 수집 허용
              </h3>
              <p className="text-xs text-gray-500">
                서비스 개선을 위해 내 독서 데이터를 익명으로 수집하는 것을
                허용합니다.
              </p>
            </div>
            <Switch
              checked={allowDataCollection}
              onValueChange={value => setAllowDataCollection(value)}
              className="data-[state=checked]:bg-gray-900"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
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
