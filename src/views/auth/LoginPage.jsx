import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import loginArtwork from '../../assets/login.png'
import { UserContext } from '../../context/UserContext.jsx'
import { routes } from '../../router/routes.js'

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const navigate = useNavigate()
  const { signIn } = useContext(UserContext)
  const [authError, setAuthError] = useState('')

  const onSubmit = async (userData) => {
    setAuthError('')

    const { error } = await signIn({
      email: userData.email,
      password: userData.password,
    })

    if (error) {
      setAuthError(error.message)
      return
    }

    navigate(routes.home, { replace: true })
  }

  return (
    <main className="flex min-h-full items-center justify-center px-4 py-6 sm:py-8">
      <section className="relative isolate w-full max-w-6xl overflow-hidden rounded-sm border border-[#c084fc]/12 shadow-[0_24px_64px_rgba(5,5,16,0.42)]">
        <img
          alt="Login artwork"
          className="absolute inset-0 h-full w-full object-cover"
          src={loginArtwork}
        />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(5,5,16,0.42)_0%,rgba(5,5,16,0.3)_34%,rgba(5,5,16,0.72)_100%)]" />
        <div className="absolute inset-0 bg-white/6 backdrop-blur-[5px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.26),transparent_20%),radial-gradient(circle_at_78%_16%,rgba(192,132,252,0.18),transparent_16%),linear-gradient(180deg,rgba(255,255,255,0.14),transparent_22%,rgba(255,255,255,0.05)_55%,transparent_100%)] opacity-95" />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_0%,rgba(255,255,255,0.12)_18%,transparent_32%,transparent_100%)]" />

        <div className="relative grid min-h-[620px] items-center px-4 py-6 sm:px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:px-8">
          <div className="hidden lg:block" />

          <form
            className="ml-auto flex w-full max-w-xl flex-col gap-4 rounded-sm border border-[#c084fc]/15 bg-[#110f2d]/95 p-8 shadow-[0_28px_60px_rgba(5,5,16,0.38)] sm:p-9"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#d4b8ff]">Area accesso</p>
              <h1 className="text-3xl font-bold text-white">Login</h1>
              <p className="text-[#ddd6fe]">Accedi e guarda la navbar cambiare stato.</p>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-[#f5f3ff]">Email</span>
              <input
                className="rounded-sm border border-[#8b5cf6]/25 bg-[#0b091e] px-4 py-3 text-white outline-none placeholder:text-[#8f82c2]"
                placeholder="Email"
                type="email"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email ? <span className="text-sm text-red-300">{errors.email.message}</span> : null}
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-[#f5f3ff]">Password</span>
              <input
                className="rounded-sm border border-[#8b5cf6]/25 bg-[#0b091e] px-4 py-3 text-white outline-none placeholder:text-[#8f82c2]"
                placeholder="Password"
                type="password"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password ? <span className="text-sm text-red-300">{errors.password.message}</span> : null}
            </label>

            {authError ? <p className="text-sm text-red-300">{authError}</p> : null}

            <button
              className="brand-primary rounded-sm px-4 py-3 font-semibold text-[#130f2c] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Accesso...' : 'Login'}
            </button>

            <p className="text-sm text-[#ddd6fe]">
              Non hai un account?{' '}
              <Link className="text-[#c084fc] hover:text-white" to={routes.register}>
                Register
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}
