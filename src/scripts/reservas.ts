import axios from "axios";

export interface Reserva {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  fecha: string;
  estado: string;
}

export async function getReservas(): Promise<Reserva[]> {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No hay token de autenticación');

    const response = await axios.get("http://localhost:8000/api/reservas", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    throw error;
  }
}

export async function deleteReserva(id: number): Promise<boolean> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) throw new Error("No hay token de autenticación");
    await axios.delete(`http://localhost:8000/api/reservas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return true;
  } catch (error) {
    console.error(`Error al eliminar reserva ID ${id}:`, error);
    return false;
  }
}

export async function updateReserva(id: number, data: Partial<Reserva>): Promise<Reserva | null> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) throw new Error("No hay token de autenticación");
    const response = await axios.put(
      `http://localhost:8000/api/reservas/${id}`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar reserva ID ${id}:`, error);
    return null;
  }
}

function toBackendDatetime(dt: string) {
  // dt puede venir como "2025-06-16T10:00" o "2025-06-16T10:00:00.000000Z"
  if (!dt) return "";
  // Si ya está en formato correcto, no lo toques
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(dt)) return dt;
  // Si viene como "2025-06-16T10:00" o "2025-06-16T10:00:00.000000Z"
  const [date, time] = dt.split("T");
  if (!date || !time) return dt;
  return `${date} ${time.slice(0, 5)}`;
}

async function handleEditSubmit(e: Event) {
  e.preventDefault();
  if (!editReserva) return;

  // Prepara el objeto para el backend
  const dataToSend = {
    ...form,
    id: editReserva.id,
    fecha_hora_inicio: toBackendDatetime(form.fecha_hora_inicio || ""),
    // Asegúrate de que estado y status sean int si el backend lo espera así
    estado: Number(form.estado),
    status: Number(form.status),
  };

  const updated = await updateReserva(editReserva.id, dataToSend);
  if (updated) {
    setRows(rows!.map(r => r.id === updated.id ? updated : r));
    setShowModal(false);
  } else {
    alert("No se pudo actualizar la reserva");
  }
}