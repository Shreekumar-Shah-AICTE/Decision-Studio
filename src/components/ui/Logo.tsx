import { cn } from '../../lib/utils';

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer ring */}
      <circle cx="20" cy="20" r="18" stroke="url(#logo-ring)" strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* Center diamond */}
      <path d="M20 8 L32 20 L20 32 L8 20 Z" fill="url(#logo-fill)" opacity="0.15" />
      <path d="M20 8 L32 20 L20 32 L8 20 Z" stroke="url(#logo-stroke)" strokeWidth="1.5" fill="none" />
      {/* Inner nodes */}
      <circle cx="20" cy="8" r="2.5" fill="url(#logo-node1)" />
      <circle cx="32" cy="20" r="2.5" fill="url(#logo-node2)" />
      <circle cx="20" cy="32" r="2.5" fill="url(#logo-node3)" />
      <circle cx="8" cy="20" r="2.5" fill="url(#logo-node4)" />
      {/* Center */}
      <circle cx="20" cy="20" r="4" fill="url(#logo-center)" />
      <circle cx="20" cy="20" r="2" fill="white" opacity="0.9" />
      {/* Connection spokes */}
      <line x1="20" y1="11" x2="20" y2="16" stroke="rgba(99,102,241,0.7)" strokeWidth="1.5" />
      <line x1="29" y1="20" x2="24" y2="20" stroke="rgba(167,139,250,0.7)" strokeWidth="1.5" />
      <line x1="20" y1="29" x2="20" y2="24" stroke="rgba(16,185,129,0.7)" strokeWidth="1.5" />
      <line x1="11" y1="20" x2="16" y2="20" stroke="rgba(14,165,233,0.7)" strokeWidth="1.5" />
      <defs>
        <linearGradient id="logo-fill" x1="8" y1="8" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#A78BFA" />
        </linearGradient>
        <linearGradient id="logo-stroke" x1="8" y1="8" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#A78BFA" />
        </linearGradient>
        <linearGradient id="logo-ring" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" stopOpacity="0.5" />
          <stop offset="1" stopColor="#A78BFA" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="logo-center" cx="50%" cy="50%" r="50%">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#4F46E5" />
        </radialGradient>
        <radialGradient id="logo-node1" cx="50%" cy="50%" r="50%">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#4F46E5" />
        </radialGradient>
        <radialGradient id="logo-node2" cx="50%" cy="50%" r="50%">
          <stop stopColor="#A78BFA" />
          <stop offset="1" stopColor="#8B5CF6" />
        </radialGradient>
        <radialGradient id="logo-node3" cx="50%" cy="50%" r="50%">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#059669" />
        </radialGradient>
        <radialGradient id="logo-node4" cx="50%" cy="50%" r="50%">
          <stop stopColor="#0EA5E9" />
          <stop offset="1" stopColor="#0284C7" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function Logo({ size = 32, showWordmark = true, className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LogoMark size={size} />
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className="font-bold tracking-tight text-white" style={{ fontSize: size * 0.55, letterSpacing: '-0.02em' }}>
            Decision
          </span>
          <span
            className="font-black tracking-widest uppercase"
            style={{
              fontSize: size * 0.38,
              letterSpacing: '0.18em',
              background: 'linear-gradient(90deg, #6366F1, #A78BFA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Studio
          </span>
        </div>
      )}
    </div>
  );
}
