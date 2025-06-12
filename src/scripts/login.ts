import axios from "axios";

export interface UserPayLoad {
    usuario: string;
    password: string;
}

export interface LoginRespuesta {
  success: boolean;
  message: string;
  token?: string;
  data?: any;
}

export async function login(payload: UserPayLoad): Promise<LoginRespuesta> {
  try {
    const response = await axios.post("http://localhost:8000/api/login", payload);
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
