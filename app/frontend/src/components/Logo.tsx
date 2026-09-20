interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: 'light' | 'dark';
  showMark?: boolean;
}

export function Logo({ className = '', width = 200, height = 44, variant = 'light', showMark = true }: LogoProps) {
  const textColor = variant === 'light' ? '#F7F4EF' : '#151A22';
  const oceanColor = '#73D9D6';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showMark && <GraphMark size={36} />}
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="PoleClass Pro"
      >
        <text
          x="0"
          y="30"
          fontFamily="'Murecho', sans-serif"
          fontSize="26"
          fontWeight="800"
          fill={textColor}
          letterSpacing="-0.5"
        >
          PoleClass
        </text>
        <text
          x="148"
          y="30"
          fontFamily="'Murecho', sans-serif"
          fontSize="26"
          fontWeight="600"
          fill={oceanColor}
          letterSpacing="-0.5"
        >
          Pro
        </text>
      </svg>
    </div>
  );
}

interface GraphMarkProps {
  size?: number;
  className?: string;
}

export function GraphMark({ size = 36, className = '' }: GraphMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="PoleClass Pro mark"
    >
      {/* Connection lines */}
      <line x1="14" y1="34" x2="24" y2="18" stroke="#FF8F7A" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <line x1="24" y1="18" x2="36" y2="28" stroke="#73D9D6" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <line x1="24" y1="18" x2="38" y2="14" stroke="#B8B3FF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      {/* Nodes */}
      <circle cx="14" cy="34" r="5" fill="#FF8F7A" />
      <circle cx="24" cy="18" r="6" fill="#73D9D6" />
      <circle cx="36" cy="28" r="4.5" fill="#FFC870" />
      <circle cx="38" cy="14" r="4" fill="#B8B3FF" />
    </svg>
  );
}

export function LogoIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return <GraphMark size={size} className={className} />;
}