import { createContext, useEffect, useState } from 'react'
import supabase from '../database/supabase.js'

export const UserContext = createContext()

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)

  const loadProfile = async (currentUser) => {
    if (!currentUser) {
      setProfile(null)
      return
    }

    const { data: profiles } = await supabase
      .from('profiles')
      .select()
      .eq('id', currentUser.id)
      .limit(1)

    setProfile(profiles?.[0] ?? null)
  }

  const getUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const currentUser = session?.user ?? null
    setUser(currentUser)
    await loadProfile(currentUser)
  }

  useEffect(() => {
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      getUser()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const signUp = async (newUser) => {
    const result = await supabase.auth.signUp(newUser)

    if (!result.error) {
      await getUser()
    }

    return result
  }

  const signIn = async (loggedUser) => {
    const result = await supabase.auth.signInWithPassword(loggedUser)

    if (!result.error) {
      await getUser()
    }

    return result
  }

  const updateProfile = async (newProfile) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...newProfile })
      .eq('id', user.id)
      .select()

    await getUser()

    return { data, error }
  }

  return (
    <UserContext.Provider value={{ user, profile, signOut, signUp, signIn, getUser, updateProfile }}>
      {children}
    </UserContext.Provider>
  )
}
