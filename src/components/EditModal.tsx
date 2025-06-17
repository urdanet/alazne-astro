export interface ReservaForm {
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  fecha_hora_inicio: string;
  estado: string;
}

interface EditModalProps {
  isOpen: boolean;
  form: ReservaForm;
  onChange: (field: keyof ReservaForm, value: string) => void;
  onCancel: () => void;
  onSave: (e: Event) => void;
}

export default function EditModal({
  isOpen,
  form,
  onChange,
  onCancel,
  onSave
}: EditModalProps): JSX.Element | null {
  if (!isOpen) return null;

  // Helper para formatear fecha inicial
  const formatDate = (f: string) => f.slice(0, 16);

  return (
    <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form
        class="bg-white p-6 rounded shadow-md w-full max-w-md"
        onSubmit={onSave}
      >
        <h2 class="text-lg font-bold mb-4">Editar Reserva</h2>

        {/** Para cada campo llamamos a onChange(field, value) **/}
        <label class="block mb-2">
          Nombre:
          <input
            class="border rounded px-2 py-1 w-full"
            value={form.nombre}
            onInput={e => onChange('nombre', (e.target as HTMLInputElement).value)}
          />
        </label>

        <label class="block mb-2">
          Apellidos:
          <input
            class="border rounded px-2 py-1 w-full"
            value={form.apellidos}
            onInput={e => onChange('apellidos', (e.target as HTMLInputElement).value)}
          />
        </label>

        <label class="block mb-2">
          Teléfono:
          <input
            class="border rounded px-2 py-1 w-full"
            value={form.telefono}
            onInput={e => onChange('telefono', (e.target as HTMLInputElement).value)}
          />
        </label>

        <label class="block mb-2">
          Email:
          <input
            class="border rounded px-2 py-1 w-full"
            value={form.email}
            onInput={e => onChange('email', (e.target as HTMLInputElement).value)}
          />
        </label>

        <label class="block mb-2">
          Fecha y hora:
          <input
            type="datetime-local"
            class="border rounded px-2 py-1 w-full"
            value={formatDate(form.fecha_hora_inicio)}
            onInput={e => onChange('fecha_hora_inicio', (e.target as HTMLInputElement).value)}
          />
        </label>

        <label class="block mb-2">
          Estado:
          <input
            class="border rounded px-2 py-1 w-full"
            value={form.estado}
            onInput={e => onChange('estado', (e.target as HTMLInputElement).value)}
          />
        </label>

        <div class="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            class="bg-gray-300 px-4 py-2 rounded"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="bg-primary-500 text-white px-4 py-2 rounded"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
