export default function Footer({ className = '' }) {
  return (
    <footer className={`surface-panel mt-4 border-t border-[#c084fc]/12 px-6 py-8 text-[#b4a9df] sm:flex sm:items-center sm:justify-between ${className}`.trim()}>
      <aside className="max-w-xl space-y-2">
        <p className="font-display text-2xl uppercase tracking-[0.08em] text-white">Rehacktor catalog</p>
        <p className="text-sm leading-6">
          Progetto per Aulab creato da Leopoldo Romano, basato sui dati di{' '}
        </p>
      </aside>

      <nav className="mt-4 grid grid-flow-row gap-3 text-sm sm:mt-0 sm:grid-flow-col">
        <a className="link link-hover text-[#efe8ff]" href="https://rawg.io/apidocs" rel="noreferrer" target="_blank">
          RAWG API docs
        </a>
        <a className="link link-hover text-[#efe8ff]" href="https://rawg.io" rel="noreferrer" target="_blank">
          Data source RAWG
        </a>
      </nav>
    </footer>
  )
}
