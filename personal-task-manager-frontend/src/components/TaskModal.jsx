import { useEffect, useState } from "react";
import { X } from "lucide-react";

const emptyForm = { title: "", description: "", dueDate: "", priority: "MEDIUM" };

export default function TaskModal({ open, onClose, onSave, task }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(task ? {
        title: task.title || "", description: task.description || "",
        dueDate: task.dueDate || "", priority: task.priority || "MEDIUM"
      } : emptyForm);
      setError("");
    }
  }, [open, task]);

  if (!open) return null;

  function change(e) {
    setForm(current => ({ ...current, [e.target.name]: e.target.value }));
  }
  async function submit(e) {
    e.preventDefault();
    if (!form.title.trim()) return setError("Please enter a task title.");
    if (form.title.trim().length > 100) return setError("Keep the title under 100 characters.");
    try {
      await onSave({ ...form, title: form.title.trim(), description: form.description.trim() });
      onClose();
    } catch (err) { setError(err.message || "Could not save this task."); }
  }

  return (
    <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-head">
          <div><p className="eyebrow">MAKE IT HAPPEN</p><h2 id="modal-title">{task ? "Edit task" : "Create a task"}</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close"><X size={19}/></button>
        </div>
        <form onSubmit={submit} className="task-form">
          <label>Task title<input autoFocus name="title" value={form.title} onChange={change} placeholder="What needs to get done?" maxLength="100"/></label>
          <label>Description <span className="optional">· optional</span><textarea name="description" value={form.description} onChange={change} rows="3" placeholder="Add a little detail..."/></label>
          <div className="form-row">
            <label>Due date<input type="date" name="dueDate" value={form.dueDate} onChange={change}/></label>
            <label>Priority<select name="priority" value={form.priority} onChange={change}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></label>
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions"><button type="button" className="button button-quiet" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit">{task ? "Save changes" : "Add task"}</button></div>
        </form>
      </section>
    </div>
  );
}
