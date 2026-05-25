import { useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import { importState } from '../services/sequitoSlice'
import { showToast } from '@/shared/components/Toast'
import { Toast } from '@/shared/components/Toast'
import { ConfirmModal } from '@/shared/components/ConfirmModal'
import { useConfirm } from '@/shared/hooks/useConfirm'
import { LayerBoard } from './LayerBoard'
import { AddSeqModal } from './AddSeqModal'
import { SeqEditModal } from './SeqEditModal'
import { ArmoryTab } from './tabs/ArmoryTab'
import { InventoryTab } from './tabs/InventoryTab'
import type { SequitoState } from '../types/sequitoTypes'

type TabId = 'sequito' | 'armory' | 'implants' | 'mechadendrites' | 'equipment' | 'armor'

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'sequito', label: '☠ SÉQUITO' },
  { id: 'armory', label: '⚔ ARMAS' },
  { id: 'implants', label: '🦾 IMPLANTES' },
  { id: 'mechadendrites', label: '🔩 MECADENDRITES' },
  { id: 'equipment', label: '🎒 EQUIPO' },
  { id: 'armor', label: '🛡 ARMADURAS' },
]

export function SequitoView() {
  const dispatch = useAppDispatch()
  const confirm = useConfirm()
  const importRef = useRef<HTMLInputElement>(null)

  const [activeTab, setActiveTab] = useState<TabId>('sequito')
  const [searchQuery, setSearchQuery] = useState('')
  const [addSeqLayerId, setAddSeqLayerId] = useState<string | null>(null)
  const [editSeqId, setEditSeqId] = useState<string | null>(null)

  const layers = useAppSelector(s => s.sequito.layers)
  const allSequito = useAppSelector(s => s.sequito.sequito)
  const sequitoState = useAppSelector(s => s.sequito)

  const members = Object.values(allSequito)
  const totalCount = members.length
  const aliveCount = members.filter(m => m.alive).length
  const deadCount = members.filter(m => !m.alive).length
  const groupCount = layers.length

  function handleExport() {
    const blob = new Blob([JSON.stringify(sequitoState, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sequito.json'
    a.click()
    URL.revokeObjectURL(url)
    showToast('Exportado')
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string) as Partial<SequitoState>
        if (data.layers && data.sequito) {
          confirm.confirm(
            '¿Importar datos? El estado actual será reemplazado.',
            () => {
              dispatch(importState({
                layers: data.layers ?? [],
                sequito: data.sequito ?? {},
                armory: data.armory ?? [],
                implants: data.implants ?? [],
                mechadendrites: data.mechadendrites ?? [],
                equipment: data.equipment ?? [],
                armor: data.armor ?? [],
              }))
              showToast('Importado correctamente')
            }
          )
        } else {
          showToast('Error: archivo inválido')
        }
      } catch {
        showToast('Error: archivo inválido')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col h-full bg-surface overflow-hidden">
      <div className="grid grid-cols-4 border-b border-rim-bright bg-surface-2 flex-shrink-0">
        {(
          [
            { label: 'TOTAL', val: totalCount, cls: 'text-gold' },
            { label: 'ACTIVOS', val: aliveCount, cls: 'text-neon' },
            { label: 'CAÍDOS', val: deadCount, cls: 'text-crimson-bright' },
            { label: 'GRUPOS', val: groupCount, cls: 'text-gold' },
          ] as Array<{ label: string; val: number; cls: string }>
        ).map(({ label, val, cls }) => (
          <div key={label} className="flex flex-col items-center justify-center py-2 gap-0.5 border-r border-rim last:border-r-0">
            <span className={`font-display text-[13px] ${cls}`}>{val}</span>
            <span className="font-mono text-[8px] uppercase tracking-[1px] text-parchment-dim">
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 px-3 py-2 border-b border-rim-bright bg-surface-2 flex-shrink-0 flex-wrap">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Buscar séquito..."
          className="bg-surface border border-rim-bright text-parchment font-mono text-[11px] px-2.5 py-1.5 outline-none focus:border-gold w-44 placeholder:text-parchment-dim/40"
        />
        <div className="flex gap-1.5 ml-auto">
          <button
            onClick={handleExport}
            className="font-display text-[8px] uppercase tracking-[2px] border border-rim-bright text-parchment-dim px-3 py-1.5 hover:text-parchment hover:border-parchment-dim transition-colors bg-surface-3"
          >
            ⬇ EXPORTAR
          </button>
          <button
            onClick={() => importRef.current?.click()}
            className="font-display text-[8px] uppercase tracking-[2px] border border-rim-bright text-parchment-dim px-3 py-1.5 hover:text-parchment hover:border-parchment-dim transition-colors bg-surface-3"
          >
            ⬆ IMPORTAR
          </button>
          <input
            ref={importRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportFile}
          />
        </div>
      </div>

      <div className="flex border-b-2 border-crimson-dim bg-surface-2 overflow-x-auto flex-shrink-0">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              'font-display text-[9px] uppercase tracking-[1px] px-3 py-2.5 cursor-pointer whitespace-nowrap flex-shrink-0 border-b-2 -mb-0.5 transition-colors',
              activeTab === tab.id
                ? 'text-crimson-bright border-crimson bg-surface-3'
                : 'text-parchment-dim border-transparent hover:text-parchment',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'sequito' && (
          <div className="p-2">
            <LayerBoard
              searchQuery={searchQuery}
              onAddSeq={layerId => setAddSeqLayerId(layerId)}
              onEditSeq={seqId => setEditSeqId(seqId)}
            />
          </div>
        )}
        {activeTab === 'armory' && <ArmoryTab />}
        {activeTab === 'implants' && <InventoryTab cat="implants" label="IMPLANTE" />}
        {activeTab === 'mechadendrites' && <InventoryTab cat="mechadendrites" label="MECADENDRITE" />}
        {activeTab === 'equipment' && <InventoryTab cat="equipment" label="OBJETO" />}
        {activeTab === 'armor' && <InventoryTab cat="armor" label="ARMADURA" />}
      </div>

      {addSeqLayerId && (
        <AddSeqModal
          layerId={addSeqLayerId}
          onClose={() => setAddSeqLayerId(null)}
        />
      )}

      {editSeqId && (
        <SeqEditModal
          seqId={editSeqId}
          onClose={() => setEditSeqId(null)}
        />
      )}

      <Toast />

      <ConfirmModal
        isOpen={confirm.isOpen}
        message={confirm.message}
        onConfirm={confirm.onConfirm}
        onCancel={confirm.onCancel}
        confirmLabel="Importar"
      />
    </div>
  )
}
