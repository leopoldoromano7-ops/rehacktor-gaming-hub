import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext.jsx'
import { routes } from '../../router/routes.js'

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const navigate = useNavigate()
  const { signUp } = useContext(UserContext)
  const [authError, setAuthError] = useState('')

  const onSubmit = async (userData) => {
    setAuthError('')

    const { error } = await signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          username: userData.username,
        },
      },
    })

    if (error) {
      setAuthError(error.message)
      return
    }

    navigate(routes.home, { replace: true })
  }

  return (
    <main className="flex min-h-full items-center justify-center bg-[#0d0a22] px-4 py-6 sm:py-8">
      <form
        className="flex w-full max-w-xl flex-col gap-4 rounded-sm border border-[#c084fc]/15 bg-[#110f2d] p-8 shadow-[0_18px_40px_rgba(5,5,16,0.38)] sm:p-9"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Register</h1>
          <p className="text-[#c084fc]">Crea il tuo account e torna subito alla home.</p>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-[#ddd6fe]">Username</span>
          <input
            className="rounded-sm border border-[#8b5cf6]/25 bg-[#0b091e] px-4 py-3 text-white outline-none placeholder:text-[#8f82c2]"
            placeholder="Username"
            type="text"
            {...register('username', { required: 'Username is required' })}
          />
          {errors.username ? <span className="text-sm text-red-400">{errors.username.message}</span> : null}
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-[#ddd6fe]">Email</span>
          <input
            className="rounded-sm border border-[#8b5cf6]/25 bg-[#0b091e] px-4 py-3 text-white outline-none placeholder:text-[#8f82c2]"
            placeholder="Email"
            type="email"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email ? <span className="text-sm text-red-400">{errors.email.message}</span> : null}
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-[#ddd6fe]">Password</span>
          <input
            className="rounded-sm border border-[#8b5cf6]/25 bg-[#0b091e] px-4 py-3 text-white outline-none placeholder:text-[#8f82c2]"
            placeholder="Password"
            type="password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password ? <span className="text-sm text-red-400">{errors.password.message}</span> : null}
        </label>

        {authError ? <p className="text-sm text-red-400">{authError}</p> : null}

        <button
          className="brand-primary rounded-sm px-4 py-3 font-semibold text-[#130f2c] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Registrazione...' : 'Register'}
        </button>

        <p className="text-sm text-[#b4a9df]">
          Hai gia un account?{' '}
          <Link className="text-[#c084fc] hover:text-white" to={routes.login}>
            Login
          </Link>
        </p>
      </form>
    </main>
  )
}
