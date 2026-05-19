import { calculateDamage } from '@/utils/mathhammer'
import type { Weapon, ModelProfile, CombatModifiers } from '@/types'

interface Props {
  weapon: Weapon | null
  defenderModel: ModelProfile | null
  attackerName: string
  defenderName: string
  attackerMods: CombatModifiers
  defenderMods: CombatModifiers
  combatType: 'ranged' | 'melee'
  onCombatTypeChange: (t: 'ranged' | 'melee') => void
}

function Row({ label, value, detail, highlight }: { label: string; value: string; detail?: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline justify-between py-1.5 border-b border-rim-bright last:border-0">
      <span className={`text-[8px] font-display uppercase tracking-widest ${highlight ? 'text-crimson-bright' : 'text-gold'}`}>{label}</span>
      <div className="text-right">
        <span className={`text-xs font-mono font-bold ${highlight ? 'text-crimson-bright' : 'text-gold-bright'}`}>{value}</span>
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

export function DamageCalculator({
  weapon, defenderModel, attackerName, defenderName,
  attackerMods, defenderMods, combatType, onCombatTypeChange,
}: Props) {
  const typeLockedByWeapon = weapon !== null
  const effectiveCombatType = weapon ? (weapon.range === 'Melee' ? 'melee' : 'ranged') : combatType

  if (!weapon || !defenderModel) {
    return (
      <div className="p-4 flex flex-col gap-4">
        <CombatTypeSelector
          combatType={effectiveCombatType}
          locked={typeLockedByWeapon}
          onChange={onCombatTypeChange}
        />
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-crimson-dim to-transparent" />
          <p className="text-crimson-dim font-display text-[10px] uppercase tracking-[4px] text-center leading-loose">
            {!weapon ? '// selecciona arma\ndel atacante' : '// selecciona\ndefensor'}
          </p>
          <div className="w-px h-12 bg-gradient-to-b from-crimson-dim via-transparent to-transparent" />
        </div>
      </div>
    )
  }

  const calc = calculateDamage(weapon, defenderModel, attackerMods, defenderMods)

  const hasAttackerMods = attackerMods.hitMod !== 0 || attackerMods.rerollHitsOf1 || attackerMods.rerollAllHits
    || attackerMods.critThreshold !== 6 || attackerMods.sustainedHitsBonus > 0 || attackerMods.lethalHitsBonus
    || attackerMods.strengthMod !== 0 || attackerMods.rerollWoundsOf1 || attackerMods.rerollAllWounds
    || attackerMods.woundMod !== 0 || attackerMods.apMod !== 0 || attackerMods.saveMod !== 0
  const hasDefenderMods = defenderMods.saveMod !== 0 || defenderMods.feelNoPainThreshold !== null

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Combat type selector */}
      <CombatTypeSelector
        combatType={effectiveCombatType}
        locked={typeLockedByWeapon}
        onChange={onCombatTypeChange}
      />

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
        {(hasAttackerMods || hasDefenderMods) && (
          <span className="text-[7px] font-mono text-gold mt-0.5 uppercase tracking-wider">con modificadores</span>
        )}
      </div>

      {/* Breakdown */}
      <div className="border border-rim-bright bg-surface-2 p-3">
        <p className="text-[8px] font-display uppercase tracking-widest text-gold-bright mb-2">Desglose</p>
        <Row label="Ataques" value={fmt(calc.avgAttacks)} />
        <Row
          label="Impactos"
          value={fmt(calc.expectedHits)}
          detail={`${fmt(calc.avgAttacks)} × ${pct(calc.hitProbability)}`}
        />
        {calc.sustainedExtraHits > 0 && (
          <Row label="↳ Extra Sustained Hits" value={`+${fmt(calc.sustainedExtraHits)}`} highlight />
        )}
        {calc.autoWoundsFromCrits > 0 && (
          <Row label="↳ Auto-heridas Lethal Hits" value={`+${fmt(calc.autoWoundsFromCrits)}`} highlight />
        )}
        <Row
          label="Heridas"
          value={fmt(calc.expectedWounds)}
          detail={calc.autoWoundsFromCrits > 0
            ? `+${fmt(calc.autoWoundsFromCrits)} auto`
            : `${fmt(calc.expectedHits)} × ${pct(calc.woundProbability)}`}
        />
        <Row
          label="Salv. fallidas"
          value={fmt(calc.expectedFailedSaves)}
          detail={`${fmt(calc.expectedWounds)} × ${pct(calc.saveFailProbability)}`}
        />
        <Row label="Daño/herida" value={fmt(calc.avgDamagePerWound)} detail={weapon.D} />
        {calc.feelNoPainReduction > 0 && (
          <Row label="↳ Reducción FNP" value={`-${fmt(calc.feelNoPainReduction)}`} highlight />
        )}
      </div>

      {/* Context */}
      <div className="text-[8px] font-mono text-parchment-dim border border-rim-bright p-2 space-y-0.5 leading-relaxed">
        <p>
          <span className="text-gold">Atacante</span> — F:{weapon.S}
          {attackerMods.strengthMod !== 0 && <span className="text-crimson-bright"> (S ef: {weapon.S + attackerMods.strengthMod})</span>}
          {' '}AP:{weapon.AP}
          {attackerMods.apMod !== 0 && <span className="text-crimson-bright"> (AP ef: {weapon.AP + attackerMods.apMod})</span>}
          {weapon.isTorrent && ' [Torrent]'}
          {(weapon.isLethalHits || attackerMods.lethalHitsBonus) && ' [Lethal Hits]'}
          {(weapon.sustainedHitsValue > 0 || attackerMods.sustainedHitsBonus > 0) && ` [Sustained ${weapon.sustainedHitsValue + attackerMods.sustainedHitsBonus}]`}
        </p>
        <p>
          <span className="text-gold">Defensor</span> — T:{defenderModel.T} Sv:{defenderModel.Sv}
          {defenderModel.invSv && ` Inv:${defenderModel.invSv}`}
          {(attackerMods.saveMod < 0 || defenderMods.saveMod > 0) && (
            <span className="text-crimson-bright"> (Sv mod: {attackerMods.saveMod + defenderMods.saveMod > 0 ? '+' : ''}{attackerMods.saveMod + defenderMods.saveMod})</span>
          )}
          {defenderMods.feelNoPainThreshold !== null && ` FNP:${defenderMods.feelNoPainThreshold}+`}
        </p>
      </div>
    </div>
  )
}

function CombatTypeSelector({
  combatType, locked, onChange,
}: {
  combatType: 'ranged' | 'melee'
  locked: boolean
  onChange: (t: 'ranged' | 'melee') => void
}) {
  return (
    <div className="flex gap-2 items-center">
      <span className="text-[8px] font-display uppercase tracking-widest text-parchment-dim shrink-0">
        Tipo
      </span>
      <div className="flex flex-1 border border-rim-bright overflow-hidden">
        {(['ranged', 'melee'] as const).map(t => (
          <button
            key={t}
            onClick={() => !locked && onChange(t)}
            disabled={locked}
            className={`flex-1 py-1 text-[8px] font-display uppercase tracking-widest transition-colors ${
              combatType === t
                ? 'bg-gold/20 text-gold-bright border-gold'
                : 'text-parchment-dim hover:text-parchment'
            } ${locked ? 'opacity-70 cursor-default' : ''}`}
          >
            {t === 'ranged' ? 'Disparo' : 'CàC'}
          </button>
        ))}
      </div>
      {locked && (
        <span className="text-[7px] font-mono text-parchment-dim shrink-0">auto</span>
      )}
    </div>
  )
}
