import { authEvents } from "./api.js";
import * as Auth from "./auth.js";
import * as Todos from "./todos.js";
import * as Stats from "./stats.js";
import * as Logs from "./logs.js";

const $ = (sel) => document.querySelector(sel);

function el(tag, props = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
        if (key === "class") node.className = value;
        else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
        else if (["checked", "disabled", "value"].includes(key)) node[key] = value;
        else node.setAttribute(key, value);
    }
    node.append(...children);
    return node;
}

function showMsg(target, text, type = "error") {
    if (!text) { target.hidden = true; return; }
    target.textContent = text;
    target.className = `msg ${type === "info" ? "info" : ""}`;
    target.hidden = false;
}

const LOG_LABELS = {
    TASK_CREATED: "Tarefa criada",
    TASK_COMPLETED: "Tarefa concluída",
    UNAUTHORIZED_ACCESS: "Acesso indevido",
    ERROR: "Erro"
};

let todos = [];
const logState = { page: 1, lastPage: 1, acao: "" };
let registerMode = false;

function showAuth(message, type = "error") {
    $("#app-view").hidden = true;
    $("#auth-view").hidden = false;
    showMsg($("#auth-msg"), message, type);
}

async function showApp() {
    $("#auth-view").hidden = true;
    $("#app-view").hidden = false;
    $("#user-name").textContent = Auth.getUser()?.nome || "usuário";
    await refreshAll();
}

function setAuthMode(register) {
    registerMode = register;
    $("#login-form").hidden = register;
    $("#register-form").hidden = !register;
    $("#auth-title").textContent = register ? "Criar conta" : "Entrar";
    $("#auth-toggle").textContent = register ? "Já tem conta? Entrar" : "Não tem conta? Cadastre-se";
    showMsg($("#auth-msg"), "");
}

async function loadTodos() {
    try {
        todos = await Todos.list();
        renderTodos();
    } catch (err) {
        if (err.status !== 401) showMsg($("#todo-msg"), err.message);
    }
}

function renderTodos() {
    const ul = $("#todo-list");
    ul.replaceChildren();

    if (!todos.length) {
        ul.append(el("li", { class: "empty" }, "Nenhuma tarefa ainda."));
        return;
    }

    for (const t of todos) {
        const body = el("div", { class: `todo-body ${t.concluida ? "done" : ""}` }, el("strong", {}, t.titulo));
        if (t.descricao) body.append(el("small", {}, t.descricao));

        ul.append(el("li", {},
            el("input", { type: "checkbox", checked: t.concluida, onchange: (e) => toggle(t, e.target) }),
            body,
            el("button", { class: "btn btn-danger", type: "button", onclick: () => removeTodo(t) }, "Excluir")
        ));
    }
}

async function toggle(todo, checkbox) {
    checkbox.disabled = true;
    try {
        await Todos.setCompleted(todo.id, !todo.concluida);
        await afterChange();
    } catch (err) {
        if (err.status !== 401) showMsg($("#todo-msg"), err.message);
        checkbox.checked = todo.concluida;
        checkbox.disabled = false;
    }
}

async function removeTodo(todo) {
    if (!confirm(`Excluir a tarefa "${todo.titulo}"?`)) return;
    try {
        await Todos.remove(todo.id);
        await afterChange();
    } catch (err) {
        if (err.status !== 401) showMsg($("#todo-msg"), err.message);
    }
}

async function afterChange() {
    await loadTodos();
    refreshStats();
    setTimeout(() => refreshLogs(), 700);
}

async function refreshStats() {
    try {
        const s = await Stats.getStats();
        $("#stat-total").textContent = s.total;
        $("#stat-concluidas").textContent = s.concluidas;
        $("#stat-pendentes").textContent = s.pendentes;
        $("#stat-bar").style.width = s.total ? `${Math.round((s.concluidas / s.total) * 100)}%` : "0%";
        showMsg($("#stats-msg"), "");
    } catch (err) {
        showMsg($("#stats-msg"), `Estatísticas indisponíveis: ${err.message}`);
    }
}

async function refreshLogs() {
    try {
        const res = await Logs.getLogs({ acao: logState.acao, page: logState.page });
        logState.lastPage = res.last_page || 1;
        renderLogs(res.data || []);
        $("#log-page").textContent = `${res.current_page || 1} / ${logState.lastPage}`;
        $("#log-prev").disabled = logState.page <= 1;
        $("#log-next").disabled = logState.page >= logState.lastPage;
        showMsg($("#log-msg"), "");
    } catch (err) {
        showMsg($("#log-msg"), `Logs indisponíveis: ${err.message}`);
    }
}

function renderLogs(items) {
    const tbody = $("#log-body");
    tbody.replaceChildren();

    if (!items.length) {
        tbody.append(el("tr", {}, el("td", { colspan: "3", class: "empty" }, "Nenhum registro.")));
        return;
    }

    for (const log of items) {
        tbody.append(el("tr", {},
            el("td", { class: "date" }, new Date(log.timestamp).toLocaleString("pt-BR")),
            el("td", {}, el("span", { class: `badge ${log.acao}` }, LOG_LABELS[log.acao] || log.acao)),
            el("td", {}, log.detalhe || "—")
        ));
    }
}

async function refreshAll() {
    await loadTodos();
    refreshStats();
    refreshLogs();
}

$("#auth-toggle").addEventListener("click", (e) => {
    e.preventDefault();
    setAuthMode(!registerMode);
});

$("#login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const btn = e.target.querySelector("button");
    btn.disabled = true;
    try {
        await Auth.login(form.get("email"), form.get("senha"));
        e.target.reset();
        await showApp();
    } catch (err) {
        if (err.status === 401 && (await hasSession())) {
            await showApp();
        } else {
            showMsg($("#auth-msg"), err.message);
        }
    } finally {
        btn.disabled = false;
    }
});

$("#register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const btn = e.target.querySelector("button");
    btn.disabled = true;
    try {
        await Auth.register(form.get("nome"), form.get("email"), form.get("senha"));
        await Auth.login(form.get("email"), form.get("senha"));
        e.target.reset();
        await showApp();
    } catch (err) {
        showMsg($("#auth-msg"), err.message);
    } finally {
        btn.disabled = false;
    }
});

$("#logout-btn").addEventListener("click", async () => {
    try { await Auth.logout(); } catch { /* segue para o login mesmo assim */ }
    todos = [];
    setAuthMode(false);
    showAuth("Você saiu da conta.", "info");
});

$("#todo-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const titulo = $("#todo-titulo").value.trim();
    if (!titulo) return;
    const btn = e.target.querySelector("button");
    btn.disabled = true;
    try {
        await Todos.create(titulo, $("#todo-descricao").value.trim());
        e.target.reset();
        showMsg($("#todo-msg"), "");
        await afterChange();
    } catch (err) {
        if (err.status !== 401) showMsg($("#todo-msg"), err.message);
    } finally {
        btn.disabled = false;
    }
});

$("#log-filter").addEventListener("change", (e) => {
    logState.acao = e.target.value;
    logState.page = 1;
    refreshLogs();
});
$("#log-refresh").addEventListener("click", refreshLogs);
$("#log-prev").addEventListener("click", () => { logState.page--; refreshLogs(); });
$("#log-next").addEventListener("click", () => { logState.page++; refreshLogs(); });

authEvents.addEventListener("unauthorized", () => showAuth("Sessão expirada. Entre novamente.", "info"));

async function hasSession() {
    try { await Todos.list({ authRedirect: false }); return true; }
    catch { return false; }
}

(async function init() {
    if (await hasSession()) await showApp();
    else showAuth("");
})();
