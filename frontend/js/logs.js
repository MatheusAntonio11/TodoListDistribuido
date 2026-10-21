import { API_CONFIG, request } from "./api.js";

export function getLogs({ acao = "", page = 1, perPage = 8 } = {}) {
    const params = new URLSearchParams({ page, per_page: perPage });
    if (acao) params.set("acao", acao);
    return request(`${API_CONFIG.LARAVEL}/logs?${params}`);
}
