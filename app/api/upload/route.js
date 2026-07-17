import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/* POST /api/upload — accepts multipart/form-data with a "file" field */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    /* Validate file type */
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "仅支持 JPG / PNG / WebP / GIF 格式" },
        { status: 400 }
      );
    }

    /* Validate file size (max 5MB) */
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "文件大小不能超过 5MB" },
        { status: 400 }
      );
    }

    /* Generate unique filename: timestamp-random.ext */
    const ext = file.name.split(".").pop() || "jpg";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = `photos/${uniqueName}`;

    /* Upload to Supabase Storage */
    const { data, error } = await supabaseAdmin.storage
      .from("photos")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) throw error;

    /* Get public URL */
    const { data: urlData } = supabaseAdmin.storage
      .from("photos")
      .getPublicUrl(data.path);

    return NextResponse.json({ url: urlData.publicUrl, path: data.path });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/* DELETE /api/upload — delete a file from storage */
export async function DELETE(request) {
  try {
    const { path } = await request.json();
    if (!path) {
      return NextResponse.json({ error: "No path provided" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.storage
      .from("photos")
      .remove([path]);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Delete file error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
