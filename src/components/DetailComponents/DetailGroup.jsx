export default function DetailGroup({ items, title }) {
  return (
    <section className="surface-panel-soft min-w-0 rounded-sm border border-[#c084fc]/12 shadow-[0_12px_30px_rgba(5,5,16,0.32)]">
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <h2 className="font-display text-[1.7rem] uppercase tracking-[0.08em] text-white sm:text-2xl">{title}</h2>
        <div className="flex flex-wrap gap-2">
          {items.length ? (
            items.map((item) => (
              <span className="break-words rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] px-3 py-2 text-sm text-[#f5f3ff]" key={item}>
                {item}
              </span>
            ))
          ) : (
            <span className="rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] px-3 py-2 text-sm text-[#b4a9df]">n/a</span>
          )}
        </div>
      </div>
    </section>
  )
}
