"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return { error: "Invalid email or password." };
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/va-operations");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  redirect("/login");
}
