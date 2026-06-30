interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <span
      className="inline-flex items-center justify-center w-4 h-4 ml-1 rounded-full bg-blue-500 text-[9px] text-white align-middle"
      title="Verified"
      aria-label="Verified"
    >
      ✓
    </span>
  );
}
