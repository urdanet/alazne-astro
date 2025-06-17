// src/columns.ts
import { createColumnHelper } from '@tanstack/table-core';
import type { Reserva } from '@scripts/types.ts';

const helper = createColumnHelper<Reserva>();

export const columns = [
  helper.accessor('id',             { header: 'ID' }),
  helper.accessor(r => `${r.nombre} ${r.apellidos}`, {
    id: 'nombre',
    header: 'Nombre completo'
  }),
  helper.accessor('telefono',       { header: 'Teléfono' }),
  helper.accessor('email',          { header: 'Email' }),
  helper.accessor('fecha_hora_inicio', {
    header: 'Fecha y hora',
    cell: info => info.getValue().slice(0,16)
  }),
  helper.accessor('estado',         { header: 'Estado' }),
];