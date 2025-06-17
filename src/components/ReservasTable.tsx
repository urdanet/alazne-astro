import { useEffect, useState } from 'preact/hooks';
import { getReservas }       from '@/scripts/auth.ts';
import { deleteReserva, updateReserva } from '@/scripts/reservas.ts';
import EditModal from '@components/EditModal.tsx';

export interface Reserva {
  id: number;
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  fecha_hora_inicio: string;
  estado: string;
}

export default function ReservasTable() {
  const [rows, setRows]           = useState<Reserva[] | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const [editing, setEditing]     = useState<Reserva | null>(null);
  const [form, setForm]           = useState<ReservaForm>({
    nombre: '',
    apellidos: '',
    telefono: '',
    email: '',
    fecha_hora_inicio: '',
    estado: ''
  });
  const [showModal, setShowModal] = useState(false);

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
  if (!rows) return <p>Cargando…</p>;

  // Abre el modal con datos
  function openEdit(r: Reserva) {
    setEditing(r);
    setForm({ ...r });
    setShowModal(true);
  }

  // Maneja el cambio de campo en el modal
  function onChange(field: keyof ReservaForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  // Cancela la edición
  function onCancel() {
    setShowModal(false);
    setEditing(null);
  }

  // Guarda los cambios
  async function onSave(e: Event) {
    e.preventDefault();
    if (!editing) return;

    const updated = await updateReserva(editing.id, form);
    if (updated) {
      // re-fetch para tener datos 100% sincronizados
      const { data } = await getReservas();
      setRows(data);
      setShowModal(false);
      setEditing(null);
    } else {
      alert('No se pudo actualizar la reserva');
    }
  }

  return (
    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-300 rounded-lg shadow-sm bg-white">
        <thead class="bg-gray-100">
          <tr>
            {['ID','Nombre','Teléfono','Email','Fecha','Estado','Acciones'].map(h => (
              <th class="px-4 py-2 border">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} class="hover:bg-gray-50 transition">
              <td class="px-4 py-2 border">{r.id}</td>
              <td class="px-4 py-2 border">{r.nombre} {r.apellidos}</td>
              <td class="px-4 py-2 border">{r.telefono}</td>
              <td class="px-4 py-2 border">{r.email}</td>
              <td class="px-4 py-2 border">{r.fecha_hora_inicio}</td>
              <td class="px-4 py-2 border">{r.estado}</td>
              <td class="px-4 py-2 border text-center">
                <button
                  class="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded mr-2"
                  onClick={() => openEdit(r)}
                >
                  Editar
                </button>
                <button
                  class="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
                  onClick={async () => {
                    if (confirm(`¿Eliminar reserva ${r.id}?`)) {
                      const ok = await deleteReserva(r.id);
                      if (ok) setRows(rows.filter(x => x.id !== r.id));
                      else alert('No se pudo eliminar');
                    }
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
