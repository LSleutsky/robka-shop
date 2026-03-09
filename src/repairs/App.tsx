import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

import ConfirmModal from '@/repairs/components/ConfirmModal';
import Header from '@/repairs/components/Header';
import RepairModal from '@/repairs/components/RepairModal';
import RepairTable from '@/repairs/components/RepairTable';
import SearchBar from '@/repairs/components/SearchBar';
import StatsBar from '@/repairs/components/StatsBar';

import { STATUSES } from '@/repairs/config/statuses';
import { exportRepairs } from '@/repairs/lib/exportRepairs';
import { supabase } from '@/repairs/lib/supabase';
import { Repair, RepairForm, Status } from '@/repairs/types';

interface AppProps {
  onSignOut: () => void;
}

const TODAY = new Date().toISOString().split('T')[0];

const EMPTY_FORM: RepairForm = {
  ticket: '',
  date: TODAY,
  customer: '',
  phone: '',
  items: [],
  specs: '',
  status: 'Pending'
};

const capitalize = (value: string) => value.replace(/\b\w/g, char => char.toUpperCase());

export default function App({ onSignOut }: AppProps) {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRepair, setEditingRepair] = useState<Repair | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<RepairForm>(EMPTY_FORM);
  const [itemsInput, setItemsInput] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showSignOut, setShowSignOut] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<{
    ids: number[];
    message: string;
    label: string;
    tickets?: string[];
  } | null>(null);

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
    const items = itemsInput
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

    if (!form.ticket.trim() || !form.customer.trim() || !items.length) {
      return;
    }

    setSaving(true);

    const payload = { ...form, items };

    if (editingRepair) {
      const { error } = await supabase.from('repairs').update(payload).eq('id', editingRepair.id);

      if (!error) {
        setRepairs(prevRepair =>
          prevRepair.map(repair => (repair.id === editingRepair.id ? { ...repair, ...payload } : repair))
        );
      }
    } else {
      const { data, error } = await supabase.from('repairs').insert([payload]).select();

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

  const deleteRepairs = async (ids: number[]) => {
    if (!ids.length) {
      setConfirmDelete(null);

      return;
    }

    const { error: deleteError } = await supabase.from('repairs').delete().in('id', ids);

    if (deleteError) {
      setError('Failed to delete repairs. Please try again.');
    } else {
      const idSet = new Set(ids);

      setRepairs(prevRepairs => prevRepairs.filter(repair => !idSet.has(repair.id)));
      setSelectedIds(prevIds => {
        const next = new Set(prevIds);

        for (const id of ids) {
          next.delete(id);
        }

        return next;
      });
    }

    setConfirmDelete(null);
  };

  const requestDelete = (ids?: number[]) => {
    const toDelete = ids ?? [...selectedIds];

    if (!toDelete.length) {
      return;
    }

    const count = toDelete.length;

    if (count === 1) {
      const repair = repairs.find(r => r.id === toDelete[0]);
      const ticket = repair?.ticket ?? '';

      setConfirmDelete({
        ids: toDelete,
        message: `Delete ${ticket}? This cannot be undone.`,
        label: `Delete ${ticket}`
      });
    } else {
      const tickets = toDelete
        .map(id => repairs.find(repair => repair.id === id)?.ticket)
        .filter((ticket): ticket is string => !!ticket);

      setConfirmDelete({
        ids: toDelete,
        message: `Delete ${String(count)} repairs? This cannot be undone.`,
        label: `Delete ${String(count)} Repairs`,
        tickets
      });
    }
  };

  const openAdd = () => {
    setEditingRepair(null);
    setForm({ ...EMPTY_FORM, date: TODAY });
    setItemsInput('');
    setShowModal(true);
  };

  const openEdit = (repair: Repair) => {
    setEditingRepair(repair);
    setForm({
      ticket: repair.ticket,
      date: repair.date,
      customer: repair.customer,
      phone: repair.phone ?? '',
      items: repair.items,
      specs: repair.specs ?? '',
      status: repair.status
    });
    setItemsInput(repair.items.join(', '));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRepair(null);
    setForm(EMPTY_FORM);
    setItemsInput('');
  };

  const updateForm = (updates: Partial<RepairForm>) => {
    if (updates.customer !== undefined) {
      updates.customer = capitalize(updates.customer);
    }

    setForm(prevForm => ({ ...prevForm, ...updates }));
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prevIds => {
      const next = new Set(prevIds);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const toggleAll = () => {
    const allSelected = filteredRepairs.every(repair => selectedIds.has(repair.id));

    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRepairs.map(repair => repair.id)));
    }
  };

  const counts = STATUSES.reduce<Record<Status, number>>(
    (acc, status) => ({ ...acc, [status]: repairs.filter(repair => repair.status === status).length }),
    {} as Record<Status, number>
  );

  const filteredRepairs = repairs.filter(repair => {
    const matchesStatus = filterStatus === 'all' || repair.status === filterStatus;
    const query = search.toLowerCase();

    const matchesSearch =
      !query ||
      [repair.customer, repair.phone, ...repair.items, repair.ticket, repair.specs]
        .filter((match): match is string => !!match)
        .some(match => match.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  const allFilteredSelected = filteredRepairs.length > 0 && filteredRepairs.every(repair => selectedIds.has(repair.id));

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
      <div className="relative max-w-400 mx-auto px-2 sm:px-4 lg:px-6">
        <Header onNewRepair={openAdd} onSignOut={() => setShowSignOut(true)} ticketCount={repairs.length} />
        <StatsBar
          counts={counts}
          filterStatus={filterStatus}
          hasRepairs={repairs.length > 0}
          onFilterChange={setFilterStatus}
        />
        <SearchBar
          allSelected={allFilteredSelected}
          filterStatus={filterStatus}
          matchCount={filteredRepairs.length}
          onClearFilter={() => setFilterStatus('all')}
          onEditSelected={() => {
            const id = [...selectedIds][0];
            const repair = repairs.find(rep => rep.id === id);

            if (repair) {
              openEdit(repair);
            }
          }}
          onRemoveSelected={() => requestDelete()}
          onSearchChange={setSearch}
          search={search}
          selectedCount={selectedIds.size}
          totalCount={repairs.length}
        />
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
            <X className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        <RepairTable
          filteredRepairs={filteredRepairs}
          loading={loading}
          onDelete={id => requestDelete([id])}
          onEdit={openEdit}
          onExport={() => void exportRepairs(filteredRepairs)}
          onStatusChange={(id, status) => void updateStatus(id, status)}
          onToggleAll={toggleAll}
          onToggleSelect={toggleSelect}
          repairs={repairs}
          selectedIds={selectedIds}
        />
      </div>
      {showModal && (
        <RepairModal
          editingRepair={editingRepair}
          form={form}
          itemsInput={itemsInput}
          onClose={closeModal}
          onFormChange={updateForm}
          onItemsInputChange={setItemsInput}
          onSave={() => void saveRepair()}
          saving={saving}
        />
      )}
      {confirmDelete && (
        <ConfirmModal
          confirmLabel={confirmDelete.label}
          message={confirmDelete.message}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => void deleteRepairs(confirmDelete.ids)}
          tickets={confirmDelete.tickets}
          title="Confirm Deletion"
        />
      )}
      {showSignOut && (
        <ConfirmModal
          confirmLabel="Log Out"
          message="Are you sure you want to log out?"
          onCancel={() => setShowSignOut(false)}
          onConfirm={onSignOut}
          title="Log Out"
        />
      )}
    </div>
  );
}
