import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/admin-auth";

const CONTENT_TYPES = new Set([
  "milestones",
  "diary",
  "gallery",
  "letters",
  "messages",
  "settings",
  "vows",
]);
const ADMIN_WRITE_TYPES = new Set([
  "milestones",
  "diary",
  "gallery",
  "letters",
  "settings",
  "vows",
]);

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function invalidRequest(message = "Invalid request") {
  return NextResponse.json({ error: message }, { status: 400 });
}

function parseMessage(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const text = typeof data.text === "string" ? data.text.trim() : "";
  if (!text || text.length > 500 || name.length > 30) return null;

  return { name: name || "匿名", text };
}

/* ── GET /api/content?type=milestones|diary|gallery|letters|messages|settings ── */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    if (type && type !== "all") {
      if (!CONTENT_TYPES.has(type)) return invalidRequest("Unknown content type");
      let query = supabase.from(type).select("*");
      if (["milestones", "gallery", "letters"].includes(type)) {
        query = query.order("sort_order", { ascending: true });
      } else if (type === "diary") {
        query = query.order("date", { ascending: false });
      } else if (type === "messages") {
        query = query.order("created_at", { ascending: false });
      }
      const { data, error } = await query;
      if (error) throw error;
      return NextResponse.json(data || []);
    }

    // Fetch all content at once
    const [milestones, diary, gallery, letters, messages, settings] = await Promise.all([
      supabase.from("milestones").select("*").order("sort_order", { ascending: true }),
      supabase.from("diary").select("*").order("date", { ascending: false }),
      supabase.from("gallery").select("*").order("sort_order", { ascending: true }),
      supabase.from("letters").select("*").order("sort_order", { ascending: true }),
      supabase.from("messages").select("*").order("created_at", { ascending: false }),
      supabase.from("settings").select("*"),
    ]);

    return NextResponse.json({
      milestones: milestones.data || [],
      diary: diary.data || [],
      gallery: gallery.data || [],
      letters: letters.data || [],
      messages: messages.data || [],
      settings: settings.data || [],
    });
  } catch (e) {
    console.error("API GET error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/* ── POST /api/content  { type, data } ── */
export async function POST(request) {
  try {
    const { type, data } = await request.json();
    let safeData;

    if (type === "messages") {
      safeData = parseMessage(data);
      if (!safeData) return invalidRequest("留言内容格式不正确");
    } else {
      if (!ADMIN_WRITE_TYPES.has(type)) return invalidRequest("Unknown content type");
      if (!isAdminRequest(request)) return unauthorized();
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        return invalidRequest();
      }
      safeData = data;
    }

    const { data: result, error } = await supabase
      .from(type)
      .insert(safeData)
      .select();
    if (error) throw error;
    return NextResponse.json(result?.[0] || {});
  } catch (e) {
    console.error("API POST error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/* ── PUT /api/content  { type, id, data } ── */
export async function PUT(request) {
  try {
    if (!isAdminRequest(request)) return unauthorized();
    const { type, id, data } = await request.json();
    if (!CONTENT_TYPES.has(type) || !id || !data || typeof data !== "object") {
      return invalidRequest();
    }

    const { data: result, error } = await supabase
      .from(type)
      .update(data)
      .eq("id", id)
      .select();
    if (error) throw error;
    return NextResponse.json(result?.[0] || {});
  } catch (e) {
    console.error("API PUT error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/* ── DELETE /api/content  { type, id } ── */
export async function DELETE(request) {
  try {
    if (!isAdminRequest(request)) return unauthorized();
    const { type, id } = await request.json();
    if (!CONTENT_TYPES.has(type) || !id) return invalidRequest();

    const { error } = await supabase.from(type).delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("API DELETE error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
