"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Plus, Pencil, Trash2, LogOut, Star, MapPin, Music, Gift, Sparkles,
  BookOpen, Camera, Mail, MessageCircle, Settings, ChevronLeft, Save, X, Upload,
} from "lucide-react";

const TABS = [
  { key: "milestones", label: "时间线", icon: Star },
  { key: "diary", label: "日记", icon: BookOpen },
  { key: "gallery", label: "相册", icon: Camera },
  { key: "letters", label: "情书", icon: Mail },
  { key: "messages", label: "留言", icon: MessageCircle },
  { key: "settings", label: "设置", icon: Settings },
];

const ICON_OPTIONS = [
  { value: "star", label: "星星", Icon: Star },
  { value: "heart", label: "爱心", Icon: Heart },
  { value: "sparkles", label: "闪光", Icon: Sparkles },
  { value: "map", label: "地图", Icon: MapPin },
  { value: "gift", label: "礼物", Icon: Gift },
  { value: "music", label: "音乐", Icon: Music },
];

const TAG_OPTIONS = ["日常", "心动", "纪念", "旅行", "美食", "其他"];

const emptyForms = {
  milestones: { date: "", title: "", desc: "", icon: "heart", sort_order: 0 },
  diary: { date: "", title: "", text: "", tag: "日常" },
  gallery: { gradient: "linear-gradient(135deg, #f8b4b4, #fb7185)", image_url: "", caption: "", h: 240, sort_order: 0 },
  letters: { title: "", text: "", sort_order: 0 },
};

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("milestones");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // { ...item } or null
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState("");
  const fileInputRef = useRef(null);

  /* auth check */
  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("admin_auth")) {
      router.push("/admin");
    }
  }, [router]);

  /* fetch data */
  const fetchData = async () => {
    try {
      const res = await fetch("/api/content");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  /* toast */
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  /* file upload */
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setForm((f) => ({ ...f, image_url: json.url }));
      setUploadPreview(URL.createObjectURL(file));
      showToast("上传成功");
    } catch (err) {
      showToast("上传失败: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  /* CRUD */
  const openAdd = () => {
    setAdding(true);
    setEditing(null);
    setForm(emptyForms[tab] || {});
  };

  const openEdit = (item) => {
    setEditing(item);
    setAdding(false);
    setForm({ ...item });
  };

  const closeForm = () => {
    setEditing(null);
    setAdding(false);
    setForm({});
    setUploadPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = editing ? "PUT" : "POST";
      const body = editing
        ? { type: tab, id: editing.id, data: form }
        : { type: tab, data: form };
      const res = await fetch("/api/content", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      showToast(editing ? "已更新" : "已添加");
      closeForm();
      await fetchData();
    } catch (e) {
      showToast("保存失败: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("确定要删除这条内容吗？")) return;
    try {
      const res = await fetch("/api/content", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: tab, id }),
      });
      if (!res.ok) throw new Error(await res.text());
      showToast("已删除");
      await fetchData();
    } catch (e) {
      showToast("删除失败: " + e.message);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    router.push("/admin");
  };

  const items = data[tab] || [];

  /* ── Input style helper ── */
  const inputCls =
    "w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-[#C48181]";
  const inputStyle = {
    background: "rgba(255,255,255,0.5)",
    border: "1px solid rgba(196,129,129,0.15)",
    color: "#3D2B2B",
  };

  /* ── Render form fields based on tab ── */
  const renderFields = () => {
    switch (tab) {
      case "milestones":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#9B7070" }}>日期</label>
                <input className={inputCls} style={inputStyle} placeholder="2024.02.14" value={form.date || ""} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#9B7070" }}>图标</label>
                <select className={inputCls} style={inputStyle} value={form.icon || "heart"} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                  {ICON_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#9B7070" }}>标题</label>
              <input className={inputCls} style={inputStyle} placeholder="标题" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#9B7070" }}>描述</label>
              <textarea className={inputCls + " min-h-[80px] resize-none"} style={inputStyle} placeholder="描述" value={form.desc || ""} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#9B7070" }}>排序（数字越小越靠前）</label>
              <input type="number" className={inputCls} style={inputStyle} value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </div>
          </>
        );
      case "diary":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#9B7070" }}>日期</label>
                <input className={inputCls} style={inputStyle} placeholder="2025.06.15" value={form.date || ""} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#9B7070" }}>标签</label>
                <select className={inputCls} style={inputStyle} value={form.tag || "日常"} onChange={(e) => setForm({ ...form, tag: e.target.value })}>
                  {TAG_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#9B7070" }}>标题</label>
              <input className={inputCls} style={inputStyle} placeholder="标题" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#9B7070" }}>内容</label>
              <textarea className={inputCls + " min-h-[120px] resize-none"} style={inputStyle} placeholder="正文内容" value={form.text || ""} onChange={(e) => setForm({ ...form, text: e.target.value })} />
            </div>
          </>
        );
      case "gallery":
        return (
          <>
            {/* File upload area */}
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#9B7070" }}>上传图片</label>
              <div
                className="relative rounded-xl overflow-hidden cursor-pointer"
                style={{
                  height: 160,
                  background: uploadPreview
                    ? `url(${uploadPreview}) center/cover`
                    : form.image_url
                    ? `url(${form.image_url}) center/cover`
                    : "rgba(196,129,129,0.06)",
                  border: "1px dashed rgba(196,129,129,0.25)",
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {(!uploadPreview && !form.image_url) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    {uploading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                        <Upload className="w-6 h-6" style={{ color: "#C48181" }} />
                      </motion.div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6" style={{ color: "#D4A38B" }} />
                        <span className="text-xs" style={{ color: "#9B7070" }}>点击选择图片（JPG/PNG/WebP/GIF，最大 5MB）</span>
                      </>
                    )}
                  </div>
                )}
                {(uploadPreview || form.image_url) && (
                  <div className="absolute bottom-0 left-0 right-0 py-2 px-3 text-center" style={{ background: "rgba(0,0,0,0.4)" }}>
                    <span className="text-xs text-white">点击更换图片</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#9B7070" }}>或输入图片URL（可选）</label>
              <input className={inputCls} style={inputStyle} placeholder="https://..." value={form.image_url || ""} onChange={(e) => { setForm({ ...form, image_url: e.target.value }); setUploadPreview(""); }} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#9B7070" }}>说明文字</label>
              <input className={inputCls} style={inputStyle} placeholder="照片说明" value={form.caption || ""} onChange={(e) => setForm({ ...form, caption: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#9B7070" }}>渐变色（无图片时使用）</label>
                <input className={inputCls} style={inputStyle} placeholder="linear-gradient(...)" value={form.gradient || ""} onChange={(e) => setForm({ ...form, gradient: e.target.value })} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#9B7070" }}>高度(px)</label>
                <input type="number" className={inputCls} style={inputStyle} value={form.h ?? 240} onChange={(e) => setForm({ ...form, h: parseInt(e.target.value) || 240 })} />
              </div>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#9B7070" }}>排序</label>
              <input type="number" className={inputCls} style={inputStyle} value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </div>
          </>
        );
      case "letters":
        return (
          <>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#9B7070" }}>标题</label>
              <input className={inputCls} style={inputStyle} placeholder="情书标题" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#9B7070" }}>内容</label>
              <textarea className={inputCls + " min-h-[160px] resize-none"} style={inputStyle} placeholder="情书内容" value={form.text || ""} onChange={(e) => setForm({ ...form, text: e.target.value })} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#9B7070" }}>排序</label>
              <input type="number" className={inputCls} style={inputStyle} value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  /* ── Render list item preview ── */
  const renderItem = (item) => {
    switch (tab) {
      case "milestones":
        return (
          <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/40 transition-colors group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs" style={{ color: "#D4A38B" }}>{item.date}</span>
                <span className="text-sm font-medium truncate" style={{ color: "#3D2B2B" }}>{item.title}</span>
              </div>
              <p className="text-xs truncate" style={{ color: "#9B7070" }}>{item.desc}</p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/60"><Pencil className="w-3.5 h-3.5" style={{ color: "#C48181" }} /></button>
              <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
            </div>
          </div>
        );
      case "diary":
        return (
          <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/40 transition-colors group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs" style={{ color: "#D4A38B" }}>{item.date}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(196,129,129,0.12)", color: "#C48181" }}>{item.tag}</span>
                <span className="text-sm font-medium truncate" style={{ color: "#3D2B2B" }}>{item.title}</span>
              </div>
              <p className="text-xs truncate" style={{ color: "#9B7070" }}>{item.text}</p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/60"><Pencil className="w-3.5 h-3.5" style={{ color: "#C48181" }} /></button>
              <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
            </div>
          </div>
        );
      case "gallery":
        return (
          <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/40 transition-colors group">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg shrink-0" style={{ background: item.image_url ? `url(${item.image_url}) center/cover` : item.gradient }} />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "#3D2B2B" }}>{item.caption || "未命名"}</p>
                <p className="text-xs truncate" style={{ color: "#9B7070" }}>{item.image_url || item.gradient}</p>
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/60"><Pencil className="w-3.5 h-3.5" style={{ color: "#C48181" }} /></button>
              <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
            </div>
          </div>
        );
      case "letters":
        return (
          <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/40 transition-colors group">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "#3D2B2B" }}>{item.title}</p>
              <p className="text-xs truncate" style={{ color: "#9B7070" }}>{item.text}</p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/60"><Pencil className="w-3.5 h-3.5" style={{ color: "#C48181" }} /></button>
              <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
            </div>
          </div>
        );
      case "messages":
        return (
          <div className="py-3 px-4 rounded-xl" style={{ background: "rgba(255,255,255,0.3)" }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium" style={{ color: "#C48181" }}>{item.name || "匿名"}</span>
              <span className="text-xs" style={{ color: "#BFA0A0" }}>{new Date(item.created_at).toLocaleString("zh-CN")}</span>
            </div>
            <p className="text-sm" style={{ color: "#5C4040" }}>{item.text}</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFFBF7" }}>
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <Heart className="w-8 h-8 fill-current" style={{ color: "#C48181" }} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#FFFBF7", fontFamily: "'Inter', 'Noto Sans SC', sans-serif", color: "#3D2B2B" }}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl text-sm text-white shadow-lg"
            style={{ background: "#C48181" }}
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 px-6 py-4" style={{ background: "rgba(255,251,247,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(196,129,129,0.08)" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/")} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/60">
              <ChevronLeft className="w-4 h-4" style={{ color: "#9B7070" }} />
            </button>
            <Heart className="w-4 h-4 fill-current" style={{ color: "#C48181" }} />
            <span className="text-sm font-medium tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>管理后台</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg hover:bg-white/60 transition-colors" style={{ color: "#9B7070" }}>
            <LogOut className="w-3.5 h-3.5" /> 退出
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); closeForm(); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all"
                style={{
                  background: active ? "rgba(196,129,129,0.12)" : "transparent",
                  color: active ? "#C48181" : "#9B7070",
                  fontWeight: active ? 600 : 400,
                }}
              >
                <Icon className="w-3.5 h-3.5" /> {t.label}
                {data[t.key] && <span className="ml-1 text-[10px] opacity-60">({data[t.key].length})</span>}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(10px)", border: "1px solid rgba(196,129,129,0.08)" }}>
          {/* Add button (not for messages) */}
          {tab !== "messages" && tab !== "settings" && (
            <motion.button
              onClick={openAdd}
              className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl text-sm text-white"
              style={{ background: "#C48181" }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" /> 添加内容
            </motion.button>
          )}

          {/* Form modal */}
          <AnimatePresence>
            {(adding || editing) && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-6"
                style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={closeForm}
              >
                <motion.div
                  className="w-full max-w-lg rounded-2xl p-6 space-y-4"
                  style={{ background: "#FFFBF7", border: "1px solid rgba(196,129,129,0.1)", boxShadow: "0 16px 60px rgba(0,0,0,0.1)" }}
                  initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium" style={{ fontFamily: "'Noto Serif SC', serif", color: "#3D2B2B" }}>
                      {editing ? "编辑" : "添加"}
                    </h3>
                    <button onClick={closeForm} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/5">
                      <X className="w-4 h-4" style={{ color: "#9B7070" }} />
                    </button>
                  </div>
                  {renderFields()}
                  <div className="flex gap-3 pt-2">
                    <motion.button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm text-white"
                      style={{ background: saving ? "#D4A38B" : "#C48181" }}
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    >
                      <Save className="w-4 h-4" /> {saving ? "保存中..." : "保存"}
                    </motion.button>
                    <button onClick={closeForm} className="px-6 rounded-xl py-3 text-sm" style={{ background: "rgba(196,129,129,0.08)", color: "#9B7070" }}>
                      取消
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* List */}
          {tab === "settings" ? (
            <div className="text-center py-12">
              <Settings className="w-8 h-8 mx-auto mb-4" style={{ color: "#D4A38B" }} />
              <p className="text-sm mb-2" style={{ color: "#5C4040" }}>开始日期设置</p>
              <p className="text-xs" style={{ color: "#9B7070" }}>
                请在 Supabase 的 settings 表中添加一条记录：key = &quot;start_date&quot;, value = &quot;2026-02-13&quot;
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm" style={{ color: "#9B7070" }}>暂无内容，点击上方按钮添加</p>
            </div>
          ) : (
            <div className="space-y-1">
              {items.map((item) => (
                <div key={item.id}>{renderItem(item)}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
