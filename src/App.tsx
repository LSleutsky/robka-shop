import { X } from 'lucide-react';
import { ChangeEvent, useState, useEffect } from 'react';

import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import StatsBar from '@/components/StatsBar';
import RepairModal from '@/components/RepairModal';
import RepairTable from '@/components/RepairTable';

import { STATUSES } from '@/config/statuses';
import { supabase } from '@/lib/supabase';
import { Repair, RepairForm, Status } from '@/types';

const TODAY = new Date().toISOString().split('T')[0];

const EMPTY_FORM: RepairForm = {
  ticket: '',
  date: TODAY,
  customer: '',
  item: '',
  specs: '',
  status: 'pending'
};

export default function App() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRepair, setEditingRepair] = useState<Repair | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<RepairForm>(EMPTY_FORM);

  const fetchRepairs = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.from('repairs').select('*').order('id', { ascending: false });

    if (error) {
      setError('Failed to load repairs. Check your Supabase connection.');
    } else {
      setRepairs(data as Repair[]);
    }

    setLoading(false);
  };

  const saveRepair = async () => {
    if (!form.customer.trim() || !form.item.trim() || !form.ticket.trim()) {
      return;
    }

    setSaving(true);

    if (editingRepair) {
      const { error } = await supabase.from('repairs').update(form).eq('id', editingRepair.id);

      if (!error) {
        setRepairs(prevRepair =>
          prevRepair.map(repair => (repair.id === editingRepair.id ? { ...repair, ...form } : repair))
        );
      }
    } else {
      const { data, error } = await supabase.from('repairs').insert([form]).select();

      if (!error && data.length) {
        setRepairs(prevRepair => [data[0] as Repair, ...prevRepair]);
      }
    }

    setSaving(false);
    closeModal();
  };

  const updateStatus = async (id: number, status: Status) => {
    const { error } = await supabase.from('repairs').update({ status }).eq('id', id);

    if (!error) {
      setRepairs(prevRepair => prevRepair.map(repair => (repair.id === id ? { ...repair, status } : repair)));
    }
  };

  const deleteRepair = async (id: number, name: string) => {
    if (!window.confirm(`Delete repair for ${name}? This cannot be undone.`)) {
      return;
    }

    const { error } = await supabase.from('repairs').delete().eq('id', id);

    if (!error) {
      setRepairs(prevRepair => prevRepair.filter(repair => repair.id !== id));
    }
  };

  const openAdd = () => {
    setEditingRepair(null);
    setForm({ ...EMPTY_FORM, date: TODAY });
    setShowModal(true);
  };

  const openEdit = (repair: Repair) => {
    setEditingRepair(repair);
    setForm({
      ticket: repair.ticket,
      date: repair.date,
      customer: repair.customer,
      item: repair.item,
      specs: repair.specs ?? '',
      status: repair.status
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRepair(null);
    setForm(EMPTY_FORM);
  };

  const setField =
    (key: keyof RepairForm) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prevForm => ({ ...prevForm, [key]: event.target.value }));

  const counts = STATUSES.reduce<Record<Status, number>>(
    (acc, status) => ({ ...acc, [status]: repairs.filter(repair => repair.status === status).length }),
    {} as Record<Status, number>
  );

  const filtered = repairs.filter(repair => {
    const matchesStatus = filterStatus === 'all' || repair.status === filterStatus;
    const query = search.toLowerCase();

    const matchesSearch =
      !query ||
      [repair.customer, repair.item, repair.ticket, repair.specs].some(match => match?.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  useEffect(() => {
    void fetchRepairs();
  }, []);

  return (
    <div className="min-h-screen bg-[#050810] text-slate-100 font-sans">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 left-1/4 w-150 h-150 bg-blue-600/4 rounded-full blur-[120px]" />
        <div className="absolute -top-48 right-1/4 w-150 h-150 bg-violet-600/3 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header onNewRepair={openAdd} ticketCount={repairs.length} />
        <StatsBar counts={counts} filterStatus={filterStatus} onFilterChange={setFilterStatus} />
        <SearchBar
          filterStatus={filterStatus}
          filteredCount={filtered.length}
          onClear={() => {
            setFilterStatus('all');
            setSearch('');
          }}
          onSearchChange={setSearch}
          search={search}
          totalCount={repairs.length}
        />
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
            <X className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        <RepairTable
          filtered={filtered}
          loading={loading}
          onDelete={(id, name) => void deleteRepair(id, name)}
          onEdit={openEdit}
          onStatusChange={(id, status) => void updateStatus(id, status)}
          repairs={repairs}
        />
      </div>
      {showModal && (
        <RepairModal
          editingRepair={editingRepair}
          form={form}
          onClose={closeModal}
          onFieldChange={setField}
          onSave={() => void saveRepair()}
          saving={saving}
        />
      )}
    </div>
  );
}
