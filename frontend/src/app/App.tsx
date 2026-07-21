import { useState, useEffect, useRef, useCallback } from "react";
import {
  LayoutDashboard, Briefcase, BarChart3, User, Settings, Bell, Search,
  ChevronRight, MapPin, Calendar, Star, ArrowRight, TrendingUp, Clock,
  CheckCircle2, XCircle, AlertCircle, Zap, Trophy, Layers, Activity,
  LogOut, FileText, Upload, Mail, Phone, Github, Linkedin, Globe, Shield,
  Moon, Volume2, Smartphone, Plus, Filter, Eye, Edit3, Trash2, X,
  Building2, Award, Flame, Target, Home, ChevronDown, SortAsc, SortDesc,
  Check, AlertTriangle, Info, Download, RefreshCw, ExternalLink, Copy,
  Save, Camera, BookOpen, MoreVertical, ArrowUpRight, Inbox,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";

// ─── Types ─────────────────────────────────────────────────────────────────

interface Application {
  id: number;
  company: string;
  role: string;
  location: string;
  status: "Applied" | "Assessment" | "Interview" | "Offer" | "Rejected";
  priority: "High" | "Medium" | "Low";
  deadline: string;
  logo: string;
  logoColor: string;
  appliedDate: string;
  salary: string;
  notes: string;
  timeline: { stage: string; date: string; done: boolean; active: boolean }[];
}

interface Notification {
  id: number;
  type: "deadline" | "interview" | "offer" | "info";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

// ─── Initial Data ──────────────────────────────────────────────────────────

const INITIAL_APPS: Application[] = [
  {
    id: 1, company: "Stripe", role: "Software Engineer Intern", location: "San Francisco, CA",
    status: "Interview", priority: "High", deadline: "2026-08-05",
    logo: "S", logoColor: "from-violet-500 to-purple-600",
    appliedDate: "2026-07-01", salary: "$8,500/mo", notes: "Referral from alumni network",
    timeline: [
      { stage: "Applied", date: "Jul 1", done: true, active: false },
      { stage: "OA Sent", date: "Jul 8", done: true, active: false },
      { stage: "OA Submitted", date: "Jul 10", done: true, active: false },
      { stage: "Interview Scheduled", date: "Jul 18", done: true, active: false },
      { stage: "Technical Round", date: "Aug 5", done: false, active: true },
      { stage: "Offer", date: "TBD", done: false, active: false },
    ],
  },
  {
    id: 2, company: "Figma", role: "Product Design Intern", location: "Remote",
    status: "Applied", priority: "High", deadline: "2026-07-28",
    logo: "F", logoColor: "from-pink-500 to-rose-500",
    appliedDate: "2026-07-15", salary: "$7,200/mo", notes: "Design portfolio submitted",
    timeline: [
      { stage: "Applied", date: "Jul 15", done: true, active: false },
      { stage: "Screening", date: "TBD", done: false, active: true },
      { stage: "Design Challenge", date: "TBD", done: false, active: false },
      { stage: "Interview", date: "TBD", done: false, active: false },
      { stage: "Offer", date: "TBD", done: false, active: false },
    ],
  },
  {
    id: 3, company: "Notion", role: "Full Stack Intern", location: "New York, NY",
    status: "Assessment", priority: "Medium", deadline: "2026-07-25",
    logo: "N", logoColor: "from-gray-700 to-gray-900",
    appliedDate: "2026-07-10", salary: "$7,800/mo", notes: "Hackathon connection",
    timeline: [
      { stage: "Applied", date: "Jul 10", done: true, active: false },
      { stage: "OA Live", date: "Jul 22", done: false, active: true },
      { stage: "Interview", date: "TBD", done: false, active: false },
      { stage: "Offer", date: "TBD", done: false, active: false },
    ],
  },
  {
    id: 4, company: "Vercel", role: "DevRel Intern", location: "Remote",
    status: "Offer", priority: "High", deadline: "2026-07-30",
    logo: "V", logoColor: "from-slate-700 to-slate-900",
    appliedDate: "2026-06-20", salary: "$6,500/mo", notes: "Offer deadline July 30",
    timeline: [
      { stage: "Applied", date: "Jun 20", done: true, active: false },
      { stage: "Phone Screen", date: "Jun 28", done: true, active: false },
      { stage: "Technical", date: "Jul 5", done: true, active: false },
      { stage: "Final Round", date: "Jul 12", done: true, active: false },
      { stage: "Offer Received", date: "Jul 18", done: true, active: true },
    ],
  },
  {
    id: 5, company: "Linear", role: "Frontend Intern", location: "Remote",
    status: "Rejected", priority: "Low", deadline: "2026-07-10",
    logo: "L", logoColor: "from-indigo-500 to-blue-600",
    appliedDate: "2026-06-15", salary: "$7,000/mo", notes: "Rejected after technical round",
    timeline: [
      { stage: "Applied", date: "Jun 15", done: true, active: false },
      { stage: "Interview", date: "Jun 25", done: true, active: false },
      { stage: "Rejected", date: "Jul 2", done: true, active: true },
    ],
  },
  {
    id: 6, company: "Arc Browser", role: "iOS Engineer Intern", location: "New York, NY",
    status: "Interview", priority: "High", deadline: "2026-08-10",
    logo: "A", logoColor: "from-cyan-500 to-blue-500",
    appliedDate: "2026-07-12", salary: "$8,000/mo", notes: "Referred by campus ambassador",
    timeline: [
      { stage: "Applied", date: "Jul 12", done: true, active: false },
      { stage: "Phone Screen", date: "Jul 19", done: true, active: false },
      { stage: "Behavioral Round", date: "Aug 2", done: false, active: true },
      { stage: "Technical Round", date: "Aug 10", done: false, active: false },
      { stage: "Offer", date: "TBD", done: false, active: false },
    ],
  },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, type: "deadline", title: "Deadline approaching", body: "Notion application deadline in 5 days", time: "2h ago", read: false },
  { id: 2, type: "interview", title: "Interview tomorrow", body: "Stripe Technical Round — Aug 5 at 2:00 PM", time: "5h ago", read: false },
  { id: 3, type: "offer", title: "🎉 Offer received!", body: "Vercel sent you an offer. Review before Jul 30.", time: "2d ago", read: true },
  { id: 4, type: "info", title: "Profile incomplete", body: "Complete your profile to get better matches (68%)", time: "3d ago", read: true },
  { id: 5, type: "deadline", title: "Deadline approaching", body: "Figma application deadline in 8 days", time: "4d ago", read: true },
];

const LOGO_COLORS = [
  "from-violet-500 to-purple-600", "from-pink-500 to-rose-500",
  "from-indigo-500 to-blue-600", "from-cyan-500 to-blue-500",
  "from-emerald-500 to-green-600", "from-amber-500 to-orange-500",
  "from-slate-600 to-slate-800", "from-teal-500 to-cyan-600",
];

const weeklyData = [
  { week: "Jun W1", applied: 2, interviews: 0, offers: 0 },
  { week: "Jun W2", applied: 3, interviews: 1, offers: 0 },
  { week: "Jun W3", applied: 1, interviews: 2, offers: 0 },
  { week: "Jun W4", applied: 4, interviews: 1, offers: 1 },
  { week: "Jul W1", applied: 3, interviews: 3, offers: 0 },
  { week: "Jul W2", applied: 2, interviews: 2, offers: 1 },
  { week: "Jul W3", applied: 1, interviews: 3, offers: 0 },
];

const heatmapData = Array.from({ length: 7 }, () =>
  Array.from({ length: 12 }, () => ({
    value: Math.random() > 0.6 ? Math.floor(Math.random() * 4) + 1 : 0,
  }))
);

// ─── Helpers ───────────────────────────────────────────────────────────────

function statusConfig(status: string) {
  const map: Record<string, { color: string; bg: string; icon: any }> = {
    Applied:    { color: "text-blue-700",    bg: "bg-blue-50 border border-blue-200",     icon: FileText },
    Assessment: { color: "text-amber-700",   bg: "bg-amber-50 border border-amber-200",   icon: AlertCircle },
    Interview:  { color: "text-violet-700",  bg: "bg-violet-50 border border-violet-200", icon: Activity },
    Offer:      { color: "text-emerald-700", bg: "bg-emerald-50 border border-emerald-200", icon: Trophy },
    Rejected:   { color: "text-red-600",     bg: "bg-red-50 border border-red-200",       icon: XCircle },
  };
  return map[status] ?? map["Applied"];
}

function priorityConfig(p: string) {
  const map: Record<string, { color: string; dot: string }> = {
    High:   { color: "text-red-600",   dot: "bg-red-500" },
    Medium: { color: "text-amber-600", dot: "bg-amber-500" },
    Low:    { color: "text-slate-500", dot: "bg-slate-400" },
  };
  return map[p] ?? map["Low"];
}

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const t0 = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - t0) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return count;
}

