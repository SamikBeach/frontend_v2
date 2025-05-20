import Image from 'next/image';

interface LogoImageProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  alt?: string;
  priority?: boolean;
}

const SIZES = {
  xs: 96,
  sm: 96,
  md: 96,
  lg: 96,
  xl: 96,
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
      quality={100}
      style={{ width: 32, height: 32 }}
    />
  );
}
