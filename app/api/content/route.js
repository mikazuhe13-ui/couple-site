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
const MESSAGE_WINDOW_MS = 60_000;
const MESSAGE_LIMIT = 5;
const messageRequests = new Map();

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

function isMessageRateLimited(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientId = forwardedFor?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
  const now = Date.now();
  if (messageRequests.size > 500) {
    for (const [key, timestamps] of messageRequests) {
      if (!timestamps.some((timestamp) => now - timestamp < MESSAGE_WINDOW_MS)) {
        messageRequests.delete(key);
      }
    }
  }
  const recent = (messageRequests.get(clientId) || []).filter(
    (timestamp) => now - timestamp < MESSAGE_WINDOW_MS
  );

  if (recent.length >= MESSAGE_LIMIT) {
    messageRequests.set(clientId, recent);
    return true;
  }

  recent.push(now);
  messageRequests.set(clientId, recent);
  return false;
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
        query = query.order("created_at", { ascending: false }).limit(50);
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
      supabase
        .from("messages")
        .select("id,name,text,created_at")
        .order("created_at", { ascending: false })
        .limit(50),
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
      if (isMessageRateLimited(request)) {
        return NextResponse.json(
          { error: "留言太频繁，请稍后再试" },
          { status: 429, headers: { "Retry-After": "60" } }
        );
      }
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
