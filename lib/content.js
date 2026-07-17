import "server-only";

import { createClient } from "@supabase/supabase-js";
import {
  FALLBACK_DIARY,
  FALLBACK_GALLERY,
  FALLBACK_LETTERS,
  FALLBACK_START,
  FALLBACK_VOWS,
} from "@/lib/data";

const fallbackContent = () => ({
  startDate: FALLBACK_START.toISOString(),
  diaryEntries: FALLBACK_DIARY,
  galleryItems: FALLBACK_GALLERY,
  loveLetters: FALLBACK_LETTERS,
  vowsItems: FALLBACK_VOWS,
  messages: [],
});

function dataOrFallback(result, fallback) {
  return !result.error && result.data?.length ? result.data : fallback;
}

function parseStartDate(settings) {
  const value = settings?.find((setting) => setting.key === "start_date")?.value;
  if (!value) return FALLBACK_START.toISOString();

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? FALLBACK_START.toISOString()
    : date.toISOString();
}

export async function getInitialContent() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return fallbackContent();
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const [diary, gallery, letters, vows, messages, settings] = await Promise.all([
      supabase.from("diary").select("*").order("date", { ascending: false }),
      supabase
        .from("gallery")
        .select("*")
        .order("sort_order", { ascending: true }),
      supabase
        .from("letters")
        .select("*")
        .order("sort_order", { ascending: true }),
      supabase
        .from("vows")
        .select("*")
        .order("sort_order", { ascending: true }),
      supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("settings").select("*"),
    ]);

    return {
      startDate: settings.error
        ? FALLBACK_START.toISOString()
        : parseStartDate(settings.data),
      diaryEntries: dataOrFallback(diary, FALLBACK_DIARY),
      galleryItems: dataOrFallback(gallery, FALLBACK_GALLERY),
      loveLetters: dataOrFallback(letters, FALLBACK_LETTERS),
      vowsItems: dataOrFallback(vows, FALLBACK_VOWS),
      messages: dataOrFallback(messages, []),
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Unable to load initial content from Supabase:", error);
    }
    return fallbackContent();
  }
}
