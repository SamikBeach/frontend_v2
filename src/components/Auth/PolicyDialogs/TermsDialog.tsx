'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '../../ui/responsive-dialog';

interface TermsDialogProps
  extends React.ComponentPropsWithoutRef<typeof ResponsiveDialog> {
  trigger: React.ReactNode;
}

export function TermsDialog({ trigger, ...props }: TermsDialogProps) {
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
            이용약관
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
            <h2 className="text-xl font-semibold">제 1 장 총칙</h2>

            <h3 className="mt-6 text-lg font-medium">제 1 조 (목적)</h3>
            <p>
              이 약관은 미역서점(이하 &quot;회사&quot;라 함)이 제공하는
              서비스(이하 &quot;서비스&quot;라 함)를 이용함에 있어 회사와
              이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>

            <h3 className="mt-6 text-lg font-medium">제 2 조 (정의)</h3>
            <p>
              1. &quot;서비스&quot;란 회사가 제공하는 모든 서비스를 의미합니다.
              <br />
              2. &quot;이용자&quot;란 회사의 서비스에 접속하여 이 약관에 따라
              회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.
              <br />
              3. &quot;회원&quot;이란 회사에 개인정보를 제공하여 회원등록을 한
              자로서, 회사의 정보를 지속적으로 제공받으며 회사가 제공하는
              서비스를 계속적으로 이용할 수 있는 자를 말합니다.
              <br />
              4. &quot;비회원&quot;이란 회원에 가입하지 않고 회사가 제공하는
              서비스를 이용하는 자를 말합니다.
            </p>

            <h3 className="mt-6 text-lg font-medium">
              제 3 조 (약관의 효력 및 변경)
            </h3>
            <p>
              1. 회사는 이 약관의 내용을 이용자가 알 수 있도록 서비스 화면에
              게시합니다.
              <br />
              2. 회사는 관련법령을 위배하지 않는 범위에서 이 약관을 개정할 수
              있습니다.
              <br />
              3. 회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여
              현행 약관과 함께 서비스 화면에 그 적용일자 7일 이전부터 적용일자
              전일까지 공지합니다.
              <br />
              4. 이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을
              중단하고 회원 탈퇴를 요청할 수 있습니다. 단, 이의가 있음에도
              불구하고 제3항에 정해진 바에 따른 회사의 고지가 있은 후 30일
              이내에 이용계약을 해지하지 않은 이용자는 변경된 약관에 동의한
              것으로 간주합니다.
            </p>

            <h2 className="mt-8 text-xl font-semibold">
              제 2 장 서비스 이용계약
            </h2>

            <h3 className="mt-6 text-lg font-medium">
              제 4 조 (이용계약의 성립)
            </h3>
            <p>
              1. 이용계약은 이용자가 약관의 내용에 대하여 동의를 하고 회사가
              정한 가입 양식에 따라 회원정보를 기입한 후 회사가 승낙함으로써
              성립합니다.
              <br />
              2. 회사는 다음 각 호에 해당하는 이용계약 신청에 대하여는 이를
              승낙하지 아니 할 수 있습니다.
              <br />
              &nbsp;&nbsp;① 실명이 아니거나 타인의 명의를 이용한 경우
              <br />
              &nbsp;&nbsp;② 허위의 정보를 기재하거나, 회사가 제시하는 내용을
              기재하지 않은 경우
              <br />
              &nbsp;&nbsp;③ 이용자의 귀책사유로 인하여 승인이 불가능하거나 기타
              규정한 제반 사항을 위반하며 신청하는 경우
            </p>

            <h3 className="mt-6 text-lg font-medium">제 5 조 (서비스 이용)</h3>
            <p>
              1. 회사는 이용자에게 아래와 같은 서비스를 제공합니다.
              <br />
              &nbsp;&nbsp;① 독서 활동 기록 및 관리 서비스
              <br />
              &nbsp;&nbsp;② 도서 정보 제공 서비스
              <br />
              &nbsp;&nbsp;③ 독서 커뮤니티 서비스
              <br />
              &nbsp;&nbsp;④ 기타 회사가 추가 개발하거나 제휴를 통해 이용자에게
              제공하는 서비스
              <br />
              2. 회사는 서비스를 일정범위로 분할하여 각 범위 별로 이용가능
              시간을 별도로 지정할 수 있습니다.
            </p>

            <h2 className="mt-8 text-xl font-semibold">제 3 장 의무</h2>

            <h3 className="mt-6 text-lg font-medium">제 6 조 (회사의 의무)</h3>
            <p>
              1. 회사는 관련 법령을 준수하고, 이 약관이 정하는 권리의 행사와
              의무의 이행을 신의에 따라 성실하게 하여야 합니다.
              <br />
              2. 회사는 이용자가 안전하게 서비스를 이용할 수 있도록
              개인정보보호를 위해 보안시스템을 갖추어야 하며 개인정보취급방침을
              공시하고 준수합니다.
            </p>

            <h3 className="mt-6 text-lg font-medium">
              제 7 조 (이용자의 의무)
            </h3>
            <p>
              1. 이용자는 다음 행위를 하여서는 안됩니다.
              <br />
              &nbsp;&nbsp;① 신청 또는 변경 시 허위내용의 등록
              <br />
              &nbsp;&nbsp;② 타인의 정보 도용
              <br />
              &nbsp;&nbsp;③ 회사가 게시한 정보의 변경
              <br />
              &nbsp;&nbsp;④ 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등)
              등의 송신 또는 게시
              <br />
              &nbsp;&nbsp;⑤ 회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해
              <br />
              &nbsp;&nbsp;⑥ 회사 및 기타 제3자의 명예를 손상시키거나 업무를
              방해하는 행위
              <br />
              &nbsp;&nbsp;⑦ 외설 또는 폭력적인 메시지, 화상, 음성, 기타
              공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위
              <br />
              &nbsp;&nbsp;⑧ 기타 불법적이거나 부당한 행위
            </p>
          </div>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
