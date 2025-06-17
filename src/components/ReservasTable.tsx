// src/components/ReservasTable.tsx
import { useEffect, useState } from 'preact/hooks';
import type { Reserva } from '@scripts/types.ts';
import {
  getReservas,
  deleteReserva,
  updateReserva,
  createReserva
} from '@scripts/admin_reservas.ts';
import EditModal from '@components/EditModal.tsx';

import EditIcon    from '~icons/heroicons-outline/pencil';
import TrashIcon   from '~icons/heroicons-outline/trash';
import PlusIcon    from '~icons/heroicons-outline/plus';

const estadosOptions = [
  { value: '',           label: 'Todos' },
  { value: 'pendiente',  label: 'Pendiente' },
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'cancelada',  label: 'Cancelada' },
];

export default function ReservasTable() {
  // Datos y errores
  const [rows, setRows]       = useState<Reserva[]>([]);
  const [error, setError]     = useState<string|null>(null);

  // Filtro y orden
  const [search, setSearch]       = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [sortBy, setSortBy]       = useState<keyof Reserva>('fecha_hora_inicio');
  const [sortDir, setSortDir]     = useState<'asc'|'desc'>('asc');

  // Modal de crear/editar
  const [isNew, setIsNew]         = useState(false);
  const [editing, setEditing]     = useState<Reserva|null>(null);
  const [showModal, setShowModal] = useState(false);
  const emptyForm: ReservaForm = {
    nombre: '', apellidos: '', telefono: '',
    email: '', fecha_hora_inicio: '', estado: ''
  };
  const [form, setForm]           = useState<ReservaForm>(emptyForm);

  // Carga inicial de reservas (solo en cliente)
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getReservas();
        setRows(data);
      } catch {
        setError('No se pudieron cargar las reservas');
      }
    })();
  }, []);

  if (error) return <p class="text-red-600">{error}</p>;

  // Filtrado + ordenación
  const filteredRows = [...rows]
    .filter(r =>
      (`${r.nombre} ${r.apellidos} ${r.email} ${r.telefono}`)
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter(r => estadoFilter ? r.estado === estadoFilter : true)
    .sort((a, b) => {
      let va = a[sortBy] as any;
      let vb = b[sortBy] as any;
      // Fecha ya está formateada como "YYYY-MM-DD HH:mm"
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  function handleSort(column: keyof Reserva) {
    if (sortBy === column) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  }

  // Abrir modal en modo "nueva reserva"
  function openNew() {
    setIsNew(true);
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  // Abrir modal en modo "editar reserva"
  function openEdit(r: Reserva) {
    setIsNew(false);
    setEditing(r);
    setForm({
      ...r,
      estado: String(r.estado),
    });
    setShowModal(true);
  }

  // Cambiar un campo del formulario
  function onChange(field: keyof ReservaForm, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function onCancel() {
    setShowModal(false);
    setEditing(null);
    setIsNew(false);
  }

  function toBackendDatetime(dt: string) {
    // Convierte "2025-01-01T14:00" a "2025-01-01 14:00"
    return dt ? dt.replace('T', ' ') : '';
  }

  async function reloadReservas() {
    try {
      const { data } = await getReservas();
      setRows(data);
    } catch {
      setError('No se pudieron cargar las reservas');
    }
  }

  async function onSave(e: Event) {
    e.preventDefault();

    const dataToSend = {
      ...form,
      fecha_hora_inicio: toBackendDatetime(form.fecha_hora_inicio || ''),
    };

    if (isNew) {
      const created = await createReserva(dataToSend);
      if (!created) alert('No se pudo crear la reserva');
    } else if (editing) {
      const updated = await updateReserva(editing.id, dataToSend);
      if (!updated) alert('No se pudo actualizar la reserva');
    }

    await reloadReservas();
    setShowModal(false);
    setEditing(null);
    setIsNew(false);
  }

  return (
    <div class="max-w-6xl mx-auto p-4">
      {/* Título + botón Nueva Reserva */}
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-primary-700">Reservas</h2>
        <button
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={openNew}
        >
        <PlusIcon />
        </button>
      </div>

      {/* Filtros */}
      <div class="flex flex-col md:flex-row md:space-x-4 mb-4 gap-2">
        <input
          class="border rounded px-3 py-2 w-full md:w-1/3"
          placeholder="Buscar por nombre, email, teléfono..."
          value={search}
          onInput={e => setSearch((e.target as HTMLInputElement).value)}
        />
        <select
          class="border rounded px-3 py-2 w-full md:w-1/4"
          value={estadoFilter}
          onChange={e => setEstadoFilter((e.target as HTMLSelectElement).value)}
        >
          {estadosOptions.map(opt => (
            <option value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div class="overflow-x-auto rounded-lg shadow">
        <table class="min-w-full bg-white">
          <thead class="bg-primary-100 text-left">
            <tr>
              <th
                class="px-4 py-2 border cursor-pointer"
                onClick={() => handleSort('id')}
              >
                ID{sortBy === 'id' && (sortDir === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th
                class="px-4 py-2 border cursor-pointer"
                onClick={() => handleSort('nombre')}
              >
                Nombre{sortBy === 'nombre' && (sortDir === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th
                class="px-4 py-2 border cursor-pointer"
                onClick={() => handleSort('telefono')}
              >
                Teléfono{sortBy === 'telefono' && (sortDir === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th
                class="px-4 py-2 border cursor-pointer"
                onClick={() => handleSort('email')}
              >
                Email{sortBy === 'email' && (sortDir === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th
                class="px-4 py-2 border cursor-pointer"
                onClick={() => handleSort('fecha_hora_inicio')}
              >
                Fecha{sortBy === 'fecha_hora_inicio' && (sortDir === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th
                class="px-4 py-2 border cursor-pointer"
                onClick={() => handleSort('estado')}
              >
                Estado{sortBy === 'estado' && (sortDir === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th class="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map(r => (
              <tr key={r.id} class="hover:bg-primary-50">
                <td class="px-4 py-2 border">{r.id}</td>
                <td class="px-4 py-2 border">
                  {r.nombre} {r.apellidos}
                </td>
                <td class="px-4 py-2 border">{r.telefono}</td>
                <td class="px-4 py-2 border">{r.email}</td>
                <td class="px-4 py-2 border">
                  {r.fecha_hora_inicio}
                </td>
                <td class="px-4 py-2 border">{r.estado}</td>
                <td class="px-4 py-2 border text-center">
                  <button
                    class="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded mr-2"
                    onClick={() => openEdit(r)}
                  >
                    <EditIcon />
                  </button>
                  <button
                    class="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
                    onClick={async () => {
                      if (confirm(`¿Eliminar reserva ${r.id}?`)) {
                        const ok = await deleteReserva(r.id);
                        if (ok) setRows(prev => prev.filter(x => x.id !== r.id));
                        else alert('No se pudo eliminar');
                      }
                    }}
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <EditModal
        isOpen={showModal}
        form={form}
        onChange={onChange}
        onCancel={onCancel}
        onSave={onSave}
      />
    </div>
  );
}
