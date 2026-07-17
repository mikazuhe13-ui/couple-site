import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(request) {
  try {
    const { key, value } = await request.json();

    if (!key || !value) {
      return Response.json({ error: "Missing key or value" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("settings")
      .update({ value })
      .eq("key", key);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
