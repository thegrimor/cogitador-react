import { useAppDispatch } from '@/core/store/hooks'
import { updateCharInfo } from '../../../services/fichaSlice'
import type { Character } from '../../../types/fichaTypes'

interface Field {
  key: keyof Character['info']
  label: string
  placeholder: string
}

const FIELDS: Field[] = [
  { key: 'name',       label: 'Designación / Nombre', placeholder: 'Nombre del operativo' },
  { key: 'rank',       label: 'Rango',                placeholder: '1' },
  { key: 'career',     label: 'Carrera',              placeholder: 'Tech-Priest' },
  { key: 'homeworld',  label: 'Mundo de Origen',      placeholder: 'Scintilla' },
  { key: 'experience', label: 'XP Total',             placeholder: '0' },
  { key: 'xpSpent',    label: 'XP Gastado',           placeholder: '0' },
]

interface Props {
  char: Character
}

export function CharInfoGrid({ char }: Props) {
  const dispatch = useAppDispatch()

  return (
    <div className="bg-surface-2 border border-rim">
      <div className="flex items-center border-b border-rim bg-crimson/5 px-4 py-2">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
          // Datos de Identificación
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-px bg-rim p-px">
        {FIELDS.map(field => (
          <div key={field.key} className="bg-surface px-3 py-2">
            <label className="block font-display text-[8px] uppercase tracking-[2px] text-parchment-dim mb-1">
              {field.label}
            </label>
            <input
              type="text"
              value={char.info[field.key]}
              placeholder={field.placeholder}
              onChange={e =>
                dispatch(updateCharInfo({ id: char.id, field: field.key, value: e.target.value }))
              }
              className="w-full bg-transparent font-rajdhani text-[15px] font-semibold text-parchment outline-none placeholder:text-parchment-dim/40"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
