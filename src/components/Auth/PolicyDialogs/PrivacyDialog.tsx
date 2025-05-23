'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '../../ui/responsive-dialog';

interface PrivacyDialogProps
  extends React.ComponentPropsWithoutRef<typeof ResponsiveDialog> {
  trigger: React.ReactNode;
}

export function PrivacyDialog({ trigger, ...props }: PrivacyDialogProps) {
  const isMobile = useIsMobile();

  return (
    <ResponsiveDialog {...props}>
      <ResponsiveDialogTrigger asChild>{trigger}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent
        className="max-w-[95vw] min-w-[600px] overflow-hidden rounded-2xl border-0 p-0 shadow-xl"
        drawerClassName="w-full max-w-none overflow-hidden rounded-t-[16px] border-0 p-0 shadow-xl h-[85vh]"
        aria-describedby={undefined}
      >
        <ResponsiveDialogHeader
          className="relative flex h-14 items-center justify-center border-b border-gray-100 px-6"
          drawerClassName="relative flex h-14 items-center justify-center border-b border-gray-100 px-6"
          onClose={() => props.onOpenChange?.(false)}
        >
          <ResponsiveDialogTitle
            className="text-lg font-semibold"
            drawerClassName="text-lg font-semibold"
          >
            개인정보 처리방침
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <div
          className={`${
            isMobile
              ? 'pb-safe flex-1 overflow-y-auto'
              : 'max-h-[70vh] overflow-y-auto'
          } px-7 py-6`}
        >
          <div className="prose prose-sm max-w-none text-gray-700">
            <h2 className="text-xl font-semibold">개인정보 처리방침</h2>

            <p className="mt-4">
              미역서점(이하 &apos;회사&apos;라 함)은 이용자의 개인정보를
              중요시하며, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」,
              「개인정보 보호법」 등 관련 법령을 준수하기 위하여 노력하고
              있습니다.
            </p>

            <p className="mt-4">
              회사는 개인정보처리방침을 통하여 회사가 이용자로부터 수집하는
              개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유 및
              이용기간, 개인정보의 제3자 제공 및 취급위탁에 관한 사항을
              이용자에게 안내하고 있습니다.
            </p>

            <h3 className="mt-6 text-lg font-medium">
              1. 수집하는 개인정보의 항목 및 수집방법
            </h3>

            <h4 className="mt-4 text-base font-medium">
              가. 수집하는 개인정보의 항목
            </h4>
            <p>
              회사는 이용자가 서비스를 이용하기 위해 회원가입을 할 경우, 서비스
              제공을 위해 필요한 최소한의 개인정보를 수집합니다.
            </p>

            <ul className="mt-2 list-disc pl-5">
              <li>
                <strong>필수항목</strong>: 이메일 주소, 비밀번호, 닉네임
              </li>
              <li>
                <strong>선택항목</strong>: 프로필 이미지, 소개글
              </li>
              <li>
                <strong>서비스 이용 과정에서 생성되는 정보</strong>: 독서 기록
                정보(읽은 책, 독서 시간, 평점, 리뷰 등), IP 주소, 쿠키, 방문
                일시, 서비스 이용 기록, 기기정보(모델명, OS 버전 등)
              </li>
            </ul>

            <h4 className="mt-4 text-base font-medium">
              나. 개인정보 수집방법
            </h4>
            <p>회사는 다음과 같은 방법으로 개인정보를 수집합니다.</p>

            <ul className="mt-2 list-disc pl-5">
              <li>
                회원가입 및 서비스 이용 과정에서 이용자가 개인정보 수집에 대해
                동의를 하고 직접 정보를 입력하는 경우
              </li>
              <li>제휴 서비스 또는 단체 등으로부터 개인정보를 제공받은 경우</li>
              <li>
                고객센터를 통한 상담 과정에서 웹사이트, 메일, 팩스, 전화 등으로
                개인정보를 수집하는 경우
              </li>
              <li>
                서비스 이용과정에서 자동으로 생성되는 정보를 수집하는 경우
              </li>
            </ul>

            <h3 className="mt-6 text-lg font-medium">
              2. 개인정보의 수집 및 이용목적
            </h3>
            <p>회사는 수집한 개인정보를 다음의 목적을 위해 이용합니다.</p>

            <ul className="mt-2 list-disc pl-5">
              <li>
                회원관리: 회원제 서비스 이용에 따른 본인확인, 개인식별,
                불량회원의 부정 이용 방지와 비인가 사용 방지, 가입 의사 확인,
                가입 및 가입횟수 제한, 분쟁 조정을 위한 기록보존, 불만처리 등
                민원처리, 고지사항 전달
              </li>
              <li>
                서비스 제공: 콘텐츠 제공, 맞춤형 서비스 제공, 서비스 이용 기록
                통계 및 분석
              </li>
              <li>
                마케팅 및 광고에 활용: 이벤트 등 광고성 정보 전달(선택적으로
                동의한 경우에 한함), 접속 빈도 파악, 서비스 이용에 대한 통계
              </li>
            </ul>

            <h3 className="mt-6 text-lg font-medium">
              3. 개인정보의 보유 및 이용기간
            </h3>
            <p>
              회사는 이용자의 개인정보를 원칙적으로 개인정보의 수집 및
              이용목적이 달성되면 지체 없이 파기합니다. 단, 다음의 정보에
              대해서는 아래의 이유로 명시한 기간 동안 보존합니다.
            </p>

            <h4 className="mt-4 text-base font-medium">
              가. 회사 내부 방침에 의한 정보보유 사유
            </h4>
            <ul className="mt-2 list-disc pl-5">
              <li>회원 탈퇴 시 개인정보 보관: 30일</li>
              <li>
                보존 이유: 불량 이용자의 재가입 방지, 탈퇴한 이용자의 서비스
                이용 정보 백업
              </li>
            </ul>

            <h4 className="mt-4 text-base font-medium">
              나. 관련 법령에 의한 정보보유 사유
            </h4>
            <p>
              상법, 전자상거래 등에서의 소비자보호에 관한 법률 등 관계법령의
              규정에 의하여 보존할 필요가 있는 경우 회사는 관계법령에서 정한
              일정한 기간 동안 회원정보를 보관합니다.
            </p>

            <ul className="mt-2 list-disc pl-5">
              <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
              <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
              <li>로그인 기록: 3개월</li>
            </ul>
          </div>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
