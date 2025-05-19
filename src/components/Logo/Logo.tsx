import LogoImage from './LogoImage';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className, size = 'md' }: LogoProps) {
  return (
    <div className={className}>
      <h1 className="flex items-center font-bold">
        <LogoImage size={size} />
        <span className="text-green-800">미역서점</span>
      </h1>
    </div>
  );
}
