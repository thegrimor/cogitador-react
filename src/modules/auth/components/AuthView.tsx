import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import { loginFully, registerFully } from '@/core/store/loginFully'
import { showToast } from '@/shared/components/Toast'
import { clearAuthError, forgotPassword, resetPassword } from '../services/authSlice'

type Mode = 'login' | 'register' | 'forgot' | 'reset'

const INPUT_CLASS =
  'w-full bg-transparent font-rajdhani text-[15px] font-semibold text-parchment outline-none placeholder:text-parchment-dim/40'

function Field({
  label, children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-rim-bright px-3 py-2.5">
      <label className="block font-display text-[9px] uppercase tracking-[2px] text-parchment-dim mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

function SubmitButton({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full font-display text-[10px] uppercase tracking-[3px] bg-crimson-dim border border-crimson text-parchment px-3 py-2.5 hover:bg-crimson transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}

function LinkButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-display text-[9px] uppercase tracking-[2px] text-gold hover:text-parchment transition-colors"
    >
      {children}
    </button>
  )
}

export function AuthView() {
  const dispatch = useAppDispatch()
  const { status, error } = useAppSelector(s => s.auth)
  const [mode, setMode] = useState<Mode>('login')

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [resetPasswordValue, setResetPasswordValue] = useState('')

  const loading = status === 'loading'

  function changeMode(next: Mode) {
    dispatch(clearAuthError())
    setMode(next)
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    loginFully(dispatch, { identifier, password })
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault()
    registerFully(dispatch, { username, email, password })
  }

  async function handleForgot(e: FormEvent) {
    e.preventDefault()
    const result = await dispatch(forgotPassword({ email: forgotEmail }))
    if (forgotPassword.fulfilled.match(result)) {
      showToast(result.payload.message)
      if (result.payload.devToken) {
        setResetToken(result.payload.devToken)
        setMode('reset')
      }
    }
  }

  async function handleReset(e: FormEvent) {
    e.preventDefault()
    const result = await dispatch(resetPassword({ token: resetToken, password: resetPasswordValue }))
    if (resetPassword.fulfilled.match(result)) {
      showToast('Contraseña actualizada — inicia sesión')
      setPassword('')
      setResetPasswordValue('')
      setMode('login')
    }
  }

  return (
    <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="animate-spin-slow text-3xl leading-none text-crimson-dim select-none">⚙</span>
          <h1
            className="font-display text-lg font-black uppercase tracking-[3px] text-crimson-bright leading-none"
            style={{ textShadow: '0 0 12px rgba(255,34,34,0.4)' }}
          >
            Dark Heresy Cogitator
          </h1>
          <p className="font-display text-[8px] uppercase tracking-[3px] text-gold leading-none">
            // Acceso al Cogitador
          </p>
        </div>

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <Field label="Usuario o Email">
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="acolito.designado"
                autoComplete="username"
                required
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Contraseña">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className={INPUT_CLASS}
              />
            </Field>
            {error && <p className="font-mono text-xs text-crimson-bright">{error}</p>}
            <SubmitButton disabled={loading}>{loading ? 'Verificando…' : 'Entrar'}</SubmitButton>
            <div className="flex items-center justify-between pt-1">
              <LinkButton onClick={() => changeMode('register')}>Crear cuenta</LinkButton>
              <LinkButton onClick={() => changeMode('forgot')}>Olvidé mi contraseña</LinkButton>
            </div>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} className="flex flex-col gap-3">
            <Field label="Usuario">
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="acolito.designado"
                autoComplete="username"
                required
                minLength={3}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="acolito@ordo.imperium"
                autoComplete="email"
                required
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Contraseña">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="mínimo 8 caracteres"
                autoComplete="new-password"
                required
                minLength={8}
                className={INPUT_CLASS}
              />
            </Field>
            {error && <p className="font-mono text-xs text-crimson-bright">{error}</p>}
            <SubmitButton disabled={loading}>{loading ? 'Registrando…' : 'Crear cuenta'}</SubmitButton>
            <div className="flex justify-center pt-1">
              <LinkButton onClick={() => changeMode('login')}>Ya tengo cuenta</LinkButton>
            </div>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="flex flex-col gap-3">
            <p className="font-mono text-xs text-parchment-dim">
              Introduce tu email — si existe una cuenta, se genera un enlace de recuperación.
            </p>
            <Field label="Email">
              <input
                type="email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                placeholder="acolito@ordo.imperium"
                autoComplete="email"
                required
                className={INPUT_CLASS}
              />
            </Field>
            {error && <p className="font-mono text-xs text-crimson-bright">{error}</p>}
            <SubmitButton disabled={loading}>{loading ? 'Enviando…' : 'Solicitar recuperación'}</SubmitButton>
            <div className="flex items-center justify-between pt-1">
              <LinkButton onClick={() => changeMode('login')}>Volver</LinkButton>
              <LinkButton onClick={() => changeMode('reset')}>Ya tengo un código</LinkButton>
            </div>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleReset} className="flex flex-col gap-3">
            <Field label="Código de recuperación">
              <input
                type="text"
                value={resetToken}
                onChange={e => setResetToken(e.target.value)}
                placeholder="token recibido"
                required
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Nueva contraseña">
              <input
                type="password"
                value={resetPasswordValue}
                onChange={e => setResetPasswordValue(e.target.value)}
                placeholder="mínimo 8 caracteres"
                autoComplete="new-password"
                required
                minLength={8}
                className={INPUT_CLASS}
              />
            </Field>
            {error && <p className="font-mono text-xs text-crimson-bright">{error}</p>}
            <SubmitButton disabled={loading}>{loading ? 'Actualizando…' : 'Restablecer contraseña'}</SubmitButton>
            <div className="flex justify-center pt-1">
              <LinkButton onClick={() => changeMode('login')}>Volver</LinkButton>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
