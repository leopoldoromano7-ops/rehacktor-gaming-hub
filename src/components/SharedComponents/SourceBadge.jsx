export default function SourceBadge({
  source,
  liveLabel = 'RAWG live',
  mockLabel = 'Source offline',
}) {
  const isLive = source === 'rawg'

  return (
    <span
      className={[
        'inline-flex items-center rounded-sm border px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em]',
        isLive
          ? 'border-[#8b5cf6]/35 bg-[#8b5cf6]/12 text-[#ddd6fe]'
          : 'border-[#ec4899]/35 bg-[#ec4899]/12 text-[#fbcfe8]',
      ].join(' ')}
    >
      {isLive ? liveLabel : mockLabel}
    </span>
  )
}
