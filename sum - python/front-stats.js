// Adicione ao seu front (api.js deve ter API_CONFIG.PYTHON = "http://localhost:8002")
export async function getStats() {
    const response = await fetch(`${API_CONFIG.PYTHON}/stats`, {
        credentials: "include"          // envia o cookie com o JWT
    });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return response.json();             // { usuarioId, total, concluidas, pendentes }
}
