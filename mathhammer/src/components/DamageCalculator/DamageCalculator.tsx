import { calculateDamage } from '@/utils/mathhammer'
import type { Weapon, ModelProfile } from '@/types'

interface Props {
  weapon: Weapon | null
  defenderModel: ModelProfile | null
  attackerName: string
  defenderName: string
}

function Row({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="flex items-baseline justify-between py-1.5 border-b border-rim-bright last:border-0">
      <span className="text-[8px] font-display uppercase tracking-widest text-gold">{label}</span>
      <div className="text-right">
        <span className="text-xs font-mono text-gold-bright font-bold">{value}</span>
        {detail && <span className="text-[9px] font-mono text-parchment-dim ml-2">{detail}</span>}
      </div>
    </div>
  )
}

function pct(n: number): string {
  return `${(n * 100).toFixed(0)}%`
}

function fmt(n: number): string {
  return n.toFixed(2)
}

export function DamageCalculator({ weapon, defenderModel, attackerName, defenderName }: Props) {
  if (!weapon || !defenderModel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6 gap-4">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-crimson-dim to-transparent" />
        <p className="text-crimson-dim font-display text-[10px] uppercase tracking-[4px] text-center leading-loose">
          {!weapon ? '// selecciona arma\ndel atacante' : '// selecciona\ndefensor'}
        </p>
        <div className="w-px h-16 bg-gradient-to-b from-crimson-dim via-transparent to-transparent" />
      </div>
    )
  }

  const calc = calculateDamage(weapon, defenderModel)

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="text-center border-b border-rim-bright pb-3">
        <p className="text-[8px] font-mono text-parchment-dim uppercase tracking-widest">
          <span className="text-crimson">{attackerName || '—'}</span>
          <span className="mx-2 text-rim-bright">▶</span>
          <span className="text-gold">{defenderName || '—'}</span>
        </p>
        <p className="text-[9px] font-display uppercase tracking-widest text-parchment mt-1">
          {weapon.name}
        </p>
      </div>

      {/* Big number */}
      <div className="flex flex-col items-center py-2">
        <span className="text-[8px] font-display uppercase tracking-[3px] text-gold-bright mb-1">
          Daño esperado
        </span>
        <span
          className="text-6xl font-display font-black text-crimson-bright"
          style={{ textShadow: '0 0 20px #ff2222, 0 0 50px #c41e1e' }}
        >
          {fmt(calc.expectedTotalDamage)}
        </span>
        <span className="text-[8px] font-mono text-parchment-dim mt-1">por modelo atacante</span>
      </div>

      {/* Breakdown */}
      <div className="border border-rim-bright bg-surface-2 p-3">
        <p className="text-[8px] font-display uppercase tracking-widest text-gold-bright mb-2">
          Desglose
        </p>
        <Row
          label="Impactos"
          value={fmt(calc.expectedHits)}
          detail={`${fmt(calc.avgAttacks)} × ${pct(calc.hitProbability)}`}
        />
        <Row
          label="Heridas"
          value={fmt(calc.expectedWounds)}
          detail={`${fmt(calc.expectedHits)} × ${pct(calc.woundProbability)}`}
        />
        <Row
          label="Salv. fallidas"
          value={fmt(calc.expectedFailedSaves)}
          detail={`${fmt(calc.expectedWounds)} × ${pct(calc.saveFailProbability)}`}
        />
        <Row
          label="Daño/herida"
          value={fmt(calc.avgDamagePerWound)}
          detail={weapon.D}
        />
      </div>

      {/* Context */}
      <div className="text-[8px] font-mono text-parchment-dim border border-rim-bright p-2 space-y-0.5 leading-relaxed">
        <p>
          <span className="text-gold">Atacante</span> — F:{weapon.S} AP:{weapon.AP}
          {weapon.isTorrent && ' [Torrent]'}
          {weapon.isLethalHits && ' [Lethal Hits]'}
        </p>
        <p>
          <span className="text-gold">Defensor</span> — T:{defenderModel.T}
          {' '}Sv:{defenderModel.Sv}
          {defenderModel.invSv && ` Inv:${defenderModel.invSv}`}
        </p>
        {defenderModel.invSv && (
          <p className="text-rim-bright">* Se aplica la mejor salvación disponible.</p>
        )}
      </div>
    </div>
  )
}
