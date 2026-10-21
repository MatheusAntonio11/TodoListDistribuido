import 'dotenv/config';

export async function enviarLog({ acao, detalhe, usuarioId = null, todoId = null }) {
  try {

    const response = await fetch(`${process.env.LOGS_URL}/api/internal/logs`, { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Key": process.env.LOGS_SERVICE_KEY,
      },
      body: JSON.stringify({ action: acao, message: detalhe, usuarioId, todoId }),
      signal: AbortSignal.timeout(3000),
    });

    const data = await response.json();
    console.log("Resposta do Laravel:", response.status, data);
  } catch (e) {
    console.error("Falha ao enviar log:", e.message);
  }
}