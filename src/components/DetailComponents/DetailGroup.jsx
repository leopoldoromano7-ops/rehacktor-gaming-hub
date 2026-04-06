export default function DetailGroup({ items, title }) {
  return (
    <section className="surface-panel-soft rounded-sm border border-[#c084fc]/12 shadow-[0_12px_30px_rgba(5,5,16,0.32)]">
      <div className="flex flex-col gap-4 p-5">
        <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-white">{title}</h2>
        <div className="flex flex-wrap gap-2">
          {items.length ? (
            items.map((item) => (
              <span className="rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] px-3 py-2 text-sm text-[#f5f3ff]" key={item}>
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