function genTimeline(status: string): Application["timeline"] {
  const base = [
    { stage: "Applied", date: "Today", done: true, active: false },
    { stage: "Screening", date: "TBD", done: false, active: status !== "Applied" },
    { stage: "Interview", date: "TBD", done: false, active: status === "Interview" },
    { stage: "Offer", date: "TBD", done: false, active: status === "Offer" },
  ];
  if (status === "Assessment") { base[1].done = true; base[1].active = false; base[2].active = true; }
  if (status === "Offer") { base[1].done = true; base[2].done = true; base[3].done = true; base[3].active = true; }
  if (status === "Rejected") return [
    { stage: "Applied", date: "Today", done: true, active: false },
    { stage: "Rejected", date: "Today", done: true, active: true },
  ];
  return base;
}

// ─── Global CSS ────────────────────────────────────────────────────────────

const GLOBAL_CSS = `
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
@keyframes fadeSlideIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes slideInRight { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
@keyframes scaleIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
@keyframes spin { to{transform:rotate(360deg)} }
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:99px}
::-webkit-scrollbar-thumb:hover{background:#cbd5e1}
`;

// ─── Toast ─────────────────────────────────────────────────────────────────

interface ToastMsg { id: number; type: "success" | "error" | "info"; text: string }

function ToastContainer({ toasts, remove }: { toasts: ToastMsg[]; remove: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold animate-[slideInRight_0.25s_ease]"
          style={{
            background: t.type === "success" ? "#22C55E" : t.type === "error" ? "#EF4444" : "#4F46E5",
            color: "#fff",
            fontFamily: "Plus Jakarta Sans, sans-serif",
          }}
        >
          {t.type === "success" && <CheckCircle2 size={16} />}
          {t.type === "error" && <XCircle size={16} />}
          {t.type === "info" && <Info size={16} />}
          {t.text}
          <button onClick={() => remove(t.id)} className="ml-2 opacity-70 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const push = useCallback((type: ToastMsg["type"], text: string) => {
    const id = Date.now();
    setToasts(p => [...p, { id, type, text }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);
  const remove = useCallback((id: number) => setToasts(p => p.filter(t => t.id !== id)), []);
  return { toasts, push, remove };
}

// ─── Confirm Dialog ────────────────────────────────────────────────────────

function ConfirmDialog({
  title, body, danger, onConfirm, onCancel,
}: { title: string; body: string; danger?: boolean; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 animate-[scaleIn_0.2s_ease]">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${danger ? "bg-red-50" : "bg-indigo-50"}`}>
          <AlertTriangle size={22} className={danger ? "text-red-500" : "text-indigo-500"} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{title}</h3>
        <p className="text-sm text-slate-500 mb-6" style={{ fontFamily: "Inter, sans-serif" }}>{body}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] shadow-md ${
              danger ? "bg-gradient-to-r from-red-500 to-rose-600 shadow-red-200" : "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-200"
            }`}
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Floating Shapes ───────────────────────────────────────────────────────

function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-80px] right-[-80px] w-[420px] h-[420px] rounded-full bg-gradient-to-br from-indigo-300/30 to-purple-300/20 blur-3xl" style={{ animation: "float 8s ease-in-out infinite" }} />
      <div className="absolute top-[30%] left-[-120px] w-[320px] h-[320px] rounded-full bg-gradient-to-br from-sky-300/25 to-cyan-300/20 blur-3xl" style={{ animation: "float 10s ease-in-out infinite 2s" }} />
      <div className="absolute bottom-[-60px] right-[20%] w-[280px] h-[280px] rounded-full bg-gradient-to-br from-violet-300/25 to-pink-300/20 blur-3xl" style={{ animation: "float 9s ease-in-out infinite 4s" }} />
      <div className="absolute top-[15%] left-[12%] w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400/40 to-purple-400/30 rotate-12" style={{ animation: "spin 20s linear infinite" }} />
      <div className="absolute top-[60%] right-[15%] w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400/40 to-cyan-400/30" style={{ animation: "spin 25s linear infinite reverse" }} />
      <div className="absolute top-[75%] left-[20%] w-6 h-6 rounded-lg bg-gradient-to-br from-pink-400/40 to-rose-400/30 rotate-45" style={{ animation: "float 6s ease-in-out infinite 3s" }} />
    </div>
  );
}

// ─── CircleProgress ────────────────────────────────────────────────────────

function CircleProgress({ value, size = 80, stroke = 8, color = "#4F46E5", bg = "#e0e7ff", label }: {
  value: number; size?: number; stroke?: number; color?: string; bg?: string; label?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={circ - (value / 100) * circ}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
        </svg>
        <span className="absolute text-xs font-bold" style={{ color, fontFamily: "DM Mono, monospace" }}>{value}%</span>
      </div>
      {label && <span className="text-xs font-semibold text-slate-500" style={{ fontFamily: "DM Mono, monospace" }}>{label}</span>}
    </div>
  );
}

// ─── Toggle ────────────────────────────────────────────────────────────────

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
        value ? "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md shadow-indigo-200" : "bg-slate-200"
      }`}
    >
      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${value ? "translate-x-6" : ""}`} />
    </button>
  );
}

// ─── Application Form Modal ────────────────────────────────────────────────

const STATUSES = ["Applied", "Assessment", "Interview", "Offer", "Rejected"] as const;
const PRIORITIES = ["High", "Medium", "Low"] as const;

function AppFormModal({
  initial, onSave, onClose, title,
}: {
  initial?: Partial<Application>;
  onSave: (data: Omit<Application, "id" | "timeline">) => void;
  onClose: () => void;
  title: string;
}) {
  const [form, setForm] = useState({
    company: initial?.company ?? "",
    role: initial?.role ?? "",
    location: initial?.location ?? "",
    status: initial?.status ?? "Applied",
    priority: initial?.priority ?? "Medium",
    deadline: initial?.deadline ?? "",
    salary: initial?.salary ?? "",
    notes: initial?.notes ?? "",
    logoColor: initial?.logoColor ?? LOGO_COLORS[0],
    appliedDate: initial?.appliedDate ?? new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.company.trim()) e.company = "Company name required";
    if (!form.role.trim()) e.role = "Role required";
    if (!form.deadline) e.deadline = "Deadline required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      ...form,
      logo: form.company.charAt(0).toUpperCase(),
      status: form.status as Application["status"],
      priority: form.priority as Application["priority"],
    });
  };

  const inputCls = (field: string) =>
    `w-full px-4 py-3 rounded-xl border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all ${
      errors[field] ? "border-red-300" : "border-slate-200"
    }`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg my-4 animate-[scaleIn_0.25s_ease]">
        <div className="flex items-center justify-between p-7 pb-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{title}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500"><X size={18} /></button>
        </div>
        <div className="p-7 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1.5" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Company *</label>
              <input className={inputCls("company")} placeholder="e.g. Google" value={form.company} onChange={e => set("company", e.target.value)} style={{ fontFamily: "Inter, sans-serif" }} />
              {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1.5" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Role *</label>
              <input className={inputCls("role")} placeholder="e.g. Software Engineer Intern" value={form.role} onChange={e => set("role", e.target.value)} style={{ fontFamily: "Inter, sans-serif" }} />
              {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Location</label>
              <input className={inputCls("location")} placeholder="City, State or Remote" value={form.location} onChange={e => set("location", e.target.value)} style={{ fontFamily: "Inter, sans-serif" }} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Salary</label>
              <input className={inputCls("salary")} placeholder="e.g. $7,500/mo" value={form.salary} onChange={e => set("salary", e.target.value)} style={{ fontFamily: "Inter, sans-serif" }} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Status</label>
              <select className={inputCls("status")} value={form.status} onChange={e => set("status", e.target.value)} style={{ fontFamily: "Inter, sans-serif" }}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Priority</label>
              <select className={inputCls("priority")} value={form.priority} onChange={e => set("priority", e.target.value)} style={{ fontFamily: "Inter, sans-serif" }}>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Deadline *</label>
              <input type="date" className={inputCls("deadline")} value={form.deadline} onChange={e => set("deadline", e.target.value)} style={{ fontFamily: "Inter, sans-serif" }} />
              {errors.deadline && <p className="text-xs text-red-500 mt-1">{errors.deadline}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Applied Date</label>
              <input type="date" className={inputCls("appliedDate")} value={form.appliedDate} onChange={e => set("appliedDate", e.target.value)} style={{ fontFamily: "Inter, sans-serif" }} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1.5" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Logo Color</label>
              <div className="flex flex-wrap gap-2">
                {LOGO_COLORS.map(c => (
                  <button key={c} onClick={() => set("logoColor", c)}
                    className={`w-8 h-8 rounded-xl bg-gradient-to-br ${c} transition-all ${form.logoColor === c ? "ring-2 ring-offset-2 ring-indigo-500 scale-110" : "hover:scale-105"}`}
                  />
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1.5" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Notes</label>
              <textarea
                rows={3}
                className={`${inputCls("notes")} resize-none`}
                placeholder="Any extra context..."
                value={form.notes}
                onChange={e => set("notes", e.target.value)}
                style={{ fontFamily: "Inter, sans-serif" }}
              />
            </div>
          </div>
        </div>
        <div className="p-7 pt-5 border-t border-slate-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md shadow-indigo-200 hover:shadow-lg hover:scale-[1.02] transition-all"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            <Save size={14} className="inline mr-2" />
            {title.startsWith("Edit") ? "Save Changes" : "Add Application"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Timeline Modal ────────────────────────────────────────────────────────

function TimelineModal({ app, onClose }: { app: Application; onClose: () => void }) {
  const sc = statusConfig(app.status);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-[scaleIn_0.25s_ease]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.logoColor} flex items-center justify-center text-white font-extrabold text-2xl shadow-xl`}>{app.logo}</div>
          <div>
            <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{app.company}</h2>
            <p className="text-slate-500 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>{app.role}</p>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold mt-1.5 px-2.5 py-1 rounded-full ${sc.bg} ${sc.color}`}>{app.status}</span>
          </div>
          <button onClick={onClose} className="ml-auto p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"><X size={18} /></button>
        </div>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-300 to-slate-100" />
          <div className="space-y-6 pl-12">
            {app.timeline.map((step, i) => (
              <div key={i} className="relative">
                <div className={`absolute -left-12 w-8 h-8 rounded-xl flex items-center justify-center border-2 ${
                  step.done ? "bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400"
                  : step.active ? "bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300"
                  : "bg-white border-slate-200"
                }`}>
                  {step.done ? <CheckCircle2 size={14} className="text-white" />
                  : step.active ? <Clock size={12} className="text-white" />
                  : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                </div>
                <div className={step.active ? "bg-amber-50 border border-amber-100 rounded-2xl p-4" : "py-1"}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${step.done ? "text-slate-900" : step.active ? "text-amber-800" : "text-slate-400"}`} style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                      {step.stage}
                    </span>
                    <span className={`text-xs font-medium ${step.active ? "text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full" : "text-slate-400"}`} style={{ fontFamily: "DM Mono, monospace" }}>
                      {step.date}
                    </span>
                  </div>
                  {step.active && <p className="text-xs text-amber-700 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>Currently at this stage</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-slate-100">
          <div className="text-center">
            <div className="text-xs text-slate-400 mb-1" style={{ fontFamily: "DM Mono, monospace" }}>Deadline</div>
            <div className="text-sm font-bold text-slate-800" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{app.deadline}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-400 mb-1" style={{ fontFamily: "DM Mono, monospace" }}>Salary</div>
            <div className="text-sm font-bold text-slate-800" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{app.salary || "—"}</div>
          </div>
        </div>
        <button onClick={onClose} className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Notification Panel ────────────────────────────────────────────────────

function NotifPanel({
  notifs, onRead, onReadAll, onClose,
}: {
  notifs: Notification[];
  onRead: (id: number) => void;
  onReadAll: () => void;
  onClose: () => void;
}) {
  const icons: Record<Notification["type"], { icon: any; color: string; bg: string }> = {
    deadline: { icon: Clock,        color: "text-orange-600", bg: "bg-orange-50" },
    interview:{ icon: Activity,     color: "text-violet-600", bg: "bg-violet-50" },
    offer:    { icon: Trophy,       color: "text-emerald-600",bg: "bg-emerald-50" },
    info:     { icon: Info,         color: "text-blue-600",   bg: "bg-blue-50" },
  };
  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-[90]" onClick={onClose}>
      <div
        className="absolute right-4 top-16 w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-[slideInRight_0.2s_ease]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Notifications</h3>
            {unread > 0 && <span className="text-xs font-bold px-2 py-0.5 bg-indigo-600 text-white rounded-full">{unread}</span>}
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button onClick={onReadAll} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                Mark all read
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><X size={16} /></button>
          </div>
        </div>
        <div className="max-h-[420px] overflow-y-auto">
          {notifs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Inbox size={36} className="mb-3 opacity-40" />
              <p className="text-sm font-medium" style={{ fontFamily: "Inter, sans-serif" }}>All caught up!</p>
            </div>
          ) : notifs.map(n => {
            const cfg = icons[n.type];
            const Icon = cfg.icon;
            return (
              <div
                key={n.id}
                onClick={() => onRead(n.id)}
                className={`flex items-start gap-3 px-5 py-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${!n.read ? "bg-indigo-50/40" : ""}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                  <Icon size={16} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${n.read ? "text-slate-700" : "text-slate-900"}`} style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{n.title}</p>
                    {!n.read && <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>{n.body}</p>
                  <p className="text-xs text-slate-400 mt-1" style={{ fontFamily: "DM Mono, monospace" }}>{n.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── User Menu ─────────────────────────────────────────────────────────────

function UserMenu({ onClose, onNavigate, onExit }: { onClose: () => void; onNavigate: (v: string) => void; onExit: () => void }) {
  return (
    <div className="fixed inset-0 z-[90]" onClick={onClose}>
      <div
        className="absolute right-4 top-16 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-[scaleIn_0.15s_ease]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">AK</div>
            <div>
              <p className="text-sm font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Aiden Kim</p>
              <p className="text-xs text-slate-500" style={{ fontFamily: "Inter, sans-serif" }}>aiden.kim@mit.edu</p>
            </div>
          </div>
        </div>
        {[
          { icon: User,     label: "View Profile", view: "profile" },
          { icon: Settings, label: "Settings",     view: "settings" },
          { icon: BookOpen, label: "Help & Docs",  view: null },
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => { onClose(); if (item.view) onNavigate(item.view); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-50"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              <Icon size={16} className="text-slate-400" />
              {item.label}
            </button>
          );
        })}
        <button
          onClick={() => { onClose(); onExit(); }}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ─── Top Bar ───────────────────────────────────────────────────────────────

function TopBar({
  title, subtitle, search, onSearch, onNotifClick, onAvatarClick,
  notifCount, children,
}: {
  title: string;
  subtitle?: string;
  search?: string;
  onSearch?: (v: string) => void;
  onNotifClick?: () => void;
  onAvatarClick?: () => void;
  notifCount?: number;
  children?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>{subtitle}</p>}
        {children}
      </div>
      <div className="flex items-center gap-3">
        {onSearch !== undefined && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              value={search}
              onChange={e => onSearch(e.target.value)}
              placeholder="Search..."
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm w-52 transition-all"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
          </div>
        )}
        <button
          onClick={onNotifClick}
          className="relative p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Bell size={18} className="text-slate-500" />
          {(notifCount ?? 0) > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border border-white">{notifCount}</span>
          )}
        </button>
        <button
          onClick={onAvatarClick}
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm hover:scale-105 transition-transform shadow-md shadow-indigo-200"
        >
          AK
        </button>
      </div>
    </header>
  );
}

// ─── Metric Card ───────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, gradient, icon: Icon, trend }: {
  label: string; value: number; sub: string; gradient: string; icon: any; trend?: string;
}) {
  const count = useCountUp(value);
  return (
    <div className={`relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br ${gradient} text-white shadow-xl hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 cursor-default`}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-6 translate-x-6" />
      <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/10 translate-y-4 -translate-x-4" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-white/20 rounded-xl"><Icon size={20} className="text-white" /></div>
          {trend && <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full">{trend}</span>}
        </div>
        <div className="text-4xl font-extrabold mb-1" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{count}</div>
        <div className="text-white/80 text-sm font-semibold" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{label}</div>
        <div className="text-white/60 text-xs mt-1" style={{ fontFamily: "Inter, sans-serif" }}>{sub}</div>
      </div>
    </div>
  );
}

// ─── Application Card ──────────────────────────────────────────────────────

function ApplicationCard({
  app, onView, onEdit, onDelete,
}: {
  app: Application;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const sc = statusConfig(app.status);
  const StatusIcon = sc.icon;
  const pc = priorityConfig(app.priority);
  const days = daysUntil(app.deadline);
  const urgent = days >= 0 && days <= 7;
  const passed = days < 0;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 hover:scale-[1.02] transition-all duration-300 group flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.logoColor} flex items-center justify-center text-white font-extrabold text-lg shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
          {app.logo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{app.company}</h3>
              <p className="text-sm text-slate-500 mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>{app.role}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0 ${sc.bg} ${sc.color}`}>
              <StatusIcon size={11} />{app.status}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {app.location && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500" style={{ fontFamily: "Inter, sans-serif" }}>
            <MapPin size={11} className="text-slate-400" />{app.location}
          </div>
        )}
        {app.salary && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500" style={{ fontFamily: "DM Mono, monospace" }}>
            <TrendingUp size={11} className="text-slate-400" />{app.salary}
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${pc.dot}`} />
          <span className={`text-xs font-semibold ${pc.color}`} style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{app.priority}</span>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${passed ? "text-red-600" : urgent ? "text-orange-600" : "text-slate-500"}`} style={{ fontFamily: "DM Mono, monospace" }}>
          <Calendar size={11} />{passed ? "Passed" : `${days}d left`}
        </div>
      </div>
      {/* Mini timeline */}
      <div className="flex items-center gap-1 mb-4">
        {app.timeline.map((t, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${t.done ? "bg-indigo-500" : t.active ? "bg-amber-400 ring-2 ring-amber-200" : "bg-slate-200"}`} />
            {i < app.timeline.length - 1 && <div className={`flex-1 h-0.5 ${t.done ? "bg-indigo-300" : "bg-slate-100"}`} />}
          </div>
        ))}
      </div>
      {app.notes && <p className="text-xs text-slate-400 italic mb-4 flex-1" style={{ fontFamily: "Inter, sans-serif" }}>"{app.notes}"</p>}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-50 mt-auto">
        <button onClick={onView} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-xl hover:bg-indigo-100 transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          <Eye size={13} /> Timeline
        </button>
        <button onClick={onEdit} className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
          <Edit3 size={14} />
        </button>
        <button onClick={onDelete} className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard View ────────────────────────────────────────────────────────

function DashboardView({
  apps, setActive, topBarProps,
}: {
  apps: Application[];
  setActive: (v: string) => void;
  topBarProps: any;
}) {
  const total = apps.length;
  const counts = {
    applied:    apps.filter(a => a.status === "Applied").length,
    assessment: apps.filter(a => a.status === "Assessment").length,
    interview:  apps.filter(a => a.status === "Interview").length,
    offer:      apps.filter(a => a.status === "Offer").length,
  };
  const responseRate = total > 0 ? Math.round(((counts.assessment + counts.interview + counts.offer) / total) * 100) : 0;

  const upcoming = [...apps]
    .filter(a => daysUntil(a.deadline) >= 0 && a.status !== "Rejected" && a.status !== "Offer")
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <TopBar title="Dashboard" subtitle={`Welcome back, Aiden! ${counts.interview} active interview${counts.interview !== 1 ? "s" : ""} this week.`} {...topBarProps} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard label="Total Applied" value={total} sub={`Across ${new Set(apps.map(a => a.company)).size} companies`} gradient="from-indigo-500 via-indigo-600 to-purple-700" icon={Briefcase} trend={`↑ ${Math.min(total, 4)} this week`} />
        <MetricCard label="In Interview" value={counts.interview} sub="Rounds scheduled" gradient="from-violet-500 via-purple-600 to-pink-600" icon={Activity} />
        <MetricCard label="Offers Received" value={counts.offer} sub={counts.offer > 0 ? "Review deadlines" : "Keep applying!"} gradient="from-emerald-400 via-green-500 to-teal-500" icon={Trophy} trend={counts.offer > 0 ? "🎉 Active" : undefined} />
        <MetricCard label="Response Rate" value={responseRate} sub="Percentage of responses" gradient="from-sky-400 via-cyan-500 to-blue-600" icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Career Progress */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Career Progress</h3>
            <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-3 py-1 rounded-full">Summer 2026</span>
          </div>
          <div className="flex items-center justify-around mb-6">
            <CircleProgress value={total > 0 ? Math.round((counts.interview / total) * 100) : 0} size={72} stroke={7} color="#4F46E5" bg="#e0e7ff" label="Interview" />
            <CircleProgress value={total > 0 ? Math.round((counts.offer / total) * 100) : 0} size={72} stroke={7} color="#22C55E" bg="#dcfce7" label="Offer Rate" />
            <CircleProgress value={responseRate} size={72} stroke={7} color="#F59E0B" bg="#fef3c7" label="Response" />
          </div>
          <div className="space-y-3">
            {[
              { label: "Applied",    count: counts.applied,    color: "bg-blue-500",    pct: total > 0 ? (counts.applied / total) * 100 : 0 },
              { label: "Assessment", count: counts.assessment, color: "bg-amber-500",   pct: total > 0 ? (counts.assessment / total) * 100 : 0 },
              { label: "Interview",  count: counts.interview,  color: "bg-violet-500",  pct: total > 0 ? (counts.interview / total) * 100 : 0 },
              { label: "Offer",      count: counts.offer,      color: "bg-emerald-500", pct: total > 0 ? (counts.offer / total) * 100 : 0 },
            ].map(row => (
              <div key={row.label}>
                <div className="flex justify-between text-xs text-slate-600 mb-1" style={{ fontFamily: "DM Mono, monospace" }}>
                  <span>{row.label}</span><span className="font-semibold">{row.count}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${row.color} rounded-full`} style={{ width: `${row.pct}%`, transition: "width 1s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Upcoming Deadlines</h3>
            <Clock size={16} className="text-slate-400" />
          </div>
          {upcoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <CheckCircle2 size={32} className="mb-2 opacity-40" />
              <p className="text-sm" style={{ fontFamily: "Inter, sans-serif" }}>No upcoming deadlines</p>
            </div>
          ) : upcoming.map((a, i) => {
            const d = daysUntil(a.deadline);
            const urgent = d <= 7;
            return (
              <div key={a.id} className={`flex items-center gap-3 p-3 rounded-2xl mb-3 cursor-pointer hover:scale-[1.02] transition-all ${urgent ? "bg-red-50 border border-red-100" : "bg-slate-50"}`}
                onClick={() => setActive("applications")}>
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${urgent ? "bg-red-500" : "bg-indigo-400"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{a.company}</div>
                  <div className="text-xs text-slate-500 truncate" style={{ fontFamily: "Inter, sans-serif" }}>{a.role}</div>
                </div>
                <div className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${urgent ? "bg-red-500 text-white" : "bg-slate-200 text-slate-600"}`} style={{ fontFamily: "DM Mono, monospace" }}>
                  {d}d
                </div>
              </div>
            );
          })}
          {upcoming.length === 0 && null}
        </div>

        {/* Dream Companies */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Dream Companies</h3>
            <Star size={16} className="text-amber-400 fill-amber-400" />
          </div>
          {[
            { name: "OpenAI",    logo: "O",  color: "from-emerald-400 to-teal-500",  match: 92, status: "Watching" },
            { name: "Anthropic", logo: "An", color: "from-orange-400 to-amber-500",  match: 88, status: "Watching" },
            { name: "Spotify",   logo: "Sp", color: "from-green-400 to-emerald-500", match: 85, status: "Applied" },
            { name: "Airbnb",    logo: "Ai", color: "from-rose-400 to-pink-500",     match: 79, status: "Watching" },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 cursor-pointer hover:scale-[1.02] transition-all mb-2">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0`}>{c.logo}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{c.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${c.color} rounded-full`} style={{ width: `${c.match}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-600" style={{ fontFamily: "DM Mono, monospace" }}>{c.match}%</span>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${c.status === "Applied" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{c.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity chart */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Weekly Activity</h3>
            <p className="text-sm text-slate-500" style={{ fontFamily: "Inter, sans-serif" }}>Applications, interviews and offers over time</p>
          </div>
          <div className="flex gap-4">
            {[{ label: "Applied", color: "bg-indigo-500" }, { label: "Interviews", color: "bg-purple-500" }, { label: "Offers", color: "bg-emerald-500" }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                <span className="text-xs text-slate-600" style={{ fontFamily: "DM Mono, monospace" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={weeklyData}>
            <defs>
              {[["gA","#4F46E5"],["gI","#8B5CF6"],["gO","#22C55E"]].map(([id,c]) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={c} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={c} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fontFamily: "DM Mono, monospace", fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fontFamily: "DM Mono, monospace", fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "12px", fontFamily: "DM Mono, monospace" }} />
            <Area type="monotone" dataKey="applied" stroke="#4F46E5" strokeWidth={2.5} fill="url(#gA)" dot={{ fill: "#4F46E5", r: 4 }} />
            <Area type="monotone" dataKey="interviews" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#gI)" dot={{ fill: "#8B5CF6", r: 4 }} />
            <Area type="monotone" dataKey="offers" stroke="#22C55E" strokeWidth={2.5} fill="url(#gO)" dot={{ fill: "#22C55E", r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent apps */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Recent Applications</h3>
          <button onClick={() => setActive("applications")} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="space-y-3">
          {apps.slice(0, 4).map(app => {
            const sc = statusConfig(app.status);
            const StatusIcon = sc.icon;
            return (
              <div key={app.id} onClick={() => setActive("applications")} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 cursor-pointer hover:scale-[1.01] transition-all">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${app.logoColor} flex items-center justify-center text-white font-extrabold text-sm shadow-md flex-shrink-0`}>{app.logo}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{app.company}</div>
                  <div className="text-xs text-slate-500" style={{ fontFamily: "Inter, sans-serif" }}>{app.role} · {app.location}</div>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${sc.bg} ${sc.color}`}>
                  <StatusIcon size={11} />{app.status}
                </span>
              </div>
            );
          })}
          {apps.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Briefcase size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm" style={{ fontFamily: "Inter, sans-serif" }}>No applications yet. Add your first one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Applications View ─────────────────────────────────────────────────────

function ApplicationsView({
  apps, onAdd, onEdit, onDelete, topBarProps,
}: {
  apps: Application[];
  onAdd: () => void;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
  topBarProps: any;
}) {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState<"deadline" | "priority" | "company" | "status">("deadline");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [viewApp, setViewApp] = useState<Application | null>(null);
  const [showSort, setShowSort] = useState(false);

  const priorityOrder = { High: 0, Medium: 1, Low: 2 };
  const statusOrder = { Interview: 0, Assessment: 1, Applied: 2, Offer: 3, Rejected: 4 };

  const filtered = apps
    .filter(a => {
      if (filter !== "All" && a.status !== filter) return false;
      if (topBarProps.search) {
        const q = topBarProps.search.toLowerCase();
        return a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q) || a.location.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sort === "deadline")  cmp = daysUntil(a.deadline) - daysUntil(b.deadline);
      if (sort === "priority")  cmp = (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2);
      if (sort === "company")   cmp = a.company.localeCompare(b.company);
      if (sort === "status")    cmp = (statusOrder[a.status] ?? 5) - (statusOrder[b.status] ?? 5);
      return sortDir === "asc" ? cmp : -cmp;
    });

  const toggleSort = (s: typeof sort) => {
    if (sort === s) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSort(s); setSortDir("asc"); }
    setShowSort(false);
  };

  return (
    <div>
      <TopBar
        title="Applications"
        subtitle={`Tracking ${apps.length} application${apps.length !== 1 ? "s" : ""}`}
        {...topBarProps}
      />
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex items-center gap-2 flex-wrap">
          {["All", "Applied", "Assessment", "Interview", "Offer", "Rejected"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                filter === s
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {s}
              {s !== "All" && <span className={`ml-1.5 text-xs ${filter === s ? "opacity-70" : "text-slate-400"}`}>{apps.filter(a => a.status === s).length}</span>}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 relative">
          <button
            onClick={() => setShowSort(p => !p)}
            className="flex items-center gap-1.5 p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors text-slate-500 hover:text-indigo-600"
          >
            {sortDir === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />}
            <span className="text-xs font-semibold hidden sm:block capitalize" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{sort}</span>
          </button>
          {showSort && (
            <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 overflow-hidden w-44 animate-[scaleIn_0.15s_ease]">
              {(["deadline","priority","company","status"] as const).map(s => (
                <button key={s} onClick={() => toggleSort(s)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-slate-50 ${sort === s ? "text-indigo-600 font-bold" : "text-slate-700 font-medium"}`}
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  <span className="capitalize">{s}</span>
                  {sort === s && (sortDir === "asc" ? <SortAsc size={14}/> : <SortDesc size={14}/>)}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:scale-105 transition-all"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            <Plus size={16} /> Add Application
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
          <Briefcase size={48} className="text-slate-200 mb-4" />
          <h3 className="font-bold text-slate-700 mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>No applications found</h3>
          <p className="text-sm text-slate-400 mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
            {topBarProps.search ? `No results for "${topBarProps.search}"` : "Add your first application to get started"}
          </p>
          <button onClick={onAdd} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-xl shadow-md hover:scale-105 transition-all" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            <Plus size={16} /> Add Application
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(app => (
            <ApplicationCard key={app.id} app={app}
              onView={() => setViewApp(app)}
              onEdit={() => onEdit(app)}
              onDelete={() => onDelete(app)}
            />
          ))}
        </div>
      )}

      {viewApp && <TimelineModal app={viewApp} onClose={() => setViewApp(null)} />}
      {showSort && <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />}
    </div>
  );
}

// ─── Analytics View ────────────────────────────────────────────────────────

function AnalyticsView({ apps, topBarProps }: { apps: Application[]; topBarProps: any }) {
  const total = apps.length;
  const offers = apps.filter(a => a.status === "Offer").length;
  const interviews = apps.filter(a => a.status === "Interview").length;
  const offerRate = total > 0 ? ((offers / total) * 100).toFixed(1) : "0.0";
  const interviewToOffer = interviews + offers > 0 ? Math.round((offers / (interviews + offers)) * 100) : 0;

  const funnelData = [
    { name: "Applied",    value: total,                          fill: "#4F46E5" },
    { name: "Assessment", value: apps.filter(a => a.status === "Assessment").length + interviews + offers, fill: "#38BDF8" },
    { name: "Interview",  value: interviews + offers,            fill: "#8B5CF6" },
    { name: "Offer",      value: offers,                         fill: "#22C55E" },
  ];

  return (
    <div>
      <TopBar title="Analytics" subtitle="Deep dive into your job search performance" {...topBarProps} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: "Offer Rate",           value: `${offerRate}%`, sub: `${offers} of ${total} apps`,         color: "from-emerald-400 to-teal-500" },
          { label: "Avg Response Time",    value: "8.4d",           sub: "Faster than avg",                   color: "from-blue-400 to-indigo-500" },
          { label: "Interview-to-Offer",   value: `${interviewToOffer}%`, sub: `${offers} of ${interviews + offers} interviews`, color: "from-purple-400 to-violet-500" },
          { label: "Active Streak",        value: "14d",            sub: "Personal best 🔥",                 color: "from-orange-400 to-amber-500" },
        ].map(s => (
          <div key={s.label} className={`p-5 rounded-3xl bg-gradient-to-br ${s.color} text-white shadow-xl hover:scale-[1.03] transition-all duration-300 cursor-default`}>
            <div className="text-3xl font-extrabold mb-1" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{s.value}</div>
            <div className="font-semibold text-sm text-white/90" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{s.label}</div>
            <div className="text-xs text-white/70 mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-1" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Application Funnel</h3>
          <p className="text-xs text-slate-500 mb-6" style={{ fontFamily: "Inter, sans-serif" }}>Conversion at each stage</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={180}>
              <PieChart>
                <Pie data={funnelData} cx="50%" cy="50%" innerRadius={45} outerRadius={78} paddingAngle={3} dataKey="value">
                  {funnelData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ fontFamily: "DM Mono, monospace", fontSize: 11, borderRadius: 10 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {funnelData.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.fill }} />
                    <span className="text-xs text-slate-600" style={{ fontFamily: "DM Mono, monospace" }}>{d.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800" style={{ fontFamily: "DM Mono, monospace" }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-1" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Weekly Volume</h3>
          <p className="text-xs text-slate-500 mb-6" style={{ fontFamily: "Inter, sans-serif" }}>Applied vs Interviews vs Offers</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData} barGap={4} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 10, fontFamily: "DM Mono, monospace", fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fontFamily: "DM Mono, monospace", fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontFamily: "DM Mono, monospace", fontSize: 11, borderRadius: 10 }} />
              <Bar dataKey="applied" fill="#4F46E5" radius={[6,6,0,0]} />
              <Bar dataKey="interviews" fill="#8B5CF6" radius={[6,6,0,0]} />
              <Bar dataKey="offers" fill="#22C55E" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
        <h3 className="font-bold text-slate-900 mb-1" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Activity Heatmap</h3>
        <p className="text-xs text-slate-500 mb-6" style={{ fontFamily: "Inter, sans-serif" }}>Daily application activity — last 12 weeks</p>
        <div className="flex flex-col gap-1.5">
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day, row) => (
            <div key={day} className="flex items-center gap-1.5">
              <span className="w-8 text-xs text-slate-400 font-medium flex-shrink-0" style={{ fontFamily: "DM Mono, monospace" }}>{day}</span>
              {heatmapData[row].map((cell, col) => (
                <div key={col} title={cell.value > 0 ? `${cell.value} application${cell.value > 1 ? "s" : ""}` : "No activity"}
                  className="flex-1 aspect-square rounded-md hover:scale-110 cursor-default transition-transform"
                  style={{ backgroundColor: ["#f1f5f9","#c7d2fe","#818cf8","#4F46E5","#3730a3"][cell.value] ?? "#f1f5f9", maxWidth: 28 }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4 justify-end">
          <span className="text-xs text-slate-400" style={{ fontFamily: "DM Mono, monospace" }}>Less</span>
          {["#f1f5f9","#c7d2fe","#818cf8","#4F46E5","#3730a3"].map((c,i) => <div key={i} className="w-4 h-4 rounded-sm" style={{ backgroundColor: c }} />)}
          <span className="text-xs text-slate-400" style={{ fontFamily: "DM Mono, monospace" }}>More</span>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-900 mb-6" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Company Category Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "FAANG / Tier 1",     count: 6,  color: "#4F46E5", icon: Building2 },
            { label: "Series B+ Startups", count: 10, color: "#8B5CF6", icon: Zap },
            { label: "Remote-first",       count: 8,  color: "#38BDF8", icon: Globe },
            { label: "Unicorns",           count: 4,  color: "#22C55E", icon: Award },
          ].map(cat => {
            const Icon = cat.icon;
            return (
              <div key={cat.label} className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: cat.color + "20" }}>
                  <Icon size={22} style={{ color: cat.color }} />
                </div>
                <div className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{cat.count}</div>
                <div className="text-xs text-slate-500 text-center" style={{ fontFamily: "Inter, sans-serif" }}>{cat.label}</div>
                <CircleProgress value={Math.round((cat.count / 28) * 100)} size={40} stroke={4} color={cat.color} bg="#f1f5f9" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Profile View ──────────────────────────────────────────────────────────

function ProfileView({ toast, topBarProps }: { toast: (t: ToastMsg["type"], m: string) => void; topBarProps: any }) {
  const [skills, setSkills] = useState(["React", "TypeScript", "Node.js", "Python", "Figma", "AWS", "GraphQL", "Docker", "System Design", "Data Structures", "Algorithms", "SQL", "Next.js", "TailwindCSS"]);
  const [newSkill, setNewSkill] = useState("");
  const [addingSkill, setAddingSkill] = useState(false);
  const [goalTab, setGoalTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ name: "Aiden Kim", school: "MIT", degree: "Computer Science", year: "Senior", email: "aiden.kim@mit.edu", phone: "+1 (617) 555-0192", linkedin: "linkedin.com/in/aidenkim", github: "github.com/aidenkim" });
  const [draft, setDraft] = useState({ ...profile });
  const fileRef = useRef<HTMLInputElement>(null);
  const [resumeName, setResumeName] = useState("Aiden_Kim_Resume_2026.pdf");
  const skillInputRef = useRef<HTMLInputElement>(null);

  const removeSkill = (s: string) => { setSkills(p => p.filter(x => x !== s)); toast("info", `Removed skill: ${s}`); };
  const addSkill = () => {
    const s = newSkill.trim();
    if (!s) return;
    if (skills.includes(s)) { toast("error", "Skill already added"); return; }
    setSkills(p => [...p, s]);
    setNewSkill("");
    setAddingSkill(false);
    toast("success", `Added skill: ${s}`);
  };
  const saveProfile = () => { setProfile({ ...draft }); setEditing(false); toast("success", "Profile saved!"); };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setResumeName(f.name); toast("success", `Resume updated: ${f.name}`); }
  };

  const skillColors = ["bg-indigo-50 text-indigo-700 border-indigo-200","bg-purple-50 text-purple-700 border-purple-200","bg-sky-50 text-sky-700 border-sky-200","bg-emerald-50 text-emerald-700 border-emerald-200","bg-amber-50 text-amber-700 border-amber-200","bg-pink-50 text-pink-700 border-pink-200"];

  return (
    <div>
      <TopBar title="Profile" subtitle="Your career identity and goals" {...topBarProps} />

      {/* Profile Hero */}
      <div className="relative rounded-3xl overflow-hidden mb-8 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 opacity-90" />
        <div className="absolute inset-0"><FloatingShapes /></div>
        <div className="relative p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-5xl font-black text-white shadow-2xl">
              {profile.name.split(" ").map(n => n[0]).join("")}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg border border-white hover:scale-110 transition-transform"
            >
              <Camera size={14} className="text-indigo-600" />
            </button>
          </div>
          {editing ? (
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(["name","school","degree","year"] as const).map(k => (
                <input key={k} value={draft[k]} onChange={e => setDraft(p => ({ ...p, [k]: e.target.value }))}
                  placeholder={k.charAt(0).toUpperCase() + k.slice(1)}
                  className="px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
              ))}
              <div className="sm:col-span-2 flex gap-3">
                <button onClick={saveProfile} className="px-5 py-2 bg-white text-indigo-700 font-bold rounded-xl text-sm hover:bg-indigo-50 transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}><Save size={14} className="inline mr-1.5" />Save</button>
                <button onClick={() => { setEditing(false); setDraft({ ...profile }); }} className="px-5 py-2 bg-white/20 text-white font-semibold rounded-xl text-sm hover:bg-white/30 transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <div>
                  <h2 className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{profile.name}</h2>
                  <p className="text-white/80 mb-3" style={{ fontFamily: "Inter, sans-serif" }}>{profile.degree}, {profile.year} · {profile.school}</p>
                  <div className="flex flex-wrap gap-2">
                    {["Open to Work", "Summer 2026", "SWE / PM", "Fintech / AI"].map(tag => (
                      <span key={tag} className="text-xs font-semibold px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30">{tag}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => setEditing(true)} className="ml-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white flex-shrink-0">
                  <Edit3 size={16} />
                </button>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2.5 flex-shrink-0">
            {([["email","Mail",Mail],["phone","Phone",Phone],["linkedin","LinkedIn",Linkedin],["github","GitHub",Github]] as [keyof typeof profile, string, any][]).map(([k,_l,Icon]) => (
              <div key={k} className="flex items-center gap-2 text-white/80 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                <Icon size={13} className="text-white/60" />{profile[k]}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Skills */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Skills & Expertise</h3>
              <button onClick={() => { setAddingSkill(true); setTimeout(() => skillInputRef.current?.focus(), 50); }}
                className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                + Add Skill
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((skill, i) => (
                <span key={skill} className={`group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-all hover:scale-105 cursor-default ${skillColors[i % skillColors.length]}`} style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="opacity-0 group-hover:opacity-100 hover:scale-110 transition-all ml-0.5">
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
            {addingSkill && (
              <div className="flex gap-2 mt-3">
                <input ref={skillInputRef} value={newSkill} onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") addSkill(); if (e.key === "Escape") { setAddingSkill(false); setNewSkill(""); } }}
                  placeholder="e.g. Rust, Kubernetes..."
                  className="flex-1 px-4 py-2 rounded-xl border border-indigo-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-indigo-50"
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
                <button onClick={addSkill} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Add</button>
                <button onClick={() => { setAddingSkill(false); setNewSkill(""); }} className="px-3 py-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors"><X size={14} /></button>
              </div>
            )}
          </div>

          {/* Career Goals */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Career Goals</h3>
            <div className="flex gap-2 mb-4">
              {["Short Term", "Long Term", "Dream Role"].map((tab, i) => (
                <button key={tab} onClick={() => setGoalTab(i)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${goalTab === i ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >{tab}</button>
              ))}
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-600 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              {goalTab === 0 && "Land a Summer 2026 SWE internship at a Series B+ startup or FAANG company working on AI/ML infrastructure or product engineering. Target compensation: $7,000–$9,000/month."}
              {goalTab === 1 && "Become a Staff Engineer or early PM at a high-growth fintech or AI startup within 5 years. Build expertise in distributed systems and product-led growth."}
              {goalTab === 2 && "Founding Engineer or first PM hire at a stealth AI startup, working directly with founders on product strategy and technical architecture."}
            </div>
          </div>

          {/* Contact edit */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Contact Info</h3>
              {!editing && <button onClick={() => setEditing(true)} className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Edit</button>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(["email","phone","linkedin","github"] as const).map(k => {
                const icons: Record<string, any> = { email: Mail, phone: Phone, linkedin: Linkedin, github: Github };
                const Icon = icons[k];
                return (
                  <div key={k}>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block capitalize" style={{ fontFamily: "DM Mono, monospace" }}>{k}</label>
                    {editing ? (
                      <input value={draft[k]} onChange={e => setDraft(p => ({ ...p, [k]: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-slate-700" style={{ fontFamily: "Inter, sans-serif" }}>
                        <Icon size={13} className="text-slate-400" />{profile[k]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {editing && (
              <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
                <button onClick={saveProfile} className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl text-sm shadow-md hover:scale-[1.02] transition-all" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  <Save size={14} className="inline mr-1.5" />Save Changes
                </button>
                <button onClick={() => { setEditing(false); setDraft({ ...profile }); }} className="px-5 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-xl text-sm hover:bg-slate-200 transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Cancel</button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Resume */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Resume</h3>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-indigo-200 rounded-2xl p-6 text-center bg-indigo-50/50 hover:bg-indigo-50 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <FileText size={22} className="text-indigo-600" />
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-1 truncate" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{resumeName}</p>
              <p className="text-xs text-slate-400 mb-3" style={{ fontFamily: "Inter, sans-serif" }}>Updated July 10, 2026</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600"><Upload size={12} />Click to replace</span>
            </div>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
            <div className="flex gap-2 mt-3">
              <button onClick={() => toast("info", "Downloading resume...")} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                <Download size={13} /> Download
              </button>
              <button onClick={() => { navigator.clipboard?.writeText("https://trackforge.app/resume/aidenkim"); toast("success", "Link copied!"); }} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                <Copy size={13} /> Share Link
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Quick Stats</h3>
            <div className="space-y-4">
              {[
                { label: "Profile Completeness", value: Math.min(100, 50 + skills.length * 2), color: "#4F46E5" },
                { label: "Resume Strength",      value: 82,                                     color: "#8B5CF6" },
                { label: "Network Score",        value: 55,                                     color: "#38BDF8" },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5" style={{ fontFamily: "DM Mono, monospace" }}>
                    <span>{s.label}</span>
                    <span style={{ color: s.color }}>{s.value}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.value}%`, background: `linear-gradient(90deg, ${s.color}88, ${s.color})`, transition: "width 1s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Settings View ─────────────────────────────────────────────────────────

function SettingsView({ toast, topBarProps }: { toast: (t: ToastMsg["type"], m: string) => void; topBarProps: any }) {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    deadlines: true, interviews: true, matches: false, weekly: true,
    twofa: true, visibility: false, tracking: true,
    darkmode: false, compact: false, animations: true,
    push: true, biometric: true,
  });
  const [confirm, setConfirm] = useState<null | { title: string; body: string; danger?: boolean; onConfirm: () => void }>(null);

  const setToggle = (k: string, v: boolean) => {
    setToggles(p => ({ ...p, [k]: v }));
    toast("success", `${v ? "Enabled" : "Disabled"}: ${k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, " $1")}`);
  };

  const sections = [
    {
      title: "Notifications", icon: Bell, color: "from-blue-400 to-indigo-500",
      items: [
        { key: "deadlines",  label: "Deadline Reminders",  sub: "Get notified 7 days before deadlines" },
        { key: "interviews", label: "Interview Alerts",     sub: "Reminders 24 hours before interviews" },
        { key: "matches",    label: "New Matches",          sub: "When new roles match your profile" },
        { key: "weekly",     label: "Weekly Digest",        sub: "Summary of your week every Monday" },
      ],
    },
    {
      title: "Privacy & Security", icon: Shield, color: "from-purple-400 to-violet-600",
      items: [
        { key: "twofa",      label: "Two-Factor Authentication", sub: "Add an extra layer of security" },
        { key: "visibility", label: "Profile Visibility",        sub: "Allow recruiters to find your profile" },
        { key: "tracking",   label: "Activity Tracking",         sub: "Improve suggestions with usage data" },
      ],
    },
    {
      title: "Appearance", icon: Moon, color: "from-slate-400 to-slate-600",
      items: [
        { key: "darkmode",   label: "Dark Mode",     sub: "Switch to dark theme (coming soon)" },
        { key: "compact",    label: "Compact View",  sub: "Show more items with less spacing" },
        { key: "animations", label: "Animations",    sub: "Enable smooth transitions and effects" },
      ],
    },
    {
      title: "Mobile", icon: Smartphone, color: "from-emerald-400 to-teal-500",
      items: [
        { key: "push",      label: "Push Notifications", sub: "Receive alerts on your phone" },
        { key: "biometric", label: "Biometric Login",     sub: "Use Face ID / fingerprint to sign in" },
      ],
    },
  ];

  return (
    <div>
      <TopBar title="Settings" subtitle="Manage your account preferences" {...topBarProps} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map(section => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-md`}>
                  <Icon size={18} className="text-white" />
                </div>
                <h3 className="font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{section.title}</h3>
              </div>
              <div className="space-y-5">
                {section.items.map(item => (
                  <div key={item.key} className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-800" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{item.label}</div>
                      <div className="text-xs text-slate-500" style={{ fontFamily: "Inter, sans-serif" }}>{item.sub}</div>
                    </div>
                    <Toggle value={toggles[item.key] ?? false} onChange={v => setToggle(item.key, v)} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Account */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-5" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Account</h3>
          <div className="space-y-3">
            <button onClick={() => toast("info", "Password reset email sent to aiden.kim@mit.edu")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-semibold text-slate-700" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Change Password <ChevronRight size={16} className="text-slate-400" />
            </button>
            <button onClick={() => toast("info", "Verification email sent!")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-semibold text-slate-700" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Verify Email <ChevronRight size={16} className="text-slate-400" />
            </button>
            <button onClick={() => toast("info", "Two-factor setup initiated")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-semibold text-slate-700" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Setup Authenticator App <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-red-100">
          <h3 className="font-bold text-red-600 mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Danger Zone</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setConfirm({ title: "Export All Data", body: "We will send a complete export of your data to your registered email within 24 hours.", onConfirm: () => { toast("success", "Data export requested! Check your email."); setConfirm(null); } })}
              className="px-5 py-2.5 bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Export All Data
            </button>
            <button
              onClick={() => setConfirm({ title: "Clear Application History", body: "This will permanently delete all your application data. This cannot be undone.", danger: true, onConfirm: () => { toast("info", "Application history cleared."); setConfirm(null); } })}
              className="px-5 py-2.5 bg-red-50 text-red-600 font-semibold text-sm rounded-xl border border-red-200 hover:bg-red-100 transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Clear History
            </button>
            <button
              onClick={() => setConfirm({ title: "Delete Account", body: "This will permanently delete your account and all associated data. This action cannot be undone.", danger: true, onConfirm: () => { toast("error", "Account deletion requested."); setConfirm(null); } })}
              className="px-5 py-2.5 bg-red-500 text-white font-semibold text-sm rounded-xl hover:bg-red-600 transition-colors shadow-md" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}
    </div>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────

const NAV = [
  { id: "dashboard",    icon: LayoutDashboard, label: "Dashboard" },
  { id: "applications", icon: Briefcase,        label: "Applications" },
  { id: "analytics",   icon: BarChart3,         label: "Analytics" },
  { id: "profile",     icon: User,              label: "Profile" },
  { id: "settings",    icon: Settings,          label: "Settings" },
];

function Sidebar({ active, setActive, appsCount, onExit }: { active: string; setActive: (v: string) => void; appsCount: number; onExit: () => void }) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 flex flex-col py-6 px-4 z-30 border-r border-white/60"
      style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200">
          <Layers className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          Track<span className="text-indigo-600">Forge</span>
        </span>
      </div>
      <nav className="flex-1 flex flex-col gap-1">
        {NAV.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => setActive(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left w-full group ${
                isActive ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200" : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
              }`}
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              <Icon size={18} className={`flex-shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-500"}`} />
              {item.label}
              {item.id === "applications" && (
                <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-600"}`}>{appsCount}</span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="mt-4 p-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">AK</div>
          <div>
            <div className="text-sm font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Aiden Kim</div>
            <div className="text-xs text-slate-500" style={{ fontFamily: "Inter, sans-serif" }}>CS Senior · MIT</div>
          </div>
        </div>
        <div className="w-full bg-indigo-100 rounded-full h-1.5 mb-1">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full" style={{ width: "68%" }} />
        </div>
        <div className="flex justify-between text-xs text-slate-500" style={{ fontFamily: "DM Mono, monospace" }}>
          <span>Profile 68%</span>
          <button className="text-indigo-600 font-medium hover:underline" onClick={() => setActive("profile")}>Complete →</button>
        </div>
      </div>
      <button onClick={onExit} className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
        <LogOut size={16} /> Sign Out
      </button>
    </aside>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────

function HeroPage({ onEnter }: { onEnter: () => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { label: "Applied",    color: "from-blue-500 to-indigo-600",   icon: FileText,    desc: "Submit applications" },
    { label: "Assessment", color: "from-amber-500 to-orange-500",  icon: AlertCircle, desc: "Complete challenges" },
    { label: "Interview",  color: "from-violet-500 to-purple-600", icon: Activity,    desc: "Ace your interviews" },
    { label: "Offer",      color: "from-emerald-500 to-green-600", icon: Trophy,      desc: "Land the role" },
  ];
  useEffect(() => {
    const t = setInterval(() => setActiveStep(p => (p + 1) % 4), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(135deg,#EEF4FF 0%,#F0F7FF 40%,#F8FAFC 70%,#EFF6FF 100%)" }}>
      <FloatingShapes />
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Track<span className="text-indigo-600">Forge</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          {["Features","Pricing","Blog","Docs"].map(l => (
            <a key={l} href="#" onClick={e => { e.preventDefault(); onEnter(); }} className="hover:text-indigo-600 transition-colors">{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onEnter} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors">Sign In</button>
          <button onClick={onEnter} className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105 transition-all">Get Started Free</button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-full text-sm font-semibold text-indigo-700 shadow-sm mb-8">
            <Zap className="w-4 h-4 text-amber-500" />
            New: AI-powered application insights <ChevronRight className="w-4 h-4" />
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-6" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Build Your{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">Career Journey.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10" style={{ fontFamily: "Inter, sans-serif" }}>
            The all-in-one platform for students to track internship applications, prepare for interviews, and celebrate offers — beautifully organized.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onEnter} className="group flex items-center gap-2 px-7 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 hover:scale-105 transition-all text-base">
              Start Tracking Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={onEnter} className="flex items-center gap-2 px-7 py-4 bg-white/80 backdrop-blur-sm border border-indigo-100 text-slate-700 font-semibold rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition-all text-base">
              <Eye className="w-5 h-5 text-indigo-500" /> See Demo
            </button>
          </div>
        </div>

        {/* Roadmap */}
        <div className="max-w-3xl mx-auto mb-20">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8" style={{ fontFamily: "DM Mono, monospace" }}>Your Path to the Offer</p>
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-emerald-200 -translate-y-1/2 mx-16 hidden sm:block" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isActive = activeStep === i;
                return (
                  <div key={step.label} onClick={() => setActiveStep(i)}
                    className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-500 ${isActive ? "bg-white shadow-xl border-transparent scale-105" : "bg-white/50 border-transparent hover:bg-white/80"}`}
                    style={isActive ? { boxShadow: "0 20px 60px -10px rgba(79,70,229,0.25)" } : {}}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg transition-all duration-500 ${isActive ? "scale-110" : "opacity-70"}`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-bold transition-colors ${isActive ? "text-slate-900" : "text-slate-500"}`} style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{step.label}</div>
                      <div className={`text-xs mt-0.5 transition-colors ${isActive ? "text-slate-500" : "text-slate-400"}`} style={{ fontFamily: "Inter, sans-serif" }}>{step.desc}</div>
                    </div>
                    {isActive && <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center"><CheckCircle2 size={12} className="text-white" /></div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { val: "12,400+", label: "Students Onboarded",     color: "text-indigo-600" },
            { val: "89,000+", label: "Applications Tracked",   color: "text-purple-600" },
            { val: "73%",     label: "Offer Rate Improvement", color: "text-cyan-600" },
            { val: "4.9 ★",  label: "App Store Rating",       color: "text-amber-600" },
          ].map(s => (
            <div key={s.label} className="text-center p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white shadow-sm hover:shadow-md hover:scale-[1.03] transition-all cursor-default">
              <div className={`text-2xl font-extrabold ${s.color} mb-1`} style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{s.val}</div>
              <div className="text-xs text-slate-500 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────

function MainApp({ onExit }: { onExit: () => void }) {
  const [active, setActive] = useState("dashboard");
  const [apps, setApps] = useState<Application[]>(INITIAL_APPS);
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [search, setSearch] = useState("");
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Modals
  const [addModal, setAddModal] = useState(false);
  const [editApp, setEditApp] = useState<Application | null>(null);
  const [deleteApp, setDeleteApp] = useState<Application | null>(null);

  const { toasts, push: toast, remove } = useToast();
  const unreadCount = notifs.filter(n => !n.read).length;

  const handleAdd = (data: Omit<Application, "id" | "timeline">) => {
    const newApp: Application = {
      ...data,
      id: Date.now(),
      timeline: genTimeline(data.status),
    };
    setApps(p => [newApp, ...p]);
    setAddModal(false);
    toast("success", `Added application: ${data.company}`);
  };

  const handleEdit = (data: Omit<Application, "id" | "timeline">) => {
    if (!editApp) return;
    setApps(p => p.map(a => a.id === editApp.id ? { ...a, ...data, logo: data.company.charAt(0).toUpperCase(), timeline: genTimeline(data.status) } : a));
    setEditApp(null);
    toast("success", `Updated: ${data.company}`);
  };

  const handleDelete = () => {
    if (!deleteApp) return;
    setApps(p => p.filter(a => a.id !== deleteApp.id));
    toast("info", `Removed: ${deleteApp.company}`);
    setDeleteApp(null);
  };

  const topBarProps = {
    search,
    onSearch: setSearch,
    onNotifClick: () => { setShowNotifs(p => !p); setShowUserMenu(false); },
    onAvatarClick: () => { setShowUserMenu(p => !p); setShowNotifs(false); },
    notifCount: unreadCount,
  };

  const views: Record<string, JSX.Element> = {
    dashboard:    <DashboardView apps={apps} setActive={setActive} topBarProps={topBarProps} />,
    applications: <ApplicationsView apps={apps} onAdd={() => setAddModal(true)} onEdit={a => setEditApp(a)} onDelete={a => setDeleteApp(a)} topBarProps={topBarProps} />,
    analytics:    <AnalyticsView apps={apps} topBarProps={topBarProps} />,
    profile:      <ProfileView toast={toast} topBarProps={topBarProps} />,
    settings:     <SettingsView toast={toast} topBarProps={topBarProps} />,
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#EEF4FF 0%,#F8FAFC 60%,#EFF6FF 100%)" }}>
      <style>{GLOBAL_CSS}</style>
      <Sidebar active={active} setActive={v => { setActive(v); setSearch(""); }} appsCount={apps.length} onExit={onExit} />
      <main className="pl-64 min-h-screen">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div key={active} style={{ animation: "fadeSlideIn 0.3s ease forwards" }}>
            {views[active]}
          </div>
        </div>
      </main>

      {showNotifs && (
        <NotifPanel
          notifs={notifs}
          onRead={id => setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n))}
          onReadAll={() => setNotifs(p => p.map(n => ({ ...n, read: true })))}
          onClose={() => setShowNotifs(false)}
        />
      )}
      {showUserMenu && (
        <UserMenu
          onClose={() => setShowUserMenu(false)}
          onNavigate={v => { setActive(v); setSearch(""); }}
          onExit={onExit}
        />
      )}
      {addModal && <AppFormModal title="Add Application" onSave={handleAdd} onClose={() => setAddModal(false)} />}
      {editApp && <AppFormModal title={`Edit — ${editApp.company}`} initial={editApp} onSave={handleEdit} onClose={() => setEditApp(null)} />}
      {deleteApp && (
        <ConfirmDialog
          title={`Delete ${deleteApp.company}?`}
          body={`This will permanently remove your "${deleteApp.role}" application. This cannot be undone.`}
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteApp(null)}
        />
      )}
      <ToastContainer toasts={toasts} remove={remove} />
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<"hero" | "app">("hero");
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {page === "hero" ? <HeroPage onEnter={() => setPage("app")} /> : <MainApp onExit={() => setPage("hero")} />}
    </>
  );
}
