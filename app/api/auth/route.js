import { NextResponse } from "next/server";
import {
  clearAdminSession,
  createAdminSession,
} from "@/lib/admin-auth";

export async function POST(request) {
  const { password } = await request.json();

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ error: "Admin password not configured" }, { status: 500 });
  }

  if (password === adminPassword) {
    const response = NextResponse.json({ success: true });
    createAdminSession(response);
    return response;
  }

  return NextResponse.json({ error: "密码错误" }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  clearAdminSession(response);
  return response;
}
