export const API_CONFIG = {
    EXPRESS: "http://localhost:5050",       // API Node (tarefas + auth)
    LARAVEL: "http://localhost:8001/api",   // Serviço 2 - logs
    PYTHON:  "http://localhost:8002"        // Serviço 3 - estatísticas
};

export const ROUTES = {
    login:    "/auth/login",      
    register: "/auth/register",   
    logout:   "/auth/logout",     
    todos:    "/todos"            
};


export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

export const authEvents = new EventTarget();

export async function request(url, options = {}, { authRedirect = false } = {}) {
    let response;
    try {
        response = await fetch(url, {
            credentials: "include",
            ...options,
            headers: { "Content-Type": "application/json", ...(options.headers || {}) }
        });
    } catch {
        throw new ApiError("Não foi possível conectar ao serviço.", 0);
    }

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
        if (response.status === 401 && authRedirect) {
            authEvents.dispatchEvent(new Event("unauthorized"));
        }
        throw new ApiError(body.message || body.error || `Erro ${response.status}`, response.status);
    }
    return body;
}
