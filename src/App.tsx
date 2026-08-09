import { useState } from 'react'
import { TabBar } from '@/shared/components/TabBar'
import type { TabId } from '@/shared/components/TabBar'
import { ThemePicker } from '@/shared/components/ThemePicker'
import { AccountMenu } from '@/shared/components/AccountMenu'
import { Toast } from '@/shared/components/Toast'
import { useTheme } from '@/shared/hooks/useTheme'
import { FichaView } from '@/modules/ficha'
import { ProyectosView } from '@/modules/proyectos'
import { SequitoView } from '@/modules/sequito'
import { NotasView } from '@/modules/notas'
import { AuthView } from '@/modules/auth'
import { CampanaView } from '@/modules/campana'
import { UsersAdminView } from '@/modules/admin'
import { CloudSync } from '@/core/sync/CloudSync'
import { logoutFully } from '@/core/store/logoutFully'
import { useAppDispatch, useAppSelector } from '@/core/store/hooks'

const VIEWS: Record<TabId, React.ReactNode> = {
  ficha:     <FichaView />,
  proyectos: <ProyectosView />,
  sequito:   <SequitoView />,
  notas:     <NotasView />,
}

const TAB_SUBTITLES: Record<TabId, string> = {
  ficha:     '',
  proyectos: '// Registro Operacional',
  sequito:   '// Acólitos y Aliados',
  notas:     '// Bitácora Temática',
}

interface AppHeaderProps {
  activeTab: TabId
  onOpenCampana: () => void
  onOpenAdmin: () => void
}

function AppHeader({ activeTab, onOpenCampana, onOpenAdmin }: AppHeaderProps) {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const activeChar = characters.find(c => c.id === activeCharacterId)
  const user = useAppSelector(s => s.auth.user)
  const [currentTheme, setTheme, themes] = useTheme()

  const subtitle = activeTab === 'ficha'
    ? `Rango ${activeChar?.info.rank ?? 1} // ${activeChar?.info.career ?? 'Acólito'} — ${activeChar?.info.name ?? 'Sin Designación'}`
    : TAB_SUBTITLES[activeTab]

  return (
    <header className="relative z-20 border-b-2 border-crimson bg-surface-2 px-4 py-3">
      <div className="animate-shimmer absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson to-transparent opacity-60" />

      <div className="flex items-center gap-3">
        <span className="animate-spin-slow text-2xl leading-none text-crimson-dim select-none">
          ⚙
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h1
            className="font-display text-base font-black uppercase tracking-[3px] text-crimson-bright leading-none"
            style={{ textShadow: '0 0 12px rgba(255,34,34,0.4)' }}
          >
            Dark Heresy Cogitator
          </h1>
          <p className="truncate font-display text-[8px] uppercase tracking-[3px] text-gold leading-none">
            {subtitle || '// Adeptus Mechanicus'}
          </p>
        </div>
        <div className="ml-auto shrink-0">
          <AccountMenu>
            <ThemePicker currentTheme={currentTheme} themes={themes} onSelect={setTheme} />
            <div className="my-1 border-t border-rim-bright" />
            <button
              onClick={onOpenCampana}
              className="w-full flex items-center gap-2 px-3 py-2 text-left font-display text-[11px] uppercase tracking-widest text-parchment-dim hover:bg-surface-3 hover:text-parchment transition-colors"
            >
              <span className="text-sm leading-none select-none">☩</span>
              Ver la campaña
            </button>
            {user?.role === 'ADMIN' && (
              <button
                onClick={onOpenAdmin}
                className="w-full flex items-center gap-2 px-3 py-2 text-left font-display text-[11px] uppercase tracking-widest text-parchment-dim hover:bg-surface-3 hover:text-parchment transition-colors"
              >
                <span className="text-sm leading-none select-none">⚙</span>
                Usuarios
              </button>
            )}
            <div className="my-1 border-t border-rim-bright" />
            <button
              onClick={() => logoutFully(dispatch)}
              className="w-full flex items-center gap-2 px-3 py-2 text-left font-display text-[11px] uppercase tracking-widest text-parchment-dim hover:bg-surface-3 hover:text-crimson-bright transition-colors"
            >
              <span className="text-sm leading-none select-none">⏻</span>
              Cerrar sesión
            </button>
          </AccountMenu>
        </div>
      </div>
    </header>
  )
}

type Screen = 'app' | 'campana' | 'admin'

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('ficha')
  const [screen, setScreen] = useState<Screen>('app')
  const token = useAppSelector(s => s.auth.token)

  if (!token) {
    return (
      <div className="relative flex min-h-screen flex-col overflow-x-hidden font-mono text-parchment bg-surface">
        <div className="scanline" />
        <AuthView />
        <Toast />
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden font-mono text-parchment bg-surface">
      <div className="scanline" />

      <CloudSync />
      <AppHeader
        activeTab={activeTab}
        onOpenCampana={() => setScreen('campana')}
        onOpenAdmin={() => setScreen('admin')}
      />

      <main className={['relative z-10 flex flex-1 flex-col', screen === 'app' ? 'pb-16' : ''].join(' ')}>
        {screen === 'campana' && <CampanaView onBack={() => setScreen('app')} />}
        {screen === 'admin' && <UsersAdminView onBack={() => setScreen('app')} />}
        {screen === 'app' && VIEWS[activeTab]}
      </main>

      {screen === 'app' && <TabBar active={activeTab} onChange={setActiveTab} />}
      <Toast />
    </div>
  )
}

export default App
