const docsLinks = [
  { label: 'React', href: 'https://react.dev/' },
  { label: 'React Router', href: 'https://reactrouter.com/home' },
  { label: 'Tailwind CSS', href: 'https://tailwindcss.com/docs' },
  { label: 'DaisyUI', href: 'https://daisyui.com/docs/install/' },
  { label: 'Supabase', href: 'https://supabase.com/docs' },
  { label: 'RAWG API', href: 'https://rawg.io/apidocs' },
  { label: 'React Hook Form', href: 'https://react-hook-form.com/docs' },
  { label: 'React Icons', href: 'https://react-icons.github.io/react-icons/' },
  { label: 'Vite', href: 'https://vite.dev/guide/' },
]

export default function Footer({ className = '' }) {
  return (
    <footer className={`surface-panel mt-4 border-t border-[#c084fc]/12 px-4 py-8 text-[#b4a9df] sm:px-6 ${className}`.trim()}>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:items-start">
        <aside className="max-w-xl space-y-2">
        <p className="font-display text-2xl uppercase tracking-[0.08em] text-white">Rehacktor catalog</p>
        <p className="text-sm leading-6">
          Progetto per Aulab creato da Leopoldo Romano, basato sui dati RAWG e costruito con uno stack React moderno.
        </p>
        </aside>

        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#c084fc]">Documentazione stack</p>
          <nav className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-3">
            {docsLinks.map((item) => (
              <a
                className="link link-hover text-[#efe8ff]"
                href={item.href}
                key={item.label}
                rel="noreferrer"
                target="_blank"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
