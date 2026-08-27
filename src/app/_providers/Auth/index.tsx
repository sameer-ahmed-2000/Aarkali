'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { signIn, signOut, useSession, SessionProvider } from 'next-auth/react'
import { User } from '../../../payload/payload-types' // keep for type compat

// eslint-disable-next-line no-unused-vars
type ResetPassword = (args: {
  password: string
  passwordConfirm: string
  token: string
}) => Promise<void>

type ForgotPassword = (args: { email: string }) => Promise<void> // eslint-disable-line no-unused-vars
type Create = (args: { email: string; password: string; passwordConfirm: string }) => Promise<void> // eslint-disable-line no-unused-vars
type Login = (args: { email: string; password: string }) => Promise<User> // eslint-disable-line no-unused-vars
type Logout = () => Promise<void>

type AuthContext = {
  user?: User | null
  setUser: (user: User | null) => void // eslint-disable-line no-unused-vars
  logout: Logout
  login: Login
  create: Create
  resetPassword: ResetPassword
  forgotPassword: ForgotPassword
  status: undefined | 'loggedOut' | 'loggedIn'
}

const Context = createContext({} as AuthContext)

const AuthProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status: sessionStatus } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<undefined | 'loggedOut' | 'loggedIn'>()

  useEffect(() => {
    if (sessionStatus === 'authenticated' && session?.user) {
      setUser(session.user as any)
      setStatus('loggedIn')
    } else if (sessionStatus === 'unauthenticated') {
      setUser(null)
      setStatus('loggedOut')
    } else {
      setStatus(undefined)
    }
  }, [session, sessionStatus])

  const create = useCallback<Create>(async args => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args)
    })
    
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to create account')
    }
    
    // Automatically login after successful creation
    await signIn('credentials', {
      email: args.email,
      password: args.password,
      redirect: false
    })
  }, [])

  const login = useCallback<Login>(async args => {
    const res = await signIn('credentials', {
      email: args.email,
      password: args.password,
      redirect: false,
    })

    if (res?.error) {
      throw new Error('Invalid login')
    }
    
    return {} as User // NextAuth session handles setting the user via effect
  }, [])

  const logout = useCallback<Logout>(async () => {
    await signOut({ redirect: false })
    setUser(null)
    setStatus('loggedOut')
  }, [])

  const forgotPassword = useCallback<ForgotPassword>(async args => {
    throw new Error('Not implemented')
  }, [])

  const resetPassword = useCallback<ResetPassword>(async args => {
    throw new Error('Not implemented')
  }, [])

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        create,
        resetPassword,
        forgotPassword,
        status,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <AuthProviderInner>
        {children}
      </AuthProviderInner>
    </SessionProvider>
  )
}

type UseAuth<T = User> = () => AuthContext // eslint-disable-line no-unused-vars
export const useAuth: UseAuth = () => useContext(Context)
