const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== "false";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const STORAGE_KEY = "daymark-demo-tasks";

const starterTasks = [
  { id: 1, title: "Review Java collections notes", description: "Revise List, Set and Map with small examples.", dueDate: todayISO(), priority: "HIGH", completed: false },
  { id: 2, title: "Go for an evening walk", description: "A relaxed 25-minute walk after dinner.", dueDate: todayISO(), priority: "MEDIUM", completed: false },
  { id: 3, title: "Organise project folders", description: "Clean up old practice files and update README.", dueDate: tomorrowISO(), priority: "LOW", completed: true },
  { id: 4, title: "Practise SQL joins", description: "Solve five queries using INNER and LEFT JOIN.", dueDate: tomorrowISO(), priority: "MEDIUM", completed: false }
];

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function tomorrowISO() {
  const d = new Date(); d.setDate(d.getDate()+1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function readDemoTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(starterTasks));
  } catch { /* local storage may be unavailable */ }
  return starterTasks;
}
function writeDemoTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const taskApi = {
  async getAll() {
    if (USE_MOCK_API) return readDemoTasks();

    const response = await request("/api/tasks");

    return Array.isArray(response)
        ? response
        : response.content || [];
  },
  async create(task) {
    if (USE_MOCK_API) {
      const tasks = readDemoTasks();
      const created = { ...task, id: Date.now(), completed: false };
      writeDemoTasks([created, ...tasks]); return created;
    }
    return request("/api/tasks", { method: "POST", body: JSON.stringify(task) });
  },
  async update(id, task) {
    if (USE_MOCK_API) {
      const tasks = readDemoTasks().map(t => t.id === id ? { ...t, ...task } : t);
      writeDemoTasks(tasks); return tasks.find(t => t.id === id);
    }
    return request(`/api/tasks/${id}`, { method: "PUT", body: JSON.stringify(task) });
  },
  async remove(id) {
    if (USE_MOCK_API) {
      writeDemoTasks(readDemoTasks().filter(t => t.id !== id)); return;
    }
    return request(`/api/tasks/${id}`, { method: "DELETE" });
  }
};
