// src/types.ts
export interface Reserva {
    id: number;
    nombre: string;
    apellidos: string;
    telefono: string;
    email: string;
    fecha_hora_inicio: string;
    estado: number;
}

export interface UserPayLoad {
    usuario: string;
    password: string;
}

export interface LoginRespuesta {
    success: boolean;
    message: string;
    token?: string;
}
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

export interface Slot {
  hour: string;
}

export interface DiaDisponible {
  fecha: string;
  horas_disponibles: Slot[];
}