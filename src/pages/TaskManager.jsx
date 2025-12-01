// src/components/TaskManager.jsx
import React, { useMemo, useState } from "react";

/**
 * TaskManager.jsx
 * - Single-file React component using Tailwind
 * - Modal add-task form, pending & completed lists, simple tab/date nav
 *
 * Usage:
 *   import TaskManager from './components/TaskManager';
 *   <TaskManager />
 *
 * Tailwind must be configured in the project.
 */

const SAMPLE_TASKS = [
    { id: 1, title: "হাওয়া কনট্রাক্ট বিল", repeat: "Never", assign: "আমি", due: "2025-09-15", done: false },
    { id: 2, title: "রিপোর্ট চেক করা", repeat: "Weekly", assign: "সুমন", due: "2025-09-16", done: false },
    { id: 3, title: "কাস্টমার ফোন", repeat: "Never", assign: "তুমি", due: "2025-09-10", done: true },
];

export default function TaskManager() {
    const [tasks, setTasks] = useState(SAMPLE_TASKS);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState("week"); // today | week | month | all
    const [selectedDate, setSelectedDate] = useState(() => {
        // default today ISO yyyy-mm-dd
        const d = new Date();
        return d.toISOString().slice(0, 10);
    });

    // form state
    const [title, setTitle] = useState("");
    const [repeat, setRepeat] = useState("Never");
    const [assign, setAssign] = useState("আমি");
    const [due, setDue] = useState(selectedDate);

    const assignees = ["আমি", "সুমন", "নাহিদ", "রাকিব"];

    // filters for list
    const pending = useMemo(() => tasks.filter((t) => !t.done), [tasks]);
    const completed = useMemo(() => tasks.filter((t) => t.done), [tasks]);

    function openModal(prefill = {}) {
        setTitle(prefill.title || "");
        setRepeat(prefill.repeat || "Never");
        setAssign(prefill.assign || "আমি");
        setDue(prefill.due || selectedDate);
        setShowModal(true);
    }

    function clearForm() {
        setTitle("");
        setRepeat("Never");
        setAssign("আমি");
        setDue(selectedDate);
    }

    function addTask() {
        if (!title.trim()) {
            // simple validation
            alert("Task Name লাগবে 😀");
            return;
        }
        const newTask = {
            id: Date.now(),
            title: title.trim(),
            repeat,
            assign,
            due: due || null,
            done: false,
        };
        // optimistic update; replace with API call if needed
        setTasks((p) => [newTask, ...p]);
        clearForm();
        setShowModal(false);
    }

    function toggleDone(id) {
        setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    }

    function removeTask(id) {
        if (!confirm("টাস্ক মুছে ফেলবে?")) return;
        setTasks((p) => p.filter((t) => t.id !== id));
    }

    // sample counts for header cards (could be derived)
    const totalPending = pending.length;
    const totalCompleted = completed.length;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-4 gap-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => openModal()} className="px-4 py-2 bg-emerald-600 text-white rounded shadow-sm">+ Add Task</button>

                        <div className="flex items-center space-x-2 bg-white    rounded p-1 text-sm">
                            <button className={`px-3 py-1 rounded ${activeTab === "today" ? "bg-emerald-600 text-white" : ""}`} onClick={() => setActiveTab("today")}>Today</button>
                            <button className={`px-3 py-1 rounded ${activeTab === "week" ? "bg-emerald-600 text-white" : ""}`} onClick={() => setActiveTab("week")}>This Week</button>
                            <button className={`px-3 py-1 rounded ${activeTab === "month" ? "bg-emerald-600 text-white" : ""}`} onClick={() => setActiveTab("month")}>This Month</button>
                            <button className={`px-3 py-1 rounded ${activeTab === "all" ? "bg-emerald-600 text-white" : ""}`} onClick={() => setActiveTab("all")}>All</button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="p-2    rounded bg-white" />
                        <div className="text-sm text-gray-600">সিলেক্টেড: <span className="font-medium">{selectedDate}</span></div>
                    </div>
                </div>

                {/* Summary badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white    rounded p-4">
                        <div className="text-sm text-gray-500">Pending Tasks</div>
                        <div className="text-2xl font-semibold mt-2">{totalPending}</div>
                    </div>
                    <div className="bg-white    rounded p-4">
                        <div className="text-sm text-gray-500">Completed Tasks</div>
                        <div className="text-2xl font-semibold mt-2">{totalCompleted}</div>
                    </div>
                    <div className="bg-white    rounded p-4">
                        <div className="text-sm text-gray-500">Selected Date</div>
                        <div className="text-2xl font-semibold mt-2">{selectedDate}</div>
                    </div>
                </div>

                {/* Pending Tasks */}
                <div className="bg-white    rounded shadow-sm p-4 mb-6">
                    <h2 className="text-lg font-medium mb-3">Pending Tasks</h2>
                    {pending.length === 0 ? (
                        <div className="text-sm text-gray-500 p-6 text-center">No pending tasks</div>
                    ) : (
                        <ul className="space-y-2">
                            {pending.map((t) => (
                                <li key={t.id} className="flex items-center justify-between    rounded p-3">
                                    <div className="flex items-start gap-3">
                                        <input type="checkbox" checked={t.done} onChange={() => toggleDone(t.id)} className="mt-1" />
                                        <div>
                                            <div className="font-medium">{t.title}</div>
                                            <div className="text-xs text-gray-500 mt-1 flex gap-3">
                                                <span>🕓 {t.due || "-"}</span>
                                                <span>🔁 {t.repeat}</span>
                                                <span>👤 {t.assign}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button onClick={() => openModal(t)} className="px-2 py-1    rounded text-sm">Edit</button>
                                        <button onClick={() => removeTask(t.id)} className="px-2 py-1    rounded text-sm text-red-600">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Completed Tasks */}
                <div className="bg-white    rounded shadow-sm p-4">
                    <h2 className="text-lg font-medium mb-3">Completed Tasks</h2>
                    {completed.length === 0 ? (
                        <div className="text-sm text-gray-500 p-6 text-center">No completed tasks</div>
                    ) : (
                        <ul className="space-y-2">
                            {completed.map((t) => (
                                <li key={t.id} className="flex items-center justify-between    rounded p-3 bg-gray-50">
                                    <div className="flex items-start gap-3">
                                        <input type="checkbox" checked={t.done} onChange={() => toggleDone(t.id)} className="mt-1" />
                                        <div>
                                            <div className="font-medium line-through text-gray-500">{t.title}</div>
                                            <div className="text-xs text-gray-500 mt-1 flex gap-3">
                                                <span>🕓 {t.due || "-"}</span>
                                                <span>🔁 {t.repeat}</span>
                                                <span>👤 {t.assign}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button onClick={() => removeTask(t.id)} className="px-2 py-1    rounded text-sm text-red-600">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />

                    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl z-10">
                        <div className="flex items-center justify-between p-4   -b">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">📋</span>
                                <h3 className="text-lg font-medium">Add New Task</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded">✕</button>
                        </div>

                        <div className="p-4">
                            <label className="text-sm text-gray-600">Task Name</label>
                            <textarea
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Task Name"
                                className="w-full mt-2 p-3    rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-200"
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                                <div>
                                    <label className="text-sm text-gray-600 block">Repeat</label>
                                    <select value={repeat} onChange={(e) => setRepeat(e.target.value)} className="mt-2 p-2    rounded w-full">
                                        <option>Never</option>
                                        <option>Daily</option>
                                        <option>Weekly</option>
                                        <option>Monthly</option>
                                        <option>Yearly</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600 block">Assign</label>
                                    <select value={assign} onChange={(e) => setAssign(e.target.value)} className="mt-2 p-2    rounded w-full">
                                        {assignees.map((a) => <option key={a}>{a}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600 block">Due Date</label>
                                    <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="mt-2 p-2    rounded w-full" />
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-3">
                                <button onClick={() => { clearForm(); }} className="px-4 py-2    rounded">Clear</button>
                                <button onClick={addTask} className="px-4 py-2 bg-emerald-600 text-white rounded">Add Task</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
