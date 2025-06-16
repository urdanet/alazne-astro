import axios from "axios";

export interface ReservaPayload {
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  fecha_hora_inicio: string; // formato: YYYY-MM-DD HH:mm
}

export interface ReservaRespuesta {
  success: boolean;
  message: string;
  data?: any;
}

interface Slot {
  hour: string;
}

interface DiaDisponible {
  fecha: string;
  horas_disponibles: Slot[];
}

export async function obtenerDiasDisponibles(): Promise<DiaDisponible[]> {
    const response = await fetch("http://localhost:8000/api/available-bookings");
    const json = await response.json();

  // Convertimos los valores del objeto en array
  const dias: DiaDisponible[] = Object.values(json.data);
  return dias;
  
}

export async function enviarReserva(payload: ReservaPayload): Promise<ReservaRespuesta> {
  try {
    const response = await axios.post("http://localhost:8000/api/booking", payload);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message || "Error en la solicitud",
        data: error.response.data
      };
    } else {
      return {
        success: false,
        message: "No se pudo conectar al servidor",
      };
    }
  }
}
