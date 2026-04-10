import { useAppDispatch } from '@/core/store/hooks'
import { updateCharInfo } from '../../../services/fichaSlice'
import { CAREERS } from '@/core/data/darkheresy/careers'
import type { Character } from '../../../types/fichaTypes'

interface TextField {
  kind: 'text'
  key: keyof Character['info']
  label: string
  placeholder: string
}

interface SelectField {
  kind: 'select'
  key: keyof Character['info']
  label: string
}

type Field = TextField | SelectField

const FIELDS: Field[] = [
  { kind: 'text',   key: 'name',      label: 'Designación / Nombre', placeholder: 'Nombre del operativo' },
  { kind: 'select', key: 'career',    label: 'Carrera'                                                    },
  { kind: 'text',   key: 'homeworld', label: 'Mundo de Origen',       placeholder: 'Scintilla'            },
]

interface Props {
  char: Character
}

export function CharInfoGrid({ char }: Props) {
  const dispatch = useAppDispatch()

  function handleChange(key: keyof Character['info'], value: string) {
    dispatch(updateCharInfo({ id: char.id, field: key, value }))
  }

  return (
    <div className="bg-surface-2 border border-rim">
      <div className="flex items-center border-b border-rim bg-crimson/5 px-4 py-2">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
          // Datos de Identificación
        </h3>
      </div>
      <div className="flex flex-col gap-px bg-rim">
        {FIELDS.map(field => (
          <div key={field.key} className="bg-surface px-3 py-2">
            <label className="block font-display text-[8px] uppercase tracking-[2px] text-parchment-dim mb-1">
              {field.label}
            </label>

            {field.kind === 'select' ? (
              <select
                value={char.info[field.key]}
                onChange={e => handleChange(field.key, e.target.value)}
                className="w-full bg-transparent font-rajdhani text-[15px] font-semibold text-parchment outline-none"
              >
                <option value="">— Seleccionar —</option>
                {CAREERS.map(c => (
                  <option key={c.key} value={c.key} className="bg-surface-2 text-parchment">
                    {c.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={char.info[field.key]}
                placeholder={field.placeholder}
                onChange={e => handleChange(field.key, e.target.value)}
                className="w-full bg-transparent font-rajdhani text-[15px] font-semibold text-parchment outline-none placeholder:text-parchment-dim/40"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
