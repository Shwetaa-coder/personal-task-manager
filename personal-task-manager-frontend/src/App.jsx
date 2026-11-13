import { useEffect, useMemo, useState } from "react";
import { CheckCheck, CircleHelp, ClipboardList, ListTodo, Plus, Search, Sparkles, Target } from "lucide-react";
import { taskApi } from "./api/tasks";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";

const filters = ["All tasks", "Pending", "Completed"];
const today = new Date();
const dateLabel = today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All tasks");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTasks() {
    setLoading(true); setError("");
    try { setTasks(await taskApi.getAll()); }
    catch (err) { setError(err.message || "Could not load tasks."); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadTasks(); }, []);

  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;
  const visibleTasks = useMemo(() => tasks.filter(task => {
    const matchesFilter = filter === "All tasks" || (filter === "Pending" ? !task.completed : task.completed);
    const query = search.toLowerCase();
    return matchesFilter && `${task.title} ${task.description || ""}`.toLowerCase().includes(query);
  }), [tasks, filter, search]);

  async function saveTask(data) {
    if (editing) {
      const updated = await taskApi.update(editing.id, data);
      setTasks(current => current.map(t => t.id === editing.id ? { ...t, ...updated, ...data } : t));
    } else {
      const created = await taskApi.create(data);
      setTasks(current => [created, ...current]);
    }
    setEditing(null);
  }
  async function toggleTask(task) {
    const updated = { ...task, completed: !task.completed };
    try {
      await taskApi.update(task.id, updated);
      setTasks(current => current.map(t => t.id === task.id ? updated : t));
    } catch (err) { setError(err.message); }
  }
  async function deleteTask(task) {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try { await taskApi.remove(task.id); setTasks(current => current.filter(t => t.id !== task.id)); }
    catch (err) { setError(err.message); }
  }
  function openCreate() { setEditing(null); setModalOpen(true); }
  function openEdit(task) { setEditing(task); setModalOpen(true); }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#"><span className="brand-mark"><CheckCheck size={19}/></span><span>daymark<span className="brand-dot">.</span></span></a>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav">
          <button className="nav-item active"><ListTodo size={18}/> My tasks <span className="nav-count">{pending}</span></button>
          <button className="nav-item" onClick={() => setFilter("Pending")}><Target size={18}/> To do</button>
          <button className="nav-item" onClick={() => setFilter("Completed")}><CheckCheck size={18}/> Completed</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="tip-card"><span className="tip-icon"><Sparkles size={16}/></span><p className="tip-title">A little progress adds up.</p><p className="tip-copy">Keep showing up for the things that matter.</p></div>
          <div className="profile"><div className="avatar">Y</div><div><strong>Your workspace</strong><span>Personal account</span></div></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>My tasks</strong></div><div className="today-pill">{dateLabel}</div></header>
        <section className="content">
          <div className="welcome-row"><div><p className="eyebrow">YOUR PERSONAL SPACE</p><h1>Make room for <em>what matters.</em></h1><p className="subtitle">One thing at a time. You've got this.</p></div><button className="button button-primary add-top" onClick={openCreate}><Plus size={17}/> New task</button></div>

          <div className="stats-grid">
            <div className="stat-card"><div className="stat-icon lavender"><ClipboardList size={18}/></div><span className="stat-label">Total tasks</span><strong>{tasks.length}</strong><small>Everything on your list</small></div>
            <div className="stat-card"><div className="stat-icon peach"><CircleHelp size={18}/></div><span className="stat-label">Still to do</span><strong>{pending}</strong><small>Ready when you are</small></div>
            <div className="stat-card"><div className="stat-icon mint"><CheckCheck size={18}/></div><span className="stat-label">Completed</span><strong>{completed}</strong><small>Look at you go!</small></div>
          </div>

          <section className="tasks-section">
            <div className="section-heading"><div><p className="eyebrow">YOUR DAY, YOUR PACE</p><h2>Task list</h2></div><div className="progress-note">{tasks.length ? `${Math.round(completed / tasks.length * 100)}% complete` : "A fresh start"}</div></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${tasks.length ? completed / tasks.length * 100 : 0}%` }}/></div>
            <div className="toolbar"><div className="filter-tabs">{filters.map(item => <button key={item} className={filter === item ? "filter-tab selected" : "filter-tab"} onClick={() => setFilter(item)}>{item}</button>)}</div><label className="search-box"><Search size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..."/></label></div>

            {error && <div className="error-banner">{error} <button onClick={loadTasks}>Retry</button></div>}
            {loading ? <div className="empty-state"><div className="empty-icon">⌛</div><h3>Getting your tasks ready...</h3></div> :
              visibleTasks.length ? <div className="task-list">{visibleTasks.map(task => <TaskCard key={task.id} task={task} onToggle={toggleTask} onEdit={openEdit} onDelete={deleteTask}/>)}</div> :
              <div className="empty-state"><div className="empty-icon"><ListTodo size={24}/></div><h3>{search ? "No matching tasks" : filter === "Completed" ? "Nothing completed just yet" : filter === "Pending" ? "You're all caught up!" : "Your list is a blank canvas"}</h3><p>{search ? "Try a different search term." : "Add a task and take the first small step."}</p>{filter === "All tasks" && !search && <button className="button button-primary" onClick={openCreate}><Plus size={16}/> Add your first task</button>}</div>
            }
          </section>
          <footer className="footer-note">Made for a calmer, more focused day <span>✳</span></footer>
        </section>
      </main>
      <TaskModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={saveTask} task={editing}/>
    </div>
  );
}
