import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  const isSuperAdminDash = url.pathname.startsWith("/(dash)/super-admin");
  const isCompanyAdminDash = url.pathname.startsWith("/(dash)/company-admin");
  const isHRDash =
    url.pathname.startsWith("/(dash)/hr") ||
    url.pathname.startsWith("/analysis") ||
    url.pathname.startsWith("/search");

  // If no token, redirect to respective login
  if ((isSuperAdminDash || isCompanyAdminDash || isHRDash) && !token) {
    const redir = isSuperAdminDash
      ? "/super-admin/login"
      : isCompanyAdminDash
      ? "/company-admin/login"
      : "/hr/login";
    return NextResponse.redirect(new URL(redir, req.url));
  }

  // Role mismatch → redirect to correct login
  if (isSuperAdminDash && role !== "super_admin")
    return NextResponse.redirect(new URL("/super-admin/login", req.url));

  if (isCompanyAdminDash && role !== "company_admin")
    return NextResponse.redirect(new URL("/company-admin/login", req.url));

  if (isHRDash && role !== "hr")
    return NextResponse.redirect(new URL("/hr/login", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/super-admin/:path*",
    "/(dash)/company-admin/:path*",
    "/(dash)/hr/:path*",
    "/analysis/:path*",
    "/search/:path*",
  ],
};
