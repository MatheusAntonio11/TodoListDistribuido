import { API_CONFIG, ROUTES, request } from "./api.js";

const base = () => `${API_CONFIG.EXPRESS}${ROUTES.todos}`;
const guard = { authRedirect: true };

const normalize = (t) => ({
    id: t.id,
    titulo: t.titulo ?? t.title ?? "",
    descricao: t.descricao ?? t.description ?? "",
    concluida: Boolean(t.concluida ?? t.completed)
});


export async function list(options = guard) {
    const body = await request(base(), {}, options);
    return (body.data || []).map(normalize);
}

export async function create(titulo, descricao) {
    return request(base(), {
        method: "POST",
        body: JSON.stringify({ titulo, descricao: descricao || null })
    }, guard);
}

export async function setCompleted(id, concluida) {
    return request(`${base()}/${id}`, {
        method: "PUT",
        body: JSON.stringify({ concluida, completed: concluida })
    }, guard);
}

export async function remove(id) {
    return request(`${base()}/${id}`, { method: "DELETE" }, guard);
}
