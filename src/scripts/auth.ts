import axios from "axios";

// Función para obtener el token de forma segura (solo en navegador)
function getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token') ?? null;
}

// Función para guardar el token de forma segura (solo en navegador)
function setStoredToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
}

// Función para eliminar el token de forma segura (solo en navegador)
function removeStoredToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
}

// Configurar el token por defecto si existe en localStorage
let token: string | null = null;
if (typeof window !== 'undefined') {
    token = getStoredToken();
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
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

export async function login(payload: UserPayLoad): Promise<LoginRespuesta> {
    try {
        const response = await axios.post("http://localhost:8000/api/login", payload);
        
        if (response.data.token) {
            // Guardar el token en localStorage
            setStoredToken(response.data.token);
            // Configurar el token por defecto para todas las peticiones
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return {
                success: false,
                message: error.response.data.message || "Error en la solicitud"
            };
        } else {
            return {
                success: false,
                message: "No se pudo conectar al servidor"
            };
        }
    }
}

export async function requireAuth(): Promise<boolean> {
    try {
        // Si estamos en el servidor, retornamos false
        if (typeof window === 'undefined') return false;

        const token = getStoredToken();
        console.log("Token:", token);
        if (!token) return false;
        console.log("Token:", token);

        const response = await axios.get("http://localhost:8000/api/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data?.success === true;
    } catch (err) {
        console.error("❌ Error en requireAuth:", err);
        return false;
    }
}

export function logout() {
    removeStoredToken();
    delete axios.defaults.headers.common['Authorization'];
}