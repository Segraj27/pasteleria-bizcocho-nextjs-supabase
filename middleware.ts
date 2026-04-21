import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // 1. Creamos una respuesta base
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // 2. Inicializamos el cliente de Supabase con el nuevo formato de cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. IMPORTANTE: getUser() repara la sesión si el refresh token falló
  const { data: { user } } = await supabase.auth.getUser();

  // 4. Lógica de protección para /admin
  if (!user && req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return response;
}

// 5. Configuración del Matcher ampliada para incluir las APIs
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",    // 👈 ESTO ES VITAL para Mercado Pago
    "/carrito/:path*"
  ],
};