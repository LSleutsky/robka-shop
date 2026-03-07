import { useState, useEffect, useRef } from 'react'
import { supabase } from './lib/supabase'
import type { Repair, RepairForm, Status } from './types'
import { clsx } from 'clsx'
import {
  Wrench,
  Plus,
  Search,
  X,
  Pencil,
  Trash2,
  Clock,
  Loader2,
  CircleDot,
  CheckCircle2,
  PackageCheck,
  ChevronDown,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'

const STATUSES: Status[] = ['pending', 'in progress', 'done', 'picked up']

const STATUS_CFG: Record<Status, {
  label: string
  icon: typeof Clock
  gradient: string
  text: string
  bg: string
  ring: string
  dot: string
  glow: string
}> = {
  pending: {
    label: 'Pending',
    icon: Clock,
    gradient: 'from-amber-500/20 to-orange-500/10',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    ring: 'ring-amber-500/20',
    dot: 'bg-amber-400',
    glow: 'shadow-amber-500/10',
  },
  'in progress': {
    label: 'In Progress',
    icon: CircleDot,
    gradient: 'from-blue-500/20 to-cyan-500/10',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    ring: 'ring-blue-500/20',
    dot: 'bg-blue-400',
    glow: 'shadow-blue-500/10',
  },
  done: {
    label: 'Done',
    icon: CheckCircle2,
    gradient: 'from-emerald-500/20 to-teal-500/10',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    ring: 'ring-emerald-500/20',
    dot: 'bg-emerald-400',
    glow: 'shadow-emerald-500/10',
  },
  'picked up': {
    label: 'Picked Up',
    icon: PackageCheck,
    gradient: 'from-violet-500/20 to-purple-500/10',
    text: 'text-violet-400',
    bg: 'bg-violet-500/10',
    ring: 'ring-violet-500/20',
    dot: 'bg-violet-400',
    glow: 'shadow-violet-500/10',
  },
}

const TODAY = new Date().toISOString().split('T')[0]

const EMPTY_FORM: RepairForm = {
  ticket: '',
  date: TODAY,
  customer: '',
  item: '',
  specs: '',
  status: 'pending',
}

// ─── Components ──────────────────────────────────────────────────────────────

function StatusBadge({ status, interactive, onChange }: {
  status: Status
  interactive?: boolean
  onChange?: (s: Status) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const cfg = STATUS_CFG[status]
  const Icon = cfg.icon

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const badge = (
    <button
      onClick={interactive ? () => setOpen(!open) : undefined}
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset transition-all duration-200',
        cfg.bg, cfg.text, cfg.ring,
        interactive && 'cursor-pointer hover:brightness-125',
      )}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
      {interactive && <ChevronDown className="w-3 h-3 opacity-50" />}
    </button>
  )

  if (!interactive) return badge

  return (
    <div className="relative" ref={ref}>
      {badge}
      {open && (
        <div className="absolute top-full left-0 mt-1.5 z-50 min-w-[140px] bg-slate-800 border border-slate-700/50 rounded-xl shadow-xl shadow-black/30 overflow-hidden py-1">
          {STATUSES.map(s => {
            const c = STATUS_CFG[s]
            const SIcon = c.icon
            return (
              <button
                key={s}
                onClick={() => { onChange?.(s); setOpen(false) }}
                className={clsx(
                  'w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors',
                  s === status ? 'bg-slate-700/50 text-white' : 'text-slate-400 hover:bg-slate-700/30 hover:text-white',
                )}
              >
                <SIcon className={clsx('w-3.5 h-3.5', c.text)} />
                {c.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputBase =
  'w-full bg-slate-800/80 border border-slate-600/40 text-slate-100 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 placeholder-slate-500 transition-all duration-200 hover:border-slate-500/50 shadow-sm shadow-black/10'

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [repairs, setRepairs] = useState<Repair[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingRepair, setEditingRepair] = useState<Repair | null>(null)
  const [saving, setSaving] = useState(false)
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState<RepairForm>(EMPTY_FORM)

  useEffect(() => { void fetchRepairs() }, [])

  async function fetchRepairs() {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('repairs')
      .select('*')
      .order('id', { ascending: false })
    if (error) {
      setError('Failed to load repairs. Check your Supabase connection.')
    } else {
      setRepairs(data as Repair[])
    }
    setLoading(false)
  }

  async function saveRepair() {
    if (!form.customer.trim() || !form.item.trim() || !form.ticket.trim()) return
    setSaving(true)
    if (editingRepair) {
      const { error } = await supabase.from('repairs').update(form).eq('id', editingRepair.id)
      if (!error) setRepairs(prev => prev.map(r => (r.id === editingRepair.id ? { ...r, ...form } : r)))
    } else {
      const { data, error } = await supabase.from('repairs').insert([form]).select()
      if (!error && data?.length) setRepairs(prev => [data[0] as Repair, ...prev])
    }
    setSaving(false)
    closeModal()
  }

  async function updateStatus(id: number, status: Status) {
    const { error } = await supabase.from('repairs').update({ status }).eq('id', id)
    if (!error) setRepairs(prev => prev.map(r => (r.id === id ? { ...r, status } : r)))
  }

  async function deleteRepair(id: number, name: string) {
    if (!window.confirm(`Delete repair for ${name}? This cannot be undone.`)) return
    const { error } = await supabase.from('repairs').delete().eq('id', id)
    if (!error) setRepairs(prev => prev.filter(r => r.id !== id))
  }

  function openAdd() {
    setEditingRepair(null)
    setForm({ ...EMPTY_FORM, date: TODAY })
    setShowModal(true)
  }

  function openEdit(repair: Repair) {
    setEditingRepair(repair)
    setForm({
      ticket: repair.ticket,
      date: repair.date,
      customer: repair.customer,
      item: repair.item,
      specs: repair.specs ?? '',
      status: repair.status,
    })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingRepair(null)
    setForm(EMPTY_FORM)
  }

  function setField<K extends keyof RepairForm>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }))
  }

  const counts = STATUSES.reduce<Record<Status, number>>(
    (acc, s) => ({ ...acc, [s]: repairs.filter(r => r.status === s).length }),
    {} as Record<Status, number>,
  )

  const filtered = repairs.filter(r => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus
    const q = search.toLowerCase()
    const matchesSearch = !q || [r.customer, r.item, r.ticket, r.specs].some(f => f?.toLowerCase().includes(q))
    return matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#050810] text-slate-100 font-sans">
      {/* Ambient gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 left-1/4 w-[600px] h-[600px] bg-blue-600/[0.04] rounded-full blur-[120px]" />
        <div className="absolute -top-48 right-1/4 w-[600px] h-[600px] bg-violet-600/[0.03] rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <header className="py-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
                <Wrench className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white font-mono">
                Repair Tracker
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {repairs.length} ticket{repairs.length !== 1 && 's'}
              </p>
            </div>
          </div>
          <button
            onClick={openAdd}
            className="group relative inline-flex items-center gap-2 font-semibold text-sm transition-all duration-300 active:scale-[0.97]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-600 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
            <div className="relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow duration-500">
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">New Repair</span>
              <span className="sm:hidden">New</span>
            </div>
          </button>
        </header>

        {/* ── Stats ── */}
        <div className="pb-5">
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 backdrop-blur-sm overflow-hidden grid grid-cols-2 md:grid-cols-4">
            {STATUSES.map((status, i) => {
              const active = filterStatus === status
              const cfg = STATUS_CFG[status]
              const Icon = cfg.icon
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(active ? 'all' : status)}
                  className={clsx(
                    'relative group p-4 text-left transition-all duration-300',
                    active ? 'bg-slate-800/50' : 'hover:bg-slate-800/20',
                    i % 2 !== 0 && 'border-l border-slate-700/30',
                    i >= 2 && 'border-t border-slate-700/30 md:border-t-0',
                    i >= 1 && 'md:border-l md:border-slate-700/30',
                  )}
                >
                  <div className={clsx('absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500', cfg.gradient, active && 'opacity-100')} />
                  <div className="relative flex items-center gap-3 lg:gap-4">
                    <div className={clsx('shrink-0 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center ring-1 ring-inset', cfg.bg, cfg.ring)}>
                      <Icon className={clsx('w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7', cfg.text)} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-xl md:text-2xl lg:text-3xl font-extrabold font-mono text-white tabular-nums leading-none mb-1">
                        {counts[status] ?? 0}
                      </div>
                      <div className={clsx('text-[11px] md:text-xs lg:text-sm font-semibold uppercase tracking-wider whitespace-nowrap', active ? cfg.text : 'text-slate-500')}>
                        {cfg.label}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Search ── */}
        <div className="pb-4 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-600/30 text-slate-100 pl-10 pr-4 py-2.5 text-sm rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 placeholder-slate-500 transition-all duration-200 hover:border-slate-500/40 shadow-sm shadow-black/20"
            />
          </div>
          {(filterStatus !== 'all' || search) && (
            <button
              onClick={() => { setFilterStatus('all'); setSearch('') }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-all duration-200"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
          {filtered.length !== repairs.length && (
            <span className="text-xs text-slate-600 font-medium tabular-nums">
              {filtered.length} of {repairs.length}
            </span>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
            <X className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* ── Table ── */}
        <div className="pb-8">
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 overflow-hidden backdrop-blur-sm shadow-lg shadow-black/20">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-28 text-slate-600">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500/60 mb-3" />
                <p className="text-sm font-medium">Loading repairs...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-28">
                {repairs.length === 0 ? (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-slate-800/60 flex items-center justify-center mb-4">
                      <Sparkles className="w-6 h-6 text-slate-600" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium mb-1">No repairs yet</p>
                    <p className="text-slate-600 text-xs">Create your first ticket to get started.</p>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-slate-800/60 flex items-center justify-center mb-4">
                      <Search className="w-6 h-6 text-slate-600" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">No results</p>
                    <p className="text-slate-600 text-xs">Try a different search or filter.</p>
                  </>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/30">
                      {['Ticket', 'Date', 'Customer', 'Item', 'Specs', 'Status', ''].map(h => (
                        <th key={h} className={clsx(
                          'px-5 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-widest',
                          h === 'Ticket' && 'font-mono',
                        )}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(repair => (
                      <tr
                        key={repair.id}
                        className="border-b border-slate-700/20 transition-colors duration-150 hover:bg-slate-800/40 group"
                      >
                        <td className="px-5 py-4 font-mono">
                          <span className="text-blue-400 font-bold text-xs bg-blue-500/10 px-2 py-1 rounded-md">
                            {repair.ticket}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500 whitespace-nowrap text-xs">{repair.date}</td>
                        <td className="px-5 py-4 font-medium text-slate-200">{repair.customer}</td>
                        <td className="px-5 py-4 text-slate-300">{repair.item}</td>
                        <td className="px-5 py-4 text-slate-500 max-w-[200px]">
                          <span className="block truncate" title={repair.specs ?? ''}>
                            {repair.specs || <span className="text-slate-700">—</span>}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge
                            status={repair.status}
                            interactive
                            onChange={status => void updateStatus(repair.id, status)}
                          />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => openEdit(repair)}
                              className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
                              title="Edit"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => void deleteRepair(repair.id, repair.customer)}
                              className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && closeModal()}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={closeModal} />

          {/* Panel */}
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
            {/* Glow line at top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

            <div className="border-b border-slate-800/60 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center">
                  {editingRepair
                    ? <Pencil className="w-4 h-4 text-blue-400" />
                    : <Plus className="w-4 h-4 text-blue-400" />
                  }
                </div>
                <h2 className="text-base font-bold text-white font-mono">
                  {editingRepair ? `Edit ${editingRepair.ticket}` : 'New Repair'}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Ticket *">
                  <input
                    type="text"
                    value={form.ticket}
                    onChange={setField('ticket')}
                    placeholder="TK-001"
                    className={inputBase}
                    autoFocus
                  />
                </Field>
                <Field label="Date">
                  <input
                    type="date"
                    value={form.date}
                    onChange={setField('date')}
                    className={inputBase}
                  />
                </Field>
              </div>

              <Field label="Customer *">
                <input
                  type="text"
                  value={form.customer}
                  onChange={setField('customer')}
                  placeholder="John Smith"
                  className={inputBase}
                />
              </Field>

              <Field label="Item *">
                <input
                  type="text"
                  value={form.item}
                  onChange={setField('item')}
                  placeholder="Laptop, iPhone 14, Samsung TV..."
                  className={inputBase}
                />
              </Field>

              <Field label="Specs">
                <textarea
                  value={form.specs ?? ''}
                  onChange={setField('specs')}
                  placeholder="Screen replacement, battery swap, diagnostics..."
                  rows={3}
                  className={`${inputBase} resize-none`}
                />
              </Field>

              <Field label="Status">
                <select value={form.status} onChange={setField('status')} className={inputBase}>
                  {STATUSES.map(s => (
                    <option key={s} value={s}>{STATUS_CFG[s].label}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="border-t border-slate-800/60 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2.5 text-sm text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => void saveRepair()}
                disabled={!form.customer.trim() || !form.item.trim() || !form.ticket.trim() || saving}
                className={clsx(
                  'relative inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300',
                  'bg-gradient-to-r from-blue-500 to-violet-600 text-white',
                  'hover:shadow-lg hover:shadow-blue-500/25 hover:brightness-110',
                  'disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 disabled:shadow-none disabled:cursor-not-allowed',
                )}
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {saving ? 'Saving...' : editingRepair ? 'Save Changes' : 'Create Repair'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
