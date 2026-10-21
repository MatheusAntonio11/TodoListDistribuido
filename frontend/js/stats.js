import { API_CONFIG, request } from "./api.js";

export function getStats() {
    return request(`${API_CONFIG.PYTHON}/stats`);
}
