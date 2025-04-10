interface LogoImageProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZES = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
} as const;

export default function LogoImage({ size = 'md', className }: LogoImageProps) {
  const pixelSize = SIZES[size];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      width={pixelSize}
      height={pixelSize}
      className={className}
      fill="none"
    >
      <rect width="640" height="640" fill="white" />
      <path d="M163 170H477L425.818 470H217.95L163 170Z" fill="black" />
    </svg>
  );
}
