import { SVGProps } from 'react';

export function KakaoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3C6.477 3 2 6.477 2 10.8C2 13.7 3.859 16.231 6.6 17.6L5.5 21.5C5.421 21.746 5.681 21.952 5.9 21.8L10.5 18.8C11 18.9 11.5 19 12 19C17.523 19 22 15.523 22 10.8C22 6.477 17.523 3 12 3Z"
        fill="currentColor"
      />
    </svg>
  );
}
