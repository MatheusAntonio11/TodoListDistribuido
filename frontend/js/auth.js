import { API_CONFIG, ROUTES, request } from "./api.js";

const USER_KEY = "todo_user";

const first = (data) => (Array.isArray(data) ? data[0] : data);

export function getUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) || null; }
    catch { return null; }
}

export async function login(email, senha) {
    const body = await request(`${API_CONFIG.EXPRESS}${ROUTES.login}`, {
        method: "POST",
        body: JSON.stringify({ email, senha })
    });
    const data = first(body.data) || {};
    const user = { nome: data.nome || data.user?.nome || email.split("@")[0] };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
}

export async function register(nome, email, senha) {
    await request(`${API_CONFIG.EXPRESS}${ROUTES.register}`, {
        method: "POST",
        body: JSON.stringify({ nome, email, senha })
    });
}

export async function logout() {
    try {
        await request(`${API_CONFIG.EXPRESS}${ROUTES.logout}`);
    } finally {
        localStorage.removeItem(USER_KEY);
    }
}
