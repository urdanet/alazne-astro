// src/columns.ts
import { createColumnHelper } from '@tanstack/react-table';
import type { Reserva } from '@scripts/types.ts';

const columnHelper = createColumnHelper<Reserva>();

export const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: info => info.getValue().toString(),
  }),
  columnHelper.accessor(r => `${r.nombre} ${r.apellidos}`, {
    id: 'nombre',
    header: 'Nombre completo',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('telefono', {
    header: 'Teléfono',
  }),
  columnHelper.accessor('email', {
    header: 'Email',
  }),
  columnHelper.accessor('fecha_hora_inicio', {
    header: 'Fecha y hora',
    cell: info => info.getValue().slice(0, 16),
  }),
  columnHelper.accessor('estado', {
    header: 'Estado',
    cell: info => String(info.getValue()),
  }),
];