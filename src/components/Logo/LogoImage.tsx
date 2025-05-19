import Image from 'next/image';

interface LogoImageProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  alt?: string;
  priority?: boolean;
}

const SIZES = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
} as const;

export default function LogoImage({
  size = 'md',
  className,
  alt = 'Logo',
  priority = false,
}: LogoImageProps) {
  const pixelSize = SIZES[size];

  return (
    <Image
      src="/images/og-image.png"
      alt={alt}
      width={pixelSize}
      height={pixelSize}
      className={className}
      priority={priority}
    />
  );
}
