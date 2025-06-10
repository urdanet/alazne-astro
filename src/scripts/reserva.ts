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
