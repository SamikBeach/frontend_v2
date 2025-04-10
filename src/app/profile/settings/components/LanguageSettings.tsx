import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

interface LanguageSettingsProps {
  onSave: () => void;
}

export default function LanguageSettings({ onSave }: LanguageSettingsProps) {
  const [language, setLanguage] = useState('ko');
  const [region, setRegion] = useState('ko-KR');
  const [dateFormat, setDateFormat] = useState('yyyy-MM-dd');
  const [timeFormat, setTimeFormat] = useState('24hr');

  // 날짜 형식 예시를 동적으로 생성
  const getDateExample = (format: string) => {
    const date = new Date(2023, 0, 31); // 2023년 1월 31일

    switch (format) {
      case 'yyyy-MM-dd':
        return '2023-01-31';
      case 'dd/MM/yyyy':
        return '31/01/2023';
      case 'MM/dd/yyyy':
        return '01/31/2023';
      case 'yyyy년 MM월 dd일':
        return '2023년 01월 31일';
      default:
        return '2023-01-31';
    }
  };

  // 시간 형식 예시를 동적으로 생성
  const getTimeExample = (format: string) => {
    const time = new Date();
    time.setHours(14, 30, 0);

    return format === '24hr' ? '14:30' : '오후 2:30';
  };

  const dateFormats = [
    { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD', example: '2023-01-31' },
    { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY', example: '31/01/2023' },
    { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY', example: '01/31/2023' },
    { value: 'yyyy년 MM월 dd일', label: '연월일', example: '2023년 01월 31일' },
  ];

  const timeFormats = [
    { value: '24hr', label: '24시간', example: '14:30' },
    { value: '12hr', label: '12시간', example: '오후 2:30' },
  ];

  return (
    <div className="bg-white p-6">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">
        언어 및 지역 설정
      </h2>

      <div className="mb-8">
        <h3 className="mb-4 text-base font-medium text-gray-900">
          인터페이스 언어
        </h3>
        <RadioGroup
          value={language}
          onValueChange={setLanguage}
          className="space-y-3"
        >
          <div className="flex cursor-pointer items-center gap-2">
            <RadioGroupItem
              value="ko"
              id="ko"
              className="cursor-pointer border-gray-300 text-gray-900"
            />
            <Label
              htmlFor="ko"
              className="cursor-pointer text-sm text-gray-700"
            >
              한국어
            </Label>
          </div>
          <div className="flex cursor-pointer items-center gap-2">
            <RadioGroupItem
              value="en"
              id="en"
              className="cursor-pointer border-gray-300 text-gray-900"
            />
            <Label
              htmlFor="en"
              className="cursor-pointer text-sm text-gray-700"
            >
              English (US)
            </Label>
          </div>
          <div className="flex cursor-pointer items-center gap-2">
            <RadioGroupItem
              value="ja"
              id="ja"
              className="cursor-pointer border-gray-300 text-gray-900"
            />
            <Label
              htmlFor="ja"
              className="cursor-pointer text-sm text-gray-700"
            >
              日本語
            </Label>
          </div>
          <div className="flex cursor-pointer items-center gap-2">
            <RadioGroupItem
              value="zh"
              id="zh"
              className="cursor-pointer border-gray-300 text-gray-900"
            />
            <Label
              htmlFor="zh"
              className="cursor-pointer text-sm text-gray-700"
            >
              中文 (简体)
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Separator className="my-6" />

      <div className="mb-8">
        <h3 className="mb-4 text-base font-medium text-gray-900">지역</h3>
        <select
          value={region}
          onChange={e => setRegion(e.target.value)}
          className="h-10 w-full max-w-xs cursor-pointer rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-gray-300 focus:ring-0 focus:outline-none"
        >
          <option value="ko-KR">대한민국</option>
          <option value="en-US">United States</option>
          <option value="en-GB">United Kingdom</option>
          <option value="ja-JP">日本</option>
          <option value="zh-CN">中国</option>
        </select>
      </div>

      <Separator className="my-6" />

      <div className="mb-8">
        <h3 className="mb-4 text-base font-medium text-gray-900">
          날짜 및 시간 형식
        </h3>

        <div className="space-y-6">
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-700">
              날짜 형식
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              {dateFormats.map(format => (
                <label
                  key={format.value}
                  className={`flex cursor-pointer items-center rounded-lg border p-4 transition-colors ${
                    dateFormat === format.value
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="dateFormat"
                    value={format.value}
                    checked={dateFormat === format.value}
                    onChange={() => setDateFormat(format.value)}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        dateFormat === format.value
                          ? 'border-gray-900'
                          : 'border-gray-300'
                      }`}
                    >
                      {dateFormat === format.value && (
                        <div className="h-2.5 w-2.5 rounded-full bg-gray-900"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {format.label}
                      </p>
                      <p className="text-xs text-gray-500">{format.example}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-700">
              시간 형식
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              {timeFormats.map(format => (
                <label
                  key={format.value}
                  className={`flex cursor-pointer items-center rounded-lg border p-4 transition-colors ${
                    timeFormat === format.value
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="timeFormat"
                    value={format.value}
                    checked={timeFormat === format.value}
                    onChange={() => setTimeFormat(format.value)}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        timeFormat === format.value
                          ? 'border-gray-900'
                          : 'border-gray-300'
                      }`}
                    >
                      {timeFormat === format.value && (
                        <div className="h-2.5 w-2.5 rounded-full bg-gray-900"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {format.label}
                      </p>
                      <p className="text-xs text-gray-500">{format.example}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
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
  );
}
