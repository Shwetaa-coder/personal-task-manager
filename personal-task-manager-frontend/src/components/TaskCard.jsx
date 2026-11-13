import { CalendarDays, Check, Circle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

function prettyDate(value) {
  if (!value) return "No due date";
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <article className={`task-card ${task.completed ? "is-complete" : ""}`}>
      <button className={`check-button ${task.completed ? "checked" : ""}`} onClick={() => onToggle(task)} aria-label={task.completed ? "Mark pending" : "Mark completed"}>
        {task.completed ? <Check size={15}/> : <Circle size={19}/>}
      </button>
      <div className="task-content">
        <div className="task-title-row"><h3>{task.title}</h3><span className={`priority priority-${(task.priority || "MEDIUM").toLowerCase()}`}>{(task.priority || "MEDIUM").toLowerCase()}</span></div>
        {task.description && <p className="task-description">{task.description}</p>}
        <div className="task-meta"><span><CalendarDays size={13}/>{prettyDate(task.dueDate)}</span></div>
      </div>
      <div className="task-menu-wrap">
        <button className="icon-button task-more" onClick={() => setMenuOpen(v => !v)} aria-label="Task options"><MoreHorizontal size={19}/></button>
        {menuOpen && <><button className="menu-dismiss" onClick={() => setMenuOpen(false)} aria-label="Close menu"/><div className="task-menu"><button onClick={() => { setMenuOpen(false); onEdit(task); }}><Pencil size={14}/> Edit</button><button className="delete-action" onClick={() => { setMenuOpen(false); onDelete(task); }}><Trash2 size={14}/> Delete</button></div></>}
      </div>
    </article>
  );
}
