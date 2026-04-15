import { NextResponse } from "next/server";

const SITE_AUTH_COOKIE = "site_access";

function normalizeNext(next: FormDataEntryValue | null): string {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }
  return next;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const nextPath = normalizeNext(formData.get("next"));
  const password = formData.get("password");
  const sitePassword = process.env.SITE_PASSWORD || "";

  if (!sitePassword || typeof password !== "string" || password !== sitePassword) {
    const url = new URL("/gate", request.url);
    url.searchParams.set("next", nextPath);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, 303);
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url), 303);
  response.cookies.set(SITE_AUTH_COOKIE, sitePassword, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
