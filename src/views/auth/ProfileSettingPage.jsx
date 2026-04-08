import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { FiImage, FiUploadCloud, FiUser } from 'react-icons/fi'
import { FaUserAstronaut } from 'react-icons/fa'
import { UserContext } from '../../context/UserContext.jsx'
import { routes } from '../../router/routes.js'
import supabase from '../../database/supabase.js'

export default function ProfileSettingsPage() {
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState()
    const [currentAvatar, setCurrentAvatar] = useState('')
    const { user, profile, getUser, updateProfile } = useContext(UserContext)
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setFile(file)
    }

    useEffect(() => {
        if (file) {
            const imageUrl = URL.createObjectURL(file)
            setPreview(imageUrl)

            return () => {
                URL.revokeObjectURL(imageUrl)
            }
        }
    }, [file])

    useEffect(() => {
        reset({
            username: profile?.username || '',
        })
    }, [profile, reset])

    useEffect(() => {
        let avatarObjectUrl

        const downloadAvatar = async () => {
            if (!profile?.avatar_url) {
                setCurrentAvatar('')
                return
            }

            const { data } = await supabase
                .storage
                .from('avatars')
                .download(profile.avatar_url)

            if (data) {
                avatarObjectUrl = URL.createObjectURL(data)
                setCurrentAvatar(avatarObjectUrl)
            }
        }

        downloadAvatar()

        return () => {
            if (avatarObjectUrl) {
                URL.revokeObjectURL(avatarObjectUrl)
            }
        }
    }, [profile?.avatar_url])

    const handleAvatarSubmit  = async (e) => {
        e.preventDefault()

        const ownerId = profile?.id || user?.id

        if (!file || !ownerId) {
            return
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${ownerId}${Math.random()}.${fileExt}`
        await supabase.storage.from('avatars').upload(fileName, file)
        await supabase 
            .from('profiles')
            .upsert({ id: ownerId, avatar_url: fileName })
            .select()
        await getUser()
        navigate(routes.profile)
    }

    const navigate = useNavigate()
    const displayName = profile?.username || user?.user_metadata?.username || user?.email || 'Player'
    const previewSrc = preview || currentAvatar
    const hasAvatarPreview = Boolean(previewSrc)

    const onSubmit = async (data) => {
        await updateProfile(data)
        navigate(routes.profile)
    }

return (
    <main className="min-w-0 overflow-x-hidden px-3 py-5 sm:px-0 sm:py-6">
        <section className="surface-panel min-w-0 overflow-hidden rounded-sm border border-[#c084fc]/12 shadow-[0_20px_52px_rgba(5,5,16,0.42)]">
            <div className="border-b border-[#c084fc]/10 bg-[#231d58] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#d4b8ff] sm:px-5">
                Profile settings
            </div>

            <div className="grid gap-px bg-[#c084fc]/10 xl:[grid-template-columns:360px_minmax(0,1fr)]">
                <aside className="surface-panel-soft flex min-w-0 flex-col items-center gap-4 p-4 sm:gap-5 sm:p-6">
                    <div className="brand-highlight flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-[#ec4899]/25 bg-[#1f173f] sm:h-36 sm:w-36">
                        {hasAvatarPreview ? (
                            <img
                                alt="Avatar preview"
                                className="h-full w-full object-cover"
                                src={previewSrc}
                            />
                        ) : (
                            <FaUserAstronaut className="text-6xl text-[#f4b7da]" />
                        )}
                    </div>

                    <div className="space-y-2 text-center min-w-0">
                        <span className="inline-flex items-center gap-2 rounded-sm border border-[#ec4899]/20 bg-[#ec4899]/12 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#f4b7da] sm:text-[11px] sm:tracking-[0.2em]">
                            <FaUserAstronaut className="text-sm" />
                            Editing profile
                        </span>
                        <h1 className="break-words font-display text-3xl leading-none text-white sm:text-4xl">{displayName}</h1>
                        <p className="text-sm leading-6 text-[#b4a9df]">
                            Aggiorna username e avatar mantenendo il look del tuo profilo coerente nell app.
                        </p>
                    </div>

                    <div className="grid w-full gap-3 min-w-0">
                        <div className="rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] px-4 py-3">
                            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b4a9df]">Current username</p>
                            <p className="mt-1 break-words text-sm text-white">{profile?.username || 'N/A'}</p>
                        </div>
                        <div className="rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] px-4 py-3">
                            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b4a9df]">Preview source</p>
                            <p className="mt-1 break-words text-sm text-white">{file ? 'Local file selected' : currentAvatar ? 'Current avatar' : 'No avatar'}</p>
                        </div>
                    </div>
                </aside>

                <div className="min-w-0 space-y-4 bg-[linear-gradient(180deg,#241d59_0%,#0f0b29_100%)] p-4 sm:p-6">
                    <form className="min-w-0 rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] p-4 sm:p-5" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-5 flex items-start gap-3">
                            <span className="rounded-sm bg-[#8b5cf6]/12 p-2 text-[#c084fc]">
                                <FiUser />
                            </span>
                            <div className="min-w-0">
                                <h2 className="font-display text-[1.65rem] text-white sm:text-2xl">Public profile</h2>
                                <p className="mt-1 text-sm text-[#b4a9df]">
                                    Cambia il nome utente mostrato nella tua area profilo.
                                </p>
                            </div>
                        </div>

                        <label className="flex min-w-0 flex-col gap-2">
                            <span className="text-sm text-[#ddd6fe]">Username</span>
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full min-w-0 max-w-full rounded-sm border border-[#8b5cf6]/25 bg-[#120f31] px-4 py-3 text-white outline-none placeholder:text-[#8f82c2]"
                                {...register('username', { required: 'Username is required' })}
                            />
                        </label>

                        {errors.username && (
                            <p role="alert" className="mt-3 text-sm text-red-400">
                                {errors.username.message}
                            </p>
                        )}

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            <button
                                type="submit"
                                className="brand-primary w-full rounded-sm px-4 py-2.5 font-semibold text-[#130f2c] disabled:opacity-60 sm:w-auto"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save changes'}
                            </button>
                            <Link className="w-full rounded-sm border border-[#c084fc]/20 px-4 py-2.5 text-center font-semibold text-white sm:w-auto" to={routes.profile}>
                                Back to profile
                            </Link>
                        </div>
                    </form>

                    <form className="min-w-0 rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] p-4 sm:p-5" onSubmit={handleAvatarSubmit}>
                        <div className="mb-5 flex items-start gap-3">
                            <span className="rounded-sm bg-[#8b5cf6]/12 p-2 text-[#c084fc]">
                                <FiImage />
                            </span>
                            <div className="min-w-0">
                                <h2 className="font-display text-[1.65rem] text-white sm:text-2xl">Avatar upload</h2>
                                <p className="mt-1 text-sm text-[#b4a9df]">
                                    Carica una nuova immagine e aggiornala subito nella web app.
                                </p>
                            </div>
                        </div>

                        <label className="flex min-w-0 flex-col gap-2">
                            <span className="text-sm text-[#ddd6fe]">Image file</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full min-w-0 max-w-full overflow-hidden rounded-sm border border-[#8b5cf6]/25 bg-[#120f31] px-4 py-3 text-sm text-white outline-none file:mb-3 file:mr-0 file:w-full file:max-w-full file:overflow-hidden file:text-ellipsis file:whitespace-nowrap file:rounded-sm file:border-0 file:bg-[#8b5cf6] file:px-3 file:py-2 file:font-semibold file:text-[#130f2c] sm:text-base sm:file:mb-0 sm:file:mr-4 sm:file:w-auto"
                                onChange={handleFileChange}
                            />
                            <p className="break-all text-xs text-[#b4a9df] sm:hidden">
                                {file ? file.name : 'Nessun file selezionato'}
                            </p>
                        </label>

                        <div className="mt-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#ec4899]/20 bg-[#1f173f]">
                                {hasAvatarPreview ? (
                                    <img src={previewSrc} alt="Avatar preview" className="h-full w-full object-cover" />
                                ) : (
                                    <FaUserAstronaut className="text-4xl text-[#f4b7da]" />
                                )}
                            </div>
                            <div className="text-sm leading-6 text-[#b4a9df]">
                                <p>Anteprima</p>
                            </div>
                        </div>

                        <button type="submit" className="brand-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-sm px-4 py-2.5 font-semibold text-[#130f2c] sm:w-auto">
                            <FiUploadCloud className="text-base" />
                            <span>Update avatar</span>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    </main>
)
}
