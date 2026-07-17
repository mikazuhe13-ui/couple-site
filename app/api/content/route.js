import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/* ── GET /api/content?type=milestones|diary|gallery|letters|messages|settings ── */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    if (type && type !== "all") {
      const { data, error } = await supabase
        .from(type)
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
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
  const { type, data } = await request.json();

  try {
    const { data: result, error } = await supabase.from(type).insert(data).select();
    if (error) throw error;
    return NextResponse.json(result?.[0] || {});
  } catch (e) {
    console.error("API POST error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/* ── PUT /api/content  { type, id, data } ── */
export async function PUT(request) {
  const { type, id, data } = await request.json();

  try {
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
  const { type, id } = await request.json();

  try {
    const { error } = await supabase.from(type).delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("API DELETE error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
