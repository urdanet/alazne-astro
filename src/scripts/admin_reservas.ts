import axios from "axios";
import type { Reserva } from '@scripts/types.ts';

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

export async function createReserva(data: Partial<Reserva>): Promise<Reserva | null> {
  try {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;
    if (!token) throw new Error("No hay token de autenticación");

    const response = await axios.post(
      `http://localhost:8000/api/reservas`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    // asumimos que la API devuelve { data: {...} } o el objeto directo
    return response.data.data ?? response.data;
  } catch (error) {
    console.error("Error al crear reserva:", error);
    return null;
  }
}