// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Middleware that redirects authenticated users to the dashboard
 * and unauthenticated users away from protected routes.
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client; cookies API differs in middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set(name, value, options);
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;
  // Only login and signup pages should redirect logged-in users to /dashboard.
  // '/pricing' is intentionally not included so authenticated users can view the pricing page.
  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup');

  const isDashboardRoute = pathname.startsWith('/dashboard');

  // Redirect unauthenticated users away from /dashboard
  if (!user && isDashboardRoute) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages to /dashboard
  if (user && isAuthRoute) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/pricing'
  ]
};
