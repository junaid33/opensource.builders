export function Spacer() {
  return (
    <div
      className="flex items-center w-full h-3"
      style={{
        backgroundImage:
          'repeating-linear-gradient(315deg, var(--color-border) 0, var(--color-border) 1px, transparent 0, transparent 50%)',
        backgroundSize: '10px 10px',
        maskImage: 'linear-gradient(90deg, #000, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, #000, transparent)',
      }}
    />
  );
}
