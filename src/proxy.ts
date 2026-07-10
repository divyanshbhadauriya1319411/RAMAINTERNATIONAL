import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const url = request.nextUrl.clone();

  // If the user wants to access a dashboard path
  if (url.pathname.startsWith("/dashboard")) {
    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    try {
      // Decode JWT payload without verification for routing (verification happens at API level)
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid token format");
      }
      
      // Decode the payload part of the JWT (at index 1)
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      
      const payload = JSON.parse(jsonPayload);

      // Check if token is expired
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");
        return response;
      }

      const role = payload.role;

      // Handle base dashboard path routing
      if (url.pathname === "/dashboard") {
        if (role === "ADMIN") {
          url.pathname = "/dashboard/admin";
        } else if (role === "EMPLOYER") {
          url.pathname = "/dashboard/employer";
        } else if (role === "CANDIDATE") {
          url.pathname = "/dashboard/candidate";
        } else {
          url.pathname = "/login";
        }
        return NextResponse.redirect(url);
      }

      // Restrict role-based access to sub-dashboards
      if (url.pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }

      if (url.pathname.startsWith("/dashboard/employer") && role !== "EMPLOYER") {
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }

      if (url.pathname.startsWith("/dashboard/candidate") && role !== "CANDIDATE") {
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    } catch (error) {
      // Token is corrupt or invalid
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
