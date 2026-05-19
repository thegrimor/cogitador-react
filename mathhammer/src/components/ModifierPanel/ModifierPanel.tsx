import { useState } from 'react'
import { getApplicableRules } from '@/utils/mathhammer'
import type { Weapon } from '@/types'

interface Props {
  factionId: string | null
  detachmentId: string | null
  weapon: Weapon | null
  side: 'attacker' | 'defender'
  combatType: 'ranged' | 'melee'
  activeIds: Set<string>
  onToggle: (id: string) => void
}

export function ModifierPanel({
  factionId, detachmentId, weapon, side, combatType, activeIds, onToggle,
}: Props) {
  const [expanded, setExpanded] = useState(true)

  const rules = getApplicableRules(weapon, factionId, detachmentId, side, combatType)
  if (rules.length === 0) return null

  const activeCount = rules.filter(r => activeIds.has(r.id)).length

  return (
    <div className="border-b border-rim-bright">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-3 py-1.5 bg-surface-2 hover:bg-surface-3 transition-colors"
      >
        <span className="text-[9px] font-display uppercase tracking-widest text-gold-bright">
          Modificadores
          {activeCount > 0 && (
            <span className="ml-1.5 text-crimson-bright">[{activeCount} activo{activeCount !== 1 ? 's' : ''}]</span>
          )}
        </span>
        <span className="text-[8px] font-mono text-parchment-dim">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="px-3 py-2 flex flex-col gap-1.5">
          {rules.map(rule => {
            const active = activeIds.has(rule.id)
            return (
              <button
                key={rule.id}
                onClick={() => onToggle(rule.id)}
                className={`text-left px-2 py-1 text-[8px] font-mono border transition-colors leading-relaxed ${
                  active
                    ? 'border-gold bg-gold/10 text-gold-bright'
                    : 'border-rim-bright text-parchment-dim hover:border-parchment-dim hover:text-parchment'
                }`}
              >
                <span className={`mr-1 ${active ? 'text-gold' : 'text-parchment-dim'}`}>
                  {active ? '◆' : '◇'}
                </span>
                {rule.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
