import { Link } from 'react-router-dom'
import { routes } from '../../router/routes.js'

export default function EmptyState({ title, body }) {
  return (
    <section className="surface-panel-soft rounded-sm border border-dashed border-[#c084fc]/18 shadow-[0_18px_40px_rgba(5,5,16,0.34)]">
      <div className="flex flex-col items-start gap-4 p-6 sm:p-8">
        <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#c084fc]">
          Empty state
        </span>
        <h2 className="font-display text-4xl uppercase leading-none tracking-[0.08em] text-white">
          {title}
        </h2>
        <p className="max-w-2xl text-base leading-7 text-[#d8d0f7]">{body}</p>
        <Link className="brand-primary inline-flex rounded-sm px-5 py-3 text-sm font-semibold text-[#130f2c]" to={routes.home}>
          Torna alla home
        </Link>
      </div>
    </section>
  )
}
